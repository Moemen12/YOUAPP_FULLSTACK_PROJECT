import { redirect } from "next/navigation";
import React from "react";
import { LuLogOut } from "react-icons/lu";

const LogoutBtn: React.FC = (): JSX.Element => {
  const removeTokenKey = () => {
    localStorage.removeItem("access_token");
    redirect("/auth/login");
  };
  return (
    <form action={removeTokenKey}>
      <button type="submit" className="flex items-center w-full justify-evenly">
        <span>Logout</span>
        <LuLogOut />
      </button>
    </form>
  );
};

export default LogoutBtn;
