import Link from "next/link";
import { type Session } from "next-auth";
import { Button } from "@/components/ui/button";
import UserNavigation from "@/components/auth/UserNavigation";

interface NavigationProps {
  user: null | Session | undefined;
}

const Navigation = ({ user }: NavigationProps) => {
  console.log(user);

  return (
    <header className="shadow-lg shadow-gray-100 mb-10">
      <div className="container mx-auto flex max-w-screen-md items-center justify-between px-4 py-4">
        <Link className="cursor-pointer text-xl font-bold" href="/">
          Novel Smith
        </Link>

        {user ? (
          <UserNavigation user={user} />
        ) : (
          <div className="flex items-center space-x-1">
            <Button asChild className="font-bold" variant="ghost">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild className="font-bold" variant="default">
              <Link href="/signup">新規登録</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
