import NotionDialog from "@/components/NotionDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAnnotationUtils } from "@/hooks/useAnnotationUtils";
import { AnnotationListToolbarProps } from "@/types";
import { sendAllBooksToNotion, sendBookToNotion } from "@/utils/notionUtils";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const AnnotationListToolbar: React.FC<AnnotationListToolbarProps> = ({
  annotations,
  author,
  bookTitle,
  selectedBookId,
  bookListData,
}) => {
  const { toast } = useToast();
  const t = useTranslations();
  const { downloadAnnotations } = useAnnotationUtils("");

  const handleNotionSubmit = async (
    notionPageId: string,
    notionApiKey: string,
    sendAll: boolean,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    if (sendAll) {
      await sendAllBooksToNotion(
        bookListData,
        notionPageId,
        notionApiKey,
        () => {
          toast({
            title: t("success"),
            description: t("success_message_notion_all"),
          });
          onSuccess();
        },
        () => {
          toast({
            title: t("error"),
            description: t("error_message_notion"),
          });
          onError();
        },
      );
    } else {
      const selectedBook = bookListData.find(
        (book) => book.id === selectedBookId,
      );
      if (selectedBook) {
        await sendBookToNotion(
          selectedBook.annotations,
          selectedBook.author,
          selectedBook.title,
          notionPageId,
          notionApiKey,
          () => {
            toast({
              title: t("success"),
              description: t("success_message_notion"),
            });
            onSuccess();
          },
          () => {
            toast({
              title: t("error"),
              description: t("error_message_notion"),
            });
            onError();
          },
        );
      }
    }
  };

  return (
    <div className="sticky top-0 z-10 flex flex-row justify-end gap-x-2 bg-gray-600/5 p-2 dark:bg-gray-50/5">
      <div className="flex gap-2">
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
        <NotionDialog onSubmit={handleNotionSubmit} />
      </div>
    </div>
  );
};

export default AnnotationListToolbar;
