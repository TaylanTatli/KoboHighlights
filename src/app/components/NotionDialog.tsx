import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Loader2, SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface NotionDialogProps {
  onSubmit: (
    notionPageId: string,
    notionApiKey: string,
    sendAll: boolean,
    onSuccess: () => void,
    onError: () => void,
  ) => Promise<void>;
}

const NotionDialog: React.FC<NotionDialogProps> = ({ onSubmit }) => {
  const t = useTranslations();

  const [notionPageId, setNotionPageId] = useState("");
  const [notionApiKey, setNotionApiKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sendAll, setSendAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedNotionPageId = localStorage.getItem("notionPageId");
    const storedNotionApiKey = localStorage.getItem("notionApiKey");

    if (storedNotionPageId) {
      setNotionPageId(storedNotionPageId);
    }

    if (storedNotionApiKey) {
      setNotionApiKey(storedNotionApiKey);
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    localStorage.setItem("notionPageId", notionPageId);
    localStorage.setItem("notionApiKey", notionApiKey);
    await onSubmit(
      notionPageId,
      notionApiKey,
      sendAll,
      () => {
        setLoading(false);
        setIsOpen(false);
      },
      () => {
        setLoading(false);
        setIsOpen(true);
      },
    );
  };
  const envNotionPageId = process.env.NEXT_PUBLIC_NOTION_PAGE_ID;
  const envNotionApiKey = process.env.NEXT_PUBLIC_NOTION_API_KEY;

  if (envNotionPageId && envNotionApiKey) {
    onSubmit(
      envNotionPageId,
      envNotionApiKey,
      sendAll,
      () => {
        setLoading(false);
        setIsOpen(false);
      },
      () => {
        setLoading(false);
        setIsOpen(true);
      },
    );
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          <SendHorizontal className="mr-2 size-4" />
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
          <div className="flex items-center">
            <Checkbox
              checked={sendAll}
              onCheckedChange={(checked) => setSendAll(checked === true)}
              id="sendAllCheckbox"
            />
            <label htmlFor="sendAllCheckbox" className="ml-2">
              {t("send_all_to_notion")}
            </label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("please_wait")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotionDialog;
