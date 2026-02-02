import { createEffect, createResource, createSignal, For, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { getGalleryImages } from "../api/gallery";

const defaultImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&q=80",
    alt: "Lion",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=600&q=80",
    alt: "Giraffe",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=80",
    alt: "Elephant",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&q=80",
    alt: "Bears",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&q=80",
    alt: "Zebra",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1463501810073-6e31c827a9bc?w=600&q=80",
    alt: "Penguin",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?w=600&q=80",
    alt: "Tiger",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    alt: "Panda",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    alt: "Flamingo",
  },
];

export default function Gallery() {
  const [images] = createResource(getGalleryImages);
  const [lightboxIndex, setLightboxIndex] = createSignal<number | null>(null);

  const displayImages = () => {
    const apiImages = images();
    return apiImages?.length ? apiImages : defaultImages;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  };

  const goToPrev = () => {
    const current = lightboxIndex();
    if (current !== null) {
      const newIndex = current === 0 ? displayImages().length - 1 : current - 1;
      setLightboxIndex(newIndex);
    }
  };

  const goToNext = () => {
    const current = lightboxIndex();
    if (current !== null) {
      const newIndex = current === displayImages().length - 1 ? 0 : current + 1;
      setLightboxIndex(newIndex);
    }
  };

  createEffect(() => {
    if (lightboxIndex() !== null) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") goToPrev();
        if (e.key === "ArrowRight") goToNext();
      };
      document.addEventListener("keydown", handleKeyDown);
      onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
    }
  });

  return (
    <div class="page">
      <div class="header">
        <h1 class="title">Photo Gallery</h1>
        <p class="subtitle">Explore our collection of beautiful wildlife photos</p>
      </div>

      <Show when={!images.loading} fallback={<div class="emptyState">Loading gallery...</div>}>
        <div class="grid">
          <For each={displayImages()}>
            {(image, index) => (
              <div class="imageCard" onClick={() => openLightbox(index())}>
                <img src={image.url} alt={image.alt} class="image" loading="lazy" />
                <div class="imageOverlay">
                  <span class="imageAlt">{image.alt}</span>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={lightboxIndex() !== null}>
        <Portal>
          <div class="lightbox" onClick={closeLightbox}>
            <button class="lightboxClose" onClick={closeLightbox} aria-label="Close lightbox">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <button
              class="lightboxNav lightboxPrev"
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <img
              src={displayImages()[lightboxIndex()!].url.replace("w=600", "w=1200")}
              alt={displayImages()[lightboxIndex()!].alt}
              class="lightboxImage"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              class="lightboxNav lightboxNext"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </Portal>
      </Show>
    </div>
  );
}
