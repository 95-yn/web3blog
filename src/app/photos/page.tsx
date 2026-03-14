"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import BackLink from "@/components/BackLink";

const TOTAL_PHOTOS = 159;

const ALL_PHOTOS = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
  num: i + 1,
  thumb: `/photos-thumb/${String(i + 1).padStart(3, "0")}.webp`,
  full: `/photos/${String(i + 1).padStart(3, "0")}.jpg`,
}));

interface Position {
  num: number;
  thumb: string;
  full: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function PhotoGalleryPage() {
  const { language, theme, mounted } = useLanguage();
  const isDark = mounted ? theme === "dark" : true;
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  const t = {
    zh: {
      title: "照片墙",
      back: "返回",
      done: "恭喜你看完了所有图片，这里就放了这么多",
    },
    en: {
      title: "Photo Gallery",
      back: "Back",
      done: "Congratulations! You have seen all the photos",
    },
  }[language];

  const bg = isDark ? "bg-[#000000]" : "bg-[#f8f8f8]";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const overlayBg = isDark ? "bg-black/90" : "bg-black/80";

  // 计算布局
  useEffect(() => {
    const gap = 16;
    const columns =
      window.innerWidth > 1100
        ? 4
        : window.innerWidth > 700
          ? 3
          : window.innerWidth > 500
            ? 2
            : 1;
    const colWidth = (containerWidth - gap * (columns - 1)) / columns;

    const newPositions: Position[] = [];
    const colHeights = new Array(columns).fill(0);

    ALL_PHOTOS.forEach((photo) => {
      let minCol = 0;
      for (let i = 1; i < columns; i++) {
        if (colHeights[i] < colHeights[minCol]) minCol = i;
      }

      const height = colWidth * (0.8 + Math.random() * 0.6);

      newPositions.push({
        ...photo,
        top: colHeights[minCol],
        left: minCol * (colWidth + gap),
        width: colWidth,
        height,
      });

      colHeights[minCol] += height + gap;
    });

    setPositions(newPositions);
  }, [containerWidth]);

  // 监听容器宽度
  useEffect(() => {
    const updateWidth = () => {
      const el = document.querySelector(".photo-container");
      if (el) {
        setContainerWidth(el.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const containerHeight = useMemo(() => {
    if (positions.length === 0) return 2000;
    return Math.max(...positions.map((p) => p.top + p.height)) + 100;
  }, [positions]);

  return (
    <main className={`min-h-screen ${bg} py-20 px-4 md:px-6`}>
      <div className="max-w-6xl mx-auto">
        <BackLink href="/about" text={t.back} />
        <h1 className={`text-3xl font-bold ${textMain} mt-4`}>{t.title}</h1>

        <div
          className="photo-container relative mt-8"
          style={{ height: containerHeight }}
        >
          {positions.map((pos) => (
            <div
              key={pos.num}
              className="absolute cursor-pointer rounded-lg overflow-hidden group"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width,
                height: pos.height,
              }}
              onClick={() => setSelectedImg(pos.full)}
            >
              <img
                src={pos.thumb}
                alt={`Photo ${pos.num}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        {positions.length > 0 && (
          <div className="text-center py-12">
            <p className={`text-lg ${textMain}`}>🎉 {t.done}</p>
          </div>
        )}

        {selectedImg && (
          <div
            className={`fixed inset-0 z-50 ${overlayBg} flex items-center justify-center p-4 cursor-zoom-out`}
            onClick={() => setSelectedImg(null)}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImg(null);
              }}
            >
              ×
            </button>
            <img
              src={selectedImg}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        )}
      </div>
    </main>
  );
}
