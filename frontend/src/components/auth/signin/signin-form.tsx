"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/common/password-input";

import { signinSchema, SigninInput } from "./signin-schema";
import { useLoginMutation } from "@/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleLogin = async (values: SigninInput) => {
    try {
      const result = await login(values).unwrap();
      console.log(result);
      if (result?.statusCode === 200) {
        toast.success(result?.message || "User logged in successfully");
        router.replace("/");
      } else {
        toast.error(result?.message || "Failed to login. Please try again!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to login. Please try again!");
    }
  };

  return (
    <>
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back 👋</h2>

        <p className="text-sm text-muted-foreground">
          Sign in to continue to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>

          <Input
            id="email"
            type="email"
            autoFocus
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </>
  );
};

export default LoginForm;
