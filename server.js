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

function error404(res, error) {
	res.writeHead(404);
	res.end('Not found: ' + error);
}

function readAndSendFileOr404(filePath, res) {
	fs.readFile(filePath,
		function (err, data) {
			if (err) {
				error404(res, err);
			}
			else {
				res.end(data);
			}
		}
	);
}

var getURLsToFiles = {
	"/": "./index.html",
	"/index.html": "./index.html",
	"/signin.html": "./signin.html",
	"/css/bootstrap.min.css": "./css/bootstrap.min.css",
	"/css/signin.css": "./css/signin.css",
	"/css/minimized.css": "./css/minimized.css",
}

require("http").createServer(
	function (req, res) {
		console.log(req.method + " request on: " + req.url);

		var cookie = manageAndReturnCookie(req, res, sessions);

		if (req.method == 'POST') {
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
			if (req.url == '/some_resource') {
				res.writeHead(200);
				res.end(sessions[cookie]);
			}
			else if (getURLsToFiles[req.url] != undefined) {
				readAndSendFileOr404(getURLsToFiles[req.url], res);
			}
			else {
				error404(res, req.url);
			}
		}
	}
).listen(1337, '127.0.0.1');
console.log('Our multi-user server running at http://127.0.0.1:1337/');