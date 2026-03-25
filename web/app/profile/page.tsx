import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Basic account details for MedicTranslate.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/app">Back to dashboard</Link>
          </Button>
        </div>

        <div className="mt-8 rounded-[var(--radius)] border border-border bg-card p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Full name
              </label>
              <Input defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">
                Email
              </label>
              <Input defaultValue="jane.doe@example.com" type="email" />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">
              What you want to improve
            </label>
            <Input defaultValue="Clearer explanations for lab results" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              className="bg-green-600 font-semibold text-white hover:bg-green-700"
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
