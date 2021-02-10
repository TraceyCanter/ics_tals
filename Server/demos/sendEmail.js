/*
	Node.js SMTP send email test
*/
const nodemailer = require('nodemailer')
const config = require('../config/config.json')
const amqplib = require('amqplib/callback_api')


sendEmail(function (status, rawdata) {

});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(data) {
	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.pgwc.gov.za',
		port: 25,
		disableFileAccess: true,
		disableUrlAccess: true,
		secure: false, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false
		}
	})

	const param = await transporter.sendMail({
		from: 'transport.licensing@westerncape.gov.za',
		to: 'tracey.canter@westerncape.gov.za',
		subject: 'Testing Nodemailer',
		text: 'Testing Nodemailer? ',
		html: '<b>Does LAOS have a mailbox address?</b>'
	})

	// send mail with defined transport object
	const transport = param

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
						return
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
	})
	console.log('Message sent: %s', transport.messageId)
}