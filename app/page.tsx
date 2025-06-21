import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import BookListClient from "@/components/home/BookListClient";

export default async function Page() {
  const user = await getAuthSession();
  if (!user) redirect("/login");

  return <BookListClient />;
}
