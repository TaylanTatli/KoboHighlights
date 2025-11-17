import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { FileUploadProps } from "@/types";
import { useMediaQuery } from "@/utils/useMediaQuery";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isDatabaseLoaded,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.sqlite3": [".sqlite"],
      "application/sqlite3": [".sqlite"],
      "application/x-sqlite3": [".sqlite"],
      "application/octet-stream": [".sqlite"],
      "text/plain": [".txt"],
    },
    onDrop: (acceptedFiles) => {
      if (isDatabaseLoaded) {
        setFilesToUpload(acceptedFiles);
        setShowDialog(true);
      } else {
        onFileUpload(acceptedFiles);
      }
    },
  });
  const t = useTranslations();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleConfirmUpload = () => {
    onFileUpload(filesToUpload);
    setShowDialog(false);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`h-fill group border-muted-foreground/25 hover:bg-muted/50 relative grid w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed text-center transition dark:hover:bg-white/5 ${
          isDragActive ? "border-primary bg-muted/50 dark:bg-white/5" : ""
        } ${isMobile ? "p-2" : "p-6"}`}
      >
        <input {...getInputProps()} />
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
          {isMobile ? (
            <div className="flex flex-row items-center gap-2 px-5">
              <div className="p-0">
                <Upload
                  className="text-muted-foreground size-5"
                  aria-hidden="true"
                />
              </div>
              <p className="text-muted-foreground font-medium">
                {t("drop_here_mobile")}
              </p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <div className="border-muted-foreground/25 rounded-full border border-dashed p-3">
                <Upload
                  className="text-muted-foreground size-5"
                  aria-hidden="true"
                />
              </div>
              <p className="text-muted-foreground font-medium">
                {t("drop_here")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
              <div className="border-muted-foreground/25 rounded-full border border-dashed p-3">
                <Upload
                  className="text-muted-foreground size-5"
                  aria-hidden="true"
                />
              </div>
              <p className="text-muted-foreground font-medium">
                {t.rich("drag_drop_select", {
                  Badge: (chunks) => <Badge>{chunks}</Badge>,
                })}
              </p>
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleConfirmUpload}
      />
    </div>
  );
};

export default FileUpload;
