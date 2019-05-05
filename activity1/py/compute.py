#
# CS 205, Activity 1: Your Most Similar Classmate
# https://courses.engr.illinois.edu/cs199205/activity/1.php
#

# Requires csv library
import csv

# Reads CSV file into data
with open("res/cs205welcome_clean.csv") as f:
    data = list(csv.DictReader(f))

# Work with each row of data, one at a time
for row in data:
  # Print out the name of the person for the current row
  person = row["Name"]
  print( person )
# part 1 - find me
print ("----ME----")
for row in data:
    if row["Name"] == "Nathan":
        myrow = row
print( myrow["Current Major"] + " is my major")

# part 2 - find similiar
columns = list(myrow.keys())
score = 0
similarityScore = -float('inf')
for row in data:
    for column in columns:
        if row[column] == myrow[column]:
            score += 1
    if score > similarityScore:
        similarityScore = score
        print( "Similarity with " + row["Name"] + ": " + str(similarityScore))
    else:
        print( "Similarity with " + row["Name"] + ": " + str(score))
    score = 0
