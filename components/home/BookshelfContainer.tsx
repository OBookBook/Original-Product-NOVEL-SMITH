import React from "react";

interface BookshelfContainerProps {
  children: React.ReactNode;
}

export default function BookshelfContainer({
  children,
}: BookshelfContainerProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* モダンな背景パターン */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 opacity-30">
          <svg
            className="w-full h-full"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                height="60"
                id="grid"
                patternUnits="userSpaceOnUse"
                width="60"
              >
                <path
                  d="m 60,0 0,60 -60,0 0,-60 60,0 z"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100%" width="100%" />
          </svg>
        </div>
      </div>
      {/* 本棚の棚 */}
      <div className="relative p-4 pt-6">{children}</div>
    </div>
  );
}
