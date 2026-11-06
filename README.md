# BC Bouw – website

Website voor **BC Bouw (Bouwwerken Coekaerts)**: ruwbouw, renovatie, gevelwerken en kleine grondwerken.
Statische site gebouwd met [Astro](https://astro.build). Geen database, geen PHP, gewoon HTML/CSS die nginx serveert.

## Lokaal draaien

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # bouwt naar dist/
npm run preview    # bekijk de build lokaal
```

## Structuur

| Pad | Inhoud |
|---|---|
| `src/site.ts` | Bedrijfsgegevens (telefoon, e-mail, werkgebied, adres, btw) |
| `src/data/services.ts` | Teksten van de diensten |
| `src/content/realisaties/*.md` | Eén bestand per project (titel, tekst, uitgevoerde werken) |
| `src/assets/realisaties/<project>/` | Foto's per project, `01.jpg` is de omslagfoto |
| `src/pages/` | Pagina's: home, diensten, realisaties, over ons, contact, privacy |
| `deploy/` | nginx-config en deployscript |

### Nieuw project toevoegen

1. Maak een map `src/assets/realisaties/mijn-project/` met foto's `01.jpg`, `02.jpg`, … (01 = omslag).
2. Maak `src/content/realisaties/mijn-project.md` (zelfde naam als de map) en kopieer de frontmatter van een bestaand project.
3. Zet `featured: true` om het project op de homepage te tonen.

Foto's mogen gewoon gsm-foto's zijn: Astro zet ze bij het bouwen om naar geoptimaliseerde WebP in meerdere formaten.

## Online zetten (Hetzner + nginx)

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
- Wil je het contactformulier echt laten versturen? Zet dan een repository-variabele `PUBLIC_WEB3FORMS_KEY`
  (Settings → Secrets and variables → Actions → Variables).
- De site draait daar in een submap. Gebruik voor interne links daarom altijd `url('/pad/')` uit `src/lib/url.ts`,
  nooit een vaste `/pad/`.

### Livegang-checklist

- [ ] Ward heeft teksten, diensten en werkgebied nagekeken
- [ ] Adres en ondernemingsnummer ingevuld in `src/site.ts` (wettelijk verplicht)
- [ ] `PUBLIC_WEB3FORMS_KEY` ingesteld en een testbericht verstuurd
- [ ] `site` in `astro.config.mjs` en `robots.txt` kloppen met het gekozen domein
- [ ] `auth_basic`-regels uit de nginx-config verwijderd
- [ ] Gedeployed met `--live` (haalt `noindex` weg)
- [ ] Google Bedrijfsprofiel aangemaakt en site ingediend in Google Search Console

## Bronnen

Foto's, projectbeschrijvingen en de review komen van de Facebookpagina van BC Bouw
(<https://www.facebook.com/p/BC-Bouw-61577013347376/>). Laat Ward bevestigen dat ze op de site mogen,
en vraag Michaël en Ilse of hun review met naam getoond mag worden.
Teksten over diensten, werkwijze en "over ons" zijn voorlopig en door Ward na te kijken.
