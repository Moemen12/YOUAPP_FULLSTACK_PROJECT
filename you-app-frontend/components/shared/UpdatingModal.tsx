import React from "react";

const UpdatingModal: React.FC<{ isSubmitting: boolean }> = ({
  isSubmitting,
}: {
  isSubmitting: boolean;
}): JSX.Element => {
  return (
    <>
      {isSubmitting ? (
        <div className="text-white w-full absolute min-h-lvh z-10 grid place-items-center bg-card-back">
          <div className="spinner"></div>
        </div>
      ) : null}
    </>
  );
};

export default UpdatingModal;
