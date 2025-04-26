import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/noteModel";

interface CreateNotesBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<unknown, unknown, CreateNotesBody, unknown> = async (request, response, next) => {
  const title = request.body.title;
  const text = request.body.text;
  try {
    if (!title) {
      throw createHttpError(400, "Note must have a title and text");
    }
    const newNote = await NoteModel.create({
      title: title,
      text: text,
    });
    response.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const getAllNotes: RequestHandler = async (request, response, next) => {
  try {
    const notes = await NoteModel.find().exec();
    response.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getSpecificNote: RequestHandler = async (request, response, next) => {
  const noteId = request.params.noteId;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    response.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface UpdateNotesParams {
  noteId: string;
  text?: string;
}

interface UpdateNotesBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<UpdateNotesParams, unknown, UpdateNotesBody, unknown> = async (request, response, next) => {
  const noteId = request.params.noteId;
  const newTitle = request.body.title;
  const newText = request.body.text;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }

    if (!newTitle) {
      throw createHttpError(400, "Note must have a title");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();

    response.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (request, response, next) => {
  const noteId = request.params.noteId;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    await note.deleteOne();
    response.sendStatus(204).json(note);
  } catch (error) {
    next(error);
  }
};
