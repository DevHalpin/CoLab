import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EditProjectTechStackModal } from "../EditProjectTechStackModal";

export const ProjectEditField = ({
  handleTechStacksModal,
  techModal,
  project,
}) => {
  const [projectEditing, setProjectEditing] = useState(false);
  const [projectData, setProjectData] = useState({});

  const {
    name,
    description,
    max_participants,
    cover_photo_path,
    githubRepo,
    figmaLink,
    trelloLink,
    newPicture,
    tech_requirements: tech_names,
  } = project;

  const maxChars = 300;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    if (value.length <= maxChars) {
      setProjectData((prevData) => ({ ...prevData, description: value }));
    }
  };

  const handleAddTech = (techLanguage) => {
    if (techLanguage.trim() !== "") {
      setProjectData((prevData) => ({
        ...prevData,
        tech_names: [...prevData.tech_names, techLanguage],
      }));
    }
  };

  const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png)$/i.test(url);
  };

  const handleAddCoverPhoto = () => {
    if (
      projectData.newPicture.trim() &&
      isValidImageUrl(projectData.newPicture)
    ) {
      setProjectData((prevData) => ({
        ...prevData,
        cover_photo_path: projectData.newPicture,
        newPicture: "",
      }));
    } else {
      alert("Please enter a valid image URL (e.g., .jpg, .png, .jpeg)");
    }
  };

  const handleRemoveCoverPhoto = () => {
    setProjectData((prevData) => ({ ...prevData, cover_photo_path: "" }));
  };

  const validateLink = (link, baseUrl) => {
    if (link.startsWith("/") && !link.startsWith(baseUrl)) {
      return `${baseUrl}${link}`;
    }
    return null;
  };

  const editProject = async (e) => {
    e.preventDefault();
    try {
      setProjectEditing(true);

      // Validate and prepend base URLs
      const githubRepo = validateLink(
        projectData.githubRepo,
        "https://github.com"
      );
      const figmaLink = validateLink(
        projectData.figmaLink,
        "https://www.figma.com"
      );
      const trelloLink = validateLink(
        projectData.trelloLink,
        "https://trello.com"
      );

      if (!githubRepo || !figmaLink || !trelloLink) {
        alert(
          "Please enter valid links starting with '/' and ensure they do not contain the base URL."
        );
        setProjectEditing(false);
        return;
      }

      const project = await axios.post("/api/projects/create", {
        ...projectData,
        githubRepo,
        figmaLink,
        trelloLink,
      });

      consol.log(tech_names);

      const {
        projectData: { id: projectId, owner_id: ownerId },
      } = project.data;

      setTimeout(() => {
        setProjectEditing(false);
        navigate(`/${ownerId}/project/${projectId}`);
      }, 3000);
    } catch (error) {
      console.error("Error editing project:", error.response.data);
    }
  };

  return (
    <>
      {projectEditing && (
        <div className="project-loading-animation fixed z-20 h-screen w-screen bg-slate-800/80 backdrop-blur-md top-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-screen-md">
            <h2 className="text-center mb-4 font-bold text-4xl">
            Saving changes...
            </h2>
            <progress className="block mx-auto progress w-full"></progress>
          </div>
        </div>
      )}

      <section className="flex flex-col h-full w-full justify-around">
        {/* PROJECT TITLE */}
        <div className="project-title flex justify-between py-4 mt-5 mb-10">
          <div className="w-auto">
            <h3 className="text-white">Project Title</h3>
            <h6>Choose a title for your new project</h6>
          </div>
          <div className="w-auto">
            <input
              type="text"
              name="name"
              placeholder="Title"
              className="input input-bordered bg-input-colors w-96"
              value={name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {techModal && (
          <EditProjectTechStackModal
            handleTechStacksModal={handleTechStacksModal}
            handleAddTech={handleAddTech}
            tech_names={tech_names}
            setTechRequirements={(tech_names) =>
              setProjectData((prevData) => ({ ...prevData, tech_names }))
            }
          />
        )}

        {/* PROJECT DESCRIPTION */}
        <div className="project-description flex items-start w-full mb-10 justify-between py-4">
          <div className="w-auto">
            <h3 className="text-white">Project Description</h3>
            <h6>Provide a description about the project</h6>
          </div>
          <div className="flex flex-col">
            <textarea
              className="textarea textarea-bordered min-h-[150px] min-w-[50px] bg-input-colors resize-none mb-5 self-center w-96"
              placeholder="Description..."
              value={description}
              onChange={handleDescriptionChange}
              name="description"
            ></textarea>
            <h6 className="text-input-value">
              {maxChars - description.length}
            </h6>
          </div>
        </div>

        {/* USER CAPACITY */}
        <div className="user-capacity-container flex justify-between py-4 mb-10">
          <div className="w-auto">
            <h3 className="text-white">User Capacity</h3>
            <h6>
              Pick the maximum amount of users that can request to join this
              project
            </h6>
          </div>
          <div className="user-capacity w-1/3 flex flex-col justify-center items-end">
            <select
              className="select select-bordered w-1/2 bg-input-colors"
              name="max_participants"
              value={max_participants}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Capacity
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>

        {/* TECH STACK */}
        <div className="tech-stack flex justify-between py-4 mb-10">
          <div className="w-auto">
            <h3 className="text-white">Tech Stack</h3>
            <h6>Choose the tech stack this project will utilize</h6>
          </div>
          <div className="tech-stack-select w-auto gap-y-3">
            <button
              className="btn btn-ghost hover:bg-input-colors text-lg group mr-5 mb-5"
              onClick={handleTechStacksModal}
            >
              <i className="fa-solid fa-plus group-hover:animate-spin group-hover:text-white group-hover:drop-shadow-white-glow"></i>
              Add
            </button>
            <h2>({tech_names && tech_names.length}) Selected</h2>
          </div>
        </div>

        {/* COVER PHOTO */}
        <div className="images-input flex justify-between items-center w-full mb-10 py-4">
          <div className="choose-file w-auto self-start">
            <h3 className="text-white">Cover Photo</h3>
            <h6>
              Choose images to showcase the design or what might represent the
              design of the project
            </h6>
            {cover_photo_path && (
              <button
                className="text-white mt-5 btn hover:bg-red text-lg group mr-5"
                onClick={handleRemoveCoverPhoto}
              >
                <i className="fa-solid fa-image group-hover:text-white group-hover:drop-shadow-white-glow"></i>
                {cover_photo_path}
              </button>
            )}
          </div>
          <div className="file-input-container w-1/3 flex flex-col justify-center items-end gap-5">
            {cover_photo_path.length > 0 ? (
              <>
                <input
                  type="url"
                  placeholder="Delete picture file first"
                  className="input input-bordered bg-disabled-input w-full"
                  disabled
                />
                <button
                  className="btn bg-disabled-input text-white w-1/2"
                  disabled
                >
                  Add Picture
                </button>
              </>
            ) : (
              <>
                <input
                  type="url"
                  placeholder="Enter image URL"
                  name="newPicture"
                  value={newPicture}
                  onChange={handleInputChange}
                  className="input input-bordered bg-input-colors w-full"
                />
                <button
                  className="btn bg-slate-600 text-white w-1/2"
                  onClick={handleAddCoverPhoto}
                >
                  Add Picture
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project links */}
        <div className="project-links-container flex flex-col justify-around">
          <div className="project-links-container__header">
            <h3 className="text-white">Project Links</h3>
            <h6>
              Add any external links to your project, such as the Github
              repository, Figma file, and Trello board.
            </h6>
          </div>

          <div className="project-links-container__links grid grid-cols-1 gap-5 w-full my-5 py-4">
            <div className="project-links-container__github flex justify-between">
              <h3>Github Repository</h3>
              <input
                type="text"
                placeholder="/<username>/<repo>"
                name="githubRepo"
                value={githubRepo}
                onChange={handleInputChange}
                className="input input-bordered bg-input-colors w-2/6"
              />
            </div>
            <div className="project-links-container__figma flex justify-between">
              <h3>Figma Link</h3>
              <input
                type="text"
                placeholder="/Figma Link"
                name="figmaLink"
                value={figmaLink}
                onChange={handleInputChange}
                className="input input-bordered bg-input-colors w-2/6"
              />
            </div>
            <div className="project-links-container__trello flex justify-between">
              <h3>Trello Board</h3>
              <input
                type="text"
                placeholder="/Trello link"
                name="trelloLink"
                value={trelloLink}
                onChange={handleInputChange}
                className="input input-bordered bg-input-colors w-2/6"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={editProject}
            className="btn btn-primary w-auto h-14 self-end"
            disabled={projectEditing}
          >
            {projectEditing ? "Creating..." : "Create Project"}
          </button>
        </div>
      </section>
    </>
  );
};
