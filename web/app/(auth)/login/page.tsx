"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, useState, useTransition } from "react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  const errors = useMemo(() => {
    const nextErrors: Record<string, string> = {};

    const email = values.email.trim();
    if (!email) nextErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Enter a valid email address.";

    if (!values.password) nextErrors.password = "Password is required.";

    return nextErrors;
  }, [values]);

  const showError = useCallback(
    (name: keyof typeof values) =>
      submitAttempted || touched[name] ? errors[name] : undefined,
    [errors, submitAttempted, touched],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);
    setFormError(null);
    setTouched({ email: true, password: true });

    const firstInvalidId = Object.keys(errors)[0];
    if (firstInvalidId) {
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          await login(values.email.trim(), values.password);
          router.push("/app");
        } catch (err) {
          setFormError(err instanceof Error ? err.message : "Login failed.");
        }
      })();
    });
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

        {formError ? (
          <Alert variant="destructive">
            <AlertTitle>Sign-in failed</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="submit"
          className="w-full bg-green-600 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-px hover:bg-green-700 hover:shadow-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
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
