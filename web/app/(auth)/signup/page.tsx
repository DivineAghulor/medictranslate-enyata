import Link from "next/link";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <AuthSplitLayout
      desktopVariant="heroLeft"
      title="Create an account"
      description="Enter your details to get started."
    >
      <div className="space-y-5">
        <Alert className="border-green-200 bg-green-50 p-4">
          <AlertTitle className="text-slate-900">Important</AlertTitle>
          <AlertDescription className="text-slate-600">
            Use the first &amp; last name associated with your NIN number.
          </AlertDescription>
        </Alert>

        <form className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                placeholder="Doe"
                required
              />
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
              required
            />
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
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
            />
          </div>

          <Button
            type="button"
            className="w-full bg-green-600 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-px hover:bg-green-700 hover:shadow-xl"
          >
            Create account
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
