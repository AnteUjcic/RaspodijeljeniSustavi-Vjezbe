import asyncio
import json
from pathlib import Path
import unittest
import sinteticki_podaci as program


class TestPodaci(unittest.TestCase):
    def test_spremanje_konkurentnih_podataka(self):
        import tempfile
        with tempfile.TemporaryDirectory() as folder:
            putanja = Path(folder) / 'podaci.json'
            podaci = asyncio.run(program.pripremi_konkurentno([0, 0, 0]))
            program.spremi_podatke(podaci, putanja)
            self.assertEqual(json.loads(putanja.read_text(encoding='utf-8')), podaci)
            self.assertEqual(set(podaci), {'sladovi', 'pitanja', 'rezultati'})
            self.assertEqual([len(podaci[k]) for k in podaci], [6, 3, 5])


if __name__ == '__main__':
    unittest.main()
