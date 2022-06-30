const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const https = require('https')
const request = require('request');
const querystring = require('querystring');
const { v4: uuidv4 } = require('uuid');
const {TranslationServiceClient} = require('@google-cloud/translate');
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config()

const app = express()
const port = 8000

app.use(bodyParser.json());
app.use(cors());

// Microsoft credentials
let key = "15a71e29429546aab3533e645fb85c38";
let endpoint = "https://api.cognitive.microsofttranslator.com";


// Google credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS)
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id
})

app.listen(port, () => {
  console.log(`Server started! Listening on port ${port}`)
});

/* Get usage stats to make sure there are enough Deepl API credits */
app.get("/getDeepLUsageStats", function (req, res) {
  const url = "https://api-free.deepl.com/v2/usage?auth_key=a39ddacd-0d09-96eb-d7a1-e92a670fcd32:fx";
  https.get(url, (response) => {
      if (response.statusCode === 200) {
          response.on("data", (data) => {
              res.json({data: JSON.parse(data)});
            })
      }
      else {
          res.sendStatus(404);
      }
  });
});

/* Translate text using Deepl API */
app.post("/translateDeepl", function (req, res) {
  let textToTranslate = req.body.textToTranslate;
  console.log(textToTranslate);
  const url = 'https://api-free.deepl.com/v2/translate?auth_key=a39ddacd-0d09-96eb-d7a1-e92a670fcd32:fx&'
  
  let form = {
    text: textToTranslate,
    target_lang: req.body.targetLanguage
  };
  
  let formData = querystring.stringify(form);
  let contentLength = formData.length;
  
  request({
    headers: {
      'Host' : 'api-free.deepl.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': contentLength,
      'Accept': '*/*'
    },
    uri: url,
    body: formData,
    method: 'POST'
  }, function (err, resp, body) {
    if(err){ 
      console.log(err)
      res.send(err);
    }
    if(body) {
      let translation = body[0]["translation"]
      res.json(translation);
    } else {
      res.json(err);
    }
  });
});

/* Translate text using Microsoft Translator API */
app.post("/translateMicrosoft", function (req, res) {  
  let options = {
      method: 'POST',
      baseUrl: 'https://api.cognitive.microsofttranslator.com',
      url: 'translate',
      qs: {
        'api-version': '3.0',
        'to': [req.body.targetLanguage]
      },
      headers: {
        'Ocp-Apim-Subscription-Key': '15a71e29429546aab3533e645fb85c38',
        'Ocp-Apim-Subscription-Region': 'westeurope',
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString()
      },
      body: [{
            'text': req.body.textToTranslate
      }],
      json: true,
  };
  
  request(options, function (err, resp, body) {
    if(err){ 
      console.log(err)
      res.send(err);
    }
    if(body) {
      let translation = body[0]["translations"][0]["text"];
      res.json(translation);
    } else {
      res.json(err);
    }
  });
});


/* Translate text using Google Translate API */
app.post("/translateGoogle", function(req, res) {
  translateGoogle(req.body.textToTranslate, req.body.targetLanguage).then((translation) => {
    res.json(translation)
  }).catch((err) => {
    console.log(err);
  })
  
});

// Async function to call google translate
const translateGoogle = async (text, targetLanguage) => {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log(`Google Translate Error --> ${error}`);
    return 0;
  }
}

