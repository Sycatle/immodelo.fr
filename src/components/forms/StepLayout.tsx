import { Button } from "@/components/ui/button";
import React from "react";

interface StepLayoutProps {
  children: React.ReactNode;
  title: string;
  formId: string;
  onBack?: () => void;
  nextDisabled?: boolean;
}

export function StepLayout({
  children,
  title,
  formId,
  onBack,
  nextDisabled,
}: StepLayoutProps) {
  return (
    <div className="relative bg-white overflow-hidden">
      <header className="px-6 py-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </header>
      <div className="px-6 pb-24 space-y-4">{children}</div>
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 flex gap-4">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-1/2"
          >
            Étape précédente
          </Button>
        )}
        <Button
          form={formId}
          type="submit"
          disabled={nextDisabled}
          className={(onBack ? "w-1/2" : "w-full") + " bg-orange-500 hover:bg-orange-600 text-white"}
        >
          Étape suivante
        </Button>
      </footer>
    </div>
  );
}

export default StepLayout;
