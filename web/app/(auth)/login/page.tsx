import Link from "next/link";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <AuthSplitLayout
      desktopVariant="heroRight"
      title="Sign in"
      description="Welcome back. Enter your details to continue."
    >
      <form className="space-y-5">
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
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <Checkbox id="remember" name="remember" />
            <span>Remember me</span>
          </label>
          <span className="text-sm text-slate-500">Forgot password?</span>
        </div>

        <Button
          type="button"
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
