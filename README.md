# Feldbuch Weißtanne 2.0

Feld-Erfassung für die Dauerbeobachtungsflächen des Projektes **Weißtanne 2.0** —
Lichtmessung mit dem Solariskop, Vegetation, Bestandesbeschreibung, Weißtannen-Wachstum,
Oberstand, Ko-Registrierung und Gelände.

Entstanden im Rahmen einer Bachelorarbeit an der **HSWT (Forstingenieurwesen)** zum
räumlich expliziten Modell des für die Weißtannenverjüngung verfügbaren Lichts.

**Adresse:** <https://calvin-02.github.io/feldbuch/>

## Wofür das gebaut ist

Im Bestand gibt es kein Netz. Die Seite muss sich deshalb **ohne Verbindung öffnen** lassen
und **ohne Verbindung speichern**. Dafür sorgt ein Service Worker (`sw.js`), der beim ersten
Aufruf alle Dateien auf dem Gerät ablegt; die Aufnahme selbst liegt im `localStorage` des
Geräts und verlässt es nur, wenn man sie ausdrücklich kopiert oder als Datei sichert.

**In diesem Verzeichnis liegen keine Messdaten** — nur das leere Formular.
`.gitignore` sperrt `*.json` und den Ordner `Aufnahmen/`, damit das so bleibt.

## Einrichten auf dem Handy

1. Adresse **einmal mit Netz** öffnen und vollständig laden lassen.
2. Unter *Daten → App und Speicher* prüfen: **„Offline vorgehalten: ja"**.
3. Chrome: **⋮ → Zum Startbildschirm hinzufügen**. Danach eigenes Symbol, Start im Vollbild,
   auch ohne Verbindung.

## Dateien

| Datei | Rolle |
|---|---|
| `index.html` | die vollständige App — eine Datei, kein Bauwerkzeug nötig |
| `sw.js` | Offline-Vorhaltung. **Bei jeder Änderung die Versionsnummer oben hochzählen**, sonst holt sich niemand die neue Fassung |
| `manifest.webmanifest` | Name, Symbole, Vollbildstart |
| `icon-*.png`, `apple-touch-icon.png` | Symbole |
| `teile/` | Quellstücke, aus denen `index.html` zusammengesetzt wird |

## Ändern

`index.html` wird aus `teile/` zusammengesetzt — die Reihenfolge steckt in den Nummern:

```bash
cat teile/0*.html teile/1*.html > index.html
```

Danach in `sw.js` die Zeile `const FASSUNG = "feldbuch-x.y.z"` hochzählen und in `index.html`
(Teil 06) `FASSUNG` und `STAND` nachziehen. Ohne diesen Schritt bleibt auf den Geräten die
alte Fassung liegen.

## Was die App im Feld prüft

Prüfungen, die **scheitern können** — das ist ihr Zweck:

- **Direktanteil `p`** aus ISF, DSF und TSF zurückgerechnet und gegen die Geräteeinstellung gehalten
- **Sollabstand A→B** aus den Gattermaßen gegen die gemessene Klammer und gegen die
  Verbindungsbäume
- **Soll-Azimut und Soll-Distanz** jedes Satellitenpunktes aus der Flächengeometrie
- **Passpunktbäume**: unterständige Bäume, Höhe = Distanz (Übertragungsfehler), zu kurze Visuren
- **Wiederholbarkeit** aus den beiden Messungen W-1 und W-2 desselben Punktes
- **Nordbezug** der Azimute — magnetisch ist rechenbar, unbekannt nicht

## Stand

Fassung 2.0.0 (08.09.2026). Gebaut nach dem ersten Feldtag auf **BY07** am 07.09.2026.
