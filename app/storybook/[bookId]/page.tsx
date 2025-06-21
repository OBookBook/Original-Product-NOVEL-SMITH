import StoryBook from "@/components/storybook/StoryBook";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ bookId: string }>;
}

export default async function BookPage({ params }: PageProps) {
  const user = await getAuthSession();
  if (!user) redirect("/login");

  const { bookId } = await params;

  return (
    <div className="min-h-screen font-sans antialiased">
      <StoryBook bookId={bookId} />
    </div>
  );
}
