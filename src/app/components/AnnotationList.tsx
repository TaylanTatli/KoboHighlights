import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Annotation } from "@/types";
import { CircleCheckBig, Clipboard, ClipboardCheck } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface AnnotationListProps {
  annotations: Annotation[];
  selectedBookId: string;
}

const AnnotationList: React.FC<AnnotationListProps> = ({
  annotations,
  selectedBookId,
}) => {
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null,
  );
  const [copiedAnnotationId, setCopiedAnnotationId] = useState<string | null>(
    null,
  );

  const { toast } = useToast();

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

  const t = useTranslations();

  return (
    <ScrollArea className="annotations h-full w-full p-0">
      <Table className="text-base">
        <TableBody>
          {annotations.length > 0 &&
            annotations.map((annotation, index) => (
              <React.Fragment key={annotation.id}>
                <TableRow>
                  <TableCell className="w-0 text-center text-sm text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className="relative cursor-pointer whitespace-pre-line border-l py-3"
                    onClick={() => handleCellClick(annotation.id)}
                  >
                    {removeTrailingEmptyLine(annotation.content)}
                    <div
                      className={`flex items-center transition-all duration-300 ease-in-out ${
                        activeAnnotationId === annotation.id
                          ? "mt-2 max-h-20 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-7 w-7"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyClick(
                                  annotation.id,
                                  removeTrailingEmptyLine(annotation.content),
                                );
                              }}
                            >
                              {copiedAnnotationId === annotation.id ? (
                                <ClipboardCheck className="h-4 w-4 stroke-green-500" />
                              ) : (
                                <Clipboard className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={8}>
                            <p>{t("copy_to_clipboard")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AnnotationList;
