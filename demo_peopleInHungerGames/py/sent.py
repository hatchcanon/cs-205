import json
from nltk.tokenize import word_tokenize
from nltk.tokenize import sent_tokenize
from nltk import pos_tag
from nltk import ne_chunk
from collections import defaultdict
from collections import Counter
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import re


def pprint(title, text):
    import pprint
    pp = pprint.PrettyPrinter()

    print(" == " + title + " == ")
    pp.pprint(text)
    print(" == /" + title + " == ")
    print()


def pprint_tree(title, array):
    import pprint
    pp = pprint.PrettyPrinter()

    print(" == " + title + " == ")
    for tree in array:
        print(tree)
    print(" == /" + title + " == ")
    print()


def getPeopleFromText(text):
    sents = sent_tokenize(text)
    pprint("Sentences (S)", sents)
    input("...press enter to continue...")

    sentWords = [word_tokenize(s) for s in sents if s]
    pprint("Tokenized words, fron each (S)", sentWords)
    input("...press enter to continue...")

    sentWordsPOS = [pos_tag(s) for s in sentWords]
    pprint("Tokenized words w/ Part of Speech (POS)", sentWordsPOS)
    input("...press enter to continue...")

    sentWordsNER = [ne_chunk(s) for s in sentWordsPOS]
    pprint_tree("Tokenized words w/ Named Entity Recognition (NER)", sentWordsNER)
    input("...press enter to continue...")

    chunks = [chunk for chunk in sentWordsNER if hasattr(chunk, 'label')]
    pprint_tree("Tokenized words w/ only named entites (NER-only)", chunks)
    input("...press enter to continue...")

    subtrees = [chunk.subtrees() for chunk in chunks]
    entities = [[ s for s in st if s.label() == "PERSON"] for st in subtrees]
    pprint_tree("Filter NER-only to labels of \"PERSON\"", entities)
    input("...press enter to continue...")

    entities = [[ ' '.join(c[0] for c in s.leaves()) for s in st] for st in entities]
    pprint("Remove NER tags", entities)
    input("...press enter to continue...")

    names = []
    for st in entities:
        for s in st:
            names.append(s)
    pprint("Flatten list into a list of words that were tagged with \"PERSON\"", names)

    return names


def getSentimentFromText(text):
    sents = sent_tokenize(text)
    pprint("Sentences (S)", sents)
    input("...press enter to continue...")

    sid = SentimentIntensityAnalyzer()
    sentiment = [sid.polarity_scores(s)["compound"] for s in sents]
    pprint("Sentiments of (S)", sentiment)

    for i in range(len(sents)):
        print(str(sentiment[i]) + ": " + sents[i])
    return sentiment




text = "I watch as Gale pulls out his knife and slices the bread. " \
       "He could be my brother. " \
       "Straight black hair, olive skin, we even have the same gray eyes."

text2 = "After the reaping, everyone is supposed to celebrate. " \
        "And a lot of people do, out of relief that their children have been spared for another year. " \
        "But at least two families will pull their shutters, lock their doors, and try to figure out how they will survive the painful weeks to come."

names = getPeopleFromText(text)
sentiment = getSentimentFromText(text2)
