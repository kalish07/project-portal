import React from "react";
import MentorReview from "./MentorReview";

const MentorReviewsSection = ({
  zerothReview,
  setZerothReview,
  firstReview,
  setFirstReview,
  secondReview,
  setSecondReview,
  editingZeroth,
  setEditingZeroth,
  submittingZeroth,
  setSubmittingZeroth,
  editingFirst,
  setEditingFirst,
  submittingFirst,
  setSubmittingFirst,
  editingSecond,
  setEditingSecond,
  submittingSecond,
  setSubmittingSecond,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <MentorReview
        label="Zeroth Review"
        value={zerothReview}
        setter={setZerothReview}
        editing={editingZeroth}
        setEditing={setEditingZeroth}
        submitting={submittingZeroth}
        setSubmitting={setSubmittingZeroth}
      />
      <MentorReview
        label="First Review"
        value={firstReview}
        setter={setFirstReview}
        editing={editingFirst}
        setEditing={setEditingFirst}
        submitting={submittingFirst}
        setSubmitting={setSubmittingFirst}
      />
      <MentorReview
        label="Second Review"
        value={secondReview}
        setter={setSecondReview}
        editing={editingSecond}
        setEditing={setEditingSecond}
        submitting={submittingSecond}
        setSubmitting={setSubmittingSecond}
      />
    </div>
  );
};

export default MentorReviewsSection;
