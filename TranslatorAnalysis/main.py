import requests
import uuid
import pandas as pd
from googletrans import Translator

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
    sentences = []
    with open("text-data/newstest2021.en-de.src.en", "r") as ofh:
        for i in range(20):
            line = ofh.readline()
            print(line)
            sentences.append(line)

    return sentences


# send a request to the Microsoft server
def translateMicrosoft(sourceText):
    body = sourceText

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    translations = []
    for translation in response:
        translations.append(translation["translations"][0]["text"])

    return translations


# send a request to the Deepl server
def translateDeepl(sourceText):
    request = requests.post("https://api-free.deepl.com/v2/usage?auth_key=a39ddacd-0d09-96eb-d7a1-e92a670fcd32:fx")
    print(request.json())
    return []


# send a request to the Google server
def translateGoogle(sourceText):
    translator = Translator()
    response = translator.translate(sourceText, src='en', dest='fr')

    translations = []
    for word in response:
        print(word.text)
        translations.append(word.text)

    return translations


# translate using given text and translator
def translate(wordsToTranslate, translator):
    # translate text using specified translator
    if translator == "deepl":
        translations = translateDeepl(wordsToTranslate)
    elif translator == "microsoft":
        dicts = []
        for word in wordsToTranslate:
            newDict = {"text": word}
            dicts.append(newDict)
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

    print(translationPairs)
    return translationPairs


def createDataFrame(translationPairs, filename):
    df = pd.DataFrame(translationPairs)
    print(df)
    df.to_csv(filename)


if __name__ == '__main__':
    ''' Read in source sentences and translate '''
    #sentencesToTranslate = readInText()
    #translate(sentencesToTranslate, 'microsoft')

    wordsToTranslate = ["face masks", "full on", "pepper-sprayed", "in tow", "random old lady", "a can of mace", "for his troubles", "crying", "told", "fresh air", "including", "mask-shaming", "bystander", "march", "clashing", "leg injury", "such as", "deploying", "worrisome to her", "it feels like"]

    ''' Translate word list using different translators '''
    #translationPairs = translate(wordsToTranslate, 'microsoft')
    #translationPairs = translate(wordsToTranslate, 'google')

    ''' Create data frames from translation pairs '''
    #createDataFrame(translationPairs, 'dataFrames/EnglishToFrenchWords.csv')

