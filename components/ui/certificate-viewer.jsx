"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function CertificateViewer({ images }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === "ArrowRight")
        setIndex((i) => (i + 1) % images.length);
      if (event.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, images.length]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:text-ink"
        aria-haspopup="dialog"
      >
        View certificate
        <ChevronRight aria-hidden="true" size={12} />
      </button>

      <dialog
        ref={dialogRef}
        onCancel={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="m-auto w-[min(92vw,880px)] border border-line bg-surface p-0 text-ink backdrop:bg-black/70"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Certificate {index + 1} of {images.length}
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative">
          <Image
            src={images[index]}
            alt={`Certificate scan ${index + 1}`}
            width={1584}
            height={1224}
            className="aspect-[1584/1224] w-full bg-ink object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setIndex((i) => (i - 1 + images.length) % images.length)
                }
                className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/90 text-ink transition-colors hover:border-accent hover:text-accent"
                aria-label="Previous certificate"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface/90 text-ink transition-colors hover:border-accent hover:text-accent"
                aria-label="Next certificate"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}