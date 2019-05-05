import json
import re
import nltk
from math import log, sqrt
from collections import Counter

def cleanText_HungerGames(text):
    match = r'\d+ \| P a g e\w*'
    text = re.sub(match, '', text)
    match = r'The Hunger Games - Suzanne Collins\w*'
    text = re.sub(match, '', text)

    text = re.sub('\n\n+', '--MARKER--', text)
    text = re.sub('\n', ' ', text)
    text = re.sub('--MARKER--', '\n\n', text)

    #text = text.lower()

    return text

def getParagraphs(text):
    from nltk.tokenize import TextTilingTokenizer
    return TextTilingTokenizer().tokenize(text)

def getWords(text):
    from nltk.tokenize import word_tokenize
    words = word_tokenize(text)

    words = [w.lower() for w in words]
    words = [w for w in words if w.isalpha()]

    return words

def cosSimilarity(a, b):
    inner = 0
    sumsqA = 0
    sumsqB = 0
    for w in a:
        sumsqA += a[w] * a[w]
        if w in b:
            inner += a[w] * b[w]
    for w in b:
        sumsqB += b[w] * b[w]

    d = sqrt(sumsqA) * sqrt(sumsqB)
    if d == 0:
        return 0
    else:
        return inner / d

def getWordFreq(words):
    freq = Counter()
    for word in words:
        freq[word] += 1
    return freq

# Array for out output data
outData = []

# Open the text, read the entire file
textFile = 'res/hg-short.txt'
text = open(textFile).read()

# Clean the text of Hunger Games-specific page stuffs
text = cleanText_HungerGames(text)

# Transform the text into paragraphs
paragraphs = getParagraphs(text)

# In tf-idf, we need a complete count of words
globalWords = getWords(text)
globalFreq = getWordFreq(globalWords)
uniqueGlobalWords = list(set(globalWords))


globalTermCount = Counter()
for paragraph in paragraphs:
    paragraphWords = getWords(paragraph)

    for word in uniqueGlobalWords:
        if word in paragraphWords:
            globalTermCount[word] += 1



tfidfList = []
for paragraph in paragraphs:
    paragraphWords = getWords(paragraph)
    paragraphFreq = getWordFreq(paragraphWords)

    tfidf = {}
    for word in paragraphWords:
        # How many times did the term appear in the paragraph?
        tf = paragraphFreq[word]

        # log( [total paragraphs] / [total paragraphs with `word`]  )
        idf = log( len(paragraphs) / globalTermCount[word] )

        #
        tfidf[word] = tf * idf
    tfidfList.append(tfidf)


# Compute weights
similarities = []
for i in range( len(paragraphs) ):
    for j in range( i + 1, len(paragraphs) ):
        similarity = cosSimilarity( tfidfList[i], tfidfList[j] )

        similarities.append({
            "source": i,
            "target": j,
            "similarity": similarity,
            "source-tfidf": tfidfList[i],
            "target-tfidf": tfidfList[j]
        })

nodes = []
for i in range( len(paragraphs) ):
    nodes.append({
        "index": i,
        "text": paragraphs[i].strip()
    })

# Output
outData = {
    "vertices": nodes,
    "edges": similarities
}

f = open("res/graph.json", "w")
s = json.dumps(outData, indent = 2)
f.write(s)
