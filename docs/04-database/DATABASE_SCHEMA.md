# LMS Platform Database Schema

## 1. Overview

This document specifies the database schema for the Medical Admission Management Platform. The schema is designed using PostgreSQL with Prisma ORM and follows normalization principles for data integrity.

## 2. Database Structure

### 2.1 User and Authentication Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### roles
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### user_roles
```sql
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);
```

#### refresh_tokens
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### otp_verifications
```sql
CREATE TABLE otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Admission Workflow Tables

#### students
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id),
    personal_details JSONB,
    emergency_contact JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### applications
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id),
    course_id UUID REFERENCES university_courses(id),
    current_stage INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### application_stages
```sql
CREATE TABLE application_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sequence_number INTEGER UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### stage_requirements
```sql
CREATE TABLE stage_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID REFERENCES application_stages(id),
    document_type_id UUID REFERENCES document_types(id),
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### document_types
```sql
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    file_extensions JSONB,
    max_file_size INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### student_documents
```sql
CREATE TABLE student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    document_type_id UUID REFERENCES document_types(id),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    remarks TEXT,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### document_verifications
```sql
CREATE TABLE document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES student_documents(id) ON DELETE CASCADE,
    verified_by UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    remarks TEXT,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Payments Tables

#### payment_stages
```sql
CREATE TABLE payment_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES application_stages(id),
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### payments
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    payment_stage_id UUID REFERENCES payment_stages(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### payment_webhook_events
```sql
CREATE TABLE payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Universities and Courses

#### universities
```sql
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    logo_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### university_courses
```sql
CREATE TABLE university_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    fee DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### student_universities
```sql
CREATE TABLE student_universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.5 Letters and Visa Support

#### letters
```sql
CREATE TABLE letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    letter_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'generated',
    issued_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### visa_centers
```sql
CREATE TABLE visa_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### visa_checklists
```sql
CREATE TABLE visa_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visa_center_id UUID REFERENCES visa_centers(id),
    document_type_id UUID REFERENCES document_types(id),
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### visa_support_requests
```sql
CREATE TABLE visa_support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    visa_center_id UUID REFERENCES visa_centers(id),
    status VARCHAR(50) DEFAULT 'pending',
    documents_required JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.6 System Tables

#### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    notification_type VARCHAR(50),
    related_entity_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### settings
```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.7 AI Tables

#### ai_requests
```sql
CREATE TABLE ai_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    model VARCHAR(100),
    prompt TEXT NOT NULL,
    response JSONB,
    token_usage JSONB,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### ai_document_results
```sql
CREATE TABLE ai_document_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES student_documents(id) ON DELETE CASCADE,
    ai_request_id UUID REFERENCES ai_requests(id),
    document_type VARCHAR(100),
    confidence DECIMAL(3,2),
    extracted_fields JSONB,
    flags JSONB,
    recommended_action VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### ai_validation_flags
```sql
CREATE TABLE ai_validation_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ai_document_result_id UUID REFERENCES ai_document_results(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Indexes

### 3.1 Performance Indexes

```sql
-- User-related indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Student-related indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_application_id ON students(application_id);

