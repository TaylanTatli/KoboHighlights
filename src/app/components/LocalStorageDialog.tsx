import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ConfirmationDialogProps } from "@/types";
import { useTranslations } from "next-intl";
import React from "react";

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  setBookListData,
}) => {
  const t = useTranslations();

  const handleClear = () => {
    localStorage.removeItem("bookListData");
    setBookListData([]);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("localstorage_dialog_title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.rich("localstorage_dialog_description", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:justify-between">
          <AlertDialogAction onClick={handleClear}>
            {t("clear")}
          </AlertDialogAction>
          <AlertDialogCancel onClick={onConfirm}>
            {t("confirm")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
