"use client";

import React, { useState, useEffect } from "react";
import ProjectCard from "../sub/ProjectCard";

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                projects {
                  id
                  title
                  description
                  imageUrl
                }
              }
            `,
          }),
        });

        const result = await response.json();
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setProjects(result.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div id="projects" className="flex flex-col items-center justify-center py-20">
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
        My Projects
      </h1>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-10 w-full max-w-7xl">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            <p className="text-white mt-4 text-lg font-medium">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              src={project.imageUrl || "/NextWebsite.png"}
              title={project.title}
              description={project.description}
            />
          ))
        ) : (
          <p className="text-white col-span-full">No projects available.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
