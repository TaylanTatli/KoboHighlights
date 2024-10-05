import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/x-sqlite3": [".sqlite"] },
    onDrop: (acceptedFiles) => {
      onFileUpload(acceptedFiles);
    },
  });
  const t = useTranslations();

  return (
    <div
      {...getRootProps()}
      className={`group relative grid h-fill w-full p-6 cursor-pointer place-items-center text-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition hover:bg-muted/50 dark:hover:bg-white/5 ${
        isDragActive ? "bg-muted/50 dark:bg-white/5 border-primary" : ""
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        {isDragActive ? (
          <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
            <div className="rounded-full border border-dashed p-3 border-muted-foreground/25">
              <Upload
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="font-medium text-muted-foreground">
              {t("drop_here")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
            <div className="rounded-full border border-dashed p-3 border-muted-foreground/25">
              <Upload
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="font-medium text-muted-foreground">
              {t.rich("drag_drop_select", {
                Badge: (chunks) => <Badge>{chunks}</Badge>,
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
