import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

type AdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <div className="min-h-screen bg-blue-950 pt-40">{children}</div>;
}
