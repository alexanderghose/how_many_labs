var express = require('express');
var router = express.Router();
let { GoogleSpreadsheet } = require('google-spreadsheet');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/37", async function(req, res){
  
  // Identifying which document we'll be accessing/reading from
  // if (!process.env.SEI_36_DELIVERABLES_SHEET) {
  //   return res.send("error")
  // }
  try {
    var doc = new GoogleSpreadsheet(process.env.SEI_37_DELIVERABLES_SHEET);
    creds = {
      type: process.env.CREDS_type,
      project_id: process.env.CREDS_project_id,
      private_key_id: process.env.CREDS_private_key_id,
      private_key: process.env.CREDS_private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
      client_email:process.env.CREDS_client_email,
      client_id:process.env.CREDS_client_id,
      auth_uri:process.env.CREDS_auth_uri,
      token_uri:process.env.CREDS_token_uri,
      auth_provider_x509_cert_url: process.env.CREDS_auth_provider_x509_cert_url,
      client_x509_cert_url:process.env.CREDS_client_x509_cert_url,
    }
    await doc.useServiceAccountAuth(creds) // Authentication
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[7]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    let first_valid_row = 4;
    let last_valid_row = 14;
    let labs = [];
    await sheet.loadCells(`A${first_valid_row}:E21`);
    // getCell is zero-indexed. so for row A1 it's getCell(0,0).
    for (let row = first_valid_row-1; row <= last_valid_row-1; row++) {
      obj = {
        codename:sheet.getCell(row,3).value,
        completedLabs:sheet.getCell(row,4).value,
      };
      labs.push(obj);
    }
    let lastUpdated = sheet.getCell(19,4).value
    let lastUpdatedBy = sheet.getCell(20,4).value
    res.render('labs.ejs', {labs, lastUpdated, lastUpdatedBy});

  } catch(error) {
    console.log(error)
    res.status(500).send({error:"there was an error"})
  }
});

router.get("/36", async function(req, res){
  
  // Identifying which document we'll be accessing/reading from
  // if (!process.env.SEI_36_DELIVERABLES_SHEET) {
  //   return res.send("error")
  // }
  try {
    var doc = new GoogleSpreadsheet(process.env.SEI_36_DELIVERABLES_SHEET);
    creds = {
      type: process.env.CREDS_type,
      project_id: process.env.CREDS_project_id,
      private_key_id: process.env.CREDS_private_key_id,
      private_key: process.env.CREDS_private_key.replace(new RegExp("\\\\n", "\g"), "\n"),
      client_email:process.env.CREDS_client_email,
      client_id:process.env.CREDS_client_id,
      auth_uri:process.env.CREDS_auth_uri,
      token_uri:process.env.CREDS_token_uri,
      auth_provider_x509_cert_url: process.env.CREDS_auth_provider_x509_cert_url,
      client_x509_cert_url:process.env.CREDS_client_x509_cert_url,
    }
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
    console.log(error)
    res.status(500).send({error:"there was an error"})
  }
});

module.exports = router;
