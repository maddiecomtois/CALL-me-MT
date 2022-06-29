import requests
import uuid
import pandas as pd

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


def translateMicrosoft(sourceText):
    body = sourceText

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    translations = []
    for translation in response:
        translations.append(translation["translations"][0]["text"])

    return translations


def translateDeepl(sourceText):


def readInText():
    wordsToTranslate = []
    with open("text-data/newstest2021.en-de.src.en", "r") as ofh:
        for i in range(5):
            line = ofh.readline()
            print(line)
            wordsToTranslate.append(line)

    return wordsToTranslate


def createDataFrame(translationPairs):
    df = pd.DataFrame(translationPairs)
    print(df)
    df.to_csv('dataFrames/EnglishToFrench.csv')


def translateSentences():
    dicts = []
    wordsToTranslate = readInText()

    for word in wordsToTranslate:
        newDict = {"text": word}
        dicts.append(newDict)

    translations = translateMicrosoft(dicts)

    translationPairs = []

    for i in range(len(wordsToTranslate)):
        pair = {
            "source": wordsToTranslate[i],
            "translation": translations[i]
        }
        translationPairs.append(pair)

    createDataFrame(translationPairs)


def translateWord():
    dicts = []
    wordsToTranslate = ["face masks", "full on"]


if __name__ == '__main__':
    translateSentences()

