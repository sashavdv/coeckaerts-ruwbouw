import type { ImageMetadata } from 'astro';
import nieuwbouw from '../assets/diensten/nieuwbouw.jpg';
import renovatie from '../assets/diensten/renovatie.jpg';
import gevelwerken from '../assets/diensten/gevelwerken.jpg';
import afbraak from '../assets/diensten/afbraak.jpg';
import funderingen from '../assets/diensten/funderingen.jpg';
import riolering from '../assets/diensten/riolering.jpg';

export interface Service {
  id: string;
  title: string;
  short: string;
  intro: string;
  items: string[];
  icon: 'house' | 'renovate' | 'bricks' | 'excavator' | 'foundation' | 'stairs';
  image: ImageMetadata;
  imageAlt: string;
}

// Teksten opgesteld op basis van de werven op Facebook. Door Ward na te kijken.
export const SERVICES: Service[] = [
  {
    id: 'nieuwbouw',
    title: 'Ruwbouw nieuwbouw',
    short: 'Van leeg perceel tot winddichte ruwbouw: uitzetten, funderen, metselen en welfsels.',
    intro:
      'Bouwt u een nieuwe woning? Wij zetten de volledige ruwbouw neer, van het uitzetten van de woning tot de muren, welfsels en gevels. U heeft één aanspreekpunt voor de hele ruwbouwfase.',
    items: [
      'Uitzetten en grondwerken',
      'Funderingen en vloerplaat',
      'Binnen- en buitenmuren',
      'Welfsels en verdiepingen',
      'Puntgevels en dakkapellen',
    ],
    icon: 'house',
    image: nieuwbouw,
    imageAlt: 'Opbouw van de binnenmuren van een nieuwbouwwoning',
  },
  {
    id: 'renovatie',
    title: 'Renovatie & verbouwing',
    short: 'Aanbouwen, uitbreidingen en nieuwe openingen in bestaande woningen.',
    intro:
      'Een woning verbouwen vraagt ervaring met bestaande constructies. Wij strippen, breken uit, maken nieuwe openingen en bouwen aan, zodat uw woning helemaal klaar is voor de volgende jaren.',
    items: [
      'Aanbouwen en uitbreidingen',
      'Strippen van bestaande woningen',
      'Nieuwe raam- en deuropeningen',
      'Totaalverbouwingen in één hand',
    ],
    icon: 'renovate',
    image: renovatie,
    imageAlt: 'Renovatie van een oudere woning met nieuwe gevelopeningen',
  },
  {
    id: 'gevelwerken',
    title: 'Gevel- & metselwerken',
    short: 'Gevelmetselwerk met oog voor detail: sierwerk, rondbogen en recuperatiesteen.',
    intro:
      'De gevel is het visitekaartje van uw woning. Of het nu gaat om strakke witte gevelsteen, warme recuperatiesteen of een gevel rond houtskeletbouw: wij metselen met precisie en aandacht voor het detail.',
    items: [
      'Gevelmetselwerk in alle steensoorten',
      'Sierwerk en rondbogen',
      'Recuperatiesteen (bv. Oud Beerse)',
      'Gevels rond houtskeletbouw',
      'Gevelisolatie',
    ],
    icon: 'bricks',
    image: gevelwerken,
    imageAlt: 'Gevelmetselwerk met rondboog in recuperatiesteen',
  },
  {
    id: 'afbraak-grondwerken',
    title: 'Afbraak & kleine grondwerken',
    short: 'Afbraak van bijgebouwen, opritten en koeren. Bouwterrein klaar voor de opbouw.',
    intro:
      'Voor een verbouwing of nieuwbouw moet er vaak eerst iets weg. Wij verzorgen de afbraak en de kleine grondwerken, zodat het bouwterrein netjes en volledig klaar is om te starten.',
    items: [
      'Afbraak van (bij)gebouwen',
      'Uitbreken van opritten en koeren',
      'Uitgraven en nivelleren',
      'Bouwterrein klaarmaken',
    ],
    icon: 'excavator',
    image: afbraak,
    imageAlt: 'Afbraak van een bestaande woning met een minigraver',
  },
  {
    id: 'funderingen-beton',
    title: 'Funderingen & betonwerken',
    short: 'Stevige basis: funderingen, gewapende vloerplaten en betonwerken.',
    intro:
      'Een goede woning begint bij een stevige basis. Wij voeren de funderingen en de betonwerken uit, van de wapening tot het storten van de vloerplaat.',
    items: ['Funderingen', 'Gewapende vloerplaten', 'Betonwerken bij verbouwingen'],
    icon: 'foundation',
    image: funderingen,
    imageAlt: 'Gewapende vloerplaat klaar om te storten',
  },
  {
    id: 'riolering',
    title: 'Riolering & buitenwerk',
    short: 'Rioleringen, regenwaterputten, buitentrappen en waterdichte terrassen.',
    intro:
      'Ook rond de woning zorgen we voor degelijk werk. We leggen rioleringen aan of vernieuwen ze, plaatsen regenwaterputten en verzorgen kleinere buitenwerken zoals trappen en terrassen.',
    items: [
      'Aanleg en vernieuwing van riolering',
      'Regenwaterputten en infiltratie',
      'Buitentrappen',
      'Terrassen uitgraven en waterdicht maken',
    ],
    icon: 'stairs',
    image: riolering,
    imageAlt: 'Nieuwe rioleringsbuizen langs een woning',
  },
];
