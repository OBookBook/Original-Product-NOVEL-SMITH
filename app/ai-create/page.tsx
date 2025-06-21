import AIBookGenerator from "@/components/ai-create/AIBookGenerator";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

export default async function AICreatePage() {
  const user = await getAuthSession();
  if (!user) redirect("/login");

  return <AIBookGenerator />;
}
