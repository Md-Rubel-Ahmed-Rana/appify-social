"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./schema";

type ImageUploadProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
};

const ImageUpload = <T extends FieldValues>({
  control,
  name,
  disabled,
}: ImageUploadProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const updateImage = (file?: File) => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }

          if (!file) {
            setPreviewUrl(null);
            field.onChange(undefined);
            return;
          }

          setPreviewUrl(URL.createObjectURL(file));
          field.onChange(file);
        };

        const handleFile = (file?: File) => {
          if (!file) return;

          if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
            field.onChange(undefined);
            return;
          }

          if (file.size > MAX_IMAGE_SIZE) {
            field.onChange(undefined);
            return;
          }

          updateImage(file);
        };

        const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
          handleFile(e.target.files?.[0]);
        };

        const onDrop = (e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();

          if (disabled) return;

          handleFile(e.dataTransfer.files?.[0]);
        };

        return (
          <div className="space-y-3">
            <input
              ref={inputRef}
              hidden
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onInputChange}
            />

            {!previewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-8 transition hover:bg-muted/40"
              >
                <ImagePlus className="mb-3 size-8 text-muted-foreground" />

                <p className="font-medium">Upload an image</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Click or drag & drop
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  PNG • JPG • WEBP (Max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-xl border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-105 w-full object-cover"
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  disabled={disabled}
                  onClick={() => updateImage(undefined)}
                  className="absolute right-3 top-3"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}

            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default ImageUpload;
