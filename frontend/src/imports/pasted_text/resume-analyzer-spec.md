# RESUME & SKILL ANALYZER — V1 COMPLETE UI/UX SPECIFICATION

## 1. PRODUCT

Design a complete, professional, realistic web application called:

**Resume & Skill Analyzer**

The application is designed primarily for **university students preparing to apply for internships**.

The product helps a student understand:

* whether their resume matches a selected internship/job role
* what skills and requirements are important for that role
* which skills or requirements are missing or weakly demonstrated
* what resume/ATS problems should be fixed
* how the resume can be improved
* what courses/resources can help close skill gaps
* what projects can strengthen the student's profile
* what skills, technologies, projects, and learning areas are currently common for the selected role

This is a serious university software engineering project intended to demonstrate real-world software engineering practices.

Do NOT design this as a generic resume builder or recruiter management system.

The primary user is the **student/job applicant**.

---

# 2. CORE USER JOURNEY

The complete primary workflow must be:

Student
→ Dashboard
→ Start New Analysis
→ Upload CV
→ Select / Enter Target Internship Role
→ Analyze CV
→ Processing
→ Analysis Results
→ Role Requirements
→ Resume-to-Role Match
→ Skill Gaps
→ Resume / ATS Issues
→ Improvement Recommendations
→ Learning Recommendations
→ Project Recommendations
→ Market Insights

The experience must feel like one continuous analysis workflow.

Do NOT make the student navigate through unrelated recruiter features.

---

# 3. V1 FUNCTIONAL REQUIREMENTS

The UI must represent these exact functional requirements.

### FR-01 — CV Upload

The system allows the student to upload a CV.

Requirements:

* PDF only
* maximum file size: 5 MB
* show accepted file type
* show maximum size
* drag-and-drop area
* browse/upload button
* uploaded file name
* file size
* remove/replace file
* validation error for invalid file type
* validation error for files above 5 MB

### FR-02 — Target Role Selection

The student can enter or select the target internship/job role.

Examples:

* Software Engineering Intern
* Frontend Developer Intern
* Backend Developer Intern
* Data Analyst Intern
* QA Engineer Intern
* UI/UX Design Intern

Allow:

* search/select from available roles
* enter a custom role
* clearly show selected target role

### FR-03 — Resume Information Extraction

The system extracts relevant information from the CV.

The UI may show extracted information such as:

* education
* technical skills
* projects
* experience
* certifications
* courses
* relevant achievements

Do not create a standalone "Skills You Already Have" feature as a major output. Existing skills should primarily be shown as evidence used for comparison against the target role.

### FR-04 — Role Requirements Analysis

The system identifies important requirements associated with the selected role.

Display categories such as:

* Technical skills
* Programming languages
* Frameworks/tools
* Soft skills
* Qualifications
* Common technologies
* Relevant experience
* Other role requirements

Clearly distinguish:

* Required / high importance
* Preferred / medium importance
* Additional / lower importance

### FR-05 — Resume-to-Role Comparison

Compare the student's CV against the selected role.

Show:

* overall match percentage
* matched requirements
* partially matched requirements
* missing requirements
* evidence from the resume where appropriate

The match result must be understandable and actionable.

### FR-06 — Skill Gap Analysis

Identify important skills or requirements that are:

* missing
* weakly demonstrated
* insufficiently evidenced

For each gap provide:

* skill/requirement
* gap level
* explanation
* why it matters for the selected role

Do not merely list skills.

### FR-07 — ATS / Keyword Analysis

Analyze resume content for ATS-related and keyword issues.

Show:

* important role keywords
* keywords found
* important keywords missing
* keyword coverage
* formatting/content issues that may affect ATS readability
* actionable suggestions

Do not claim that the system can guarantee ATS acceptance.

### FR-08 — Improvement Recommendations

Provide specific and prioritized recommendations.

Examples:

* strengthen project descriptions
* add measurable outcomes
* improve technical skill evidence
* include relevant keywords naturally
* improve weak sections
* clarify experience
* improve formatting/readability

