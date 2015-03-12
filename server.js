var fs = require("fs");

var state = "initial_data";

require("http").createServer(
	function (req, res) {
		if (req.method == 'POST') {
			console.log("POST request on: " + req.url);

			var body = '';
			req.on('data', function (data) {
				body += data;
			});

			req.on('end', function () {
				state = body;
				res.writeHead(200);
				res.end("data: " + state);
			});
		}
		else if (req.method == 'GET') {
			console.log("GET request on: " + req.url);

			if (req.url == '/some_resource') {
				res.writeHead(200);
				res.end(state);
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
console.log('Our data saving server running at http://127.0.0.1:1337/');