"use client";

// Écran final affiché après réception de l'estimation.
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FinishStepProps {
  onFinish: () => void;
}

export default function FinishStep({ onFinish }: FinishStepProps) {
  return (
    <motion.form
      key="step3"
      layout
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">Merci pour votre demande 🎉</h2>
      <p className="text-gray-700">
        Votre estimation a bien été enregistrée. Nous vous contacterons
        prochainement pour discuter des prochaines étapes.
      </p>

      <div className="flex justify-between gap-4">
        <Button
          type="button"
          onClick={onFinish}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Recommencer
        </Button>
      </div>
    </motion.form>
  );
}
