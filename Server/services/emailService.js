'use strict';

var fetch = require("../lib/fetch");
var send = require("../lib/send");
var path = require('path');
var fse = require('fs-extra');
var JSONError = require('./JSONError');
var baseDir = __dirname + '\\output';

module.exports = {

  fetchAll(req, res, next) {
    const file = path.join(baseDir, 'emails.eml')
    const emailsjson = path.join(baseDir, 'emails.json')
    if (emailsjson) {
      fse.removeSync(emailsjson)
    }
    fetch.fetchEmails(file, emailsjson, true)
      .then(result => {
        return res.sendFile(emailsjson)
      })
      .catch(err => {
        return next(err)
      }, 10)
      
  },

  fetchById(req, res, next) {
    const file = path.join(baseDir, 'emails.eml')
    const singleEmail = path.join(baseDir, 'singleEmail.json')
    if (singleEmail) {
      fse.removeSync(singleEmail)
    }
    const id = req.params.id;
    fetch.fetchEmails(file, singleEmail, false, id)
      .then(result => {
        console.log('Email successfully fetched. ')
        res.sendFile(singleEmail)

      })
      .catch(error => {
        console.log("Catching  " + error)
        var err = JSONError(408, 'Request Timeout');
        next(err)
      })
  },

  async sendEmail(req, res, next) {
    send.sendEmailAsync(req.body)
    .then(result => {
      console.log('Email successfully sent... ' + result)
      res.send('OK')
    })
    .catch(err => {
      console.log("Send Email Catching  " + err)
      return next(err)
    },100)
  },

  _handleResponse(err, data, res) {
    if (err) {
      res.status(400).end()
    } else {
      res.send(data)
    }
  }
}