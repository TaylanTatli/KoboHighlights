import HighlightListToolbar from "@/components/HighlightListToolbar";
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
import useDeviceDetection from "@/hooks/useDeviceDetection";
import { useHighlightUtils } from "@/hooks/useHighlightUtils";
import { HighlightListProps } from "@/types";
import { removeTrailingEmptyLine } from "@/utils/stringUtils";
import { Clipboard, ClipboardCheck, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const HighlightList: React.FC<HighlightListProps> = ({
  highlights,
  selectedBookId,
  author,
  bookTitle,
  bookListData,
}) => {
  const {
    activeHighlightId,
    copiedHighlightId,
    handleCellClick,
    handleCopyClick,
  } = useHighlightUtils(selectedBookId);

  const t = useTranslations();
  const { isMobile } = useDeviceDetection();

  return (
    <>
      <HighlightListToolbar
        bookListData={bookListData}
        highlights={highlights}
        author={author}
        bookTitle={bookTitle}
        selectedBookId={selectedBookId}
      />
      <Separator />
      <ScrollArea className="highlights h-full w-full p-0">
        <Table className="text-base">
          <TableBody>
            {highlights.length > 0 &&
              highlights.map((highlight, index) => (
                <React.Fragment key={highlight.id}>
                  <TableRow>
                    <TableCell className="w-0 text-center text-sm text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell
                      className="relative cursor-pointer whitespace-pre-line border-l py-3"
                      onClick={() => handleCellClick(highlight.id)}
                    >
                      {removeTrailingEmptyLine(highlight.content)}
                      <div
                        className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${
                          activeHighlightId === highlight.id
                            ? "mt-2 max-h-20 opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-8 w-8"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyClick(
                                    highlight.id,
                                    removeTrailingEmptyLine(highlight.content),
                                  );
                                }}
                              >
                                {copiedHighlightId === highlight.id ? (
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

                          {isMobile && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="h-8 w-8"
                                  size="icon"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (navigator.share) {
                                      try {
                                        await navigator.share({
                                          title: bookTitle,
                                          text: removeTrailingEmptyLine(
                                            highlight.content,
                                          ),
                                        });
                                      } catch (error) {
                                        console.error("Error sharing:", error);
                                      }
                                    } else {
                                      alert(
                                        "Web Share API not supported in your browser",
                                      );
                                    }
                                  }}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={8}>
                                <p>{t("share_the_highlight")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
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

export default HighlightList;
