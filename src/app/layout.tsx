import "@/styles/globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "readdit",
  description: "A Reddit clone.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("bg-white light text-slate-900 antialiased", inter)}
    >
      <body className="bg-slate-50 antialiased min-h-screen w-screen">
        <Provider>
          {/* @ts-expect-error async server component */}
          <Navbar />
          <div className="h-full w-full min-w-screen  pt-12">{children}</div>
        </Provider>
        <Toaster />{" "}
      </body>
    </html>
  );
}
