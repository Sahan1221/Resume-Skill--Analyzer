"""
V1 learning resource dataset.

The dataset is intentionally stored locally so the application
does not require a paid external learning-resource API.

Resources are mapped to skills used by the role-requirements
dataset.
"""

LEARNING_RESOURCES = [
    {
        "skill": "Algorithms",
        "title": "Algorithms",
        "provider": "MIT OpenCourseWare",
        "url": "https://ocw.mit.edu/search/?q=algorithms",
        "type": "Course",
        "cost_type": "Free",
        "description": (
            "University-level algorithms learning material "
            "covering algorithmic problem solving and analysis."
        ),
    },
    {
        "skill": "Algorithms",
        "title": "Algorithms and Data Structures",
        "provider": "freeCodeCamp",
        "url": "https://www.freecodecamp.org/learn/",
        "type": "Course",
        "cost_type": "Free",
        "description": (
            "Free programming and computer science learning "
            "resources that include algorithms and data structures."
        ),
    },
    {
        "skill": "Debugging",
        "title": "Debugging",
        "provider": "Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/visualstudio/debugger/",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Documentation and tutorials for understanding "
            "debugging workflows and tools."
        ),
    },
    {
        "skill": "Python",
        "title": "Python Tutorial",
        "provider": "Python.org",
        "url": "https://docs.python.org/3/tutorial/",
        "type": "Tutorial",
        "cost_type": "Free",
        "description": (
            "Official Python tutorial covering the fundamentals "
            "of Python programming."
        ),
    },
    {
        "skill": "Java",
        "title": "The Java Tutorials",
        "provider": "Oracle",
        "url": "https://docs.oracle.com/javase/tutorial/",
        "type": "Tutorial",
        "cost_type": "Free",
        "description": (
            "Official Java learning material covering core "
            "Java programming concepts."
        ),
    },
    {
        "skill": "C#",
        "title": "C# Documentation",
        "provider": "Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/dotnet/csharp/",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Official C# documentation and learning resources."
        ),
    },
    {
        "skill": "JavaScript",
        "title": "JavaScript Guide",
        "provider": "MDN Web Docs",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Comprehensive JavaScript guide covering language "
            "fundamentals and common programming concepts."
        ),
    },
    {
        "skill": "TypeScript",
        "title": "TypeScript Handbook",
        "provider": "TypeScript",
        "url": "https://www.typescriptlang.org/docs/handbook/",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Official TypeScript handbook covering the language "
            "and its type system."
        ),
    },
    {
        "skill": "SQL",
        "title": "SQL Tutorial",
        "provider": "W3Schools",
        "url": "https://www.w3schools.com/sql/",
        "type": "Tutorial",
        "cost_type": "Free",
        "description": (
            "Beginner-friendly SQL tutorials and examples."
        ),
    },
    {
        "skill": "Git",
        "title": "Git Documentation",
        "provider": "Git",
        "url": "https://git-scm.com/doc",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Official Git documentation and reference material."
        ),
    },
    {
        "skill": "GitHub",
        "title": "GitHub Skills",
        "provider": "GitHub",
        "url": "https://skills.github.com/",
        "type": "Practice",
        "cost_type": "Free",
        "description": (
            "Interactive exercises for learning GitHub workflows "
            "and development practices."
        ),
    },
    {
        "skill": "REST APIs",
        "title": "REST API Concepts",
        "provider": "MDN Web Docs",
        "url": "https://developer.mozilla.org/en-US/docs/Glossary/REST",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Reference material explaining REST and web API concepts."
        ),
    },
    {
        "skill": "OOP",
        "title": "Object-Oriented Programming",
        "provider": "Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop",
        "type": "Tutorial",
        "cost_type": "Free",
        "description": (
            "Learning material covering object-oriented programming "
            "concepts using C#."
        ),
    },
    {
        "skill": "Data Structures",
        "title": "Data Structures",
        "provider": "GeeksforGeeks",
        "url": "https://www.geeksforgeeks.org/data-structures/",
        "type": "Tutorial",
        "cost_type": "Free",
        "description": (
            "Tutorials and examples covering common data structures."
        ),
    },
    {
        "skill": "Software Testing",
        "title": "Testing Python Code",
        "provider": "Python.org",
        "url": "https://docs.python.org/3/library/unittest.html",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Official documentation for Python's unit testing "
            "framework."
        ),
    },
    {
        "skill": "React",
        "title": "React Learn",
        "provider": "React",
        "url": "https://react.dev/learn",
        "type": "Tutorial",
        "cost_type": "Free",
        "description": (
            "Official React learning materials and tutorials."
        ),
    },
    {
        "skill": "HTML",
        "title": "HTML Guide",
        "provider": "MDN Web Docs",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTML",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Reference and learning material for HTML."
        ),
    },
    {
        "skill": "CSS",
        "title": "CSS Guide",
        "provider": "MDN Web Docs",
        "url": "https://developer.mozilla.org/en-US/docs/Web/CSS",
        "type": "Documentation",
        "cost_type": "Free",
        "description": (
            "Reference and learning material for CSS."
        ),
    },
    {
        "skill": "Databases",
        "title": "Database Systems",
        "provider": "MIT OpenCourseWare",
        "url": "https://ocw.mit.edu/search/?q=database",
        "type": "Course",
        "cost_type": "Free",
        "description": (
            "University-level database learning materials."
        ),
    },
]