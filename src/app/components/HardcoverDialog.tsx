"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Book, Highlight } from "@/types";
import {
  HardcoverBookChoice,
  postQuotesToHardcover,
  searchHardcoverBooks,
} from "@/utils/hardcoverUtils";
import { BookOpenCheck, Loader2, SendToBack } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface HardcoverDialogProps {
  selectedBook: {
    title: string;
    author: string;
    highlights: Highlight[];
  } | null;
  allBooks: Book[];
}

const HardcoverDialog: React.FC<HardcoverDialogProps> = ({
  selectedBook,
  allBooks,
}) => {
  const t = useTranslations();
  const { toast } = useToast();

  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryTitle, setQueryTitle] = useState("");
  const [queryAuthor, setQueryAuthor] = useState("");
  const [results, setResults] = useState<HardcoverBookChoice[]>([]);
  const [selected, setSelected] = useState<HardcoverBookChoice | null>(null);
  const [sendAll, setSendAll] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("hardcoverApiKey");
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    // Prefill from currently selected book
    if (selectedBook) {
      setQueryTitle(selectedBook.title);
      setQueryAuthor(selectedBook.author);
    }
  }, [selectedBook]);

  const performSearch = async () => {
    if (!apiKey) {
      toast({ title: t("error"), description: t("Hardcover.missing_api_key") });
      return;
    }
    setLoading(true);
    try {
      const found = await searchHardcoverBooks(queryTitle, queryAuthor, apiKey);
      setResults(found);
      setSelected(found[0] || null);
      localStorage.setItem("hardcoverApiKey", apiKey);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Search failed";
      toast({ title: t("error"), description: message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!apiKey || (!sendAll && !selected)) return;
    localStorage.setItem("hardcoverApiKey", apiKey);

    setLoading(true);
    try {
      if (sendAll) {
        for (const b of allBooks) {
          const matches = await searchHardcoverBooks(b.title, b.author, apiKey);
          const choice = matches[0];
          if (choice) {
            await postQuotesToHardcover(apiKey, choice.bookId, b.highlights);
          }
        }
        toast({
          title: t("success"),
          description: t("hardcover.uploaded_all_books"),
        });
      } else if (selectedBook) {
        const chosen = selected;
        if (!chosen) {
          toast({
            title: t("error"),
            description: t("harcover.select_book"),
          });
          setLoading(false);
          return;
        }
        await postQuotesToHardcover(
          apiKey,
          chosen.bookId,
          selectedBook.highlights,
        );
        toast({
          title: t("success"),
          description: t("hardcover.uploaded_highlights"),
        });
      }
      setOpen(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Upload failed";
      toast({ title: t("error"), description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          <SendToBack className="mr-2 size-4" />
          {t("send_to_hardcover")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("hardcover.title")}</DialogTitle>
          <DialogDescription>{t("hardcover.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Input
              placeholder="Hardcover API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-10 text-base"
            />
            <div className="text-muted-foreground text-xs">
              {t("hardcover.get_api_key")}{" "}
              <a
                href="https://hardcover.app/account/api"
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline underline-offset-4"
              >
                hardcover.app/account/api
              </a>
              .
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Book title"
              value={queryTitle}
              onChange={(e) => setQueryTitle(e.target.value)}
              className="h-10 text-base"
            />
            <Input
              placeholder="Author"
              value={queryAuthor}
              onChange={(e) => setQueryAuthor(e.target.value)}
              className="h-10 text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={performSearch}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              {t("search")}
            </Button>
            <label className="ml-auto inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sendAll}
                onChange={(e) => setSendAll(e.target.checked)}
              />
              {t("hardcover.send_all_books")}
            </label>
          </div>
          <p className="text-muted-foreground text-xs">{t("hardcover.tip")}</p>
          <ScrollArea className="max-h-64 rounded-md border">
            <div className="divide-y">
              {results.map((r) => (
                <button
                  key={`${r.bookId}`}
                  className={`hover:bg-muted flex w-full items-center gap-3 p-2 text-left ${selected?.bookId === r.bookId ? "bg-muted" : ""}`}
                  onClick={() => setSelected(r)}
                >
                  {r.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.coverUrl}
                      alt="cover"
                      className="h-12 w-8 object-cover"
                    />
                  ) : (
                    <div className="bg-muted h-12 w-8" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{r.title}</div>
                    <div className="text-muted-foreground truncate text-sm">
                      {r.author || ""}
                    </div>
                    {r.slug ? (
                      <div className="text-muted-foreground truncate text-xs">
                        {r.slug}
                      </div>
                    ) : null}
                  </div>
                </button>
              ))}
              {results.length === 0 && (
                <div className="text-muted-foreground p-3 text-sm">
                  {t("no_results")}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={loading || !apiKey || (!sendAll && !selected)}
          >
            {loading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <BookOpenCheck className="mr-2 size-4" />
            )}
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HardcoverDialog;
