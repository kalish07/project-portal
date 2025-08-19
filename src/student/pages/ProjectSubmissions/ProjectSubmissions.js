// ProjectSubmissions.jsx

import React, { useState, useEffect } from 'react';
import ProjectHeader from '../../components/ProjectSubmissions/ProjectHeader';
import ProjectDetails from '../../components/ProjectSubmissions/ProjectDetails';
import DocumentCard from '../../components/ProjectSubmissions/Documentcard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { documentTypes } from '../../data/mockData';
import {
  fetchTeamAndProjectsByUser,
  submitProjectDocumentLink,
  requestNewProject,
  withdrawProjectRequest,
} from '../../api/inviteCenterApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const domainOptions = [
  "Artificial Intelligence", "Cybersecurity", "Web Development", "Mobile App Development",
  "Data Science", "IoT", "Cloud Computing", "Blockchain", "AR/VR", "Others"
];

const projectTypeMap = {
  pt1: "ProfessionalTraining1",
  pt2: "ProfessionalTraining2",
  finalyearproject: "FinalYearProject",
};

const semesterToAllowedProjectTypes = {
  5: ['pt1'],
  6: ['pt2'],
  7: ['finalyearproject'],
  8: ['finalyearproject']
};

const docTypeToFieldMap = {
  'Abstract': 'abstract_url',
  'Report': 'report_pdf_url',
  'Slide Deck': 'ppt_url'
};

