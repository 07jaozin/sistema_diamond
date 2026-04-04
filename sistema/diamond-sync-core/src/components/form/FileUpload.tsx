import React, { useRef, useState } from 'react';
import { Upload, X, Image, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  label: string;
  hint?: string;
  error?: string;
  variant?: 'avatar' | 'document' | 'logo';
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  onChange,
  value,
  label,
  hint,
  error,
  variant = 'document',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (file: File | null) => {
    if (file) {
      onChange(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      onChange(null);
      setPreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChange(e.dataTransfer.files[0]);
    }
  };

  const isImage = value?.type.startsWith('image/');

  const variantStyles = {
    avatar: 'w-32 h-32 rounded-full',
    logo: 'w-40 h-40 rounded-2xl',
    document: 'w-full h-40 rounded-xl',
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      
      <div
        className={cn(
          "relative border-2 border-dashed transition-all duration-200 cursor-pointer group overflow-hidden",
          variantStyles[variant],
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-secondary/50",
          error && "border-destructive"
        )}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleChange(e.target.files?.[0] || null)}
          className="hidden"
        />

        {value ? (
          <>
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/50">
                <FileText className="w-10 h-10 text-primary mb-2" />
                <span className="text-xs text-muted-foreground truncate max-w-[90%] px-2">
                  {value.name}
                </span>
              </div>
            )}
            
            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleChange(null);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            {variant === 'avatar' || variant === 'logo' ? (
              <Image className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
            )}
            <span className="text-xs text-muted-foreground text-center group-hover:text-foreground transition-colors">
              Clique ou arraste
            </span>
          </div>
        )}
      </div>

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;