import { EstimationForm } from "../forms/EstimationForm";

export default function Hero() {
  return (
    <section className="bg-white w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Estimez votre maison rapidement en ligne.
          </h1>
          <p className="text-gray-700 text-lg mt-4 max-w-xl leading-relaxed">
            Vous habitez Le Mans et sa périphérie ? Profitez de mon expertise pour
            estimer et vendre votre maison rapidement.
          </p>
        </div>

        <div>
          <EstimationForm />
        </div>
      </div>
    </section>
  );
}
