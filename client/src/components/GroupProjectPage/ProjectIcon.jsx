import React from "react";
import { useNavigate } from "react-router-dom";

export const ProjectIcon = ({ project, currentUser }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/${currentUser}/project/${project.project_id}`)}
      className="tooltip tooltip-left"
      data-tip={project.name}
    >
      <img
        className="rounded-2xl w-24 h-24 object-cover border-2 border-text-color"
        src={project.cover_photo_path || "https://staticg.sportskeeda.com/editor/2023/05/90701-16836967841966-1920.jpg"}
        alt={project.name}
      />
    </div>
  );
};
