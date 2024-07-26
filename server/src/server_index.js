import express from 'express';
import { config } from 'dotenv';
import chatsRoutes from './routes/chats_routes.js';
import projectsRoutes from './routes/projects_routes.js';
import homeRoutes from './routes/home_routes.js';
import db from './db/connection.js';

config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to CoLab!');
});

app.use("/chats", chatsRoutes)
app.use("/projects", projectsRoutes)
app.use("/dashboard", homeRoutes)

// TO START THE SERVER RUN THE COMMAND: npm run server
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});