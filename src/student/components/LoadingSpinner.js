import React from 'react';

const ShimmerLoader = ({ message = "Loading", subtext = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="w-3/4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded"></div>
      <div className="w-1/2 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded"></div>
      <div className="text-center">
        <p className="text-gray-700 font-medium">{message}</p>
        {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
      </div>
      <style jsx="true">{`
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ShimmerLoader;