const ProjectSubmissions = () => {
  const [projects, setProjects] = useState([]);
  const [documentLinks, setDocumentLinks] = useState({});
  const [projectType, setProjectType] = useState('pt1');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingDocs, setSubmittingDocs] = useState({});
  const [studentSemester, setStudentSemester] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    domain: '',
    customDomain: '',
    abstractLink: '',
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchTeamAndProjectsByUser();
        const projectData = data.projects;

        const formattedProjects = Object.entries(projectData || {})
          .filter(([_, value]) => value && value.project && value.project.approved_status !== 'rejected')
          .map(([key, value]) => {
            const { team, students, project } = value;

            return {
              ...project,
              id: project.id,
              type: key,
              teamMembers: [
                { name: students.student1?.student_name || 'Member 1', role: 'Team Member' },
                ...(students.student2 ? [{ name: students.student2.student_name, role: 'Team Member' }] : [])
              ],
              supervisor: team?.mentor?.name || 'No Mentor Assigned',
              isPending: project.approved_status === 'pending',
              current_semester: team?.current_semester || null
            };
          });

        setProjects(formattedProjects);

        const anyTeam = data.current_team;
        if (anyTeam) {
          setStudentSemester(anyTeam.current_semester);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const currentProject = projects.find(proj => proj.type === projectTypeMap[projectType]) || null;
  const currentSemesterAllowed = studentSemester ? semesterToAllowedProjectTypes[studentSemester] || [] : [];
  const isAllowedToSubmit = currentSemesterAllowed.includes(projectType);

  const handleLinkChange = (docId, value) => {
    setDocumentLinks(prev => ({ ...prev, [docId]: value }));
  };

  const handleLinkSubmit = async (docId, docType) => {
    const link = documentLinks[docId];

    try {
      setSubmittingDocs(prev => ({ ...prev, [docId]: true }));

      await submitProjectDocumentLink(currentProject.id, {
        project_type: projectTypeMap[projectType],
        link,
        doc_type: docType
      });

      toast.success(`✅ ${docType} submitted successfully`);

      setProjects(prev => prev.map(proj => {
        if (proj.id === currentProject.id) {
          return {
            ...proj,
            [docTypeToFieldMap[docType]]: link
          };
        }
        return proj;
      }));
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed to submit ${docType}`);
    } finally {
      setSubmittingDocs(prev => ({ ...prev, [docId]: false }));
    }
  };

  const handleNewProjectInputChange = (field, value) => {
    setNewProject(prev => ({ ...prev, [field]: value }));
  };

  const handleNewProjectSubmit = async () => {
    const { title, description, domain, customDomain, abstractLink } = newProject;
    const finalDomain = domain === "Others" ? customDomain.trim() : domain;

    if (!isAllowedToSubmit) return;
    if (title.trim().length < 5 || description.trim().length < 20 || !finalDomain) return;

    try {
      await requestNewProject({
        title,
        description,
        domain: finalDomain,
        abstract_url: abstractLink,
        project_type: projectTypeMap[projectType],
      });

      toast.success("✅ Project idea submitted successfully!");
      setNewProject({ title: '', description: '', domain: '', customDomain: '', abstractLink: '' });

      const data = await fetchTeamAndProjectsByUser();
      const { projects } = data;
      const formattedProjects = Object.entries(projects || {})
        .filter(([_, value]) => value !== null && value.approved_status !== 'rejected')
        .map(([key, value]) => ({
          ...value,
          type: projectTypeMap[key] || key,
        }));
      setProjects(formattedProjects);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    if (!currentProject) return;
    try {
      await withdrawProjectRequest(currentProject.id, projectTypeMap[projectType]);
      toast.success("✅ Project withdrawn successfully");

      const data = await fetchTeamAndProjectsByUser();
      const { projects } = data;
      const formattedProjects = Object.entries(projects || {})
        .filter(([_, value]) => value !== null && value.approved_status !== 'rejected')
        .map(([key, value]) => ({
          ...value,
          type: projectTypeMap[key] || key,
        }));
      setProjects(formattedProjects);
    } catch (err) {
      console.error(err);
    }
  };

  const getDocumentCards = () => {
    return documentTypes.map(docType => {
      const docField = docTypeToFieldMap[docType];
      const hasDocument = currentProject && currentProject[docField];

      const doc = {
        id: `${currentProject?.id}-${docType}`,
        type: docType,
        state: hasDocument ? 'Submitted' : 'Not Submitted',
        version: 1,
        link: hasDocument ? currentProject[docField] : null
      };

      return (
        <DocumentCard
          key={doc.id}
          doc={doc}
          isLocked={false}
          documentLinks={documentLinks}
          onLinkChange={handleLinkChange}
          onLinkSubmit={() => handleLinkSubmit(doc.id, docType)}
          isEmpty={!hasDocument}
          isSubmitting={submittingDocs[doc.id] || false}
        />
      );
    });
  };

  if (loading) return <LoadingSpinner />;

  // If no project exists for the current type, show fallback only
  if (!currentProject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-24 w-24 mb-4 text-gray-400"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  />
</svg>
        <p className="text-lg font-medium text-gray-500">No projects available yet</p>
        <p className="text-sm mt-1 text-gray-400">You can submit a new project idea later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      <ProjectHeader
        projectType={projectType}
        setProjectType={setProjectType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        studentSemester={studentSemester}
        allowedTypes={Object.keys(projectTypeMap)}
      />

      {currentProject.isPending ? (
        <>
          <div className="bg-yellow-100 p-4 rounded-md text-yellow-700 mb-4 border border-yellow-300">
            <strong>Project Idea Pending Approval:</strong> This project is under review.
          </div>
          <ProjectDetails project={currentProject} />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleWithdraw}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Withdraw Project Request
            </button>
          </div>
        </>
      ) : (
        <>
          <ProjectDetails project={currentProject} />
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getDocumentCards()}
            </div>
          </div>
        </>
      )}

      {/* New Project Request Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Request New Project</h3>

        {!isAllowedToSubmit && (
          <div className="text-red-500 text-sm mb-4">
            You're not allowed to submit this type of project in your current semester ({studentSemester}).
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title*</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              value={newProject.title}
              onChange={(e) => handleNewProjectInputChange('title', e.target.value)}
              disabled={!isAllowedToSubmit}
              placeholder="Enter project title (min 5 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              value={newProject.description}
              onChange={(e) => handleNewProjectInputChange('description', e.target.value)}
              disabled={!isAllowedToSubmit}
              placeholder="Enter detailed description (min 20 characters)"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain*</label>
            <select
              value={newProject.domain}
              onChange={(e) => handleNewProjectInputChange('domain', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              disabled={!isAllowedToSubmit}
            >
              <option value="">Select a domain</option>
              {domainOptions.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          {newProject.domain === "Others" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Domain*</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                value={newProject.customDomain}
                onChange={(e) => handleNewProjectInputChange('customDomain', e.target.value)}
                disabled={!isAllowedToSubmit}
                placeholder="Enter your custom domain"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Abstract Google Drive Link</label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              value={newProject.abstractLink}
              onChange={(e) => handleNewProjectInputChange('abstractLink', e.target.value)}
              disabled={!isAllowedToSubmit}
            />
          </div>

          <button
            onClick={handleNewProjectSubmit}
            disabled={!isAllowedToSubmit}
            className={`px-4 py-2 rounded-md transition-colors ${
              isAllowedToSubmit
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Project Idea
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmissions;