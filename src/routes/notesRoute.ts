import express from "express";
import * as NotesController from "../controllers/notesController";

const router = express.Router();

router.post("/", NotesController.createNote);
router.get("/", NotesController.getAllNotes);
router.get("/:noteId", NotesController.getSpecificNote);
router.patch("/:noteId", NotesController.updateNote);
router.delete("/:noteId", NotesController.deleteNote);

export default router;
