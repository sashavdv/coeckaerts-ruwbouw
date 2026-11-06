# BC Bouw – website

Website voor **BC Bouw (Bouwwerken Coekaerts)**: ruwbouw, renovatie, gevelwerken en kleine grondwerken.

**Stack** (dezelfde voor alle statische klantsites):

| Onderdeel | Keuze |
|---|---|
| Site | [Astro](https://astro.build), volledig statisch |
| Hosting + CI/CD | Cloudflare Workers Static Assets, gekoppeld aan GitHub (Workers Builds) |
| Contactformulier | `POST /api/contact` in dezelfde Worker (`worker/index.ts`) |
| Mail | Resend, verstuurd vanaf het **eigen domein van de klant** |
| Spam | Cloudflare Turnstile + honeypot |

## Lokaal draaien

```bash
npm install
npm run dev        # http://localhost:4321 (alleen de site, formulier valt terug op mailto)
npm run build      # bouwt naar dist/
npm run cf:dev     # bouwt en draait site + Worker zoals op Cloudflare (http://localhost:8787)
```

Voor `cf:dev` met een echte mailverzending: kopieer `.dev.vars.example` naar `.dev.vars` en vul de sleutels in.

## Structuur

| Pad | Inhoud |
|---|---|
| `src/site.ts` | Bedrijfsgegevens (telefoon, e-mail, werkgebied, adres, btw) |
| `src/data/services.ts` | Teksten van de diensten |
| `src/content/realisaties/*.md` | Eén bestand per project (titel, tekst, uitgevoerde werken) |
| `src/assets/realisaties/<project>/` | Foto's per project, `01.jpg` is de omslagfoto |
| `src/pages/` | Pagina's: home, diensten, realisaties, over ons, contact, privacy |
| `worker/index.ts` | Cloudflare Worker: serveert `dist/` en verwerkt `/api/contact` |
| `wrangler.jsonc` | Cloudflare-config: Worker-naam, afzender- en ontvangstadres van het formulier |
| `public/_headers` | Cache- en beveiligingsheaders op Cloudflare |
| `deploy/` | Alternatief: nginx-config en deployscript voor een eigen server |

### Nieuw project toevoegen

1. Maak een map `src/assets/realisaties/mijn-project/` met foto's `01.jpg`, `02.jpg`, … (01 = omslag).
2. Maak `src/content/realisaties/mijn-project.md` (zelfde naam als de map) en kopieer de frontmatter van een bestaand project.
3. Zet `featured: true` om het project op de homepage te tonen.

Foto's mogen gewoon gsm-foto's zijn: Astro zet ze bij het bouwen om naar geoptimaliseerde WebP in meerdere formaten.

## Online zetten op Cloudflare

### 1. Worker koppelen (eenmalig)
- Cloudflare-dashboard → **Workers & Pages → Create → Import a repository** → deze repo.
- Build command: `npm run build` · Deploy command: `npx wrangler deploy` · Productiebranch: `main`.
- De Worker-naam in het dashboard moet gelijk zijn aan `name` in `wrangler.jsonc` (`coeckaerts-ruwbouw`).
- Elke push naar `main` gaat live; andere branches krijgen een eigen preview-URL.

### 2. Contactformulier (Resend)
1. Voeg het **domein van de klant** (bv. `bc-bouw.be`) toe in Resend → *Domains* en zet de DNS-records die Resend
   toont in Cloudflare DNS. Wacht tot het domein op *Verified* staat.
2. Maak in Resend een **API key** met *Sending access*, beperkt tot dat ene domein. Zo staat elke klant los van de
   andere domeinen in je account.
3. Zet in Cloudflare → Worker → **Settings → Variables and Secrets** een *Secret* `RESEND_API_KEY`.
4. Controleer `CONTACT_TO` (ontvanger) en `MAIL_FROM` (afzender, moet op het geverifieerde domein staan) in `wrangler.jsonc`.

Zolang `RESEND_API_KEY` ontbreekt, opent het formulier het mailprogramma van de bezoeker. Er gaat dus niets verloren.

### 3. Spambescherming (Turnstile, aangeraden)
1. Cloudflare-dashboard → **Turnstile → Add widget**, met als hostnames het `workers.dev`-adres en het eigen domein.
2. **Site key** → buildvariabele `PUBLIC_TURNSTILE_SITE_KEY` (Worker → Settings → Build → Variables and secrets).
3. **Secret key** → secret `TURNSTILE_SECRET_KEY` (Worker → Settings → Variables and Secrets).
4. Nieuwe deploy starten.

### 4. Eigen domein
Voeg het domein toe aan Cloudflare (gratis), zet de nameservers bij de registrar op die van Cloudflare en koppel het
via Worker → **Settings → Domains & Routes**. Pas daarna `site` in `astro.config.mjs` en `public/robots.txt` aan.

## Alternatief: eigen server (Hetzner + nginx)

Werkt alleen voor de statische site; het contactformulier valt daar terug op het mailprogramma.

1. **Domein** registreren (voorstel: `bc-bouw.be`) en een A-record (en AAAA) naar de server laten wijzen voor `bc-bouw.be` en `www.bc-bouw.be`.
2. **Map** aanmaken op de server: `sudo mkdir -p /var/www/bc-bouw && sudo chown <deploy-user> /var/www/bc-bouw`.
3. **nginx**: zie de instructies bovenaan `deploy/nginx/bc-bouw.conf` (inclusief certbot voor HTTPS).
   In de preview-fase staat er een wachtwoord op de site (`auth_basic`), zodat alleen Ward ze kan zien.
4. **Uploaden** vanaf je eigen computer:

   ```bash
   DEPLOY_HOST=gebruiker@server ./deploy/deploy.sh          # preview (noindex)
   DEPLOY_HOST=gebruiker@server ./deploy/deploy.sh --live   # livegang
   ```

## Preview op GitHub Pages

Elke push naar `main` bouwt de site en zet ze op GitHub Pages via `.github/workflows/pages.yml`:
<https://sashavdv.github.io/coeckaerts-ruwbouw/>

- Eenmalig instellen: repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- Op een gratis GitHub-account werkt Pages alleen als de repo **publiek** is. Met GitHub Pro kan de repo privé
  blijven, maar de Pages-site zelf is altijd publiek toegankelijk (geen wachtwoord).
- De preview staat op `noindex`, zodat zoekmachines ze niet oppikken.
- Er draait daar geen Worker: het contactformulier opent het mailprogramma van de bezoeker.
- De site draait daar in een submap. Gebruik voor interne links daarom altijd `url('/pad/')` uit `src/lib/url.ts`,
  nooit een vaste `/pad/`.

### Livegang-checklist

- [ ] Ward heeft teksten, diensten en werkgebied nagekeken
- [ ] Adres en ondernemingsnummer ingevuld in `src/site.ts` (wettelijk verplicht)
- [ ] Domein in Resend geverifieerd, `RESEND_API_KEY` en Turnstile ingesteld, testbericht ontvangen (ook in spam kijken)
- [ ] `site` in `astro.config.mjs` en `robots.txt` kloppen met het gekozen domein
- [ ] Buildvariabele `PUBLIC_SITE_LIVE=true` gezet en opnieuw gedeployed (haalt `noindex` weg)
- [ ] Google Bedrijfsprofiel aangemaakt en site ingediend in Google Search Console

## Bronnen

Foto's, projectbeschrijvingen en de review komen van de Facebookpagina van BC Bouw
(<https://www.facebook.com/p/BC-Bouw-61577013347376/>). Laat Ward bevestigen dat ze op de site mogen,
en vraag Michaël en Ilse of hun review met naam getoond mag worden.
Teksten over diensten, werkwijze en "over ons" zijn voorlopig en door Ward na te kijken.
