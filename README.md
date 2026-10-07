# jambazz.dk

Hjemmeside for virksomheden Jambazz. Ren HTML/CSS/JS – intet build-trin – hostet gratis på GitHub Pages.

## Struktur

- `index.html` – selve siden (tekster i `[firkantede parenteser]` skal udskiftes)
- `assets/style.css` – design (farver styres øverst under `:root`)
- `assets/main.js` – mobilmenu og scroll-animationer
- `CNAME` – fortæller GitHub Pages at siden skal ligge på jambazz.dk
- `.github/workflows/pages.yml` – udgiver automatisk siden ved hver push til `main`

## Se siden lokalt

Åbn `index.html` i en browser, eller kør `python3 -m http.server` og gå til http://localhost:8000.

## Opsætning (engangsopgave)

1. **GitHub Pages:** Repo → *Settings* → *Pages* → under *Source* vælg **GitHub Actions**.
2. **Branch:** Sørg for at koden ligger på `main` (merge pull requesten).
3. **DNS hos domæneudbyderen** for jambazz.dk:
   - Fire `A`-records på `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (Valgfrit, IPv6) Fire `AAAA`-records på `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - Én `CNAME`-record: `www` → `jambazz-virk.github.io`
4. Tilbage i *Settings* → *Pages*: skriv `jambazz.dk` som *Custom domain* og slå **Enforce HTTPS** til, når det bliver muligt (kan tage op til et døgn efter DNS-ændringen).
