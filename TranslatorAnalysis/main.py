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
    request = requests.post("https://api-free.deepl.com/v2/usage?auth_key=a39ddacd-0d09-96eb-d7a1-e92a670fcd32:fx")
    print(request.json())


def readInText():
    wordsToTranslate = []
    with open("text-data/newstest2021.en-de.src.en", "r") as ofh:
        for i in range(20):
            line = ofh.readline()
            print(line)
            wordsToTranslate.append(line)

    return wordsToTranslate


def createDataFrame(translationPairs, filename):
    df = pd.DataFrame(translationPairs)
    print(df)
    df.to_csv(filename)


def translate(wordsToTranslate, dataFrameFileName):
    dicts = []

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

    createDataFrame(translationPairs, dataFrameFileName)
    print(translationPairs)



if __name__ == '__main__':
    #wordsToTranslate = readInText()
    #translate(wordsToTranslate, 'dataFrames/EnglishToFrench.csv')

    wordsToTranslate = ["face masks", "full on", "pepper-sprayed", "in tow", "random old lady", "a can of mace", "for his troubles", "crying", "told", "fresh air", "including", "mask-shaming", "bystander", "march", "clashing", "leg injury", "such as", "deploying", "worrisome to her", "it feels like"]
    translate(wordsToTranslate, 'dataFrames/EnglishToFrenchWords.csv')


