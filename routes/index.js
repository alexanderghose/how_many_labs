var express = require('express');
var router = express.Router();
let { GoogleSpreadsheet } = require('google-spreadsheet');
let creds = require('../client_secret.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/36", async function(req, res){
  
  // Identifying which document we'll be accessing/reading from
  // if (!process.env.SEI_36_DELIVERABLES_SHEET) {
  //   return res.send("error")
  // }
  try {
    var doc = new GoogleSpreadsheet(process.env.SEI_36_DELIVERABLES_SHEET);  
    await doc.useServiceAccountAuth(creds) // Authentication
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[7]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    let first_valid_row = 4;
    let last_valid_row = 14;
    let labs = [];
    await sheet.loadCells(`A${first_valid_row}:D${last_valid_row}`);
    // getCell is zero-indexed. so for row A1 it's getCell(0,0).
    for (let row = first_valid_row-1; row <= last_valid_row-1; row++) {
      obj = {
        codename:sheet.getCell(row,2).value,
        completedLabs:sheet.getCell(row,3).value,
      };
      labs.push(obj);
    }
    res.render('labs.ejs', {labs});

  } catch(error) {
    res.status(500).send({error: error})
  }
});

module.exports = router;
