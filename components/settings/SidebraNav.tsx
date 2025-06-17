"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const items = [
  { href: "/settings/profile", title: "プロフィール" },
  { href: "/settings/password", title: "パスワード変更" },
];

const SidebraNav = () => {
  const pathname = usePathname();

  return (
    <nav className={cn("flex space-x-2 md:flex-col md:space-x-0 md:space-y-1")}>
      {items.map((item) => (
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
          href={item.href}
          key={item.href}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};
export default SidebraNav;
