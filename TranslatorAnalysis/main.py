import requests
import uuid
import pandas as pd
from googletrans import Translator
import deepl
from nltk.translate.bleu_score import sentence_bleu

key = "15a71e29429546aab3533e645fb85c38"
location = "westeurope"
constructed_url = "https://api.cognitive.microsofttranslator.com/translate"

params = {
    'api-version': '3.0',
    'from': 'en',
    'to': ['fr']
}

headers = {
    'Ocp-Apim-Subscription-Key': key,
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}

# read in the source WMT sentences from file
def readInText():
    print("Reading in English sentences...")
    sentences = []
    with open("text-data/newstest2021.en-de.src.en", "r") as ofh:
        for i in range(20):
            line = ofh.readline()
            sentences.append(line)

    return sentences


# send a request to the Microsoft server
def translateMicrosoft(sourceText):
    print("Calling Microsoft...")
    body = sourceText

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    results = request.json()

    translations = []
    for result in results:
        translations.append(result["translations"][0]["text"])

    return translations


# send a request to the Deepl server
def translateDeepl(sourceText):
    print("Calling Deepl...")
    translator = deepl.Translator("a39ddacd-0d09-96eb-d7a1-e92a670fcd32:fx")
    results = translator.translate_text(sourceText, target_lang="fr")

    translations = []
    for result in results:
        translations.append(result.text)

    return translations


# send a request to the Google server
def translateGoogle(sourceText):
    print("Calling Google...")
    translator = Translator()
    results = translator.translate(sourceText, src='en', dest='fr')

    translations = []
    for result in results:
        translations.append(result.text)

    return translations


# translate using given text and translator
def translate(wordsToTranslate, translator):
    print("Translating sentences...")
    # translate text using specified translator
    if translator == "deepl":
        translations = translateDeepl(wordsToTranslate)
    elif translator == "microsoft":
        dicts = []
        for word in wordsToTranslate:
            new_dict = {"text": word}
            dicts.append(new_dict)
        translations = translateMicrosoft(dicts)
    else:
        translations = translateGoogle(wordsToTranslate)

    # create a list of dictionaries for source/translated pairs
    translationPairs = []

    for i in range(len(wordsToTranslate)):
        pair = {
            "source": wordsToTranslate[i],
            "translation": translations[i]
        }
        translationPairs.append(pair)

    return translationPairs


def createDataFrame(translationPairs, filename):
    df = pd.DataFrame(translationPairs)
    print(df)
    df.to_csv(filename)


def compute_bleu_score(reference, candidate):
    print("Computing BLEU score...")
    print("Reference: ", reference)
    print("Candidate: ", candidate)
    score = sentence_bleu(reference, candidate)
    print(score)


if __name__ == '__main__':
    ''' Read in source sentences and translate '''
    sentencesToTranslate = readInText()
    translationPairsA = translate(sentencesToTranslate, 'microsoft')
    translationPairsB = translate(sentencesToTranslate, 'google')
    translationPairsC = translate(sentencesToTranslate, 'deepl')

    ''' Translate word list using different translators '''
    wordsToTranslate = ["face masks", "full on", "pepper-sprayed", "in tow", "random old lady", "a can of mace", "for his troubles", "crying", "told", "fresh air", "including", "mask-shaming", "bystander", "march", "clashing", "leg injury", "such as", "deploying", "worrisome to her", "it feels like"]
    #translationPairs = translate(wordsToTranslate, 'microsoft')
    #translationPairs = translate(wordsToTranslate, 'google')
    #translationPairs = translate(wordsToTranslate, 'deepl')

    ''' Create data frames from translation pairs '''
    #createDataFrame(translationPairs, 'dataFrames/EnglishToFrench-Google.csv')
    #createDataFrame(translationPairs, 'dataFrames/EnglishToFrench-Deepl.csv')

    #createDataFrame(translationPairs, 'dataFrames/EnglishToFrenchWords-Google.csv')
    #createDataFrame(translationPairs, 'dataFrames/EnglishToFrenchWords-Deepl.csv')

    compute_bleu_score(["Un couple se fait agresser dans un parc pour chiens en Californie parce qu'il ne portait pas de masque de protection pendant le déjeuner (VIDEO) - RT USA News".split()], translationPairsA[0]["translation"].split())
    compute_bleu_score(["Un couple se fait agresser dans un parc pour chiens en Californie parce qu'il ne portait pas de masque de protection pendant le déjeuner (VIDEO) - RT USA News".split()], translationPairsB[0]["translation"].split())
    compute_bleu_score(["Un couple se fait agresser dans un parc pour chiens en Californie parce qu'il ne portait pas de masque de protection pendant le déjeuner (VIDEO) - RT USA News".split()], translationPairsC[0]["translation"].split())


    '''
    with open('allSentences.txt', 'w') as f:
        for i in range(len(sentencesToTranslate)):
            f.write(sentencesToTranslate[i])
            f.write(translationPairsC[i]["translation"])
            f.write(translationPairsA[i]["translation"])
            f.write(translationPairsB[i]["translation"])
            f.write('\n')
            f.write('\n')
    '''


