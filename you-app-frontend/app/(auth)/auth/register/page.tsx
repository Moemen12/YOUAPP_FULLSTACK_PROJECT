import AuthForm from "@/components/shared/Form";
import { NextPage } from "next";
import React from "react";

const Register: NextPage = (): JSX.Element => {
  return (
    <>
      <AuthForm type="register" />
    </>
  );
};

export default Register;
