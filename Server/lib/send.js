var nodemailer = require('nodemailer')
var config = require('../config/config.json')
var amqplib = require('amqplib/callback_api')

module.exports = {
  async sendEmailAsync(email) {
    return new Promise(async function (resolve, reject) {

      let transporter = nodemailer.createTransport({
        host: 'smtp.pgwc.gov.za',
        port: 25,
        disableFileAccess: true,
        disableUrlAccess: true,
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      })
        
      var mailOptions = {
        from: email.From,
        to: email.To,
        subject: email.Subject,
        text: email.Text,
        html: email.Html,
        attachments:email.Attachments
      }

      // send mail with defined transport object. transporter.sendMail does not return a promise, it uses a callback function.
      let transport = transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return reject("Unable to connect to smtp server. " + error); // or use reject(false) but then you will have to handle errors
        } else {
    
          // Create connection to AMQP server
          amqplib.connect(config.amqp, (err, connection) => {
            if (err) {
              console.error(err.stack)
              return process.exit(1)
            }
            // Create channel
            connection.createChannel((err, channel) => {
              if (err) {
                console.error(err.stack)
                return process.exit(1)
              }
              // Ensure queue for messages
              channel.assertQueue(config.queue, {
                // Ensure that the queue is not deleted when server restarts
                durable: true
              }, err => {
                if (err) {
                  console.error(err.stack)
                  return process.exit(1)
                }
                // Only request 1 unacked message from queue
                // This value indicates how many messages we want to process in parallel
                channel.prefetch(1)
                // Set up callback to handle messages received from the queue
                channel.consume(config.queue, data => {
                  if (data === null) {
                    return reject
                  }
                  // Decode message contents
                  const message = JSON.parse(data.content.toString())
                  // Send the message using the previously set up Nodemailer transport
                  transport.sendMail(message, (err, info) => {
                    if (err) {
                      console.error(err.stack)
                      // put the failed message item back to queue
                      return channel.nack(data)
                    }
                    console.log('Delivered message %s', info.messageId)
                    // remove message item from the queue
                    channel.ack(data)
                  })
                })
              })
            })
            var msg = ('Message sent: %s', info.response);
            return resolve(msg);
          })
        }
      })
    })
  }
}