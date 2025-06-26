import { useState } from "react";
import { EstimationForm } from "../forms/EstimationForm";

export default function Hero() {
  const [step, setStep] = useState(1);
  return (
    <section className="bg-white w-full py-20 px-4 sm:px-6 lg:px-8">
      {/* Multi-step form used to estimate a property */}
      <div className="max-w-xl mx-auto">
        <EstimationForm step={step} setStep={setStep} />
      </div>
    </section>
  );
}
