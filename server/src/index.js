import "dotenv/config";
import express from "express";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import projectsRoutes from "./routes/projects_routes.js";
import homeRoutes from "./routes/home_routes.js";
import userRoutes from "./routes/user_routes.js";
import db from "./db/connection.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  cookieSession({
      name: 'session',
      keys: ['secretkey', 'secretkey2'],
    
      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to CoLab!");
});

app.use("/api/projects", projectsRoutes);
app.use("/api/dashboard", homeRoutes);
app.use("/api", userRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User joined project: ${projectId}`);
  });

  // Other socket events here...

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export { io };
// Only export the handler for Vercel
export default (req, res) => {
  server.emit("request", req, res);
  // console.log(`Server is running on port serverless`);
};



// Start the server only for local development or other non-serverless environments
// if (process.env.NODE_ENV !== 'production') {
//   server.listen(5173, () => {
//     console.log(`Server is running on port`);
//   });
// }
