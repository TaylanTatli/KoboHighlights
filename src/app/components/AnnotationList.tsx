import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Annotation } from "@/types";
import React from "react";

interface AnnotationListProps {
  annotations: Annotation[];
}

const AnnotationList: React.FC<AnnotationListProps> = ({ annotations }) => {
  const removeTrailingEmptyLine = (content: string) => {
    const lines = content.split("\n");
    while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
      lines.pop();
    }
    return lines.join("\n");
  };
  return (
    <ScrollArea className="annotations p-0 w-full h-full">
      <Table className="text-base">
        <TableBody>
          {annotations.length > 0 ? (
            annotations.map((annotation) => (
              <TableRow key={annotation.id}>
                <TableCell className="whitespace-pre-line py-3">
                  {removeTrailingEmptyLine(annotation.content)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-muted-foreground py-3">
                You haven&apos;t uploaded the KoboReader.sqlite file or chosen a
                book title.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AnnotationList;
