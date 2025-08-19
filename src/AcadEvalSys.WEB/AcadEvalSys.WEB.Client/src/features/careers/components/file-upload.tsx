"use client";
import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  supportedFormats?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = ".csv,.xlsx,.xls",
  maxSizeMB = 5,
  supportedFormats = "CSV, Excel (.xlsx, .xls)",
  className = "",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  console.log("fileInputRef:", fileInputRef.current);

  const validateAndSetFile = useCallback(
    (file: File) => {
      const allowedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        toast.error(`Tipo de archivo no permitido. Use: ${supportedFormats}`);
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`El archivo es demasiado grande. Máximo ${maxSizeMB}MB`);
        return;
      }

      onFileSelect(file);
    },
    [accept, maxSizeMB, supportedFormats, onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("Input onChange triggered, files:", e.target.files);
      if (e.target.files && e.target.files[0]) {
        console.log("File selected:", e.target.files[0].name);
        validateAndSetFile(e.target.files[0]);
        // Permitir re-seleccionar el mismo archivo (onChange no dispara si el nombre es igual)
        e.currentTarget.value = "";
      }
    },
    [validateAndSetFile]
  );

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        dragActive
          ? "border-primary bg-primary/10"
          : "border-gray-300 hover:border-gray-400"
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium text-gray-700 mb-2">
        Arrastra tu archivo aquí o haz clic para seleccionar
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Formatos soportados: {supportedFormats} - Máximo {maxSizeMB}MB
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        // Evitamos display:none (hidden) porque algunos navegadores bloquean click() en inputs ocultos
        className="sr-only"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        Seleccionar archivo
      </button>
    </div>
  );
}
