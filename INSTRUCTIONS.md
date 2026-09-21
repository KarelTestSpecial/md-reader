# Instructies voor het testen van de MD Reader-extensie

Volg deze stappen om de MD Reader Chrome-extensie te laden en te testen:

1.  **Open Google Chrome.**
2.  **Navigeer naar de extensiepagina:** Typ `chrome://extensions` in de adresbalk en druk op Enter.
3.  **Schakel de ontwikkelaarsmodus in:** Zoek naar de schakelaar "Ontwikkelaarsmodus" (of "Developer mode") in de rechterbovenhoek van de pagina en zorg ervoor dat deze is ingeschakeld.
4.  **Laad de uitgepakte extensie:** Klik op de knop "Uitgepakte extensie laden" (of "Load unpacked") die linksboven verschijnt.
5.  **Selecteer de projectmap:** Navigeer in het bestandsselectievenster naar de map die de extensiebestanden bevat (`manifest.json`, `index.html`, `script.js` en `marked.min.js`) en selecteer deze map.
6.  **Open de extensie:** De "MD Reader"-extensie zou nu in uw lijst met extensies moeten verschijnen. Klik op het puzzelstukpictogram in de werkbalk van Chrome en vervolgens op "MD Reader". De editor opent in een nieuw tabblad.

## De interface

*   **Dropzone (bovenaan):** een smalle balk. Sleep er een `.md`-bestand naartoe of gebruik de knop **Browse**. Het bestand wordt in de editor geladen en meteen gerenderd in een nieuw tabblad.
*   **Editor (midden):** een groot tekstveld dat de volledige hoogte van het venster gebruikt. U kunt er markdown in typen, plakken en bewerken. U kunt het tekstveld met de hendel onderaan ook nog handmatig groter of kleiner slepen.
*   **Save:** schrijft de tekst uit de editor naar een bestand via de standaard bestandskiezer van Chrome (`showSaveFilePicker`). Kies een map op de computer, of een map in een cloudopslag die met de computer is gesynchroniseerd (Google Drive, OneDrive, Dropbox, iCloud, ...).
*   **Render:** opent de inhoud van de editor als opgemaakte HTML in een nieuw tabblad.
*   **light / dark:** schakelaar voor het thema. De voorkeur wordt opgeslagen en gesynchroniseerd.

### Sneltoetsen

| Sneltoets | Actie |
| --- | --- |
| `Ctrl+S` (of `Cmd+S`) | Opslaan. Eerste keer: bestandskiezer. Daarna wordt hetzelfde bestand overschreven. |
| `Shift+Ctrl+S` | Opslaan als: de bestandskiezer opent altijd opnieuw. |
| `Ctrl+Enter` | Renderen. |

### Wat u nog meer ziet

*   Onder de knoppen staat hoeveel woorden en tekens de tekst bevat, met de vermelding "unsaved changes" zolang de wijzigingen niet zijn opgeslagen. Het tabblad toont dan een `•` voor de bestandsnaam.
*   Een concept van wat u typt wordt lokaal bewaard (`chrome.storage.local`), zodat niets verloren gaat als u het tabblad sluit. Bij het heropenen van de editor wordt de laatste tekst teruggezet; was die nog niet opgeslagen, dan staat er "unsaved changes" en/of een `•` voor de bestandsnaam.
*   Als de browser geen bestandskiezer ondersteunt (bijvoorbeeld Firefox of Safari), wordt de tekst als download aangeboden in plaats van opgeslagen.

## Testen

1.  **Dropzone testen:** Maak een lokaal testbestand aan op uw computer (bijv. `test.md`) met wat Markdown-tekst (bijv. `# Titel\n\n- Lijstitem 1\n- Lijstitem 2`). Sleep het bestand naar de smalle dropzone. De inhoud verschijnt in de editor en er opent een nieuw tabblad met de opgemaakte versie.
2.  **Editor testen:** Typ rechtstreeks in het tekstveld. De teller onderaan past zich aan en er verschijnt "unsaved changes".
3.  **Save testen:** Klik op **Save** (of druk `Ctrl+S`), kies een map en een bestandsnaam en controleer of het bestand op schijf staat. Bewerk de tekst daarna en klik opnieuw op **Save**: hetzelfde bestand wordt zonder nieuwe dialoog overschreven. Gebruik `Shift+Ctrl+S` om een nieuw bestand aan te maken.
4.  **Concept testen:** Typ iets, sluit het tabblad en open de extensie opnieuw. De tekst staat er nog en is gemarkeerd als niet opgeslagen.
5.  **Donkere modus testen:** Gebruik de schakelaar rechts onderaan bij de knoppen om de donkere modus in en uit te schakelen. De hele interface moet onmiddellijk van thema veranderen en de voorkeur wordt opgeslagen voor de volgende keer.
