import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "../modals/ConfirmationDialog";
import { fetchAllProjects, clearProjectFiles, deleteProject } from "../../api/AdminApi";

const UpcomingDeadlines = ({ searchQuery, projectTypeFilter, getTypeColor }) => {
  const [projects, setProjects] = useState({
    ProfessionalTraining1: [],
    ProfessionalTraining2: [],
    FinalYearProject: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableRow, setEditableRow] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [clearLinks, setClearLinks] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ 
    open: false, 
    onConfirm: null, 
    title: "", 
    description: "" 
  });

  const getProjectType = (project) => {
    if (projects.ProfessionalTraining1.some(p => p.id === project.id)) return "ProfessionalTraining1";
    if (projects.ProfessionalTraining2.some(p => p.id === project.id)) return "ProfessionalTraining2";
    if (projects.FinalYearProject.some(p => p.id === project.id)) return "FinalYearProject";
    return null;
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      // NOTE: Ideally, filtering should be done on the backend.
      const response = await fetchAllProjects();
      const data = response?.data || {};
      setProjects({
        ProfessionalTraining1: data.ProfessionalTraining1 ?? [],
        ProfessionalTraining2: data.ProfessionalTraining2 ?? [],
        FinalYearProject: data.FinalYearProject ?? [],
      });
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to load projects: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleClearFiles = async (project, index) => {
    try {
      const projectType = getProjectType(project);
      if (!projectType) {
        throw new Error("Could not determine project type");
      }
      
      const flagsToClear = {
        abstract: Boolean(clearLinks[index]?.abstract),
        ppt: Boolean(clearLinks[index]?.ppt),
        report: Boolean(clearLinks[index]?.report),
        demo: Boolean(clearLinks[index]?.demo)
      };

      if (!Object.values(flagsToClear).some(Boolean)) {
        toast.warning("Please select at least one file type to clear");
        return;
      }

      await clearProjectFiles(projectType, project.id, flagsToClear);
      await loadProjects();
      
      setEditableRow(null);
      setClearLinks({});
      toast.success("Files cleared successfully");
    } catch (err) {
      toast.error(`Failed to clear files: ${err.message}`);
    }
  };

  const handleDeleteProject = async (project) => {
    try {
      const projectType = getProjectType(project);
      if (!projectType) {
        throw new Error("Could not determine project type");
      }

      await deleteProject(projectType, project.id);
      
      setProjects(prev => ({
        ...prev,
        [projectType]: prev[projectType].filter(p => p.id !== project.id)
      }));
      
      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error(`Failed to delete project: ${err.message}`);
    }
  };

  let allProjects = [];
  if (projectTypeFilter === "PT-1") {
    allProjects = projects.ProfessionalTraining1;
  } else if (projectTypeFilter === "PT-2") {
    allProjects = projects.ProfessionalTraining2;
  } else if (projectTypeFilter === "Final Year") {
    allProjects = projects.FinalYearProject;
  } else {
    allProjects = [
      ...projects.ProfessionalTraining1,
      ...projects.ProfessionalTraining2,
      ...projects.FinalYearProject
    ];
  }
  console.log(allProjects)

  const filteredData = allProjects
    .filter(project => {
      if (!project.Team) return false;
      return project.Team.status !== 'disbanded';
    })
    .filter((project) => {
      const query = (searchQuery || "").toLowerCase();
      const team = project.Team || {};
      const student1 = team.Student1 || {};
      const student2 = team.Student2 || {};
      const mentor = team.Mentor || {};

      const match =
        project.title.toLowerCase().includes(query) ||
        `prj-${project.id}`.includes(query) ||
        student1.student_name?.toLowerCase().includes(query) ||
        student2.student_name?.toLowerCase().includes(query) ||
        mentor.name?.toLowerCase().includes(query);
      // Log for debugging filter behavior
      if (query && match) {
        // eslint-disable-next-line no-console
        console.log("Matched project:", project);
      }
      return match;
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-8">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">
          Project Details 
        </h3>
      </div>
      
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abstract
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Presentation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demo Video
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((project, index) => (
              <React.Fragment key={project.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                        <i className={`fas ${index % 2 === 0 ? "fa-laptop-code" : "fa-mobile-alt"}`}></i>
                      </div>
                      <div>
                        <button
                          onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                          className="text-sm font-medium text-emerald-700 hover:underline focus:outline-none"
                        >
                          {project.title}
                        </button>
                        <div className="text-xs text-gray-500">
                          Project ID: PRJ-{project.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editableRow === index ? (
                      <span className="text-gray-400 text-sm italic">Not editable</span>
                    ) : project.abstract_url ? (
                      <a
                        href={project.abstract_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 text-sm font-medium underline"
                      >
                        View Abstract
                      </a>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 opacity-50" title="Not submitted">
                        <i className="fas fa-file text-base"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editableRow === index ? (
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={clearLinks[index]?.ppt || false}
                          onChange={(e) => {
                            const updated = { ...clearLinks };
                            updated[index] = { ...updated[index], ppt: e.target.checked };
                            setClearLinks(updated);
                          }}
                          className="form-checkbox"
                        />
                        <span className="ml-2 text-sm">Clear</span>
                      </label>
                    ) : project.ppt_url ? (
                      <a
                        href={project.ppt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 text-sm font-medium underline"
                      >
                        View PPT
                      </a>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 opacity-50" title="Not submitted">
                        <i className="fas fa-file text-base"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editableRow === index ? (
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={clearLinks[index]?.report || false}
                          onChange={(e) => {
                            const updated = { ...clearLinks };
                            updated[index] = { ...updated[index], report: e.target.checked };
                            setClearLinks(updated);
                          }}
                          className="form-checkbox"
                        />
                        <span className="ml-2 text-sm">Clear</span>
                      </label>
                    ) : project.report_pdf_url ? (
                      <a
                        href={project.report_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 text-sm font-medium underline"
                      >
                        View Report
                      </a>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 opacity-50" title="Not submitted">
                        <i className="fas fa-file text-base"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editableRow === index ? (
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={clearLinks[index]?.demo || false}
                          onChange={(e) => {
                            const updated = { ...clearLinks };
                            updated[index] = { ...updated[index], demo: e.target.checked };
                            setClearLinks(updated);
                          }}
                          className="form-checkbox"
                        />
                        <span className="ml-2 text-sm">Clear</span>
                      </label>
                    ) : project.demo_video_url ? (
                      <a
                        href={project.demo_video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 text-sm font-medium underline"
                      >
                        View Demo Video
                      </a>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 opacity-50" title="Not submitted">
                        <i className="fas fa-file text-base"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editableRow === index ? (
                      <>
                        <button
                          className="text-green-600 hover:text-green-800 mr-3"
                          onClick={() => handleClearFiles(project, index)}
                          title="Save Changes"
                        >
                          <i className="fas fa-save"></i>
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setEditableRow(null);
                            setClearLinks({});
                          }}
                          title="Cancel"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-gray-500 hover:text-gray-700 mr-3"
                          onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          onClick={() => {
                            setConfirmDialog({
                              open: true,
                              title: "Enable Edit Mode?",
                              description: "Are you sure you want to edit this project's submission links?",
                              onConfirm: () => setEditableRow(index),
                            });
                          }}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            setConfirmDialog({
                              open: true,
                              title: "Delete Project?",
                              description: "Are you sure you want to delete this project from the list?",
                              onConfirm: () => handleDeleteProject(project),
                            });
                          }}
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
                        <div className="flex-1 border border-gray-200 rounded-md p-4 shadow-sm bg-white">
                          <h4 className="text-indigo-600 font-semibold mb-2">Mentor</h4>
                          <p className="text-gray-800">{project.Team?.Mentor?.name || "Not assigned"}</p>
                        </div>
                        <div className="flex-1 border border-gray-200 rounded-md p-4 shadow-sm bg-white">
                          <h4 className="text-indigo-600 font-semibold mb-2">Team Members</h4>
                          <ul className="list-disc list-inside text-gray-800">
                            {project.Team?.Student1 && (
                              <li>{project.Team.Student1.student_name} ({project.Team.Student1.reg_number})</li>
                            )}
                            {project.Team?.Student2 && (
                              <li>{project.Team.Student2.student_name} ({project.Team.Student2.reg_number})</li>
                            )}
                          </ul>
                        </div>
                        <div className="flex-1 border border-gray-200 rounded-md p-4 shadow-sm bg-white">
                          <h4 className="text-indigo-600 font-semibold mb-2">Project Details</h4>
                          <p className="text-gray-800 mb-1"><strong>Domain:</strong> {project.domain}</p>
                          <p className="text-gray-800"><strong>Status:</strong> {project.approved_status}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.description}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
      />
    </div>
  );
};

export default UpcomingDeadlines;








