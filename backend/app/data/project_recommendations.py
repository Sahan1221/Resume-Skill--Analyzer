"""
V1 project recommendation dataset.

Projects are mapped to skills that are relevant to the
supported internship roles.

The dataset is local so the core recommendation system
does not depend on a paid external API.
"""

PROJECT_RECOMMENDATIONS = [
    {
        "skill": "Algorithms",
        "title": "Algorithm Visualization Platform",
        "description": (
            "Build a web application that visualizes common algorithms "
            "such as sorting, searching, and graph traversal. Allow users "
            "to provide input and observe how each algorithm progresses."
        ),
        "skills_demonstrated": [
            "Algorithms",
            "Data Structures",
            "JavaScript",
            "React",
            "Problem Solving",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates algorithmic problem solving and software "
            "development skills relevant to software engineering internships."
        ),
    },
    {
        "skill": "Algorithms",
        "title": "Algorithm Practice and Analysis Tool",
        "description": (
            "Create an application containing common algorithmic problems "
            "with test cases, solution validation, and basic time-complexity "
            "analysis."
        ),
        "skills_demonstrated": [
            "Algorithms",
            "Data Structures",
            "Problem Solving",
            "Software Testing",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Provides practical evidence of algorithmic problem solving "
            "and testing."
        ),
    },
    {
        "skill": "Debugging",
        "title": "Automated Testing and Debugging Lab",
        "description": (
            "Build a small application containing intentionally introduced "
            "bugs, automated tests, logging, and a debugging workflow for "
            "finding and fixing the problems."
        ),
        "skills_demonstrated": [
            "Debugging",
            "Software Testing",
            "Python",
            "Pytest",
            "Logging",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates practical testing and debugging activities "
            "that are relevant to software development."
        ),
    },
    {
        "skill": "Python",
        "title": "Python REST API Application",
        "description": (
            "Develop a REST API using Python with authentication, "
            "database operations, validation, automated tests, and "
            "documented API endpoints."
        ),
        "skills_demonstrated": [
            "Python",
            "REST APIs",
            "Databases",
            "Software Testing",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates backend development and API development "
            "skills for software engineering roles."
        ),
    },
    {
        "skill": "Java",
        "title": "Java Task Management API",
        "description": (
            "Create a backend task-management system using Java with "
            "CRUD operations, database persistence, validation, and "
            "automated tests."
        ),
        "skills_demonstrated": [
            "Java",
            "REST APIs",
            "SQL",
            "Databases",
            "Software Testing",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Provides practical evidence of Java backend development "
            "and database integration."
        ),
    },
    {
        "skill": "C#",
        "title": "C# Inventory Management API",
        "description": (
            "Develop a backend inventory system using C# with product "
            "management, database operations, validation, API endpoints, "
            "and automated tests."
        ),
        "skills_demonstrated": [
            "C#",
            ".NET",
            "REST APIs",
            "SQL",
            "Software Testing",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates practical C# development, API design, and "
            "database integration."
        ),
    },
    {
        "skill": "JavaScript",
        "title": "Full-Stack Task Management Application",
        "description": (
            "Build a full-stack task management application with a "
            "JavaScript frontend, backend API, database persistence, "
            "validation, and testing."
        ),
        "skills_demonstrated": [
            "JavaScript",
            "REST APIs",
            "Databases",
            "HTML",
            "CSS",
            "Software Testing",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates practical web development and integration "
            "between frontend and backend components."
        ),
    },
    {
        "skill": "TypeScript",
        "title": "TypeScript Developer Dashboard",
        "description": (
            "Create a dashboard application using TypeScript with "
            "API integration, reusable components, filtering, "
            "validation, and error handling."
        ),
        "skills_demonstrated": [
            "TypeScript",
            "React",
            "REST APIs",
            "Web Development",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates typed frontend development and API integration."
        ),
    },
    {
        "skill": "SQL",
        "title": "Database-Driven Student Management System",
        "description": (
            "Develop a system for managing students, courses, grades, "
            "and enrollments using a relational database with properly "
            "designed tables, relationships, queries, and validation."
        ),
        "skills_demonstrated": [
            "SQL",
            "Relational Databases",
            "Database Design",
            "CRUD Operations",
        ],
        "difficulty": "Beginner",
        "role_relevance": (
            "Demonstrates practical relational database design and SQL usage."
        ),
    },
    {
        "skill": "Git",
        "title": "Collaborative Open-Source Style Project",
        "description": (
            "Create a software project using a structured Git workflow "
            "with branches, pull requests, issue tracking, meaningful "
            "commits, and release documentation."
        ),
        "skills_demonstrated": [
            "Git",
            "GitHub",
            "Version Control",
            "Collaboration",
        ],
        "difficulty": "Beginner",
        "role_relevance": (
            "Provides practical evidence of version control and "
            "collaborative development practices."
        ),
    },
    {
        "skill": "REST APIs",
        "title": "Public API Integration Platform",
        "description": (
            "Build a web application that consumes a public API, "
            "handles API errors, validates responses, caches appropriate "
            "data, and presents useful information to users."
        ),
        "skills_demonstrated": [
            "REST APIs",
            "HTTP",
            "JSON",
            "Error Handling",
            "Web Development",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates practical API integration and web application "
            "development."
        ),
    },
    {
        "skill": "OOP",
        "title": "Object-Oriented Library Management System",
        "description": (
            "Build a library management application using clear "
            "object-oriented design with classes, inheritance where "
            "appropriate, encapsulation, validation, and persistence."
        ),
        "skills_demonstrated": [
            "OOP",
            "Software Design",
            "Programming",
            "Databases",
        ],
        "difficulty": "Beginner",
        "role_relevance": (
            "Provides practical evidence of object-oriented programming "
            "and software design."
        ),
    },
    {
        "skill": "Data Structures",
        "title": "Data Structure Visualizer",
        "description": (
            "Create an interactive application that demonstrates "
            "operations on arrays, linked lists, stacks, queues, trees, "
            "or other common data structures."
        ),
        "skills_demonstrated": [
            "Data Structures",
            "Algorithms",
            "JavaScript",
            "Problem Solving",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates understanding of core computer science "
            "concepts through an interactive software project."
        ),
    },
    {
        "skill": "Software Testing",
        "title": "Test Automation Dashboard",
        "description": (
            "Create a small application with automated unit and "
            "integration tests and a dashboard that displays test "
            "results and failures."
        ),
        "skills_demonstrated": [
            "Software Testing",
            "Unit Testing",
            "Integration Testing",
            "Automation",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Provides practical evidence of automated software testing."
        ),
    },
    {
        "skill": "React",
        "title": "Internship Application Tracker",
        "description": (
            "Build a React application that allows students to track "
            "internship applications, application status, interview "
            "dates, notes, and follow-up tasks."
        ),
        "skills_demonstrated": [
            "React",
            "JavaScript",
            "REST APIs",
            "State Management",
            "UI Development",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates practical frontend development and application "
            "state management."
        ),
    },
    {
        "skill": "HTML",
        "title": "Accessible Student Portfolio Website",
        "description": (
            "Create a responsive portfolio website with semantic HTML, "
            "accessible navigation, project sections, contact information, "
            "and responsive layouts."
        ),
        "skills_demonstrated": [
            "HTML",
            "CSS",
            "Accessibility",
            "Responsive Design",
        ],
        "difficulty": "Beginner",
        "role_relevance": (
            "Demonstrates practical web development fundamentals."
        ),
    },
    {
        "skill": "CSS",
        "title": "Responsive Portfolio Design System",
        "description": (
            "Create a responsive portfolio interface with reusable "
            "layout components, responsive breakpoints, forms, cards, "
            "navigation, and accessibility considerations."
        ),
        "skills_demonstrated": [
            "CSS",
            "HTML",
            "Responsive Design",
            "UI Development",
        ],
        "difficulty": "Beginner",
        "role_relevance": (
            "Demonstrates practical frontend styling and responsive "
            "web design skills."
        ),
    },
    {
        "skill": "Databases",
        "title": "Multi-Table Inventory Database System",
        "description": (
            "Design and implement a relational inventory database with "
            "products, suppliers, categories, transactions, and reporting "
            "queries."
        ),
        "skills_demonstrated": [
            "Databases",
            "SQL",
            "Database Design",
            "Relationships",
        ],
        "difficulty": "Intermediate",
        "role_relevance": (
            "Demonstrates relational database design and practical SQL use."
        ),
    },
]   