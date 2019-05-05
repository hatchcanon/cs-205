import csv
import json
from collections import OrderedDict

f = open("res/illiniFootballScores.csv")
reader = csv.DictReader(f)
data = [row for row in reader]

outdata = json.dumps(data, indent=2)
outfile = open("res/scores.json", "w")
outfile.write(outdata)
outfile.close()
