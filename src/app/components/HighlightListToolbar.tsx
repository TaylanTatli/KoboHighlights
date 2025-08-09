import HardcoverDialog from "@/components/HardcoverDialog";
import HelpMenu from "@/components/HelpMenu";
import NotionDialog from "@/components/NotionDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useHighlightUtils } from "@/hooks/useHighlightUtils";
import { HighlightListToolbarProps } from "@/types";
import { sendAllBooksToNotion, sendBookToNotion } from "@/utils/notionUtils";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { FileDown, SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const HighlightListToolbar: React.FC<HighlightListToolbarProps> = ({
  highlights,
  author,
  bookTitle,
  selectedBookId,
  bookListData,
}) => {
  const { toast } = useToast();
  const t = useTranslations();
  const { downloadHighlights } = useHighlightUtils("");

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
          selectedBook.highlights,
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
    <div className="sticky top-0 z-10 flex flex-row flex-wrap justify-end gap-2 bg-gray-600/5 p-2 dark:bg-gray-50/5">
      <div className="flex w-full flex-row flex-wrap justify-end gap-2 md:w-auto md:flex-nowrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              <FileDown className="mr-2 size-4" />
              {t("download")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() =>
                downloadHighlights(highlights, "md", author, bookTitle)
              }
            >
              {t("as_md")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                downloadHighlights(highlights, "txt", author, bookTitle)
              }
            >
              {t("as_txt")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                downloadHighlights(highlights, "html", author, bookTitle)
              }
            >
              {t("as_html")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm">
              <SendHorizontal className="mr-2 size-4" />
              {t("send")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuGroup className="bg-popover flex flex-col gap-2 p-1">
              <DropdownMenuItem asChild>
                <NotionDialog onSubmit={handleNotionSubmit} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <HardcoverDialog
                  selectedBook={
                    selectedBookId
                      ? (() => {
                          const b = bookListData.find(
                            (x) => x.id === selectedBookId,
                          );
                          return b
                            ? {
                                title: b.title,
                                author: b.author,
                                highlights: b.highlights,
                              }
                            : null;
                        })()
                      : null
                  }
                  allBooks={bookListData}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <HelpMenu />
      </div>
    </div>
  );
};

export default HighlightListToolbar;
