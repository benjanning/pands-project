import csv,hashlib,json,tempfile,unittest
from pathlib import Path
import explore_iris as iris

class ExplorationTests(unittest.TestCase):
    def test_counts_hash_and_duplicate_policy(self):
        with tempfile.TemporaryDirectory() as tmp:
            e=iris.analyze(tmp,False)
            self.assertEqual(e['species_counts'],dict.fromkeys(iris.SPECIES,50))
            self.assertEqual(e['dataset_sha256'],hashlib.sha256((iris.ROOT/'iris.csv').read_bytes()).hexdigest())
            self.assertIn('Retained',e['duplicate_policy'])
    def test_summary_reconciles_raw_observations(self):
        with (iris.ROOT/'iris.csv').open(encoding='utf-8-sig') as f:raw=list(csv.DictReader(f))
        with tempfile.TemporaryDirectory() as tmp:
            iris.analyze(tmp,False)
            with (Path(tmp)/'species-summary.csv').open() as f:summary=list(csv.DictReader(f))
            self.assertEqual(len(summary),12)
            for row in summary:
                values=[float(r[row['feature']]) for r in raw if r['variety']==row['species']]
                mean=sum(values)/len(values)
                self.assertAlmostEqual(float(row['mean']),mean)
                self.assertAlmostEqual(float(row['sd']),(sum((x-mean)**2 for x in values)/(len(values)-1))**.5)
    def test_numeric_outputs_reproduce(self):
        with tempfile.TemporaryDirectory() as a,tempfile.TemporaryDirectory() as b:
            iris.analyze(a,False);iris.analyze(b,False)
            for p in Path(a).iterdir():self.assertEqual(p.read_bytes(),(Path(b)/p.name).read_bytes())

if __name__=='__main__':unittest.main()
