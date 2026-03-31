"use client";

import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DomeGallery from "@/components/reactbits/DomeGallery";

const TOTAL_PHOTOS = 159;

const ALL_PHOTOS = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  src: `/photos-thumb/${String(i + 1).padStart(3, "0")}.webp`,
  fullSrc: `/photos/${String(i + 1).padStart(3, "0")}.jpg`,
  alt: `Photo ${i + 1}`,
}));

export default function PhotoGalleryPage() {
  const { theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;

  const blurColor = isDark ? "#000000" : "#f8f8f8";
  const images = useMemo(() => ALL_PHOTOS, []);

  return (
    <div className={`h-screen w-screen overflow-hidden ${isDark ? "bg-black" : "bg-[#f8f8f8]"}`}>
      <DomeGallery
        images={images}
        overlayBlurColor={blurColor}
        grayscale={false}
        imageBorderRadius="8px"
        openedImageBorderRadius="12px"
        fit={0.5}
        segments={35}
        dragDampening={2}
        maxVerticalRotationDeg={6}
        autoRotateSpeed={3}
      />
    </div>
  );
}
