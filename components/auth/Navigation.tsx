import Link from "next/link";

const Navigation = () => {
  return (
    <header className="shadow-lg shadow-gray-100 mb-10">
      <div className="container mx-auto flex max-w-screen-md items-center justify-between px-4">
        <Link className="cursor-pointer text-xl font-bold" href="/">
          Novel Smith
        </Link>
      </div>
    </header>
  );
};

export default Navigation;
