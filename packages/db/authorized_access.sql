-- Create the authorized_access table
CREATE TABLE IF NOT EXISTS authorized_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('student', 'teacher', 'volunteer', 'parent')) NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Add some initial authorized users
INSERT INTO authorized_access (email, role) VALUES
    ('apolloacademyaiteacher@gmail.com', 'teacher'),
    ('test@example.com', 'student'),
    ('robin@apollo.edu', 'student'),
    ('teacher@apollo.edu', 'teacher'),
    ('parent@apollo.edu', 'parent');

-- View all authorized users
SELECT * FROM authorized_access;
