var fs = require("fs");

require("http").createServer(
	function (req, res) {
		if (req.method == 'POST') {
			console.log("POST request on: " + req.url);

			var body = '';
			req.on('data', function (data) {
				body += data;
			});

			req.on('end', function () {
				res.writeHead(200);
				res.end("data: " + body);
			});
		}
		else if (req.method == 'GET') {
			console.log("GET request on: " + req.url);

			if (req.url == '/some_resource') {
				res.writeHead(200);
				res.end("some new stuff");
			}
			else {
				fs.readFile("./index.html", function (err, data) {
					if (err) {
						res.writeHead(404);
						res.end('Not found' + err);
					}

					res.end(data);
				});
			}
		}
	}
).listen(1337, '127.0.0.1');
console.log('Our sophisticated server running at http://127.0.0.1:1337/');