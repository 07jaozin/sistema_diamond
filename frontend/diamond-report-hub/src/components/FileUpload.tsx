import { useState, useRef } from "react";
import { Upload, X, FileVideo, FileImage } from "lucide-react";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

const FileUpload = ({ files, onChange }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    onChange([...files, ...dropped]);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      onChange([...files, ...selected]);
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-foreground/40 bg-accent/50"
            : "border-border hover:border-foreground/20 hover:bg-accent/30"
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Arraste imagens ou vídeos aqui, ou{" "}
          <span className="text-foreground underline underline-offset-2">
            clique para selecionar
          </span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-accent/50 rounded-md px-3 py-2 group"
            >
              {file.type.startsWith("image/") ? (
                <FileImage className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <FileVideo className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <span className="text-sm text-foreground truncate flex-1">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-border rounded"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
