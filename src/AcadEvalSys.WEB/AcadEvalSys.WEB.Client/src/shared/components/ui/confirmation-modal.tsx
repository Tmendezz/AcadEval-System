import React from "react";
import { ConfirmDialog } from "./confirm-dialog";

interface ConfirmationModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

export function ConfirmationModal({
  title,
  description,
  onConfirm,
  children,
}: ConfirmationModalProps) {
  return (
    <ConfirmDialog
      title={title}
      description={description}
      onConfirm={onConfirm}
      trigger={children}
    />
  );
}
