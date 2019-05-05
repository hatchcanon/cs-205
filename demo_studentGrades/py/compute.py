import csv
import json

# Create some data to visualize
grades = [
    { "student": "1", "grade": 87 },
    { "student": "2", "grade": 91 },
    { "student": "3", "grade": 64 },
    { "student": "4", "grade": 97 },
    { "student": "5", "grade": 93 },
    { "student": "6", "grade": 71 },
    { "student": "7", "grade": 94 },
    { "student": "8", "grade": 63 },
    { "student": "9", "grade": 99 },
    { "student": "10", "grade": 84 }
]

# Write the list as a JSON:
with open("res/studentGrades.json", "w") as f:
    json.dump(grades, f, indent=2)
