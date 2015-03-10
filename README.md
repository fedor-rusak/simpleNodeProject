# Web-applications theory

Application software - computer implementation of dictionary and grammar for language targeting specific human activity.

Web - network of computers providing resources and services using standard-based interfaces.

Web-applications (that are discussed here) - application software that works in web.


# Web-applications reality

There is gigantic amount of technical complexity covered by popular names and concepts.

Now we need three of them:

 * HTML/CSS - basis for UI.
 * Javascript - language for development.
 * NodeJS - server framework.

## HTML/CSS

Abomination. Sorry :) but this is just one of the worst implementations of one of the greatest ideas in software development.

Problem - we need graphical UI. More often than not we need inputs, buttons, tables and their crazy combinations.

Solutions:

 * programming motherf*cker right in the code
 * declarative standardized language

While first solution seems good it really sucks when you have have more than 10 elements on your screen, or you want to reuse it, or you want to collaborate with designer, or port it to other platform. I think you have got my point.

And HTML was created with second solution in mind. When the sexiest technology was ...XML. And even if you use erb, jade, wtf, gtfo or other template-engine in the end of the day it will be translated to HTML.

But in its basic state it looks like... it's [1996](http://ekarj.com/internet96.htm) again! That is patched and fixed by duck-tape called Cascade Style Sheets. Standard for prettifying all this XML-based atrocity. Intentions were all good but when you dig a bit dipper you feel like... you want kill something right away.

I am ready to stop whining and post some code.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Simple web application</title>
		<script>
			//code goes here!!
		</script>
	</head>
	<body>
	    <div>Hello world!</div>
	</body>
</html>
```

[This](http://learnlayout.com/) may be useful.

## Javascript

It is not Java and I kind of like it.

Save this in index.html and open in your browser.

```javascript
<script>
	alert("Hello world!");
</script>
```

You can create structures useful for you current situation.

```javascript
<script>
	var myStructure = {"firstWord": "Hello", "secondWord": "world"};

	alert(myStructure.firstWord + " " + myStructure.secondWord + "!");
</script>
```

I hate that +++ thing. Let's move it!

```javascript
<script>
	var myStructure = {
		"firstWord": "Hello",
		"secondWord": "world",
		"toString": function() {
			return this.firstWord + " " + this.secondWord + "!";
		}
	};

	alert(myStructure.toString());
</script>
```

But I like another approach.

```javascript
<script>
	var concatArray = function(elements) {
		var result = "";

		for (var i = 0; i < elements.length; i++)
			result += elements[i];

		return result;
	}

	alert(concatArray(["Hello", " ", "world", "!"]));
</script>
```

One more trick :) with functions.

```javascript
<script>
	var concatArray = function(elements) {
		var result = "";

		for (var i = 0; i < elements.length; i++)
			result += elements[i];

		return result;
	}

	var concatArrayWithCallback = function(data, callback) {
		callback(concatArray(data));
	}

	concatArrayWithCallback(
		["Hello", " ", "world", "!"],
		function(data) {
			alert(data);
		}
	);
</script>
```

Tastes differ. But composing program from small understandable pieces works for me.

## NodeJS

We are talking about [this](https://nodejs.org/) thing.

You should download binary for your platform and bla-bla-bla. They have really great tutorial on their site. Yet I am gonna copy it here.

Simple app that responds with "Hello World" for every request.

```javascript
require('http').createServer(
	function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello World\n');
	}
).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```

Put the code into a file server.js and call it with node executable from the command line:

```shell
% node server.js
```

If everything is fine you should see:

```shell
Server running at http://127.0.0.1:1337/
```

Improved yet naive version that sends our index.html file on every request.

```javascript
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
```

## Popular names and concepts

### HTTP

To me HyperText means nothing but Transfer Protocol sounds promising.

So if we have two computers, how they gonna understand each other? Thay have a special format for their messages!

For example you want some index.html page:

```
GET http://127.0.0.1:1337/index.html
Host: 127.0.0.1:1337
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:35.0) Gecko/20100101 Firefox/35.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://127.0.0.1:1337/
Connection: keep-alive

This is body section. It must end with newline.

```

There are FOUR sections:

 * first word is method name (GET, POST, PUT, DELETE, etc)
 * then goes address of required resource
 * each line of "name: value" represents header field (section ends with newline)
 * additional content for request

In best case scenario after sending request you will get response.

```
HTTP/1.1 200 OK
Content-Type: text/html

This is body section. It must end with newline.

```

First line represents status of request. There are plenty of other codes. You can find 404 :).