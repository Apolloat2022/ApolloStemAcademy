
export class GoogleClassroomService {
    async getCourses(token: string) {
        const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch courses');
        return await res.json();
    }

    async getCourseWork(token: string, courseId: string) {
        const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch coursework');
        return await res.json();
    }

    // Helper to sync for a student
    async syncStudentCourses(env: any, token: string, studentId: string) {
        const courses = await this.getCourses(token);

        let syncedCount = 0;
        if (courses.courses && courses.courses.length > 0) {
            for (const course of courses.courses) {
                // 1. Sync Class (Upsert)
                await env.DB.prepare('INSERT OR IGNORE INTO classes (id, name, section, subject) VALUES (?, ?, ?, ?)').bind(course.id, course.name, course.section || 'General', 'General').run();

                // 2. Enroll Student
                await env.DB.prepare('INSERT OR IGNORE INTO enrollments (student_id, class_id) VALUES (?, ?)').bind(studentId, course.id).run();

                // 3. Sync CourseWork
                const work = await this.getCourseWork(token, course.id);
                if (work.courseWork) {
                    for (const w of work.courseWork) {
                        await env.DB.prepare('INSERT OR IGNORE INTO assignments (id, class_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)').bind(w.id, course.id, `[GC] ${w.title}`, w.description || 'Imported from Google Classroom', w.dueDate ? `${w.dueDate.year}-${w.dueDate.month}-${w.dueDate.day}` : 'No Due Date').run();
                        syncedCount++;
                    }
                }
            }
        }
        return { success: true, count: syncedCount };
    }
}
export const googleClassroom = new GoogleClassroomService();
