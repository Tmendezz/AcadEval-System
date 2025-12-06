import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FileText, X } from "lucide-react";

interface SelectedFileSectionProps {
  selectedFile: File;
  onRemoveFile: () => void;
}

export function SelectedFileSection({
  selectedFile,
  onRemoveFile,
}: SelectedFileSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          Archivo seleccionado
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {((selectedFile.size || 0) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
