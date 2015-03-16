var fs = require("fs");

var sessions = {};

function generateCookie() {
	return "cookie_" + Math.random();
}

function createAndReturnCookie(cookieJar) {
	var cookie = generateCookie();

	while (true) {
		if (cookieJar[cookie] == undefined) {
			cookieJar[cookie] = {};
			break;
		}
		else {
			cookie = generateCookie();
		}
	}

	return cookie;
}

function manageAndReturnCookie(req, res, cookieJar) {
	var cookie = req.headers["cookie"];

	if (cookie == undefined) {
		cookie = createAndReturnCookie(cookieJar);

		res.setHeader("Set-Cookie", cookie);
	}

	return cookie;
}

function readAndSendFileOr404(filePath, res) {
	fs.readFile(filePath,
		function (err, data) {
			if (err) {
				res.writeHead(404);
				res.end('Not found' + err);
			}

			res.end(data);
		}
	);
}

require("http").createServer(
	function (req, res) {
		var cookie = manageAndReturnCookie(req, res, sessions);

		if (req.method == 'POST') {
			console.log("POST request on: " + req.url);

			var body = '';
			req.on('data', function (data) {
				body += data;
			});

			req.on('end', function () {
				sessions[cookie] = body;
				res.writeHead(200);
				res.end("data: " + sessions[cookie]);
			});
		}
		else if (req.method == 'GET') {
			console.log("GET request on: " + req.url);

			if (req.url == '/some_resource') {
				res.writeHead(200);
				res.end(sessions[cookie]);
			}
			else if (req.url == '/signin.html') {
				readAndSendFileOr404("."+req.url, res);
			}
			else {
				readAndSendFileOr404("./index.html", res);
			}
		}
	}
).listen(1337, '127.0.0.1');
console.log('Our multi-user server running at http://127.0.0.1:1337/');