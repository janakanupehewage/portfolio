"use client";
import { useState, useEffect, useRef } from "react";
import { UploadCloud, X, File } from "lucide-react";
import ProjectCard from "../../../(components)/sub/ProjectCard";

type Project = {
  id: number;
  title: string;
  description: string;
  imageFile: File | null;
  imageUrl?: string;
};

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageFile: null as File | null,
  });

  const inputRef = useRef<HTMLInputElement>(null);

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
      }
    }

    fetchProjects();
  }, []);

  const handleSave = async () => {
    try {
      let imageBase64 = null;
  
      if (form.imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(form.imageFile);
        await new Promise((resolve) => (reader.onload = resolve));
        imageBase64 = reader.result;
      } else if (editProject?.imageUrl) {
        imageBase64 = editProject.imageUrl;
      }
  
      // Differentiate between update and create
      const query = editProject
        ? `
          mutation UpdateProject($id: ID!, $title: String!, $description: String, $image: String) {
            updateProject(id: $id, title: $title, description: $description, image: $image) {
              id
              title
              description
              imageUrl
            }
          }
        `
        : `
          mutation addProject($title: String!, $description: String, $image: String!) {
            addProject(title: $title, description: $description, image: $image) {
              id
              title
              description
              imageUrl
            }
          }
        `;
  
      const variables = editProject
        ? {
            id: editProject.id,
            title: form.title,
            description: form.description,
            image: imageBase64,
          }
        : {
            title: form.title,
            description: form.description,
            image: imageBase64,
          };
  
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });
  
      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      setProjects((prevProjects) =>
        editProject
          ? prevProjects.map((p) =>
              p.id === result.data.updateProject.id
                ? result.data.updateProject
                : p
            )
          : [...prevProjects, result.data.addProject]
      );
  
      setModalOpen(false);
      setEditProject(null);
      setForm({ title: "", description: "", imageFile: null });
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };
  
  

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation DeleteProject($id: ID!) {
              deleteProject(id: $id)
            }
          `,
          variables: { id },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleRemoveImage = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation(); 
  
    setForm((prevForm) => ({
      ...prevForm,
      imageFile: null,
    }));
  
    setEditProject((prevProject) =>
      prevProject ? { ...prevProject, imageUrl: "" } : null
    );
  
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  
  

  const isFormValid = form.imageFile || (editProject?.imageUrl);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-semibold text-center mb-8">My Projects</h1>

      {/* Add Project Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => {
            setEditProject(null); // Clear any edit project data
            setForm({ title: "", description: "", imageFile: null }); // Reset form fields
            setModalOpen(true);
          }}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Add Project
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {projects.map((project) => (
          <div key={project.id} className="relative">
            <ProjectCard
              src={project.imageUrl || "/NextWebsite.png"}
              title={project.title}
              description={project.description}
            />

            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => {
                  setEditProject(project);
                  setForm({
                    title: project.title,
                    description: project.description,
                    imageFile: project.imageUrl ? null : project.imageFile, // If there's an image URL, don't overwrite the file.
                  });
                  setModalOpen(true);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">{editProject ? "Edit Project" : "Add Project"}</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                  required
                ></textarea>
              </div>

              {/* Image Upload Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-white">Upload Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()} // ✅ This triggers the file input when clicked
                  className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-white cursor-pointer hover:border-gray-400"
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleImageChange}
                  />
                  {!form.imageFile && !editProject?.imageUrl ? (
                    <div className="flex flex-col items-center justify-center h-32 cursor-pointer">
                      <UploadCloud className="w-10 h-10 text-gray-300 mb-2" />
                      <span>Drag & drop or click to upload</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full p-2 bg-gray-800 rounded-md">
                      <div className="flex items-center">
                        <File className="w-6 h-6 text-white mr-2" />
                        <p className="text-sm font-medium break-all text-white">{form.imageFile ? form.imageFile.name : editProject?.imageUrl}</p>
                      </div>
                      <button
                        onClick={handleRemoveImage}
                        className="text-gray-300 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!isFormValid}
                  
                >
                  {editProject ? "Update" : "Add"} Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
