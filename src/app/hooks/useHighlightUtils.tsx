import { useToast } from "@/hooks/use-toast";
import { UseHighlightUtilsProps } from "@/types";
import { removeTrailingEmptyLine } from "@/utils/stringUtils";
import { CircleCheckBig } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const useHighlightUtils = (
  selectedBookId: string,
): UseHighlightUtilsProps => {
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(
    null,
  );
  const [copiedHighlightId, setCopiedHighlightId] = useState<string | null>(
    null,
  );

  const { toast } = useToast();
  const t = useTranslations();

  useEffect(() => {
    setActiveHighlightId(null);
    setCopiedHighlightId(null);
  }, [selectedBookId]);

  const handleCellClick = (highlightId: string): void => {
    if (highlightId === activeHighlightId) {
      setActiveHighlightId(null);
      setCopiedHighlightId(null);
    } else {
      setActiveHighlightId(highlightId);
      setCopiedHighlightId(null);
    }
  };

  const handleCopyClick = (highlightId: string, content: string): void => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedHighlightId(highlightId);
        toast({
          title: (
            <div className="flex items-center">
              <CircleCheckBig className="mr-2 size-4 text-green-500" />
              {t("copied")}
            </div>
          ),
          description: `${content.split("\n")[0].slice(0, 140)}...`,
        });
        setTimeout(() => setCopiedHighlightId(null), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const downloadHighlights: UseHighlightUtilsProps["downloadHighlights"] = (
    highlights,
    format,
    author,
    bookTitle,
  ): void => {
    const cleanedHighlights = highlights.map((highlight) =>
      removeTrailingEmptyLine(highlight.content),
    );

    let fileContent = "";
    let fileType = "";
    const fileName = `${author} - ${bookTitle}.${format}`;

    const header = `${author} - ${bookTitle}\n\n`;

    if (format === "txt") {
      fileContent = header + cleanedHighlights.join("\n\n---\n\n");
      fileType = "text/plain";
    } else if (format === "html") {
      fileContent = `<html><body><h1>${header}</h1>${cleanedHighlights
        .map(
          (content, index) =>
            `<div style='margin-bottom: 20px;'>${content.replace(/\n/g, "<br>")}</div>${
              index < cleanedHighlights.length - 1 ? "<hr>" : ""
            }`,
        )
        .join("")}</body></html>`;
      fileType = "text/html";
    } else if (format === "md") {
      fileContent = `# ${header}\n\n${cleanedHighlights
        .map((content) => `${content}`)
        .join("\n\n---\n\n")}`;
      fileType = "text/markdown";
    }

    const blob = new Blob([fileContent], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    activeHighlightId,
    copiedHighlightId,
    handleCellClick,
    handleCopyClick,
    downloadHighlights,
  };
};
