# Allsvenskans Finaste – Deploya till Vercel

## Steg 1: Skapa Neon-databas (gratis)

1. Gå till [neon.tech](https://neon.tech)
2. Skapa konto (GitHub eller e-post)
3. Klicka **"New Project"**
4. Namn: `allsvenskans-finaste`
5. **Free tier** – inget kort behövs
6. Vänta tills databasen är redo (ca 30 sek)
7. Klicka **"Connection String"** → välj **"With pgbouncer"**
8. Kopiera strängen (ser ut så här: `postgresql://...`)

## Steg 2: Sätt DATABASE_URL

Öppna `.env.local` och klistra in:

```env
DATABASE_URL=postgresql://...  # klistra in din Neon-connection string här
```

## Steg 3: Skapa databastabeller

```bash
npm run db:migrate
```

## Steg 4: Fyll databasen med 16 klubbar

```bash
npm run db:seed
```

## Steg 5: Pusha till GitHub

```bash
git add .
git commit -m "Byt databas till Neon/PostgreSQL"
git push
```

## Steg 6: Deploya till Vercel

1. Gå till [vercel.com](https://vercel.com) och logga in med GitHub
2. Klicka **"Add New Project"**
3. Importera repo: `allsvenskans-finaste`
4. Under **Environment Variables**, lägg till:
   - `DATABASE_URL` = (klistra in samma Neon-connection string)
5. Klicka **Deploy**

## Steg 7: Verifiera

Efter deployment:
```bash
# Kontrollera att alla klubbar syns
curl https://din-app.vercel.app/api/bids | jq '.clubs | length'
# Svar ska vara: 16
```

---

## Lokal utveckling efter deployment

För att fortsätta utveckla lokalt med Neon:

```bash
npm install  # installera @neondatabase/serverless
# Sätt DATABASE_URL i .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

---

## Felaktiga lösningar

- **"better-sqlite3 not found"** → Se till att `better-sqlite3` är borttagen från `package.json`
- **"ENOTFOUND"** → Kontrollera att `DATABASE_URL` är satt i Vercel
- **Tabeller finns inte** → Kör `npm run db:migrate`
