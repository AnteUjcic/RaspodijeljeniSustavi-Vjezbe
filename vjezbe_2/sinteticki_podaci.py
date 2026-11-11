"""
Vježba 2 - Priprema podataka za web-aplikaciju (Barley & Beer)

Modul simulira dohvaćanje tri međusobno neovisne skupine podataka:
  - sladovi    -> popis vrsta slada (naziv, kategorija, EBC boja)
  - pitanja    -> pitanja za kviz o pivarstvu
  - rezultati  -> rezultati korisnika koji su već odigrali kviz

Dohvaćanje je simulirano pomoću asyncio.sleep() (nasumično 1-3 sekunde po
korutini), a stvarna mrežna komunikacija dodaje se u narednim vježbama.
"""

import asyncio
import json
import random
import time
from pathlib import Path


# ---------------------------------------------------------------------------
# Korutine koje simuliraju dohvaćanje podataka iz vanjskih izvora
# ---------------------------------------------------------------------------

async def dohvati_slad(cekanje: float):
    print(f"[sladovi]   Započinje dohvaćanje sladova... (čekanje {cekanje:.2f}s)")
    await asyncio.sleep(cekanje)
    sladovi = [
        {"id": 1, "naziv": "Pilsner Malt", "kategorija": "base", "ebc": random.randint(3, 4)},
        {"id": 2, "naziv": "Munich Malt", "kategorija": "base", "ebc": random.randint(15, 25)},
        {"id": 3, "naziv": "Crystal / Caramel", "kategorija": "specialty", "ebc": random.randint(30, 300)},
        {"id": 4, "naziv": "Biscuit Malt", "kategorija": "specialty", "ebc": random.randint(45, 60)},
        {"id": 5, "naziv": "Chocolate Malt", "kategorija": "roasted", "ebc": random.randint(900, 1200)},
        {"id": 6, "naziv": "Roasted Barley", "kategorija": "roasted", "ebc": random.randint(1000, 1500)},
    ]
    print(f"[sladovi]   Završeno dohvaćanje sladova. ({cekanje:.2f}s)")
    return sladovi


async def dohvati_pitanja_kviza(cekanje: float):
    print(f"[pitanja]   Započinje dohvaćanje pitanja za kviz... (čekanje {cekanje:.2f}s)")
    await asyncio.sleep(cekanje)
    pitanja = [
        {
            "id": 1,
            "pitanje": "Koji je latinski naziv ječma?",
            "odgovori": ["Triticum aestivum", "Hordeum vulgare", "Avena sativa", "Secale cereale"],
            "tocan_odgovor": 1,
        },
        {
            "id": 2,
            "pitanje": "Koji korak sladovanja zaustavlja klijanje?",
            "odgovori": ["Močenje", "Ukomljavanje", "Sušenje", "Cijeđenje"],
            "tocan_odgovor": 2,
        },
        {
            "id": 3,
            "pitanje": "Kako se zove slatka tekućina dobivena ukomljavanjem slada?",
            "odgovori": ["Sladovina", "Mošt", "Medovina", "Salamura"],
            "tocan_odgovor": 0,
        },
    ]
    print(f"[pitanja]   Završeno dohvaćanje pitanja za kviz. ({cekanje:.2f}s)")
    return pitanja


async def dohvati_rezultate_kviza(cekanje: float, broj_korisnika: int = 5, broj_pitanja: int = 3):
    print(f"[rezultati] Započinje dohvaćanje rezultata kviza... (čekanje {cekanje:.2f}s)")
    await asyncio.sleep(cekanje)
    rezultati = [
        {"korisnik": f"korisnik_{i}", "bodovi": random.randint(0, broj_pitanja)}
        for i in range(1, broj_korisnika + 1)
    ]
    print(f"[rezultati] Završeno dohvaćanje rezultata kviza. ({cekanje:.2f}s)")
    return rezultati


# ---------------------------------------------------------------------------
# Pomoćne funkcije
# ---------------------------------------------------------------------------

def generiraj_vremena_cekanja():
    """Generira tri nasumična vremena čekanja (1-3 s), jedno po korutini."""
    return [round(random.uniform(1, 3), 2) for _ in range(3)]


async def pripremi_sekvencijalno(cekanja):
    """Dohvaća sve tri skupine podataka jednu za drugom (sekvencijalno)."""
    sladovi = await dohvati_slad(cekanja[0])
    pitanja = await dohvati_pitanja_kviza(cekanja[1])
    rezultati = await dohvati_rezultate_kviza(cekanja[2])
    return {"sladovi": sladovi, "pitanja": pitanja, "rezultati": rezultati}


