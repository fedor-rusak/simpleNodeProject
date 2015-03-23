"use strict";

// require module system
module.exports = cleanCss;


// helpers

var arraySlice = Function.prototype.call.bind(Array.prototype.slice);

var applyWithBind = Function.prototype.apply.bind(Function.prototype.bind);

function pushTo(array) {
	if (this instanceof Array) {
		array.push.apply(array, this);
	}
	else
		array.push(this);
}

Promise.prototype.pushTo = pushTo;
Array.prototype.pushTo = pushTo;

function BN (callback) {
	if (this != undefined)
		return Function.prototype.bind.apply(this, [null].concat(arraySlice(arguments)));
	else
		return Function.prototype.bind.apply(callback, [null].concat(arraySlice(arguments,1)));
}

Function.prototype.BN = BN;


Promise.prototype.thenBN = function(callback) {
	var bindedCallback = BN.apply(callback, arraySlice(arguments, 1, arguments.length));
	return this.then(bindedCallback);
}

function mapv(callback, array) {
	var result = [];

	for (var i = 0; i < array.length; i++) {
		result.push(callback(array[i]));
	}

	return result;
}

function P(callback) {
	return new Promise(function(resolve, reject) {callback(resolve);});
}

function B(callback) {
	return applyWithBind(callback, arraySlice(arguments));
}

function BP(callback) {
	return P(B.apply(null, arraySlice(arguments)));
}

function thenBPmap(callback, array) {
	var array = array || this;
	var result = [];

	// return mapv(function(arg) {});
	for (var i = 0; i < array.length; i++) {
		result.push(array[i].then(callback));
	}

	result.thenBPmap = thenBPmap;
	result.thenBPmapvN = thenBPmapvN;

	return result;
}

function thenBPmapvN(callback, array) {
	return thenBPmap(mapv.BN(callback), array || this);
}

function BPmap(callback, array) {
	var result = mapv(BP.bind(null, callback), array || this);

	result.thenBPmap = thenBPmap;

	return result;
}

function BPmapAll(callback, array) {
	return Promise.all(BPmap(callback, array));
}

function start(callback) {
	return callback.apply(null, arraySlice(arguments, 1, arguments.length));
}

function whenAll(array) {
	return Promise.all(array);
}

function getOwnedProperties(object) {
	var result = [];

	for (var key in object) {
		if (object.hasOwnProperty)
			result.push(key);
	}

	return result;
}

// includes

var fsReadFile = require('fs').readFile;
var fsWriteFile = require('fs').writeFile;

// logic

function readFile(filePath, onSuccess) {
	fsReadFile(filePath, function(err, data) {onSuccess(data.toString());});
}

function writeFile(filePath, content) {
	fsWriteFile(filePath, content, function(err) {console.log(err || "File save at: " + filePath)});
}

function jsonParse(stringValue) {
	return JSON.parse(stringValue);
}

function getJSONElement(elementName, json) {
	return json[elementName];
}

function getArraylement(index, array) {
	return array[index];
}

function splitByLineDelimiter(stringValue) {
	return stringValue.split("\n");
}

function divideCssLine(stringValue) {
	var result = stringValue.split(" {");
	result[1] = "{"+result[1];
	return result;
}

function makeCssArray(stringvalue) {
	return mapv(divideCssLine, splitByLineDelimiter(stringvalue));
}

function addSelectorIndex(previousValue, currentValue, index, array) {
	var selectorIndex = currentValue.line;
	var selectorValue = currentValue.selector;

	if (previousValue[selectorIndex] != undefined)
		previousValue[selectorIndex].push(selectorValue)
	else
		previousValue[selectorIndex] = [selectorValue];

	return previousValue;
}

/*
 *  Expected format of "selectors": [{"selector": "css classes", "line": number}, ..]
 */
function compressSelectors(selectorsAndlines) {
	var indexMap = selectorsAndlines.reduce(addSelectorIndex, {});

	function transformCompressedCss(value) {
		return {"line": parseInt(value), "selectors": indexMap[value].join(", ")}
	};

	return getOwnedProperties(indexMap).map(transformCompressedCss);
}

function produceFinalSelectors(inputArray) {
	var dustMeInput = inputArray[0];
	var cssDataArrays = arraySlice(inputArray, 1);

	function produceFinalCssLine(cssDataArray, lineCss) {
		return lineCss.selectors + " " + cssDataArray[lineCss.line][1];
	}

	function produceFinalCssArray(currentValue, index, array) {
		return mapv(BN(produceFinalCssLine, cssDataArrays[index]), currentValue);
	}

	var result = dustMeInput.map(produceFinalCssArray);

	return result.reduce(function(prev, current) {return prev.concat(current);}, []);
}

function produceFinalSelectors(inputArray) {
	var dustMeInput = inputArray[0];
	var cssDataArrays = arraySlice(inputArray, 1);

	function produceFinalCssLine(cssDataArray, lineCss) {
		//Dust-me counts line from 1, while JS starts arrays from 0
		var indexOfCssFileLineInArray = lineCss.line - 1;
		return lineCss.selectors + " " + cssDataArray[indexOfCssFileLineInArray][1];
	}

	function produceFinalCssArray(currentValue, index, array) {
		return mapv(BN(produceFinalCssLine, cssDataArrays[index]), currentValue);
	}

	var result = dustMeInput.map(produceFinalCssArray);

	return result.reduce(function(prev, current) {return prev.concat(current);}, []);
}

function join(separator, array) {
	return array.join(separator);
}

// main

function cleanCss(jsonPathInput, cssPathArray, outputPath) {
	var	temproraryPromises = [];

	start(BP, readFile, jsonPathInput)
		.then(jsonParse)
		.thenBN(getJSONElement, "used")
		.thenBN(mapv, BN(getJSONElement, "selectors"))
		.thenBN(mapv, compressSelectors)
		.pushTo(temproraryPromises);

	start(BPmap, readFile, cssPathArray)
		.thenBPmap(splitByLineDelimiter)
		.thenBPmapvN(divideCssLine)
		.pushTo(temproraryPromises);

	whenAll(temproraryPromises)
		.then(produceFinalSelectors)
		.thenBN(join, "\n")
		.thenBN(writeFile, outputPath);
}