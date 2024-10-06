import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Annotation } from "@/types";
import { useAnnotationUtils } from "@/utils/useAnnotationUtils";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Separator } from "./ui/separator";

interface AnnotationListProps {
  annotations: Annotation[];
  selectedBookId: string;
  author: string;
  bookTitle: string;
}

const AnnotationList: React.FC<AnnotationListProps> = ({
  annotations,
  selectedBookId,
  author,
  bookTitle,
}) => {
  const {
    activeAnnotationId,
    copiedAnnotationId,
    removeTrailingEmptyLine,
    handleCellClick,
    handleCopyClick,
    downloadAnnotations,
  } = useAnnotationUtils(selectedBookId);

  const t = useTranslations();

  return (
    <>
      <div className="sticky top-0 z-10 flex flex-row gap-x-2 p-2">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() =>
              downloadAnnotations(annotations, "txt", author, bookTitle)
            }
          >
            TXT olarak indir
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              downloadAnnotations(annotations, "html", author, bookTitle)
            }
            className="ml-2"
          >
            HTML olarak indir
          </Button>
        </div>
      </div>
      <Separator />
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
    </>
  );
};

export default AnnotationList;
