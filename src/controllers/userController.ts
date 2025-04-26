import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import userModel from "../models/userModel";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (request, response, next) => {
  const username = request.body.username;
  const email = request.body.email;
  const passwordRaw = request.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Must include username, email, password");
    }

    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername) {
      throw createHttpError(409, "Username already exists");
    }

    const existingEmail = await UserModel.findOne({
      email: email,
    }).exec();

    if (existingEmail) {
      throw createHttpError(409, "Email already exists");
    }

    const hasedPassword = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: hasedPassword,
    });

    request.session.userId = newUser._id;
    response.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LogInBody {
  username?: string;
  password?: string;
}

export const logIn: RequestHandler<unknown, unknown, LogInBody, unknown> = async (request, response, next) => {
  const username = request.body.username;
  const password = request.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Must include username and password.");
    }

    const user = await UserModel.findOne({ username: username }).select("+password +email").exec();

    if (!user) {
      throw createHttpError(400, "Invalid Credentials.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(400, "Invalid Credentials.");
    }

    request.session.userId = user._id;
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = (request, response, next) => {
  request.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      response.sendStatus(200);
    }
  });
};

export const getAuthenticatedUser: RequestHandler = async (request, response, next) => {
  const authenticatedUserId = request.session.userId;

  try {
    if (!authenticatedUserId) {
      throw createHttpError(401, "Unauthenticated User.");
    }

    const user = await userModel.findById(authenticatedUserId).select("+email").exec();

    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
