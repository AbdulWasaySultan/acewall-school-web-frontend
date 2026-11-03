import { DocumentAttachmentIcon } from "@/assets/Icons/Document";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputFile({ onChange }) {
  return (
    <div className="w-full max-w-sm flex items-center gap-2">
      {/* Hidden label for screen readers */}
      <Label htmlFor="file-upload" className="sr-only">
        Upload Document
      </Label>

      <div className="relative inline-block w-full">
        {/* Actual input, visually hidden but accessible */}
        <Input
          type="file"
          id="file-upload"
          className="absolute opacity-0 w-full h-full cursor-pointer"
          onChange={onChange}
          aria-describedby="file-upload-desc"
        />

        {/* Styled label acting as the visible button */}
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-green-400 rounded-full cursor-pointer hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
        >
          <DocumentAttachmentIcon className="mr-2" aria-hidden="true" />
          <span>Upload Document</span>
        </label>
      </div>

      {/* Optional description for screen readers */}
      <p id="file-upload-desc" className="sr-only">
        Choose a document file to upload. Press Enter or Space when focused to
        select a file.
      </p>
    </div>
  );
}
