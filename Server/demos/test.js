'use strict'
// node test.js --username Enatis.UserAdmin@westerncape.gov.za --password RvB80cnO --filename emails.json


var fse = require('fs-extra')
var path = require('path')
var fetch = require("../lib/fetch");

async function main() {
  let baseDir = __dirname + '\\services\\output'
  var file = path.join(baseDir, 'emails.eml')
  var emailsjson = path.join(baseDir, 'emails.json')
  if (emailsjson) {
    fse.removeSync(emailsjson)
  }

  fetch.fetchEmailsAsync(file, emailsjson)
    .then(function (status, err) {
      if (err) return console.log(status)
      if (status) {
        console.log("emails.json: " + emailsjson)
        }
      })
    .catch(error => {
      console.log('Catching server Service ' + error)
    })
}

main().catch(console.error)

