# Requirements Document

## Introduction

Enhance the student-facing application flow by integrating the "already applied" check on university detail pages, displaying submitted applications on the profile page, and enriching the application detail page with full form data, timeline events, and stage-specific actions.

## Glossary

- **Student**: An authenticated user with the STUDENT role who applies to universities
- **Application_Check_API**: The `GET /student/applications/check/:universityId` endpoint that returns whether a student has already applied
- **Application_Detail_Page**: The page at `/student/applications/:id` showing full application information
- **Profile_Page**: The student dashboard at `/student/profile` showing progress and quick actions
- **University_Detail_Page**: The page at `/student/university/:slug` showing university info and the apply form
- **Timeline_API**: The `GET /timeline/application/:applicationId` endpoint returning stage events
- **Stage_Actions**: Context-specific buttons (pay, view letter, check exam) based on the application's current stage

## Requirements

### Requirement 1: Already-Applied Check on University Detail Page

**User Story:** As a student, I want to see my existing application status when I revisit a university page, so that I don't accidentally try to apply again.

#### Acceptance Criteria

1. WHEN a student visits a University_Detail_Page, THE Application_Check_API SHALL be called with the university ID to determine if the student has already applied
2. WHILE the Application_Check_API returns `applied: true`, THE University_Detail_Page SHALL display the existing application status and a link to the application detail instead of the apply form
3. WHILE the Application_Check_API returns `applied: false`, THE University_Detail_Page SHALL display the apply form as normal
4. WHILE the student is not authenticated, THE University_Detail_Page SHALL display a prompt to login before applying
5. IF the Application_Check_API call fails, THEN THE University_Detail_Page SHALL fall back to showing the apply form with appropriate error handling

### Requirement 2: Applications Section on Profile Page

**User Story:** As a student, I want to see my submitted applications on my profile/dashboard page, so that I can quickly access and track them.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a section listing all submitted applications with university name, program, status badge, and submission date
2. WHEN a student clicks on an application in the list, THE Profile_Page SHALL navigate to the Application_Detail_Page for that application
3. WHEN the student has no applications, THE Profile_Page SHALL display an empty state with a call-to-action to browse universities
4. THE Profile_Page SHALL display applications sorted by submission date in descending order (most recent first)

### Requirement 3: Enhanced Application Detail Page

**User Story:** As a student, I want to see the full details of my application including submitted form data, timeline, and available actions, so that I can track my progress and take next steps.

#### Acceptance Criteria

1. THE Application_Detail_Page SHALL display the complete submitted form data including personal information, address, language abilities, and selected program
2. THE Application_Detail_Page SHALL display a timeline of events fetched from the Timeline_API for that application
3. WHEN the application is at a stage with available actions (payment, letter download, exam info), THE Application_Detail_Page SHALL display Stage_Actions as contextual buttons
4. THE Application_Detail_Page SHALL display the university information including name, location, and contact details
5. IF the Timeline_API call fails, THEN THE Application_Detail_Page SHALL still display the application data without the timeline section

### Requirement 4: Application Status Display

**User Story:** As a student, I want clear visual indicators of my application status, so that I can understand where I am in the process at a glance.

#### Acceptance Criteria

1. THE system SHALL display application status using color-coded badges (pending=yellow, in_review=blue, approved=green, rejected=red)
2. THE system SHALL display the current stage number and name alongside the application status
3. WHEN an application is approved, THE system SHALL display the next required action for the student
