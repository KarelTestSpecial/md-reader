# Rechtvaardiging voor Machtigingen

## `tabs` Machtiging

**Doel:** De `tabs`-machtiging is nodig om de kernfunctionaliteit van de "MD Reader"-extensie te kunnen bieden.

**Rechtvaardiging:** De primaire functie van deze extensie is om de inhoud van een lokaal Markdown-bestand (`.md`) weer te geven in een nieuw browsertabblad. Om dit te bereiken, moet de extensie de mogelijkheid hebben om een nieuw tabblad te openen via de `chrome.tabs.create()` API. Deze API-aanroep vereist de `tabs`-machtiging. Zonder deze machtiging kan de extensie de opgemaakte inhoud nergens aan de gebruiker tonen.
