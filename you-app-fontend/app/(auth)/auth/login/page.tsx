import AuthForm from "@/components/shared/Form";
import { NextPage } from "next";
import React from "react";

const Login: NextPage = (): JSX.Element => {
  return (
    <>
      <AuthForm type="login" />
    </>
  );
};

export default Login;
