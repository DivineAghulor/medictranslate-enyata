"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    nin: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);
  const [isSubmitting, startTransition] = React.useTransition();

  const errors = React.useMemo(() => {
    const nextErrors: Record<string, string> = {};

    if (!values.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!values.lastName.trim()) nextErrors.lastName = "Last name is required.";

    const nin = values.nin.trim();
    if (!nin) nextErrors.nin = "NIN number is required.";
    else if (!/^\d{11}$/.test(nin)) nextErrors.nin = "NIN must be 11 digits.";

    const email = values.email.trim();
    if (!email) nextErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = "Enter a valid email address.";

    if (!values.password) nextErrors.password = "Password is required.";
    else if (values.password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";

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
    setFormError(null);
    setFormSuccess(null);
    setTouched({
      firstName: true,
      lastName: true,
      nin: true,
      email: true,
      password: true,
    });

    const firstInvalidId = Object.keys(errors)[0];
    if (firstInvalidId) {
      document.getElementById(firstInvalidId)?.focus();
      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          await signup(
            values.email.trim(),
            values.password,
            values.nin.trim(),
            values.firstName.trim(),
            values.lastName.trim(),
          );
          setFormSuccess("Account created. You can now sign in.");
          router.push("/login");
        } catch (err) {
          setFormError(err instanceof Error ? err.message : "Signup failed.");
        }
      })();
    });
  }

  return (
    <AuthSplitLayout
      desktopVariant="heroLeft"
      title="Create an account"
      description="Enter your details to get started."
    >
      <div className="space-y-5">
        {formError ? (
          <Alert variant="destructive">
            <AlertTitle>Signup failed</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        {formSuccess ? (
          <Alert className="border-green-200 bg-green-50">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription className="text-slate-600">
              {formSuccess}
            </AlertDescription>
          </Alert>
        ) : null}

        <Alert className="border-green-200 bg-green-50 p-4">
          <AlertTitle className="text-slate-900">Important</AlertTitle>
          <AlertDescription className="text-slate-600">
            Use the first &amp; last name associated with your NIN number.
          </AlertDescription>
        </Alert>

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                placeholder="John"
                value={values.firstName}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    firstName: event.target.value,
                  }))
                }
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, firstName: true }))
                }
                aria-invalid={Boolean(showError("firstName"))}
                aria-describedby={
                  showError("firstName") ? "firstName-error" : undefined
                }
              />
              {showError("firstName") ? (
                <p
                  id="firstName-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {showError("firstName")}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                placeholder="Doe"
                value={values.lastName}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, lastName: event.target.value }))
                }
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, lastName: true }))
                }
                aria-invalid={Boolean(showError("lastName"))}
                aria-describedby={
                  showError("lastName") ? "lastName-error" : undefined
                }
              />
              {showError("lastName") ? (
                <p
                  id="lastName-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {showError("lastName")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nin">NIN number</Label>
            <Input
              id="nin"
              name="nin"
              inputMode="numeric"
              placeholder="11-digit NIN"
              autoComplete="off"
              minLength={11}
              maxLength={11}
              pattern="\\d{11}"
              value={values.nin}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, nin: event.target.value }))
              }
              onBlur={() => setTouched((prev) => ({ ...prev, nin: true }))}
              aria-invalid={Boolean(showError("nin"))}
              aria-describedby={showError("nin") ? "nin-error" : undefined}
            />
            {showError("nin") ? (
              <p id="nin-error" className="text-xs text-destructive" role="alert">
                {showError("nin")}
              </p>
            ) : null}
            <p className="text-xs text-slate-500">
              We use this to help verify your identity.
            </p>
          </div>

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
              autoComplete="new-password"
              onChange={(event) =>
                setValues((prev) => ({ ...prev, password: event.target.value }))
              }
              onBlur={() =>
                setTouched((prev) => ({ ...prev, password: true }))
              }
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

          <Button
            type="submit"
            className="w-full bg-green-600 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-px hover:bg-green-700 hover:shadow-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-green-700 hover:text-green-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
