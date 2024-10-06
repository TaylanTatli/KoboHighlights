import { useToast } from "@/hooks/use-toast";
import { Annotation } from "@/types";
import { CircleCheckBig } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const useAnnotationUtils = (selectedBookId: string) => {
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null,
  );
  const [copiedAnnotationId, setCopiedAnnotationId] = useState<string | null>(
    null,
  );

  const { toast } = useToast();
  const t = useTranslations();

  useEffect(() => {
    setActiveAnnotationId(null);
    setCopiedAnnotationId(null);
  }, [selectedBookId]);

  const removeTrailingEmptyLine = (content: string) => {
    const lines = content.split("\n");
    const trimmedLines = lines.map((line) => line.trim());
    while (
      trimmedLines.length > 0 &&
      trimmedLines[trimmedLines.length - 1] === ""
    ) {
      trimmedLines.pop();
    }
    return trimmedLines.join("\n");
  };

  const handleCellClick = (annotationId: string) => {
    if (annotationId === activeAnnotationId) {
      setActiveAnnotationId(null);
      setCopiedAnnotationId(null);
    } else {
      setActiveAnnotationId(annotationId);
      setCopiedAnnotationId(null);
    }
  };

  const handleCopyClick = (annotationId: string, content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedAnnotationId(annotationId);
        toast({
          title: (
            <div className="flex items-center">
              <CircleCheckBig className="mr-2 h-4 w-4 text-green-500" />
              {t("copied")}
            </div>
          ),
          description: `${content.split("\n")[0]}...`,
        });
        setTimeout(() => setCopiedAnnotationId(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const downloadAnnotations = (
    annotations: Annotation[],
    format: "txt" | "html",
    author: string,
    bookTitle: string,
  ) => {
    const cleanedAnnotations = annotations.map((annotation) =>
      removeTrailingEmptyLine(annotation.content),
    );

    let fileContent = "";
    let fileType = "";

    const header = `${author} - ${bookTitle}\n\n`;

    if (format === "txt") {
      fileContent = header + cleanedAnnotations.join("\n\n---\n\n");
      fileType = "text/plain";
    } else if (format === "html") {
      fileContent = `<html><body><h1>${author} - ${bookTitle}</h1>${cleanedAnnotations
        .map(
          (content) =>
            `<div style='margin-bottom: 20px;'>${content.replace(/\n/g, "<br>")}</div>`,
        )
        .join("")}</body></html>`;
      fileType = "text/html";
    }

    const blob = new Blob([fileContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annotations.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    activeAnnotationId,
    copiedAnnotationId,
    setActiveAnnotationId,
    setCopiedAnnotationId,
    removeTrailingEmptyLine,
    handleCellClick,
    handleCopyClick,
    downloadAnnotations,
  };
};
