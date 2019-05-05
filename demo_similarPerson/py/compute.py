# Python :)
import csv

with open ("res/cs205welcome_clean.csv") as f:
    reader = csv.DictReader (f)
    data = [row for row in reader]

for row in data:
    person = row["Name"]
    print( person )
