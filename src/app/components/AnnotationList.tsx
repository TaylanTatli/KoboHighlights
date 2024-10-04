import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Annotation } from "@/types";
import { Clipboard, ClipboardCheck } from "lucide-react";
import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AnnotationListProps {
  annotations: Annotation[];
}

const AnnotationList: React.FC<AnnotationListProps> = ({ annotations }) => {
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );
  const [copiedAnnotationId, setCopiedAnnotationId] = useState<string | null>(
    null
  );

  const removeTrailingEmptyLine = (content: string) => {
    const lines = content.split("\n");
    while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
      lines.pop();
    }
    return lines.join("\n");
  };
  const handleCellClick = (annotationId: string) => {
    if (annotationId === activeAnnotationId) {
      setActiveAnnotationId(null);
      setCopiedAnnotationId(null); // Buton gizlendiğinde copiedAnnotationId'yi de sıfırla
    } else {
      setActiveAnnotationId(annotationId);
      setCopiedAnnotationId(null); // Yeni hücre seçildiğinde copiedAnnotationId'yi sıfırla
    }
  };

  const handleCopyClick = (annotationId: string, content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedAnnotationId(annotationId);
        setTimeout(() => setCopiedAnnotationId(null), 2000); // 2 saniye sonra durumu sıfırla
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <ScrollArea className="annotations p-0 w-full h-full">
      <Table className="text-base">
        <TableBody>
          {annotations.length > 0 ? (
            annotations.map((annotation) => (
              <React.Fragment key={annotation.id}>
                <TableRow>
                  <TableCell
                    className="whitespace-pre-line py-3 cursor-pointer relative"
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-7 w-7"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Butona tıklamayı hücre tıklamasından ayır
                                handleCopyClick(
                                  annotation.id,
                                  removeTrailingEmptyLine(annotation.content)
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
                          <TooltipContent>
                            <p>Copy to Clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-muted-foreground py-3">
                You haven&apos;t uploaded the KoboReader.sqlite file or chosen a
                book title. Once the annotations are loaded, you can click them
                to see the action button.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AnnotationList;
