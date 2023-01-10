var fs = require('fs-extra')
emlformat = require('eml-format')
util = require("util");

module.exports = {

  fetchEmails(file, emailsjson, headersOnly, messageId) {
    return new Promise((resolve, reject) => {
      var POP3Client = require("./main");
      var argv = require('optimist')
        .usage("Usage: $0 --host [host] --port [port] --username [username] --password [password] --filename [filename] --debug [on/off] --networkdebug [on/off] --tls [on/off] --msgnumber[msgnumber] ")
        .argv;
      var host = "outlook.office365.com";
      var port = 995;
      var debug = true;
      var enabletls = true;
      var username = argv.username || 'transport.licensing@westerncape.gov.za';
      var password = argv.password || '5Eb81c95f3cA';
      var filename = argv.filename || file;
      var totalmsgcount = 0;
      var currentmsg = 0;
      var download = true;
      var msgnumber = argv.msgnumber || messageId;
      var login = argv.login === true;

      let jsonObject = {
        data: []
      };

      var fd = fs.openSync(filename, "a+");

      var client = new POP3Client(port, host, {
        debug: false,
        ignoretlserrs: true,
        enabletls: enabletls
      });

      client.on("connect", function (status, rawdata) {
        if (status) {
          console.log("CONNECT success");
          client.login(username, password);
        } else {
          console.log("CONNECT failed because " + rawdata);
        }
      });

      client.on("invalid-state", function (cmd) {
        console.log("Invalid state. You tried calling " + cmd);
      });

      // The `locked` event is emitted when you try to execute another command while the current command has not finished executing successfully (eg, attempting to `RETR`-ieve a message while the remote server has not finished sending `LIST` data).
      client.on("locked", function (cmd) {
        console.log("Current command has not finished yet. You tried calling " + cmd);
      });

      client.on("close", function () {
        console.log("Close event unexpectedly received, failed");
      });

      // The `error` event is emitted when there is a network error. The underlying error object is passed back to user-code.
      client.on("error", function (err) {
        if (err.errno === 111)
          console.log("Unable to connect to server");
        else
          console.log("Server error occurred, failed.. " + err);
             
        reject(err);
      });

      // Login to the POP3 server with the given username and password. 
      client.on("login", function (status, data) {
        if (status) {
          console.log("LOGIN/PASS success");
          client.capa();
        } else {
          console.log("LOGIN/PASS failed");
          client.quit();
        }
      });

      // The POP3 CAPA command returns a list of capabilities supported by the POP3 server. 
      client.on("capa", function (status, data, rawdata) {
        if (status) {
          if (debug)
            console.log("CAPA success"); + util.inspect(data);
          client.noop();
        } else {
          console.log("CAPA failed");
          client.quit();
        }
      });

      // Send a NOOP command to the POP3 server - Keep alive
      client.on("noop", function (status, rawdata) {
        if (status) {
         //  console.log("NOOP success");
          client.stat();
        } else {
          console.log("NOOP failed");
          client.quit();
        }
      });

      client.on("stat", function (status, data, rawdata) {
        if (status === true) {

          //console.log("STAT success");

          if (debug) console.log("STAT: Parsed data: " + util.inspect(data));

          if (msgnumber !== undefined) client.list(msgnumber)

          else

            client.list();

        } else {

          console.log("STAT failed");
          client.quit();

        }
      });


      // List all available messages in the mailbox
      client.on("list", function (status, msgcount, msgnumber, data, rawdata) {

        if (status === false) {

          if (msgnumber !== undefined) console.log("LIST failed for msgnumber " + msgnumber);

          else console.log("LIST failed");

          client.quit();

        } else if (msgcount === 0) {

          console.log("LIST success with 0 elements");
          client.quit();

        } else {

          console.log("LIST success with " + msgcount + " element(s)");

          //if (debug) console.log("Parsed data: " + util.inspect(data));

          if (messageId !== undefined) {

            msgcount = 1;
            totalmsgcount = msgcount;
            currentmsg = messageId;
            client.uidl(msgnumber);

          } else {

            totalmsgcount = msgcount;
            var topFifteen = totalmsgcount - 8;
            currentmsg = topFifteen;
            console.log("LIST success with " + msgcount + " message(s)");
            client.retr(currentmsg);
          }

        }

      });


      // Retrieve a list of UIDLs from a POP3 server.
      client.on("uidl", function (status, msgnumber, data, rawdata) {

        if (status === true) {

          // console.log("UIDL success for msgnumber " + msgnumber);
          //  if (debug) console.log("data: " + util.inspect(data));
          client.top(msgnumber, 10);

        } else {

          console.log("UIDL failed for msgnumber " + msgnumber);
          client.quit();

        }
      });

      // Retrieve only the specified top number of lines of a message from the POP3 server.
      client.on("top", function (status, msgnumber, data, rawdata) {

        if (status === true) {

          // console.log("TOP success for msgnumber " + msgnumber);

          // if (debug) console.log("top Parsed data: " + data);

          client.retr(msgnumber);

        } else {

          console.log("TOP failed for msgnumber " + msgnumber);
          client.quit();

        }
      });


      client.on("retr", function (status, msgnumber, data, rawdata) {

        if (status === true) {

          console.log("RETR success for msgnumber " + msgnumber);

          currentmsg += 1;

          if (!headersOnly) {
            emlformat.read(data, {
              headersOnly: headersOnly
            }, (err, data) => {

              if (err) return console.log(err)

              if (data) {
                var data = getEmails(data, msgnumber);
                jsonObject.data.push({
                  data
                });
              }
            })

          } else {
            emlformat.parse(data, {
              headersOnly: headersOnly
            }, (err, data) => {

              if (err) return console.log(err)

              if (data) {

                var data = getEmails(data, msgnumber);

                jsonObject.data.push({
                  data
                });
              }
            })
          }

          fs.writeFileSync(emailsjson, JSON.stringify(jsonObject, " ", 2), err => {
            if (err) client.rset();
          });

          if (currentmsg > totalmsgcount)
            client.rset();
          else
            client.retr(currentmsg);

        } else {

          console.log("RETR failed for msgnumber " + msgnumber + " because " + rawdata);
          client.rset();

        }
      });

      // DELE deleted a specified message
      client.on("dele", function (status, msgnumber, data, rawdata) {

        if (status === true) {

          console.log("DELE success for msgnumber " + msgnumber);

          if (currentmsg > totalmsgcount)
            client.rset();
          else
            client.retr(currentmsg);

        } else {

          console.log("DELE failed for msgnumber " + msgnumber);
          client.rset();

        }
      });

      // RSET reset the session to its initial state using the RSET command. This will undelete all messages deleted using DELE
      client.on("rset", function (status, rawdata) {

        if (status === true)

          console.log("RSET success");

        else

          console.log("RSET failed");

        client.quit();
      });

      // QUIT to end the POP3 conversation
      client.on("quit", function (status, rawdata) {

        client.removeAllListeners("close");

        if (status === true) {

          console.log("QUIT success + raw data: " + rawdata);
          resolve(status);

        } else

          console.log("QUIT failed");

      });
    })
  },

}

