var fs = require("fs");

require("http").createServer(
	function (req, res) {
		fs.readFile("./index.html", function (err, data) {
			if (err) {
				res.writeHead(404);
				res.end('Not found' + err);
			}

			res.end(data);
		});
	}
).listen(1337, '127.0.0.1');
console.log('Our super server running at http://127.0.0.1:1337/');