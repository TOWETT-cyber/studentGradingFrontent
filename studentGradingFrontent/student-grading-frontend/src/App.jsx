import { useState, useEffect } from 'react'
import './App.css'
import {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  getGrades,
  addGrade,
  deleteGrade
} from './services/api'

// Marks -> letter grade (adjust the boundaries to your school's scale)
function letterGrade(marks) {
  if (marks >= 80) return 'A'
  if (marks >= 70) return 'B'
  if (marks >= 60) return 'C'
  if (marks >= 50) return 'D'
  return 'E'
}

function App() {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [updating, setUpdating] = useState(false)

  // Grades state
  const [grades, setGrades] = useState([])
  const [gradingStudentId, setGradingStudentId] = useState(null)
  const [subject, setSubject] = useState('')
  const [marks, setMarks] = useState('')
  const [savingGrade, setSavingGrade] = useState(false)

  // Which page is showing: dashboard | students | grades | reports
  const [view, setView] = useState('dashboard')

  const goTo = (v) => {
    setView(v)
    setGradingStudentId(null)
    setFormError('')
    setSuccess('')
  }

  const titles = {
    dashboard: 'Dashboard',
    students: 'Students',
    grades: 'Grades',
    reports: 'Reports'
  }

  const nameOf = (id) => students.find((s) => s.id === id)?.name ?? `#${id}`

  const gradingStudent = students.find((s) => s.id === gradingStudentId)
  const studentGrades = grades.filter((g) => g.studentId === gradingStudentId)

  const averageOf = (list) =>
      list.length === 0
          ? 0
          : list.reduce((sum, g) => sum + Number(g.marks), 0) / list.length

  // Register a new student
  const handleAddStudent = async (e) => {
    e.preventDefault()

    setSaving(true)
    setFormError('')
    setSuccess('')

    try {
      const student = {
        name: name.trim(),
        email: email.trim()
      }

      await addStudent(student)

      const updatedStudents = await getStudents()
      setStudents(updatedStudents)

      setName('')
      setEmail('')
      setShowForm(false)

      setSuccess('Student registered successfully!')

    } catch (err) {
      console.error('Registration error:', err)
      setFormError(err.message)

    } finally {
      setSaving(false)
    }
  }

  // Delete a student
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student and all their grades?')) return

    setFormError('')
    setSuccess('')

    try {
      await deleteStudent(id)

      setStudents((prev) => prev.filter((s) => s.id !== id))
      setGrades((prev) => prev.filter((g) => g.studentId !== id))

      if (editingId === id) setEditingId(null)
      if (gradingStudentId === id) setGradingStudentId(null)

      setSuccess('Student deleted successfully!')

    } catch (err) {
      console.error('Delete error:', err)
      setFormError(err.message)
    }
  }

  // Start editing a row
  const startEdit = (student) => {
    setEditingId(student.id)
    setEditForm({ name: student.name, email: student.email })
    setFormError('')
    setSuccess('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', email: '' })
  }

  // Save edited student
  const handleSaveEdit = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setFormError('Name and email cannot be empty.')
      return
    }

    setUpdating(true)
    setFormError('')
    setSuccess('')

    try {
      await updateStudent(editingId, {
        name: editForm.name.trim(),
        email: editForm.email.trim()
      })

      const updatedStudents = await getStudents()
      setStudents(updatedStudents)

      setEditingId(null)
      setSuccess('Student updated successfully!')

    } catch (err) {
      console.error('Update error:', err)
      setFormError(err.message)

    } finally {
      setUpdating(false)
    }
  }

  // Open the grades panel for a student
  const openGrades = (student) => {
    setGradingStudentId(student.id)
    setSubject('')
    setMarks('')
    setFormError('')
    setSuccess('')
  }

  // Add a grade for the selected student
  const handleAddGrade = async (e) => {
    e.preventDefault()

    const value = Number(marks)
    if (marks === '' || Number.isNaN(value) || value < 0 || value > 100) {
      setFormError('Marks must be a number between 0 and 100.')
      return
    }

    setSavingGrade(true)
    setFormError('')
    setSuccess('')

    try {
      const saved = await addGrade({
        studentId: gradingStudentId,
        subject: subject.trim(),
        marks: value
      })

      setGrades((prev) => [...prev, saved])
      setSubject('')
      setMarks('')
      setSuccess('Grade added successfully!')

    } catch (err) {
      console.error('Add grade error:', err)
      setFormError(err.message)

    } finally {
      setSavingGrade(false)
    }
  }

  // Delete a grade
  const handleDeleteGrade = async (id) => {
    if (!window.confirm('Delete this grade?')) return

    setFormError('')
    setSuccess('')

    try {
      await deleteGrade(id)
      setGrades((prev) => prev.filter((g) => g.id !== id))
      setSuccess('Grade deleted successfully!')

    } catch (err) {
      console.error('Delete grade error:', err)
      setFormError(err.message)
    }
  }

  // Fetch students and grades when the application loads
  useEffect(() => {
    getStudents()
        .then(data => {
          setStudents(data)
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })

    getGrades()
        .then(setGrades)
        .catch(err => console.error('Could not load grades:', err))
  }, [])

  const renderStudents = (title, list) => (
      <section className="students-section" id="students">

        <div className="section-header">
          <h2>{title} ({list.length})</h2>

          <button
              type="button"
              onClick={() => {
                setShowForm(true)
                setFormError('')
                setSuccess('')
              }}
          >
            Add Student
          </button>
        </div>

        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
          </thead>

          <tbody>
          {loading ? (
              <tr>
                <td colSpan="4">Loading students...</td>
              </tr>
          ) : error ? (
              <tr>
                <td colSpan="4">{error}</td>
              </tr>
          ) : list.length === 0 ? (
              <tr>
                <td colSpan="4">No students found.</td>
              </tr>
          ) : (
              list.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>

                    <td>
                      {editingId === student.id ? (
                          <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, name: e.target.value })
                              }
                          />
                      ) : (
                          student.name
                      )}
                    </td>

                    <td>
                      {editingId === student.id ? (
                          <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, email: e.target.value })
                              }
                          />
                      ) : (
                          student.email
                      )}
                    </td>

                    <td>
                      {editingId === student.id ? (
                          <>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                disabled={updating}
                            >
                              {updating ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={cancelEdit}>
                              Cancel
                            </button>
                          </>
                      ) : (
                          <>
                            <button className="gradeButton" type="button" onClick={() => openGrades(student)}>
                              Grades
                            </button>
                            <button className="editForm" type="button" onClick={() => startEdit(student)}>
                              Edit
                            </button>
                            <button className="deleteForm" type="button" onClick={() => handleDelete(student.id)}>
                              Delete
                            </button>
                          </>
                      )}
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>

      </section>
  )

  const gradesPanel = (
      <>
        {/* Grades Section (shown when a student's Grades button is clicked) */}
        {gradingStudent && (
            <div
                style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1000, padding: '20px'
                }}
                onClick={() => setGradingStudentId(null)}
            >
              <div
                  style={{
                    background: '#fff', color: '#1f2937', borderRadius: '10px',
                    padding: '24px', width: '100%', maxWidth: '640px',
                    maxHeight: '90vh', overflowY: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
              >

                <div className="section-header">
                  <h2>Grades for {gradingStudent.name}</h2>

                  <button type="button" onClick={() => setGradingStudentId(null)}>
                    Close
                  </button>
                </div>

                <form onSubmit={handleAddGrade} className="form-container">
                  <input
                      type="text"
                      placeholder="Subject (e.g. Mathematics)"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                  />

                  <input
                      type="number"
                      placeholder="Marks (0-100)"
                      min="0"
                      max="100"
                      step="0.1"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      required
                  />

                  <button type="submit" disabled={savingGrade}>
                    {savingGrade ? 'Saving...' : 'Add Grade'}
                  </button>
                </form>

                <table>
                  <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Action</th>
                  </tr>
                  </thead>

                  <tbody>
                  {studentGrades.length === 0 ? (
                      <tr>
                        <td colSpan="4">No grades recorded yet.</td>
                      </tr>
                  ) : (
                      studentGrades.map(g => (
                          <tr key={g.id}>
                            <td>{g.subject}</td>
                            <td>{g.marks}</td>
                            <td>{letterGrade(g.marks)}</td>
                            <td>
                              <button type="button" onClick={() => handleDeleteGrade(g.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                      ))
                  )}
                  </tbody>

                  {studentGrades.length > 0 && (
                      <tfoot>
                      <tr>
                        <td><strong>Average</strong></td>
                        <td><strong>{averageOf(studentGrades).toFixed(1)}</strong></td>
                        <td><strong>{letterGrade(averageOf(studentGrades))}</strong></td>
                        <td></td>
                      </tr>
                      </tfoot>
                  )}
                </table>

              </div>
            </div>
        )}
      </>
  )

  return (
      <div className="app">

        {/* Sidebar */}
        <aside className="sidebar">
          <h2>
            Grade<span>System</span>
          </h2>

          <nav>
            {Object.keys(titles).map((key) => (
                <a
                    key={key}
                    href={`#${key}`}
                    className={view === key ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault()
                      goTo(key)
                    }}
                >
                  {titles[key]}
                </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="main-content">

          <header className="topbar">
            <div>
              <h1>{titles[view]}</h1>
              <p>Student Grading Management System</p>
            </div>


          </header>

          {/* Success message */}
          {success && (
              <p className="success">{success}</p>
          )}

          {/* Error message */}
          {formError && (
              <p className="error">{formError}</p>
          )}

          {/* Add Student Form */}
          {showForm && (
              <div className="form-container">

                <h2>Register New Student</h2>

                <form onSubmit={handleAddStudent}>

                  <input
                      type="text"
                      placeholder="Student Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                  />

                  <input
                      type="email"
                      placeholder="Student Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />

                  <button type="submit" disabled={saving}>
                    {saving ? 'Registering...' : 'Register Student'}
                  </button>

                  <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setFormError('')
                      }}
                  >
                    Cancel
                  </button>

                </form>
              </div>
          )}

          {/* Statistics */}
          {view === 'dashboard' && (
              <section className="stats">

                <div
                    className="stat-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => goTo('students')}
                    title="View all students"
                >
                  <h3>Total Students</h3>
                  <h2>{students.length}</h2>
                </div>

                <div className="stat-card">
                  <h3>Total Grades</h3>
                  <h2>{grades.length}</h2>
                </div>

                <div className="stat-card">
                  <h3>Average Marks</h3>
                  <h2>{averageOf(grades).toFixed(1)}%</h2>
                </div>

              </section>
          )}

          {view === 'dashboard' && (
              <>
                {renderStudents('Recent Students', [...students].reverse().slice(0, 5))}
              </>
          )}

          {view === 'students' && (
              <>
                <p className="student-count">
                  Total students: <strong>{students.length}</strong>
                </p>
                {renderStudents('All Student', students)}
              </>
          )}

          {view === 'grades' && (
              <section className="students-section" id="grades">
                <div className="section-header">
                  <h2>All Grades ({grades.length})</h2>
                </div>

                <table>
                  <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                  </tr>
                  </thead>
                  <tbody>
                  {grades.length === 0 ? (
                      <tr>
                        <td colSpan="4">No grades recorded yet. Add them from the Students page.</td>
                      </tr>
                  ) : (
                      grades.map(g => (
                          <tr key={g.id}>
                            <td>{nameOf(g.studentId)}</td>
                            <td>{g.subject}</td>
                            <td>{g.marks}</td>
                            <td>{letterGrade(g.marks)}</td>
                          </tr>
                      ))
                  )}
                  </tbody>
                </table>
              </section>
          )}

          {view === 'reports' && (
              <section className="students-section" id="reports">
                <div className="section-header">
                  <h2>Student Averages</h2>
                </div>

                <table>
                  <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subjects</th>
                    <th>Average</th>
                    <th>Grade</th>
                  </tr>
                  </thead>
                  <tbody>
                  {students.length === 0 ? (
                      <tr>
                        <td colSpan="4">No students found.</td>
                      </tr>
                  ) : (
                      students.map(s => {
                        const list = grades.filter(g => g.studentId === s.id)
                        const avg = averageOf(list)
                        return (
                            <tr key={s.id}>
                              <td>{s.name}</td>
                              <td>{list.length}</td>
                              <td>{list.length ? avg.toFixed(1) : '-'}</td>
                              <td>{list.length ? letterGrade(avg) : '-'}</td>
                            </tr>
                        )
                      })
                  )}
                  </tbody>
                </table>
              </section>
          )}

          {gradesPanel}

        </main>
      </div>
  )
}

export default App