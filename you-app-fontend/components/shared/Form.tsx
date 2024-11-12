"use client";
import { LoginSchema, RegisterSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import SharedInput from "./Input";
import { AuthResponse, ErrorShape, FormType } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DefaultLoginValues, DefaultRegisterValues } from "@/lib/constants";

import { AxiosError, AxiosResponse } from "axios";
import { useMutation } from "react-query";

import dynamic from "next/dynamic";
import { axiosInstance } from "@/lib/axios/axios-instance";

const RiArrowLeftSLine = dynamic(
  () => import("react-icons/ri").then((icon) => icon.RiArrowLeftSLine),
  {
    ssr: false,
  }
);

const AuthForm: React.FC<{ type: FormType }> = ({ type }): JSX.Element => {
  const router = useRouter();

  const form = useForm<
    z.infer<typeof RegisterSchema> | z.infer<typeof LoginSchema>
  >({
    resolver: zodResolver(type === "register" ? RegisterSchema : LoginSchema),
    defaultValues:
      type === "register" ? DefaultRegisterValues : DefaultLoginValues,
    mode: "onChange",
  });

  const { isValid } = form.formState;

  const mutation = useMutation<
    AxiosResponse<AuthResponse>,
    AxiosError<ErrorShape>,
    z.infer<typeof RegisterSchema> | z.infer<typeof LoginSchema>
  >({
    mutationFn: (data) => {
      return axiosInstance.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${type}`,
        data
      );
    },
    onSuccess: (res) => {
      localStorage.setItem("access_token", res.data.access_token);

      router.push("/");
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          form.setError(key as keyof typeof form.formState.errors, {
            type: "manual",
            message: Array.isArray(value) ? value[0] : value,
          });
        });
      }
    },
  });
  function onSubmit(
    values: z.infer<typeof RegisterSchema> | z.infer<typeof LoginSchema>
  ) {
    mutation.mutate(values);
  }

  return (
    <>
      <button
        className="text-white flex items-center text-sm mt-14 focus-visible:outline-none"
        onClick={() => router.back()}
      >
        <RiArrowLeftSLine color="white" size={"1.5rem"} />
        Back
      </button>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <h3 className="text-white capitalize font-bold text-2xl mb-3">
            {type}
          </h3>
          <SharedInput
            type="email"
            form={form.control}
            placeholder="enter email"
            name="email"
            className="!bg-input-back h-12 text-white placeholder:text-[#8b979c] text-sm placeholder:text-sm border-none"
          />
          {type === "register" && (
            <SharedInput
              type="text"
              name="username"
              form={form.control}
              placeholder="create username"
              className="bg-input-back h-12 text-white placeholder:text-[#8b979c] text-sm placeholder:text-sm border-none"
            />
          )}
          <SharedInput
            type="password"
            name="password"
            form={form.control}
            placeholder="create password"
            className="bg-input-back h-12 text-white placeholder:text-[#8b979c] text-sm placeholder:text-sm border-none"
          />
          {type === "register" && (
            <SharedInput
              name="password_confirmation"
              type="password"
              form={form.control}
              placeholder="confirm password"
              className="bg-input-back h-12 text-white placeholder:text-[#8b979c] text-sm placeholder:text-sm border-none"
            />
          )}
          <Button
            type="submit"
            className={`w-full h-12 text-sm font-medium mt-4 ${
              isValid && !mutation.isLoading
                ? "bg-valid-btn text-white font-semibold shadow-[#459ADA] shadow-lg"
                : "bg-invalid-btn text-slate-300"
            }`}
            disabled={!isValid || mutation.isLoading}
          >
            {mutation.isLoading
              ? type === "register"
                ? "Registering..."
                : "Logging in..."
              : type === "register"
              ? "Register"
              : "Login"}
          </Button>
          {mutation.isError && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {mutation.error.response?.data.message ||
                "An error occurred. Please try again."}
            </p>
          )}
          <p className="text-sm flex items-center justify-center gap-2 mt-6">
            <span className="text-white">
              {type === "register" ? "Have an account?" : "No account"}
            </span>
            <Link
              href={type === "register" ? "/auth/login" : "/auth/register"}
              className="underline bg-special-gold bg-clip-text text-transparent decoration-yellow-700"
            >
              {type === "register" ? "Login" : "Register"} here
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
};

export default AuthForm;
