// Interne link met de juiste basis. Op GitHub Pages draait de site in een submap
// (bv. /coeckaerts-ruwbouw/), op het eigen domein in de root. Gebruik dus altijd
// url('/contact/') in plaats van '/contact/'.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Huidig pad zonder basis, bv. '/realisaties/' (handig om de actieve menulink te bepalen). */
export function stripBase(pathname: string): string {
  const stripped = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}
