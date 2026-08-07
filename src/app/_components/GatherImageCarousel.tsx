"use client";

import { useEffect, useState } from "react";

type GatherImage = {
  id: string;
  imageUrl: string;
};

type GatherImageCarouselProps = {
  images: GatherImage[];
  title: string;
};

export function GatherImageCarousel({
  images,
  title,
}: GatherImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || paused) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((current) =>
        current + 1 >= images.length ? 0 : current + 1,
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [images.length, paused]);

  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, images.length]);

  function previousImage() {
    setCurrentIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function nextImage() {
    setCurrentIndex((current) =>
      current + 1 >= images.length ? 0 : current + 1,
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        No image available
      </div>
    );
  }

  const currentImage = images[currentIndex];

  if (!currentImage) {
    return null;
  }

  return (
    <div
      className="relative h-72 overflow-hidden rounded-lg bg-gray-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        role="img"
        aria-label={`${title} image ${currentIndex + 1}`}
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url(${JSON.stringify(currentImage.imageUrl)})`,
        }}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={previousImage}
            aria-label="Previous image"
            className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition hover:bg-black/70"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition hover:bg-black/70"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show image ${index + 1}`}
                className={`h-2.5 rounded-full transition ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
