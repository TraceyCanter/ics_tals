/*
	Node.js POP3 client demo retrieve single
	node ./demos/retrieve-single.js --username Enatis.UserAdmin@westerncape.gov.za --password RvB80cnO --filename ./demos/displayAllEmails.js
    node ./demos/retrieve-single.js --username transport.licensing@westerncape.gov.za --password 5Eb81c95f3cA --filename ./demos/singleEmail.txt

	var host = "mail.westerncape.gov.za";
	var port = argv.port || 110;
	*/

var util = require("util");
var fs = require("fs");
var POP3Client = require("./../src/lib/main");
var argv = require('optimist')
   .usage("Usage: $0 --host [host] --port [port] --username [username] --password [password] --tls [on/off] --debug [on/off] --networkdebug [on/off] --msgnumber [number]")
   .demand(['username', 'password'])
	.argv;
				
				

var host = "outlook.office365.com";
var port = 995;
var debug = argv.debug === "on" ? true : false;
var enabletls = argv.tls === "on" ? true : false;
var msgnumber = argv.msgnumber;
var username = argv.username;
var password = argv.password;
var filename = argv.filename;

var fd = fs.openSync(filename, "a+");

var client = new POP3Client(port, host, {
	debug: debug,
	ignoretlserrs: true,
	enabletls: enabletls,
    });

client.on("connect", function(rawdata) {

	console.log("CONNECT success");
	client.login(username, password);

});

client.on("login", function(status, rawdata) {

	if (status) {

		console.log("LOGIN/PASS success");
		client.capa();

	} else {

		console.log("LOGIN/PASS failed");
		client.quit();

	}

});

client.on("capa", function(status, data, rawdata) {

	if (status) {

		console.log("CAPA success");
		if (debug) console.log("Parsed data: " + util.inspect(data));
		client.noop();

	} else {

		console.log("CAPA failed");
		client.quit();

	}

});


client.on("noop", function(status, rawdata) {

	if (status) {

		console.log("NOOP success");
		client.stat();

	} else {

		console.log("NOOP failed");
		client.quit();

	}

});


client.on("stat", function(status, data, rawdata) {

	if (status === true) {

		console.log("STAT success");
		
		client.list();

	} else {

		console.log("STAT failed");
		client.quit();

	}
});

client.on("list", function(status, msgcount, msgnumber, data, rawdata) {

	if (status === false) {

		if (msgnumber !== undefined) console.log("LIST failed for msgnumber " + msgnumber);
		else console.log("LIST failed");

		client.quit();

	} else if (msgcount === 0) {

		console.log("LIST success with 0 elements");
		client.quit();

	} else {
		// console.log("msgnumber" + msgnumber);
		if (msgnumber !== undefined) client.retr(545)
		else console.log("RETR failed");
		
		client.quit();

	}
});

client.on("uidl", function(status, msgnumber, data, rawdata) {

	if (status === true) {

		console.log("UIDL success");
		if (debug) console.log("Parsed data: " + data);
		if (msgnumber !== undefined) {
				client.top(msgnumber, 10);
				if (debug) console.log("UIDL: Parsed data: " + data);
			}

	} else {

		console.log("UIDL failed for msgnumber " + msgnumber);
		client.quit();

	}
});


client.on("top", function(status, msgnumber, data, rawdata) {

	if (status === true) {

		console.log("TOP success for msgnumber " + msgnumber);
		if (debug) console.log("Parsed data: " + data);
		client.retr(msgnumber);

	} else {

		console.log("TOP failed for msgnumber " + msgnumber);
		client.quit();

	}
});

client.on("retr", function(status, msgnumber, data, rawdata) {

	if (status === true) {

		console.log("RETR success for msgnumber " + msgnumber);
		if (debug) console.log("Parsed data: " + data);
		fs.write(fd, new Buffer.from(data + "\r\n\r\n"), 0, data.length + 4, null, function (err, written, buffer) {

		 	if (err) client.rset();
		 	else client.dele(msgnumber);

		});

        if (msgnumber !== undefined) client.dele(msgnumber);
        else client.quit();

	} else {

		console.log("RETR failed for msgnumber " + msgnumber);
		client.quit();

	}
});

client.on("dele", function(status, msgnumber, data, rawdata) {

	if (status === true) {

		console.log("DELE success for msgnumber " + msgnumber);
		client.rset();

	} else {

		console.log("DELE failed for msgnumber " + msgnumber);
		client.quit();

	}
});

client.on("rset", function(status, rawdata) {

	if (status === true) console.log("RSET success");
	else console.log("RSET failed");

	client.quit();

});

client.on("quit", function(status, rawdata) {

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

console.log("Single Email fetched")



