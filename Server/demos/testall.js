'use strict'
// node testall.js 


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

  fetch.fetchEmailsAsync(file, emailsjson, true)
    .then(function (status, err) {
      if (err) return console.log(err)
      if (status) {
        console.log("emails.json: " + emailsjson)
        }
      })
    .catch(error => {
      console.log('Catching server Service ' + error)
    })
}

main().catch(console.error)

