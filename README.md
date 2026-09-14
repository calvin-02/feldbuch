# Feldbuch Weißtanne 2.0

Feld-Erfassung für die Dauerbeobachtungsflächen des Projektes **Weißtanne 2.0** —
Lichtmessung mit dem Solariskop samt **Koordinate an jedem Messpunkt**, Vegetation,
Bestandesbeschreibung, Weißtannen-Wachstum und Oberstand.

Entstanden im Rahmen einer Bachelorarbeit an der **HSWT (Forstingenieurwesen)** zum
räumlich expliziten Modell des für die Weißtannenverjüngung verfügbaren Lichts.

**Adresse:** <https://calvin-02.github.io/feldbuch/>

## Wofür das gebaut ist

Im Bestand gibt es kein Netz. Die Seite muss sich deshalb **ohne Verbindung öffnen** lassen
und **ohne Verbindung speichern**. Dafür sorgt ein Service Worker (`sw.js`), der beim ersten
Aufruf alle Dateien auf dem Gerät ablegt; die Aufnahme liegt im `localStorage` des Geräts.

**In diesem Verzeichnis liegen keine Messdaten** — nur das leere Formular.
`.gitignore` sperrt `*.json` und den Ordner `Aufnahmen/`, damit das so bleibt.

## Einrichten auf dem Handy

1. Adresse **einmal mit Netz** öffnen und vollständig laden lassen.
2. Unter *Daten → App und Speicher* prüfen, ob die Offline-Vorhaltung eingerichtet ist.
3. Chrome: **⋮ → Zum Startbildschirm hinzufügen**. Danach eigenes Symbol, Start im Vollbild,
   auch ohne Verbindung.

## Dateien

| Datei | Rolle |
|---|---|
| `index.html` | die vollständige App — eine Datei, kein Bauwerkzeug nötig |
| `sw.js` | Offline-Vorhaltung. **Bei jeder Änderung die Fassungsnummer hochzählen** |
| `manifest.webmanifest` | Name, Symbole, Vollbildstart |
| `icon-*.png`, `apple-touch-icon.png` | Symbole |
| `teile/` | Quellstücke, aus denen `index.html` zusammengesetzt wird |
| `pruefseite.html` | **Prüfseite**: zeichnet die Skizze in vier Drehungen und rechnet dreizehn Prüfungen nach. Gehört nicht zur App, sondern zur Kontrolle |

## Ändern

`index.html` wird aus `teile/` zusammengesetzt — die Reihenfolge steckt in den Nummern:

```bash
cat teile/0*.html teile/1*.html > index.html
```

Danach in `sw.js` die Zeile `const FASSUNG = "feldbuch-x.y.z"` hochzählen **und** in
`teile/06_js_daten.html` `FASSUNG` nachziehen. Ohne diesen Schritt bleibt auf den Geräten die
alte Fassung liegen.

| Baustein | Inhalt |
|---|---|
| `01_kopf.html` | Kopf, CSS, Navigation |
| `02_flaeche.html` | Flächenliste und Flächendaten |
| `03_skizze.html` | Skizze mit Ansichtsdrehung |
| `04_licht_veg.html` | Licht, Vegetation, Tannen, Oberstand |
| `05_pass_gel_daten.html` | Abschluss und Datenverwaltung |
| `06_js_daten.html` | **Datenmodell, Zusammenführen, Flächenverwaltung** · hier steht `FASSUNG` |
| `07_js_ui.html` | Oberfläche, Navigation, Flächenliste |
| `08_js_skizze.html` | Geometrie, Zeichnung, Drehung |
| `09_js_licht_veg.html` | Messpunkte und Vegetation |
| `10_js_baeume.html` | Weißtannen und Oberstand |
| `11_js_gps.html` | **Koordinaten je Punkt**, UTM, Abschlusskontrolle |
| `12_js_export.html` | Export, Einlesen, Offline-Betrieb |
| `13_js_sync.html` | **Synchronisation über das Netz** (zuschaltbar) |
| `14_js_start.html` | Start |

## Was die App im Feld prüft

Prüfungen, die **scheitern können** — das ist ihr Zweck:

- **Fehlende Koordinaten**: Die Abschlusskontrolle nennt jeden Punkt ohne GPS beim Namen
- **Fehlende Bild-Nummern**: die einzige Verbindung zwischen Datei und Punkt
- **Trennstreifenbreite** gegen die Parzellenbreiten — passt es nicht, ist ein Maß falsch
- **Direktanteil `p`** aus ISF, DSF und TSF zurückgerechnet und gegen die Geräteeinstellung gehalten
- **Soll-Azimut und Soll-Distanz** jedes Satellitenpunktes aus der Flächengeometrie
- **Wiederholbarkeit** aus den beiden Messungen W-1 und W-2 desselben Punktes
- **Nordbezug** der Azimute — magnetisch ist rechenbar, unbekannt nicht
- **Widersprüche beim Zusammenführen**: Felder, die zwei Geräte verschieden gefüllt haben

## Stand

**Fassung 3.0.0 (14./15.09.2026) — mehrere Flächen, Zusammenführen, GPS je Punkt.**

Fünf Leitgedanken:

1. **Mehrere Flächen nebeneinander.** Fassung 2 hielt genau eine Aufnahme; wer eine zweite
   begann oder eine fremde Sicherung einlas, überschrieb die erste.
2. **Zusammenführen statt Überschreiben.** Jedes Feld trägt einen Zeitstempel; treffen zwei
   Stände derselben Fläche aufeinander, gewinnt Feld für Feld der jüngere. Listen werden
   vereinigt. Widersprüche werden gemeldet, nicht still entschieden.
3. **Synchronisation über das Netz**, zuschaltbar — dieselbe Mechanik wie beim Dateiaustausch.
   Einrichtung: `Unterlagen/Feldapp_Synchronisation_Einrichtung.md`.
4. **GPS an jedem Messpunkt**, zwei Serien, 45 Sekunden Messdauer mit gewichtetem Mittel.
   Die Ko-Registrierung über Passpunktbäume ist am 09.09.2026 gescheitert; die Lage der
   Fläche hängt seither an genau diesen Koordinaten.
5. **Weniger Felder.** Die Geräteeinstellungen stehen als belegte Vorgabe aus BY07 und werden
   nur noch abgehakt; die Lichtmaske zeigt Knopf und Bild-Nummer, die Werte sind eingeklappt.
   Ko-Registrierung und die Geländeschätzung sind entfallen — das DGM1 ist genauer.

Geometrisch geändert: **eine Breite je Parzelle** statt außen und innen (so wird im Feld
gemessen), **Trennstreifen mit Länge und Breite**, **Ansichtsdrehung** der Skizze.

Aufnahmen aus Fassung 1 und 2 werden beim ersten Start übernommen; geprüft an der echten
BY07-Aufnahme vom 07.09.2026 — 33 Felder, keines verloren. Was aus den entfallenen
Abschnitten stammt, wird an die Bemerkung angehängt statt weggeworfen.

Frühere Fassungen: 2.1.2 (12.09., Codelisten gegen die Projektmasken abgeglichen) ·
2.1.0 (10.09., Verortung über den Oberstand) · 2.0.0 (08.09., offline und installierbar,
nach dem ersten Feldtag auf BY07).

Der Stand vor dem Umbau ist als Git-Markierung `fassung-2.1.2-vor-umbau` erhalten:

```bash
git checkout fassung-2.1.2-vor-umbau -- .
```
