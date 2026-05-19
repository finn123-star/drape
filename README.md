# Higher / Lower — Deutscher Rap

Weißt du, welcher deutsche Rap-Song mehr Spotify-Streams hat?

## Das Spiel

Unter `/game` findest du das Higher/Lower-Spiel. Zwei Songs werden nebeneinander angezeigt — du siehst die Stream-Zahl des linken Songs und musst raten, ob der rechte Song mehr oder weniger Streams hat. Bei jeder richtigen Antwort steigt dein Score. Ein Fehler und das Spiel ist vorbei.

## Lokal starten

```bash
npm install
npm run dev
```

Dann öffne [http://localhost:3000/game](http://localhost:3000/game).

## Deployment auf Vercel

1. Repository auf GitHub pushen
2. [vercel.com/new](https://vercel.com/new) öffnen und das Repo importieren
3. Framework: **Next.js** (wird automatisch erkannt)
4. Keine weiteren Umgebungsvariablen nötig für das Spiel
5. **Deploy** klicken — fertig

Das Spiel ist danach unter `https://deine-domain.vercel.app/game` erreichbar.

## Song-Daten anpassen

Die Song-Daten liegen in `data/songs.json`. Felder:

| Feld      | Typ    | Beschreibung                   |
|-----------|--------|--------------------------------|
| `id`      | number | Eindeutige ID                  |
| `artist`  | string | Künstlername                   |
| `title`   | string | Songtitel                      |
| `streams` | number | Spotify-Streams (reine Zahl)   |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion (Animationen)
