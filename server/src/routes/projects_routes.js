import express from 'express';
import { createNewProject, getProjectPage } from '../db/queries/project_queries.js';
import { addOwnerToProject } from '../db/queries/user_queries.js';
import { createGroupChat } from '../db/queries/group_chat_queries.js';
import { createTodoList } from '../db/queries/todo_queries.js';
const router = express.Router();

// http://localhost:5000/projects/create
router.get ('/create', (req, res) => {
  res.send('Create a new project');
});

router.post('/create', async (req, res) => {
  const { name, description, user_id, max_participants, github_repo } = req.body;

  if (!name || !description || !user_id || !max_participants) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const newProject = await createNewProject(name, description, user_id, max_participants, github_repo);
    if (!newProject) {
      return res.status(500).send('Error creating project');
    }
    await addOwnerToProject(newProject.id, user_id); // Add the owner as a participant
    await createGroupChat(newProject.id); // Create a group chat for the project
    await createTodoList(newProject.id); // Create a todo list for the project
    res.redirect(`/projects/${newProject.id}`); // Redirect to the project page
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).send('Error creating project');
  }
});

// http://localhost:5000/projects/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const project = await getProjectPage(id);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.status(200).json(project); 
  } catch (error) {
    console.error('Error fetching project details:', error.message);
    res.status(500).send('Error fetching project details');
  }
});

export default router;