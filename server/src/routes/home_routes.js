import express from 'express';
import { getAllProjects } from '../db/queries/project_queries.js';
const router = express.Router();

// http://localhost:5000/dashboard/
router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects();
    return res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getting projects: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;