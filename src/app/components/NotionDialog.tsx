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
import { SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface NotionDialogProps {
  onSubmit: (
    notionPageId: string,
    notionApiKey: string,
    onSuccess: () => void,
    onError: () => void,
  ) => Promise<void>;
}

const NotionDialog: React.FC<NotionDialogProps> = ({ onSubmit }) => {
  const t = useTranslations();

  const [notionPageId, setNotionPageId] = useState("");
  const [notionApiKey, setNotionApiKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    await onSubmit(
      notionPageId,
      notionApiKey,
      () => setIsOpen(false), // Başarılı olduğunda dialog'u kapat
      () => setIsOpen(true), // Başarısız olduğunda dialog açık kalacak
    );
  };
  const envNotionPageId = process.env.NEXT_PUBLIC_NOTION_PAGE_ID;
  const envNotionApiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY;

  if (envNotionPageId && envNotionApiKey) {
    onSubmit(
      envNotionPageId,
      envNotionApiKey,
      () => setIsOpen(false),
      () => setIsOpen(true),
    );
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          <SendHorizontal className="mr-2 h-4 w-4" />
          {t("send_to_notion")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("send_to_notion_dialog_title")}</DialogTitle>
          <DialogDescription>
            {t("send_to_notion_dialog_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Notion Page ID"
            value={notionPageId}
            onChange={(e) => setNotionPageId(e.target.value)}
            className="w-full p-2"
          />
          <Input
            placeholder="Notion API Key"
            value={notionApiKey}
            onChange={(e) => setNotionApiKey(e.target.value)}
            className="w-full p-2"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>{t("submit")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotionDialog;
