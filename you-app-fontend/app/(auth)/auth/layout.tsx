import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-5 bg-custom-gradient h-screen flex flex-col gap-20">
      {children}
    </div>
  );
};

export default AuthLayout;
