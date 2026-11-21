Student Grading Management System

Project Overview

The Student Grading Management System is a full-stack application designed to simplify student registration, grade management, and academic record tracking.

The application provides a React-based user interface connected to a Java REST API backend. It uses Hibernate ORM for database operations and PostgreSQL for persistent data storage.

Technologies Used

Backend
- Java 21
- Java HttpServer (REST API)
- Hibernate ORM 6.6.5.Final
- Maven
- PostgreSQL
- Jackson (JSON processing)

Frontend
- React
- JavaScript
- HTML5
- CSS3
- Vite

Development Tools
- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git and GitHub

Main Features

- Student registration
- View all registered students
- Update student information
- Delete student records
- Add grades for students
- View student grades
- Delete grade records
- REST API communication between frontend and backend
- Persistent database storage using PostgreSQL

Project Architecture

The application follows a layered architecture based on MVC and DAO patterns.

```text
Student Grading Management System
│
├── Backend
│   ├── API / Controller Layer
│   ├── Service Layer
│   ├── DAO Layer
│   ├── Model Layer
│   ├── DTO Layer
│   └── Hibernate Configuration
│
├── Frontend
│   ├── React Components
│   ├── Pages
│   └── API Services
│
└── PostgreSQL Database
```

Database

The application uses PostgreSQL to store student and grade records.

Main database entities:
- Students
- Grades

Hibernate ORM manages the relationship between students and their grades.

Installation and Setup

1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/student-grading-management-system.git
```

2. Backend Setup

Navigate to the backend directory (or the project root if `pom.xml` is located there).

Install Maven dependencies:

```bash
mvn clean install
```

Configure your PostgreSQL database connection using your local database credentials.

Run the Java backend application from IntelliJ IDEA.

The API runs on:

```text
http://localhost:8081
```

3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

4. API Endpoints

Base URL:

```text
http://localhost:8081/api/students
```

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | Retrieve all students |
| POST | /api/students | Register a student |
| PUT | /api/students/{id} | Update a student |
| DELETE | /api/students/{id} | Delete a student |

Future Improvements

- Student performance reports
- Grade calculation and grading policies
- Authentication and authorization
- Search and filtering
- Dashboard analytics
- Deployment to cloud hosting

Author

Developed as a software development capstone project.

License

This project is available for educational and learning purposes.
