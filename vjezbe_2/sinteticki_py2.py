import asyncio
import random
import time


async def dohvati_slad():
    print("Započinje dohvaćanje sladova...")
    await asyncio.sleep(1)
    sladovi = [
        {"id": 1, "naziv": "Pilsner Malt", "kategorija": "base", "ebc": random.randint(3, 4)},
        {"id": 2, "naziv": "Munich Malt", "kategorija": "base", "ebc": random.randint(15, 25)},
        {"id": 3, "naziv": "Crystal / Caramel", "kategorija": "specialty", "ebc": random.randint(30, 300)},
        {"id": 4, "naziv": "Biscuit Malt", "kategorija": "specialty", "ebc": random.randint(45, 60)},
        {"id": 5, "naziv": "Chocolate Malt", "kategorija": "roasted", "ebc": random.randint(900, 1200)},
        {"id": 6, "naziv": "Roasted Barley", "kategorija": "roasted", "ebc": random.randint(1000, 1500)},
    ]
    print("Završeno dohvaćanje sladova.")
    return sladovi


async def dohvati_pitanja_kviza():
    print("Započinje dohvaćanje pitanja za kviz...")
    await asyncio.sleep(3)
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
    print("Završeno dohvaćanje pitanja za kviz.")
    return pitanja


async def dohvati_rezultate_kviza(broj_korisnika=5, broj_pitanja=3):
    print("Započinje dohvaćanje rezultata kviza...")
    await asyncio.sleep(1.5)
    rezultati = [
        {"korisnik": f"korisnik_{i}", "bodovi": random.randint(0, broj_pitanja)}
        for i in range(1, broj_korisnika + 1)
    ]
    print("Završeno dohvaćanje rezultata kviza.")
    return rezultati


async def main():
    pocetak = time.perf_counter()

    sladovi =   await dohvati_slad()
    pitanja=  await dohvati_pitanja_kviza()
    rezultati= await dohvati_rezultate_kviza()

    print(f"\nUkupno vrijeme: {time.perf_counter() - pocetak:.2f} s")
    print(f"\nSladovi ({len(sladovi)}):", sladovi)
    print(f"\nPitanja ({len(pitanja)}):", pitanja)
    print(f"\nRezultati ({len(rezultati)}):", rezultati)
    print(type(pitanja),type(pitanja[0]))


if __name__ == "__main__":
    asyncio.run(main())
