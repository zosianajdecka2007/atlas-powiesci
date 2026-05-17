"use client";

import { ArrowDown, ArrowUp, ImageIcon, Star, Trash2, UploadCloud } from "lucide-react";
import type { ElementType } from "react";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { NodeImage, NodeImageKind } from "@/lib/types";

type ImageManagerProps = {
  nodeId: string;
  images: NodeImage[];
  onChange: (images: NodeImage[]) => void;
};

const imageKinds: { value: NodeImageKind; label: string }[] = [
  { value: "avatar", label: "Avatar" },
  { value: "cover", label: "Okładka node’a" },
  { value: "gallery", label: "Galeria" },
  { value: "moodboard", label: "Moodboard" },
  { value: "inspiration", label: "Inspiracja" }
];

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageManager({ nodeId, images, onChange }: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const addFiles = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const nextImages: NodeImage[] = [];

    for (const file of selectedFiles) {
      const id = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      let url = await fileToDataUrl(file);
      let storagePath: string | undefined;

      if (supabase) {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (user) {
          storagePath = `${user.id}/${nodeId}/${id}-${file.name}`;
          const { error } = await supabase.storage.from("node-assets").upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false
          });

          if (!error) {
            const { data } = await supabase.storage.from("node-assets").createSignedUrl(storagePath, 60 * 60 * 24 * 7);
            url = data?.signedUrl ?? url;
          }
        }
      }

      nextImages.push({
        id,
        url,
        storagePath,
        kind: images.length === 0 && nextImages.length === 0 ? "avatar" : "gallery",
        caption: "",
        tags: [],
        isPrimary: images.length === 0 && nextImages.length === 0,
        order: images.length + nextImages.length,
        createdAt: timestamp
      });
    }

    onChange([...images, ...nextImages]);
    setUploading(false);
  };

  const updateImage = (imageId: string, patch: Partial<NodeImage>) => {
    onChange(images.map((image) => (image.id === imageId ? { ...image, ...patch } : image)));
  };

  const deleteImage = async (image: NodeImage) => {
    if (supabase && image.storagePath) {
      await supabase.storage.from("node-assets").remove([image.storagePath]);
    }
    const remaining = images.filter((item) => item.id !== image.id).map((item, index) => ({ ...item, order: index }));
    onChange(remaining);
  };

  const moveImage = (imageId: string, direction: -1 | 1) => {
    const current = [...sortedImages];
    const index = current.findIndex((image) => image.id === imageId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return;
    const [item] = current.splice(index, 1);
    current.splice(nextIndex, 0, item);
    onChange(current.map((image, order) => ({ ...image, order })));
  };

  const markPrimary = (imageId: string) => {
    onChange(images.map((image) => ({ ...image, isPrimary: image.id === imageId })));
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files) void addFiles(event.target.files);
          event.currentTarget.value = "";
        }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          void addFiles(event.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition ${
          dragActive ? "border-wine bg-wine/5" : "border-ink/15 bg-white/70 dark:border-paper/15 dark:bg-[#242424]/70"
        }`}
      >
        <UploadCloud size={24} className="mb-2 text-wine" />
        <span className="text-sm font-medium">{uploading ? "Wysyłanie zdjęć..." : "Dodaj lub przeciągnij zdjęcia"}</span>
        <span className="mt-1 text-xs text-ink/50 dark:text-paper/50">Avatar, okładka, galeria, inspiracje i moodboard node’a</span>
      </button>

      {sortedImages.length === 0 ? (
        <div className="rounded-lg border border-ink/10 bg-white/65 p-5 text-center text-sm text-ink/50 dark:border-paper/10 dark:bg-[#242424]/65 dark:text-paper/50">
          <ImageIcon size={22} className="mx-auto mb-2" />
          Brak zdjęć w tym node’ie.
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedImages.map((image, index) => (
            <article key={image.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white dark:border-paper/10 dark:bg-[#242424]">
              <div className="relative aspect-[16/9] bg-ink/5 dark:bg-paper/5">
                <img src={image.url} alt={image.caption || "Zdjęcie node’a"} className="h-full w-full object-cover" />
                {image.isPrimary && (
                  <span className="absolute left-3 top-3 rounded-full bg-wine px-2.5 py-1 text-xs font-medium text-white">
                    Główne
                  </span>
                )}
              </div>
              <div className="space-y-3 p-3">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <select
                    value={image.kind}
                    onChange={(event) => updateImage(image.id, { kind: event.target.value as NodeImageKind })}
                    className="rounded-md border border-ink/10 bg-porcelain px-2 py-2 text-xs outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
                  >
                    {imageKinds.map((kind) => (
                      <option key={kind.value} value={kind.value}>
                        {kind.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    <IconButton label="Przenieś wyżej" onClick={() => moveImage(image.id, -1)} disabled={index === 0} icon={ArrowUp} />
                    <IconButton label="Przenieś niżej" onClick={() => moveImage(image.id, 1)} disabled={index === sortedImages.length - 1} icon={ArrowDown} />
                    <IconButton label="Oznacz jako główne" onClick={() => markPrimary(image.id)} icon={Star} />
                    <IconButton label="Usuń zdjęcie" onClick={() => void deleteImage(image)} icon={Trash2} danger />
                  </div>
                </div>

                <input
                  value={image.caption}
                  onChange={(event) => updateImage(image.id, { caption: event.target.value })}
                  placeholder="Podpis pod zdjęciem"
                  className="w-full rounded-md border border-ink/10 bg-porcelain px-3 py-2 text-xs outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
                />
                <input
                  value={image.tags.join(", ")}
                  onChange={(event) =>
                    updateImage(image.id, {
                      tags: event.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                    })
                  }
                  placeholder="Tagi zdjęcia, po przecinku"
                  className="w-full rounded-md border border-ink/10 bg-porcelain px-3 py-2 text-xs outline-none focus:border-wine dark:border-paper/10 dark:bg-[#1b1b1b]"
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function IconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  danger
}: {
  icon: ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid size-8 place-items-center rounded-md border border-ink/10 transition disabled:cursor-not-allowed disabled:opacity-35 dark:border-paper/10 ${
        danger ? "text-wine hover:bg-wine hover:text-white" : "hover:border-wine hover:text-wine"
      }`}
    >
      <Icon size={14} />
    </button>
  );
}
