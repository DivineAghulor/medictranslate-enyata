
"use client";

import { useRouter } from "next/navigation";
import NewConversationClient from "@/components/app/NewConversationClient";
import { Button } from "@/components/ui/button";
import { clearLoggedUser } from "@/utils/loggedUser";

export default function AppIndexPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex justify-end px-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            clearLoggedUser();
            router.push("/signup");
          }}
        >
          Logout
        </Button>
      </div>

      <NewConversationClient />
    </div>
  );
}
