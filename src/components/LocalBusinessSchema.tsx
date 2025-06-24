import React from "react";

export function LocalBusinessSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Immodelo",
    url: "https://immodelo.fr",
    description:
      "Immodelo est g\u00e9r\u00e9e par Elodie Dallier depuis le 215E Route du Lude \u00e0 Laign\u00e9-St-Gervais. Membre du groupe agence.immo, elle reste agent immobilier ind\u00e9pendant.",
    logo: "https://immodelo.fr/favicon.ico",
    image: "https://immodelo.fr/favicon.ico",
    address: {
      "@type": "PostalAddress",
      streetAddress: "215E Route du Lude",
      addressLocality: "Laign\u00e9-St-Gervais",
      postalCode: "72220",
      addressCountry: "FR",
    },
    founder: {
      "@type": "Person",
      name: "Elodie Dallier",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "agence.immo",
      url: "https://agence.immo",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default LocalBusinessSchema;
