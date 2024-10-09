import AnnotationListToolbar from "@/components/AnnotationListToolbar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAnnotationUtils } from "@/hooks/useAnnotationUtils";
import { AnnotationListProps } from "@/types";
import { removeTrailingEmptyLine } from "@/utils/stringUtils";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const AnnotationList: React.FC<AnnotationListProps> = ({
  annotations,
  selectedBookId,
  author,
  bookTitle,
  bookListData,
}) => {
  const {
    activeAnnotationId,
    copiedAnnotationId,
    handleCellClick,
    handleCopyClick,
  } = useAnnotationUtils(selectedBookId);

  const t = useTranslations();

  return (
    <>
      <AnnotationListToolbar
        bookListData={bookListData}
        annotations={annotations}
        author={author}
        bookTitle={bookTitle}
        selectedBookId={selectedBookId}
      />
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
