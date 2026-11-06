// Centrale bedrijfsgegevens. Alles wat Ward nog moet bevestigen staat op `null`
// en wordt dan automatisch niet getoond op de site.
export const SITE = {
  name: 'BC Bouw',
  legalName: 'Bouwwerken Coekaerts',
  owner: 'Ward Coekaerts',
  tagline: 'Bouwen met Bouwwerken Coekaerts, waar onze passie uw droom is.',
  description:
    'BC Bouw (Bouwwerken Coekaerts) realiseert ruwbouw voor nieuwbouw en renovatie: afbraak, grondwerken, funderingen, metsel- en gevelwerken. Vraag vrijblijvend uw offerte aan.',
  phone: '0486 48 31 26',
  phoneHref: 'tel:+32486483126',
  email: 'bc.bouw@hotmail.com',
  facebook: 'https://www.facebook.com/p/BC-Bouw-61577013347376/',
  // Afgeleid uit de projecten (Diepenbeek, Rotselaar). Door Ward te bevestigen.
  region: 'Limburg en Vlaams-Brabant',
  // Wettelijk verplicht op een Belgische bedrijfssite. Nog op te vragen bij Ward.
  address: null as string | null,
  vat: null as string | null,
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/diensten/', label: 'Diensten' },
  { href: '/realisaties/', label: 'Realisaties' },
  { href: '/over-ons/', label: 'Over ons' },
  { href: '/contact/', label: 'Contact' },
];
