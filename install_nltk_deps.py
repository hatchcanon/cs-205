import nltk

print("Working on installing nltk packages for CS 205...")

nltk_dl = nltk.downloader.Downloader()
def nltk_check_and_install(package):
    if ( nltk_dl.status(package) == nltk_dl.INSTALLED ):
        print("[nltk_check]: `" + package + "` is already installed")
    else:
        print("[nltk_check]: `" + package + "` not installed... installing:")
        nltk.download(package)
        print("[nltk_check]: `" + package + "` is now installed!")

# demo_documentSim
nltk_check_and_install("punkt")
nltk_check_and_install("wordnet")
nltk_check_and_install("stopwords")

# POSNER
nltk_check_and_install("averaged_perceptron_tagger")
nltk_check_and_install("maxent_ne_chunker")
nltk_check_and_install("words")
nltk_check_and_install("vader_lexicon")

print("[nltk_check]: COMPLETE!")