Each recommendation should explain what the student should actually do.

### FR-09 — Learning Recommendations

Recommend learning resources based on identified gaps.

Each resource can show:

* course/resource title
* provider
* skill covered
* free/paid
* beginner/intermediate/advanced
* estimated learning effort where available
* external link/action

### FR-10 — Project Recommendations

Recommend relevant project ideas based on:

* target role
* identified skill gaps
* student's current profile

Each project can show:

* project title
* description
* skills demonstrated
* difficulty
* why it is useful
* suggested technologies

### FR-11 — Market Insights

Provide current-role insights such as:

* commonly requested skills
* common technologies
* common project areas
* common learning areas
* emerging/relevant skills where data is available

The interface must clearly communicate that market information is based on available data and may change over time.

---

# 4. NON-FUNCTIONAL REQUIREMENTS TO REFLECT IN THE UI

### Performance

Normal UI operations should feel responsive.

Long-running CV parsing/AI analysis may display a processing state.

### Security

The UI must communicate safe file handling.

Show:

* accepted file type
* 5 MB limit
* secure processing messaging where appropriate

### Usability

The interface must be easy for university students to understand.

Avoid unnecessary complexity.

### Reliability

Processing failures must have clear error states and retry actions.

### Privacy

The original uploaded CV should NOT be presented as permanently stored.

Include an appropriate privacy message such as:

"Your CV is processed for analysis. The original file is not permanently stored."

### File Handling

Only PDF CVs up to 5 MB are accepted.

### Scalability

The interface should be designed cleanly for the initial V1 system and should not assume a huge enterprise platform.

---

# 5. REQUIRED SCREENS

Create/design the complete V1 UI using these screens.

## SCREEN 01 — LANDING PAGE

Purpose:
Introduce the product and allow students to begin.

Include:

* product name: Resume & Skill Analyzer
* concise value proposition
* "Analyze My Resume" primary CTA
* secondary login/register CTA
* short explanation of how it works
* Upload CV → Select Role → Analyze → Improve
* privacy/trust messaging
* professional student-focused design

Do not overload the landing page.

---

# SCREEN 02 — LOGIN / REGISTER

Include:

* login
* registration
* email
* password
* appropriate validation/error states
* clear navigation
* password visibility control
* forgot password placeholder if appropriate

Keep authentication simple and professional.

---

# SCREEN 03 — STUDENT DASHBOARD

The dashboard should be student-focused.

Include:

* welcome message
* "Start New Analysis" primary action
* recent analyses
* target role
* analysis date
* match score/status
* quick access to previous results
* useful progress/summary information

Do NOT include recruiter features.

Do NOT include:

* candidate management
* recruiter job posting management
* enterprise HR dashboards

The dashboard should answer:

"What should I do next?"

---

# SCREEN 04 — NEW ANALYSIS

This is one of the most important screens.

Create a clear step-by-step form.

### Step 1 — Upload CV

* drag/drop upload
* browse button
* PDF only
* max 5 MB
* file preview/status
* remove/replace option

### Step 2 — Target Role

* search/select role
* custom role input
* role description/context if appropriate

### Step 3 — Start Analysis

Primary CTA:

**Analyze My Resume**

Show privacy note.

The form should prevent analysis until required information is valid.

---

# SCREEN 05 — ANALYSIS PROCESSING

Create a professional processing screen.

Show the analysis pipeline progressing through stages:

1. Upload validated
2. Extracting resume text
3. Understanding resume sections
4. Identifying skills
5. Analyzing target role
6. Comparing resume with role
7. Checking ATS/keywords
8. Generating recommendations

Use a clear progress indicator.

Do NOT imply that every stage is instantaneous.

Include a helpful message such as:

"Analyzing your resume against the selected role."

Provide appropriate error/retry state.

---

# SCREEN 06 — ANALYSIS RESULTS

This is the MAIN screen of the application.

The results page must have strong information hierarchy.

Top area:

**Target Role**
Software Engineering Intern

Show:

* overall match percentage
* concise summary
* analysis date
* resume filename if appropriate

