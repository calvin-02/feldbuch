/* Feldbuch Weißtanne 2.0 — Offline-Vorhaltung
   ---------------------------------------------------------------------------
   Aufgabe: Die App muss sich im Bestand öffnen lassen, wo es kein Netz gibt.
   Dafür legt der Browser beim ersten Besuch mit Verbindung alle Dateien in einen
   eigenen Speicher ("Cache") und bedient sich später von dort.

   Strategie: CACHE ZUERST. Im Feld darf nichts auf eine Antwort aus dem Netz
   warten — eine halb geladene Seite ist dort schlimmer als eine leicht veraltete.
   Neue Fassungen kommen über die Versionsnummer unten: Ändert sie sich, wird
   alles neu geladen und der alte Speicher gelöscht.
   --------------------------------------------------------------------------- */

const FASSUNG = "feldbuch-3.0.4";
const DATEIEN = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", ereignis => {
  ereignis.waitUntil(
    caches.open(FASSUNG)
      // WICHTIG: {cache:"reload"} erzwingt, dass jede Datei frisch vom Server geholt wird.
      // Ohne diesen Zusatz bedient sich addAll aus dem gewoehnlichen Zwischenspeicher des
      // Browsers -- und GitHub Pages laesst Dateien dort 10 Minuten liegen (max-age=600).
      // Am 08.09.2026 genau so passiert: Der Speicher hiess bereits "feldbuch-2.0.1",
      // enthielt aber die App-Fassung 2.0.0. Eine Korrektur haette das Geraet im Feld
      // dann gar nicht erreicht.
      .then(speicher => speicher.addAll(DATEIEN.map(pfad => new Request(pfad, {cache: "reload"}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", ereignis => {
  ereignis.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== FASSUNG).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", ereignis => {
  const anfrage = ereignis.request;
  if(anfrage.method !== "GET") return;
  if(new URL(anfrage.url).origin !== self.location.origin) return;

  ereignis.respondWith(
    caches.match(anfrage, {ignoreSearch:true}).then(treffer => {
      if(treffer) return treffer;
      return fetch(anfrage).then(antwort => {
        // Nur brauchbare Antworten aufheben — Fehlerseiten nicht.
        if(antwort && antwort.status === 200 && antwort.type === "basic"){
          const kopie = antwort.clone();
          caches.open(FASSUNG).then(speicher => speicher.put(anfrage, kopie));
        }
        return antwort;
      }).catch(() => {
        // Kein Netz und nichts im Speicher: Für Seitenaufrufe die App selbst liefern,
        // damit kein Dinosaurier erscheint.
        if(anfrage.mode === "navigate") return caches.match("./index.html");
        return new Response("", {status:503, statusText:"offline"});
      });
    })
  );
});
