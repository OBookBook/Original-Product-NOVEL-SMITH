"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { storyPages } from "./storyData";

export default function StoryBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNavButtons, setShowNavButtons] = useState(false);

  const nextPage = () => {
    if (currentPage < storyPages.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(pageIndex);
    }
  };

  const resetStory = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentPage(0);
    }
  };

  // アニメーション効果のリセット
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const progress = ((currentPage + 1) / storyPages.length) * 100;

  return (
    <div className="min-h-screen bg-neutral-50 py-8 font-sans">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl md:text-4xl font-medium text-neutral-800 tracking-wide leading-tight">
            小さな少年とAIロボットの冒険
          </h1>
          <p className="text-lg text-neutral-600 font-normal leading-relaxed">
            森の中の不思議な旅
          </p>

          {/* Progress */}
          <div className="mt-5 mx-auto max-w-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-neutral-600">
                {currentPage + 1} / {storyPages.length}
              </span>
              <span className="text-sm font-medium text-neutral-600">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress className="h-2 bg-neutral-200" value={progress} />
          </div>
        </div>

        {/* Book Page */}
        <Card className="mb-8 border border-neutral-200 shadow-lg bg-white">
          <CardContent className="p-0">
            <div
              className={`transition-all duration-400 ease-out ${
                isAnimating ? "opacity-40 scale-98" : "opacity-100 scale-100"
              }`}
            >
              <div className="flex flex-col min-h-[650px]">
                {/* Content Section - 上部 */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                  <div className="max-w-2xl mx-auto space-y-8 text-center">
                    {/* Chapter Number */}
                    <div>
                      <span className="text-sm font-semibold text-neutral-500 tracking-[0.2em] uppercase">
                        Chapter {currentPage + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 leading-tight tracking-wide">
                      {storyPages[currentPage]?.title ?? ""}
                    </h2>

                    <Separator className="mx-auto w-16 bg-neutral-300" />
                  </div>
                </div>

                {/* Illustration Section with Navigation - 中央 */}
                <div
                  className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center py-12 px-8"
                  onMouseEnter={() => setShowNavButtons(true)}
                  onMouseLeave={() => setShowNavButtons(false)}
                >
                  {/* Left Navigation Button */}
                  <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10">
                    <Button
                      className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-neutral-300
                        hover:bg-white hover:scale-125 hover:shadow-xl hover:border-neutral-400
                        active:scale-110 active:shadow-lg
                        transition-all duration-300 ease-out
                        group
                        ${/* SP: 常に表示 */ ""}
                        opacity-100 translate-x-0
                        ${/* PC: ホバーで表示 */ ""}
                        md:opacity-0 md:-translate-x-4
                        ${showNavButtons ? "md:opacity-100 md:translate-x-0" : ""}
                        ${currentPage === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={currentPage === 0 || isAnimating}
                      onClick={prevPage}
                      size="lg"
                      variant="ghost"
                    >
                      <ChevronLeft
                        className="h-5 w-5 md:h-6 md:w-6 text-neutral-700
                        group-hover:text-neutral-800 group-hover:scale-110
                        transition-all duration-300 ease-out"
                      />
                    </Button>
                  </div>

                  {/* Image */}
                  <div className="text-center">
                    <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-white rounded-full shadow-inner flex items-center justify-center border border-neutral-300 mx-auto">
                      <div className="text-6xl md:text-7xl lg:text-8xl opacity-80">
                        {storyPages[currentPage]?.illustration ?? ""}
                      </div>
                    </div>
                  </div>

                  {/* Right Navigation Button */}
                  <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10">
                    <Button
                      className={`h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-neutral-300
                        hover:bg-white hover:scale-125 hover:shadow-xl hover:border-neutral-400
                        active:scale-110 active:shadow-lg
                        transition-all duration-300 ease-out
                        group
                        ${/* SP: 常に表示 */ ""}
                        opacity-100 translate-x-0
                        ${/* PC: ホバーで表示 */ ""}
                        md:opacity-0 md:translate-x-4
                        ${showNavButtons ? "md:opacity-100 md:translate-x-0" : ""}
                        ${currentPage === storyPages.length - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={
                        currentPage === storyPages.length - 1 || isAnimating
                      }
                      onClick={nextPage}
                      size="lg"
                      variant="ghost"
                    >
                      <ChevronRight
                        className="h-5 w-5 md:h-6 md:w-6 text-neutral-700
                        group-hover:text-neutral-800 group-hover:scale-110
                        transition-all duration-300 ease-out"
                      />
                    </Button>
                  </div>

                  {/* Touch Areas for Mobile - SPでは非表示 */}
                  <div className="absolute inset-0 md:flex hidden">
                    <button
                      aria-label="前のページ"
                      className="flex-1 opacity-0 cursor-pointer"
                      disabled={currentPage === 0 || isAnimating}
                      onClick={prevPage}
                    />
                    <button
                      aria-label="次のページ"
                      className="flex-1 opacity-0 cursor-pointer"
                      disabled={
                        currentPage === storyPages.length - 1 || isAnimating
                      }
                      onClick={nextPage}
                    />
                  </div>
                </div>

                {/* Story Text Section - 下部 */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                  <div className="max-w-2xl mx-auto">
                    <div className="prose prose-neutral max-w-none">
                      <p
                        className="text-lg md:text-xl leading-relaxed text-neutral-700 font-normal tracking-wide text-left"
                        style={{ letterSpacing: "0.02em", lineHeight: "1.8" }}
                      >
                        {storyPages[currentPage]?.text ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="space-y-6">
          {/* Page Navigation */}
          <div className="flex items-center justify-center">
            <div className="flex gap-2">
              {storyPages.map((_, index) => (
                <button
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentPage
                      ? "bg-neutral-800 w-6"
                      : "bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  disabled={isAnimating}
                  key={index}
                  onClick={() => goToPage(index)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-neutral-200">
            <Button
              className="h-12 px-8 text-neutral-600 border-neutral-300 hover:bg-neutral-50 font-medium"
              disabled={isAnimating}
              onClick={resetStory}
              size="lg"
              variant="outline"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              <span className="text-base">最初から読む</span>
            </Button>

            <Button
              className="h-12 px-8 bg-neutral-800 hover:bg-neutral-900 text-white font-medium"
              onClick={() => (globalThis.location.href = "/")}
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              <span className="text-base">ホーム</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
