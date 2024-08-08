import React, { useState, useEffect, useContext } from "react";
import { ProjectIcon } from "./ProjectIcon";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

export const ProjectRightMenu = ({ project, owner, handleCompleteProject }) => {
  const { currentUser } = useContext(AppContext);
  const [rightMenuProjects, setRightMenuProjects] = useState([]);
  const navigate = useNavigate();

  /*------------------- Fetch projects --------------*/
  useEffect(() => {
    const fetchRightUserMenu = async () => {
      try {
        const response = await axios.get(
          `/api/dashboard/${currentUser.id}/my_projects`
        );
        setRightMenuProjects(response.data);
      } catch (error) {
        console.error(
          "Error getting projects for the right user menu: ",
          error.message
        );
      }
    };
    fetchRightUserMenu();
  }, []);

  const isOwner = owner === currentUser.id;

  return (
    <div className="flex flex-col fixed top-0 right-0 w-[300px] h-full bg-menu-colors justify-between mt-0 pt-24 z-10">
      <div className="right-menu-items-top flex flex-row justify-around">
        <div className="project-links bg-alt-grey w-24 h-[1150px] flex flex-col items-center rounded-xl p-4 space-y-10 justify-top">
          <div>
            <a href={project.github_repo} target="_blank">
              <i className="fa-brands fa-github text-6xl pt-10"></i>
            </a>
          </div>
          <div>
            <a href={project.trello_link} target="_blank">
              <i className="fa-brands fa-trello text-6xl"></i>
            </a>
          </div>
          <div>
            <a href={project.figma_link} target="_blank">
              <i className="fa-brands fa-figma text-6xl mr-2"></i>
            </a>
          </div>
        </div>
        <div className="project-list bg-project-left-menu bg-alt-grey w-40 h-[1150px] flex flex-col items-center rounded-xl p-4 gap-y-7 justify-start">
          {rightMenuProjects.map((project) => {
            return (
              <ProjectIcon
                key={project.project_id}
                project={project}
                currentUser={currentUser.id}
              />
            );
          })}
        </div>
      </div>

      {isOwner && (
        <div className="flex flex-col  items-center h-full justify-center space-y-10">
          <button
            className="bg-icon-purple text-white text-base hover:bg-icon-purple-hover rounded-full w-60 p-1 h-10 font-semibold"
            onClick={() => {
              navigate(`/${currentUser.id}/project/${project.project_id}/edit`);
            }}
          >
            Edit
          </button>
          <button
            className="bg-icon-purple text-white text-base hover:bg-icon-purple-hover rounded-full w-60 p-1 h-10 font-semibold"
            onClick={handleCompleteProject}
          >
            Complete
          </button>
        </div>
      )}
    </div>
  );
};
