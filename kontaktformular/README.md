# Kontaktformularens postkasse

`Code.gs` er et lille Google Apps Script, der modtager beskeder fra
kontaktformularen på jambazz.dk og sender dem til din Gmail. Din e-mailadresse
står hverken i koden eller på hjemmesiden.

## Udrulning (én gang)

1. Gå til https://script.google.com og klik **Nyt projekt**. Kald det `jambazz-kontakt`.
2. Slet indholdet i `Code.gs` og indsæt indholdet af `Code.gs` herfra. Gem.
3. Klik **Implementer** → **Ny implementering** → tandhjulet → **Webapp**.
   - **Udfør som:** Mig
   - **Hvem har adgang:** Alle
4. Klik **Implementer**, godkend adgang, og kopiér **webapp-URL'en** (slutter på `/exec`).
5. URL'en sættes ind i `FORM_ENDPOINT` øverst i kontaktformular-delen af `assets/main.js`.

Retter du senere i scriptet: **Implementer** → **Administrer implementeringer** →
blyanten → **Version: Ny version**. Så beholder du samme URL.
