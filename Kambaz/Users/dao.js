import model from "./model.js";
import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { enrollments } = db;

export const createUser = (user) => {
    const newUser = {
        ...user,
        _id: uuidv4(),
    };

    return model.create(newUser);
};

export const findAllUsers = () => {
    return model.find();
};

export const findUserById = (userId) => {
    return model.findById(userId);
};

export const findUserByUsername = (username) => {
    return model.findOne({ username: username });
};

export const findUserByCredentials = (username, password) => {
    return model.findOne({
                             username: username,
                             password: password,
                         });
};

export const findUsersForCourse = (courseId) => {
    const userIds = enrollments
        .filter((enrollment) => enrollment.course === courseId)
        .map((enrollment) => enrollment.user);

    return model.find({ _id: { $in: userIds } });
};

export const updateUser = (userId, user) => {
    return model.updateOne(
        { _id: userId },
        { $set: user }
    );
};

export const deleteUser = (userId) => {
    enrollments = enrollments.filter(
        (enrollment) => enrollment.user !== userId
    );

    db.enrollments = enrollments;

    return model.deleteOne({ _id: userId });
};

export const findUsersByRole = (role) => {
    return model.find({ role: role });
};

export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i");

    return model.find({
                          $or: [
                              { firstName: { $regex: regex } },
                              { lastName: { $regex: regex } },
                          ],
                      });
};