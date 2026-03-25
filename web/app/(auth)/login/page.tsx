"use client";

import Link from "next/link";
import * as React from "react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  const errors = React.useMemo(() => {
    const nextErrors: Record<string, string> = {};

    const email = values.email.trim();
    if (!email) nextErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Enter a valid email address.";

    if (!values.password) nextErrors.password = "Password is required.";

    return nextErrors;
  }, [values]);

  const showError = React.useCallback(
    (name: keyof typeof values) =>
      (submitAttempted || touched[name]) ? errors[name] : undefined,
    [errors, submitAttempted, touched]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setTouched({ email: true, password: true });

    const firstInvalidId = Object.keys(errors)[0];
    if (firstInvalidId) {
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    // TODO: wire up sign-in action
  }

  return (
    <AuthSplitLayout
      desktopVariant="heroRight"
      title="Sign in"
      description="Welcome back. Enter your details to continue."
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            aria-invalid={Boolean(showError("email"))}
            aria-describedby={showError("email") ? "email-error" : undefined}
          />
          {showError("email") ? (
            <p
              id="email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {showError("email")}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, password: event.target.value }))
            }
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            aria-invalid={Boolean(showError("password"))}
            aria-describedby={
              showError("password") ? "password-error" : undefined
            }
          />
          {showError("password") ? (
            <p
              id="password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {showError("password")}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <Checkbox id="remember" name="remember" />
            <span>Remember me</span>
          </label>
          <span className="text-sm text-slate-500">Forgot password?</span>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-px hover:bg-green-700 hover:shadow-xl"
        >
          Sign in
        </Button>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-green-700 hover:text-green-800"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
