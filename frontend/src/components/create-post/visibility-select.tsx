"use client";

import { Globe2, Lock } from "lucide-react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { POST_VISIBILITY } from "./schema";

type VisibilitySelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
};

const visibilityOptions = [
  {
    value: POST_VISIBILITY.PUBLIC,
    label: "Public",
    description: "Everyone can see this post.",
    icon: Globe2,
  },
  {
    value: POST_VISIBILITY.PRIVATE,
    label: "Private",
    description: "Only you can see this post.",
    icon: Lock,
  },
] as const;

const VisibilitySelect = <T extends FieldValues>({
  control,
  name,
  disabled,
}: VisibilitySelectProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selected =
          visibilityOptions.find((item) => item.value === field.value) ??
          visibilityOptions[0];

        const SelectedIcon = selected.icon;

        return (
          <div className="space-y-1">
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-fit min-w-36 rounded-full">
                <div className="flex items-center gap-2">
                  <SelectedIcon className="size-4 text-muted-foreground" />
                  <span>{selected.label}</span>
                </div>
              </SelectTrigger>

              <SelectContent>
                {visibilityOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              {selected.description}
            </p>
          </div>
        );
      }}
    />
  );
};

export default VisibilitySelect;