Then organize the results into clear sections/tabs/anchors:

1. Overview
2. Role Requirements
3. Skill Gaps
4. Resume & ATS Issues
5. Improvements
6. Learning
7. Projects
8. Market Insights

The most important hierarchy should be:

**Match → Gaps → Problems → Actions**

Do NOT make a giant decorative score the main purpose of the page.

---

# SCREEN 07 — ROLE REQUIREMENTS

Show the requirements identified for the selected role.

Sections:

### Technical Skills

Examples:

* Python
* Java
* JavaScript
* SQL

### Frameworks / Tools

Examples:

* React
* Git
* Docker
* REST APIs

### Soft Skills

Examples:

* communication
* teamwork
* problem solving

### Qualifications / Other Requirements

For each requirement show:

* name
* importance
* category
* optional explanation

Use clear status/importance indicators.

---

# SCREEN 08 — RESUME-TO-ROLE MATCH

Show the comparison between the resume and role.

Include:

### Overall Match

Example:
78%

### Matched

Requirements demonstrated in the resume.

### Partially Matched

Requirements with limited evidence.

### Missing

Important requirements not demonstrated.

Where useful, show resume evidence.

The UI should explain the result rather than just displaying a number.

---

# SCREEN 09 — SKILL GAP ANALYSIS

Show the most important gaps.

Each gap should include:

* skill/requirement
* gap level
* explanation
* importance
* suggested action

Example:

Python
"Moderate gap"
"Python is commonly required for this role, but your resume provides limited evidence of using it in a project."

Avoid a simple list of skills.

Prioritize gaps.

---

# SCREEN 10 — RESUME / ATS ISSUES

Show problems detected in the resume.

Categories:

### Content

* vague descriptions
* weak achievement statements
* insufficient evidence
* missing relevant information

### Keywords

* important missing keywords
* weak keyword coverage
* unnecessary keyword repetition

### ATS / Formatting

* potentially difficult-to-parse formatting
* inconsistent headings
* complex layouts where relevant
* unclear section structure

Every issue should have:

* severity
* explanation
* recommended fix

Do not claim guaranteed ATS compatibility.

---

# SCREEN 11 — IMPROVEMENT RECOMMENDATIONS

Show prioritized actions.

Use priority such as:

* High
* Medium
* Low

Each recommendation should contain:

**Problem**
What is wrong.

**Why it matters**
Why the student should care.

**Recommended action**
Exactly what the student should change.

Example:

"Project descriptions are too general."

"Add technologies used and measurable outcomes to demonstrate practical ability."

---

# SCREEN 12 — LEARNING RECOMMENDATIONS

Show courses/resources based on identified skill gaps.

Each item should include:

* course/resource title
* provider
* skill
* difficulty
* free/paid indicator
* short description
* CTA such as "View Resource"

Provide filtering by:

* skill
* free/paid
* difficulty

Do not invent fake course URLs.

---

# SCREEN 13 — PROJECT RECOMMENDATIONS

Show projects that can strengthen the student's profile.

Each project should include:

* title
* description
* target skills
* technologies
* difficulty
* why it helps for the selected role

Example:

"Build a REST API with authentication and PostgreSQL"

Skills:
Python, FastAPI, REST API, PostgreSQL, Authentication

Why:
"Demonstrates backend development and database skills relevant to software engineering internships."

---

# SCREEN 14 — MARKET INSIGHTS

Show role-specific current-market information.

Sections:

### Common Skills

Most frequently associated skills for the role.

### Common Technologies

Relevant tools/frameworks.

### Common Project Areas

Types of projects commonly useful for candidates.

### Learning Areas

What students commonly need to learn.

Include:

* data/source context
* "Updated" indicator where appropriate
* disclaimer that market trends can change

Do not pretend the application has live LinkedIn scraping unless that functionality actually exists.

---

# SCREEN 15 — ANALYSIS HISTORY

Show previous analyses.

Each item:

* target role
* analysis date
* match percentage
* status
* view results action

Allow the student to open previous results.

Do not store/display the original CV as if it were permanently stored.

