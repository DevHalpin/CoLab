import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { ProjectPage } from "./pages/ProjectPage";
import { CreateProject } from "./pages/CreateProject";
import { MyProjects } from "./pages/MyProjects";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";

function App() {
  const [techModal, setTechModal] = useState(false);

  const handleTechStacksModal = () => {
    setTechModal(!techModal);
  };

  const navigate = useNavigate();

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/create"
          element={
            <ProtectedRoute>
              <CreateProject
                handleTechStacksModal={handleTechStacksModal}
                techModal={techModal}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:id/myprojects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
