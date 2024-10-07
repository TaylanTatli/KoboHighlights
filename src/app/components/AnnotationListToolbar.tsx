import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadButtonsProps } from "@/types";
import { useAnnotationUtils } from "@/utils/useAnnotationUtils";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const DownloadButtons: React.FC<DownloadButtonsProps> = ({
  annotations,
  author,
  bookTitle,
}) => {
  const { downloadAnnotations } = useAnnotationUtils("");
  const t = useTranslations();

  return (
    <div className="sticky top-0 z-10 flex flex-row justify-end gap-x-2 bg-gray-600/5 p-2 dark:bg-gray-50/5">
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              <FileDown className="mr-2 h-4 w-4" />
              {t("download")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() =>
                downloadAnnotations(annotations, "md", author, bookTitle)
              }
            >
              {t("as_md")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                downloadAnnotations(annotations, "txt", author, bookTitle)
              }
            >
              {t("as_txt")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                downloadAnnotations(annotations, "html", author, bookTitle)
              }
            >
              {t("as_html")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DownloadButtons;
