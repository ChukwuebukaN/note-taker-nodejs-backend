import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notesRoute";
import userRoute from "./routes/userRoute";
import morgan from "morgan";
import createHttpError from "http-errors";
import session from "express-session";
import env from "utils/validateEnv";
import MongoStore from "connect-mongo";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use("/api/notes", notesRoutes);
app.use("/api/user", userRoute);

app.use((request, response, next) => {
  next(createHttpError(404, "The-Frenzy - Endpoint not found"));
});

// app.use(
//   (
//     error: unknown,
//     request: Request,
//     response: Response
//     // , next: NextFunction
//   ) => {
//     console.error(error);
//     let errorMessage = "An unknown error occured";
//     let statusCode = 500;
//     if (isHttpError(error)) {
//       statusCode = error.status;
//       errorMessage = error.message;
//     }
//     response.status(statusCode).json({ error: errorMessage });
//   }
// );

// Global Error Handler Middleware
app.use((err: createHttpError.HttpError, req: Request, res: Response, next: NextFunction) => {
  if (createHttpError.isHttpError(err)) {
    res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default app;
