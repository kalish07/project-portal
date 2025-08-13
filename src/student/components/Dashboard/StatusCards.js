import React, { useRef, useEffect, useState } from "react";
import { FaChartLine, FaFolderOpen, FaThumbsUp } from "react-icons/fa";

const StatusCards = ({ semester, projects }) => {
  const approvedProjects = projects?.filter(p => p.approved_status === "approved") || [];
  const pendingProjects = projects?.filter(p => p.approved_status !== "approved") || [];
  const totalProjects = projects?.length || 0;

  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    {
      title: "Current Semester",
      value: semester || "N/A",
      subtitle: "Semester Progress",
      icon: <FaChartLine className="text-white text-lg sm:text-xl" />,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Projects",
      value: totalProjects,
      subtitle: "Total Registered",
      icon: <FaFolderOpen className="text-white text-lg sm:text-xl" />,
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Approval Status",
      value: `${approvedProjects.length}/${totalProjects}`,
      subtitle: `${approvedProjects.length} Approved, ${pendingProjects.length} Pending`,
      icon: <FaThumbsUp className="text-white text-lg sm:text-xl" />,
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    }
  ];

  useEffect(() => {
    const container = scrollRef.current;
    const handleScroll = () => {
      if (!container) return;
      const cardWidth = container.firstChild.offsetWidth + 16;
      const index = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(index);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Carousel */}
      <div
        ref={scrollRef}
        className="lg:hidden overflow-x-auto flex gap-4 px-2 sm:px-0 snap-x snap-mandatory touch-pan-x scrollbar-hide scroll-smooth pb-8 sm:pb-12 mb-6"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 min-w-[250px] sm:w-72 rounded-2xl p-4 sm:p-6 text-white shadow-md transition-transform duration-300 hover:shadow-xl hover:scale-105 ${card.gradient} snap-start`}
            style={{
              transform: idx === activeIndex ? "scale(1.05)" : "scale(1)",
              zIndex: idx === activeIndex ? 10 : 1,
              boxShadow:
                idx === activeIndex
                  ? "0 8px 20px rgba(0,0,0,0.25)"
                  : "0 4px 8px rgba(0,0,0,0.15)"
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/20">
                  {card.icon}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold truncate">{card.title}</h3>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold mb-1">{card.value}</p>
            <p className="text-white/80 text-xs sm:text-sm truncate">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 mb-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 text-white shadow-md transition-transform duration-300 ${card.gradient}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold truncate">{card.title}</h3>
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">{card.value}</p>
            <p className="text-white/80 text-sm truncate">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatusCards;