var fs = require("fs");

require("http").createServer(
	function (req, res) {
		if (req.method == 'POST') {
			console.log("POST request on: " + req.url);
			res.writeHead(200);
			res.end("Ok");
		}
		else if (req.method == 'GET') {
			console.log("GET request on: " + req.url);

			fs.readFile("./index.html", function (err, data) {
				if (err) {
					res.writeHead(404);
					res.end('Not found' + err);
				}

				res.end(data);
			});
		}
	}
).listen(1337, '127.0.0.1');
console.log('Our smart server running at http://127.0.0.1:1337/');