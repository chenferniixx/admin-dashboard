"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EMAIL_MIN_LENGTH = 1;
const PASSWORD_MIN_LENGTH = 6;

/**
 * Hoisted RegExp for email validation
 * @see js-hoist-regexp - Hoist RegExp creation to avoid recreation on each call
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = { email?: string; password?: string; submit?: string };

function validateForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {};
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl =
    searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formErrors = validateForm(email, password);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setErrors({
          submit:
            result.error === "CredentialsSignin"
              ? "Invalid email or password."
              : result.error,
        });
        setIsLoading(false);
        return;
      }
      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }
      setErrors({ submit: "Something went wrong. Please try again." });
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (errors.password)
      setErrors((prev) => ({ ...prev, password: undefined }));
  }

  return (
    <Card className="w-full rounded-xl border border-slate-200/80 bg-white shadow-lg">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in
        </CardTitle>
        <CardDescription className="text-slate-500">
          Enter your credentials to access the dashboard.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {errors.submit && (
            <p
              className="text-sm font-medium text-red-600"
              role="alert"
            >
              {errors.submit}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              spellCheck={false}
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={
                errors.email
                  ? "border-red-500 text-red-900 focus-visible:ring-red-500/30"
                  : ""
              }
            />
            {errors.email && (
              <p
                id="login-email-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              className={
                errors.password
                  ? "border-red-500 text-red-900 focus-visible:ring-red-500/30"
                  : ""
              }
            />
            {errors.password && (
              <p
                id="login-password-error"
                className="text-sm font-medium text-red-600"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="submit"
            className="w-full font-medium"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
