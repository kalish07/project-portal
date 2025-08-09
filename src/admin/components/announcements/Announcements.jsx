import React from 'react';

const Announcements = () => {
  const announcements = [
    {
      title: "Final Presentation Schedule Released",
      content: "The schedule for final project presentations has been released. Please check your team's assigned time slot.",
      date: "June 28, 2025",
      priority: "High",
      priorityColor: "red"
    },
    {
      title: "Extended Deadline for Progress Reports",
      content: "Due to the university event next week, the deadline for progress reports has been extended by 3 days.",
      date: "June 25, 2025",
      priority: "Medium",
      priorityColor: "yellow"
    },
    {
      title: "New Resources Available",
      content: "Additional resources for project development have been added to the resource library. Check them out!",
      date: "June 22, 2025",
      priority: "Low",
      priorityColor: "green"
    },
    {
      title: "Mentor Office Hours Update",
      content: "Mentor office hours have been updated for the next two weeks. Please refer to the new schedule.",
      date: "June 20, 2025",
      priority: "Medium",
      priorityColor: "yellow"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Announcements</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
          <i className="fas fa-plus mr-2"></i>
          Create New Announcement
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <button className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center justify-between w-full md:w-auto">
                <span>Filter by Priority</span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
            </div>
            <div className="relative">
              <button className="bg-white border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center justify-between w-full md:w-auto">
                <span>Sort by Date</span>
                <i className="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
            </div>
            <button className="bg-gray-100 px-4 py-2 rounded-md text-sm flex items-center">
              <i className="fas fa-filter mr-2"></i>
              More Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className={`px-4 py-2 bg-${announcement.priorityColor}-50 border-l-4 border-${announcement.priorityColor}-500 flex justify-between items-center`}>
              <h4 className="font-medium text-gray-800">{announcement.title}</h4>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-${announcement.priorityColor}-100 text-${announcement.priorityColor}-800`}>
                {announcement.priority}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">{announcement.content}</p>
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-500">Posted on {announcement.date}</p>
                <button className="text-xs text-indigo-600 font-medium">
                  Read More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            1
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50">
            2
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Announcements;