async def pripremi_konkurentno(cekanja):
    """Dohvaća sve tri skupine podataka konkurentno (asyncio.gather)."""
    sladovi, pitanja, rezultati = await asyncio.gather(
        dohvati_slad(cekanja[0]),
        dohvati_pitanja_kviza(cekanja[1]),
        dohvati_rezultate_kviza(cekanja[2]),
    )
    return {"sladovi": sladovi, "pitanja": pitanja, "rezultati": rezultati}


def spremi_podatke(podaci: dict, putanja) -> None:
    """Sprema objedinjeni rječnik podataka u JSON datoteku."""
    putanja = Path(putanja)
    putanja.parent.mkdir(parents=True, exist_ok=True)
    putanja.write_text(json.dumps(podaci, ensure_ascii=False, indent=2), encoding="utf-8")


# ---------------------------------------------------------------------------
# Demonstracija ponašanja asyncio.gather() s različitim redoslijedom argumenata
# ---------------------------------------------------------------------------

async def _oznaceno_cekanje(oznaka: str, trajanje: float):
    print(f"  -> {oznaka} počinje čekati {trajanje:.2f}s")
    await asyncio.sleep(trajanje)
    print(f"  <- {oznaka} gotovo nakon {trajanje:.2f}s")
    return oznaka


async def testiraj_redoslijed_gather():
    print("\n=== Test redoslijeda asyncio.gather() ===")

    print("\nPoredak argumenata: A(2s), B(0.5s), C(1s)")
    rezultat1 = await asyncio.gather(
        _oznaceno_cekanje("A", 2.0),
        _oznaceno_cekanje("B", 0.5),
        _oznaceno_cekanje("C", 1.0),
    )
    print("Rezultat:", rezultat1)

    print("\nPoredak argumenata: C(1s), A(2s), B(0.5s)  <- isti zadaci, drugi poredak")
    rezultat2 = await asyncio.gather(
        _oznaceno_cekanje("C", 1.0),
        _oznaceno_cekanje("A", 2.0),
        _oznaceno_cekanje("B", 0.5),
    )
    print("Rezultat:", rezultat2)

    print(
        "\nZaključak: iako zadatak 'B' (najkraće čekanje) prvi FIZIČKI završi, "
        "gather() svejedno vraća rezultate u redoslijedu PROSLIJEĐENIH korutina, "
        "ne u redoslijedu njihova dovršavanja."
    )


# ---------------------------------------------------------------------------
# Glavni program
# ---------------------------------------------------------------------------

async def main():
    random.seed(42)
    cekanja = generiraj_vremena_cekanja()
    print(f"Korištena vremena čekanja (sladovi, pitanja, rezultati): {cekanja}")

    # --- Sekvencijalno ---
    print("\n--- SEKVENCIJALNO IZVOĐENJE ---")
    t0 = time.perf_counter()
    podaci_sekvencijalno = await pripremi_sekvencijalno(cekanja)
    trajanje_sekvencijalno = time.perf_counter() - t0
    print(f"Ukupno vrijeme (sekvencijalno): {trajanje_sekvencijalno:.2f} s")

    # --- Konkurentno ---
    print("\n--- KONKURENTNO IZVOĐENJE ---")
    t0 = time.perf_counter()
    podaci_konkurentno = await pripremi_konkurentno(cekanja)
    trajanje_konkurentno = time.perf_counter() - t0
    print(f"Ukupno vrijeme (konkurentno): {trajanje_konkurentno:.2f} s")

    print("\n--- SAŽETAK ---")
    print(f"Sekvencijalno: {trajanje_sekvencijalno:.2f} s")
    print(f"Konkurentno:   {trajanje_konkurentno:.2f} s")
    print(f"Ubrzanje:      {trajanje_sekvencijalno / trajanje_konkurentno:.2f}x")

    # Test ponašanja asyncio.gather() s obzirom na redoslijed argumenata
    await testiraj_redoslijed_gather()

    # Zadatak 3: spremi objedinjeni rezultat konkurentne verzije u podaci.json
    putanja_json = Path(__file__).resolve().parent / "podaci.json"
    spremi_podatke(podaci_konkurentno, putanja_json)
    print(f"\nPodaci spremljeni u: {putanja_json}")

    return {
        "cekanja": cekanja,
        "trajanje_sekvencijalno": trajanje_sekvencijalno,
        "trajanje_konkurentno": trajanje_konkurentno,
    }


if __name__ == "__main__":
    asyncio.run(main())
