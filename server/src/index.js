import "dotenv/config";
import express from "express";
import session from "express-session";
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
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
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
};



// Start the server only for local development or other non-serverless environments
if (process.env.NODE_ENV !== 'production') {
  server.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT || 8080}`);
  });
}
