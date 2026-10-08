"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ className }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={className}
      type="button"
      onClick={() => window.print()}
    >
      <Printer aria-hidden="true" size={15} />
      Print
    </Button>
  );
}