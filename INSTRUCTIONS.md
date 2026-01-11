# Instructies voor het testen van de MD Reader-extensie

Volg deze stappen om de MD Reader Chrome-extensie te laden en te testen:

1.  **Open Google Chrome.**
2.  **Navigeer naar de extensiepagina:** Typ `chrome://extensions` in de adresbalk en druk op Enter.
3.  **Schakel de ontwikkelaarsmodus in:** Zoek naar de schakelaar "Ontwikkelaarsmodus" (of "Developer mode") in de rechterbovenhoek van de pagina en zorg ervoor dat deze is ingeschakeld.
4.  **Laad de uitgepakte extensie:** Klik op de knop "Uitgepakte extensie laden" (of "Load unpacked") die linksboven verschijnt.
5.  **Selecteer de projectmap:** Navigeer in het bestandsselectievenster naar de map die de extensiebestanden bevat (`manifest.json`, `index.html`, `script.js` en `marked.min.js`) en selecteer deze map.
6.  **Open de extensie:** De "MD Reader"-extensie zou nu in uw lijst met extensies moeten verschijnen. Klik op het puzzelstukpictogram in de werkbalk van Chrome en vervolgens op "MD Reader" om de pop-up te openen.
7.  **Test de functionaliteit:**
    *   Maak een lokaal testbestand aan op uw computer (bijv. `test.md`).
    *   Voeg wat Markdown-tekst toe aan dit bestand (bijv. `# Titel\n\n- Lijstitem 1\n- Lijstitem 2`).
    *   Sleep het `test.md`-bestand vanuit uw bestandsverkenner en zet het neer in de dropzone ("Sleep een .md-bestand hierheen") in de pop-up van de extensie.
    *   **Test de donkere modus:** Gebruik de schakelaar onder de dropzone om de donkere modus in en uit te schakelen. De pop-up moet onmiddellijk van thema veranderen. De voorkeur wordt opgeslagen.
8.  **Verifieer het resultaat:** Er zou een nieuw browsertabblad moeten openen met de inhoud van uw `.md`-bestand, correct opgemaakt in HTML. Het thema van het tabblad (licht of donker) moet overeenkomen met de instelling in de pop-up.