-- Application-related indexes
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_university_id ON applications(university_id);
CREATE INDEX idx_applications_course_id ON applications(course_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_current_stage ON applications(current_stage);

-- Document-related indexes
CREATE INDEX idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX idx_student_documents_application_id ON student_documents(application_id);
CREATE INDEX idx_student_documents_document_type_id ON student_documents(document_type_id);
CREATE INDEX idx_student_documents_status ON student_documents(status);

-- Payment-related indexes
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_application_id ON payments(application_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);

-- Notification-related indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Audit log indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## 4. Relationships

### 4.1 One-to-Many Relationships

- Users ↔ Roles (many-to-many through user_roles)
- Students ↔ Applications (one-to-one)
- Applications ↔ Documents (one-to-many)
- Applications ↔ Payments (one-to-many)
- Applications ↔ Letters (one-to-many)
- Applications ↔ Visa Support Requests (one-to-many)
- Students ↔ Documents (one-to-many)
- Students ↔ Payments (one-to-many)
- Students ↔ Letters (one-to-many)
- Students ↔ Visa Support Requests (one-to-many)
- Universities ↔ Courses (one-to-many)
- Universities ↔ Student Universities (one-to-many)
- Visa Centers ↔ Visa Checklists (one-to-many)

### 4.2 Many-to-Many Relationships

- Users ↔ Roles (through user_roles)
- Applications ↔ Stage Requirements (through stage_requirements)

## 5. Constraints

### 5.1 Unique Constraints

- Users.email must be unique
- Roles.name must be unique
- Document Types.name must be unique
- Universities.name must be unique

### 5.2 Check Constraints

```sql
-- Ensure positive amounts
ALTER TABLE payments ADD CONSTRAINT chk_payments_amount CHECK (amount >= 0);
ALTER TABLE university_courses ADD CONSTRAINT chk_courses_fee CHECK (fee >= 0);
ALTER TABLE payment_stages ADD CONSTRAINT chk_payment_stages_amount CHECK (amount >= 0);

-- Ensure valid statuses
ALTER TABLE applications ADD CONSTRAINT chk_applications_status CHECK (status IN ('draft', 'submitted', 'approved', 'rejected'));
ALTER TABLE student_documents ADD CONSTRAINT chk_documents_status CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE payments ADD CONSTRAINT chk_payments_status CHECK (status IN ('pending', 'success', 'failed', 'refunded', 'manually_approved'));
ALTER TABLE letters ADD CONSTRAINT chk_letters_status CHECK (status IN ('generated', 'sent'));
ALTER TABLE visa_support_requests ADD CONSTRAINT chk_visa_requests_status CHECK (status IN ('pending', 'processing', 'approved', 'rejected'));
```

## 6. Triggers

### 6.1 Timestamp Updates

```sql
-- Automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_documents_updated_at BEFORE UPDATE ON student_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 7. Views

### 7.1 Application Summary View

```sql
CREATE VIEW application_summary AS
SELECT 
    a.id AS application_id,
    s.id AS student_id,
    u.name AS university_name,
    uc.name AS course_name,
    a.current_stage,
    a.status,
    a.created_at,
    a.updated_at
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN universities u ON a.university_id = u.id
JOIN university_courses uc ON a.course_id = uc.id;
```

### 7.2 Document Verification View

```sql
CREATE VIEW document_verification_status AS
SELECT 
    d.id AS document_id,
    d.file_name,
    d.status,
    d.remarks,
    d.verified_at,
    u.first_name || ' ' || u.last_name AS verified_by_name,
    d.created_at
FROM student_documents d
LEFT JOIN document_verifications dv ON d.id = dv.document_id
LEFT JOIN users u ON dv.verified_by = u.id;
```

## 8. Sample Data

### 8.1 Default Roles

```sql
INSERT INTO roles (name, description) VALUES
('student', 'Student user'),
('admin', 'Administrator user'),
('university', 'University representative');
```

### 8.2 Application Stages

```sql
INSERT INTO application_stages (name, description, sequence_number) VALUES
('Initial Admission Application', 'Submit initial application details', 1),
('Entrance Exam Process', 'Complete entrance exam requirements', 2),
('Admission Letter and Exam Dashboard', 'Receive admission letter and access exam dashboard', 3),
('Invitation Letter Process', 'Receive invitation letter for visa application', 4),
('Visa Support', 'Apply for visa with support documentation', 5);
```

### 8.3 Document Types

```sql
INSERT INTO document_types (name, description, file_extensions, max_file_size) VALUES
('Passport', 'Passport copy', '["jpg", "jpeg", "png", "pdf"]', 10485760),
('Academic Transcript', 'Academic transcript from previous institution', '["pdf", "doc", "docx"]', 5242880),
('Birth Certificate', 'Birth certificate', '["jpg", "jpeg", "png", "pdf"]', 10485760),
('Medical Certificate', 'Medical certificate', '["jpg", "jpeg", "png", "pdf"]', 10485760);
```

This database schema provides a solid foundation for the Medical Admission Management Platform with proper normalization, relationships, constraints, and performance optimizations.