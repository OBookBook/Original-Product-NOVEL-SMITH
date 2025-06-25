import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 lg:hidden z-50">
      <Link href="/ai-create">
        <Button className="bg-gray-900 hover:bg-black text-white shadow-2xl rounded-full w-14 h-14 p-0">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
