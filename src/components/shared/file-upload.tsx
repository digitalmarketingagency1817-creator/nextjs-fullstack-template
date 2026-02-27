"use client";

import { upload } from "@vercel/blob/client";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
  accept?: string;
  handleUploadUrl?: string;
}

export function FileUpload({
  onUploadComplete,
  accept = "image/*",
  handleUploadUrl = "/api/upload",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (file: File) => {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl,
      });
      return blob.url;
    },
    onSuccess: (url) => {
      onUploadComplete?.(url);
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  const handleUpload = () => {
    const file = inputRef.current?.files?.[0];
    if (file) mutate(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input ref={inputRef} type="file" accept={accept} disabled={isPending} />
        <Button onClick={handleUpload} disabled={isPending} size="sm">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
      {isError && (
        <p className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error instanceof Error ? error.message : "Upload failed"}
        </p>
      )}
    </div>
  );
}
