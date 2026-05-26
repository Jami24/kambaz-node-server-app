import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
    function findAllCourses() {
        return model.find();
    }

    async function findCoursesForEnrolledUser(userId) {
        const { enrollments } = db;

        const courseIds = enrollments
            .filter((enrollment) => enrollment.user === userId)
            .map((enrollment) => enrollment.course);

        return model.find({ _id: { $in: courseIds } });
    }

    function createCourse(course) {
        const newCourse = {
            ...course,
            _id: uuidv4(),
        };

        return model.create(newCourse);
    }

    function deleteCourse(courseId) {
        const { enrollments } = db;

        db.enrollments = enrollments.filter(
            (enrollment) => enrollment.course !== courseId
        );

        return model.deleteOne({ _id: courseId });
    }

    function updateCourse(courseId, courseUpdates) {
        return model.updateOne(
            { _id: courseId },
            { $set: courseUpdates }
        );
    }

    return {
        findAllCourses,
        findCoursesForEnrolledUser,
        createCourse,
        deleteCourse,
        updateCourse,
    };
}