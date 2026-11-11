# Vježba 2: Priprema podataka za web-aplikaciju (Barley & Beer)

## Opis podataka i operacija

Program `sinteticki_podaci.py` simulira dohvaćanje tri **međusobno neovisne**
skupine podataka za aplikaciju *Barley & Beer* (edukativna stranica o ječmu i
pivarstvu):

| Korutina                  | Podaci koje vraća                                                              |
|----------------------------|---------------------------------------------------------------------------------|
| `dohvati_slad()`           | Lista vrsta slada (id, naziv, kategorija: base/specialty/roasted, EBC boja)     |
| `dohvati_pitanja_kviza()`  | Lista pitanja za kviz o pivarstvu (pitanje, ponuđeni odgovori, točan odgovor)   |
| `dohvati_rezultate_kviza()`| Lista rezultata korisnika koji su već odigrali kviz (korisnik, bodovi)         |

Nijedna korutina ne ovisi o rezultatu neke druge, tako da ih se može izvršavati
konkurentno. Dohvaćanje je simulirano pomoću `asyncio.sleep()` — stvarni mrežni
poziv dodaje se u narednim vježbama.

## Korištena vremena čekanja

Prije mjerenja postavljen je `random.seed(42)`, a zatim su jednom generirana tri
nasumična vremena čekanja (1–3 s) i proslijeđena identično objema verzijama:

```
cekanja = [2.28, 1.05, 1.55]   # sladovi, pitanja, rezultati
```

## Izmjerena vremena izvođenja

| Način izvođenja     | Vrijeme   |
|----------------------|-----------|
| Sekvencijalno        | **4.89 s** (≈ 2.28 + 1.05 + 1.55) |
| Konkurentno          | **2.28 s** (≈ max(2.28, 1.05, 1.55)) |
| Ubrzanje             | ≈ 2.14× |

(stvarni ispis programa, `python3 sinteticki_podaci.py`)

## Odgovori na pitanja iz zadatka 2

**Koliko traje izvođenje programa pri sekvencijalnoj obradi? Zašto?**
Sekvencijalna obrada traje **4.89 s**, odnosno zbroj svih pojedinačnih vremena
čekanja (2.28 + 1.05 + 1.55 s). Svaka korutina se izvršava do kraja (uključujući
`await asyncio.sleep()`) prije nego što program krene na sljedeću, pa se vremena
čekanja zbrajaju.

**Koliko traje izvođenje programa pri konkurentnoj jednodretvenoj obradi? Zašto?**
Konkurentna obrada traje **2.28 s**, odnosno vrijeme najduže korutine
(`dohvati_slad`, 2.28 s). Kada se korutine pokrenu putem `asyncio.gather()`, sve tri
odmah predaju kontrolu *event loopu* čim dođu do `await asyncio.sleep()`. Event loop
tada "čeka" sve njih istovremeno (jedna dretva, ali više istovremeno otvorenih
I/O/timer operacija), pa je ukupno vrijeme jednako najdužem pojedinačnom čekanju, a
ne njihovom zbroju.

**Koja je glavna razlika između ovih dvaju načina izvođenja? Kako se korutine
izvršavaju unutar event loopa?**
Kod sekvencijalnog izvođenja korutine se pokreću i dovršavaju jedna za drugom —
svaki `await` blokira nastavak programa dok se ta korutina u potpunosti ne izvrši.
Kod konkurentnog izvođenja (`asyncio.gather`) sve se korutine *pokrenu* odmah, a
event loop zatim kooperativno prebacuje izvršavanje između njih: kad korutina dođe
do `await asyncio.sleep()`, ona vraća kontrolu event loopu, koji u tom vremenu može
pokrenuti/nastaviti druge korutine. Sve se izvodi u **jednoj dretvi** — nema
stvarnog paralelizma, samo preklapanja čekanja (I/O-bound konkurentnost), pa se ukupno
vrijeme skraćuje na vrijeme najduže operacije umjesto zbroja svih.

**Što se događa ako u korutinama pokušate zamijeniti `asyncio.sleep` sa `time.sleep`?
Koja je tehnička razlika u implementaciji ovih sleep funkcija?**
Ako se `asyncio.sleep()` zamijeni sa `time.sleep()`, konkurentnost se gubi: `time.sleep()`
je **blokirajuća** (sinkrona) funkcija koja zaustavlja cijelu dretvu, uključujući event
loop, i ne vraća kontrolu dok ne istekne vrijeme. Event loop tada ne može izvršavati
druge korutine za vrijeme tog čekanja, pa bi "konkurentna" verzija s `asyncio.gather()`
svejedno trajala kao zbroj svih vremena (4.89 s) — jednako sporo kao sekvencijalna
verzija, samo bez stvarnih prednosti konkurentnosti. Tehnička razlika: `asyncio.sleep()`
je korutina koja event loopu samo registrira *timer* i odmah vraća kontrolu (`await`
suspendira samo tu korutinu, ne cijeli program), dok je `time.sleep()` obični
sistemski poziv koji fizički blokira dretvu izvršavanja dok ne istekne.

**Vraća li `asyncio.gather()` rezultate uvijek istim redoslijedom? Odgovara li taj
redoslijed redoslijedu proslijeđenih korutina ili redoslijedu njihova dovršavanja?**
Da — `asyncio.gather()` **uvijek** vraća rezultate u redoslijedu **proslijeđenih
korutina** (argumenata), bez obzira na redoslijed njihova stvarnog dovršavanja.
To je demonstrirano u programu (`testiraj_redoslijed_gather()`): iako je korutina s
najkraćim čekanjem (0.5 s) uvijek prva fizički završila, rezultat liste je ipak
poredan prema redoslijedu u pozivu `gather(...)`, a ne prema brzini izvršavanja:

```
gather(A(2s), B(0.5s), C(1s))  -> ['A', 'B', 'C']   (B završi prvi, ali rezultat je [A, B, C])
gather(C(1s), A(2s), B(0.5s))  -> ['C', 'A', 'B']
```

## Zadatak 3: prikaz podataka na frontendu

Objedinjeni rezultat konkurentne verzije spremljen je u `podaci.json` pomoću
`json.dump`/`json.dumps` (funkcija `spremi_podatke`), te ručno kopiran u
`vjezbe_1/frontend/podaci.json` (frontend ga poslužuje kao statičku datoteku).

Frontend (`index.html`/`script.js`/`style.css` iz vježbe 1) nadograđen je novom
sekcijom **"Vježba 2: Sintetički podaci"** koja putem `fetch("podaci.json")`
dohvaća datoteku i prikazuje sve tri skupine podataka: sladove (tablica),
pitanja za kviz (lista) i rezultate korisnika (tablica).

Javni URL frontend aplikacije (iz vježbe 1, nadograđen ovom vježbom):
`https://raspodijeljenisustavi-vjezbe.onrender.com/`

**Napomena:** frontend treba ponovno deployati na Render.com (git push na
`main`, Render automatski redeploya statičke datoteke) da bi se na javnom
URL-u vidjela nova sekcija "Vježba 2: Sintetički podaci" s učitanim
`podaci.json`. Nakon redeploya provjeriti prikazuju li se podaci na stranici.