---

# SCREEN 16 — SETTINGS / PROFILE

Include:

* student profile
* email
* password/security
* preferences
* privacy information
* account actions

Keep it simple.

---

# 6. IMPORTANT UI STATES

The prototype must include realistic states.

### Upload States

* empty
* uploading
* uploaded
* invalid file
* file too large
* upload failure

### Analysis States

* ready
* processing
* completed
* failed
* retry

### Results States

* complete results
* no strong match
* limited resume evidence
* incomplete analysis
* data unavailable

### Recommendation States

* recommendations available
* no recommendation available
* external resource unavailable

Design these states professionally.

---

# 7. DESIGN SYSTEM

IMPORTANT:

**Reuse the existing project's selected colors, typography, spacing, component style, visual language, and design system.**

Do NOT replace the existing established color palette with a new random palette.

Do NOT redesign the application into a completely different visual style.

Maintain visual consistency with the existing modified ATS Resume Analyzer UI.

If the existing project already has:

* primary color
* secondary color
* typography
* buttons
* cards
* navigation
* sidebar
* input fields
* badges
* progress indicators
* charts
* icons

reuse and refine them.

Only modify them when required to support our V1 requirements.

The final product should look like one coherent application.

---

# 8. VISUAL STYLE

The design should feel:

* professional
* modern
* clean
* trustworthy
* student-friendly
* technology-focused
* practical
* production-oriented

Avoid:

* excessive gradients
* excessive glassmorphism
* excessive animations
* unnecessary decorative cards
* oversized illustrations
* excessive empty space
* complicated dashboards
* flashy AI effects
* meaningless statistics

Prioritize usability and information hierarchy.

This is a real software product, not a Dribbble concept.

---

# 9. NAVIGATION

Use a simple student-focused navigation.

Recommended:

Dashboard
New Analysis
Analysis History
Learning
Projects
Market Insights
Settings

The active page must be clearly indicated.

The student should always be able to:

* start a new analysis
* return to dashboard
* view previous analyses

---

# 10. RESULTS INFORMATION ARCHITECTURE

The Analysis Results experience is the most important part of the application.

Use this hierarchy:

### LEVEL 1

Target role + overall match

### LEVEL 2

Role requirements
Skill gaps
Resume/ATS issues

### LEVEL 3

Specific improvement recommendations

### LEVEL 4

Learning recommendations
Project recommendations
Market insights

The application should answer these questions in order:

1. "How well does my resume fit this role?"
2. "What does this role require?"
3. "What am I missing?"
4. "What is wrong with my resume?"
5. "What should I fix?"
6. "What should I learn?"
7. "What projects should I build?"
8. "What is currently relevant in this field?"

---

# 11. ARCHITECTURE REPRESENTATION

The UI should be designed so that it can map cleanly to this selected system architecture:

Student
↓
Frontend / UI
↓ HTTP/HTTPS
Backend / REST API
↓
Analysis Orchestration
↓
Resume Analysis Pipeline

Resume Analysis Pipeline:

PDF Text Extraction
↓
Resume Parser
↓
Structured Resume Data
↓
Skill Extraction
↓
Role Requirements Analysis
↓
Resume-to-Role Matching
↓
Skill Gap Analysis
↓
ATS / Resume Analysis
↓
Recommendation Engine

Backend also connects to:

Role / Market Data Service
↓
Skills
Requirements
Market Data

Database stores:

Users
Roles
Skills
Role-Skill relationships
Analysis results
Skill gaps
Recommendations
Learning resources
Project recommendations

The original uploaded CV is processed temporarily and is NOT permanently stored.

---

# 12. DATABASE-AWARE UI

The UI should support data represented by these entities:

User
Role
Skill
RoleSkill
Analysis
SkillGap
Recommendation
LearningResource
ProjectRecommendation

Do not design features that require unrelated entities such as recruiters, candidates, job-posting management, or enterprise HR workflows.

---

# 13. REMOVE / AVOID FROM THE ORIGINAL ATS TEMPLATE

If these exist in the current template, remove, hide, or repurpose them:

