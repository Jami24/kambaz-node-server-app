import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { users, enrollments } = db;

export const createUser = (user) => {
    const newUser = {
        ...user,
        _id: uuidv4(),
    };

    users = [...users, newUser];
    db.users = users;

    return newUser;
};

export const findAllUsers = () => users;

export const findUserById = (userId) =>
    users.find((user) => user._id === userId);

export const findUserByUsername = (username) =>
    users.find((user) => user.username === username);

export const findUserByCredentials = (username, password) =>
    users.find(
        (user) =>
            user.username === username &&
            user.password === password
    );

export const findUsersForCourse = (courseId) => {
    return users.filter((user) =>
                            enrollments.some(
                                (enrollment) =>
                                    enrollment.user === user._id &&
                                    enrollment.course === courseId
                            )
    );
};

export const updateUser = (userId, user) => {
    users = users.map((u) =>
                          u._id === userId ? user : u
    );

    db.users = users;

    return users.find((u) => u._id === userId);
};

export const deleteUser = (userId) => {
    users = users.filter((u) => u._id !== userId);
    db.users = users;

    enrollments = enrollments.filter(
        (enrollment) => enrollment.user !== userId
    );
    db.enrollments = enrollments;
};