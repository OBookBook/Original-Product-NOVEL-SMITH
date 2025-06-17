"use client";

import { type User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface UserNavigationProps {
  user: User;
}

const UserNavigation = ({ user }: UserNavigationProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            alt={user.name ?? "avatar"}
            className="rounded-full object-cover"
            fill
            src={user.image ?? "/default.png"}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white p-2 w-[300px]">
        <DropdownMenuItem className="cursor-pointer">
          <div className="break-words min-w-0">
            <div className="mb-2">{user.name ?? ""}</div>
            <div className="text-gray-500">{user.email ?? ""}</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <Link href="/settings/profile">
          <DropdownMenuItem className="cursor-pointer">
            アカウント設定
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault();
            await signOut({ callbackUrl: "/" });
          }}
        >
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNavigation;
