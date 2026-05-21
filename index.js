import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

import db from "./Kambaz/Database/index.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();
app.set("trust proxy", 1);

app.use(
    cors({
             credentials: true,
             origin: process.env.CLIENT_URL || "http://localhost:5173",
         })
);

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: process.env.SERVER_ENV === "production" ? "none" : "lax",
        secure: process.env.SERVER_ENV === "production",
    },
};

if (process.env.SERVER_ENV !== "development") {
    sessionOptions.proxy = true;
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5(app);

app.get("/", (req, res) => {
    res.send("Welcome to Full Stack Development!");
});

app.listen(process.env.PORT || 4000);