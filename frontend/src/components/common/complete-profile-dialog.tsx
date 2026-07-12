"use client";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  completeProfileSchema,
  CompleteProfileInput,
} from "./complete-profile-schema";

import { toast } from "sonner";
import { useUpdateProfileMutation } from "@/api/auth";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const CompleteProfileDialog = ({ open, setOpen }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema) as any,
    defaultValues: {
      bio: "",
    },
  });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [preview, setPreview] = useState("");
  const router = useRouter();

  const handleSelectAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("avatar", file, {
      shouldValidate: true,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (values: CompleteProfileInput) => {
    try {
      const formdata = new FormData();
      formdata.append("avatar", values.avatar as File);
      formdata.append("bio", values.bio as string);

      const result = await updateProfile(formdata).unwrap();

      if (result?.statusCode === 200) {
        toast.success(result?.message || "Profile updated successfully.");
      }

      setOpen(false);
      router.replace("/");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    router.replace("/");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">
            👋 Complete Your Profile
          </DialogTitle>

          <DialogDescription>
            Add a profile picture and short bio.
            <br />
            You can always update them later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleSelectAvatar}
              className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/40 transition hover:border-primary"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <Camera className="h-8 w-8 text-muted-foreground transition group-hover:text-primary" />
              )}
            </button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAvatar}
            >
              {preview ? "Change Photo" : "Upload Photo"}
            </Button>
            {errors.avatar && (
              <p className="text-center text-sm text-destructive">
                {errors.avatar.message}
              </p>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              {...register("avatar")}
              ref={(e) => {
                register("avatar").ref(e);
                fileInputRef.current = e;
              }}
              onChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-2">
            <Input
              maxLength={30}
              placeholder="Add bio (e.g. Software Engineer)"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={handleClose}
            >
              Skip for now
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              {isLoading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileDialog;
