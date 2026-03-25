import type { Metadata } from "next";
import "./globals.css";
import { dmSans } from "@/app/fonts";

export const metadata: Metadata = {
  title: "MedicTranslate | Understand Your Lab Results",
  description:
    "An accessible web application that helps people understand their lab test results from an image upload, translating medical terminology into clearer language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
