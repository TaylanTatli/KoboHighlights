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
import React, { useState } from "react";

interface NotionDialogProps {
  onSubmit: (notionPageId: string, notionApiKey: string) => void;
}

const NotionDialog: React.FC<NotionDialogProps> = ({ onSubmit }) => {
  const [notionPageId, setNotionPageId] = useState("");
  const [notionApiKey, setNotionApiKey] = useState("");

  const handleSubmit = () => {
    onSubmit(notionPageId, notionApiKey);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          <SendHorizontal className="mr-2 h-4 w-4" />
          Send to Notion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Annotations to Notion</DialogTitle>
          <DialogDescription>
            Please enter your Notion Page ID and API Key.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Notion Page ID"
            value={notionPageId}
            onChange={(e) => setNotionPageId(e.target.value)}
          />
          <Input
            placeholder="Notion API Key"
            value={notionApiKey}
            onChange={(e) => setNotionApiKey(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotionDialog;
