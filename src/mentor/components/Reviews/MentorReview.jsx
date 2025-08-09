import React, { useState, useEffect } from "react";

const MentorReview = ({
  label,
  value,
  setter,
  editing,
  setEditing,
  submitting,
  setSubmitting,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = () => {
    if (inputValue !== value) {
      setter(inputValue);
      setSubmitting(true);
      setTimeout(() => {
        setEditing(false);
        setSubmitting(false);
      }, 800);
    } else {
      setEditing(false);
    }
  };

  // Calculate percentage for progress bar (0-5 scale to 0-100%)
  const progressPercentage = (value / 5) * 100;

  return (
    <div 
      className={`relative bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 ${
        isHovered && !editing ? "shadow-md border-indigo-200" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-base font-medium text-gray-700">{label}</h4>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                max={5}
                step="0.5"  // Allow half-point increments
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Math.min(5, Math.max(0, Number(e.target.value)));
                  setInputValue(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="0"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
              <span className="text-gray-500">/ 5</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setInputValue(value);
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="text-3xl font-bold text-indigo-700">{value}</div>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">/ 5</div>
          </div>
        )}

        {submitting && (
          <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorReview;