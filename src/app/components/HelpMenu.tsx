import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const HelpMenu: React.FC = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm" size="icon">
          <BadgeHelp className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("help")}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="notion" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="notion">
              Notion
            </TabsTrigger>
            <TabsTrigger className="w-full" value="about">
              {t("about_page.titles.1")}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-96 overflow-y-auto px-2">
            <TabsContent value="notion">
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                <strong>{t("help_page.titles.1")}</strong>
              </h3>
              <ol className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>
                  {t.rich("help_page.steps.1", {
                    a: (chunks) => (
                      <a
                        className="text-primary font-medium underline underline-offset-4"
                        href="https://www.notion.so/profile/integrations"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </li>
                <li>
                  {t.rich("help_page.steps.2", {
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </li>
                <li>
                  {t.rich("help_page.steps.3", {
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </li>
              </ol>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                <strong>{t("help_page.titles.2")}</strong>
              </h3>
              <ol className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>{t("help_page.steps.4")}</li>
                <li>
                  {t.rich("help_page.steps.5", {
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </li>
              </ol>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                <strong>{t("help_page.titles.3")}</strong>
              </h3>
              <ol className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>
                  {t.rich("help_page.steps.6", {
                    em: (chunks) => <em>{chunks}</em>,
                  })}
                </li>
                <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                  <li>{t("help_page.example")}</li>
                  <li>
                    {t.rich("help_page.page_id", {
                      mark: (chunks) => <mark>{chunks}</mark>,
                    })}
                  </li>
                </ul>
              </ol>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                <strong>{t("help_page.titles.4")}</strong>
              </h3>
              <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>{t("help_page.steps.7")}</li>
                <li>{t("help_page.steps.8")}</li>
              </ul>
            </TabsContent>
            <TabsContent value="about">
              <p className="mt-2 leading-7">{t("about_page.section.1")}</p>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                <strong>{t("about_page.titles.2")}</strong>
              </h3>
              <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
                <li>{t("about_page.section.2")}</li>
                <li>{t("about_page.section.3")}</li>
                <li>{t("about_page.section.4")}</li>
                <li>{t("about_page.section.5")}</li>
                <li>{t("about_page.section.6")}</li>
                <li>{t("about_page.section.7")}</li>
                <li>{t("about_page.section.8")}</li>
              </ul>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                <strong>{t("about_page.titles.3")}</strong>
              </h3>
              <p className="mt-2 leading-7">
                {t.rich("about_page.section.9", {
                  a: (chunks) => (
                    <a
                      href="https://github.com/TaylanTatli/KoboHighlights"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary font-bold underline underline-offset-4"
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("ok")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpMenu;
