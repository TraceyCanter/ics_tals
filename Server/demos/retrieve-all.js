/*
	Node.js POP3 client demo in retrieving all POP3 messages into mbox file
	node ./demos/retrieve-all.js --username Enatis.UserAdmin@westerncape.gov.za --password RvB80cnO --filename ./demos/allEmails.txt
	node ./demos/retrieve-all.js --username transport.licensing@westerncape.gov.za --password 5Eb81c95f3cA --tls on --filename ./demos/allEmails.txt
	# no longer used var host = "mail.westerncape.gov.za"; var port = 110;
	var host = "outlook.office365.com";
	var port = 995	
	var debug = true;
	var enabletls = false;
*/

var util = require("util");
var fs = require("fs");
var POP3Client = require("./../src/lib/main");
var argv = require('optimist')
	.usage("Usage: $0 --host [host] --port [port] --username [username] --password [password] --filename [filename] --debug [on/off] --networkdebug [on/off] --tls [on/off] --msgnumber[msgnumber] ")
	.demand(['username', 'password', 'filename'])
	.argv;

var host = "outlook.office365.com";
var port = 995;
var debug = true;
var enabletls = argv.tls === "on" ? true : false;
var username = argv.username;
var password = argv.password;
var filename = argv.filename;
var totalmsgcount = 0;
var currentmsg = argv.msgnumber || 0;
var download = true;
var msgnumber = argv.msgnumber || 0;
var login = argv.login === true;

var fd = fs.openSync(filename, "a+");

var client = new POP3Client(port, host, {
	debug: debug,
	ignoretlserrs: false,
	enabletls: enabletls,
	
});

client.on("connect", function (status, rawdata) {
	if (status) {
		console.log("CONNECT success");
		client.login(username, password);
	} else {
		console.log("CONNECT failed because " + rawdata);
		return;
	}
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

		console.log("CAPA success");
		if (debug) console.log("Parsed data: " + util.inspect(data));
		client.noop();

	} else {

		console.log("CAPA failed");
		client.quit();

	}

});

// Send a NOOP command to the POP3 server - Keep alive
client.on("noop", function (status, rawdata) {

	if (status) {

		console.log("NOOP success");
		client.stat();

	} else {

		console.log("NOOP failed");
		client.quit();

	}

});


// List all available messages in the mailbox
client.on("stat", function (status, data, rawdata) {

	if (status === true) {

		console.log("STAT success");
		if (debug) console.log("STAT: Parsed data: " + util.inspect(data));
		client.list();
	} else {
		console.log("STAT failed");
		client.quit();

	}
});

// List all available messages in the mailbox

client.on("list", function (status, msgcount, msgnumber, data, rawdata) {

	// Returns null if the list attempt fails (e.g., if the specified message number does not exist).
	if (status === false) {

		if (msgnumber !== undefined) console.log("LIST failed for msgnumber " + msgnumber);
		else console.log("LIST failed");

		client.quit();


	} else if (msgcount > 0) {

		if (msgnumber !== undefined) {
			console.log("LIST success for message " + msgnumber);
			client.retr(msgnumber);
			// retrieve only the top 10 lines of the specified message
			// client.top(msgnumber, 10);
		} else {
			console.log("LIST success with " + msgcount + " message(s)");
			totalmsgcount = msgcount;
			currentmsg = 1;
			console.log("LIST success with " + msgcount + " message(s)");
			client.retr(1);


		}
	} else {
		console.log("LIST success with 0 message(s)");
		client.quit();

	}
});

// Retrieve only the specified top number of lines of a message from the POP3 server. 
client.on("top", function (status, msgnumber, data, rawdata) {

	if (status === true) {

		console.log("TOP success for msgnumber " + msgnumber);
		if (debug) console.log("Parsed data: " + data);
		client.retr(msgnumber);

	} else {

		console.log("TOP failed for msgnumber " + msgnumber);
		client.quit();

	}
});

// RETR retrieves a specified message. You need to specify a message number from the LIST command.
client.on("retr", function (status, msgnumber, data, rawdata) {

	if (status === true) {

		console.log("RETR success for msgnumber " + msgnumber);

		if (debug) console.log("Parsed data: " + data);

		currentmsg += 1;

		// fs.write(fd, new Buffer(data + "\r\n\r\n"), 0, data.length + 4, null, function (err, written, buffer) {
		// 	if (err) client.rset();

		if (currentmsg > totalmsgcount)

			client.rset();

		else
		
			client.retr(currentmsg);

	} else {

		console.log("RETR failed for msgnumber " + msgnumber + " because " + rawdata);

		client.quit();

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

	if (status === true) console.log("QUIT success");
	else console.log("QUIT failed");

});

client.on("invalid-state", function (cmd) {
	console.log("Invalid state. You tried calling " + cmd);
});

// The `locked` event is emitted when you try to execute another command while the current command has not finished executing successfully (eg, attempting to `RETR`-ieve a message while the remote server has not finished sending `LIST` data).
client.on("locked", function (cmd) {
	console.log("Current command has not finished yet. You tried calling " + cmd);
});

client.on("close", function () {
	console.log("close event unexpectedly received, failed");
});

// The `error` event is emitted when there is a network error. The underlying error object is passed back to user-code.
client.on("error", function (err) {
	if (err.errno === 111) console.log("Unable to connect to server");
	else console.log("Server error occurred, failed" + err);

});
// Retrieve a list of UIDLs from a POP3 server.
client.on("uidl", function (status, msgcount, msgnumber, data, rawdata) {

	if (status === false) {

		if (msgnumber !== undefined)

			console.log("UIDL LIST failed for msgnumber " + msgnumber);

		else

			console.log("UIDL LIST failed");

		client.quit();

	} else if (msgcount > 0) {

		if (status === true) {

			console.log("UIDL success");

			if (msgnumber !== undefined) {

				client.top(msgnumber, 10);

				if (debug)

					console.log("UIDL: Parsed data: " + data);
			}
		}
	} else {

		console.log("UIDL LIST success with 0 message(s)");

		client.quit();
	}
});



console.log("Emails fetched")