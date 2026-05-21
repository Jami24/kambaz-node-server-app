import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    const enrollUserInCourse = (req, res) => {
        const { userId, courseId } = req.params;

        const enrollment = dao.enrollUserInCourse(userId, courseId);

        res.send(enrollment);
    };

    const unenrollUserFromCourse = (req, res) => {
        const { userId, courseId } = req.params;

        const status = dao.unenrollUserFromCourse(userId, courseId);

        res.send(status);
    };

    const findEnrollmentsForUser = (req, res) => {
        const { userId } = req.params;

        const enrollments = dao.findEnrollmentsForUser(userId);

        res.json(enrollments);
    };

    const findAllEnrollments = (req, res) => {
        const enrollments = dao.findAllEnrollments();

        res.json(enrollments);
    };

    app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
    app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
    app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
    app.get("/api/enrollments", findAllEnrollments);
}