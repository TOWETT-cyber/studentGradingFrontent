const API_URL = 'http://localhost:8081/api';

// Reads the backend's {"message": "..."} error if there is one
async function errorMessage(response, fallback) {
    try {
        const data = await response.json();
        return data.message || fallback;
    } catch {
        return fallback;
    }
}

/* ---------- Students ---------- */

export async function getStudents() {
    const response = await fetch(`${API_URL}/students`);

    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }

    return await response.json();
}

export async function addStudent(student) {
    const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    });

    if (!response.ok) {
        throw new Error('Failed to add student');
    }

    return await response.json();
}

export async function deleteStudent(id) {
    const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete student');
    }
}

export async function updateStudent(id, student) {
    const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    });

    if (!response.ok) {
        throw new Error('Failed to update student');
    }

    return await response.json();
}

/* ---------- Grades ---------- */

export async function getGrades() {
    const response = await fetch(`${API_URL}/grades`);

    if (!response.ok) {
        throw new Error('Failed to fetch grades');
    }

    return await response.json();
}

export async function addGrade(grade) {
    const response = await fetch(`${API_URL}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grade),
    });

    if (!response.ok) {
        throw new Error(await errorMessage(response, 'Failed to add grade'));
    }

    return await response.json();
}

export async function deleteGrade(id) {
    const response = await fetch(`${API_URL}/grades/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(await errorMessage(response, 'Failed to delete grade'));
    }
}