* Candidate Management
* Recruiter dashboard
* Job Posting Management
* Enterprise recruiter analytics
* Hiring pipeline
* Candidate ranking
* Recruiter-only workflows

They are NOT part of V1.

The system is primarily a student resume and skill analysis platform.

---

# 14. DO NOT CREATE A STANDALONE "SKILLS I HAVE" PAGE

Existing skills are important, but they are evidence for:

Resume-to-Role Matching
Skill Gap Analysis
Recommendations

Do not waste a major dashboard section or page on simply listing:

"Your Skills:
Python, Java, Git..."

Instead show skills in context:

Python — Required for role — Evidence found — Gap status

---

# 15. ACCESSIBILITY AND USABILITY

Use:

* readable typography
* clear labels
* sufficient contrast
* obvious primary actions
* understandable error messages
* keyboard-friendly controls
* consistent spacing
* meaningful icons with labels where necessary
* responsive layouts

Do not rely only on color to communicate status.

---

# 16. RESPONSIVE DESIGN

Design for:

* Desktop
* Laptop
* Tablet
* Mobile where practical

The primary experience is desktop/laptop because students will likely upload and analyze resumes there, but the interface should remain responsive.

---

# 17. PROTOTYPE INTERACTIONS

Create realistic prototype connections.

At minimum:

Landing
→ Login/Register

Dashboard
→ New Analysis

New Analysis
→ Upload CV
→ Select Role
→ Analyze

Analyze
→ Processing

Processing
→ Analysis Results

Results
→ Role Requirements
→ Skill Gaps
→ Resume/ATS Issues
→ Improvements
→ Learning
→ Projects
→ Market Insights

Analysis History
→ Previous Results

Settings
→ Profile/Privacy

Buttons should lead to appropriate screens.

---

# 18. SAMPLE DATA

Use realistic sample data for the prototype.

Example target role:

**Software Engineering Intern**

Example requirements:

High Importance:

* Programming fundamentals
* Git
* Data structures
* Problem solving

Common technologies:

* Python
* Java
* JavaScript
* SQL
* React
* REST APIs

Example skill gaps:

* Docker — Missing
* REST API development — Weak evidence
* Testing — Limited evidence

Example recommendation:

"Add a backend project demonstrating REST API development, authentication, database integration, and automated testing."

Use realistic data, but clearly treat it as prototype/demo data.

Do not present fabricated market statistics as real statistics.

---

# 19. COMPONENT CONSISTENCY

Create/reuse consistent components for:

* buttons
* inputs
* dropdowns
* upload areas
* cards
* badges
* tabs
* progress indicators
* alerts
* tables/lists
* skill indicators
* recommendation blocks
* navigation
* modal/dialog
* empty states
* error states

Do not create a completely different component style for each page.

---

# 20. FINAL QUALITY REQUIREMENT

The final Figma design should look like a complete V1 product that could realistically be implemented using:

Frontend:
React

Backend:
Python + FastAPI

Analysis:
Python-based resume processing/NLP/AI components

Database:
PostgreSQL

API:
REST

Testing:
Pytest + frontend testing

CI/CD:
GitHub Actions

Deployment:
Docker + cloud deployment

The Figma design must NOT imply functionality that is outside this V1.

Focus on a coherent, implementable student-focused Resume & Skill Analyzer.

## FINAL PRODUCT FLOW

Landing
↓
Authentication
↓
Student Dashboard
↓
New Analysis
↓
Upload PDF CV
↓
Select Target Internship Role
↓
Analyze
↓
Processing
↓
Analysis Results
├── Match Overview
├── Role Requirements
├── Skill Gaps
├── Resume / ATS Issues
├── Improvement Recommendations
├── Learning Recommendations
├── Project Recommendations
└── Market Insights
↓
Analysis History
↓
Future analyses

Maintain the existing project's selected colors, typography, spacing, and established visual language throughout the entire experience.

Do not introduce unnecessary features.

Do not turn this into a recruiter platform.

Design the complete V1 as a polished, realistic, implementation-ready student product.
