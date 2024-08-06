import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { ProjectPage } from "./pages/ProjectPage";
import { CreateProject } from "./pages/CreateProject";
import { EditProject } from "./pages/EditProject";
import { MyProjects } from "./pages/MyProjects";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { MyProjectRequests } from "./pages/MyProjectRequests";
import { MyNotifications } from "./pages/MyNotifications";

axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();

  const [techModal, setTechModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/current-user");
        setCurrentUser(response.data);
      } catch (error) {
        console.error(
          "No user logged in:",
          error.response?.data || error.message
        );
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      setCurrentUser(null);
      navigate("/signin");
    } catch (error) {
      console.error(
        "Error logging out:",
        error.response?.data || error.message
      );
    }
  };

  const handleTechStacksModal = () => {
    setTechModal(!techModal);
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Landing currentUser={currentUser} handleLogout={handleLogout} />
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <Dashboard
                currentUser={currentUser}
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/project/:projectId"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <ProjectPage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/project/create"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <CreateProject
                handleTechStacksModal={handleTechStacksModal}
                techModal={techModal}
                currentUser={currentUser}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/project/:projectId/edit"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <EditProject
                handleTechStacksModal={handleTechStacksModal}
                techModal={techModal}
                currentUser={currentUser}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/:userId/myprojects"}
          element={
            <ProtectedRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <MyProjects currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/:userId/myprojects/requests"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <MyProjectRequests currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:userId/notifications"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            >
              <MyNotifications currentUser={currentUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
