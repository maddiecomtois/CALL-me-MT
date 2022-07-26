const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const https = require('https')
const request = require('request');
const querystring = require('querystring');
const { v4: uuidv4 } = require('uuid');
const {TranslationServiceClient} = require('@google-cloud/translate');
const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config()

const app = express()

// for live serving
//const port = process.env.PORT || 8080;

// for local serving
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

// For live serving 
/*
app.use(express.static('public'));
  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})
*/

// API credentials
const MICROSOFT_CREDENTIALS = JSON.parse(process.env.MICROSOFT_CREDENTIALS)
const DEEPL_CREDENTIALS = JSON.parse(process.env.DEEPL_CREDENTIALS)
const GOOGLE_CREDENTIALS = JSON.parse(process.env.CREDENTIALS)

const translate = new Translate({
  credentials: GOOGLE_CREDENTIALS,
  projectId: GOOGLE_CREDENTIALS.project_id
})


app.listen(port, () => {
  console.log(`Server started! Listening on port ${port}`)
});

/* Get Deepl usage stats to make sure there are enough API credits */
app.get("/getDeepLUsageStats", function (req, res) {
  const url = "https://api-free.deepl.com/v2/usage?auth_key=" + DEEPL_CREDENTIALS.key;
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
  const url = 'https://api-free.deepl.com/v2/translate?auth_key=' + DEEPL_CREDENTIALS.key;
  
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
      let parsedBody = JSON.parse(body)
      if(parsedBody["translations"]) {
        let translation = parsedBody["translations"][0]["text"]
        res.json(translation);
      }
      else {
        res.json({"err":"No translations"});
      }
      
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
        'Ocp-Apim-Subscription-Key': MICROSOFT_CREDENTIALS.key,
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
    console.log(`Google Translate Error: ${error}`);
    return 0;
  }
}

