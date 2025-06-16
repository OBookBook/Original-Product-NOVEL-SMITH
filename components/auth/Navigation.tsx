import Link from "next/link";
import { type Session } from "next-auth";

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
      </div>
    </header>
  );
};

export default Navigation;
