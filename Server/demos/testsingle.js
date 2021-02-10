'use strict'
// node testsingle.js --msgnumber 1


var fse = require('fs-extra')
var path = require('path')
var fetch = require("./lib/fetch");

async function main() {
  let baseDir = __dirname + '\\services\\output'
  var file = path.join(baseDir, 'emails.eml')
  var singlejson = path.join(baseDir, 'emails.json')
  if (singlejson) {
    fse.removeSync(singlejson)
  }

  const id = 302; 

  fetch.fetchEmailsAsync(file, singlejson, false, id)
    .then(function (status, err) {
      if (err) return console.log(err)
      if (status) {
        console.log("emails.json: " + singlejson)
        }
      })
    .catch(error => {
      console.log('Catching server Service ' + error)
    })
}

main().catch(console.error)

