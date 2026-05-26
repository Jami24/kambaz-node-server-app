import * as dao from "./dao.js";
import CoursesDao from "../Courses/dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app, db) {
    const courseDao = CoursesDao(db);
    const enrollmentsDao = EnrollmentsDao(db);

    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };

    const deleteUser = async (req, res) => {
        const { userId } = req.params;
        const status = await dao.deleteUser(userId);
        res.json(status);
    };

    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;

        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }

        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }

        const users = await dao.findAllUsers();
        res.json(users);
    };

    const findUserById = async (req, res) => {
        const { userId } = req.params;
        const user = await dao.findUserById(userId);
        res.json(user);
    };

    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const userUpdates = req.body;

        await dao.updateUser(userId, userUpdates);

        const currentUser = req.session["currentUser"];

        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = {
                ...currentUser,
                ...userUpdates,
            };
        }

        res.json(req.session["currentUser"]);
    };

    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);

        if (user) {
            res.status(400).json({
                                     message: "Username already taken",
                                 });
            return;
        }

        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = async (req, res) => {
        const { username, password } = req.body;

        const currentUser = await dao.findUserByCredentials(
            username,
            password
        );

        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({
                                     message: "Unable to login. Try again later.",
                                 });
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];

        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        res.json(currentUser);
    };

    const findCoursesForUser = async (req, res) => {
        const currentUser = req.session["currentUser"];

        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        if (currentUser.role === "ADMIN") {
            const courses = await courseDao.findAllCourses();
            res.json(courses);
            return;
        }

        let { userId } = req.params;

        if (userId === "current") {
            userId = currentUser._id;
        }

        const courses = await enrollmentsDao.findCoursesForUser(userId);
        res.json(courses);
    };

    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;

        if (uid === "current") {
            const currentUser = req.session["currentUser"];

            if (!currentUser) {
                res.sendStatus(401);
                return;
            }

            uid = currentUser._id;
        }

        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.json(status);
    };

    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;

        if (uid === "current") {
            const currentUser = req.session["currentUser"];

            if (!currentUser) {
                res.sendStatus(401);
                return;
            }

            uid = currentUser._id;
        }

        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.json(status);
    };

    const findEnrollmentsForUser = async (req, res) => {
        const { userId } = req.params;

        const enrollments = await enrollmentsDao.findEnrollmentsForUser(userId);

        res.json(enrollments);
    };

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);

    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);

    app.get("/api/users/:userId/courses", findCoursesForUser);

    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
    app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
}