function getEmails(data, msgnumber) {
  var contentType = ''
  if (data.headers.Subject)
    var subject = data.headers.Subject;
  else
    var subject = null;

  if (data.headers.From)
    var from = data.headers.From;
  else
    var from = null;

  if (data.headers.To)
    var to = data.headers.To;
  else
    var to = null;

    if (data.headers.Cc)
    var cc = data.headers.Cc;
  else
    var cc = null;

  if (data.headers.Date) {
    var date = (new Date(data.headers.Date)).toUTCString()
    if (date === "Invalid Date") {
      date = data.headers.Date.slice(0, 31)
    }
  } else {
    var date = new Date();
  }

  if (data.text) {
    contentType = 'text/plain; charset=utf-8';
    var text = data.text;
  } else
    var text = null;

  if (data.html) {
    contentType = 'text/html; charset=utf-8';
    var html = data.html;
  } else
    var html = null;

  if (data.attachments) {
    encoded = data.attachments
    encoded = getBase64(data.attachments)
    data.attachments = encoded
    var attachments = data.attachments;
  } else
    var attachments = null;

  return {
    Subject: subject,
    From: from,
    To: to,
    Cc: cc,
    Date: date,
    Id: msgnumber,
    Text: text,
    Html: html,
    ContentType: contentType,
    Attachments: attachments
  };
}

function getBase64(data) {
  var attachments = []
  for (var i = 0; i < data.length; i++) {   
    const fileName = getFileName(data[i].contentType)
    const mimeType = fileName.split('.').pop()
    const contentType = data[i].contentType.replace(/octet-stream/g, mimeType);   
    if (typeof data[i].data === "string") {
      var content = Buffer.from(data[i].data).toString("base64");
    }
    else { //Buffer
      var content = data[i].data.toString("base64");   
    }
    attachments.push({
      encoding: 'base64', 
      filename: fileName,
      cid: data[i].id,
      type: mimeType,
      contentType: contentType,
      path: data[i].path,
      content: content
    })
  }
  return attachments
}

function getFileName(contentType) {
  let fileName = 'file'
  if (contentType) {
    const fileNameRegex = /name[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = fileNameRegex.exec(contentType)
    if (matches != null && matches[1]) {
      fileName = matches[1].replace(/['"]/g, '')
    }
  }
  return fileName
}


