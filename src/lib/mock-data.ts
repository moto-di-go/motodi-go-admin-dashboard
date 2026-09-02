export const operationsOverview = [
  { label: "Utilisateurs actifs", value: "12 480", trend: "+18%", detail: "MAU tous profils" },
  { label: "Profils verifies", value: "2 316", trend: "+9%", detail: "Conducteurs et agences" },
  { label: "Reservations", value: "4 908", trend: "+23%", detail: "Interurbain et urbain" },
  { label: "Volume wallet", value: "38,4M FCFA", trend: "+14%", detail: "Transactions confirmees" }
];

export const recentOperations = [
  { id: "OPS-2041", type: "Reservation", status: "PAID", owner: "Segment passager A" },
  { id: "OPS-2040", type: "Annonce", status: "PUBLISHED", owner: "Agence Littoral" },
  { id: "OPS-2039", type: "Transaction", status: "PENDING_CALLBACK", owner: "Wallet anonymise" },
  { id: "OPS-2038", type: "Profil", status: "PENDING_KYC", owner: "Transporteur Centre" }
];

export const kycQueue = [
  { id: "KYC-1182", profile: "Mototaxi", city: "Douala", documents: 4, age: "2 h" },
  { id: "KYC-1181", profile: "Transporteur", city: "Yaounde", documents: 5, age: "5 h" },
  { id: "KYC-1179", profile: "Agence", city: "Bafoussam", documents: 6, age: "1 j" }
];

export const moderationQueue = [
  { id: "MOD-772", target: "Avis signale", priority: "HIGH", reason: "Langage abusif" },
  { id: "SUP-440", target: "Ticket support", priority: "MEDIUM", reason: "Question paiement" },
  { id: "MOD-771", target: "Commentaire", priority: "LOW", reason: "Verification manuelle" }
];

export const pricingRules = [
  { zone: "CM-LT-DLA", window: "05:00-21:59", base: "500 FCFA", coefficient: "1.00" },
  { zone: "CM-CE-YDE", window: "22:00-04:59", base: "700 FCFA", coefficient: "1.25" },
  { zone: "CM-LT-CE", window: "Interurbain", base: "9000 FCFA", coefficient: "1.00" }
];
