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
    <div className="relative w-full flex flex-col gap-6 justify-between min-h-screen px-4 lg:px-6 bg-white lg:max-w-3xl">
      <header className="pt-20">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </header>
      {/* on garde un padding bottom assez grand pour que le contenu ne soit pas masqué */}
      <div className="gap-4 w-full">{children}</div>
      {/* on utilise absolute plutôt que fixed, et left-0 pour caler la largeur sur le parent */}
      <footer className="sticky mt-auto bottom-0 left-0 w-full border-t bg-white px-6 py-4 flex gap-4">
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
          className={
            (onBack ? "w-1/2" : "w-full") +
            " bg-orange-500 hover:bg-orange-600 text-white"
          }
        >
          Étape suivante
        </Button>
      </footer>
    </div>
  );
}

export default StepLayout;
