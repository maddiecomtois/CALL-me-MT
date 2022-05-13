const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const https = require('https')
const request = require('request');

const app = express()
const port = 8000

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server started! Listening on port ${port}`)
});


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


app.post("/translate", function (req, res) {
  let textToTranslate = req.body.textToTranslate;
  console.log(textToTranslate);
  const url = `https://api-free.deepl.com/v2/translate?auth_key=a39ddacd-0d09-96eb-d7a1-e92a670fcd32:fx&text=${textToTranslate}&target_lang=FR`;
  
  request({
    headers: {
      'Host' : 'api-free.deepl.com',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    uri: url,
    method: 'POST'
  }, function (err, resp, body) {
    if(err) 
      res.send(err);
    if(body) {
      res.json(JSON.parse(body));
    } else {
      res.json(err);
    }
  });
  
    
});

