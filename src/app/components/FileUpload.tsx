import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  return (
    <div className="min-h-fit overflow-hidden">
      <div className="block py-4 p-8 w-fit m-auto">
        <Label htmlFor="file_input">
          Upload <strong>KoboReader.sqlite</strong>
        </Label>
        <Input
          id="file_input"
          aria-describedby="file_input_help"
          className="my-1"
          type="file"
          accept=".sqlite"
          onChange={onFileUpload}
        />
        <p
          className="block text-sm italic my-0 text-muted-foreground"
          id="file_input_help"
        >
          You can find this file in the <Badge variant="outline">.kobo</Badge>{" "}
          folder, which is hidden by default.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
