"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/common/password-input";

import { useRegisterMutation } from "@/api/auth";

import { toast } from "sonner";

import { SignupInput, signupSchema } from "./signup-schema";
import CompleteProfileDialog from "@/components/common/complete-profile-dialog";
import { useState } from "react";

const SignupForm = () => {
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [isSignupCompleted, setIsSignupCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleSignup = async (values: SignupInput) => {
    try {
      const result = await registerUser(values).unwrap();

      if (result?.statusCode === 201 || result?.statusCode === 200) {
        toast.success(result?.message || "Account created successfully.");
        setIsSignupCompleted(true);
      } else {
        toast.error(
          result?.message ?? "Failed to create account. Please try again!",
        );
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? "Failed to create account. Please try again!",
      );
    }
  };

  return (
    <>
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Create Account 🚀</h2>

        <p className="text-sm text-muted-foreground">
          Join Appify Social and start sharing today.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleSignup)} className="mt-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name
            </label>

            <Input
              id="first_name"
              autoFocus
              autoComplete="given-name"
              placeholder="John"
              disabled={isLoading}
              {...register("first_name")}
            />

            {errors.first_name && (
              <p className="text-sm text-destructive">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name
            </label>

            <Input
              id="last_name"
              autoComplete="family-name"
              placeholder="Doe"
              disabled={isLoading}
              {...register("last_name")}
            />

            {errors.last_name && (
              <p className="text-sm text-destructive">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            disabled={isLoading}
            {...register("email")}
          />

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <PasswordInput
            isDisabled={isLoading}
            errors={errors}
            name="password"
            register={register}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="h-11 w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            "Sign up"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>

      {isSignupCompleted && (
        <CompleteProfileDialog
          open={isSignupCompleted}
          setOpen={setIsSignupCompleted}
        />
      )}
    </>
  );
};

export default SignupForm;
