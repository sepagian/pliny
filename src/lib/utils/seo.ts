export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pliny",
  alternateName: "Pliny - Pelacak Listrik Prabayar",
  description:
    "Lacak penggunaan listrik prabayar untuk rumah tangga Indonesia. Pantau perangkat elektronik, catat pembacaan meter, dan estimasi sisa saldo.",
  url: "https://pliny.sepagian.xyz",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
  },
  inLanguage: "id",
  browserRequirements: "Requires JavaScript",
  author: {
    "@type": "Person",
    name: "sepagian",
    url: "https://github.com/sepagian/pliny",
  },
};
