# Waarkstee — website

Website van [Waarkstee](https://timsak.github.io/waarkstee/), een kleine coworking space aan de Nieuweweg 16 in Groningen.

Statische site zonder build-stap: plain HTML, CSS en een beetje JavaScript. GitHub Pages serveert de `main`-branch rechtstreeks; elke push naar `main` staat binnen een minuut live.

## Structuur

```
index.html          De pagina (hero, voorzieningen, prijzen, locatie, contact)
404.html            Niet-gevonden-pagina
css/style.css       Alle styling (kleuren staan bovenin als CSS-variabelen)
js/main.js          Jaartal in footer + mobiel menu
img/                Foto's, OG-afbeelding en app-icoon
favicon.svg         Favicon
.nojekyll           Zorgt dat GitHub Pages de bestanden ongewijzigd serveert
```

## Lokaal bekijken

Open `index.html` in je browser, of start een simpele server:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Inhoud aanpassen

- **Teksten en prijzen**: rechtstreeks in `index.html`. De prijstabel voor flexplekken staat onder `<!-- PRIJZEN -->`.
- **Beschikbaarheid** ("Nu 1 vaste plek vrij"): staat alleen in de stickers, nergens in de lopende tekst. Vier stuks: `<span class="sticker">` in de hero, de twee `price-sticker`s op de prijskaarten en `<span class="cta-sticker">` in het contactblok. Niks vrij? Haal de betreffende spans weg.
- **Foto's**: vervang de bestanden in `img/` en pas de `alt`-tekst en `width`/`height` in `index.html` aan. Houd ze rond de 1400px breed.
- **Kleuren**: de `:root`-variabelen bovenin `css/style.css`.

## Eigen domein koppelen

1. Zet in GitHub bij *Settings → Pages → Custom domain* het domein (bijv. `waarkstee.nl`) en zet *Enforce HTTPS* aan.
2. Bij je DNS-provider: een `CNAME`-record `www` → `timsak.github.io`, en voor de apex `A`-records naar de GitHub Pages IP's ([docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)).
3. Vervang daarna `https://timsak.github.io/waarkstee/` door het nieuwe domein in `index.html` (canonical, `og:url`, `og:image` en het JSON-LD-blok).
