import json
import re

import nltk
from nltk import pos_tag
from nltk import ne_chunk
from nltk.tokenize import word_tokenize
from nltk.tokenize import sent_tokenize
from nltk.tag.perceptron import PerceptronTagger
from nltk.sentiment.vader import SentimentIntensityAnalyzer

from collections import defaultdict
from collections import Counter

# Windows Command Line Fix (Python 3)
import sys
import codecs
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())


def cleanText_HungerGames(text):
    match = r'\d+ \| P a g e\w*'
    text = re.sub(match, '', text)
    match = r'The Hunger Games - Suzanne Collins\w*'
    text = re.sub(match, '', text)

    text = re.sub('\n\n+', '--MARKER--', text)
    text = re.sub('\n', ' ', text)
    text = re.sub('  ', ' ', text)
    text = re.sub('--MARKER--', '\n\n', text)

    return text


def tokenizeSentences(text):
    print("Tokenizing sentences...")
    return sent_tokenize(text)


def getSentenceSentiment(sents):
    print("Doing sentiment analysis...")
    sid = SentimentIntensityAnalyzer()
    sentiment = [sid.polarity_scores(s)["compound"] for s in sents]
    return sentiment


def getPeopleFromText(sents):
    print("Tokenizing words...")
    sentWords = [word_tokenize(s) for s in sents if s]

    print("POS tags")
    tagger = PerceptronTagger()
    sentWordsPOS = [ nltk.tag._pos_tag(s, None, tagger) for s in sentWords ]
    #sentWordsPOS = [pos_tag(s) for s in sentWords]

    print("NER")
    sentWordsNER = [ne_chunk(s) for s in sentWordsPOS]

    print("Filtering")
    chunks = [chunk for chunk in sentWordsNER if hasattr(chunk, 'label')]
    subtrees = [chunk.subtrees() for chunk in chunks]
    entities = [[ s for s in st if s.label() == "PERSON"] for st in subtrees]
    entities = [[ ' '.join(c[0] for c in s.leaves()) for s in st] for st in entities]

    return entities


textFile = 'res/hg.txt'
textRaw = open(textFile, encoding="utf-8").read() #textRaw is now a string
text = cleanText_HungerGames(textRaw)
sents = tokenizeSentences(text)

sentiments = getSentenceSentiment(sents)
persons = getPeopleFromText(sents)

# Output sorted sentence sentiment
sent_sentiment = []
for i in range(len(sents)):
    sent_sentiment.append({
        "sent": sents[i],
        "sentiment": sentiments[i]
    })

sent_sentiment = sorted(sent_sentiment, key=lambda k: k['sentiment'])
with open("res/sent_sentiment.json",'w') as f:
    s = json.dumps(sent_sentiment, indent = 4)
    f.write(s)

# Output people and sentiments
out = {
    "sentences": len(sentiments),
    "sentiments": sentiments,
    "persons": persons
}


with open("res/hg.json",'w') as f:
    s = json.dumps(out, indent = 2)
    f.write(s)
