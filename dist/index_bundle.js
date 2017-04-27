/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tensorTools__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AgentObservation__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__generateInitialState__ = __webpack_require__(34);



// import {getVisibleTiles} from './getVisibleTiles'

const config = {
    size: [31, 31],

    //TINY VIEWPORT
    // viewPortSize: [5, 5],
    // viewPortOffset: [0, 1],

    //SMALL VIEWPORT
    // viewPortSize: [7, 7],
    // viewPortOffset: [0, 1],

    //NORMAL VIEWPORT
    viewPortSize: [9, 9],
    viewPortOffset: [0, 2],

    verticalDeltaScore: 10,
    minTileValue: -20,
    tileValueMap: [-1, -20],
    // pointsForCompletion: 100
};
/* harmony export (immutable) */ __webpack_exports__["a"] = config;


/**
 * The main environment class for this game. This is the public interface for the game.
 */
class Environment {
    constructor() {
        this._state = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__generateInitialState__["a" /* generateInitialState */])();

        //Bind these to create proper JavaScript "this" context
        this.applyAction = this.applyAction.bind(this);
        this.getAgentObservation = this.getAgentObservation.bind(this);
        this.getGodObservation = this.getGodObservation.bind(this);
    }

    /**
     * Mutates the environment's internal state by processing the given action
     *
     * @param actionCode
     */
    applyAction(actionCode) {
        switch (actionCode) {
            case "w":
                if (this._state.position[1] > 0) {
                    this._state.position[1]--;
                }
                this._state.score = this._state.score - config.verticalDeltaScore;
                break;
            case "a":
                if (this._state.position[0] > 0) {
                    this._state.position[0]--;
                }
                break;
            case "s":
                if (this._state.position[1] < config.size[1] - 1) {
                    this._state.position[1]++;
                }
                this._state.score = this._state.score + config.verticalDeltaScore;
                break;
            case "d":
                if (this._state.position[0] < config.size[0] - 1) {
                    this._state.position[0]++;
                }
                break;
        }
        this._state.isComplete = this._state.position[1] == config.size[1] - 1;// || this._state.score < -100;

        this._state.score = this._state.score + config.tileValueMap[this._state.tileTypes[this._state.position[0]][this._state.position[1]]];

        // if (this._state.isComplete) {
        //     this._state.score += config.pointsForCompletion;
        // }
    }

    /**
     * Returns what the agent can see about the current environment state
     *
     * @returns {AgentObservation}
     */
    getAgentObservation() {
        const trimAmount = [
            Math.floor((config.size[0] - config.viewPortSize[0]) / 2),
            Math.floor((config.size[1] - config.viewPortSize[1]) / 2)
        ];
        const shiftVector = [
            Math.ceil(this._state.position[0] - config.size[0] / 2),
            Math.ceil(this._state.position[1] - config.size[0] / 2) + config.viewPortOffset[1]
        ];
        const trimVector = [trimAmount[0], trimAmount[1]];

        let tileTypes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__tensorTools__["b" /* shiftAndTrimMatrix */])(this._state.tileTypes, shiftVector, 1, trimVector);


        //Make the bottom exit row look safe by making its tile not red
        const limit = config.size[1] - trimAmount[1] - shiftVector[1];
        if (limit < config.viewPortSize[1]) {
            for (let x = 0; x < config.viewPortSize[0]; x++) {
                for (let y = limit; y < config.viewPortSize[1]; y++) {
                    tileTypes[x][y] = 0;
                }
            }
        }

        return new __WEBPACK_IMPORTED_MODULE_1__AgentObservation__["a" /* default */](
            // shiftAndTrimMatrix(getVisibleTiles(this._state), shiftVector, 1, trimVector),
            tileTypes,
            this._state.score,
            [
                Math.floor(config.size[0] / 2) - trimAmount[0],
                Math.floor(config.size[1] / 2) - trimAmount[1] - config.viewPortOffset[1]
            ]
        );
    }

    getGodObservation() {
        return this._state
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Environment;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__environment__ = __webpack_require__(0);
/* unused harmony export getFeelerValue */
/* unused harmony export getFeelerValues */
/* unused harmony export filterPathsWithFirstAction */
/* unused harmony export getBestFeeler */
/* harmony export (immutable) */ __webpack_exports__["a"] = getActionViaFeelers;


const oppositeActions = {
    w: 's',
    a: 'd',
    s: 'w',
    d: 'a'
};
/* unused harmony export oppositeActions */


const actionVectors = {
    //[dX, dY, dScore]
    w: [0, -1, -__WEBPACK_IMPORTED_MODULE_0__environment__["a" /* config */].verticalDeltaScore],
    a: [-1, 0, 0],
    s: [0, 1, __WEBPACK_IMPORTED_MODULE_0__environment__["a" /* config */].verticalDeltaScore],
    d: [1, 0, 0],
};

function getFeelerValue(observation, feelerSteps) {
    let position = [observation.position[0], observation.position[1]];
    let value = 0;
    feelerSteps.forEach((step) => {
        const vector = actionVectors[step];
        position = [position[0] + vector[0], position[1] + vector[1]];
        let cost;
        if (typeof observation.tileTypes[position[0]] === 'undefined' || typeof observation.tileTypes[position[0]][position[1]] === 'undefined') {
            cost = __WEBPACK_IMPORTED_MODULE_0__environment__["a" /* config */].minTileValue * 2; //If going off map, make look very expensive
            // } else
            //     if (observation.visibles[position[0]][position[1]] === 0) {
            //     cost = 1;//config.maxTileCost / 2; //@TODO there must be a better way to deal with unknown tiles
        } else {
            cost = __WEBPACK_IMPORTED_MODULE_0__environment__["a" /* config */].tileValueMap[observation.tileTypes[position[0]][position[1]]]
        }
        value = value + vector[2] + cost;
    });
    return value;
}

function getFeelerValues(observation, feelerPaths) {
    return feelerPaths.map((feelerPath) => {
        return {
            path: feelerPath,
            value: getFeelerValue(observation, feelerPath)
        }
    });
}

function filterPathsWithFirstAction(paths, blacklistedFirstAction) {
    return paths.filter((path) => path[0] !== blacklistedFirstAction);
}

function getBestFeeler(feelersWithValues) {
    return feelersWithValues.reduce((bestFeelerSoFar, feeler) => {
        if (bestFeelerSoFar === null || feeler.value > bestFeelerSoFar.value) {
            return feeler;
        } else {
            return bestFeelerSoFar
        }
    }, null)
}

function getActionViaFeelers(observation, feelerPaths, lastAction) {
    //This filter prevents infinite back-and-forth movement
    const safeFeelerPaths = filterPathsWithFirstAction(
        feelerPaths, oppositeActions[lastAction]
    );

    const feelersWithValues = getFeelerValues(observation, safeFeelerPaths);

    const bestFeeler = getBestFeeler(feelersWithValues);

    return bestFeeler.path[0];
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createMatrix */
/* unused harmony export getMatrixDimensions */
/* unused harmony export matrixPositionExists */
/* unused harmony export forEachValueInMatrix */
/* unused harmony export shiftMatrix */
/* harmony export (immutable) */ __webpack_exports__["b"] = shiftAndTrimMatrix;
/* harmony export (immutable) */ __webpack_exports__["a"] = matrixToVector;
function createMatrix(dimensions, defaultValue) {//@TODO take dimensions instead of size
    let matrix = [];

    for (let i0 = 0; i0 < dimensions[0]; i0++) {
        matrix[i0] = [];
        for (let i1 = 0; i1 < dimensions[1]; i1++) {
            matrix[i0][i1] = defaultValue;
        }
    }

    return matrix;
}

function getMatrixDimensions(matrix) {
    return [matrix.length, matrix[0].length];
}

function matrixPositionExists(matrix, x, y) {
    return typeof matrix[x] !== 'undefined' && typeof matrix[x][y] !== 'undefined';
}

function forEachValueInMatrix(matrix, callback) {
    const dimensions = getMatrixDimensions(matrix);
    for (let x = 0; x < dimensions[0]; x++) {
        for (let y = 0; y < dimensions[1]; y++) {
            callback(x, y, matrix[x][y]);
        }
    }
}

function shiftMatrix(matrix, vector, defaultValue) {
    const dimensions = getMatrixDimensions(matrix);
    const newMatrix = createMatrix(dimensions, defaultValue);

    for (let x = 0; x < dimensions[0]; x++) {
        for (let y = 0; y < dimensions[1]; y++) {
            const fromX = x + vector[0];
            const fromY = y + vector[1];
            if (fromX >= 0 && fromX < dimensions[0] && fromY >= 0 && fromY < dimensions[0]) {
                newMatrix[x][y] = matrix[fromX][fromY]
            }
        }
    }

    return newMatrix;
}


function shiftAndTrimMatrix(matrix, shiftVector, defaultValue, trimVector) {
    shiftVector = [shiftVector[0] + trimVector[0], shiftVector[1] + trimVector[1]];
    const dimensions = [matrix.length, matrix[0].length];
    const newDimensions = [dimensions[0] - trimVector[0] * 2, dimensions[1] - trimVector[1] * 2];
    const newMatrix = createMatrix(newDimensions, defaultValue);

    for (let x = 0; x < newDimensions[0]; x++) {
        for (let y = 0; y < newDimensions[1]; y++) {
            const fromX = x + shiftVector[0];
            const fromY = y + shiftVector[1];
            if (fromX >= 0 && fromX < dimensions[0] && fromY >= 0 && fromY < dimensions[0]) {
                newMatrix[x][y] = matrix[fromX][fromY]
            }
        }
    }

    return newMatrix;
}

function matrixToVector(matrix) {
    let vector = [];
    for (let xI = 0, len = matrix[0].length; xI < len; xI++) {
        vector = [...vector, ...matrix[xI]];
    }
    return vector;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19).Buffer))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(24);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Mat;
// Mat holds a matrix
function Mat(n, d) {
    // n is number of rows d is number of columns
    this.n = n;
    this.d = d;
    this.w = new Float64Array(n * d);
    this.dw = new Float64Array(n * d);
};
Mat.prototype = {
    setFrom: function (arr) {
        for (var i = 0, n = arr.length; i < n; i++) {
            this.w[i] = arr[i];
        }
    },
    toJSON: function () {
        var json = {};
        json['n'] = this.n;
        json['d'] = this.d;
        json['w'] = this.w;
        return json;
    },
    fromJSON: function (json) {
        this.n = json.n;
        this.d = json.d;
        this.w = new Float64Array(this.n * this.d);
        this.dw = new Float64Array(this.n * this.d);
        for (var i = 0, n = this.n * this.d; i < n; i++) {
            this.w[i] = json.w[i]; // copy over weights
        }
    }
};


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DQN_Agent__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(7);

 //@TODO use DI instead for this

function getMinimumVectorIndex(w) {
    var minv = w[0];
    var minix = 0;
    for (var i = 1, n = w.length; i < n; i++) {
        var v = w[i];
        if (v < minv) {
            minix = i;
            minv = v;
        }
    }
    return minix;
}

// function maxi(w) {
//     var minv = w[0];
//     var minix = 0;
//     for (var i = 1, n = w.length; i < n; i++) {
//         var v = w[i];
//         if (v < minv) {
//             minix = i;
//             minv = v;
//         }
//     }
//     return minix;
// }

let actionElements = null;
let randomActionElement = null;
let rewardElements = null;

let currentAgent; //@TODO WARNING IS HUGE HACK

function ensureElementsExist() {
    if (document.getElementById('DQNRender')) {
        return;
    }
    document.getElementById('agentRendererContainer').innerHTML =
        `<div id="DQNRender">
    <br />Action Choice:
    <div style="overflow: auto"><div style="float: left">w:&nbsp;</div> <div id="action0" style="background-color: lightgoldenrodyellow;"></div></div>
    <div style="overflow: auto"><div style="float: left">a:&nbsp;</div> <div id="action1" style="background-color: lightsalmon"></div></div>
    <div style="overflow: auto"><div style="float: left">s:&nbsp;</div> <div id="action2" style="background-color: lightskyblue"></div></div>
    <div style="overflow: auto"><div style="float: left">d:&nbsp;</div> <div id="action3" style="background-color: lightseagreen"></div></div>
        <div style="overflow: auto"><div style="float: left">random action&nbsp;</div> <div id="actionRandom" style="background-color: lightcoral;height: 1em"></div></div>
        <br>
        Reward:
        <div style="overflow: auto"><div style="float: left">good&nbsp;</div> <div id="good" style="background-color: greenyellow"></div></div>
    <div style="overflow: auto"><div style="float: left">bad&nbsp;</div> <div id="bad" style="background-color: orangered"></div></div>
<br /><button id="dump-agent-internal-data">Dump Agent Internal Data</button>
</div>`;
    actionElements = [
        document.getElementById('action0'),
        document.getElementById('action1'),
        document.getElementById('action2'),
        document.getElementById('action3'),
    ];
    randomActionElement = document.getElementById('actionRandom');
    rewardElements = [
        document.getElementById('good'),
        document.getElementById('bad'),
    ];

    document.getElementById('dump-agent-internal-data').addEventListener('click', ()=> {
        if (!document.getElementById('q-learning-data')) {
            let div = document.createElement('div');
            let label = document.createElement('div');
            label.innerHTML = '<br/>Q Learner Internal State Dump';
            let textArea = document.createElement("TEXTAREA");
            textArea.style.width = '100%';
            textArea.style.height = '10em';
            textArea.setAttribute('id', 'q-learning-data');
            div.appendChild(label);
            div.appendChild(textArea);
            document.body.appendChild(div);
        }
        document.getElementById('q-learning-data').innerHTML = JSON.stringify(currentAgent.toJSON());
    });
}

function renderActionResponse(actionResponse) {
    ensureElementsExist();

    if (actionResponse.wasRandom) {
        // randomElement.innerHTML = 100;
        randomActionElement.style.width = (100 * 3 + 50) + 'px';
        for (i = 0; i < actionElements.length; i++) {
            var element = actionElements[i];
            element.innerHTML = 0;
            element.style.width = '50px';
        }
    } else {
        // randomElement.innerHTML = 0;
        randomActionElement.style.width = '10px';
        const minAction = getMinimumVectorIndex(actionResponse.weights);
        // const maxA = maxi(actionResponse.weights);
        const maxAction = actionResponse.action;
        for (var i = 0, len = actionResponse.weights.length; i < len; i++) {
            let adder = 0;
            if (actionResponse.weights[minAction] < 0) {
                adder = -actionResponse.weights[minAction];
            }
            let fixedValue = Math.floor((actionResponse.weights[i] + adder) / (actionResponse.weights[maxAction] + adder) * 100);

            actionElements[i].style.width = (fixedValue * 3 + 50) + 'px';
            actionElements[i].innerHTML = fixedValue;
        }
    }
}

function renderReward(reward) {
    let good = 0;
    let bad = 0;
    if (reward < 0) {
        bad = -reward;
    } else {
        good = reward;
    }

    rewardElements[0].style.width = (good * 15 + 50) + 'px';
    rewardElements[0].innerHTML = good;

    rewardElements[1].style.width = (bad * 15 + 50) + 'px';
    rewardElements[1].innerHTML = bad;
}

class RlDqn {
    constructor(learningEnabled, numberOfStates, previousSavedData) {
        // create the DQN agent
        var spec = {alpha: 0.01}; // see full options on DQN page
        this._agent = new __WEBPACK_IMPORTED_MODULE_0__DQN_Agent__["a" /* default */](numberOfStates, 4, spec);
        if (typeof previousSavedData !== 'undefined') {
            this._agent.fromJSON(previousSavedData);
        }

        this._learningEnabled = learningEnabled;
    }

    getAction(state, reward) {
        currentAgent = this._agent;

        if (this._learningEnabled) {
            if (reward !== null) {
                this._agent.learn(reward);
                if (__WEBPACK_IMPORTED_MODULE_1__index__["userSettings"].renderingEnabled) {
                    renderReward(reward)
                }
            }
        }
        let actionResponse = this._agent.act(state);

        if (__WEBPACK_IMPORTED_MODULE_1__index__["userSettings"].renderingEnabled) {
            renderActionResponse(actionResponse);
        }

        return actionResponse.action;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RlDqn;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderer_HtmlTableRenderer__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__agent_ColumnCompare__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__agent_LookAheadWide__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__agent_LookAheadWideAndDeep__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__agent_AlwaysDown__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__agent_BarelyLookAhead__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__agent_RL_DQN_InLearningMode__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__agent_RL_DQN_PreTrained__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__environment__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__GameRunner__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__style_css__);











// import ReinforcementLearnerDeepQNetworkPreTrained from './agent/ReinforcementLearnerDeepQNetworkPreTrained'


const userSettings = {
    renderingEnabled: true
};
/* harmony export (immutable) */ __webpack_exports__["userSettings"] = userSettings;


document.body.innerHTML =
    '<div id="info">Agent: <select id="agentSelector"></select>' +
    '<br>Speed Interval: <select id="interval">' +
    '<option value="no-render">0ms with no rendering</option>' +
    '<option value="0">0ms</option>' +
    '<option value="100">100ms</option>' +
    '<option value="200">200ms</option>' +
    '<option value="250" selected>250ms</option>' +
    '<option value="500">500ms</option>' +
    '<option value="1000">1000ms</option>' +
    '<option value="paused">Paused</option>' +
    '</select>' +
    '<pre id="score"></pre>' +
    '</div>' +
    '<div id="rendererContainer"></div>' +
    '<div id="agentRendererContainer"></div>' +
    '<pre>' +
    '\nGame Rules:' +
    // '\n- Gain ' + environmentConfig.pointsForCompletion + ' points for making it to the bottom row' +
    '\n- Gain ' + __WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].verticalDeltaScore + ' points for every row lower you go' +
    '\n- Loose ' + __WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].verticalDeltaScore + ' points for every row higher you go' +
    '\n- Loose ' + -__WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].tileValueMap[1] + ' points when moving into a red square' +
    '\n- Loose ' + -__WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].tileValueMap[0] + ' points when moving into a grey square' +
    '</pre>';
const scoreElement = document.getElementById('score');

let autoPlay = true;
let speed = 250;
let intervalReference = null;
let agent;
let currentAgentName;
let renderer = new __WEBPACK_IMPORTED_MODULE_0__renderer_HtmlTableRenderer__["a" /* default */](document.getElementById('rendererContainer'));

let gameRunner = new __WEBPACK_IMPORTED_MODULE_9__GameRunner__["a" /* default */](renderer, handleGameRunnerStatusChange);

let agents = {
    'RL_DQN_PreTrained - ranked 192': __WEBPACK_IMPORTED_MODULE_7__agent_RL_DQN_PreTrained__["a" /* default */],
    'RL_DQN_InLearningMode': __WEBPACK_IMPORTED_MODULE_6__agent_RL_DQN_InLearningMode__["a" /* default */],
    'LookAheadWideAndDeep - ranked 234': __WEBPACK_IMPORTED_MODULE_3__agent_LookAheadWideAndDeep__["a" /* default */],
    'LookAheadWide - ranked 230': __WEBPACK_IMPORTED_MODULE_2__agent_LookAheadWide__["a" /* default */],
    'ColumnCompare - ranked 208': __WEBPACK_IMPORTED_MODULE_1__agent_ColumnCompare__["a" /* default */],
    'BarelyLookAhead - ranked 192': __WEBPACK_IMPORTED_MODULE_5__agent_BarelyLookAhead__["a" /* default */],
    'AlwaysDown - ranked 80': __WEBPACK_IMPORTED_MODULE_4__agent_AlwaysDown__["a" /* default */],
};
for (agent in agents) {
    //Select the first agent in the list
    currentAgentName = agent;
    break;
}

function handleGameRunnerStatusChange(stats) {
    scoreElement.innerHTML =
        'Agent: ' + currentAgentName +
        '\nCurrent Score: ' + stats.currentScore +
        '\nLast Game Final Score: ' + stats.lastGameScore +
        '\nAvg Final Score: ' + (Math.round(stats.scoreSum / stats.gameCount) || 0) +
        '\nGame Count: ' + stats.gameCount;
}

let agentSelectorElement = document.getElementById('agentSelector');
for (agent in agents) {
    const optionElement = document.createElement('option');
    optionElement.text = agent;
    optionElement.value = agent;
    agentSelectorElement.appendChild(optionElement)
}
agentSelectorElement.addEventListener('change', (event) => {
    currentAgentName = agentSelectorElement.value;
    document.getElementById('agentRendererContainer').innerHTML = '';
    gameRunner.clearStats();
    newGame()
});

document.getElementById('interval').addEventListener('change', (event) => {
    const value = event.target.value;
    let newEnableRenderingValue = true;
    autoPlay = true;
    if (value === 'no-render') {
        newEnableRenderingValue = false;
        speed = 0;
        renderer.clear();
    } else if (value === 'paused') {
        autoPlay = false;
    } else {
        speed = value;
    }
    if (newEnableRenderingValue != userSettings.renderingEnabled) {
        userSettings.renderingEnabled = newEnableRenderingValue;
        newGame();
    }
    setupInterval();
});

function setupInterval() {
    clearInterval(intervalReference);
    if (autoPlay) {
        if (userSettings.renderingEnabled) {
            intervalReference = setInterval(gameRunner.tick, speed);
        } else {
            //Normal ticking takes 3ms between ticks which is not fast enough, so tick 100 times
            intervalReference = setInterval(function () {
                for (let i = 0; i < 200; i++) {
                    gameRunner.tick();
                }
            }, 0);
        }
    }
}

document.body.addEventListener('keydown', function (event) {
    gameRunner.takeAction(event.key);
    // if (userSettings.renderingEnabled) {
    //     const agentObservation = environment.getAgentObservation();
    //     renderer.render(agentObservation, environment.getGodObservation());
    // }
});

function newGame() {
    gameRunner.newGame(agents[currentAgentName], userSettings.renderingEnabled);
}

newGame();
setupInterval();


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__environment__ = __webpack_require__(0);


const defaultStats = {
    currentScore: 0,
    lastGameScore: 0,
    scoreSum: 0,
    gameCount: 0
};

class GameRunner {
    constructor(renderer, onStatusChange) {
        this._renderingEnabled = false;
        this._renderer = renderer;
        this._stats = Object.assign({}, defaultStats);
        this._onStatusChange = onStatusChange;
        this._agentObservation = null;
        this._godObservation = null;
        this._agentClass = null;

        this.newGame = this.newGame.bind(this);
        this.takeAction = this.takeAction.bind(this);
        this.tick = this.tick.bind(this);
        this.clearStats = this.clearStats.bind(this);
    }

    newGame(agentClass, renderingEnabled) {
        this._agentClass = agentClass;
        this._agent = new this._agentClass();
        this._renderingEnabled = renderingEnabled;
        this._environment = new __WEBPACK_IMPORTED_MODULE_0__environment__["b" /* default */]();
        this._stats.currentScore = 0;//@TODO get from environment?
        if (this._renderingEnabled) {
            //@TODO have this render make the table its self inside a given div
            this._renderer.clear();
            this._renderer.render(this._environment.getAgentObservation(), this._environment.getGodObservation());
        } else {
            this._onStatusChange(this._stats);
        }
        this._updateObservations();
    }

    /**
     *
     * @param actionCode
     */
    takeAction(actionCode) {
        //Apply the action and get the next observation
        this._environment.applyAction(actionCode);
        this._updateObservations();

        if (this._godObservation.isComplete) {//@Find better way to communicate "isComplete"
            this._agent.getAction(this._agentObservation);//Ask for one more action so the agent can see the observation after its last action
            this._stats.lastGameScore = this._agentObservation.score;
            this._stats.scoreSum += this._agentObservation.score;
            this._stats.gameCount += 1;
            this.newGame(this._agentClass, this._renderingEnabled);
        }

        if (this._renderingEnabled) {
            this._renderer.render(this._agentObservation, this._godObservation);
            this._stats.currentScore = this._agentObservation.score;
            this._onStatusChange(this._stats);
        }
    }

    tick() {
        const action = this._agent.getAction(this._agentObservation);
        this.takeAction(action);
    }

    clearStats() {
        this._stats = Object.assign({}, defaultStats);
    }

    _updateObservations() {
        this._agentObservation = this._environment.getAgentObservation();
        this._godObservation = this._environment.getGodObservation();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameRunner;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * An agent that just always moves downwards no matter what
 *
 * @constructor
 */
class AlwaysDown {
    /**
     *
     * @param {AgentObservation} observation
     * @return {string} action code
     */
    getAction(observation) {
        return 's';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AlwaysDown;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(1);


const feelerPaths = [
    ['s'],
    ['a', 's'],
    ['d', 's']
];

class BarelyLookAhead {
    /**
     *
     * @param {AgentObservation} observation
     * @return {string} action code
     */
    getAction(observation) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helper_feeler__["a" /* getActionViaFeelers */])(observation, feelerPaths, null);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BarelyLookAhead;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(1);


const feelerPaths = [
    ['s','s','s','s','s'],
    ['a', 's','s','s','s','s'],
    ['a', 'a', 's','s','s','s','s'],
    ['a', 'a', 'a', 's','s','s','s','s'],
    ['a', 'a', 'a', 'a', 's','s','s','s','s'],
    ['d', 's','s','s','s','s'],
    ['d', 'd', 's','s','s','s','s'],
    ['d', 'd', 'd', 's','s','s','s','s'],
    ['d', 'd', 'd', 'd', 's','s','s','s','s'],
];

class ColumnCompare {
    /**
     * An agent that looks far to the sides but one tile downward
     *
     * @param {AgentObservation} observation
     * @return {string} action code
     */
    getAction(observation) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helper_feeler__["a" /* getActionViaFeelers */])(observation, feelerPaths, null);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ColumnCompare;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(1);


const feelerPaths = [
    ['s', 's'],

    ['a', 's', 's'],
    ['s', 'a', 's'],
    ['a', 'a', 's', 's'],
    ['s', 'a', 'a', 's'],
    ['s', 'a', 'a', 'a', 's'],
    ['a', 's', 'a', 'a', 's'],
    ['a', 'a', 's', 'a', 's'],
    ['a', 'a', 'a', 's', 's'],
    ['a', 'a', 'a', 'a', 's', 's'],

    ['d', 's', 's'],
    ['s', 'd', 's'],
    ['d', 'd', 's', 's'],
    ['s', 'd', 'd', 's'],
    ['s', 'd', 'd', 'd', 's'],
    ['d', 's', 'd', 'd', 's'],
    ['d', 'd', 's', 'd', 's'],
    ['d', 'd', 'd', 's', 's'],
    ['d', 'd', 'd', 'd', 's', 's'],
];

class LookAheadWide {
    constructor() {
        this._state = {lastAction: null};
    }

    /**
     *
     * @param {AgentObservation} observation
     * @return {string} action code
     */
    getAction(observation) {
        let action = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helper_feeler__["a" /* getActionViaFeelers */])(observation, feelerPaths, this._state.lastAction);

        this._state.lastAction = action;

        return action;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LookAheadWide;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(1);


const feelerPaths = [ //Warning the paths below may not include all possibilities

    ['s', 's', 's'],

    ////

    ['s', 'a', 's', 's'],
    ['s', 'a', 's', 'a', 's'],
    ['s', 'a', 's', 'a', 'a', 's'],

    ['s', 'a', 'a', 's', 's'],
    ['s', 'a', 'a', 's', 'a', 's'],
    ['s', 'a', 'a', 'a', 's', 's'],

    ['s', 's', 'a', 's'],
    ['s', 's', 'a', 'a', 's'],
    ['s', 's', 'a', 'a', 'a', 's'],

    ['a', 's', 's', 's'],
    ['a', 's', 's', 'a', 's'],
    ['a', 's', 's', 'a', 'a', 's'],

    ['a', 's', 'a', 's', 's'],
    ['a', 's', 'a', 's', 'a', 's'],

    ['a', 'a', 's', 's', 's'],
    ['a', 'a', 's', 'a', 's', 's'],
    ['a', 'a', 's', 'a', 's', 'a', 's'],

    ['a', 'a', 'a', 's', 's', 's'],

    ////

    ['s', 'd', 's', 's'],
    ['s', 'd', 's', 'd', 's'],
    ['s', 'd', 's', 'd', 'd', 's'],

    ['s', 'd', 'd', 's', 's'],
    ['s', 'd', 'd', 's', 'd', 's'],
    ['s', 'd', 'd', 'd', 's', 's'],

    ['s', 's', 'd', 's'],
    ['s', 's', 'd', 'd', 's'],
    ['s', 's', 'd', 'd', 'd', 's'],

    ['d', 's', 's', 's'],
    ['d', 's', 's', 'd', 's'],
    ['d', 's', 's', 'd', 'd', 's'],

    ['d', 's', 'd', 's', 's'],
    ['d', 's', 'd', 's', 'd', 's'],

    ['d', 'd', 's', 's', 's'],
    ['d', 'd', 's', 'd', 's', 's'],
    ['d', 'd', 's', 'd', 's', 'd', 's'],

    ['d', 'd', 'd', 's', 's', 's'],

    ////

    ['a', 's', 's', 'd', 's'],
    ['a', 'a', 's', 's', 'd', 's'],
    ['a', 'a', 's', 's', 'd', 'd', 's'],
    ['a', 'a', 's', 's', 'd', 'd', 'd', 's'],
    ['a', 'a', 'a', 's', 's', 'd', 's'],
    ['a', 'a', 'a', 's', 's', 'd', 'd', 's'],
    ['a', 'a', 'a', 's', 's', 'd', 'd', 'd', 's'],

    ////

    ['d', 's', 's', 'a', 's'],
    ['d', 'd', 's', 's', 'a', 's'],
    ['d', 'd', 's', 's', 'a', 'a', 's'],
    ['d', 'd', 's', 's', 'a', 'a', 'a', 's'],
    ['d', 'd', 'd', 's', 's', 'a', 's'],
    ['d', 'd', 'd', 's', 's', 'a', 'a', 's'],
    ['d', 'd', 'd', 's', 's', 'a', 'a', 'a', 's'],
];

class LookAheadWideAndDeep {
    constructor() {
        this._state = {lastAction: null};
    }

    /**
     *
     * @param {AgentObservation} observation
     * @return {string} action code
     */
    getAction(observation) {
        let action = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helper_feeler__["a" /* getActionViaFeelers */])(observation, feelerPaths, this._state.lastAction);

        this._state.lastAction = action;

        return action;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LookAheadWideAndDeep;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tensorTools__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helper_RlDqn__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environment__ = __webpack_require__(0);



const actions = ['w', 'a', 's', 'd'];

const numberOfStates = __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].viewPortSize[0] * __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].viewPortSize[1] + 1;

let rlDqn = new __WEBPACK_IMPORTED_MODULE_1__helper_RlDqn__["a" /* default */](true, numberOfStates);

class RL_DQN_InLearningMode {
    constructor() {
        this._lastScore = null;
        this._lastActionIndex = 2; //2='s'
    }

    /**
     *
     * @param {AgentObservation} observation
     * @return {string} action code
     */
    getAction(observation) {
        const state = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__tensorTools__["a" /* matrixToVector */])(observation.tileTypes);

        //Give the agent memory of the last action it took. This may be cheating.
        state.push(this._lastActionIndex);

        let reward = null;
        if (this._lastScore !== null) {
            reward = observation.score - this._lastScore;
        }

        const actionIndex = rlDqn.getAction(state, reward);

        let action = actions[actionIndex];

        this._lastScore = observation.score;
        this._lastActionIndex = actionIndex;
        return action;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RL_DQN_InLearningMode;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tensorTools__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helper_RlDqn__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environment__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__neural_network_saves_view_port_9_9_0_2_best__ = __webpack_require__(31);




const actions = ['w', 'a', 's', 'd'];

const numberOfStates = __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].viewPortSize[0] * __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].viewPortSize[1] + 1;

let rlDqn = new __WEBPACK_IMPORTED_MODULE_1__helper_RlDqn__["a" /* default */](true, numberOfStates, __WEBPACK_IMPORTED_MODULE_3__neural_network_saves_view_port_9_9_0_2_best__["a" /* data */]);

class RL_DQN_PreTrained {
    constructor() {
        this._lastScore = null;
        this._lastActionIndex = 2; //2='s'
    }

    /**
     *
     * @param {AgentObservation} observation
     * @return {string} action code
     */
    getAction(observation) {
        const state = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__tensorTools__["a" /* matrixToVector */])(observation.tileTypes);

        //Give the agent memory of the last action it took. This may be cheating.
        state.push(this._lastActionIndex);

        let reward = null;
        if (this._lastScore !== null) {
            reward = observation.score - this._lastScore;
        }

        const actionIndex = rlDqn.getAction(state, reward);

        let action = actions[actionIndex];

        this._lastScore = observation.score;
        this._lastActionIndex = actionIndex;
        return action;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RL_DQN_PreTrained;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HtmlTableRenderer_css__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HtmlTableRenderer_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__HtmlTableRenderer_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tensorTools__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environment__ = __webpack_require__(0);




function generateTableHtml(size, tableClassName) {
    var html = '';
    for (var y = 0; y < size[1]; y++) {
        html += '<tr>';
        for (var x = 0; x < size[0]; x++) {
            html += '<td class="tile-' + x + '-' + y + '"></td>';
        }
        html += '</tr>';
    }
    return '<table class="' + tableClassName + '">' + html + '</table>';
}

function getTdElements(size, tableClassName) {
    var tdElements = [];
    for (var x = 0; x < size[0]; x++) {
        tdElements[x] = [];
        for (var y = 0; y < size[1]; y++) {
            tdElements[x][y] = document.querySelector('table.' + tableClassName + ' td.tile-' + x + '-' + y);
        }
    }
    return tdElements;
}

class HtmlTableRenderer {
    constructor(containerElement) {
        this.clear();//Call clear to init internal observation properties

        containerElement.innerHTML = '<div class="InfectionGameHtmlTableRender">' +
            '<div>' +
            'Agent View' +
            generateTableHtml(__WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].viewPortSize, 'renderer-table-canvas-agent') +
            '</div>' +
            '<div>' +
            'Environment View' +
            generateTableHtml(__WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size, 'renderer-table-canvas-god') +
            '</div>' +
            '</div>';

        this._agentTds = getTdElements(__WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].viewPortSize, 'renderer-table-canvas-agent');
        this._godTds = getTdElements(__WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size, 'renderer-table-canvas-god')
    }

    /**
     * Clears the observation of the renderer causing it to forget any stored observation.
     */
    clear() {
        this._previousPositions = new Array(__WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size[0]);
        for (var i = 0; i < __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size[0]; i++) {
            this._previousPositions[i] = new Array(__WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size[1]);
        }
    }

    /**
     * Render the current observation of the environment in HTML
     *
     * @param {AgentObservation} agentObservation
     * @param {State} godObservation
     */
    render(agentObservation, godObservation) {
        //Render the agent view
        var agentViewPortSize = [
            agentObservation.tileTypes.length,
            agentObservation.tileTypes[0].length
        ];

        var xLength = agentViewPortSize[0];
        var yLength = agentViewPortSize[1];
        for (var x = 0; x < xLength; x++) {
            for (var y = 0; y < yLength; y++) {
                var color = {r: 50, g: 50, b: 50};
                // if (agentObservation.visibles[x][y] === 0) {
                //     color = {r: 0, g: 0, b: 0};
                // } else
                if (x == agentObservation.position[0] && y == agentObservation.position[1] && agentObservation.tileTypes[x][y] !== 0) {
                    color = {r: 255, g: 255, b: 0};
                } else if (x == agentObservation.position[0] && y == agentObservation.position[1]) {
                    color = {r: 0, g: 255, b: 0};
                } else if (agentObservation.tileTypes[x][y] !== 0) {
                    color = {r: 230, g: 0, b: 0};
                }
                this._agentTds[x][y].style
                    .backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }
        }

        //Render the god view
        var xLength = __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size[0];
        var yLength = __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size[1];
        for (var x = 0; x < xLength; x++) {
            for (var y = 0; y < yLength; y++) {
                var inPreviousPosition = this._previousPositions[x][y];
                var color = {r: 50, g: 50, b: 50};
                if (x == godObservation.position[0] && y == godObservation.position[1] && godObservation.tileTypes[x][y] !== 0) {
                    color = {r: 255, g: 255, b: 0};
                } else if (x == godObservation.position[0] && y == godObservation.position[1]) {
                    color = {r: 0, g: 255, b: 0};
                } else if (inPreviousPosition && godObservation.tileTypes[x][y] !== 0) {
                    color = {r: 255, g: 255, b: 128}
                } else if (inPreviousPosition) {
                    color = {r: 0, g: 128, b: 0}
                } else if (godObservation.tileTypes[x][y] !== 0) {
                    color = {r: 230, g: 0, b: 0};
                }
                this._godTds[x][y].style
                    .backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }
        }

        this._previousPositions[godObservation.position[0]][godObservation.position[1]] = true;
    };
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HtmlTableRenderer;



/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(18)
var ieee754 = __webpack_require__(23)
var isArray = __webpack_require__(20)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)))

/***/ }),
/* 20 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "#info {\n    margin-right: 2em;\n    /*float: left*/\n}\n\n.InfectionGameHtmlTableRender {\n    /*float: left;*/\n    overflow: auto;\n}\n\n.InfectionGameHtmlTableRender table {\n    padding-right: 2em;\n    border-spacing: 0;\n    border-collapse:collapse;\n}\n\n.InfectionGameHtmlTableRender table td {\n    border: 0; /*For iphones*/\n}\n\n.InfectionGameHtmlTableRender > div {\n    float: left;\n    border-spacing: 0;\n    margin-right: 2em;\n}\n\n/*.InfectionGameHtmlTableRender table.renderer-table-canvas-agent {*/\n    /*padding: 10px;*/\n    /*background-color: black;*/\n/*}*/\n\n.InfectionGameHtmlTableRender .renderer-table-canvas-god td {\n    height: 5px;\n    width: 5px;\n}\n\n.InfectionGameHtmlTableRender .renderer-table-canvas-agent td {\n    height: 22px;\n    width: 22px;\n}\n\n#agentRendererContainer {\n    margin-top: 1em;\n}", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 24 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(21);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./HtmlTableRenderer.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./HtmlTableRenderer.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Recurrent__ = __webpack_require__(29);
/* harmony export (immutable) */ __webpack_exports__["a"] = Agent;


// syntactic sugar function for getting default parameter values
var getopt = function (opt, field_name, default_value) {
    if (typeof opt === 'undefined') {
        return default_value;
    }
    return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
};

var randi = __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].randi;

function Agent(numberOfStates, maxNumberOfActions, opt) {
    this.gamma = getopt(opt, 'gamma', 0.75); // future reward discount factor
    this.epsilon = getopt(opt, 'epsilon', 0.1); // for epsilon-greedy policy
    this.alpha = getopt(opt, 'alpha', 0.01); // value function learning rate

    this.experience_add_every = getopt(opt, 'experience_add_every', 25); // number of time steps before we add another experience to replay memory
    this.experience_size = getopt(opt, 'experience_size', 5000); // size of experience replay
    this.learning_steps_per_iteration = getopt(opt, 'learning_steps_per_iteration', 10);
    this.tderror_clamp = getopt(opt, 'tderror_clamp', 1.0);

    this.num_hidden_units = getopt(opt, 'num_hidden_units', 100);

    this.ns = numberOfStates;
    this.na = maxNumberOfActions;

    this.reset();
};
Agent.prototype = {
    reset: function () {
        this.nh = this.num_hidden_units; // number of hidden units

        // nets are hardcoded for now as key (str) -> Mat
        // not proud of this. better solution is to have a whole Net object
        // on top of Mats, but for now sticking with this
        this.net = {};
        this.net.W1 = new __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].RandMat(this.nh, this.ns, 0, 0.01);
        this.net.b1 = new __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].Mat(this.nh, 1, 0, 0.01);
        this.net.W2 = new __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].RandMat(this.na, this.nh, 0, 0.01);
        this.net.b2 = new __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].Mat(this.na, 1, 0, 0.01);

        this.exp = []; // experience
        this.expi = 0; // where to insert

        this.t = 0;

        this.r0 = null;
        this.s0 = null;
        this.s1 = null;
        this.a0 = null;
        this.a1 = null;
    },
    toJSON: function () {
        // save function
        var j = {};
        j.nh = this.nh;
        j.ns = this.ns;
        j.na = this.na;
        j.net = __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].netToJSON(this.net);
        return j;
    },
    fromJSON: function (j) {
        // load function
        this.nh = j.nh;
        this.ns = j.ns;
        this.na = j.na;
        this.net = __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].netFromJSON(j.net);
    },
    forwardQ: function (net, s, needs_backprop) {
        var G = new __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].Graph(needs_backprop);
        var a1mat = G.add(G.mul(net.W1, s), net.b1);
        var h1mat = G.tanh(a1mat);
        var a2mat = G.add(G.mul(net.W2, h1mat), net.b2);
        this.lastG = G; // back this up. Kind of hacky isn't it
        return a2mat;
    },
    act: function (slist) {
        // convert to a Mat column vector
        var state = new __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].Mat(this.ns, 1);
        state.setFrom(slist);

        let actionWasRandom = false;
        let actionWeights = null;
        let action;

        // epsilon greedy policy
        if (Math.random() < this.epsilon) {
            action = randi(0, this.na);
            actionWasRandom = true;
        } else {
            // greedy wrt Q function
            var actionMatrix = this.forwardQ(this.net, state, false);

            actionWeights = actionMatrix.w;
            action = __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].maxi(actionMatrix.w); // returns index of argmax action
        }

        // shift state memory
        this.s0 = this.s1;
        this.a0 = this.a1;
        this.s1 = state;
        this.a1 = action;

        return {
            action: action,
            wasRandom: actionWasRandom,
            weights: actionWeights
        };
    },
    learn: function (r1) {
        // perform an update on Q function
        if (!(this.r0 == null) && this.alpha > 0) {

            // learn from this tuple to get a sense of how "surprising" it is to the agent
            var tderror = this.learnFromTuple(this.s0, this.a0, this.r0, this.s1);

            // decide if we should keep this experience in the replay
            if (this.t % this.experience_add_every === 0) {
                this.exp[this.expi] = [this.s0, this.a0, this.r0, this.s1];
                this.expi += 1;
                if (this.expi > this.experience_size) {
                    this.expi = 0;
                } // roll over when we run out
            }
            this.t += 1;

            // sample some additional experience from replay memory and learn from it
            for (var k = 0; k < this.learning_steps_per_iteration; k++) {
                var ri = randi(0, this.exp.length); // todo: priority sweeps?
                var e = this.exp[ri];
                this.learnFromTuple(e[0], e[1], e[2], e[3])
            }
        }
        this.r0 = r1; // store for next update
        return {
            tderror: tderror
        }
    },
    learnFromTuple: function (s0, a0, r0, s1) {

        // want: Q(s,a) = r + gamma * max_a' Q(s',a')

        // compute the target Q value
        var tmat = this.forwardQ(this.net, s1, false);
        var qmax = r0 + this.gamma * tmat.w[__WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].maxi(tmat.w)];//@TODO ROD NOTE - should we look more than one step ahead?

        // now predict
        var pred = this.forwardQ(this.net, s0, true);

        var tderror = pred.w[a0] - qmax;
        var clamp = this.tderror_clamp;
        if (Math.abs(tderror) > clamp) {  // huber loss to robustify //@TODO ROD NOTE - Does this IF do anything?
            if (tderror > clamp) tderror = clamp;
            if (tderror < -clamp) tderror = -clamp;
        }
        pred.dw[a0] = tderror;
        this.lastG.backward(); // compute gradients on net params

        // update net
        __WEBPACK_IMPORTED_MODULE_0__Recurrent__["a" /* Recurrent */].updateNet(this.net, this.alpha);

        return tderror;
    }
};


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Mat__ = __webpack_require__(5);
/* harmony export (immutable) */ __webpack_exports__["a"] = Graph;


// Transformer definitions
function Graph(needs_backprop) {
    this.needs_backprop = needs_backprop;

    // this will store a list of functions that perform backprop,
    // in their forward pass order. So in backprop we will go
    // backwards and evoke each one
    this.backprop = [];
};
Graph.prototype = {
    backward: function () {
        for (var i = this.backprop.length - 1; i >= 0; i--) {
            console.log(i);
            this.backprop[i](); // tick!
        }
    },
    tanh: function (m) {
        // tanh nonlinearity
        var out = new __WEBPACK_IMPORTED_MODULE_0__Mat__["a" /* default */](m.n, m.d);
        var n = m.w.length;
        for (var i = 0; i < n; i++) {
            out.w[i] = Math.tanh(m.w[i]);
        }

        if (this.needs_backprop) {
            var backward = function () {
                for (var i = 0; i < n; i++) {
                    // grad for z = tanh(x) is (1 - z^2)
                    var mwi = out.w[i];
                    m.dw[i] += (1.0 - mwi * mwi) * out.dw[i];
                }
            };
            this.backprop.push(backward);
        }
        return out;
    },
    mul: function (m1, m2) {
        // multiply matrices m1 * m2
        // assert(m1.d === m2.n, 'matmul dimensions misaligned');

        var n = m1.n;
        var d = m2.d;
        var out = new __WEBPACK_IMPORTED_MODULE_0__Mat__["a" /* default */](n, d);
        for (var i = 0; i < m1.n; i++) { // loop over rows of m1
            for (var j = 0; j < m2.d; j++) { // loop over cols of m2
                var dot = 0.0;
                for (var k = 0; k < m1.d; k++) { // dot product loop
                    dot += m1.w[m1.d * i + k] * m2.w[m2.d * k + j];
                }
                out.w[d * i + j] = dot;
            }
        }

        if (this.needs_backprop) {
            var backwardMul = function () {
                for (var i = 0; i < m1.n; i++) { // loop over rows of m1
                    for (var k = 0; k < m1.d; k++) { // dot product loop
                        for (var j = 0; j < m2.d; j++) { // loop over cols of m2
                            var b = out.dw[d * i + j];
                            m1.dw[m1.d * i + k] += m2.w[m2.d * k + j] * b;
                            m2.dw[m2.d * k + j] += m1.w[m1.d * i + k] * b;
                        }
                    }
                }
            };
            this.backprop.push(backwardMul);
        }
        return out;
    },
    add: function (m1, m2) {
        // assert(m1.w.length === m2.w.length);

        var out = new __WEBPACK_IMPORTED_MODULE_0__Mat__["a" /* default */](m1.n, m1.d);
        for (var i = 0, n = m1.w.length; i < n; i++) {
            out.w[i] = m1.w[i] + m2.w[i];
        }
        if (this.needs_backprop) {
            var backward = function () {
                for (var i = 0, n = m1.w.length; i < n; i++) {
                    m1.dw[i] += out.dw[i];
                    m2.dw[i] += out.dw[i];
                }
            };
            this.backprop.push(backward);
        }
        return out;
    },
};


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Mat__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Graph__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gaussRandom__ = __webpack_require__(30);




// Utility fun
function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        throw new Error(message);
    }
}

var randi = function (a, b) {
    return Math.floor(Math.random() * (b - a) + a);
};
var randn = function (mu, std) {
    return mu + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__gaussRandom__["a" /* default */])() * std;
};

var copyMat = function (b) {
    var a = new __WEBPACK_IMPORTED_MODULE_0__Mat__["a" /* default */](b.n, b.d);
    a.setFrom(b.w);
    return a;
};

var copyNet = function (net) {
    // nets are (k,v) pairs with k = string key, v = Mat()
    var new_net = {};
    for (var p in net) {
        if (net.hasOwnProperty(p)) {
            new_net[p] = copyMat(net[p]);
        }
    }
    return new_net;
};

var updateMat = function (m, alpha) {
    // updates in place
    for (var i = 0, n = m.n * m.d; i < n; i++) {
        if (m.dw[i] !== 0) {
            m.w[i] += -alpha * m.dw[i];
            m.dw[i] = 0;
        }
    }
};

var updateNet = function (net, alpha) {
    for (var p in net) {
        if (net.hasOwnProperty(p)) {
            updateMat(net[p], alpha);
        }
    }
};

var netToJSON = function (net) {
    var j = {};
    for (var p in net) {
        if (net.hasOwnProperty(p)) {
            j[p] = net[p].toJSON();
        }
    }
    return j;
};
var netFromJSON = function (j) {
    var net = {};
    for (var p in j) {
        if (j.hasOwnProperty(p)) {
            net[p] = new __WEBPACK_IMPORTED_MODULE_0__Mat__["a" /* default */](1, 1); // not proud of this
            net[p].fromJSON(j[p]);
        }
    }
    return net;
};

// return Mat but filled with random numbers from gaussian
var RandMat = function (n, d, mu, std) {
    var m = new __WEBPACK_IMPORTED_MODULE_0__Mat__["a" /* default */](n, d);
    fillRandn(m, mu, std);
    //fillRand(m,-std,std); // kind of :P
    return m;
};

// Mat utils
// fill matrix with random gaussian numbers
var fillRandn = function (m, mu, std) {
    for (var i = 0, n = m.w.length; i < n; i++) {
        m.w[i] = randn(mu, std);
    }
};

var maxi = function (w) {
    // argmax of array w
    var maxv = w[0];
    var maxix = 0;
    for (var i = 1, n = w.length; i < n; i++) {
        var v = w[i];
        if (v > maxv) {
            maxix = i;
            maxv = v;
        }
    }
    return maxix;
};

// various utils
var R = {};
R.assert = assert;
R.maxi = maxi;
R.randi = randi;
R.randn = randn;
// classes
R.Mat = __WEBPACK_IMPORTED_MODULE_0__Mat__["a" /* default */];
R.RandMat = RandMat;
// more utils
R.updateMat = updateMat;
R.updateNet = updateNet;
R.copyMat = copyMat;
R.copyNet = copyNet;
R.netToJSON = netToJSON;
R.netFromJSON = netFromJSON;
// optimization
R.Graph = __WEBPACK_IMPORTED_MODULE_1__Graph__["a" /* default */];


const Recurrent = R;
/* harmony export (immutable) */ __webpack_exports__["a"] = Recurrent;



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = gaussRandom;
var return_v = false;
var v_val = 0.0;
function gaussRandom() {
    if (return_v) {
        return_v = false;
        return v_val;
    }
    var u = 2 * Math.random() - 1;
    var v = 2 * Math.random() - 1;
    var r = u * u + v * v;
    if (r == 0 || r > 1) return gaussRandom();
    var c = Math.sqrt(-2 * Math.log(r) / r);
    v_val = v * c; // cache this
    return_v = true;
    return u * c;
};


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const data =
{"nh":100,"ns":82,"na":4,"net":{"W1":{"n":100,"d":82,"w":{"0":-1.61291417690794,"1":-0.18217986803670566,"2":-1.3734387902287533,"3":0.2925577421860386,"4":-0.23091694937905605,"5":-0.7403519495548223,"6":-0.12854753861583948,"7":1.4614404756226669,"8":2.2229961097068225,"9":-0.15076871869041059,"10":-0.19094267104623436,"11":1.8039543881528328,"12":0.6686794861750541,"13":2.8737220380403268,"14":0.051965478891139553,"15":1.6085955232546028,"16":-0.4285063295068915,"17":1.1302091276923714,"18":1.2015024253640043,"19":1.1330132016605567,"20":0.16158007764654103,"21":1.2930889758447401,"22":0.5481610365217626,"23":-3.570006612116091,"24":-0.17410779932593373,"25":0.29207603843197755,"26":1.808407431549894,"27":-1.9742812079027974,"28":2.6028407949977503,"29":-1.111499189071093,"30":-5.456400676790927,"31":3.9078199442786596,"32":-0.0529784677271266,"33":0.6275592024705224,"34":-7.009749700972857,"35":0.4249775952675081,"36":1.5942408754049906,"37":-0.8722744668945105,"38":0.5742564027380549,"39":0.8623547444477403,"40":2.5142675270530077,"41":-2.2583355064085278,"42":-3.8373106894615825,"43":1.2730317102441642,"44":2.808660279386646,"45":-1.9962476022598092,"46":-1.8468510861577452,"47":-3.613347355589197,"48":-0.4821358210480604,"49":5.438037311666747,"50":5.004276070249673,"51":3.143556790690147,"52":4.479435238900892,"53":2.354360068398713,"54":2.0229762186037545,"55":0.2445694726188617,"56":-1.7342046939044033,"57":0.9693003538487708,"58":-0.47559478810862843,"59":0.07855649062827007,"60":0.5795619677760294,"61":2.1798975886411798,"62":-0.5572564537590526,"63":-1.2178480950749924,"64":1.3403017561082575,"65":-0.2500355815286383,"66":3.384473228446561,"67":-1.095984597141505,"68":0.8166276596043994,"69":-0.35669641920699224,"70":3.1744369065357927,"71":1.5913933243344938,"72":0.9942754161618882,"73":-0.3906312447535559,"74":-5.779856967931454,"75":-0.5052300434625351,"76":-0.23936341568441202,"77":1.7819396072608509,"78":0.37558702409715855,"79":-0.7780714063065516,"80":-0.3265532930765515,"81":0.41290022809434385,"82":-2.065771274703219,"83":-0.5814881132267251,"84":-0.7029155063411713,"85":-2.5374186143887107,"86":-2.0649270109131055,"87":-2.2300751586225163,"88":1.2792285756640576,"89":-1.2377558785592322,"90":1.2669541647749323,"91":-1.3357237635152064,"92":2.552625313259842,"93":-0.8363061311302362,"94":0.9083756322133377,"95":-1.2700160945285197,"96":-5.589000960667312,"97":0.7527745497494032,"98":-0.3936541820710738,"99":2.115867446397325,"100":2.9768949925329733,"101":1.4198855813340137,"102":2.3114945370189854,"103":0.7900616701987697,"104":3.5120266965864593,"105":-0.9052167233900643,"106":2.561613641778834,"107":-0.959671606501655,"108":1.5619803801252157,"109":2.1900395053971313,"110":-0.19908729932753147,"111":-1.5442404819882352,"112":-0.5044241412806543,"113":-4.860034785124632,"114":-2.2772015114641238,"115":5.038647541251867,"116":-3.3984403785929373,"117":3.441337041765218,"118":-1.1041061731107864,"119":-3.093790230117463,"120":-1.4602264890026215,"121":0.9915863997994316,"122":10.360443880014742,"123":3.3109494115893625,"124":-0.9907636422148793,"125":-0.7642182675575349,"126":3.3719015408492647,"127":-0.039418997932178665,"128":-1.2559627832282072,"129":-1.7663473114213828,"130":5.54445643095155,"131":7.124060803149521,"132":0.40204396990156416,"133":0.7587622424293828,"134":4.505571828022272,"135":2.285321604100192,"136":0.2792137589458634,"137":0.8051372748546145,"138":-3.0034285556597484,"139":-2.2936884044939236,"140":-1.1838684481214923,"141":-0.6715361311923728,"142":2.2048162460298752,"143":-1.4048229485446653,"144":-1.2176160003588992,"145":-0.6050607694846657,"146":2.0615748868702553,"147":0.03835905781470966,"148":0.09469880464640933,"149":0.40911958784513947,"150":1.3811256820262667,"151":1.5121256000025698,"152":3.2190383977257544,"153":1.0167810926421195,"154":-0.2155158722461459,"155":-3.6971479959604197,"156":2.701439142821667,"157":1.8580266044656482,"158":0.4379008348202908,"159":1.5035967825613108,"160":-2.5908592943078945,"161":-0.2938401603185759,"162":-1.1216089789267156,"163":-1.381491762195337,"164":1.7265818824958084,"165":1.4478702457090558,"166":2.3755816497052673,"167":0.3169159311057641,"168":-0.06791303160831295,"169":2.4258187598192795,"170":1.8600067172481423,"171":1.1332846762432978,"172":-1.1567672171615329,"173":-0.3102101483865834,"174":-0.7612947691402635,"175":-0.1262935995024585,"176":1.1000325564682099,"177":-0.2464002799993106,"178":2.552924324820279,"179":-0.27567915903016804,"180":-0.48218691783948336,"181":1.4337907105912466,"182":-1.7825041699412993,"183":-0.9640415328432348,"184":0.3715246565499997,"185":1.6531025283435796,"186":0.882753253855843,"187":1.8584357623338421,"188":-0.06993647438206606,"189":0.5219274252032148,"190":0.8429360280458735,"191":2.9526227952887134,"192":-1.7592105790300792,"193":-2.551810465128161,"194":1.3696060985567609,"195":2.0686234497184666,"196":-1.7309420244523592,"197":-1.3635063092121367,"198":1.0749056257178777,"199":-0.5290914386382088,"200":-0.3360681601228349,"201":2.110284078398732,"202":0.5424571018975731,"203":0.5700043044653949,"204":0.9370152773621903,"205":0.9696054215705165,"206":0.44418192834552067,"207":-2.088833281309746,"208":-0.870781226548423,"209":2.425073366658189,"210":-1.7513689306269515,"211":0.8233601051440372,"212":0.7286060539786018,"213":1.3868795970657806,"214":1.685806542985889,"215":-0.3007266109011492,"216":0.20600113765259553,"217":1.5936712491461726,"218":-1.7511641531942799,"219":-1.4429107393989222,"220":0.9393954179221984,"221":2.427805354628272,"222":1.2477661407063734,"223":0.45312598987352837,"224":0.32128643832345044,"225":-0.4154659595581884,"226":2.5135864930068434,"227":1.264111985351141,"228":2.912324268913565,"229":2.3710921276189776,"230":2.9637654155166784,"231":0.8534288714829508,"232":0.6571076166821186,"233":3.47676871309256,"234":1.110082964442428,"235":0.8376206899557272,"236":0.7987546842744981,"237":2.027913686130379,"238":2.408387286189364,"239":2.4621727185230795,"240":1.6297240338677266,"241":0.7474941079707228,"242":2.2196349746796953,"243":0.9743849762254703,"244":0.3239444013097815,"245":1.080683129460127,"246":1.1895989550904689,"247":1.7611367585800004,"248":-4.110830701943974,"249":-3.3932601586933586,"250":-1.717418365671227,"251":0.8269289542002356,"252":0.3469509564934051,"253":-1.8094493953936053,"254":-1.1307511830457888,"255":-3.1338971178070287,"256":-0.9182700756572972,"257":0.6067124854792654,"258":-0.40283291774190183,"259":2.2892712218373648,"260":-2.5412527719778772,"261":-2.971218046852988,"262":-0.2759259316341271,"263":-0.696728266563733,"264":0.0012187903175341383,"265":0.20023694356608313,"266":0.170306338572526,"267":0.3941772476096178,"268":-3.2795539928832267,"269":0.054698398249495295,"270":0.10642529754426905,"271":2.5651251545836007,"272":-1.0091906449909027,"273":-3.025218317297595,"274":3.4702711617331854,"275":-7.151796219936027,"276":0.8352889409588724,"277":-1.3240776829941792,"278":3.3752745826843036,"279":2.2933694146838297,"280":4.8636435557141695,"281":-1.4409921597991173,"282":2.3981237937484563,"283":0.8471279163557389,"284":2.6420949735260653,"285":1.8585624010501847,"286":1.4848298127260084,"287":-0.0734689910332475,"288":4.091165427328083,"289":2.192283532915575,"290":-0.028413237135620925,"291":0.7627161779736319,"292":3.5357127784178406,"293":-1.1281225648130742,"294":1.7481161973432016,"295":-1.3341545103888202,"296":1.3158142645095565,"297":3.694372250239938,"298":-0.7961224223369827,"299":2.619977370310804,"300":1.881017704768198,"301":1.9569438266522068,"302":0.7125475661465425,"303":0.40554690796192283,"304":2.033557239169549,"305":2.457458868751533,"306":0.22072243613823844,"307":1.3598216071070988,"308":-0.6805980459342026,"309":-2.297237815020636,"310":5.16960620370048,"311":-3.809558466326155,"312":-0.774017733891828,"313":-2.673622752303141,"314":1.4865761754560936,"315":2.959200263600415,"316":-0.9103226643699582,"317":0.9376827298515276,"318":-0.40111328092439535,"319":2.1173959397940694,"320":0.36866947584008297,"321":0.2595270207071788,"322":-0.9248479013269146,"323":-1.6615262806219038,"324":2.0864686576238594,"325":4.980185436437722,"326":3.8185269858427104,"327":-3.1194546199401225,"328":1.0546870013755445,"329":-0.5779133190097572,"330":0.9735963367366355,"331":-7.361102564060821,"332":-0.2675730865066692,"333":2.586181560275991,"334":1.8872454412732422,"335":-1.1380678380412879,"336":-3.6709607194763962,"337":0.01815543777371827,"338":-2.8636939054103703,"339":-2.0434348705623666,"340":-0.18608706023589022,"341":0.6593136081689828,"342":0.04447775071328901,"343":3.3199379289495448,"344":4.327284919863543,"345":1.3588759555358019,"346":2.132682345539238,"347":-1.2250198537185666,"348":-2.492444674035876,"349":1.5797783452297227,"350":3.274426270226931,"351":3.843532940941142,"352":-1.6724060830406071,"353":1.7227999706484913,"354":-1.1629368616704538,"355":-2.063747924861046,"356":-4.360318643768729,"357":-0.5995579115660822,"358":5.840817417592169,"359":2.8838511509707123,"360":-0.23282718912023492,"361":-1.9044676524460662,"362":0.28211594360791264,"363":1.6695122760144727,"364":1.731037778629295,"365":1.4826996310343796,"366":1.5724928105238885,"367":-2.8428204423597734,"368":-2.068624055525871,"369":-1.4048787765273318,"370":3.0437442454183854,"371":-0.4637485650678559,"372":-0.6946323660409811,"373":3.438056457020188,"374":-1.887615143839907,"375":-0.9824317458852463,"376":2.691543408514493,"377":0.5582838794953563,"378":2.058451571132719,"379":-0.3866700588570467,"380":-1.4797202174583832,"381":-0.6084465100039216,"382":-2.0109007490789987,"383":-3.8732558452315997,"384":-3.841206229223982,"385":0.4108805675937347,"386":-2.681701468207491,"387":0.10050928635220761,"388":-2.449363177348193,"389":1.603271142648059,"390":3.2518933622320136,"391":0.5972665440539544,"392":-1.3418894603150042,"393":-1.591577362766879,"394":-3.5239040285178116,"395":-0.34844230466610315,"396":-0.5357966676918294,"397":2.771440056248327,"398":0.911811291491331,"399":-2.146362255061011,"400":-3.0089110886988513,"401":0.3580193120598781,"402":2.4356686251782302,"403":-0.645841845836195,"404":-1.005601443800226,"405":-5.243590536256872,"406":-5.2295822874280224,"407":-0.30249214503056165,"408":-3.3026322907476113,"409":4.059565898429041,"410":4.62969005030958,"411":1.4005561443692933,"412":-2.4382644151250408,"413":-1.5175344249365559,"414":-1.009497671883719,"415":-2.0558706912920734,"416":-1.2165708140969123,"417":-1.3046542586715901,"418":-1.3256866830528649,"419":-0.05225056559403248,"420":1.8731571814590342,"421":-1.6894926311408298,"422":-2.0947604056088194,"423":-2.668881275525951,"424":-3.2729447547827255,"425":-0.8369605568605437,"426":-0.9554576633934931,"427":-1.2806128591267372,"428":1.4176303186438253,"429":-0.0033879507928401427,"430":-0.008866056990166526,"431":2.217729189444381,"432":-2.0878426162893793,"433":-1.7844178260358379,"434":-1.1169310736946834,"435":-0.7047269057993555,"436":-1.2631420638737352,"437":0.4533167680550802,"438":-0.06804331449254565,"439":1.1050013350079548,"440":-1.8894461696671108,"441":-1.7256355773062846,"442":-2.4430827063290628,"443":-1.003414904742802,"444":-0.5894635658438703,"445":-0.6259321514884498,"446":-2.0663017100727457,"447":0.9470364544462998,"448":2.187333088609518,"449":0.09310091995521291,"450":-0.5435810628827924,"451":-1.6110683145477322,"452":-0.9563108977918543,"453":-0.8335130192236282,"454":-0.5367580143788184,"455":2.733325707971606,"456":-0.7582630797038556,"457":0.6705877668302944,"458":-4.00452069149907,"459":-2.2889784330524527,"460":-2.496920036176647,"461":-1.409319951930018,"462":-1.248685190317209,"463":-0.7590489363530608,"464":-0.40049267101868463,"465":-0.20929617477769308,"466":-1.1351547847362333,"467":-1.5293096791681635,"468":-2.8952965539114652,"469":-1.822433463867187,"470":-1.3233361618692758,"471":-1.9227383452214672,"472":-1.1537347469038728,"473":4.460585927934849,"474":1.0450477563635172,"475":-0.448013183542539,"476":-2.112296655043051,"477":-3.929302550626018,"478":-2.410079224471245,"479":-2.144368028009672,"480":-1.3696069641644457,"481":-1.5826620179217887,"482":-0.9479010252767675,"483":-2.104916015061995,"484":-1.0086415962723285,"485":-1.3873937899470161,"486":-1.821549026534979,"487":-1.2242726031659577,"488":-1.1950658556217324,"489":-1.1612057698782765,"490":-0.6323469490564964,"491":-1.3790335392268591,"492":-0.024123361604478196,"493":-1.2423017037544437,"494":0.9281529393899074,"495":-1.3526719106768463,"496":-4.660813274574045,"497":-3.076998026325928,"498":0.6502147480823706,"499":-0.47161283172055884,"500":3.783411542079608,"501":-1.0095900902909976,"502":-1.3459619536712955,"503":-3.201200599783785,"504":-0.826984591618166,"505":6.6795173616631,"506":-1.441311611920467,"507":-2.7821084041743047,"508":-1.4035857277012063,"509":-1.9655463967658453,"510":3.468230492543353,"511":-1.1138270757710997,"512":-2.954379837073506,"513":-1.1649761366455438,"514":2.6025707442324575,"515":0.23137160516096134,"516":-0.7078469025985828,"517":0.3469167444473973,"518":0.9020317780586867,"519":-3.2782483596295373,"520":-0.6226206396832812,"521":1.5781284134966116,"522":1.6461223895454717,"523":1.9601802643089044,"524":1.205410449004131,"525":-0.1312433311990696,"526":-1.303928018943646,"527":-5.716070167722154,"528":-0.75057321544912,"529":0.7071664706976607,"530":1.2169630298783365,"531":-2.287351350492856,"532":-0.5460265896952351,"533":-5.551166522459529,"534":-2.0278032532131554,"535":-2.037029764107214,"536":0.15235860987988775,"537":2.2550893904065235,"538":-0.9949450965454473,"539":4.484872098945131,"540":2.3611686085230006,"541":-3.674876043792901,"542":-3.6077604750647128,"543":-3.461876414705941,"544":-3.2346282551701693,"545":-2.339386938950158,"546":1.7588875014776513,"547":0.8423394769610463,"548":1.0893857633930937,"549":2.297600451166229,"550":1.0699531357689946,"551":2.307363625439792,"552":5.844928344674897,"553":1.2046363714193216,"554":2.5861323966699112,"555":0.2880683326843724,"556":-2.9551122834554957,"557":-0.028024408840522708,"558":0.20294903417542653,"559":2.7423554476044605,"560":2.8641506293331367,"561":1.115258808026694,"562":-1.2209468224540896,"563":1.1147877536710467,"564":-1.528275253911477,"565":0.29899968341067296,"566":-1.6689938148309593,"567":-0.08756115906210447,"568":2.1565576677952656,"569":-2.412962154877471,"570":0.9551609745496578,"571":2.8945528681472315,"572":3.664291055520331,"573":-1.073953550161301,"574":-0.8289216173874923,"575":0.23304674721523214,"576":-0.13115319993195906,"577":1.3725031330009345,"578":1.3147298963431377,"579":-0.5214562980691384,"580":-0.14487757025029574,"581":1.6986866995107937,"582":1.195863050253016,"583":-3.253321186529563,"584":-0.15126954040411328,"585":2.0535522182437225,"586":-0.3558032727987458,"587":1.7333837359534707,"588":0.09332256453749335,"589":0.5836258382310532,"590":0.4723489547137186,"591":0.8443158856897456,"592":1.020613063139591,"593":-0.37748815573994143,"594":0.8596539932206533,"595":1.8304222625872508,"596":1.7365659482463414,"597":2.098623134266246,"598":2.4556192908351635,"599":-0.663774853303901,"600":-1.8092261105137608,"601":-1.030980683431604,"602":0.9100867536508397,"603":0.31158273063895936,"604":1.6882920010131648,"605":11.10816519376979,"606":10.46095417664518,"607":7.995849209814086,"608":2.1884497505890783,"609":3.255214062948067,"610":-0.537786716106925,"611":-1.3831222929710514,"612":0.7551979208945132,"613":-2.3680979999670217,"614":-2.056470769850446,"615":-8.92942907169694,"616":-2.4698237642653065,"617":-0.47816407809327577,"618":-0.45326869574932344,"619":1.1230785182481169,"620":-0.7833454822509753,"621":-1.4362197608076084,"622":-2.1939359289621834,"623":-1.5977690114644756,"624":-1.7797657323151546,"625":-3.862680143541488,"626":-1.6530747440550304,"627":-2.0292494881815153,"628":0.6863375678965774,"629":-0.5478607787643817,"630":2.1892354200697657,"631":-1.016091491736389,"632":0.653458987122364,"633":-0.2311387105648122,"634":1.1401532359024302,"635":-1.0574301433578135,"636":-0.5512370564533182,"637":1.8600902182789656,"638":-0.408524554323068,"639":0.6068759201843213,"640":-0.2849290554341662,"641":0.8225062913012878,"642":1.0144272993660846,"643":-0.47964372614071815,"644":0.43172471634629944,"645":0.20042816003484182,"646":1.2364812860040437,"647":1.0984170903235981,"648":-0.14224549468272119,"649":0.08526130049700265,"650":-0.8445847885769889,"651":0.023529942207962926,"652":-1.3227557706056459,"653":-1.9656108688103808,"654":1.7221118774042123,"655":-0.2535694555387695,"656":-1.5723623917656495,"657":3.2293043447885643,"658":-0.12266759929150346,"659":-1.308728108502084,"660":-2.2779523245843394,"661":-1.1386485331072043,"662":4.182692686066588,"663":0.20025128300351977,"664":-1.3466750983708422,"665":2.5863715842250925,"666":1.6460615924192539,"667":-1.39436653541819,"668":-0.34640448525118794,"669":4.420575360083706,"670":-0.30468092089252247,"671":-1.0396724563966315,"672":0.8045362291339112,"673":1.369876724980838,"674":0.7501192464641779,"675":0.3931482837494172,"676":0.001472931740854505,"677":2.7033130193571724,"678":3.3038234174891983,"679":-1.7537594218991885,"680":0.9386447467292486,"681":1.0453771950401025,"682":-1.4179796621499023,"683":-3.402966306558748,"684":-2.105567709527336,"685":2.840505833067762,"686":-0.1765111224974224,"687":-5.027420148318323,"688":-2.7785021707878683,"689":-3.426475648596984,"690":0.05033926748150422,"691":-2.1105536211041316,"692":1.6986677492826168,"693":3.41898570618869,"694":-2.9506951322846917,"695":-4.6614782681140925,"696":-0.6658099882640642,"697":-8.219066584047676,"698":-0.0903872371128473,"699":1.433753029295035,"700":-2.5768864185412164,"701":-1.152183028864705,"702":2.9872015131563896,"703":1.3405626453140742,"704":2.1711600708642425,"705":-3.9853697713079606,"706":-6.115853963761944,"707":-2.3191619780834865,"708":-3.3675484991844336,"709":-2.3051331642867194,"710":-2.4230071937288358,"711":2.4341961352105876,"712":-0.8548445317169011,"713":-0.9208845369791864,"714":-2.864588118658359,"715":2.0507356748878625,"716":0.12714474907851728,"717":2.4246855663327747,"718":-1.0867961241880923,"719":-1.2760321832179442,"720":-0.9403992589345382,"721":-2.43408758440683,"722":1.373008967177029,"723":1.010923188523778,"724":-1.7080211921593569,"725":1.6709504281123397,"726":1.8896859173659029,"727":1.4492997176040412,"728":-1.7312661615340252,"729":-3.898955734838666,"730":0.7680273058192892,"731":1.2839874630594734,"732":-3.303508054469765,"733":0.21887274352342256,"734":0.3294101148832162,"735":2.1015746588800632,"736":3.01178419540699,"737":3.0892871154411665,"738":1.4011949847752172,"739":2.0615717000379394,"740":-2.045940220407449,"741":-0.2624143999430966,"742":-0.2332926599413479,"743":-1.084895050955057,"744":0.43428163671813436,"745":-1.5213638895825796,"746":3.291072424315215,"747":-2.198939423820624,"748":-0.09996314906132574,"749":-0.6975381402820369,"750":-0.16717617899469006,"751":2.8431527386231497,"752":0.048267066542939205,"753":-1.3733568393011175,"754":0.23364758632367413,"755":2.53609236614265,"756":0.4973328315190994,"757":1.9113220672735545,"758":-0.38655341025014,"759":-0.32062320425223656,"760":-2.0697334772579117,"761":-2.2403339071765136,"762":3.7293101957842048,"763":1.7889084388207228,"764":-0.9308949207409197,"765":-2.15702752872065,"766":-0.12886222822653956,"767":0.2208611050730841,"768":-1.3131485582740423,"769":-2.4408687259585213,"770":-3.983236103640365,"771":-3.9885486407118202,"772":-2.7779474891115323,"773":-1.4957155249819458,"774":-3.2768150832607432,"775":-3.8434240855484894,"776":1.3046842755553498,"777":0.8294375126679981,"778":5.173892914466683,"779":6.1017663445142665,"780":11.379575493277747,"781":10.368058126798907,"782":9.160164815398225,"783":1.3417162220549552,"784":1.3332497807824315,"785":1.592260072417543,"786":0.02767212019878072,"787":-2.5570626834611594,"788":-0.24548185857604218,"789":-0.5959995687490313,"790":-2.2169522512358766,"791":0.620108147845826,"792":-0.8017607934466466,"793":-1.3439663826048565,"794":0.30992397685771467,"795":-0.010461776202311377,"796":2.68961323066643,"797":3.064144873468457,"798":-1.2971142403034488,"799":1.1313512286822989,"800":-1.3503598227843434,"801":2.992165888425649,"802":-0.42102731106304403,"803":-0.8698770276012173,"804":0.09282792865819504,"805":1.63366975462152,"806":-1.3456084628334533,"807":1.646653993297123,"808":0.44565602374783636,"809":-0.3022775791033362,"810":-0.5922456561604571,"811":2.8744325038206124,"812":1.2047464127082483,"813":0.9301830512039552,"814":-0.5334584420779732,"815":-2.421224743576865,"816":3.2501025714173997,"817":0.6997699414450649,"818":-1.2597097523803136,"819":0.6154463095544626,"820":-0.8571536554423697,"821":-0.5228412451355958,"822":-0.37986664585524704,"823":-0.6388916243359642,"824":-0.45212995064863454,"825":1.2494733775685203,"826":-0.5339730562902572,"827":1.0377507289057648,"828":0.3444665533554685,"829":0.730933652571204,"830":-0.49677806105511246,"831":1.2263133288346058,"832":1.3988778890115716,"833":-1.374830864275944,"834":-1.4258372408149922,"835":1.4209167955674993,"836":0.29554304967111283,"837":0.4171687539746483,"838":1.853369557952754,"839":2.3950866515658786,"840":-1.4297392041751391,"841":0.6090234280884098,"842":0.33193129024666196,"843":-1.4710270512615156,"844":2.9256641808952795,"845":0.3204356792105966,"846":0.38818717306042505,"847":0.3235675104434565,"848":0.18888811028300023,"849":-1.4012125098490482,"850":0.3061653335063295,"851":2.1628163716503686,"852":3.0584786947855385,"853":3.6530315954423864,"854":-0.7847557966017159,"855":-0.13227110704444003,"856":-1.6582129542793074,"857":1.0884638566252993,"858":1.6279163839328001,"859":1.605579760459188,"860":-9.719921859197168,"861":-12.88809675742689,"862":-15.771439780320547,"863":-7.500361861754502,"864":-3.3559620724141976,"865":0.26359219097231745,"866":-0.1293951911072436,"867":1.2983586182235591,"868":0.29251926878477386,"869":0.1373213232503499,"870":3.4533682355848607,"871":2.5318803359230597,"872":0.4481646605000176,"873":2.293159222725239,"874":0.17521891892511285,"875":-1.99490033117794,"876":2.0080314378838926,"877":0.0036388402838826214,"878":-0.1441040580076562,"879":1.009997780125862,"880":-0.40493839277655996,"881":-1.6398181772297344,"882":2.147027666578424,"883":-1.0377306047776134,"884":-1.457380147753563,"885":-1.9874533912600285,"886":-5.553343152783445,"887":2.0205968116126174,"888":1.104304961413899,"889":0.5427518002051074,"890":-0.03423427648441786,"891":-1.4411635770192261,"892":0.857556669823603,"893":2.6218546975388635,"894":-0.7104302723189794,"895":-0.23289135524664994,"896":-0.25128493186120604,"897":0.2919359442985713,"898":-1.6757818206507709,"899":-0.7523638824382355,"900":0.7687605042325205,"901":-0.9708994188831671,"902":0.2826636551329642,"903":-1.5478552382204893,"904":-1.9455753329357128,"905":1.1622713830987326,"906":-3.793281253523308,"907":-0.20807507908631026,"908":4.08709345294399,"909":2.369449207231055,"910":-1.2536633564038389,"911":-0.2633124416006287,"912":-2.8851183385524903,"913":1.0502361131611313,"914":-1.1931865182680337,"915":2.520663944598965,"916":0.1226450908697697,"917":1.1708344440492782,"918":-1.7361780290763626,"919":4.087815925730634,"920":1.6703243913510715,"921":2.574172432885547,"922":-0.937617040293652,"923":-1.8209451096690927,"924":-2.1600811469504464,"925":-0.9379327347527431,"926":-1.4292348378694688,"927":-2.3616621203189143,"928":1.5401982914006118,"929":-2.1051814794122405,"930":0.33293356819716036,"931":-0.428628532578515,"932":0.5333222974500935,"933":-5.001595925604623,"934":-2.9484922305646974,"935":-1.9602744517516095,"936":-1.3058006491214451,"937":0.35892660383909947,"938":3.379780176743332,"939":-2.3717132349244086,"940":-2.698628093170482,"941":3.6668849047542027,"942":1.751911590622288,"943":-3.361046850897971,"944":0.3025901962781236,"945":-0.8207191060961306,"946":2.743008365144793,"947":1.1776938863467106,"948":0.05856877647839197,"949":0.1748015141950953,"950":-3.1373611810578086,"951":-4.367381904679942,"952":-5.063257326668472,"953":0.3768023019938851,"954":1.4179680634127778,"955":0.7223875244645865,"956":2.647384528216478,"957":-0.2564210905787203,"958":0.47032624632445225,"959":-1.402124659156847,"960":-3.1547021719900554,"961":-2.677506202670839,"962":0.44525609902241836,"963":0.2615836487681642,"964":3.624043903525288,"965":1.4675712633220646,"966":2.898400049055087,"967":2.720875842110482,"968":2.5063722830973987,"969":-1.5692611424789773,"970":-0.7942601404611616,"971":1.7726885736075124,"972":3.14429899928411,"973":-2.9555833289771067,"974":-0.22971717803813932,"975":0.2356581213718161,"976":1.9159882959360193,"977":-1.3170041711836482,"978":-1.2998107730140502,"979":-2.5417518187847006,"980":0.30709670263801675,"981":-2.414517582624853,"982":0.7771945094194662,"983":2.2241342575718948,"984":0.32566804684344447,"985":-0.038450575997829174,"986":0.5996738451881996,"987":0.3209292406273501,"988":0.3968945451971371,"989":-1.2744366698346266,"990":0.4819399008719126,"991":0.22463197307917235,"992":-0.6472646475034912,"993":0.7834277522248058,"994":-1.1405869007059426,"995":0.07757548394369658,"996":-0.30810065820156196,"997":-0.20260507963132554,"998":0.2544325350557624,"999":0.05771579429170535,"1000":-0.37639071906403376,"1001":0.3606758776343282,"1002":0.01716393589987051,"1003":0.877413702415829,"1004":0.09628765598398022,"1005":0.25629162456432153,"1006":1.0829148338631087,"1007":0.3963375693812997,"1008":1.0339548907241278,"1009":-0.5275628793863408,"1010":-0.12853727787498923,"1011":0.13819602003936224,"1012":-1.4879975925775617,"1013":-0.6437641845610971,"1014":1.5191729308368633,"1015":1.0375989991930281,"1016":1.1600795383347213,"1017":1.7068778373650735,"1018":-0.657749799344414,"1019":0.5448047792199073,"1020":-0.6212893342439,"1021":-0.6566903092861818,"1022":-1.0527658326728229,"1023":2.929248622053816,"1024":16.95218016253809,"1025":2.3634874362727287,"1026":0.9742476617790062,"1027":0.33934127793659435,"1028":-0.5461022800441947,"1029":0.6200538673512641,"1030":-0.06003503660456855,"1031":0.17547651669636938,"1032":-16.79309174058279,"1033":-11.959161875385625,"1034":-8.298654135093662,"1035":-0.859759120327648,"1036":-0.9176156607362996,"1037":-0.30041454149295876,"1038":-0.3719331243517026,"1039":0.5257674774047986,"1040":0.174010621542842,"1041":-0.05378099879812443,"1042":-1.8944274582014515,"1043":-1.1100023829875711,"1044":0.26411999038440653,"1045":-0.9718681083005444,"1046":-0.5985990632690886,"1047":1.1825308006726871,"1048":-1.1309157740344176,"1049":0.3058075753819433,"1050":0.27947226527568264,"1051":0.07727641512776112,"1052":-1.1094559174913674,"1053":0.8983168034390638,"1054":0.8950281117735626,"1055":-0.37094904541189905,"1056":-0.09942251959139833,"1057":-0.37480530099398646,"1058":-0.037934938717254264,"1059":0.7725034013092041,"1060":-0.7257413344114004,"1061":-0.700587341159139,"1062":0.4669220886793923,"1063":-0.2172473225618569,"1064":-0.8669376549457787,"1065":-0.5076107499530258,"1066":-0.6187710977094574,"1067":-1.4001538335041528,"1068":-0.9505996648939791,"1069":3.014646819722147,"1070":0.9458899151264137,"1071":1.0551633044924036,"1072":-1.850888634859012,"1073":-1.2583555483280682,"1074":-3.534529906860824,"1075":1.1420093246115721,"1076":-1.23883802212537,"1077":1.1368871527123305,"1078":0.7974984913403684,"1079":-0.5736873526753297,"1080":-0.8528901640625803,"1081":1.0134700749151682,"1082":-0.5065247666126682,"1083":-0.9528203367834963,"1084":-0.551706182187065,"1085":0.6869799424070435,"1086":0.5377011076325013,"1087":0.3082905545808981,"1088":2.3696761793809147,"1089":-0.6509087987453561,"1090":-2.020457311667222,"1091":2.0031485560683535,"1092":2.9589705957859564,"1093":0.2473221352765653,"1094":2.0859992082379453,"1095":0.28036162892347466,"1096":0.14682934797894623,"1097":-0.725667110244717,"1098":-3.0828935261283186,"1099":-1.0336012409645439,"1100":-2.6453870465113147,"1101":-2.636130245262415,"1102":-0.9469338415248614,"1103":0.7484189206273235,"1104":-2.067913273402467,"1105":-0.6460984340897381,"1106":11.06646101366901,"1107":10.954055629958027,"1108":11.675562570346585,"1109":11.881749843205958,"1110":9.892387872593286,"1111":-0.4112000118778787,"1112":0.38328584338975247,"1113":0.5897443099798395,"1114":-0.6433952716943274,"1115":-1.0319469694672958,"1116":-1.9691070512812618,"1117":-4.677691221734426,"1118":-3.925180231207279,"1119":-2.378193741147241,"1120":0.34965065395458983,"1121":1.0500388600493546,"1122":0.6503831069909144,"1123":0.33897450790200995,"1124":-2.7027970925688134,"1125":-1.564550918651714,"1126":0.943665169546861,"1127":1.2866738435896838,"1128":3.0597003873332405,"1129":0.5655363064285672,"1130":1.4589476754823631,"1131":1.60280311993294,"1132":0.6911639005392569,"1133":0.3575522349688048,"1134":1.7877502091864106,"1135":0.28315393982454734,"1136":-1.1422458248758647,"1137":-0.15842963095884383,"1138":-0.4431044940983824,"1139":-0.9333068194311278,"1140":0.7429250994022016,"1141":1.5262749841355405,"1142":-0.5161405025749467,"1143":1.1007867592282086,"1144":1.7217665708063337,"1145":0.15086264735549573,"1146":-3.0556267316178323,"1147":0.24463349051482183,"1148":1.810420257977933,"1149":-0.11325023641136484,"1150":-1.2215322801681496,"1151":0.6049114460673485,"1152":-0.6693056486456016,"1153":-0.04732695385154591,"1154":-1.4481208140612623,"1155":-0.7177542462186529,"1156":4.104969585854442,"1157":-0.41386961063402206,"1158":-0.7202423484695575,"1159":0.21255844151255734,"1160":2.5208034982475684,"1161":-2.9149969020536144,"1162":1.6817452291718085,"1163":1.811295437569068,"1164":0.19908400619498443,"1165":1.0056192541649758,"1166":2.143583485988362,"1167":1.0838266884020116,"1168":-0.4241790659729072,"1169":-1.3259501668757534,"1170":-3.112381449817042,"1171":-0.8742217199811908,"1172":-3.79136399576115,"1173":0.5729747547041589,"1174":-1.1722356973802512,"1175":-0.955119871155464,"1176":-3.4648740927331203,"1177":-0.15738880774460498,"1178":-1.7825649257690033,"1179":-0.2893992388643256,"1180":-0.7386774249648832,"1181":-2.1605684651224077,"1182":-1.136059865913784,"1183":-2.612920442187962,"1184":-1.5570975031498964,"1185":-2.9695504136373567,"1186":0.4199545706804167,"1187":0.11478816571592176,"1188":-4.95958173981558,"1189":-4.205251486430829,"1190":-2.9761417162410404,"1191":-3.466933664625972,"1192":-0.28905409620109207,"1193":-2.929459848593612,"1194":-5.008546935414623,"1195":5.630651626162274,"1196":7.880583818377183,"1197":6.897189067786553,"1198":3.453006433199506,"1199":-1.3456621877259094,"1200":5.78710999440273,"1201":2.5617505520622466,"1202":2.890099000692778,"1203":0.03266555683057858,"1204":-1.4411868950430728,"1205":-1.2436701796346936,"1206":-4.41121514352227,"1207":-3.556259775493938,"1208":0.413211780576596,"1209":-3.87701339763651,"1210":0.24551158769090983,"1211":-3.2217069452910434,"1212":0.6544525140494878,"1213":0.3390491511345844,"1214":-0.6829223432458995,"1215":-0.0863021519772021,"1216":-1.3852295362853113,"1217":0.7243527713372552,"1218":1.675991438497547,"1219":2.578698629157136,"1220":-2.3053479965822397,"1221":-1.5846983171371534,"1222":0.1435668367387105,"1223":2.1455903326162984,"1224":1.968483469100823,"1225":0.6380397303898736,"1226":1.7583441249567262,"1227":2.458130759773803,"1228":2.451639080888121,"1229":-2.107409341394863,"1230":-1.334032725088843,"1231":-1.855420710949607,"1232":-2.3180534149525727,"1233":-1.6204613384785194,"1234":1.6024929788272846,"1235":1.3883310011129322,"1236":-4.882326336702764,"1237":0.7754387627375746,"1238":0.8192610369076504,"1239":-1.0320392984420514,"1240":1.437597209357235,"1241":-1.416118182010234,"1242":1.0045750598410403,"1243":0.16814496699457745,"1244":1.874969595709905,"1245":-0.795970560554579,"1246":1.0480225819730085,"1247":2.5613067245141106,"1248":0.5910509204717224,"1249":-1.804807251216737,"1250":2.204653568053129,"1251":2.099944515786585,"1252":3.615830669981774,"1253":1.7947514283233388,"1254":0.1984620172479172,"1255":-2.78996068731576,"1256":-3.2210950999725063,"1257":-0.3986619974223597,"1258":1.8919421677112451,"1259":0.8384821428974404,"1260":8.061866455226552,"1261":7.222767922805415,"1262":5.542961836200564,"1263":0.35726313097549267,"1264":-0.7252087135619726,"1265":0.07494615142852189,"1266":0.4981182107516801,"1267":3.241640745844175,"1268":0.05976337492228946,"1269":-3.8705328159395203,"1270":-0.5373056643591825,"1271":-1.1552535391028578,"1272":0.5462259285987712,"1273":4.466859867730714,"1274":0.5532321427621357,"1275":-1.0941904338048707,"1276":-0.8174606759309463,"1277":-2.6788829915180545,"1278":0.10220648806277034,"1279":3.7870817216365116,"1280":1.2162357169489184,"1281":-1.4357926366712261,"1282":1.3533149863933414,"1283":-2.918761862527926,"1284":3.8603850110517617,"1285":3.8072069015443644,"1286":0.8129132213276798,"1287":-1.8771409116263411,"1288":-3.198814875040342,"1289":-1.7396008189259746,"1290":0.8166891171566317,"1291":-2.295969359246303,"1292":-2.822406474335934,"1293":4.404582957349365,"1294":-1.2343506188894264,"1295":3.8174109915624,"1296":3.748169743148111,"1297":2.3004148302741245,"1298":-2.3335738070878205,"1299":-3.8020645636763026,"1300":-4.760621742786693,"1301":-0.9952101399077155,"1302":0.049737588121640294,"1303":2.112098973181087,"1304":1.9024004429016428,"1305":-1.288149137338748,"1306":2.3537614540689527,"1307":-4.120844974790581,"1308":2.2238362733012815,"1309":-0.5265822736372657,"1310":0.5068630661581938,"1311":-0.6661227004722755,"1312":1.6427967580982235,"1313":-1.5001137115303924,"1314":0.8439259483288275,"1315":-1.5317393484223745,"1316":2.790032755893473,"1317":-2.030788170401536,"1318":0.7327938017194205,"1319":3.2127986147899965,"1320":2.882729481116245,"1321":-0.9552352305990438,"1322":0.04165529485876451,"1323":0.7422515921235797,"1324":-2.3986631755961136,"1325":0.7766761185599038,"1326":2.017777638766476,"1327":1.9518750047465083,"1328":0.7644866277939668,"1329":-2.7888353068615004,"1330":-0.40846173228022076,"1331":-3.3216177686018344,"1332":1.4593432286689239,"1333":1.0715932282147222,"1334":2.281304927983971,"1335":-0.4995815360725533,"1336":1.212692400873366,"1337":1.4262603449275113,"1338":-1.1703555327038409,"1339":-0.3344815963242524,"1340":-1.4517797863588553,"1341":2.606709381638463,"1342":3.921841287157661,"1343":-2.1180346873227416,"1344":-5.068776702948213,"1345":-2.659312788778636,"1346":-7.1991426631404005,"1347":1.065825380212118,"1348":-1.8472019537204933,"1349":1.3695830117920238,"1350":1.4834778995067006,"1351":10.560891458817567,"1352":5.332963864661525,"1353":-1.2828341823846177,"1354":2.288494882597643,"1355":-0.3153842067243342,"1356":1.1689221984868137,"1357":-3.358662125465418,"1358":-0.2604520018458195,"1359":0.7828312007061439,"1360":0.7746562968516847,"1361":3.8483684031798684,"1362":-0.4969566875781457,"1363":-6.033787084720325,"1364":0.36468493534420376,"1365":3.698105277545465,"1366":-0.15113522949290445,"1367":-1.2221876846896467,"1368":-1.9455493814679015,"1369":1.5465958876004524,"1370":0.6930759103861752,"1371":2.0795415793935144,"1372":0.7887803814301397,"1373":-1.2028910645556539,"1374":1.0404205650748686,"1375":-2.4552802358433596,"1376":-0.09083934934361847,"1377":3.966597609032623,"1378":0.3428908861024105,"1379":-2.7961253478183155,"1380":1.0545236513062082,"1381":1.2814750717328636,"1382":4.63652946547546,"1383":1.7845913089138812,"1384":-1.3374648836882228,"1385":1.4038684364245262,"1386":-1.86209928519569,"1387":1.3281255739313906,"1388":1.6706988718143123,"1389":-2.7846911449957896,"1390":3.3607352297739834,"1391":-1.8027549370131948,"1392":-0.672370647288447,"1393":0.22192255035039907,"1394":-3.9891570245446526,"1395":-2.845477372127618,"1396":3.9981344237295793,"1397":0.18711114065994144,"1398":-1.4187593016215119,"1399":-1.8064759515094815,"1400":-1.4732854822231483,"1401":2.8505645031381053,"1402":3.36551030204355,"1403":-2.2681308338132347,"1404":-0.4351772651470988,"1405":3.8507656282621174,"1406":1.905882961000249,"1407":-0.4840484702295865,"1408":-3.787997093857156,"1409":-1.025874643621308,"1410":-0.3379621188454642,"1411":-0.09332942552939948,"1412":3.47652158495634,"1413":-3.416409335170001,"1414":-0.9318745061196334,"1415":0.43750070793359536,"1416":1.4396927933376202,"1417":-0.32330301048440496,"1418":0.8358531299198317,"1419":-2.9193686203335534,"1420":-1.3808419163942167,"1421":-0.16129170037236093,"1422":0.903318575290471,"1423":2.882213504888416,"1424":1.9197687439417603,"1425":-4.326300242744915,"1426":0.9393526932663758,"1427":1.7714567758188589,"1428":1.0234773926485365,"1429":-0.3113153726138684,"1430":-1.6726871741578078,"1431":0.46440564541836277,"1432":0.8038642165106136,"1433":-8.069519973757242,"1434":-2.340442124119645,"1435":0.13365205488429882,"1436":-1.254648673422333,"1437":1.2754402833118348,"1438":2.881429066645301,"1439":3.4031355499392584,"1440":4.107583937125403,"1441":-0.9525616325367943,"1442":1.756295394920647,"1443":8.637865495032177,"1444":3.2392574747010023,"1445":1.0936732628609647,"1446":-3.8909910303703934,"1447":0.5016431776462219,"1448":-2.9023311170514385,"1449":0.4567620198196049,"1450":-1.3921223953305388,"1451":8.724425711840539,"1452":3.9535024893657242,"1453":-0.7205669842033539,"1454":0.786487913103248,"1455":1.0735883788255025,"1456":-0.31191832148277837,"1457":-1.4393268658964857,"1458":-2.0455475844544533,"1459":-3.634081868619317,"1460":0.9707272299115043,"1461":2.8843450095166823,"1462":0.5808405778934561,"1463":0.7250249095976424,"1464":-0.7295164313220855,"1465":-0.14462153371214478,"1466":-0.12241365323633226,"1467":1.1068279979966076,"1468":-3.3104402926601986,"1469":-2.5956597044829115,"1470":-2.872021364519266,"1471":-0.2948192644440389,"1472":0.5850035107646976,"1473":-0.5785925699868751,"1474":1.0724361831646345,"1475":1.065276880379038,"1476":-2.6581361616218775,"1477":-1.7483732406318544,"1478":-1.9027608812851018,"1479":1.9140086160177499,"1480":0.203204873827516,"1481":-5.027126632686818,"1482":0.6690498624232806,"1483":1.3188367151535692,"1484":-0.5209097046380476,"1485":-1.592245073688244,"1486":-0.1774944185493279,"1487":-3.9778919587113775,"1488":-3.2005541341950776,"1489":-1.5324165570639543,"1490":-1.101626374925863,"1491":0.5137520714002253,"1492":-1.0535516916655099,"1493":-1.8568615610568306,"1494":-2.7360038593573277,"1495":0.8024283565693988,"1496":1.9268321710276288,"1497":-3.775380650000781,"1498":-1.721175216988017,"1499":-3.451356980734076,"1500":-0.9875384487604196,"1501":-2.3191904067055003,"1502":0.3924787398203824,"1503":-0.5197280662161928,"1504":-2.10045527163434,"1505":-0.4238515514744293,"1506":-1.3589421434570048,"1507":0.21198340551008624,"1508":-1.7787696697567714,"1509":0.010141307454922963,"1510":-0.2979955441722864,"1511":0.2607871451550001,"1512":0.8787025506112842,"1513":-2.1671410911863647,"1514":2.495896027289373,"1515":-3.1970421893454684,"1516":2.230464269652953,"1517":3.0698214623144087,"1518":-1.6184662087238697,"1519":2.0234375268846816,"1520":-0.2519064968599231,"1521":-2.436909472785181,"1522":1.8229369906147224,"1523":-0.4009958765623037,"1524":3.831986952915538,"1525":4.465298184535652,"1526":1.4935064467466446,"1527":-0.681513751796989,"1528":-1.1657329769899571,"1529":-1.3142116287156613,"1530":1.1055834131312579,"1531":-0.47494344682907375,"1532":0.8092646361132873,"1533":1.8784759313406865,"1534":-0.660263867298458,"1535":-2.0497879367441807,"1536":-1.9586110291510292,"1537":1.4986978966790019,"1538":1.336090449504123,"1539":0.9139472457939383,"1540":-0.8750989263375196,"1541":-2.628436528508712,"1542":-1.0076962801503553,"1543":-0.9538621185750635,"1544":-2.538141857437249,"1545":-0.2751284481343146,"1546":-4.090431342858221,"1547":-5.27774367368231,"1548":0.23903656407955945,"1549":1.4224334255278768,"1550":0.9647389596109809,"1551":1.0329184446889352,"1552":-0.22412726768555472,"1553":2.440219596881564,"1554":-0.3435830444623519,"1555":-0.7012779320826358,"1556":-2.6663473383736633,"1557":-0.21081837228491823,"1558":-0.13609034438660217,"1559":-0.677667881591831,"1560":-0.3715221297531514,"1561":-0.83430590375977,"1562":-0.6047502301748412,"1563":1.7271358992841588,"1564":1.6566575695806074,"1565":1.082694634286128,"1566":4.750079316309954,"1567":1.182307707974394,"1568":-0.31352586816670486,"1569":3.3951130680812405,"1570":-0.2719749451961657,"1571":0.26495229880419846,"1572":0.4807513054984332,"1573":6.055889115201082,"1574":-0.3596589291541401,"1575":-0.24775392282667533,"1576":0.77929553901738,"1577":3.81504417694967,"1578":-0.18759571439011838,"1579":-2.1921222566974152,"1580":-3.3819663897827725,"1581":-1.3754758207176319,"1582":2.0479291107331776,"1583":1.4244169176223092,"1584":1.9762250441681346,"1585":-0.27745131287270575,"1586":-1.0351770110949938,"1587":0.5619388866248887,"1588":-0.2720763650191827,"1589":0.7072553216445723,"1590":1.5385775105458914,"1591":3.0960889928638644,"1592":1.6652236447127098,"1593":3.54952638557146,"1594":0.1612730313093842,"1595":0.3709164199261328,"1596":1.6705963883633854,"1597":-4.332619001229628,"1598":-4.564838297546854,"1599":2.3391581023725174,"1600":-1.6963536169048512,"1601":1.8595353589699566,"1602":0.5579681631775526,"1603":1.596272846282122,"1604":3.445954104793142,"1605":-1.3893126282670865,"1606":-2.7222154845933493,"1607":0.1565320102887986,"1608":-2.008657794687856,"1609":0.8380021379197078,"1610":4.134621997278781,"1611":0.8438714816678988,"1612":-0.6713550763434716,"1613":-3.4554676591537974,"1614":-3.285610202303451,"1615":3.362427961718058,"1616":-1.9044484432738822,"1617":2.1362937418823007,"1618":2.0497174158946114,"1619":3.0699825366935465,"1620":1.5818094566129925,"1621":-1.7932913187254622,"1622":0.9952649089217673,"1623":0.1015050009631039,"1624":5.726990857323532,"1625":-2.2576361842384554,"1626":1.3504358643478576,"1627":-0.3514716857039602,"1628":-0.8771601575949332,"1629":-0.6758349328916539,"1630":-2.338269572583886,"1631":0.19890223776522378,"1632":-1.5063956445997626,"1633":0.38282639602699825,"1634":1.7288219987370517,"1635":-0.3498223978141167,"1636":1.327460778320838,"1637":2.518010534868006,"1638":-1.097517076663982,"1639":-0.2380892419472813,"1640":-2.2217904844787335,"1641":0.4160229538722975,"1642":-0.49899986154065307,"1643":-0.43992675522854,"1644":2.0559000191862595,"1645":-1.3997787568563012,"1646":-0.361675534121342,"1647":0.23499145114508277,"1648":-0.4518350050388192,"1649":-1.4688734570882735,"1650":0.09215778890434248,"1651":-0.8456528978127881,"1652":-0.1556882039298438,"1653":-0.7748110924041284,"1654":-0.33301807785975984,"1655":-2.2171982018601173,"1656":-0.3439672004112393,"1657":0.27993023723767896,"1658":1.3632556417074138,"1659":-0.2962489615460038,"1660":-1.4083642913975525,"1661":-0.2204111369095604,"1662":-1.8012708231329007,"1663":1.6537216549417328,"1664":-0.4607282250945086,"1665":-2.6399170297372505,"1666":0.9283731005005474,"1667":0.9527495684886602,"1668":-0.050426354363467506,"1669":1.3002521749265405,"1670":1.3699032797010788,"1671":1.7760773458810801,"1672":0.08298784801185947,"1673":-0.05081093875851004,"1674":1.0898948859386997,"1675":0.6367929462329217,"1676":-3.7541569445002416,"1677":-0.2723269613458276,"1678":0.07796000808504937,"1679":-3.5056083159010925,"1680":1.467939468214398,"1681":0.9709294638736007,"1682":2.6432320075786544,"1683":-0.9994405587643352,"1684":-1.0042925602538266,"1685":-1.5481188029997521,"1686":1.7378933177323792,"1687":1.2187085360397352,"1688":-1.4477437003464173,"1689":-0.8183509423249802,"1690":0.1270258130022905,"1691":2.1398981270758495,"1692":-1.8701187720245993,"1693":-2.301075437980947,"1694":-1.9795015847288615,"1695":1.190424353238157,"1696":-1.037957615538886,"1697":-2.455230857874164,"1698":-3.824098268524244,"1699":-2.3195478635359037,"1700":-2.2425335835900904,"1701":-1.4709205656112492,"1702":-1.0367587438356949,"1703":-0.6131472017697943,"1704":-1.4843181490765696,"1705":0.6807400772774589,"1706":-1.2227991801550808,"1707":-3.1124522578612717,"1708":-2.472726562571128,"1709":-2.3331196971316976,"1710":-0.31260130400174413,"1711":-0.24731057148396898,"1712":-0.22920591857304656,"1713":-0.8422874234137121,"1714":-0.16974529029312033,"1715":-2.7623821727513866,"1716":-2.771956612655097,"1717":-0.5031776655492597,"1718":-0.11665418113820955,"1719":-1.5469945494197683,"1720":-1.8564346430280176,"1721":0.47744886961517147,"1722":2.230574695495514,"1723":-2.9468500096072794,"1724":-5.967610837318713,"1725":-1.0830041731692386,"1726":-2.483289548613934,"1727":-0.1658802995913433,"1728":1.1483200360488741,"1729":1.3350072645925875,"1730":-2.2889338026227937,"1731":-0.455411073735536,"1732":0.989473555479663,"1733":-1.656947271462317,"1734":1.73429683546328,"1735":1.8207211185440977,"1736":2.458048718359123,"1737":0.5845003827837301,"1738":-0.26269576910177406,"1739":-0.771789544076672,"1740":5.324563293387185,"1741":1.693224998875635,"1742":-0.11072271392315672,"1743":-3.82756648990551,"1744":-3.8790710819017797,"1745":-0.5070116449544192,"1746":-0.8059708063166053,"1747":-0.18167868418545907,"1748":-4.6493014821467,"1749":-0.6393635435785668,"1750":-2.026290253948212,"1751":0.5916449150780522,"1752":-2.4898492386361184,"1753":0.33325380536799065,"1754":0.8413931753855688,"1755":-1.136662611992467,"1756":0.8407077828891796,"1757":-3.7930610763890336,"1758":-2.774605593240004,"1759":-1.7048934945137204,"1760":1.259531624880122,"1761":0.6487814054981864,"1762":-2.285986686835251,"1763":-0.5770803841840961,"1764":1.4135782663289531,"1765":-1.0862620173875919,"1766":-0.0910318789389896,"1767":-2.460059522708476,"1768":1.5280594071126412,"1769":6.5294247499259015,"1770":0.16214630661485002,"1771":4.382337381531791,"1772":-0.5805477745355464,"1773":-3.0396135809378664,"1774":-4.134505652963511,"1775":0.7833662781028955,"1776":1.5061321860776216,"1777":3.437926716382064,"1778":0.7534050389804626,"1779":0.547057150857167,"1780":-2.772512536365022,"1781":2.376652865425042,"1782":0.6633192914769492,"1783":-4.425363013101574,"1784":-1.090655819514068,"1785":-5.189894499123652,"1786":-0.03473722148325206,"1787":2.5295175264157885,"1788":-0.36022002947620213,"1789":1.3829476462939765,"1790":1.267068619904171,"1791":1.4843308830801343,"1792":1.3834061403861195,"1793":3.176312538848753,"1794":0.2078516031981727,"1795":3.553157754525648,"1796":-4.402343232375898,"1797":-0.19484806257795279,"1798":-1.7388803994320357,"1799":-0.8851569930574922,"1800":-1.8725912525570572,"1801":-1.9585414951018143,"1802":1.5958056497195003,"1803":-1.1514356892280793,"1804":-1.8490748284222556,"1805":-0.9566645293871647,"1806":2.095874799655843,"1807":3.3357095283568183,"1808":-1.7809708200179468,"1809":0.4624085713945367,"1810":-2.4592830027163535,"1811":0.45947271374439314,"1812":0.7233061753416224,"1813":2.143437809111719,"1814":0.11951290934556645,"1815":1.313083208895774,"1816":2.4609039960307064,"1817":3.223843204046004,"1818":-1.0959512227189325,"1819":0.10808235252284067,"1820":1.9651014242984857,"1821":1.4941770267590322,"1822":3.8460491477678485,"1823":0.48750898376610774,"1824":-0.8211795529343259,"1825":-0.003757665215659381,"1826":2.889698803248869,"1827":0.5473589200408144,"1828":3.580215560847626,"1829":1.8574666217601916,"1830":-3.9749490827646468,"1831":1.447582460661429,"1832":-0.7970832631020206,"1833":-1.3062314406096793,"1834":2.8838766192745777,"1835":2.542828751103802,"1836":1.1678970538125704,"1837":1.3657880237101416,"1838":2.1767042594996266,"1839":1.067007952745603,"1840":1.350990697770598,"1841":2.239337804850709,"1842":-2.1229597618087537,"1843":-3.1212214645156076,"1844":1.9367520994188705,"1845":0.9974860047631308,"1846":-2.0783715788721895,"1847":0.7727753117204795,"1848":4.448654050901086,"1849":-1.8855391020681485,"1850":-2.967753794850763,"1851":-2.54526765082184,"1852":-10.42648715252232,"1853":-3.6201517371843104,"1854":1.1971427435253972,"1855":1.0391483715975904,"1856":0.1030266656344205,"1857":1.7071514995227137,"1858":0.1170289110148497,"1859":1.2375591661349254,"1860":-2.6882749211369212,"1861":-1.8934761795398976,"1862":-0.8611612661562495,"1863":-3.931164928554232,"1864":-1.9581388092725036,"1865":-3.5502901417298474,"1866":-0.7171592808252283,"1867":0.11863406082117747,"1868":-0.35460709574425425,"1869":3.016104827461238,"1870":3.4436373460404783,"1871":4.077684418436358,"1872":2.2580469426119363,"1873":0.34729762864631947,"1874":1.2936399432204222,"1875":0.881195864917825,"1876":-0.4286789200777841,"1877":-0.20097973078012693,"1878":-2.7061760531398127,"1879":-1.4139282455870716,"1880":-1.3331274097662251,"1881":-0.12150811345584213,"1882":1.5021524178807453,"1883":-0.3247966698117754,"1884":3.6676512900836693,"1885":0.9392247717120653,"1886":0.4547349873072787,"1887":0.053832880100679284,"1888":0.2164641740925899,"1889":-0.16483233435778666,"1890":-0.4035763105770863,"1891":-1.109820350130971,"1892":-0.7465829776741231,"1893":1.3690763950874567,"1894":-0.03920680785779919,"1895":-1.6947201457005834,"1896":0.2773620409816262,"1897":-0.187580528972565,"1898":-0.10369606465107331,"1899":0.34560871326110926,"1900":-1.4038439606638986,"1901":-0.9397796159522949,"1902":0.9185932638340474,"1903":-1.2525992775171253,"1904":-0.5486446783975524,"1905":0.2865431562469828,"1906":-1.5999185661197048,"1907":0.5477503694934063,"1908":-0.40942836842903896,"1909":-1.3166094852398271,"1910":1.003293857619379,"1911":-0.5446135235188442,"1912":-1.3285713115837552,"1913":0.2852827776491632,"1914":0.23945701513547965,"1915":0.015353918997465507,"1916":1.7213670267607064,"1917":-3.212015928903696,"1918":-3.0544418251277685,"1919":-2.4520354507628626,"1920":-1.5665222409662403,"1921":-0.1671949535627035,"1922":-0.3001627722527358,"1923":-0.7445934011650023,"1924":-0.603114360521125,"1925":1.532177288644799,"1926":-2.2942157282691342,"1927":2.287094156143322,"1928":1.3166450221262869,"1929":2.432866677090822,"1930":-0.1603348393703447,"1931":-1.8643677277895583,"1932":-0.9812411804167088,"1933":-1.0321779942713287,"1934":1.746802648003747,"1935":-1.3339387695477598,"1936":1.232925990790413,"1937":-0.17099720887774023,"1938":0.48174160852743414,"1939":0.5149501806611565,"1940":-0.47023815614322656,"1941":-0.34702228560309667,"1942":0.40995312637000897,"1943":0.17286985229613253,"1944":0.6063422847912535,"1945":0.25068928685934594,"1946":-0.5305416597159248,"1947":-0.4293468191410785,"1948":-0.8513549982228155,"1949":0.26670540888006683,"1950":0.6603093865154568,"1951":-0.8291852820866354,"1952":1.4044769709640263,"1953":-1.5212822964151145,"1954":-1.8467431682784328,"1955":-1.9401058477817947,"1956":-0.03644485096440441,"1957":-1.6823195678239296,"1958":0.8730067823843042,"1959":-2.0746086800704955,"1960":-0.8152253944702118,"1961":-0.04232262686711533,"1962":-1.1825853645672455,"1963":-1.6464245134381785,"1964":1.3956004845123036,"1965":-0.7935009786419035,"1966":-1.2284201579548644,"1967":-1.728934560252202,"1968":-0.02597504652003423,"1969":2.568304420670088,"1970":4.07800348068047,"1971":2.957630458993032,"1972":1.9904081207999615,"1973":1.593331510769912,"1974":1.0415791046185803,"1975":1.596568813367797,"1976":0.8707712176756848,"1977":1.9769379788349326,"1978":0.15992314859569667,"1979":2.998377966389172,"1980":3.761385481030463,"1981":0.9818483985364078,"1982":0.15155039452441857,"1983":0.9887391669623223,"1984":-1.2556406092097183,"1985":0.9024866768652907,"1986":-0.043038362203291006,"1987":3.0900392155203518,"1988":-1.6184037686229094,"1989":2.0504256611214147,"1990":3.1605634947978585,"1991":0.4903584662010712,"1992":0.9724530718290474,"1993":1.3826658950824515,"1994":-1.6790772151018165,"1995":1.0757099248441881,"1996":2.1338531269345253,"1997":-1.3162052125068637,"1998":3.137967460933347,"1999":0.864849985285558,"2000":0.4063111017359139,"2001":0.1882815187121749,"2002":-0.45792267968082684,"2003":3.103032593430052,"2004":0.30631315678744186,"2005":1.3115003611260159,"2006":3.0464461615635035,"2007":4.716640106693317,"2008":3.3506751423434284,"2009":2.8399477572813145,"2010":3.268396765024655,"2011":1.1348761331289487,"2012":0.0633271649120661,"2013":0.4303344869495518,"2014":-0.041318977998918725,"2015":-1.7084918661788708,"2016":1.6903354211501427,"2017":2.133567200144848,"2018":0.2849995563958407,"2019":1.0996640670645086,"2020":0.5146809439482013,"2021":1.182276657909875,"2022":-0.3975593259164012,"2023":1.9415715232636688,"2024":2.927582461017556,"2025":3.70827895149226,"2026":0.23462493350382896,"2027":0.6945066760229504,"2028":0.6580517175986349,"2029":1.0673606028801021,"2030":-0.2811560308926867,"2031":-1.9402085046020425,"2032":-2.102923763089688,"2033":1.0288084632017587,"2034":4.240243400595361,"2035":1.1997887888393137,"2036":0.40854462158424787,"2037":1.0159159566117235,"2038":-0.3149543184747262,"2039":0.6116380441203654,"2040":3.168886862738958,"2041":1.0582526308141038,"2042":-4.128238780010779,"2043":3.6749828470442827,"2044":2.4009099435824783,"2045":0.37807813960335857,"2046":0.333677538036921,"2047":2.053139147213057,"2048":0.2636171086053761,"2049":-0.10431345902643396,"2050":0.36047428922705177,"2051":-5.491996178787379,"2052":-0.3958519911854806,"2053":2.2437527940339796,"2054":0.2774997033176796,"2055":0.9852788698099291,"2056":3.2622663046867992,"2057":-2.114362394626931,"2058":-1.2519157739572235,"2059":-0.21596946843429138,"2060":0.6597140704769752,"2061":-1.3455984836819495,"2062":1.816503152631777,"2063":-2.5081330748320383,"2064":-0.43725993070765784,"2065":5.087467624159104,"2066":0.696721480385616,"2067":-1.0372441597942135,"2068":1.303534898036153,"2069":1.9556281581075334,"2070":0.41168415349212156,"2071":2.1501312885176294,"2072":2.720577923731993,"2073":-2.7556452479798828,"2074":3.3178697309630576,"2075":-0.20885284107802765,"2076":-0.4189725347332088,"2077":-1.4014237564980931,"2078":-2.2416133516256718,"2079":4.0439661834297995,"2080":-0.04203280819689531,"2081":-4.563856088057035,"2082":0.26962155581284236,"2083":0.746200881619393,"2084":-3.772335073042136,"2085":5.512917476990563,"2086":-0.9115265335887077,"2087":-0.3605560850539358,"2088":-1.6385686465018714,"2089":-4.484095629027291,"2090":2.4066256494472205,"2091":6.570552287496831,"2092":2.59528602351883,"2093":2.416359456485499,"2094":-0.9189130501788797,"2095":-0.6243100120124673,"2096":0.8331857264534887,"2097":1.3213947260409094,"2098":-1.3878470682861763,"2099":-4.648442852866931,"2100":-3.1646432563405775,"2101":1.5312785231126,"2102":5.207767227638427,"2103":1.4739295655036255,"2104":-1.4622270127484778,"2105":2.5752311596628723,"2106":1.115104341935097,"2107":-0.9843913729673975,"2108":-0.32407606748255485,"2109":1.6881498672398454,"2110":-3.441755801436321,"2111":-1.1963709667340403,"2112":-3.2605962638723454,"2113":-2.125647918294181,"2114":-0.8700366464953107,"2115":-3.3398062274649583,"2116":-0.8912105258661436,"2117":1.536123482773891,"2118":-4.543723509300295,"2119":-1.8424588466420817,"2120":0.2890372619817002,"2121":2.7846420739113764,"2122":2.026625313747638,"2123":1.2610026992415557,"2124":1.16247333990703,"2125":0.670949010823528,"2126":-0.5648435089932093,"2127":-4.460865612181557,"2128":0.9422882679327484,"2129":3.8409019353169707,"2130":-0.5270753486647266,"2131":-1.3479848925546627,"2132":0.308457383410486,"2133":0.739273362073035,"2134":-1.849120748718119,"2135":-0.21492339702899546,"2136":1.0710990756840988,"2137":-3.4628789083134013,"2138":-0.48858845461640826,"2139":-0.14223665289814247,"2140":-0.9536594749568734,"2141":1.399445324913687,"2142":-2.2316561809883195,"2143":-1.853960529953903,"2144":-0.15527557345003443,"2145":0.5098589837785182,"2146":1.365872238599603,"2147":-0.45169164397892353,"2148":3.338076211884313,"2149":-0.7689729524384862,"2150":1.6125012738350235,"2151":-1.2561682778345722,"2152":2.21976981708186,"2153":-3.064233973034551,"2154":-4.790933741259133,"2155":-1.4139021131205627,"2156":0.29882513141222544,"2157":1.7906061015295607,"2158":0.6980591515851711,"2159":-2.15805732141814,"2160":0.30249276941908443,"2161":-3.9496387667490596,"2162":0.12705549307015204,"2163":6.295623046356171,"2164":8.665959955778062,"2165":5.075519297722413,"2166":1.678849384824633,"2167":-0.8731139145369992,"2168":-2.3358405736451386,"2169":-1.1935462275429412,"2170":1.224341095151799,"2171":3.547744914721032,"2172":7.680020867998391,"2173":10.946840526824975,"2174":5.4398087642685145,"2175":1.2513085408300013,"2176":-0.4502853247586786,"2177":2.4261820443373536,"2178":1.121744536449073,"2179":-0.2908504713983741,"2180":-2.281780959006056,"2181":-3.239510081469377,"2182":-3.3118768650739203,"2183":-0.5417183355159316,"2184":-0.21124729531452816,"2185":2.4315819793936364,"2186":0.6401437721547794,"2187":4.617983848807476,"2188":2.0261765437322374,"2189":-0.745151440281858,"2190":-1.2686975864270182,"2191":-0.5436293524071597,"2192":-0.928160891714578,"2193":-2.729252804886821,"2194":-1.5798780922567799,"2195":-1.70943790439974,"2196":-0.441274981747607,"2197":-0.13437494884568704,"2198":0.4150717783022348,"2199":0.5367075261344575,"2200":0.4332106129583467,"2201":-0.6297156262085954,"2202":2.169427160103219,"2203":-2.7620633943478956,"2204":2.5272438062112044,"2205":-0.637574579732397,"2206":-2.1834442198778237,"2207":-1.305856755099836,"2208":1.9994313412785603,"2209":-2.510172625510472,"2210":-4.131320038329293,"2211":2.029854522642482,"2212":-2.228366817163311,"2213":0.47976638186630893,"2214":1.4604459626119273,"2215":0.23030636816368427,"2216":2.1471459538336277,"2217":5.728378725290248,"2218":2.007826572781367,"2219":2.3430858897702875,"2220":3.013719354134979,"2221":1.7913483262956975,"2222":0.6710788718800986,"2223":0.8642142335458682,"2224":1.266542859837005,"2225":-1.0302994722034273,"2226":-2.7078520672082513,"2227":-2.2079716456881933,"2228":0.5298652658155482,"2229":-1.8874548744997128,"2230":0.7608396637679938,"2231":1.2412797012584382,"2232":2.5145718629569287,"2233":0.0771006316953329,"2234":-4.226087251778905,"2235":-0.04713490810328043,"2236":-0.4712162921021644,"2237":1.1593342832595521,"2238":3.4894337366433326,"2239":5.166607391015304,"2240":-0.8736063953364088,"2241":3.541076770414706,"2242":0.028851418915371168,"2243":-0.6195763862022432,"2244":-2.5409847693122196,"2245":0.565692171093841,"2246":0.2535404447011099,"2247":-1.9524495969809266,"2248":0.5644058350816679,"2249":2.294919527736208,"2250":-0.4218819014758198,"2251":-0.6388734849287252,"2252":0.8132791760894018,"2253":-0.8977357073459683,"2254":-2.40115317089071,"2255":-0.24453040238740267,"2256":1.4287024640310204,"2257":0.08330538675344683,"2258":3.141876693177894,"2259":1.1879173706351358,"2260":1.4419510774691413,"2261":1.7015966350738616,"2262":-0.3648080893798966,"2263":-1.576005758409447,"2264":1.0405862677679636,"2265":4.431702493375149,"2266":0.40397091153034653,"2267":4.681268676883875,"2268":-3.1972202446721187,"2269":-0.26744756859485597,"2270":-0.6723405162098479,"2271":-2.666187959648183,"2272":2.004687167561849,"2273":1.9607200145031722,"2274":2.8927671864911884,"2275":3.062721647711881,"2276":3.4011141793536233,"2277":2.373650818058334,"2278":1.8293403451411208,"2279":-1.1265374122117424,"2280":-1.4870334803301344,"2281":-2.6605273825924245,"2282":4.0017150981283205,"2283":0.11112195574800213,"2284":3.009142398105413,"2285":3.3012235739505895,"2286":-0.11107305527598081,"2287":-1.5651530276498453,"2288":-0.8852795798628433,"2289":1.2537668145309342,"2290":-4.312462354957609,"2291":2.0049832211409666,"2292":1.9903712258044228,"2293":2.352179439087536,"2294":1.0034683568362897,"2295":1.4276577725281498,"2296":2.253818094250233,"2297":-0.0553818737627172,"2298":0.2860682852509591,"2299":-0.19492000361003126,"2300":-0.42511430014380824,"2301":-0.5827356818432314,"2302":1.5038805177084589,"2303":-1.3456972179022362,"2304":-0.07706596220076183,"2305":0.5032225965403767,"2306":-0.06842855615878946,"2307":0.13640028163477166,"2308":0.2805537778236161,"2309":0.46149492310164464,"2310":-0.5073350392249097,"2311":-0.6749846787914585,"2312":-0.278045917584507,"2313":2.3291464684167558,"2314":0.7134532043520551,"2315":-0.9910932813605604,"2316":1.5517064546065467,"2317":0.2379428384619703,"2318":-0.16726039754067662,"2319":0.44948748483012013,"2320":0.059918802125864506,"2321":0.11660862918912368,"2322":0.662454215206763,"2323":0.9409369397100468,"2324":-0.21632107862082903,"2325":0.7278127436997585,"2326":-1.9608686889010711,"2327":-1.6348181319641344,"2328":2.1657137988168715,"2329":2.7939317483230304,"2330":1.238924580921968,"2331":-0.036044983633850974,"2332":0.0768337991272838,"2333":-0.4010115713292197,"2334":0.673492048495415,"2335":2.777966484560695,"2336":-12.045081930933033,"2337":-14.038321011040702,"2338":-13.834448194426614,"2339":-5.6595738714073125,"2340":-2.9280569453665306,"2341":-0.3004342648751629,"2342":0.8445244110398371,"2343":0.9366713298518001,"2344":0.7045431241332009,"2345":0.9807059354696129,"2346":5.26083326639296,"2347":2.7508957479620224,"2348":-1.6320487116309996,"2349":-2.8096270492329167,"2350":-0.46503989936934353,"2351":1.623504861546482,"2352":0.5659686242771713,"2353":-0.492545722540274,"2354":1.0046034225456983,"2355":-0.3108992043580237,"2356":0.5976997060510766,"2357":2.338073592790789,"2358":-0.8977666991776555,"2359":0.023614909515438067,"2360":-0.4123475314902581,"2361":0.9113349832401738,"2362":2.4275236784773044,"2363":-1.1678494039179135,"2364":-2.18587625855256,"2365":1.1666016858640307,"2366":0.6143805593506863,"2367":-3.249580991143933,"2368":-1.2307844011340605,"2369":0.0033481933818543725,"2370":0.8172219195104128,"2371":0.5675775609582304,"2372":-2.4272701178942078,"2373":-1.8431730620907587,"2374":-0.663723629092981,"2375":1.9968441866344326,"2376":-0.3498636516712323,"2377":1.1938746845311219,"2378":-0.17079164363191646,"2379":-1.351481440383449,"2380":1.315362185580218,"2381":-0.25711687712266024,"2382":1.6486779235098108,"2383":1.9997565904346613,"2384":0.7481934851373306,"2385":-1.978282211393611,"2386":2.8742128235413698,"2387":-0.30050604585297347,"2388":2.4179018401263086,"2389":0.3337927810127738,"2390":0.414680880408272,"2391":0.21181597155313617,"2392":-0.03005177070532574,"2393":-0.30533535637289644,"2394":-1.6837775942961022,"2395":1.8474509377547608,"2396":-0.9166869637434287,"2397":0.125363307921817,"2398":-0.3565720666244796,"2399":1.0429678535031603,"2400":1.1722266546247542,"2401":0.22415581871747298,"2402":-1.1787056960047124,"2403":-1.0620585951869363,"2404":0.22044415317561403,"2405":-0.015252747860743491,"2406":1.5170247714059064,"2407":-2.005923663206068,"2408":-3.5154238840712666,"2409":-2.414612671388027,"2410":1.9355172772013511,"2411":2.6993443758994498,"2412":5.416940962675197,"2413":4.779368961684639,"2414":2.358488161936211,"2415":-2.1349499976081505,"2416":-4.156802393371053,"2417":0.4949583941127288,"2418":8.401110452109151,"2419":13.480759286061687,"2420":5.678773092254739,"2421":1.1991383584770992,"2422":0.35202915346137853,"2423":-1.1093525944348392,"2424":3.125027620867253,"2425":1.3337682234519084,"2426":-1.6044022562047595,"2427":-0.702502652724289,"2428":-4.1148240491783055,"2429":-6.342844237631829,"2430":-3.3874314360509095,"2431":-5.464158756380046,"2432":-0.30266496702043105,"2433":-1.8666102776293996,"2434":1.0620069022097651,"2435":-0.16987258076119321,"2436":-2.408804885357353,"2437":1.5079931603782817,"2438":-0.5582400015621891,"2439":1.073420905733975,"2440":-0.6205175002371339,"2441":-2.3284132678297422,"2442":-0.680973922075278,"2443":-2.9902562349323,"2444":-0.7090378660320675,"2445":-1.1950649955386214,"2446":1.7273400243671813,"2447":2.019961935339556,"2448":-0.43499314566438624,"2449":-0.4410592988008484,"2450":1.4390358528613354,"2451":0.9738111852536897,"2452":3.0207456816399807,"2453":0.6926221136358042,"2454":0.07749102550831762,"2455":0.03634370252219248,"2456":-1.6419302662098185,"2457":1.0908623123028365,"2458":1.8937912324642223,"2459":-0.0699939467636534,"2460":0.5577986277550492,"2461":3.5082302221714667,"2462":-2.9281468409138602,"2463":-2.037435870735268,"2464":-0.061710233427231156,"2465":0.44039139009318634,"2466":-3.5855687396254448,"2467":0.551903802612313,"2468":-1.0546959807434046,"2469":-1.0682122019026155,"2470":2.445203813427537,"2471":3.82092059400624,"2472":0.22845475453056768,"2473":-0.4818613593107878,"2474":-1.340028960599564,"2475":-1.879256034904983,"2476":3.8001011892832586,"2477":3.9183644450880926,"2478":-0.13566097015807466,"2479":-2.9730407145963,"2480":3.0338395483861,"2481":7.87511122835866,"2482":4.795632618774419,"2483":5.3132460264518215,"2484":2.2609237743096307,"2485":1.2935132270196732,"2486":-2.1333184299762507,"2487":-2.038308344755536,"2488":0.40104724906069134,"2489":-2.826825400175528,"2490":-0.08677718682295864,"2491":-6.302528326834061,"2492":-4.246174021361132,"2493":-1.0050883634241328,"2494":-3.081754259690835,"2495":-1.5171277660534603,"2496":0.29460914772325647,"2497":-0.7031448174128591,"2498":-1.456136811529488,"2499":3.1166361016123982,"2500":-0.2502442698149671,"2501":-4.302285594966818,"2502":-1.0237661031735703,"2503":-2.194897846073706,"2504":1.270384934481349,"2505":-0.3892746721704471,"2506":0.8373110459692298,"2507":-4.794187216269677,"2508":-1.9751962826158886,"2509":-1.398995566560293,"2510":1.35112719027973,"2511":-1.68586008276177,"2512":0.8154897032697449,"2513":2.497593535569384,"2514":2.607281286077344,"2515":-0.6185972643295997,"2516":-1.7498936848029276,"2517":2.3789633182982786,"2518":0.8654053231826226,"2519":0.40209223712441966,"2520":1.0072933132022643,"2521":-0.44276505506547537,"2522":0.29589645480437843,"2523":-1.114731328041432,"2524":0.021696557743795142,"2525":-0.554311097549018,"2526":-0.49793433055719444,"2527":-1.8956023222848721,"2528":0.3537616625472645,"2529":0.16627816459305478,"2530":0.34569918486081924,"2531":0.6247390305145465,"2532":-0.1395857685723128,"2533":-1.722413913315853,"2534":0.9770053110214744,"2535":2.8944251381575103,"2536":0.3074797692400863,"2537":-0.5678207238342747,"2538":0.31547831407506816,"2539":-0.7140075524297071,"2540":1.234747035360742,"2541":3.242666954303986,"2542":0.8879159679037499,"2543":-0.10867246092387908,"2544":0.7274789594892525,"2545":0.6897521772879455,"2546":0.919522859616506,"2547":-1.2383547597836113,"2548":0.2856679479657677,"2549":0.8682609261526522,"2550":-0.07052964322898686,"2551":0.13496695862480426,"2552":-1.093626844806477,"2553":-0.5958689775755359,"2554":0.4270315018709301,"2555":-0.21047134778946722,"2556":0.4926409470067066,"2557":0.6463346801063856,"2558":-0.2861003076015263,"2559":1.005714843973939,"2560":0.7528781130218961,"2561":-0.5094633716614254,"2562":0.5471228707197933,"2563":0.9997159236521729,"2564":-0.9746271215043382,"2565":-0.03204317814145179,"2566":1.2696682127759822,"2567":-1.04022499292796,"2568":-0.41416990244946744,"2569":0.6861243619266865,"2570":-0.46232774424251505,"2571":-1.198596845168992,"2572":-5.04619802443178,"2573":-0.09964584996980207,"2574":-0.5703927016130854,"2575":0.07716640614867419,"2576":1.1956277172421728,"2577":0.8077871989968062,"2578":-0.8435309023494799,"2579":0.5456372735307142,"2580":-1.4401885332040905,"2581":-27.930887613228638,"2582":-8.67951408691977,"2583":-1.292754899547463,"2584":-1.3895335023995075,"2585":-1.1207196928729761,"2586":-1.3183307322427862,"2587":-0.8226517902060049,"2588":0.00793071476351209,"2589":1.1445376997593408,"2590":-8.591590792102357,"2591":0.7007134197795509,"2592":0.7357359974341933,"2593":0.4171311642599166,"2594":-0.7109441882585218,"2595":-0.38923409262735903,"2596":0.20294412557524483,"2597":0.726238158813111,"2598":-1.569705757362024,"2599":0.33960083882364156,"2600":0.3843221113712378,"2601":0.642619662235055,"2602":0.7081678118385083,"2603":0.25751564450773934,"2604":0.28547116765251884,"2605":-0.669137387494004,"2606":-0.6812919086351984,"2607":-0.7234340987578102,"2608":0.16217810615812414,"2609":0.3978991838356659,"2610":-0.6425383528059591,"2611":0.9744117272148106,"2612":0.13203477792054696,"2613":-1.4710415195538415,"2614":0.2172009219123896,"2615":-0.6831652478422101,"2616":1.5237506531610556,"2617":2.024140947700703,"2618":-0.5895381171170766,"2619":-0.890215054384306,"2620":0.016668031727038048,"2621":-0.35817098935087316,"2622":1.2340814992058395,"2623":0.3182422554982792,"2624":-2.880646778862144,"2625":-0.7051917451250612,"2626":1.4318840396346968,"2627":0.08882007316034471,"2628":-3.0364475194076874,"2629":1.8087402633832501,"2630":0.21224889905359048,"2631":0.971344045297679,"2632":-2.5649033265349663,"2633":1.8232931373639885,"2634":0.14526028158724597,"2635":-0.9740886746100444,"2636":-1.9511347384956834,"2637":2.925018435783391,"2638":-0.8068330128938239,"2639":0.5720933805109325,"2640":2.9063351803844792,"2641":1.988188097368942,"2642":-1.8982475493799793,"2643":0.0649531234676588,"2644":-3.833764456815229,"2645":-5.179122127335579,"2646":-2.072478544224394,"2647":-2.281019873190842,"2648":-1.793914997703878,"2649":0.06317630497230955,"2650":3.671240694697843,"2651":-1.5509182157553063,"2652":-1.6777376521892247,"2653":0.12226592410712232,"2654":5.417610909512695,"2655":9.422229289891131,"2656":4.9173096937335705,"2657":1.4612209356986228,"2658":0.6473755489863113,"2659":-0.3596685210782503,"2660":0.22166349860221754,"2661":-1.6134682325924894,"2662":0.2103197461498031,"2663":5.292880770404236,"2664":2.815424065298343,"2665":4.422927599170016,"2666":1.7415366082993844,"2667":-2.8999355675262826,"2668":-0.11989845803663442,"2669":-1.6788368174256851,"2670":-0.7273006519381663,"2671":-0.49074136798146445,"2672":-0.2850603125622714,"2673":-1.5423459039501548,"2674":0.8022249635268901,"2675":1.0825942296692639,"2676":-0.16325634776411785,"2677":-2.2278436420815866,"2678":3.1407470188006745,"2679":-0.6183711638250131,"2680":-0.36505411240444063,"2681":-5.853311395223047,"2682":0.2201684601141739,"2683":-0.7255672004904045,"2684":0.500366342394004,"2685":3.744915784678166,"2686":0.8294352519517884,"2687":1.3689335415595703,"2688":2.143540542214604,"2689":-1.664815320296866,"2690":-1.9764241067701211,"2691":-3.1386335999969113,"2692":3.0983530301415003,"2693":1.312430300925242,"2694":0.6353558472117408,"2695":2.9127456073443243,"2696":-1.7653159627907509,"2697":4.265024512027654,"2698":0.8665926030326452,"2699":3.2645461025178673,"2700":1.1416463346050556,"2701":2.699904498711092,"2702":3.3126802380840004,"2703":-2.0815157620644746,"2704":3.235363748165905,"2705":-1.2558265168684224,"2706":-0.4672425966755836,"2707":-1.2633973436716444,"2708":-2.8647064983129567,"2709":-4.8447590505604685,"2710":0.859512497555022,"2711":-3.560658579110699,"2712":-1.8053033963266896,"2713":-1.5498665177617086,"2714":2.628519471444543,"2715":1.980493453814143,"2716":-2.897511829447295,"2717":-3.0954935586520853,"2718":0.21461741348623262,"2719":-2.7770854248094836,"2720":-2.219576556027453,"2721":0.7437774481839059,"2722":1.678056927882249,"2723":-0.3679357341648006,"2724":0.26877862103277156,"2725":-1.0564903433130568,"2726":-0.9870854333870686,"2727":1.6985842786262537,"2728":-0.9534035028598945,"2729":-0.5233570893523315,"2730":-3.459680833346453,"2731":1.3829676769873165,"2732":-0.3201893636348292,"2733":3.4867621079862583,"2734":0.5024311782708077,"2735":-1.1431614838572608,"2736":-0.97637024194455,"2737":0.8240319560087598,"2738":-2.0406240420696324,"2739":-1.778898374519624,"2740":1.0860061317682783,"2741":5.750520606235137,"2742":-0.04524740445289022,"2743":4.228510064079031,"2744":-0.8873636956948822,"2745":-1.7275962552747797,"2746":-3.389728313868179,"2747":0.8312445246786693,"2748":4.574418365173138,"2749":0.6722875773481076,"2750":0.013497203654436705,"2751":0.6101561053192823,"2752":1.8233313468062295,"2753":0.27384059039674336,"2754":3.950823469045536,"2755":3.6532804415226914,"2756":-2.7222321273368135,"2757":-2.039849774745974,"2758":-1.5116557449301298,"2759":-4.345355251602575,"2760":-0.49873509716306236,"2761":-4.345086846052382,"2762":-3.810279089871109,"2763":-1.9481898689097472,"2764":2.7762015745902353,"2765":1.57176567274602,"2766":-0.45432168435817594,"2767":0.3011779495628037,"2768":1.5883443183765613,"2769":-4.025126343383535,"2770":-1.6963702090577022,"2771":2.36554592019474,"2772":0.23596178879792537,"2773":0.4744116261777444,"2774":1.0546637957418956,"2775":-2.3073149074917385,"2776":0.8846447142933915,"2777":-0.5685800837520749,"2778":-4.220472717837974,"2779":-2.1476845917357332,"2780":0.2044153351787579,"2781":3.4230901295028273,"2782":-2.813340296819276,"2783":-2.911071954649125,"2784":0.3872882248135245,"2785":0.8814112043768849,"2786":-0.46007189936932785,"2787":0.2683116182003925,"2788":1.223560447643923,"2789":-0.015064474012484744,"2790":0.14950650937080368,"2791":-2.4372698066770027,"2792":2.464261059787699,"2793":1.033211651592425,"2794":0.29516132099158476,"2795":-2.342969151437985,"2796":-3.0505983691272527,"2797":3.0861347351036037,"2798":-4.094006662419499,"2799":-0.9909430872354336,"2800":-2.0917279318032187,"2801":-2.1313401357871413,"2802":-1.1280672933427427,"2803":-3.0657664558569273,"2804":-2.0235129832996015,"2805":-3.3568186684224077,"2806":-0.5917482957521816,"2807":-0.35430779227300213,"2808":-0.21348832511351992,"2809":-1.2234279031585655,"2810":-0.2852931177475596,"2811":-0.8219116093080792,"2812":-3.195207274480383,"2813":-3.9810267160321864,"2814":-2.01527737180548,"2815":1.4304582817255675,"2816":3.2580501234730663,"2817":2.085825986502275,"2818":-1.1348675758317084,"2819":-3.7942919690937917,"2820":-2.1032677649673186,"2821":-2.3381745327933317,"2822":-2.446500774732461,"2823":-2.984781681952712,"2824":1.6173847775961727,"2825":0.18599214459237876,"2826":0.32233553932612535,"2827":-0.019711239895498906,"2828":-4.857055689462588,"2829":-0.34004483133852176,"2830":-2.2975162188778895,"2831":-2.569046753257102,"2832":-4.132225184723097,"2833":1.1810836944829655,"2834":1.095800520313069,"2835":-1.071313772880493,"2836":1.4155486116216918,"2837":-2.623846710055304,"2838":-1.9668274322218455,"2839":-2.178112495106981,"2840":-2.772144435747771,"2841":-3.7262971404624134,"2842":-0.7820454914677408,"2843":-1.5571950403376407,"2844":2.0965163756746428,"2845":2.138198882459945,"2846":0.9802112729806348,"2847":-0.5453404371616012,"2848":-0.8671313549743171,"2849":-3.6090648699867547,"2850":-3.331862401445953,"2851":0.28129287232052047,"2852":1.2464916142297064,"2853":0.5090418581011645,"2854":1.1508972155596153,"2855":-2.135984858699965,"2856":0.11007379490547088,"2857":-0.9123014710464533,"2858":-3.53264878162345,"2859":-3.4639630689419088,"2860":-1.5635537362909764,"2861":-2.789094052608394,"2862":-1.728356363411174,"2863":0.5248443554804914,"2864":-2.146152252012736,"2865":-2.704342085409854,"2866":-1.9232026004782241,"2867":-1.9571604731343262,"2868":-1.1540088478557966,"2869":0.9892932096516771,"2870":-0.7467404307467268,"2871":-0.9401945484546417,"2872":2.339719421632117,"2873":1.001410424808371,"2874":4.02187876399705,"2875":-0.9129809330054857,"2876":1.035278855650616,"2877":0.03891840354141691,"2878":-0.8296594763668986,"2879":2.7005103023165744,"2880":-2.139988804678781,"2881":-1.6013880787825296,"2882":0.11563204368091859,"2883":-0.7751185430363683,"2884":1.5150943772732914,"2885":-0.2955728504851558,"2886":1.6848920421798277,"2887":1.44960896381774,"2888":-2.672478928183361,"2889":2.9237233006920555,"2890":-0.02929498103656199,"2891":1.8982906620716857,"2892":3.1767024679099998,"2893":-0.8750229670479883,"2894":0.7753894163371603,"2895":4.861610566542348,"2896":-5.299989803565218,"2897":-2.5764685128485514,"2898":-2.0913071928149414,"2899":-2.0226197366895304,"2900":-2.7288430789138602,"2901":1.2263905621471034,"2902":1.6688443947745226,"2903":1.1415879855786952,"2904":2.2816081449691916,"2905":1.5750991659664535,"2906":1.8471763017350873,"2907":-0.09116127121331685,"2908":1.7494287214105735,"2909":0.07172982919875501,"2910":1.2270545693870922,"2911":1.4754536607545097,"2912":-0.7750705938111645,"2913":-0.2763420286901906,"2914":-1.7456542626547404,"2915":-0.5435461607659213,"2916":-1.2858990264838333,"2917":-0.10475121489088605,"2918":-0.8294744534288359,"2919":0.046405223103997646,"2920":-2.742549530881155,"2921":-1.3664603149886,"2922":-2.831809778736567,"2923":-2.126142665626375,"2924":0.2392352191310622,"2925":3.793939190269061,"2926":-0.8196856291411189,"2927":-0.8511494111143988,"2928":2.025813249427704,"2929":-1.2486887769275057,"2930":2.9983413229053695,"2931":0.47266808762711776,"2932":2.281608643226022,"2933":-0.5101017452061269,"2934":0.8632835264661731,"2935":0.10733113264728057,"2936":4.814808335533795,"2937":3.9736254388136785,"2938":1.6967761662242369,"2939":2.6643087303988264,"2940":-1.1225429703736522,"2941":0.4917063850699408,"2942":3.0288260338894264,"2943":1.354113133043949,"2944":1.7384667751816056,"2945":1.615110591354974,"2946":-1.499220055282781,"2947":3.273633776448666,"2948":-1.8398208825888036,"2949":0.5296366660279302,"2950":1.2679958496536807,"2951":1.703333519050864,"2952":1.1064227628295709,"2953":1.9357125788210268,"2954":-2.2233840153451183,"2955":-3.445958822107003,"2956":-1.370292340901521,"2957":-4.1064476868935555,"2958":-0.31797996550765245,"2959":-0.1758923572929094,"2960":1.2658200565952467,"2961":-1.6839258926884904,"2962":0.582109571289314,"2963":-2.947693528374219,"2964":-0.618704313070197,"2965":-1.0665732341128873,"2966":-0.04553818751538161,"2967":2.7614508587908255,"2968":-0.041507518150641055,"2969":-1.8129146744599918,"2970":-2.807282369702624,"2971":3.657373580453673,"2972":-0.9515688773105879,"2973":2.295118053081831,"2974":1.1418303113415837,"2975":3.8842984612417415,"2976":5.528355890624291,"2977":1.0372167315432896,"2978":-0.22596975568029118,"2979":2.019215213441106,"2980":2.2490778521260992,"2981":-0.6629537278044081,"2982":2.157786095255028,"2983":0.8084322098008357,"2984":3.3633997916105924,"2985":-0.8406181347190066,"2986":-0.3504388211234827,"2987":6.049290751240469,"2988":-4.025051768163724,"2989":-2.2469750533065582,"2990":-0.9739530816375768,"2991":2.6235693324963685,"2992":1.5423982976104702,"2993":0.7374189028810368,"2994":0.006974525362086316,"2995":0.01902879526351994,"2996":2.466198909458241,"2997":-1.3574448845709874,"2998":2.5648182485427546,"2999":-0.3881578471742737,"3000":-4.677270874314627,"3001":-2.570835736490337,"3002":-5.904148815798856,"3003":-0.7780330142238004,"3004":1.9614631691602025,"3005":0.5031063771326859,"3006":1.5617989292344903,"3007":2.546979409372088,"3008":2.505448204630202,"3009":0.35428378892170087,"3010":-0.6049528491483727,"3011":-0.26371081772775695,"3012":1.0087532202895533,"3013":-2.6574902297306577,"3014":-3.1421276878868305,"3015":-4.732182148531401,"3016":1.8949162016615302,"3017":-0.8160982862895547,"3018":1.2846943224114398,"3019":1.0925080592629006,"3020":0.7359179259361673,"3021":1.2077438443484563,"3022":-1.8240203175121412,"3023":-2.3153366812600944,"3024":3.113102052510295,"3025":0.6284997501672107,"3026":-0.7206371561590956,"3027":4.331139008181063,"3028":-0.6913869478852894,"3029":2.6511714433093605,"3030":-0.7134609554233486,"3031":-0.7168982689851271,"3032":-1.5068845268573163,"3033":-0.48099476150546183,"3034":-0.7539502042465173,"3035":1.415566018987788,"3036":0.7230161838823336,"3037":-0.7921994532377798,"3038":-0.19926425291152208,"3039":-1.102032150662967,"3040":0.13876524547839075,"3041":-1.3303717775761568,"3042":1.6381810110418933,"3043":2.9804106103384904,"3044":-1.4045714762022503,"3045":-0.13343384960771426,"3046":-1.5698939706509427,"3047":2.6247196506626014,"3048":1.6579171501741785,"3049":6.803091135553339,"3050":0.9343512069841536,"3051":-0.8580533953179943,"3052":0.62012465157435,"3053":-0.9125310800004461,"3054":2.7221751542530526,"3055":6.937934376856582,"3056":7.832187240737118,"3057":5.045044292556968,"3058":4.2952754165771685,"3059":-0.44258805209072316,"3060":2.034384898677738,"3061":-0.7883160443504861,"3062":1.7218075176850738,"3063":-0.5751724230060561,"3064":2.296228436975854,"3065":-5.403956139598982,"3066":0.36543448972578324,"3067":3.5699240866025796,"3068":1.028058997671212,"3069":3.3269612619055717,"3070":2.526743243293026,"3071":-4.012533889049803,"3072":-1.0505609871563353,"3073":0.19535682938102805,"3074":-2.7447253531014257,"3075":-2.341167405894658,"3076":-3.9691843994556484,"3077":-3.7034508882871884,"3078":-2.5976771598019583,"3079":2.042293088833888,"3080":-1.5253962180467393,"3081":2.089079729112844,"3082":0.7527132248153648,"3083":-0.8613751334573247,"3084":-0.08118655153194758,"3085":-1.4663987415775528,"3086":2.0089880962146283,"3087":-2.2906450610802263,"3088":-0.14283775894007442,"3089":-5.384041748301703,"3090":-1.8661794375142193,"3091":0.7690254698525314,"3092":2.3980285912011405,"3093":3.9958168480823293,"3094":-2.162758051453124,"3095":-0.4603733721351508,"3096":0.3036027183845875,"3097":0.30856318100812297,"3098":2.2166468641362225,"3099":0.6729685137173009,"3100":-0.7697998820417241,"3101":-1.2661215907520584,"3102":-1.0484008328302472,"3103":-2.9160965502861385,"3104":4.025856834682956,"3105":0.0683949196715717,"3106":-2.7817322600054983,"3107":2.5952648911790273,"3108":0.46049448301341367,"3109":0.31004191584990864,"3110":-1.397460010692559,"3111":1.3412745416355747,"3112":3.788134007413843,"3113":2.4403728349850775,"3114":0.4621720483360015,"3115":-1.0824623348516467,"3116":1.4926085532738171,"3117":-2.69171347275052,"3118":-0.33556477294588155,"3119":1.3749710443568761,"3120":0.6462044520432879,"3121":0.04148832652318011,"3122":0.285292449095727,"3123":0.534940056706493,"3124":0.523508937326121,"3125":0.27123848896710745,"3126":3.2317145896332544,"3127":1.3549441365913897,"3128":2.062310329139266,"3129":0.8094488780105731,"3130":0.3379255131726608,"3131":0.2024753848660422,"3132":0.15057302028589184,"3133":0.5073865548892617,"3134":2.263931617070411,"3135":0.7742678203821433,"3136":3.14482025414724,"3137":2.284757851219616,"3138":0.6329035599957621,"3139":1.728327799455831,"3140":1.3367492564591796,"3141":0.1266806526596138,"3142":0.5114869093036251,"3143":0.432398913590939,"3144":0.5873462371183542,"3145":1.6572383284347298,"3146":0.6135061565469583,"3147":0.6772356630798977,"3148":0.2873495101282064,"3149":0.2734626153949302,"3150":1.0843346626898323,"3151":0.972525348708122,"3152":-2.1663869585385833,"3153":0.7191261526594763,"3154":-1.4241519074013924,"3155":0.18155817303698538,"3156":0.8715712954403452,"3157":-0.20624736252020046,"3158":0.02013911631406702,"3159":1.5191689578518224,"3160":0.6150496397444717,"3161":-0.8980609398489929,"3162":-1.3921360868052859,"3163":0.864619594388245,"3164":1.4423330618203798,"3165":1.3606738197001278,"3166":-0.13022989330669754,"3167":1.4845710891046071,"3168":1.7030347424140382,"3169":-0.009130869481340611,"3170":0.7332427695082057,"3171":0.5056973789505912,"3172":-2.4543113084101105,"3173":-0.12826208887507254,"3174":-0.21787784618868297,"3175":0.4213687055455538,"3176":0.11780039677488928,"3177":1.5407346663865846,"3178":1.6933561176957723,"3179":0.7442376015998291,"3180":0.6602131953454635,"3181":2.5532546854340117,"3182":1.794473571641783,"3183":1.9732848587604515,"3184":0.4881743396893571,"3185":0.643261015997875,"3186":-1.136095290348721,"3187":0.1688314485033043,"3188":0.2374158800103892,"3189":1.9674296184372932,"3190":0.8164145623902993,"3191":1.28207342143742,"3192":1.4564241794089863,"3193":-0.018626031801152382,"3194":1.1004743330454114,"3195":1.1045864354994808,"3196":0.642158993200058,"3197":-0.3040335131099938,"3198":0.780171181940088,"3199":-2.3438263317304266,"3200":-1.8096874254086546,"3201":-1.405321652709479,"3202":1.9979553963544063,"3203":4.729652283814125,"3204":0.8345704704395879,"3205":3.6352575152989446,"3206":0.41140761476794907,"3207":3.171042857465245,"3208":0.33250328499909143,"3209":-1.5799926452139796,"3210":-2.300055011315178,"3211":0.8369267408417493,"3212":3.2862613628987987,"3213":1.9319161723977838,"3214":2.2896572248503997,"3215":2.5890726896067155,"3216":-0.5223107679804674,"3217":-0.5549418928222923,"3218":1.2839835201040297,"3219":1.2353208311525432,"3220":-1.2410599002505651,"3221":2.494067358324687,"3222":3.143562431036601,"3223":3.3524437833709975,"3224":2.606762438624046,"3225":-3.105480797379566,"3226":2.3422599113198808,"3227":4.034587557387089,"3228":-1.0429913998379312,"3229":-3.3935281227578495,"3230":2.5544933631034232,"3231":2.8163981204991813,"3232":1.9815561084957358,"3233":1.1784014875807998,"3234":1.4620450329017276,"3235":0.9340181415711819,"3236":2.1894073720934513,"3237":-1.0258521379548333,"3238":-1.1802453094225143,"3239":1.1082939278050368,"3240":3.9165440428862706,"3241":1.189555065886034,"3242":1.9220098034081807,"3243":0.8721628144175536,"3244":-2.567095691062622,"3245":-1.4585927535493195,"3246":-0.06806113479682266,"3247":2.101286148166416,"3248":2.685634819912282,"3249":-0.08624557802827784,"3250":1.3591514777590605,"3251":1.899157608940971,"3252":-0.2561947810283742,"3253":-0.2090263686559394,"3254":-2.5893281609380554,"3255":-2.268358694282381,"3256":-3.3832175430579516,"3257":1.6598794012671838,"3258":3.474778564068942,"3259":2.301031906358781,"3260":0.5808726684895622,"3261":-1.2175455521073415,"3262":-0.9824835593349093,"3263":-0.20341314669995378,"3264":-1.733778086024076,"3265":5.122496642079614,"3266":1.9390792429912869,"3267":1.8030389218614928,"3268":1.5986821415978507,"3269":1.7228777318266997,"3270":0.19756311096206713,"3271":0.13840833348347983,"3272":1.859571159242329,"3273":0.19033837667859158,"3274":1.2758341865409708,"3275":1.4195356642570807,"3276":3.6675287766760136,"3277":2.6794114777250644,"3278":1.4789342493627968,"3279":-0.7578695058184023,"3280":-0.37328373800179315,"3281":0.6163924023438239,"3282":-0.25613291316226156,"3283":-0.5580799977332122,"3284":-1.2606270062068974,"3285":0.7320066518820545,"3286":0.7300639396647781,"3287":-0.39137329748311595,"3288":-0.47203816739461163,"3289":0.8430869093687612,"3290":0.10692294715397886,"3291":-0.9669091335379123,"3292":0.9657623725504896,"3293":-1.0996351647342608,"3294":0.06447458744538172,"3295":-0.0008039795965176145,"3296":-1.1995236487150478,"3297":0.6119329451336802,"3298":0.23701647563738953,"3299":1.4736819140676383,"3300":0.7508074561119792,"3301":-0.491280704796581,"3302":-0.5781138144636037,"3303":-1.1509475308534753,"3304":-0.6298895062104478,"3305":0.26497736694560703,"3306":0.8490330137692085,"3307":-1.0859089858776911,"3308":0.7271747830303281,"3309":-3.224340676661647,"3310":15.726093126679638,"3311":16.55131998805095,"3312":0.9976460883073626,"3313":0.6848458458760576,"3314":-0.6362694680739343,"3315":-0.7062020274608523,"3316":0.6176877394942607,"3317":0.8684592696530403,"3318":-0.706942984422161,"3319":-11.816903089588491,"3320":1.2932011003415853,"3321":0.7940400974528957,"3322":0.25566902177975326,"3323":0.519194025754157,"3324":1.5166459525939224,"3325":-0.6694438674868638,"3326":0.32407809677233373,"3327":-1.5987564168560655,"3328":-0.3836259108998539,"3329":0.18545376683184547,"3330":-0.9565370301158951,"3331":-0.6929775483151144,"3332":-0.4651497226696284,"3333":-0.8126755429894378,"3334":-0.33735419346652584,"3335":-0.5526918883224535,"3336":0.5417527957455551,"3337":1.5561918330837374,"3338":0.28754591570891913,"3339":0.4319976864918582,"3340":-0.23416625319691323,"3341":0.055761695062949035,"3342":-0.3346116670286503,"3343":0.6191837830360833,"3344":-0.1613690351596262,"3345":-0.6502112451846742,"3346":1.1760630340534903,"3347":0.2912176007436381,"3348":-0.922523976377491,"3349":1.4733104882132402,"3350":-0.41967340404788533,"3351":0.3509142072566977,"3352":0.2072265392692666,"3353":-1.251879280772819,"3354":1.156440405129215,"3355":-0.18335296951539104,"3356":-0.8190771907931963,"3357":0.10205683956949615,"3358":-0.8075712998904857,"3359":0.03419191471836951,"3360":1.6323666629087799,"3361":1.1849717740442094,"3362":2.359607517545933,"3363":-2.0527338781925426,"3364":-2.9697900461594835,"3365":-3.6606022761197017,"3366":-2.0663287463893374,"3367":0.10978849945817067,"3368":-0.5716270228081437,"3369":-1.544963188846203,"3370":-0.33857699654132944,"3371":4.360316208386124,"3372":-1.0030451034701027,"3373":0.3717082376911936,"3374":-2.256062004287895,"3375":-0.45308170352611804,"3376":-0.34802601086836243,"3377":-0.6404796767179907,"3378":-0.33720654607526074,"3379":-0.5649645098460764,"3380":-1.3628348197982227,"3381":-3.2205684110098636,"3382":-1.112108089193284,"3383":-1.4926872192864888,"3384":-1.7444342654872649,"3385":-0.40709464488211744,"3386":-1.052599015676314,"3387":-1.705072209947205,"3388":-1.5565475813020178,"3389":-2.2505125047700796,"3390":-2.928113829233323,"3391":-1.5829597300666685,"3392":-1.7563502681956882,"3393":-1.1523386506363174,"3394":-1.6353684557416435,"3395":-0.7345730426708853,"3396":-0.558283944014078,"3397":-0.20617171215141245,"3398":-0.9055817251320801,"3399":-2.966077605390387,"3400":1.0801482671048899,"3401":-2.562834883456405,"3402":-2.5904442289352865,"3403":-0.27659398697910326,"3404":-1.4042112080415026,"3405":-0.11166642978963748,"3406":-0.2898619328807415,"3407":-0.855367465920906,"3408":-3.1890317491398834,"3409":-1.548151923287652,"3410":-2.3631167069092402,"3411":-2.1452799492104497,"3412":-1.4803334009892943,"3413":-1.705874209172063,"3414":-0.3127848790426551,"3415":-0.19442122314080373,"3416":0.5716489480975611,"3417":-1.4886278116853937,"3418":-0.12185166133921138,"3419":-2.6332783094959864,"3420":-1.8634429530690166,"3421":-1.4470747231964782,"3422":-1.733807482837778,"3423":-0.2727142551269073,"3424":-1.1472187256293545,"3425":-0.12810949872640104,"3426":0.26031694634700575,"3427":1.9594681234132798,"3428":-2.41392739982318,"3429":-1.4443194832133803,"3430":-1.5006763436721058,"3431":-1.0313440928796263,"3432":-0.7215408146915016,"3433":-0.8589133944728774,"3434":0.8957989316769449,"3435":-2.63771732690323,"3436":-1.4038305644805416,"3437":-2.7297048460056614,"3438":-1.1060094991437985,"3439":0.18639561194976043,"3440":-1.0859122245595176,"3441":0.43150765057609414,"3442":-1.0983963845043423,"3443":-0.1719549782328331,"3444":0.8567779258685368,"3445":-2.763208111814305,"3446":1.5402798819948398,"3447":-1.7531632006013678,"3448":1.3773757584463182,"3449":1.7355052947839986,"3450":-3.1168602816826483,"3451":-0.9504284508724903,"3452":-1.8184540350519693,"3453":1.2941209858565048,"3454":2.555463479917673,"3455":2.365312398330428,"3456":-1.2656984979352126,"3457":-1.9261760942682775,"3458":-1.3529219705390767,"3459":0.6449402029586233,"3460":0.9595292956213443,"3461":-0.06769788531596789,"3462":4.918229806877951,"3463":-1.266368663347433,"3464":-3.548455213888682,"3465":-1.065371826185915,"3466":-3.2871044822784987,"3467":1.3759175031441593,"3468":-0.13646805689125113,"3469":-0.5642129595965996,"3470":0.6982474005552485,"3471":-5.137433973011904,"3472":3.7683387809042697,"3473":1.6772401061466262,"3474":-1.2846188494322408,"3475":-0.5205468115717532,"3476":-0.9054130759884634,"3477":-0.012635359088312785,"3478":-1.0365468582974915,"3479":-0.8143465823096747,"3480":0.7390336916980798,"3481":-1.950940330320455,"3482":-2.507692503353151,"3483":-0.16784689004577236,"3484":-5.641490129132735,"3485":-3.9403769519554968,"3486":-2.91459328147273,"3487":-2.7789744024928984,"3488":-1.9896853071973692,"3489":0.8606913207136024,"3490":1.2361089149569975,"3491":-1.0567170900671456,"3492":0.32551276285065883,"3493":-1.998471171883027,"3494":-1.8561704287541854,"3495":-4.009991902035769,"3496":-5.180044554917269,"3497":-3.53166917788171,"3498":-1.6100200586932736,"3499":3.295914334207998,"3500":-2.345020008835874,"3501":-0.1784395700538304,"3502":3.205768898599561,"3503":-0.01613198741853883,"3504":-2.071140586119717,"3505":-1.5798207092236123,"3506":-4.581719346845193,"3507":-0.4134623948488556,"3508":-2.033223327819948,"3509":0.42251557577422594,"3510":-0.3983103698491862,"3511":4.682782736646116,"3512":3.0141466630187064,"3513":-2.3619559429463366,"3514":-1.7707841149520354,"3515":0.4320112604252925,"3516":-0.7591057936760353,"3517":2.523547177004588,"3518":1.7335292415703187,"3519":-1.5070382926326893,"3520":-1.0358415172854902,"3521":-1.6012032273625951,"3522":0.48445592811893917,"3523":-0.8182739795241972,"3524":3.494193251408165,"3525":3.2378072890989977,"3526":-1.118028154646086,"3527":1.7471454033795055,"3528":0.7788151425572901,"3529":-2.738882796677482,"3530":-1.9673281722783942,"3531":-2.2753032594678153,"3532":-0.36486526067682606,"3533":-2.386989916858125,"3534":-0.249048579495248,"3535":4.996099622828237,"3536":4.48431730725435,"3537":1.5796109567291547,"3538":-1.0641689452928598,"3539":3.135256058301063,"3540":-1.5112284497124455,"3541":-0.2925439934509442,"3542":-3.3328909723176503,"3543":-1.103386232793407,"3544":0.6317037046345632,"3545":-4.627926169980465,"3546":0.08047972373855238,"3547":0.20791729340184328,"3548":0.25707721130542033,"3549":-1.2672442336103857,"3550":1.3762114640939562,"3551":2.795764940460487,"3552":2.444050663039464,"3553":4.395556029275666,"3554":-1.3319481007950076,"3555":1.1030712762871557,"3556":4.066384568640609,"3557":-2.8987620692181224,"3558":3.3860316362484615,"3559":-2.2899673334528137,"3560":-0.16595139302125458,"3561":-1.8457219515307703,"3562":-2.190233912794242,"3563":-3.5983600183736675,"3564":-1.3940345556882776,"3565":1.4787770842657997,"3566":8.717542092480368,"3567":-0.6051507079971006,"3568":1.8667855510011937,"3569":-3.0869381526632487,"3570":-0.4733560281981327,"3571":-1.162162512758519,"3572":-0.8773452221794169,"3573":-0.9432578298721255,"3574":-3.3770609073635605,"3575":-1.0990344594752217,"3576":1.7692304726875268,"3577":-2.554227174840312,"3578":-5.725191941795665,"3579":-2.906167274943449,"3580":0.5557207449277715,"3581":-2.6401737798744382,"3582":1.4684088995581346,"3583":3.1391984009838274,"3584":-1.3101111122294844,"3585":0.16507979215140509,"3586":1.2087788391459016,"3587":1.3786080893846082,"3588":2.229806686766642,"3589":-1.133685095923729,"3590":0.7197626318217687,"3591":2.343987660220757,"3592":-0.23124317051486368,"3593":-1.556204974751937,"3594":-0.9294576374642888,"3595":-2.838837315377501,"3596":-2.371327843093442,"3597":-1.4832678757461515,"3598":-2.2432029532646034,"3599":-0.9408173534112217,"3600":1.229610942899131,"3601":-1.083198049913011,"3602":-2.4199783491821565,"3603":-3.9162107832804685,"3604":-1.0823187832212486,"3605":-0.9075392092927418,"3606":-3.14596537654639,"3607":1.9417682121041664,"3608":0.35336001587081184,"3609":0.4710691317528893,"3610":-0.7922563885353604,"3611":-0.2655417303882281,"3612":-0.16698652523635366,"3613":-0.184983988491787,"3614":-0.8682639328492626,"3615":1.1137297007540086,"3616":0.7966040390010748,"3617":-0.4089221321338311,"3618":0.6885922243310276,"3619":0.4098509416780987,"3620":-0.6162330536011363,"3621":-0.8223417117398139,"3622":-0.9890322913706624,"3623":0.19412181931700176,"3624":0.2031736981279696,"3625":1.0746859045630268,"3626":-1.1305829474347175,"3627":-0.01244850729127761,"3628":0.6429506469540404,"3629":-0.3193405731332318,"3630":-0.28736005506796053,"3631":-0.23355517266652645,"3632":0.13404105009432973,"3633":-0.827606268387829,"3634":0.5339072286773887,"3635":0.20133515916158493,"3636":1.3351523304906883,"3637":-0.39758472385688626,"3638":0.3534705377404546,"3639":-0.6957017478831519,"3640":0.5478304550426918,"3641":-0.3024177734569176,"3642":-0.37550866914655445,"3643":-0.047442264996645604,"3644":-0.18371666544085086,"3645":-0.32532104001529427,"3646":1.5429693759624508,"3647":16.154395891258947,"3648":1.8190495301072322,"3649":0.5506987595751419,"3650":-0.4621866638236758,"3651":0.28070729019322543,"3652":0.12395954125114259,"3653":-0.8760056347877861,"3654":-0.2506388057380383,"3655":-8.153207022493667,"3656":-15.231368132631143,"3657":-10.03025555308362,"3658":0.3190693563599894,"3659":-0.4083228728579814,"3660":-0.2550008355946862,"3661":-0.2870489612624521,"3662":0.5341696348449999,"3663":0.4330710389604135,"3664":0.47166512266047855,"3665":-2.851964332711641,"3666":-2.0633673928182867,"3667":-1.1498562246235837,"3668":0.08894306282307675,"3669":0.19345940359863217,"3670":-0.8497101259193657,"3671":0.758148315175021,"3672":1.1094757517698914,"3673":-0.06534218034909389,"3674":-0.5571995700693243,"3675":0.41728063853242564,"3676":-0.44613270400073674,"3677":-0.07838832887833606,"3678":1.728508409849893,"3679":-1.0852334766283127,"3680":0.04529842988286706,"3681":0.452261633154439,"3682":-1.4425345980334603,"3683":-0.6891835508425127,"3684":-0.40929547682471035,"3685":0.6178620376764397,"3686":0.05909239794971444,"3687":0.3762025848091262,"3688":-1.3699377677456217,"3689":-0.060573114195967795,"3690":-1.6409230223084288,"3691":-0.5469558383677855,"3692":0.927753761004038,"3693":0.5237303682110693,"3694":-0.5845588975005743,"3695":1.043335620911143,"3696":0.4377853965871368,"3697":-0.5916294258961229,"3698":-0.5915178799522788,"3699":-1.9199004203214136,"3700":-1.6670179774330907,"3701":-0.42331672944066906,"3702":-1.089703493053159,"3703":-0.11053296161556703,"3704":-0.06085138576712301,"3705":1.24358797982154,"3706":-0.21819441865239347,"3707":-0.7079618420820201,"3708":-1.5355499276849256,"3709":-1.727776286538153,"3710":0.2023915164492601,"3711":0.24186900131731906,"3712":-2.0467616819732677,"3713":0.5352798724923751,"3714":-1.0147282669102036,"3715":-0.09984084339939173,"3716":0.6282825007547654,"3717":-0.47826496213386716,"3718":0.7928012083923205,"3719":0.2667982168037989,"3720":-0.15733261898291995,"3721":0.44155476008788447,"3722":1.0962685904425518,"3723":-1.1132339846222024,"3724":-1.5835738379735553,"3725":0.5384987588725031,"3726":-0.9449119616631745,"3727":16.954372982692046,"3728":13.719941172983765,"3729":-2.880422529802766,"3730":0.4082282224023194,"3731":1.6389891552087865,"3732":0.932916210744222,"3733":-0.28295480931079303,"3734":0.9241740282592462,"3735":0.755230924163112,"3736":-0.8710006868227312,"3737":-1.4257618102968321,"3738":1.0243226497617721,"3739":-1.4901070319180545,"3740":-1.3822914402216293,"3741":1.4920949869390758,"3742":-0.34842045800700433,"3743":-0.9432347372922436,"3744":-0.9733421964638435,"3745":-1.7303166672631567,"3746":0.7149311056295108,"3747":-0.10470744305865201,"3748":0.6963186030804174,"3749":-0.15841406258885044,"3750":-0.3907028968355537,"3751":-1.1016530743201822,"3752":0.14964330698374306,"3753":-1.5299700980728999,"3754":-0.5834569316026703,"3755":0.03615894907665337,"3756":0.7559935783842184,"3757":0.13050895820209654,"3758":1.2749972146534618,"3759":0.46985690804783664,"3760":-1.9743972464814474,"3761":-0.5146662977905115,"3762":-1.5873644882476614,"3763":-2.556792782728384,"3764":0.6860710423637346,"3765":0.38608278621456565,"3766":-2.0056750245849213,"3767":-0.825420780551829,"3768":0.4672211066838292,"3769":-0.2013511929755495,"3770":0.38895291858970915,"3771":0.1609573296442458,"3772":-0.17198249790843517,"3773":0.4633853492992662,"3774":0.665427849704105,"3775":-0.44153063542102516,"3776":-3.9759283093365223,"3777":-0.6345142969775802,"3778":-2.3103562557425756,"3779":0.06694818855994294,"3780":4.7786242548504685,"3781":1.5187198721946862,"3782":-2.0281488667179026,"3783":-3.842414409016348,"3784":4.79552169797948,"3785":3.8988185721251374,"3786":-2.174478795522128,"3787":-3.9126331972032906,"3788":-2.815618447484233,"3789":-2.731654859589404,"3790":1.1129873768674048,"3791":-0.7301841752335659,"3792":2.096957759964687,"3793":-1.3531732883188847,"3794":-0.9850040856995042,"3795":1.1078839260928968,"3796":3.78710810263473,"3797":2.355349775856241,"3798":-3.4510456107923666,"3799":1.5530175827082564,"3800":-0.2420333701542829,"3801":1.613386292870592,"3802":-1.604836496049632,"3803":3.1461481423305426,"3804":-2.820261296256708,"3805":2.044168480324127,"3806":1.4119583575177779,"3807":-1.9237887853972488,"3808":1.382484429455887,"3809":0.7698199532146344,"3810":-1.5189782879527747,"3811":2.8976596489604645,"3812":-1.669354516185792,"3813":-6.262440770363421,"3814":-2.749276500011266,"3815":-0.3384043605387775,"3816":-1.3811834158581457,"3817":4.038472189526883,"3818":1.3427169432156376,"3819":-1.404623587853125,"3820":-6.862368187883465,"3821":-1.9612764693181222,"3822":-1.3347765498991175,"3823":-1.6464016233075598,"3824":0.49809213595220747,"3825":-0.9687948398340099,"3826":1.2289256869015472,"3827":-1.7861080840824932,"3828":-0.7468782143566258,"3829":2.1642443510202005,"3830":-0.4935247145219924,"3831":-4.012318927178639,"3832":-1.0198483352090668,"3833":3.5246585766005754,"3834":-3.3459996521396937,"3835":-1.2687046148626127,"3836":-1.5652265516636086,"3837":0.5673323488081549,"3838":-0.876440610591986,"3839":-1.3883750515693551,"3840":0.4894388958152613,"3841":-0.34864929010481427,"3842":-4.430758114364495,"3843":-2.131764362380264,"3844":-1.0596886603928577,"3845":4.1826801125155315,"3846":1.3375392822723624,"3847":0.6486356015574778,"3848":-2.300985826668697,"3849":-0.6621694067177659,"3850":1.4774066379792414,"3851":0.4469534295520748,"3852":1.4887906943332683,"3853":0.1765370052312552,"3854":0.6865813063009433,"3855":-0.5819638214169278,"3856":-0.4247824597816345,"3857":4.598071214045878,"3858":2.2783198286161404,"3859":1.429767560944486,"3860":1.1031211163669459,"3861":1.0165519719006693,"3862":0.9715269616793337,"3863":-2.3106199461532784,"3864":-1.1023004396654212,"3865":1.8048257940434391,"3866":4.192465342031658,"3867":2.604416226118006,"3868":1.5753843648931112,"3869":1.1499824426811778,"3870":0.8323250171073316,"3871":0.9459677228499507,"3872":-3.058092999000475,"3873":-3.0752693280637615,"3874":0.8571816679360659,"3875":3.053087368777137,"3876":3.5050368103036433,"3877":0.916383758198962,"3878":0.9090591497873124,"3879":0.6907614770558747,"3880":0.7080992697057991,"3881":-4.423547945802105,"3882":-0.8134719611344566,"3883":-1.258414530586474,"3884":2.5982091300137644,"3885":2.6598206027064166,"3886":0.937244238657097,"3887":1.251120630750439,"3888":1.1816484435257815,"3889":0.93205295180267,"3890":3.3022116149736185,"3891":-0.603499629589979,"3892":-4.822644757125675,"3893":3.967451470784739,"3894":1.9800963745295517,"3895":1.6935864215486234,"3896":1.0060318263903296,"3897":0.7745914721777802,"3898":0.4455987083446354,"3899":1.088115391651873,"3900":-2.2454416130617982,"3901":-4.504788859917994,"3902":3.793415146253625,"3903":2.0701160019272393,"3904":2.2174354675226815,"3905":0.8976578152378464,"3906":1.1842629546044046,"3907":1.3418827785637384,"3908":0.530021010765861,"3909":0.0751729259049013,"3910":-2.2004833780194653,"3911":2.82255771129004,"3912":1.8203049962745135,"3913":1.812784697100781,"3914":1.2809749728106743,"3915":0.6713007570943405,"3916":1.5459431008447824,"3917":2.237475572666945,"3918":1.6918803739745536,"3919":0.006956842253065412,"3920":6.994596339757422,"3921":2.9960604310338526,"3922":1.7083983263974014,"3923":1.2636459295858846,"3924":1.1656559326052411,"3925":0.6715221220937013,"3926":-0.9606514339218247,"3927":-2.3941548171885643,"3928":0.09138740022643373,"3929":4.359413116481151,"3930":2.7028399730843833,"3931":2.170625430553098,"3932":0.9632563997648695,"3933":1.0673095264876329,"3934":1.016023437393661,"3935":2.363066354815355,"3936":-0.5333371034718729,"3937":-0.424246390063955,"3938":0.333400544332877,"3939":0.6020497210936631,"3940":0.021489726800869174,"3941":0.9712876005125215,"3942":-0.010912616670961427,"3943":0.267378911574659,"3944":-0.3385840173999556,"3945":-0.7360806439122959,"3946":-0.06942472006354672,"3947":1.1859613237773736,"3948":0.1852789890224581,"3949":-0.005638255589206532,"3950":-0.24108392472917203,"3951":-0.11727689223981963,"3952":0.6741988132196344,"3953":0.017041869040169175,"3954":0.8610619430956223,"3955":0.04176692982806139,"3956":0.5453921115621524,"3957":0.21368323356590074,"3958":0.07016513409906303,"3959":1.3648033208036736,"3960":0.9699662598833844,"3961":-0.048724991335653965,"3962":0.39721868323458454,"3963":-0.22002605134247716,"3964":-0.26275449489712727,"3965":0.38843913012392894,"3966":15.248083294042345,"3967":14.725389275940445,"3968":7.618325937068059,"3969":0.7008100313644682,"3970":0.31597240124073206,"3971":0.0700453477042739,"3972":-0.5435449020165204,"3973":-0.036748736081729926,"3974":-1.0095137086652095,"3975":0.014586900735554497,"3976":-16.021892033094854,"3977":-0.08558206193953546,"3978":-0.06800617768013614,"3979":0.10200205424751439,"3980":-0.6929316453488242,"3981":-0.4177233749633305,"3982":-0.2818737158502861,"3983":-0.3143191420558395,"3984":-4.799737287581459,"3985":-5.038396135936167,"3986":-3.9266138894104192,"3987":-1.526904134507563,"3988":-1.2871436962639862,"3989":-0.181910602041547,"3990":-0.16305894911702024,"3991":0.09956370573477664,"3992":-0.09215101340817042,"3993":0.6036725706671026,"3994":0.20337064185460735,"3995":-0.16815656685286726,"3996":0.4531180325693472,"3997":0.1927124492919177,"3998":-0.1823031089474365,"3999":0.4317971226879553,"4000":-0.14604134305116873,"4001":-0.11611662682642822,"4002":0.05881569041890875,"4003":-0.19445768235936056,"4004":0.4945626219035811,"4005":0.06258016732371664,"4006":0.06786535821387538,"4007":-0.36623934564623173,"4008":0.37707384248144227,"4009":-1.1152820922546087,"4010":-0.20358481465978343,"4011":-0.40185157864030757,"4012":0.04056689371553287,"4013":0.33095784249816795,"4014":-0.5461772524632331,"4015":0.5245958415837607,"4016":-0.6456810071216196,"4017":0.8882889467227151,"4018":1.1394999788299225,"4019":-0.04800744111209401,"4020":0.3036337831212148,"4021":0.22909434202230936,"4022":0.5173478761029362,"4023":0.10243600098534197,"4024":0.09241044089149439,"4025":1.064695736413197,"4026":-0.20079838551302506,"4027":0.6668683088155107,"4028":1.1573937501697353,"4029":-0.3755594283323024,"4030":0.5003715736661812,"4031":-0.28571693719165325,"4032":-0.890256611006758,"4033":-0.050878197323860876,"4034":0.6370070149969723,"4035":0.43921676435346474,"4036":1.0316299010645094,"4037":-0.9024729140747163,"4038":0.6817786477799371,"4039":0.32581015162359406,"4040":-0.5772614313773221,"4041":-0.06575088055791728,"4042":-1.1523622044720532,"4043":-0.09660581866807222,"4044":-0.3565642757219014,"4045":-0.4433972232955519,"4046":-0.3515831468766682,"4047":-0.1709726953176508,"4048":-0.8673603494236013,"4049":-0.04497869281341499,"4050":0.027028994215343584,"4051":0.8877380389948404,"4052":1.2626661188463641,"4053":-0.05384709752847796,"4054":-1.0506225558293787,"4055":-0.38805627628272843,"4056":0.9845524282335296,"4057":-2.2508921446168833,"4058":0.6139706052687551,"4059":-1.0262103868811827,"4060":-0.12374712201403214,"4061":-0.1741865720363655,"4062":0.1919072627409019,"4063":-0.41497098510553043,"4064":-0.04228608325321614,"4065":17.790754687328917,"4066":-0.24258993819394187,"4067":-1.4993896873411103,"4068":-0.4127674503385554,"4069":-0.1451350094493657,"4070":0.5206432473464753,"4071":-0.9407858255021315,"4072":-0.37160349413020505,"4073":1.0468948714023834,"4074":-0.08718216199710366,"4075":-0.8466795658304775,"4076":0.2650619399967564,"4077":-1.1430463957439125,"4078":-1.9305348289964805,"4079":-0.18995392965676533,"4080":-1.7884193273963414,"4081":0.1282562994929155,"4082":0.3193670269220366,"4083":-0.114601854700878,"4084":0.2865914721941344,"4085":-0.9435434754873494,"4086":-0.6383667901445498,"4087":-0.1657869691134045,"4088":0.929808565237813,"4089":0.20529599695788917,"4090":0.6732757117041798,"4091":0.3208550273722346,"4092":0.3591691871334947,"4093":0.30928639058925195,"4094":1.0274469448107777,"4095":-0.5547734171703264,"4096":-1.1534918064364763,"4097":-0.6136271697177144,"4098":0.06195285687706637,"4099":-0.8599378100168281,"4100":0.9728405249605186,"4101":0.13087603777330745,"4102":0.41517642837891905,"4103":0.1323667820471888,"4104":-0.7701497419544381,"4105":1.7597212679369754,"4106":-0.7084020005215683,"4107":-0.2774060137392303,"4108":0.22236732671014164,"4109":0.3586071100231111,"4110":1.2557312110405163,"4111":-0.9804063735854012,"4112":-0.17856417224004922,"4113":0.062647437774118,"4114":-0.44793126007409395,"4115":0.48902915807542946,"4116":-0.36777332440683563,"4117":0.8487792824139104,"4118":-0.9138268651598475,"4119":0.14142472263925296,"4120":-0.7039949153030999,"4121":1.662808748623726,"4122":-0.056111564159604235,"4123":0.33471680891400246,"4124":1.0177172934781504,"4125":-0.7183668689766439,"4126":-1.3317719199433606,"4127":0.1981493115107942,"4128":-0.5128104290757349,"4129":-20.74886676213394,"4130":1.1958363525993967,"4131":0.6929111950605987,"4132":1.9647284459059615,"4133":0.3037798728420416,"4134":0.027697693724988603,"4135":0.1400958571745172,"4136":0.7837418549103851,"4137":-0.291503484667527,"4138":-2.445987597042169,"4139":4.067639688868172,"4140":1.109375868672173,"4141":0.8037289818104963,"4142":0.36356270003043095,"4143":0.3091871734107289,"4144":0.20313310463588624,"4145":0.44470545479310886,"4146":-0.7973967427753136,"4147":-0.9444084287491915,"4148":0.6763431098382436,"4149":0.028192609235410948,"4150":-0.3906840972511199,"4151":1.1181987623929193,"4152":-0.5720412159240705,"4153":-1.0383089558882836,"4154":-0.2793715970935499,"4155":0.9870531023190523,"4156":-1.3290565961658358,"4157":0.13229638902286267,"4158":0.22970987134953788,"4159":-0.2092263174962941,"4160":0.7975274352262465,"4161":0.1408049357273874,"4162":1.1194776341038986,"4163":-1.3259579523662812,"4164":1.1684998387625825,"4165":-0.07038295784304828,"4166":1.9136227639068903,"4167":0.4558052132100079,"4168":-0.25165451678606693,"4169":0.26374466410559366,"4170":-2.93159484527744,"4171":-0.3552812240553527,"4172":0.3331996026027179,"4173":-0.6742163463995239,"4174":1.0683340896432654,"4175":-0.1782113544969772,"4176":0.9813270404598824,"4177":-1.345335213997251,"4178":-0.3092034084287087,"4179":-0.31228904344643543,"4180":1.1720866475356777,"4181":0.5372935364049676,"4182":-1.0313927635709847,"4183":0.6058048032214617,"4184":0.6940498606951391,"4185":0.29451468446182355,"4186":-0.010666867860923577,"4187":2.907677699198743,"4188":-1.3695066719252122,"4189":0.6424441591077139,"4190":-2.06705395940974,"4191":-0.5708181870342934,"4192":3.1545257462183103,"4193":2.557629278012406,"4194":-0.8390139291827055,"4195":0.2939553903438544,"4196":0.042578274843758715,"4197":1.323158775688142,"4198":-1.2069764326679184,"4199":-1.3440501605392037,"4200":3.8913188086578008,"4201":0.2985765369550944,"4202":1.0091998329075356,"4203":-1.1334713103809633,"4204":-0.46546915898765046,"4205":-3.1960285429008284,"4206":-1.2061869273042058,"4207":2.403218063862911,"4208":-1.7122544437761276,"4209":-1.8229477747996408,"4210":-0.3811288520579001,"4211":0.4980142386330849,"4212":-2.4972486394852367,"4213":-0.6395971902438431,"4214":-0.6862395164704632,"4215":0.4372198431750113,"4216":1.5186201434265103,"4217":1.9030728411654332,"4218":0.9888191653041043,"4219":-1.3469247906585258,"4220":-1.6819182258180758,"4221":-1.4728305455762318,"4222":-15.244882044422498,"4223":2.7290841312399987,"4224":0.8409345984908478,"4225":0.3915557247774279,"4226":0.14165560494487425,"4227":-0.9988216649567221,"4228":-0.8289898273952754,"4229":-0.6953088714215684,"4230":-3.3733880515877677,"4231":-5.186288052407061,"4232":-0.04868345651529947,"4233":-1.1573738154048963,"4234":1.368495443052772,"4235":1.4375258791686467,"4236":-0.6979471143955065,"4237":0.060065931344948115,"4238":0.44932485620579704,"4239":0.7155968903049378,"4240":-0.36711107735777954,"4241":0.7897135903689698,"4242":-1.5863876419678913,"4243":1.3261069372936964,"4244":-0.657034396637935,"4245":1.9609706960204047,"4246":-1.172866904042445,"4247":0.3428568154836001,"4248":-1.4024195161601891,"4249":-1.1517399058396736,"4250":-0.6929342878050697,"4251":0.29895049213026836,"4252":2.621006182613117,"4253":-0.6710202927575114,"4254":-0.4538470777238452,"4255":0.06215657308063471,"4256":1.9482766056626364,"4257":-0.8403961572707641,"4258":2.6495250411916365,"4259":-1.8557938977103652,"4260":-0.7989720114883406,"4261":0.28993283834606504,"4262":2.246927267755199,"4263":2.273286181907735,"4264":2.2262612493988256,"4265":0.6618781288128353,"4266":-0.24807598281640753,"4267":-1.696697523671992,"4268":1.042067213653657,"4269":-1.3186753640492674,"4270":-1.1174752688981662,"4271":0.27935829499089443,"4272":0.11431125980864519,"4273":0.7719340943942871,"4274":-0.5217299607052499,"4275":2.7340968047749765,"4276":0.9523536285090044,"4277":-0.9697394217460501,"4278":-1.5736146650869887,"4279":1.193050474444183,"4280":-0.06798462206005669,"4281":-0.1380397406497784,"4282":-1.2278499668345109,"4283":0.4001289617982459,"4284":0.10634058635921904,"4285":-3.316395801847174,"4286":-0.7155646096974106,"4287":-2.196011895443471,"4288":-1.5590408016570334,"4289":-0.24600266997755268,"4290":-0.45978503274917926,"4291":-0.21441926193044808,"4292":-0.42825415041063014,"4293":-0.7453417115340099,"4294":0.06498604000117988,"4295":2.03564145357861,"4296":0.2830886809422202,"4297":-0.27283839308784225,"4298":1.15893212524754,"4299":0.9870163659919379,"4300":0.5596379003354508,"4301":-1.1239270186635493,"4302":0.32342851295473385,"4303":0.3692313802625577,"4304":1.382726867971944,"4305":1.834942017466459,"4306":-2.132235540850135,"4307":0.2225113754408069,"4308":0.44947156629119217,"4309":0.11630881492250379,"4310":-0.41235776064200025,"4311":-7.775918468720009,"4312":-18.00035780919306,"4313":-1.524089463223022,"4314":1.524503365195314,"4315":1.9786549162090854,"4316":1.9723402435644228,"4317":1.7560533152226672,"4318":-0.06087957454475055,"4319":0.182706631580718,"4320":-5.999701406392576,"4321":-2.4906964018332824,"4322":-3.0675416321549243,"4323":-1.9984015211867276,"4324":1.8789559475386075,"4325":0.5980395043159838,"4326":-2.237904611789399,"4327":-0.3947839763558997,"4328":1.5279881446693586,"4329":0.39982428377294676,"4330":-0.21441767975233014,"4331":0.24438831540137054,"4332":-0.2695474141139763,"4333":0.9009659853446678,"4334":-0.5587383715725,"4335":0.32306387781466805,"4336":0.3955431170895468,"4337":-0.48010749215504617,"4338":-1.6885747460079819,"4339":1.9562697765115058,"4340":2.6263750347493926,"4341":-1.7307563681021554,"4342":1.2071522137745676,"4343":-2.0861424153133323,"4344":-2.0911325919174883,"4345":2.0089280963202634,"4346":-2.03333911386404,"4347":-0.8653765125175271,"4348":0.38909418575046867,"4349":0.90034817310595,"4350":-0.8661804836976149,"4351":-2.1914339631427704,"4352":-1.0993015587898953,"4353":-0.28795633823632827,"4354":-2.982743579703458,"4355":0.17856832869775083,"4356":-2.2877351979138565,"4357":1.1604125385318989,"4358":0.04151668030685506,"4359":0.8473816519515446,"4360":2.1349424882860153,"4361":1.0253973972897927,"4362":-0.21256474104256415,"4363":-1.3618667927959571,"4364":2.139803138516516,"4365":0.029698172548306277,"4366":2.7108189827351055,"4367":1.057635198918229,"4368":-0.7018004695029065,"4369":-4.0774603598684775,"4370":-2.6631340270800363,"4371":-0.36489382478638055,"4372":0.3844797752538479,"4373":0.007280222425095073,"4374":1.879246038028859,"4375":-2.709256033324005,"4376":-4.290225207788883,"4377":-1.2342050982300052,"4378":-3.4505714125325513,"4379":2.4402555370789827,"4380":1.6324380432215093,"4381":0.8076089271734083,"4382":-3.9478893623154607,"4383":1.244448540591316,"4384":0.9117677259161988,"4385":2.4913969538759124,"4386":12.469149064463435,"4387":15.133741579141427,"4388":5.228153689247199,"4389":2.9011183869815653,"4390":1.8819479597643012,"4391":0.5078059143190765,"4392":0.09679397822139414,"4393":-2.32289973796828,"4394":-4.232387842651896,"4395":-4.491578484894995,"4396":-2.0587467652041385,"4397":1.5039380292706837,"4398":-0.06328741240581258,"4399":0.6360266585365295,"4400":0.16607265257236112,"4401":0.21599605816735953,"4402":-2.568987852674792,"4403":-1.2596055530933397,"4404":-0.10790036394397291,"4405":-1.2382167572501483,"4406":-0.7662658236081357,"4407":-1.2083089085515322,"4408":2.142546855852937,"4409":2.3892241248600667,"4410":-0.01047644844391864,"4411":4.393641452583396,"4412":1.9953867779644827,"4413":3.2517387636334263,"4414":-1.101242020880252,"4415":-1.1660884205116209,"4416":-2.4386649747832205,"4417":-3.3833924932225834,"4418":-2.023496789579067,"4419":-0.10819138629422309,"4420":-0.7338462477374961,"4421":1.3349528991264024,"4422":0.1564130479454282,"4423":0.9742891925577285,"4424":0.16254461870409673,"4425":-0.20379149756690404,"4426":-0.14598431864471842,"4427":0.07515427729402198,"4428":-0.03226981150854618,"4429":-1.2584015430610866,"4430":-0.11626994464245327,"4431":-1.1632014564031932,"4432":-2.2157356156579495,"4433":0.7289842338613256,"4434":-0.9112434276423352,"4435":-1.251172275031599,"4436":1.3762450531974082,"4437":-0.876664340313536,"4438":0.7675745264035922,"4439":-0.8517370978361128,"4440":-0.9704863567175593,"4441":-0.25616902329033486,"4442":-1.7366533960962869,"4443":0.37836123297841573,"4444":-1.6816658909722417,"4445":0.9371148927303594,"4446":0.6773302202430401,"4447":-0.7056235267725821,"4448":-0.8959962226036033,"4449":-1.1404269771123694,"4450":-2.640164554538305,"4451":-0.03092020302936309,"4452":-0.2740876431633234,"4453":0.8022124047275734,"4454":-0.17251804603063328,"4455":0.6978180247118175,"4456":-0.4316187865912752,"4457":-0.37792856514683615,"4458":0.5738847707843878,"4459":1.6466139314276966,"4460":3.126952168511405,"4461":2.9827894185512736,"4462":0.5517998295132452,"4463":1.5563332831490266,"4464":1.6004187823690674,"4465":-0.5099449029071864,"4466":0.568296546157006,"4467":1.1712976003623075,"4468":1.9587147565968892,"4469":11.453542399644098,"4470":1.6616457267926072,"4471":3.0097321755501274,"4472":0.8270383037242797,"4473":0.2860089591873193,"4474":-1.0351829435699593,"4475":-0.27892423914546594,"4476":-1.1144228625890171,"4477":-13.211291016901084,"4478":-13.675389374651152,"4479":-10.636759767321523,"4480":-3.3454078599774433,"4481":-3.0306922729855645,"4482":0.09347829587862773,"4483":-1.2309644886097661,"4484":1.3936630286515728,"4485":0.3632860206552967,"4486":-0.6604570011738767,"4487":-1.7334458166269384,"4488":0.09545744806487082,"4489":0.5273840530556053,"4490":-0.28847414804811305,"4491":1.1535313453490854,"4492":0.4118858030211024,"4493":-0.07981990970936326,"4494":-0.7814404903643757,"4495":0.4440638821495999,"4496":-0.8045705252059608,"4497":0.1712443979235001,"4498":-0.8495383250826103,"4499":-1.7257915726821178,"4500":-0.19938125275626808,"4501":1.8476470651327765,"4502":-2.6137283129224542,"4503":-0.4288909211244666,"4504":-0.6512079645157066,"4505":-0.045396848601812256,"4506":-2.7827735445036623,"4507":2.0407000207918014,"4508":-0.39309012625519757,"4509":1.1732789325956248,"4510":-2.3873992392240817,"4511":-2.0274996617369867,"4512":0.08958186588719383,"4513":5.264514089249254,"4514":3.346210821148577,"4515":-0.2725075675344628,"4516":1.2244558450843612,"4517":-1.8174587052740003,"4518":0.3084686071188007,"4519":2.3344348824108705,"4520":4.059934361344969,"4521":-2.3109582395326522,"4522":1.2946214154854245,"4523":0.8186677431473434,"4524":0.5910822734002275,"4525":0.5659124225866601,"4526":-0.5766726811264173,"4527":-0.3337193663691919,"4528":1.1370535132761228,"4529":2.930835522844396,"4530":2.9133993667849807,"4531":3.563031100285328,"4532":4.305742580980604,"4533":-0.48840097462356896,"4534":-2.377249152969632,"4535":1.731873246949234,"4536":-3.3137272599788155,"4537":2.782689475652369,"4538":0.5877564540618567,"4539":-0.3210311017207171,"4540":-1.396151353022034,"4541":4.966964065101242,"4542":1.0077801567007503,"4543":-3.750925109739479,"4544":1.7401797829727854,"4545":-1.5809706936256218,"4546":-3.6317004199597323,"4547":-2.990213754214511,"4548":-1.5258678563314634,"4549":0.8724329557378431,"4550":-0.49417872003647806,"4551":-6.689165161193934,"4552":-0.7158546651229786,"4553":-2.9349133016534554,"4554":1.499722193200536,"4555":0.27021213796893706,"4556":-3.3094979768050963,"4557":1.8568360379692979,"4558":-1.3703293425136938,"4559":-1.4977368077405508,"4560":-2.219944122668775,"4561":-4.371187780022673,"4562":-3.687764249682272,"4563":0.9494914379001997,"4564":2.0716049555901113,"4565":0.28740981513436015,"4566":-2.242198142798294,"4567":1.8242389970691877,"4568":-1.6578912700726494,"4569":-1.4445682217216473,"4570":1.4180655452510091,"4571":0.509951438680933,"4572":0.16835428759733162,"4573":2.1572507945067025,"4574":2.4475330435003935,"4575":-0.12578969914654067,"4576":6.354100420609344,"4577":-3.262421928248056,"4578":-2.9343062416302716,"4579":0.0472626051865255,"4580":-3.816875545096246,"4581":0.11649275275261961,"4582":-0.3333326332282029,"4583":-5.283579246067105,"4584":-1.6320717480770888,"4585":0.1757488151580932,"4586":2.7742640334949895,"4587":-2.2724202732523224,"4588":1.9194765064959372,"4589":1.980605287349399,"4590":0.03520957150363415,"4591":-2.923979753111151,"4592":-0.10320088339134695,"4593":-0.12444184903539442,"4594":-1.0127703675500552,"4595":2.0595274409850917,"4596":-2.7187147753124496,"4597":-0.010316362833301944,"4598":2.652077361336973,"4599":-2.072372077186273,"4600":2.1599819243905647,"4601":-1.2088695645053675,"4602":-0.6367403070205504,"4603":1.4981495899041917,"4604":1.2665167500268153,"4605":-1.61619347656213,"4606":-2.6224170635115125,"4607":1.7474196743452701,"4608":1.6661141645408657,"4609":-0.026795874500226302,"4610":-1.0308582986456558,"4611":-2.102683341896473,"4612":0.19262196327796002,"4613":-2.028439514772391,"4614":-8.302324590902469,"4615":-2.751908171961925,"4616":-3.8742511249189886,"4617":-2.853977260210865,"4618":0.20421835410520958,"4619":-3.9261518264643844,"4620":4.552632036548107,"4621":1.8947371206684673,"4622":-4.638243934478061,"4623":0.4754134662527156,"4624":-5.987328428150839,"4625":-4.220209054890327,"4626":-1.0194686828864503,"4627":1.5009756786233273,"4628":5.25117069026325,"4629":-2.5922294611803713,"4630":0.9106641514001699,"4631":5.117346799621235,"4632":3.0310299745901244,"4633":2.99650639737138,"4634":6.4109233512948585,"4635":0.18106524517394063,"4636":-0.7319985523395734,"4637":2.5096514559918552,"4638":-2.8207631683497003,"4639":4.395417807376194,"4640":-0.8683956467441277,"4641":-0.7947423284877397,"4642":-0.8572077893591509,"4643":-1.3017123831967305,"4644":0.7528056503497442,"4645":-0.3992103611374268,"4646":2.834539400995113,"4647":-1.9271976104618629,"4648":4.364707578269522,"4649":-2.6314255035925864,"4650":-0.8072557374924212,"4651":0.10358007474441056,"4652":1.698668084786899,"4653":-1.6890807480352346,"4654":-0.7234578706855334,"4655":1.678969440901984,"4656":0.14838686307364257,"4657":-1.6684013383498442,"4658":-2.6263571422891445,"4659":-1.6330048493811544,"4660":2.562033998558379,"4661":-0.09056075952597543,"4662":0.07731010273509116,"4663":-0.32425775279154007,"4664":-0.6999271617957838,"4665":-0.6913081720430578,"4666":1.6754777247500778,"4667":0.44565821749821016,"4668":0.6788026368983642,"4669":-2.863966270839606,"4670":-1.6717928641442017,"4671":0.5217802239114809,"4672":1.2160849352081204,"4673":-0.22498072723670398,"4674":2.865221925439011,"4675":0.633264662458322,"4676":1.7792642938977108,"4677":1.974518844121314,"4678":3.622803994138618,"4679":0.6338772277120825,"4680":1.5088282895081657,"4681":0.263497198612821,"4682":0.06045008901653081,"4683":0.06469425352822256,"4684":-0.38817031359209697,"4685":1.8269724308297635,"4686":1.2150638897651478,"4687":0.1746507787544382,"4688":2.151350272170989,"4689":1.0167320843668548,"4690":1.08524628479924,"4691":0.9125137874196579,"4692":-0.6841830170471899,"4693":-1.9600912089340472,"4694":0.3093327724684611,"4695":4.447301874709023,"4696":2.4211595086418636,"4697":0.3096142487283788,"4698":1.9083225790776397,"4699":1.4959256226964635,"4700":0.6836869672753272,"4701":1.1929201397070937,"4702":-1.6933163655183587,"4703":-0.6327847437952041,"4704":2.3902282229224454,"4705":0.4386057820398845,"4706":0.8506275376039776,"4707":2.090130311299172,"4708":1.6772117720634248,"4709":1.3758481025372182,"4710":-4.342508233433386,"4711":2.4261447083813703,"4712":-7.514509606007677,"4713":4.425133124747694,"4714":1.6638155104748296,"4715":0.6095956259288942,"4716":1.972470610659813,"4717":0.015227540558368821,"4718":1.3397916149518818,"4719":-0.0005152514518764834,"4720":0.5672143254537133,"4721":1.4330996440609738,"4722":3.482167155984027,"4723":2.755914630152838,"4724":2.0257727544102946,"4725":1.0529847909585037,"4726":0.4752427427342101,"4727":1.281855542431986,"4728":-2.4645385543069622,"4729":1.9413166227601046,"4730":-1.7283963147969426,"4731":2.5189189243375334,"4732":2.5904181935092385,"4733":1.5292903845351988,"4734":0.7745730557394012,"4735":1.040818782763498,"4736":1.0866317483396535,"4737":0.7690097768610826,"4738":0.5729530724757527,"4739":0.787541560441992,"4740":3.333522489028469,"4741":0.9870864149001951,"4742":0.8809120036583041,"4743":1.1171090578722174,"4744":2.1031153050904017,"4745":1.6797056541759414,"4746":-2.527531528806097,"4747":1.5710014980500553,"4748":1.5834645082550092,"4749":2.611965400070694,"4750":2.00216009625467,"4751":1.5229635596395064,"4752":0.9376797293253349,"4753":1.8872816782179873,"4754":0.14052371742010467,"4755":0.8902793706063655,"4756":-0.5108117767424204,"4757":-0.13486202956938162,"4758":-0.32204766716662486,"4759":2.6946387724032452,"4760":0.5524911670184202,"4761":1.3268583256204123,"4762":0.447574646246897,"4763":1.0477922178598045,"4764":0.7954433824818676,"4765":1.4278675518915338,"4766":0.30291414965061514,"4767":-0.18051377852824996,"4768":3.073206770244038,"4769":-0.23715357648772803,"4770":0.030289177270021252,"4771":0.8644017066715928,"4772":1.2854168291507764,"4773":0.2553210444158662,"4774":-1.9180348426243035,"4775":2.6041252950000677,"4776":0.07314827882951158,"4777":0.7007581489254145,"4778":-1.88265344425767,"4779":-2.0445437729185505,"4780":-1.1197737439799702,"4781":1.3026366239785312,"4782":2.9819512121967766,"4783":1.2784722866965654,"4784":-0.11083580959997064,"4785":2.0981134127515753,"4786":-2.0970058849047417,"4787":6.740543987278762,"4788":14.12658176571639,"4789":9.741086764898789,"4790":8.444942249029358,"4791":4.085950912527118,"4792":0.8055551507052112,"4793":-0.6191915785555191,"4794":-1.2981195946183426,"4795":-2.9964703151692462,"4796":2.228578050919625,"4797":-6.7664498682448455,"4798":-4.880884064905371,"4799":-2.2042552494742895,"4800":-1.3837444222338244,"4801":-0.1730004299597229,"4802":0.08006793967949159,"4803":0.7755419130112525,"4804":-1.9628327330401647,"4805":-3.1727991139543423,"4806":-2.564857659665068,"4807":-3.2144170869159514,"4808":-1.4421233434414715,"4809":-2.0330602275575576,"4810":0.976223633918939,"4811":0.7071212814371681,"4812":-2.5537989439690363,"4813":1.8674819444371604,"4814":0.7911606348457316,"4815":-0.13416675361532635,"4816":0.2193182310658929,"4817":-0.8375491167700562,"4818":-0.2062174300650065,"4819":0.7876017532735409,"4820":-1.0191830008469382,"4821":-1.9348882130181262,"4822":-0.04376965239088703,"4823":1.1258995410981096,"4824":0.18274082384784926,"4825":-0.07227059603588663,"4826":-1.2845134436623662,"4827":-0.10231681539593217,"4828":-0.08443401837595843,"4829":1.518033700362942,"4830":-0.3672637467483948,"4831":0.6802710080361207,"4832":2.6477680641048593,"4833":-0.5847443893680647,"4834":3.017140470020978,"4835":0.1649543917535692,"4836":0.6445091870390229,"4837":0.052312570477535125,"4838":-0.7141198902403301,"4839":-1.0954365183555417,"4840":0.8853420269119454,"4841":-3.121249894490851,"4842":-2.412214403499952,"4843":-2.086640618858174,"4844":-1.0039270520269463,"4845":-0.7905836294109172,"4846":-0.8877156043142993,"4847":1.6682834865812488,"4848":0.16534411329993803,"4849":-0.9433656149578588,"4850":-2.421416299652393,"4851":-2.981033533967391,"4852":-0.9257149893430342,"4853":-0.6087417605915006,"4854":-1.2492416697932878,"4855":-0.881934564394373,"4856":-1.1022121595735364,"4857":-2.7398455966562603,"4858":-0.4761263399938605,"4859":-3.2346801965603933,"4860":-1.8408022038318779,"4861":-1.2458573203105106,"4862":-1.0366625505720626,"4863":-1.0983802167691659,"4864":-0.6849181642624455,"4865":-1.9725031505662716,"4866":1.5679824045951225,"4867":-0.35048954356189954,"4868":0.7060820599159213,"4869":-1.8322011223989048,"4870":-1.250050299994797,"4871":-0.2847603534636507,"4872":-0.7553797317917275,"4873":-0.8431464086962427,"4874":2.9204844241140226,"4875":-2.1178937729066885,"4876":8.171791260162907,"4877":-0.6816018306187388,"4878":-1.9717112570174673,"4879":-1.2764527116809123,"4880":-1.0164219466917355,"4881":-0.7325756010634301,"4882":-0.5507115478426114,"4883":2.5368129936379473,"4884":1.2699101811068356,"4885":-0.9064164091209689,"4886":1.224576187915055,"4887":-2.742454096546333,"4888":-2.2678597277795283,"4889":-1.0845457039612494,"4890":-0.30634945124665647,"4891":-1.2726647814033802,"4892":-2.5802145412881954,"4893":-1.466299593305207,"4894":-1.2864580443739635,"4895":-1.6857824682677578,"4896":-1.982967874943145,"4897":-2.002050821755103,"4898":-0.5449175998488008,"4899":-1.049966221252768,"4900":-0.9407450196912183,"4901":0.8964029511585743,"4902":-0.9051097625138337,"4903":-1.7229073723218113,"4904":-3.2538201615601023,"4905":-3.2903400486982597,"4906":-1.9596412552886533,"4907":-0.9092721276683491,"4908":-0.9468565978016891,"4909":-0.37266177502158226,"4910":-0.6770225362082,"4911":-1.0753602503965365,"4912":1.7837684688406696,"4913":-3.0509347555463946,"4914":-0.7898833282644487,"4915":-1.4942018229850054,"4916":-1.3592628881591515,"4917":-1.1149324099241558,"4918":-0.8069868929942383,"4919":-0.913610940811506,"4920":-0.9933825421763478,"4921":0.6718449471796301,"4922":0.2089456769421849,"4923":0.6838521854435311,"4924":1.2832289180186833,"4925":1.8538981376418053,"4926":-0.8773436401561436,"4927":2.6487879432281196,"4928":-1.5551717892457162,"4929":4.781323335193822,"4930":0.7721939469213461,"4931":0.2998663913673128,"4932":0.8632348621602344,"4933":2.0208157432148517,"4934":-2.2705597358358443,"4935":-1.6047088636588074,"4936":-3.830539533304866,"4937":1.25950660883078,"4938":1.1010555636709272,"4939":2.3732552861060308,"4940":-2.090702917292082,"4941":4.715854567894397,"4942":0.4796400358781379,"4943":2.22487099056266,"4944":0.3530294223045845,"4945":-1.8866301074637084,"4946":-2.7869935811361897,"4947":-1.5596305089500804,"4948":0.04925844732069837,"4949":-5.683766922259086,"4950":-5.200919919106315,"4951":-3.237240647823139,"4952":-0.7721080869271287,"4953":-2.5120375670649397,"4954":-3.2598497915693905,"4955":-1.7497684820855235,"4956":-1.52814355350515,"4957":4.672542970516164,"4958":-0.9701265338520154,"4959":2.0994898743883406,"4960":3.8165723738971282,"4961":0.2092226897471708,"4962":0.3563049658431548,"4963":3.0722540375190133,"4964":1.4371183147917923,"4965":-0.4707813573353132,"4966":-3.112028695230008,"4967":1.8972138392918496,"4968":2.1820014780283343,"4969":-2.201608663168165,"4970":3.040135313671513,"4971":-0.9157059265683386,"4972":-3.1526757180873526,"4973":-3.5281218056259167,"4974":-2.009597452687843,"4975":2.422249031305203,"4976":1.282072540460632,"4977":3.922105484351221,"4978":5.002372167833796,"4979":0.7498382898389684,"4980":6.514810285167454,"4981":1.6254961813765985,"4982":-0.06508165488802038,"4983":-0.4726089058365367,"4984":-1.0610936340302761,"4985":5.765871432983147,"4986":-1.6972783431833351,"4987":3.323208033811107,"4988":0.9784055408319368,"4989":-0.21165160041595404,"4990":1.3180787940524215,"4991":-1.0059501002701727,"4992":-0.35554536529375974,"4993":-3.303199697560212,"4994":0.879598217139607,"4995":1.9665185974501704,"4996":-3.3128446374835794,"4997":-6.369635612929733,"4998":-0.4281701797734604,"4999":0.9825660840545548,"5000":-0.2998302770366384,"5001":0.9150115411851507,"5002":-2.015866844525298,"5003":2.776717711945204,"5004":0.21696791058193074,"5005":1.5873506927839736,"5006":-1.182230947613476,"5007":0.3830303337271635,"5008":2.485471292835202,"5009":-3.116433606384167,"5010":-1.9535402686336132,"5011":-2.623390411831823,"5012":0.27807284329046583,"5013":2.0848475494807843,"5014":3.1785041267120997,"5015":0.24964624365909185,"5016":-0.42976766058958077,"5017":2.5422723597382966,"5018":-1.0740196643464004,"5019":-0.947194244312911,"5020":0.1465177764694174,"5021":-0.7654939995321411,"5022":-0.9283917310188179,"5023":-0.4624736526368698,"5024":-0.2894094610745006,"5025":-0.5628584740963579,"5026":1.7677819875910323,"5027":0.14059509942391563,"5028":0.3877616805527756,"5029":1.1726311894210737,"5030":-1.5256677146153743,"5031":0.8554344984063582,"5032":5.572886672342635,"5033":5.474274562526239,"5034":4.1938015357207705,"5035":-2.490287411560864,"5036":-2.2037424579663947,"5037":-1.26969590589674,"5038":-1.1914198193394698,"5039":0.552941483906413,"5040":3.3164641977674556,"5041":0.0103232915577662,"5042":-8.740133202443745,"5043":-9.961705558879062,"5044":-5.47160624828645,"5045":-2.1177096312266714,"5046":1.3592529877990027,"5047":2.091296295496395,"5048":-0.10646037165766142,"5049":3.8416496993885256,"5050":-0.15583298807154253,"5051":4.08444061415895,"5052":-1.2756747375966169,"5053":-4.708017803353538,"5054":-1.2342800041082347,"5055":-3.581750070913775,"5056":-1.3377180509218245,"5057":-2.4918589571363623,"5058":2.523218384618041,"5059":-1.0691676196978857,"5060":-2.260270819634074,"5061":0.8589067148580657,"5062":0.7575981711839945,"5063":-1.352853806941459,"5064":-0.1907266604912863,"5065":3.5205559171279246,"5066":1.5329247943036053,"5067":1.6237315480294008,"5068":0.22443850907639068,"5069":0.13785963483877034,"5070":2.0005009990742315,"5071":-3.850596811438623,"5072":-1.4710028546177651,"5073":-3.3878693095568626,"5074":2.4186537980191507,"5075":0.416534099750113,"5076":1.9019633775660683,"5077":-1.9260810882226664,"5078":0.2869003410772658,"5079":-1.716472037785792,"5080":4.419375496579734,"5081":1.7467301928445091,"5082":0.5632787690906778,"5083":-3.711149728568191,"5084":-0.346663322289874,"5085":-1.7682013037930753,"5086":-0.9558599895449262,"5087":-1.6194099108064985,"5088":-0.9426330902609038,"5089":-3.61576523334713,"5090":-2.177194499087147,"5091":0.4443941605053249,"5092":-0.37608987963328455,"5093":-4.452264477506571,"5094":0.9907412379184688,"5095":-0.3944270042058818,"5096":0.8011286222202999,"5097":-1.497610642528508,"5098":1.2747088288877506,"5099":-0.9269390568583048,"5100":-4.3300542495328935,"5101":-1.805424428846026,"5102":3.5979070689747017,"5103":1.82572503043168,"5104":3.4888012118929925,"5105":1.7435228157548173,"5106":5.163064116070146,"5107":5.329922329342322,"5108":1.469082976018588,"5109":0.6407860320451461,"5110":-3.283524609417526,"5111":3.2861492854200205,"5112":-1.3052475773185468,"5113":2.0183795207314983,"5114":8.03352219800336,"5115":0.7792892701233163,"5116":3.862053186550893,"5117":1.1993129509871048,"5118":1.2083955286167563,"5119":0.6313946862699616,"5120":-2.7695563430174888,"5121":-1.8591024638112357,"5122":-0.5826580375883172,"5123":-3.5526163785391436,"5124":3.0197738438575126,"5125":2.7116446841300093,"5126":2.2488410677491766,"5127":3.2164818744286774,"5128":-5.0889010554769545,"5129":1.848963421457193,"5130":2.4991754370691597,"5131":-2.4605653402484147,"5132":-4.342469602326097,"5133":-1.0554044997626024,"5134":1.0863587014027867,"5135":-3.9026109835689575,"5136":2.5052198605222977,"5137":-2.156569374863987,"5138":-4.025577507624612,"5139":-1.624514901123126,"5140":0.5637533652038144,"5141":-3.5858868984182624,"5142":0.706277813370083,"5143":1.8067277312361658,"5144":1.5494740516161922,"5145":-1.9127320418990983,"5146":-1.7897158943855214,"5147":-0.6835026834343442,"5148":1.0222366780844159,"5149":1.2889414785922992,"5150":-0.11084751768228163,"5151":-1.6504049680274806,"5152":0.249104657380774,"5153":0.607134630969389,"5154":2.4112186920350687,"5155":0.8621807743240889,"5156":-1.4042066122423935,"5157":2.7034530298708557,"5158":-1.0030884851220407,"5159":-1.2279993437126857,"5160":-3.4082254270495245,"5161":-2.7960374701190434,"5162":-0.2967466831892233,"5163":2.191896310197407,"5164":1.198213830875898,"5165":0.08293731787671899,"5166":0.6559065496163217,"5167":0.12147496202690276,"5168":-1.0242323177627037,"5169":-2.432782250886919,"5170":-3.511922210312167,"5171":-0.4972224246995071,"5172":-3.1114078540438874,"5173":-1.7039047534806044,"5174":-0.7483858840574101,"5175":2.8781036385323127,"5176":2.6598233998415393,"5177":-2.1033714047710497,"5178":-2.836768836662271,"5179":0.1505937708150214,"5180":-0.03002167910814886,"5181":1.2430700674509403,"5182":1.8604282409731967,"5183":-0.9811628390667108,"5184":0.6608812483851232,"5185":2.4639958561206665,"5186":-3.1093699718611547,"5187":1.6248668727511757,"5188":0.2628264689129098,"5189":-4.76692143397048,"5190":0.7188575580225907,"5191":-4.162016106317031,"5192":-1.2586703479544539,"5193":-3.258851309920132,"5194":-2.6788368603226638,"5195":-1.1659364692845922,"5196":-2.178461575344961,"5197":-0.36871077974508437,"5198":-2.9554867430652094,"5199":0.2087663527543748,"5200":-1.843966775292109,"5201":-0.9447717419820745,"5202":-0.6807610320472608,"5203":0.8626357065983279,"5204":-1.4177221347694053,"5205":8.015336248383807,"5206":1.3368100153578186,"5207":4.037636507207051,"5208":-3.6960866477128618,"5209":-1.3728850738773704,"5210":0.5399206158816826,"5211":0.6661466937220607,"5212":-4.440300033010046,"5213":2.0192631299773645,"5214":-1.049901960215711,"5215":0.9739918391874987,"5216":-3.485883956248762,"5217":2.8489539428276425,"5218":-1.2644510070850477,"5219":0.275579360370299,"5220":2.0422359806892887,"5221":1.613874163245035,"5222":2.081584299806961,"5223":1.0477776791102187,"5224":1.6838155333985119,"5225":7.125040920503166,"5226":6.0812175801967046,"5227":2.976255894202531,"5228":-2.8713473692327254,"5229":-0.780586442618147,"5230":-1.6418304583311911,"5231":-0.301592831465431,"5232":1.579176488432946,"5233":0.4226499968588932,"5234":1.6663244365212648,"5235":-2.396430783029207,"5236":-2.601315386891813,"5237":1.7274866929110726,"5238":1.9186932825557652,"5239":-3.699316513665272,"5240":0.5556459016828047,"5241":2.2343319928647043,"5242":-1.7715523403982183,"5243":2.4063085282435375,"5244":4.137792060810655,"5245":0.1621253498460172,"5246":-1.5512124823582227,"5247":-1.813236454073608,"5248":7.3798067406599035,"5249":-1.9467397380786156,"5250":3.5449752959474066,"5251":1.338811813612492,"5252":-1.9446687187395746,"5253":3.3329237660920046,"5254":-0.4191493324927329,"5255":0.25679946702508544,"5256":-2.011324016481739,"5257":-2.701887888169724,"5258":2.735905615853412,"5259":2.7033677606928608,"5260":1.8309785849633446,"5261":-2.096654680300158,"5262":1.0640350530104026,"5263":-2.2186899480134694,"5264":-0.04215693525414879,"5265":-0.3798599558442823,"5266":2.1907093055045372,"5267":-5.0224090985101775,"5268":1.0858780656387528,"5269":3.9052994185659546,"5270":-0.14148059755190767,"5271":0.8825745581409259,"5272":-2.1479977287295164,"5273":-1.0028660816454686,"5274":-0.6242009501096433,"5275":-2.723960035289449,"5276":-1.8711191901063697,"5277":-1.0069216707939443,"5278":-3.3014076947580895,"5279":4.781773251673375,"5280":-4.677420785333973,"5281":3.1256448111092756,"5282":-2.7070000314035623,"5283":-3.9053074653920903,"5284":-0.010244306922778518,"5285":-1.918324833553674,"5286":2.4401585859023025,"5287":1.500641162432611,"5288":1.4150459794552863,"5289":5.619533079665092,"5290":-4.4514438689961136,"5291":-0.1191492473355075,"5292":0.9202507630339773,"5293":0.12990085658493344,"5294":-1.2143004294889286,"5295":3.198084737347303,"5296":-5.324075084720863,"5297":2.708815109592609,"5298":-2.8650711023923137,"5299":-0.9987650717492156,"5300":0.7381983806324297,"5301":-0.3210636071101073,"5302":-2.1288521224288215,"5303":-0.150137349017135,"5304":-2.8893974667742066,"5305":-4.867657447725491,"5306":0.8230978878588882,"5307":-2.962960928771905,"5308":0.27642777467989127,"5309":-0.6010433775430493,"5310":0.09115272474265843,"5311":-1.082710722009415,"5312":2.2006090715510416,"5313":-0.9868434192500987,"5314":1.6892619243881422,"5315":1.116350942565809,"5316":1.9529500704096814,"5317":1.0611762916864984,"5318":-2.7612201980473468,"5319":1.1469579633039968,"5320":0.36204591125728075,"5321":1.393957155060656,"5322":-3.083087895277579,"5323":1.134372842890477,"5324":0.1902998283073988,"5325":2.6515937126898534,"5326":-1.0119690489180821,"5327":-0.49833441546373014,"5328":0.5886149058818202,"5329":-0.40489861694900975,"5330":-1.4677063002948407,"5331":-0.8212696762858215,"5332":3.046795996473809,"5333":0.8443823623161338,"5334":0.8929290208345156,"5335":1.1018602681883407,"5336":2.7720039204315396,"5337":0.43042342288186763,"5338":-0.7587611929651915,"5339":-2.0168086797330913,"5340":-0.45819295323922987,"5341":0.8705932104727583,"5342":-1.1044503420591774,"5343":-0.7352697634042705,"5344":1.1233166506545273,"5345":-0.7552113320277933,"5346":-0.7282386786913876,"5347":2.83585413120794,"5348":-0.1521364492224282,"5349":0.27730507690454,"5350":-0.9785040020604345,"5351":-1.4322758647186837,"5352":-0.4416798988186115,"5353":-2.7531976153141766,"5354":-0.7759428063298958,"5355":1.4558372779957665,"5356":0.8168390702100585,"5357":1.2849262675682231,"5358":1.0330814560740156,"5359":-4.935723224763677,"5360":-5.984897142314701,"5361":-6.356280386553937,"5362":-6.444278510715009,"5363":1.0243547516666662,"5364":0.8752862942409596,"5365":2.0650216567081596,"5366":-1.7764077694052074,"5367":0.6545613678842231,"5368":-1.599679403072267,"5369":2.0010136870397073,"5370":-0.5372350639938097,"5371":1.7876173365325558,"5372":1.2083384792198968,"5373":4.951484409843771,"5374":1.5984559325041812,"5375":-0.2302715015599383,"5376":-3.2194642194429317,"5377":-2.570566445575388,"5378":-2.0920790170254233,"5379":-1.4815630495866374,"5380":-0.5414025295172404,"5381":2.2986685975091805,"5382":1.0079185447825585,"5383":-0.9758074350909198,"5384":0.5290153363021823,"5385":0.7115702299482254,"5386":0.7917776345214804,"5387":-0.6777425264786395,"5388":-1.3577521488778492,"5389":2.492345587718896,"5390":-2.2485496662659874,"5391":-0.8693146697094916,"5392":-3.9912769077326486,"5393":0.7264589661272537,"5394":-2.8858812119181065,"5395":-1.4564415350858495,"5396":-1.7437586810929306,"5397":1.5371530196361913,"5398":2.6623030060492217,"5399":3.3153660770240503,"5400":-3.02947120071659,"5401":-1.8563515295971051,"5402":-1.4405229668987785,"5403":2.21212250790453,"5404":-2.942582192265984,"5405":-0.36885614185230164,"5406":-2.969433868395195,"5407":1.5476343830060395,"5408":-3.7494004728990795,"5409":-0.4929702925057641,"5410":1.5120863989626787,"5411":3.660863664420961,"5412":-0.8107679091431159,"5413":0.36525866595529244,"5414":-0.8951229521368943,"5415":2.721714770826829,"5416":1.5807474098515804,"5417":0.4433630431037592,"5418":0.9422591282102469,"5419":0.3688732990978984,"5420":0.6778386139208923,"5421":-1.0583368516558866,"5422":-0.005012693020012834,"5423":0.5523420757167494,"5424":3.3641970038126523,"5425":1.8191961886864876,"5426":1.1346219832632944,"5427":0.6859452119861694,"5428":0.4152954351685303,"5429":0.44581300287160824,"5430":1.7258835954149507,"5431":-1.2846414708058418,"5432":1.7646453020222213,"5433":2.99501882941521,"5434":2.2479124563867945,"5435":0.9439557483127605,"5436":0.43005637408278174,"5437":0.5957643157317607,"5438":0.031648375809570695,"5439":-0.06749863435612954,"5440":-3.1165389435858883,"5441":-0.725344638978658,"5442":3.2429324425229185,"5443":2.0176527552756744,"5444":1.4974021669983686,"5445":0.6069154837001646,"5446":0.6218350612303444,"5447":0.45663735475055467,"5448":1.1673360840042655,"5449":2.1334002908659757,"5450":-5.387521613214939,"5451":0.740849584702737,"5452":1.1397979956597655,"5453":0.9218437471741474,"5454":0.7780506442471327,"5455":0.02030766295281781,"5456":0.5129688051317276,"5457":-3.4240136550684284,"5458":-0.8391405110915224,"5459":-1.6236308518580667,"5460":3.3085469735025734,"5461":2.9494584426910597,"5462":1.6514046666641373,"5463":0.901723700898824,"5464":0.24478677940342783,"5465":0.33345890965751884,"5466":3.8277621770892565,"5467":0.6956537537307221,"5468":0.015934085250641,"5469":2.119130512113478,"5470":1.68328703678554,"5471":1.392717185043055,"5472":0.8956039173794533,"5473":0.6034087944111346,"5474":0.733646814604056,"5475":-0.336632590309573,"5476":4.238808673463618,"5477":0.47853721675388455,"5478":2.4680288458609065,"5479":2.1770644636460204,"5480":1.4049272074685573,"5481":0.6909037646573317,"5482":0.7565882539570488,"5483":0.0008230149556562245,"5484":1.3223060856930864,"5485":2.1094939891538838,"5486":2.9901811219259273,"5487":4.226167674718225,"5488":2.3402564829256045,"5489":0.9768832887338917,"5490":0.7440497931691282,"5491":0.8156979020329672,"5492":0.5664161902721104,"5493":0.14999146062288796,"5494":2.7568092046754553,"5495":-0.7022243670136149,"5496":1.5087701250605818,"5497":1.7729503807678373,"5498":-0.16755524584382797,"5499":-2.3956292625873417,"5500":-2.8299191826927492,"5501":-0.10727091887057094,"5502":0.3179887220067388,"5503":-3.0961570045748643,"5504":-1.7248706236838243,"5505":-1.0124605236521704,"5506":5.251114737957254,"5507":-0.4060058377997692,"5508":-0.19475037863583763,"5509":1.5729953682682785,"5510":0.4682872830034631,"5511":-1.488103815704833,"5512":-2.3363900159882003,"5513":-3.0817451032571737,"5514":2.760908160198291,"5515":-0.29178855446440194,"5516":-2.103303939988729,"5517":1.1673258509868558,"5518":1.3610827842512982,"5519":1.5362837539560348,"5520":-2.4618539197651383,"5521":1.0628599419185625,"5522":1.9307083535550043,"5523":0.4249916483688045,"5524":-3.4519455854387444,"5525":-7.41350110349828,"5526":-3.784241641843059,"5527":-4.603848671233448,"5528":-0.37269961537745905,"5529":3.911630506853274,"5530":0.09881030907806879,"5531":0.09412548984073416,"5532":1.8665455081111506,"5533":-0.7264184695193805,"5534":5.44649054970814,"5535":11.660641578754968,"5536":4.645863710271616,"5537":1.988417009377535,"5538":2.988527859019507,"5539":2.1847948305728706,"5540":4.452965412598133,"5541":1.7469263095379455,"5542":0.08493494276868126,"5543":3.7654218620571114,"5544":3.360249759065942,"5545":2.263846623541958,"5546":0.6447730012727498,"5547":0.4760504395907822,"5548":-2.604937233021819,"5549":-1.7278818313824564,"5550":0.14178653577539344,"5551":-0.5782711252802049,"5552":-0.08049890590473813,"5553":-0.06929696883124407,"5554":-1.365829297503405,"5555":-0.015111884328393908,"5556":1.5573584645139245,"5557":0.812815968329023,"5558":0.3825974794845219,"5559":1.9603142149499773,"5560":0.3056832547345011,"5561":1.2550559630393643,"5562":-2.943369579054257,"5563":-1.4506082228573132,"5564":-1.1115377634388353,"5565":1.772714768192956,"5566":-1.111189114404629,"5567":-3.4702736747135967,"5568":0.4047599345583957,"5569":-0.6733114353006927,"5570":3.264209989838044,"5571":0.6437298735994061,"5572":-6.630257816605168,"5573":-2.450223787600627,"5574":-0.8680166392070728,"5575":0.9453237534413905,"5576":-0.10857240243392763,"5577":0.6354130625651995,"5578":0.24165418627789445,"5579":1.1159425022197538,"5580":-0.13772681621546023,"5581":-0.5981380246360734,"5582":0.14287576468923832,"5583":-0.42524452718943173,"5584":-0.03375471377381917,"5585":0.2381115512107453,"5586":-0.314879109919326,"5587":0.9587969556356831,"5588":1.2032448103548776,"5589":0.522574080290033,"5590":-0.15594998930223758,"5591":-0.27835891939802304,"5592":-0.8227810563192022,"5593":0.9308713520592996,"5594":1.373801900017585,"5595":-0.2236784371527969,"5596":6.493841231302723,"5597":4.765880083534279,"5598":2.1069331040201,"5599":0.08329696333558356,"5600":-0.21401759241067445,"5601":-0.711685481518009,"5602":-0.2719361557651861,"5603":-0.013394270446052537,"5604":-0.46142295109014764,"5605":20.738435553936064,"5606":13.63157631342898,"5607":0.5395955715886426,"5608":-1.189308248236008,"5609":0.20640591476003237,"5610":-0.7018896276605302,"5611":0.05959349562830725,"5612":0.19914195530248066,"5613":0.4929180036109301,"5614":0.28608305092015707,"5615":0.4118323561073813,"5616":0.1360629660888481,"5617":-0.6322357909376379,"5618":0.8158272413572357,"5619":0.18290901460446646,"5620":-0.18812089760119016,"5621":0.14628058775545616,"5622":-0.006428344863148475,"5623":-0.8031249004144002,"5624":-0.12951528111483343,"5625":-0.541767774108236,"5626":0.16246652263631417,"5627":0.23548739249789774,"5628":0.12715281463233125,"5629":-0.09353426871796397,"5630":-0.03737946091642279,"5631":-0.2647372304514449,"5632":0.6343958198011017,"5633":-0.2799406111231542,"5634":0.0023389815416257932,"5635":0.1067082099074094,"5636":0.8434637744917958,"5637":-0.7829207985220423,"5638":-0.9921420069434128,"5639":-0.011320562760609042,"5640":-0.3625683672862508,"5641":-0.488316335738683,"5642":0.8587912488999357,"5643":-1.1640880581599737,"5644":0.8274908149119716,"5645":-0.1876338832859537,"5646":0.0013439097131841193,"5647":0.3542270988674599,"5648":-0.055260216766904825,"5649":-0.2352225940946652,"5650":-0.21692884715951904,"5651":-0.18542354505057018,"5652":0.2374150038555678,"5653":-0.2803903798102456,"5654":-0.16165217732415843,"5655":-0.16711446305689603,"5656":0.545775861225912,"5657":0.9053692391301862,"5658":-3.4584340097708903,"5659":-2.177379792755865,"5660":1.1492459922663845,"5661":-2.5924900586310464,"5662":-1.43354793988661,"5663":-0.7051072056140085,"5664":-0.34986899986044,"5665":-1.1829979701519533,"5666":-0.244511167213797,"5667":0.9265336431711536,"5668":-0.4946008949499663,"5669":-1.6074750842850685,"5670":-2.548480005009206,"5671":0.6392479930774999,"5672":-0.6704342286259205,"5673":-0.18003130760231592,"5674":-0.48666761772353456,"5675":-0.029707198573600213,"5676":0.951577992878883,"5677":-1.50544065261877,"5678":-1.6992788565618013,"5679":-2.4314879489285435,"5680":-1.2133100727006212,"5681":-0.8483138320413527,"5682":-0.4272265990791473,"5683":-0.8096958855473313,"5684":-0.7720287701547612,"5685":1.5369895485908955,"5686":-1.4677290176773221,"5687":-0.13902449435412162,"5688":-1.131369063418989,"5689":-1.5774975732093914,"5690":-1.0141875537370637,"5691":-1.2664019099709631,"5692":0.013821707921960774,"5693":-0.8216896682349241,"5694":-2.0623502302626795,"5695":0.022153608825108348,"5696":3.3014482942448766,"5697":2.6913029402563433,"5698":0.1004871702222445,"5699":-0.46460083265420393,"5700":-0.5072304736442615,"5701":-0.569730671664033,"5702":-0.8425381613346457,"5703":-2.0283828113527043,"5704":1.950099672938746,"5705":-0.1107203472103742,"5706":-2.5295468990118395,"5707":-0.8749777372330934,"5708":-1.0638332004019073,"5709":-0.5825179558679286,"5710":-0.13414237507913493,"5711":-1.350527329732005,"5712":-0.5392829825398978,"5713":0.9392745321332325,"5714":-0.2520377384868516,"5715":-1.5738626310116839,"5716":-1.7098199034645831,"5717":-0.7760829564404081,"5718":-1.2468456445778253,"5719":-0.8702840933418258,"5720":-1.4092740452758432,"5721":-1.944255500119654,"5722":-0.5374921774080792,"5723":1.13742805375133,"5724":-0.5165820583715514,"5725":-1.5412266309082452,"5726":-1.298936615411169,"5727":-0.7374467134145207,"5728":-1.0076168303403172,"5729":-0.5396292157749276,"5730":1.8970039808900845,"5731":-1.5156865676586704,"5732":1.0457013017191243,"5733":-0.9455959702055937,"5734":-0.621848885601998,"5735":-1.379465028006382,"5736":-0.16534705612467995,"5737":-1.3124978220307701,"5738":-0.40696714918033816,"5739":-2.44404212235906,"5740":-0.7361962644930724,"5741":0.6318024319227942,"5742":-1.1822374688611532,"5743":-0.7752241211956354,"5744":-0.01356926524707857,"5745":0.5555884392715716,"5746":-2.5983300043036617,"5747":-0.8676765325852288,"5748":-1.1162504766797396,"5749":-1.815060219179446,"5750":0.5935170224802008,"5751":-1.9784735653860193,"5752":-0.3715828049344211,"5753":-1.4043070838183094,"5754":3.200815755708647,"5755":-2.2389643514035047,"5756":-1.4515197175053167,"5757":-0.9649655656963047,"5758":0.8430070692858452,"5759":0.018253660200066392,"5760":-3.9682493437131514,"5761":-1.9864322520976916,"5762":-0.010086530451963019,"5763":2.0928469096679243,"5764":-1.0970484721506601,"5765":-1.42181003282861,"5766":-1.087836181043602,"5767":0.3852130409387791,"5768":-0.6549211679764739,"5769":1.9304128849575244,"5770":0.956453580670421,"5771":1.1619926726651173,"5772":-0.8981110319043675,"5773":-0.7657175982701787,"5774":-1.2175480487352934,"5775":-2.7304013846762025,"5776":-0.6092043663830519,"5777":2.5497673350312793,"5778":0.5221024716169766,"5779":-0.658550809653274,"5780":0.8120223976527589,"5781":1.3112098067737155,"5782":-2.024426714420629,"5783":-2.606294436027892,"5784":0.14190345264139567,"5785":-1.022724547929848,"5786":0.8869347251693358,"5787":1.104516633992556,"5788":0.30769700306125936,"5789":-2.2679882257477493,"5790":0.25651760347742664,"5791":-0.9444893853475016,"5792":-1.1903034289410432,"5793":-2.522124229886933,"5794":-1.6572789458509776,"5795":-0.22371174770006977,"5796":-2.129792367686572,"5797":-0.6662550284707273,"5798":0.9898108275002491,"5799":1.6278681308682856,"5800":-3.6278594693852004,"5801":-2.1784847509416907,"5802":-0.818005419725448,"5803":-1.415798283606637,"5804":0.31795487590349353,"5805":0.555527276312209,"5806":-1.59545337873288,"5807":-1.6498705984377058,"5808":0.020401732466954623,"5809":-1.6199515127042814,"5810":-2.179574477654011,"5811":-1.6872982234414342,"5812":-1.2894168786354216,"5813":2.0228365144082017,"5814":-0.48983359447311237,"5815":0.4139516827870638,"5816":-0.6026467086333321,"5817":3.07573666954776,"5818":-1.7311560614352932,"5819":-2.5997644239098547,"5820":-1.7041164888205294,"5821":-2.32541642767247,"5822":0.2105191573614091,"5823":0.07256684103844925,"5824":-0.1720919842152776,"5825":-0.7930368669999365,"5826":-0.11301292887376196,"5827":-1.3903604979720823,"5828":0.5667921066283078,"5829":-0.06965448395816635,"5830":-0.7452174597691654,"5831":0.3584777034754802,"5832":-0.2440969785878175,"5833":-1.2329259123476546,"5834":-0.6696477902539665,"5835":0.22416158167037048,"5836":-1.0542399088274172,"5837":-0.3518658883886305,"5838":-0.5578793316092664,"5839":-0.25582629775823884,"5840":0.7215252202668136,"5841":-0.5263428832266519,"5842":-0.10106087324460408,"5843":0.8355358189804083,"5844":0.11566213118347082,"5845":0.06427619358751939,"5846":-0.5167709066178262,"5847":0.877377960131476,"5848":-0.17919592583951113,"5849":0.3147606711159537,"5850":-0.7359233437924749,"5851":-0.0029453900657420975,"5852":0.4191851629000832,"5853":0.788645148696758,"5854":1.322721893282503,"5855":0.8333662648890788,"5856":0.6006884079346622,"5857":-0.5405814215047806,"5858":-0.5308841001348038,"5859":0.045692103487528814,"5860":1.3675032240725162,"5861":5.534807463551904,"5862":3.1840481451064058,"5863":1.5909456930568242,"5864":3.183623545754828,"5865":0.5368888555274505,"5866":0.27233624955807584,"5867":-1.2581260549519229,"5868":-0.03333270455616686,"5869":-0.4717233207538814,"5870":6.6211228388589385,"5871":4.869283381126812,"5872":2.685803921119111,"5873":-0.13672729311081044,"5874":0.8384490491095798,"5875":1.0418966074997726,"5876":0.026477898313882628,"5877":-2.255603956810424,"5878":-10.464630154375016,"5879":-6.821704004051302,"5880":-6.1274727690126465,"5881":-2.010037678420495,"5882":-4.501318189944573,"5883":-1.4299813942174526,"5884":0.2090723524320239,"5885":-0.2909064677464537,"5886":0.33138563306395447,"5887":-1.5780783984016435,"5888":-0.8719362569729794,"5889":-0.3993925018407394,"5890":0.28884161221646254,"5891":-0.8226236217095815,"5892":-0.8889262406181746,"5893":-1.6581451855943494,"5894":0.13193550347962907,"5895":0.8054564774293655,"5896":1.1084281297836656,"5897":-1.1164160123942,"5898":-1.366032364632916,"5899":-0.8234676763639979,"5900":0.07970868766988279,"5901":-0.08111872501570513,"5902":0.04063993012173193,"5903":-0.37469912319124504,"5904":1.316772669598264,"5905":-0.8910833838111442,"5906":0.13887549730259288,"5907":-0.9668107817110952,"5908":-0.637986245838607,"5909":-0.1963266352517979,"5910":-0.3771070624818005,"5911":-0.15131868105577415,"5912":-0.48038995669448753,"5913":-0.22801342040809602,"5914":0.054058120964118786,"5915":1.6428372432890397,"5916":-1.0988464797890252,"5917":-1.1969556826383723,"5918":-0.4567943757716817,"5919":-0.17002893746411596,"5920":-0.2341091209542139,"5921":-0.21359227187301796,"5922":-2.1653354488701253,"5923":0.748481666628312,"5924":-0.13173712816577238,"5925":-0.5729429473370333,"5926":-0.7843654946892175,"5927":-0.6472185961276772,"5928":-0.35988142013974217,"5929":-0.7036162812894796,"5930":-0.40337332365575423,"5931":-1.86083034774131,"5932":0.5238550208705114,"5933":0.2883622316298929,"5934":-0.2689445159751297,"5935":-0.567238941762263,"5936":-0.600106746147708,"5937":-0.21751606760026101,"5938":0.25919743032509146,"5939":-0.3464939913247529,"5940":-0.26718860409969064,"5941":-0.6197155197369717,"5942":-0.3337431204855408,"5943":-1.1316229728788894,"5944":-0.33951161004262304,"5945":-0.8589626578865829,"5946":-0.09923858592147182,"5947":-0.6558097320297244,"5948":-0.4657461139895686,"5949":-1.140563144857994,"5950":1.2558672704602505,"5951":-0.5509413630812467,"5952":-0.788585852091929,"5953":-0.6000000238338765,"5954":-0.4137431037927412,"5955":-0.061037967496125084,"5956":-0.3121218595706552,"5957":0.0735284189006975,"5958":-0.4540253923856272,"5959":1.5878780174934386,"5960":-1.5562672797520654,"5961":-0.6481872755949302,"5962":-1.1011898085333782,"5963":-0.1968571197249174,"5964":-0.19874858259106545,"5965":-0.33272399205603154,"5966":-0.43659731553593123,"5967":-1.4827051579115889,"5968":-0.23853309415775542,"5969":-1.8797120672398429,"5970":-0.2907089149704125,"5971":-0.4245759103568048,"5972":-0.2853118177684709,"5973":-0.7649417040526396,"5974":0.17035457319290961,"5975":-0.2962193561900471,"5976":-0.7916115984835517,"5977":-0.6769617561065315,"5978":0.493770971751483,"5979":-0.8667891876053805,"5980":-1.0885046320496674,"5981":-0.685815306375469,"5982":-0.024741478119225203,"5983":-0.7670473198452387,"5984":-0.4307015004764449,"5985":-2.689565512680814,"5986":-0.18203819182831713,"5987":-0.6255123341984452,"5988":0.06917540998648444,"5989":0.6430443501266857,"5990":0.6852033559951783,"5991":0.4673023436911169,"5992":-0.29380941808787614,"5993":-0.06695377208259404,"5994":-0.03276089503530436,"5995":-0.01392683755385094,"5996":0.5521681543591255,"5997":0.6973401689493135,"5998":0.3080241090741923,"5999":0.32440569036267325,"6000":0.4014133040274423,"6001":0.7513303391406524,"6002":0.4039424594725385,"6003":0.1348693058037473,"6004":0.32211807270440285,"6005":-0.37682738712019215,"6006":-0.08338645817592917,"6007":-0.09777352022566296,"6008":0.2223842609099358,"6009":-0.08770506813726871,"6010":-0.444406455558529,"6011":-0.22061723216552775,"6012":-0.2768898803170261,"6013":0.027036405363423038,"6014":0.23926833672345443,"6015":0.35244686011442616,"6016":-0.36222196417053426,"6017":1.090762906831463,"6018":0.6965281833295479,"6019":-0.04726164030625895,"6020":0.11519599156443336,"6021":-0.1962940186551636,"6022":-0.16337641391019708,"6023":0.14157572944355937,"6024":0.22461133983641082,"6025":-15.936912370840387,"6026":0.3429938198550055,"6027":0.9330380095303773,"6028":0.33998150558799073,"6029":0.49956347348472907,"6030":0.24341885422962695,"6031":-0.1833189979572955,"6032":0.6118571970094896,"6033":-1.3520034562405898,"6034":0.4070473806999865,"6035":-0.07020409560424631,"6036":-0.0679995782819421,"6037":0.5556683635283168,"6038":-0.6913545010687226,"6039":0.13481327658837988,"6040":-0.015267369897369324,"6041":-0.7086916758706339,"6042":0.12524713314751174,"6043":-0.41077307277093544,"6044":0.07720518277020903,"6045":0.11215869270940487,"6046":0.39388208085848997,"6047":-0.0978984473047486,"6048":0.11716929492039621,"6049":0.1491417622406526,"6050":0.40165103542354286,"6051":1.115679188143296,"6052":0.35405203880361824,"6053":-0.17078888180247642,"6054":1.0791881644028383,"6055":1.255575006824696,"6056":0.3102361472207109,"6057":0.03960671625694282,"6058":-0.38953228670661033,"6059":-0.9408963581713085,"6060":-0.03189709287696951,"6061":-0.4391851407325858,"6062":0.6997067318356435,"6063":0.8261428098436159,"6064":0.5305608401631824,"6065":-0.6098995532949325,"6066":-0.5271205917710319,"6067":1.1120545744952137,"6068":-1.5393674621197568,"6069":0.24998045753497752,"6070":0.5560108686798729,"6071":-0.3720971070836236,"6072":0.9923973356752422,"6073":-2.4361203224636077,"6074":-3.854578017737585,"6075":-2.558317748146542,"6076":-0.4733655442549127,"6077":1.0204064926868504,"6078":-4.434189699560234,"6079":-1.9163449684119587,"6080":-1.3763501642774345,"6081":1.9154326295292134,"6082":-0.8819009101060822,"6083":-1.8340244715867866,"6084":-2.4283357273230255,"6085":-2.3852557261452767,"6086":-2.420017355229028,"6087":0.41062850868547907,"6088":0.33795532206489176,"6089":-0.5013677189637432,"6090":-2.361883591920628,"6091":-2.9865151907749867,"6092":-1.7003847484997192,"6093":0.7948588746850392,"6094":-2.214901585055204,"6095":1.1699759520666497,"6096":1.8837934219165873,"6097":-0.16960134111809735,"6098":-0.9669362767140448,"6099":-0.02826712842340743,"6100":3.5051219123259574,"6101":3.5015627574791814,"6102":2.3108743413586113,"6103":-0.38768761937088664,"6104":1.231467616703148,"6105":-0.45390492708098046,"6106":0.14517747656559574,"6107":-2.809428564258514,"6108":-4.416892868246606,"6109":-6.912590854904057,"6110":-5.360144209892001,"6111":-6.152213594844788,"6112":-5.801820649380341,"6113":-0.42994066276102566,"6114":2.0444452984101287,"6115":1.9968521408618367,"6116":2.491140962700123,"6117":-2.609355212191332,"6118":0.5457670254415163,"6119":3.234339590104068,"6120":1.6535330380792974,"6121":2.5896154477965077,"6122":2.052175379487643,"6123":-2.3735980420407516,"6124":1.0941060006045935,"6125":3.003947387965346,"6126":0.04581957856443866,"6127":-0.8248533194374165,"6128":0.3614395095448781,"6129":1.5457621682131772,"6130":1.7287236982391392,"6131":0.5758455325379904,"6132":-2.2580520194047913,"6133":-2.177798282991041,"6134":1.828108688873417,"6135":0.3583653872504409,"6136":-0.2253466552342754,"6137":-1.3111589876659024,"6138":-1.427711831645479,"6139":2.347907431514235,"6140":-0.9759793308550156,"6141":-0.7421519997179948,"6142":0.26741565382458016,"6143":2.1767569213298694,"6144":-2.1032396922374166,"6145":-2.737539571972376,"6146":-0.896900994955322,"6147":2.605761861917349,"6148":-1.4605823830681213,"6149":-1.6765837251785183,"6150":1.850353637050941,"6151":-2.692439000540807,"6152":-0.28753028241478457,"6153":2.5891026125318817,"6154":3.5806390469166565,"6155":1.5595159817643525,"6156":-5.127472353963838,"6157":0.1888771251356036,"6158":-2.0474250934969924,"6159":1.9590185762824914,"6160":2.008208807953541,"6161":0.8409503638048228,"6162":-1.743985397846006,"6163":1.4007336814366125,"6164":2.3554178479837056,"6165":1.076369103618898,"6166":-3.427378123248112,"6167":3.7307691102188274,"6168":-1.751708749951262,"6169":-2.5899424830026474,"6170":2.3442346183825675,"6171":1.9665531367605118,"6172":0.25791369141061404,"6173":1.6343660268126203,"6174":-3.6365253673791496,"6175":-2.5752340336569484,"6176":-0.19666451924950634,"6177":2.80010150844225,"6178":0.7367466973035646,"6179":1.7301185038270963,"6180":0.4355222446511967,"6181":-3.120913471368695,"6182":-1.5113521412655455,"6183":1.5683766030937685,"6184":-6.558549833387283,"6185":-5.108695261474128,"6186":-1.2387608329596769,"6187":0.9650983359619937,"6188":-1.434041568095704,"6189":3.362068444504189,"6190":-3.869755313308628,"6191":-5.94259166557086,"6192":-5.897876345340525,"6193":-1.367720376819845,"6194":-2.7595440294238465,"6195":-2.1952894352428034,"6196":0.11163223925013349,"6197":1.1468274354290198,"6198":-1.7008415656613325,"6199":1.7191105968121327,"6200":-2.5357209020120832,"6201":0.4610148444459636,"6202":-0.6504165807234846,"6203":-3.1450509033047926,"6204":0.8633231569826162,"6205":5.273535031050341,"6206":-2.2447292071076173,"6207":-3.8969408378978776,"6208":-1.496097177871706,"6209":-1.6644557295903413,"6210":-1.1772855368373127,"6211":2.0865623000976754,"6212":0.30923289382135993,"6213":2.160197279583978,"6214":1.0844976109516469,"6215":1.0519230685058243,"6216":1.333907028212485,"6217":1.6836664158175167,"6218":-4.324394578774291,"6219":-4.912890808234212,"6220":0.300828000425702,"6221":-2.234750725896548,"6222":1.1548822363797078,"6223":-2.6732292899199868,"6224":1.0465119040740494,"6225":3.836069847197297,"6226":3.2990724144232675,"6227":3.0271928776049513,"6228":-0.44687574696007154,"6229":1.2761343215137877,"6230":-0.32829429498041424,"6231":0.10691477613148047,"6232":3.1229597572113423,"6233":0.5575637550430503,"6234":-0.0020905988613848484,"6235":1.860766828517465,"6236":2.1112713029841452,"6237":0.7001858992207862,"6238":0.7616068944166378,"6239":0.9775544083300189,"6240":0.48332412190702756,"6241":4.622602640319985,"6242":2.3288329987157605,"6243":1.2122779046593652,"6244":3.5898593215718546,"6245":2.3179243327061303,"6246":0.8779090055504214,"6247":0.5118988499802499,"6248":0.5935500500602764,"6249":0.6558818872219159,"6250":1.615787163104706,"6251":2.7198504097172505,"6252":-2.3071356918710415,"6253":3.4815929289781486,"6254":2.992800319978136,"6255":0.13511559503533224,"6256":0.8837726039454814,"6257":1.3853890394336137,"6258":0.5454102737590111,"6259":-0.3419688415597102,"6260":2.243582921681536,"6261":-2.2004700881574277,"6262":3.0851257633447977,"6263":2.5719059930098847,"6264":1.0576067574299306,"6265":0.6873459012882549,"6266":0.4900114458537146,"6267":0.41381851898405614,"6268":1.4506991516564098,"6269":-0.7566536388776867,"6270":-4.138350279057702,"6271":3.320086801131567,"6272":2.2045851507003897,"6273":-0.2328795877804085,"6274":0.42441112231791855,"6275":0.5929810866755173,"6276":0.45037598896569103,"6277":0.09998580528480742,"6278":-1.9883381909121036,"6279":5.397003163114523,"6280":3.328838278467729,"6281":1.2359180538110954,"6282":0.8191842253712064,"6283":0.6859018471096101,"6284":0.39795854793199,"6285":0.28563252865832023,"6286":2.5929575734859327,"6287":0.5867207909005624,"6288":-0.5344272546234659,"6289":1.551451252724165,"6290":2.1802785017023596,"6291":0.6162756242384014,"6292":0.9526780556343789,"6293":0.7579007612378363,"6294":0.6252862283714332,"6295":1.1017457303535072,"6296":0.30054330366911725,"6297":-0.2129240339614795,"6298":4.565245335651921,"6299":1.6378503204323482,"6300":0.24326653632721176,"6301":0.6830209595283845,"6302":0.5966713151406876,"6303":0.49156489921401786,"6304":1.0340155357900662,"6305":2.2901336436478683,"6306":0.04991307755337123,"6307":2.1291497967700757,"6308":2.1363610431914166,"6309":1.3332827301051127,"6310":0.8524257508133674,"6311":0.6224456609190762,"6312":0.7744070767213381,"6313":-1.2398159561964823,"6314":1.3605501404220954,"6315":-1.6894906137800494,"6316":-0.3494067916094367,"6317":1.771418077344669,"6318":-0.9397116412642101,"6319":0.3365733240485557,"6320":2.827526196267806,"6321":-0.3127384464247324,"6322":0.4818861659920958,"6323":0.1975336901633232,"6324":3.58848213614976,"6325":0.3491711124977118,"6326":-4.479223170116579,"6327":-1.5647472427558828,"6328":-4.38010830387771,"6329":2.302149487382661,"6330":-0.9779632330917308,"6331":-0.41093019298657,"6332":-1.9560510865847482,"6333":1.4373236749922056,"6334":-0.10612736142939856,"6335":-4.306331738260723,"6336":0.1080051733324049,"6337":5.574926000596569,"6338":-0.08905708185047698,"6339":5.974226741677825,"6340":1.356370536789322,"6341":1.382743947301753,"6342":0.8112964160026183,"6343":-0.06575580992671422,"6344":3.139510669548035,"6345":-0.5846847607496113,"6346":4.473196937439283,"6347":-0.11784045499951228,"6348":1.7938709432272657,"6349":3.966698218251102,"6350":-0.013229589490947144,"6351":1.2123871157619912,"6352":-0.10308402286443029,"6353":2.8641314687282775,"6354":1.021212788890694,"6355":5.101112195009057,"6356":1.1813350942723968,"6357":0.24653480137132094,"6358":0.08756242597246286,"6359":-0.39393371903903984,"6360":-0.6340192465641203,"6361":-4.450191398198732,"6362":1.419063134924149,"6363":3.9811827579290413,"6364":4.616749250094877,"6365":3.7091634389048695,"6366":-0.7875823946322291,"6367":0.9784372668339911,"6368":3.2502753488372798,"6369":-0.2595929807633715,"6370":-3.005000917120345,"6371":5.238987005879975,"6372":-1.9835057137624363,"6373":2.5054310626921086,"6374":-0.18413562342025683,"6375":4.096131171671187,"6376":-3.260469119609351,"6377":-0.4429735799453298,"6378":2.6969510234544924,"6379":-2.855129455413511,"6380":-2.606757620134829,"6381":-2.470962479787084,"6382":-3.0251192977330144,"6383":1.2950773498817028,"6384":0.18156409836380016,"6385":-3.9439043897533868,"6386":-3.2672110344141094,"6387":-0.0717044265114204,"6388":-2.551697583042566,"6389":0.07375030367085157,"6390":2.3735620024791997,"6391":1.3034278156598056,"6392":0.7170734623454081,"6393":-1.7857530470546639,"6394":2.4330542366178545,"6395":0.4015032626825421,"6396":-0.8656441442975481,"6397":-2.7932715425588266,"6398":1.6442329830631592,"6399":3.3001282098898046,"6400":-1.2020289917408142,"6401":-4.585241713977635,"6402":0.31850166170053473,"6403":-3.9117896366586904,"6404":-3.3141865477353836,"6405":2.954677219225289,"6406":0.6039886532630018,"6407":-0.5410966308908292,"6408":-1.2605493173957134,"6409":-0.768407790921012,"6410":-1.7983008294497247,"6411":1.0113859986632658,"6412":-0.3525789102710423,"6413":2.6465481094855132,"6414":-0.23446618685808582,"6415":1.1789694266984923,"6416":-1.979739537624634,"6417":-2.2650733187340144,"6418":-1.561555530092948,"6419":-1.8740107445043694,"6420":0.3766795997885779,"6421":0.8726272386258334,"6422":0.9045748550005549,"6423":1.1847402242634362,"6424":2.80947726919615,"6425":3.4927282896610268,"6426":2.799983974853273,"6427":7.606800999917055,"6428":7.848726576069609,"6429":-0.03503029849062745,"6430":1.2768474713654783,"6431":0.7095606194119176,"6432":2.1261571315192715,"6433":-1.9117967970978849,"6434":2.0797202587644295,"6435":0.5698829629856419,"6436":3.065075884664115,"6437":1.22466313186216,"6438":-0.33508633648823977,"6439":-1.9760830530200189,"6440":-3.869201376920949,"6441":-2.589731733991852,"6442":0.15379908043512225,"6443":-2.0332658049051795,"6444":5.412237948736101,"6445":7.433662066739147,"6446":4.545511555752961,"6447":0.04002259920022615,"6448":3.5915002200621853,"6449":2.6509071714631802,"6450":-0.5349488190531035,"6451":1.0578058125448118,"6452":-1.1115581607839875,"6453":-3.5642855017487807,"6454":-0.7625621464848297,"6455":3.1504882382709907,"6456":-0.8650001790429745,"6457":1.13717019083932,"6458":-1.3611796886159753,"6459":-2.249623769829285,"6460":0.9367760105087282,"6461":0.42504326849390245,"6462":-0.6171222717093078,"6463":-0.7660650105964852,"6464":0.0038802749026111334,"6465":-1.7547520469685491,"6466":-0.6984621312347308,"6467":-3.9882875490711376,"6468":-0.9296646454119106,"6469":1.876147791093346,"6470":0.2293580389337976,"6471":0.10690257572563648,"6472":-4.024794155988087,"6473":0.6260516700793628,"6474":-2.9386269317906932,"6475":3.3647294357295854,"6476":-1.7634235346525218,"6477":1.8758686360793926,"6478":4.000790965707818,"6479":4.700359116525674,"6480":-3.9843477353636874,"6481":-2.6922750829947364,"6482":-0.07433699860447782,"6483":1.431449231759904,"6484":2.5066171687849166,"6485":3.062526923030821,"6486":-0.3911474763071242,"6487":-2.927653775690001,"6488":0.8493463409661142,"6489":1.5368335837938678,"6490":1.8820184695552966,"6491":1.292528292660384,"6492":-0.711262033140131,"6493":-1.8641160146599083,"6494":-2.2616858978081615,"6495":1.4111256338941613,"6496":3.3083528033075176,"6497":2.5012800930534644,"6498":1.09753876106203,"6499":-2.511315151176104,"6500":0.25799585180578516,"6501":3.0936360675848795,"6502":-0.347486076301666,"6503":-2.9168350890143637,"6504":2.038641414215584,"6505":-1.0741667805261874,"6506":-1.4457895807602117,"6507":-0.9809918566958697,"6508":3.4163831314976467,"6509":2.6613407160210616,"6510":-3.292988769369829,"6511":-0.2765724609426272,"6512":0.9383228490426794,"6513":-2.7220658230453765,"6514":-0.8325999833517043,"6515":-0.19508237222777336,"6516":2.323565413185189,"6517":4.0166187867824075,"6518":5.9697322074116,"6519":7.866680868306307,"6520":6.959807845345763,"6521":2.1161431478149892,"6522":-0.1091366015172085,"6523":-0.2435681906479321,"6524":-4.46249612934328,"6525":0.10195440981980282,"6526":-3.561418823541918,"6527":-0.3563222226376429,"6528":3.347134611228594,"6529":-0.46983937364272105,"6530":6.643597629530598,"6531":2.4135729990252983,"6532":0.2740568919470376,"6533":-2.043166398066022,"6534":-1.665564765611045,"6535":-2.8722151837532968,"6536":-3.438940219814011,"6537":-2.1176654502813297,"6538":-2.117548811503632,"6539":0.1336565462180921,"6540":-1.4603322957203426,"6541":0.028627097238006556,"6542":-1.9647768530078034,"6543":-1.6339888672915919,"6544":-1.4126450504786974,"6545":3.3877823600727486,"6546":-3.5426834766340316,"6547":-2.1144432630405112,"6548":1.8925289714334812,"6549":3.8224237580306055,"6550":3.5557196674686296,"6551":-0.7853394222735178,"6552":-2.097703582148096,"6553":-1.3810090324021431,"6554":-0.9707288834971596,"6555":-0.18006217830000584,"6556":0.8002312116343091,"6557":0.20328226398525484,"6558":-0.6373230304941389,"6559":0.46100371404764107,"6560":1.7612200096606543,"6561":0.02710954631322441,"6562":1.3485852971191477,"6563":2.568388616703752,"6564":-0.838390233355936,"6565":-3.1608169423928887,"6566":5.76748204125611,"6567":-3.0626275932264604,"6568":0.4305793654409737,"6569":2.340567276162495,"6570":-0.5728626603694966,"6571":1.3306235611930985,"6572":-0.867264992259752,"6573":1.0111555423630951,"6574":-1.9341790462579591,"6575":-0.8284881742496847,"6576":0.1737359833629175,"6577":1.9102595334160952,"6578":-2.4530712056447626,"6579":1.4452228114643568,"6580":-0.0012804574440898376,"6581":-0.9721000289991131,"6582":2.2820378933780163,"6583":-3.969295477191211,"6584":1.7963057548265218,"6585":-1.8832747068720928,"6586":-0.844629238483119,"6587":0.3957496383161726,"6588":-0.725062117092752,"6589":-6.753428566735228,"6590":-3.418781503916112,"6591":-2.1391105418203096,"6592":-3.4441792222301832,"6593":2.4244398576273225,"6594":-1.556047285682361,"6595":-1.2160914662787623,"6596":2.704744294399507,"6597":-2.011336924160401,"6598":-0.5489186877844361,"6599":-7.779044909231557,"6600":1.551366865197428,"6601":-0.5589520439091478,"6602":3.2096752562653834,"6603":0.269606563873402,"6604":-3.063012561963731,"6605":0.4951448922773696,"6606":-2.6914900037982346,"6607":-3.949965378575591,"6608":4.3751512470760625,"6609":6.198094352386461,"6610":1.02574448657064,"6611":-1.2136986598597121,"6612":2.0462762450265664,"6613":0.5828220464704198,"6614":1.894008819142491,"6615":1.9031329403553563,"6616":4.952862566757037,"6617":5.33072541362718,"6618":1.9515047430267398,"6619":1.589368458431729,"6620":2.260556544810362,"6621":-0.6816264592110655,"6622":0.3396061161202287,"6623":-1.3506113291060566,"6624":-4.130722935658734,"6625":5.457868195659862,"6626":2.98701159530613,"6627":1.4085373264594707,"6628":0.7423836180751915,"6629":0.01783528132949857,"6630":-0.6196160742629144,"6631":-1.5626276238628145,"6632":2.2453569672820786,"6633":0.6906354492041384,"6634":2.04706903938472,"6635":0.6503363152000807,"6636":-0.6968123086750607,"6637":-2.042268320661441,"6638":0.5966702814287744,"6639":-0.644162132102943,"6640":-0.7488840268546683,"6641":-0.46558410866710787,"6642":-3.5194534282286183,"6643":2.5986847467563363,"6644":2.875422237582519,"6645":-0.9554918928334174,"6646":1.431792928863641,"6647":-1.54017645727808,"6648":0.4202021524397933,"6649":0.6888210043921674,"6650":2.628500874803726,"6651":2.2992774378932186,"6652":-1.2533414222338164,"6653":2.4408842707566927,"6654":3.360644476940481,"6655":-3.8975989130038213,"6656":-1.9395670249150763,"6657":-3.417842670295493,"6658":1.1843223028236738,"6659":0.3618246097586371,"6660":-2.043519267700098,"6661":-1.3913636883369374,"6662":0.6470391072662396,"6663":1.5927453092047732,"6664":1.4568707821647215,"6665":3.1051436209030303,"6666":0.9917327488096598,"6667":1.0996281095935292,"6668":0.233378480916724,"6669":-1.6753340888836252,"6670":0.24398300908011158,"6671":-0.468657993173857,"6672":-1.5811684769584626,"6673":-0.9387773706519866,"6674":0.43754667519224755,"6675":0.6581745123483838,"6676":-1.554039745791326,"6677":-0.23099534183178988,"6678":0.8368011990740218,"6679":0.009947463035468859,"6680":-2.3101553201714276,"6681":-2.483181299245401,"6682":-0.06520575504114474,"6683":-1.8494572240992617,"6684":4.360439031698523,"6685":5.145608688454594,"6686":-0.6100110307813873,"6687":0.6119184826460173,"6688":2.903044093963815,"6689":-6.13693103280607,"6690":-0.7971290875841142,"6691":-7.958355132196004,"6692":-5.06340140295665,"6693":-4.604439632743303,"6694":-6.110952000952389,"6695":-3.155478632244403,"6696":-2.0108580701469787,"6697":2.817813827194354,"6698":0.7254610213088936,"6699":5.559655684318443,"6700":3.033362277080029,"6701":0.07497723455974852,"6702":-3.04016483162146,"6703":-3.344351396319133,"6704":1.615441646345642,"6705":-2.8787240318306897,"6706":4.118641059292285,"6707":0.957287546713906,"6708":-1.0785475297662286,"6709":-1.575361284169222,"6710":-0.42169864295046416,"6711":0.678395144655165,"6712":2.6155088878203747,"6713":-2.3993239952395493,"6714":-0.6179879130000926,"6715":1.8567584009987592,"6716":0.43204766620891094,"6717":-1.5081279504509975,"6718":4.307547034766194,"6719":-0.5778706211191622,"6720":1.601836708434498,"6721":2.628208528186578,"6722":-0.7918216549116478,"6723":-2.528630370534613,"6724":0.05232014227004929,"6725":1.513166735804754,"6726":-2.3222777730720545,"6727":-3.118594119406763,"6728":1.3224250003921578,"6729":0.44016066693476225,"6730":-0.9682823353798437,"6731":1.8433155547672093,"6732":4.450250485008879,"6733":-1.852019417195452,"6734":-0.6006682430180551,"6735":4.363812257172955,"6736":-0.1380478246710752,"6737":-2.6935961899055445,"6738":-2.3869136896958505,"6739":1.9071004809374146,"6740":-0.8794399466623553,"6741":2.827825248913522,"6742":-0.31124649558476064,"6743":3.921010058745594,"6744":0.14836749416251113,"6745":-0.3229714012390411,"6746":1.6777965546792015,"6747":2.8548761775737783,"6748":5.379773368982495,"6749":4.9866299058785755,"6750":3.2595552015022,"6751":-4.89838135000508,"6752":-3.451351917970319,"6753":0.4161597709851853,"6754":1.843618769159921,"6755":5.585450995218241,"6756":4.776362512025646,"6757":0.16267359151943483,"6758":-4.532139273561792,"6759":-1.0803593802687053,"6760":5.737928615607515,"6761":-4.06886708451997,"6762":-0.688110681629842,"6763":-4.549155638258183,"6764":-2.272059286834458,"6765":-4.165113570139262,"6766":-2.8831596122814114,"6767":-1.722616223139048,"6768":-1.4115605209316153,"6769":3.100282052147034,"6770":-0.2653509899594122,"6771":-2.9855593784664394,"6772":1.3834718024697508,"6773":2.5375784433270763,"6774":2.6683963065669842,"6775":2.416196721429619,"6776":0.8674895065007208,"6777":-0.576839200759043,"6778":0.43786004666149947,"6779":-0.9500698150381451,"6780":0.5588948836062304,"6781":1.7547373752322768,"6782":-3.4669777130174984,"6783":0.21660642828946586,"6784":4.112076276500412,"6785":0.29399863278311444,"6786":1.7666698758434387,"6787":-0.7850161010188182,"6788":-1.0066834323177876,"6789":0.3957851845976203,"6790":0.796837922801555,"6791":-1.712033457328043,"6792":-1.0653582306861213,"6793":1.367762082346181,"6794":0.45670923327852164,"6795":2.484417983196882,"6796":0.10096960294766077,"6797":-2.310986447839037,"6798":2.9132979523352,"6799":-1.816303134618635,"6800":-1.8284529679917267,"6801":0.8169381113436324,"6802":-1.0605167303994452,"6803":-1.325104038134278,"6804":-1.813523687580898,"6805":3.3236252435093143,"6806":0.13198619289434727,"6807":0.9517736126282882,"6808":-0.0646387907105286,"6809":-0.8354798851048544,"6810":1.28598139502787,"6811":0.17521625387271025,"6812":2.609639476219926,"6813":-0.20192960004199528,"6814":-0.7280076965799582,"6815":-0.4506270754023436,"6816":-1.2928977727128819,"6817":-0.39569314240182435,"6818":-0.10790704812046492,"6819":0.04793873084924937,"6820":1.9341743377926364,"6821":-0.27663455258503317,"6822":0.28869931287490425,"6823":-0.04955128633769972,"6824":-0.26706391568352283,"6825":0.48928280212206904,"6826":-2.651000951495955,"6827":-2.358524232746048,"6828":-4.292242447829135,"6829":-3.5724481368276284,"6830":-1.6970173120918939,"6831":1.5839435815007499,"6832":-0.45508465256894126,"6833":-1.25944453473963,"6834":-1.175318460097825,"6835":-1.8079417726633162,"6836":7.732118872875925,"6837":11.282601068273921,"6838":12.958331415261673,"6839":9.76366811785913,"6840":8.037195498064612,"6841":5.782507181038167,"6842":-1.4399774550479283,"6843":1.1215331613919528,"6844":-1.0550732756407843,"6845":-1.348924050128029,"6846":0.5112659022489294,"6847":-2.129670966669157,"6848":-3.3529606905212717,"6849":0.5068451678935672,"6850":1.9691113241133884,"6851":0.13076565575936358,"6852":-0.31839893762852617,"6853":-0.4803244290067711,"6854":-0.9115855819247557,"6855":-0.32904993343773054,"6856":-1.530901310370933,"6857":0.34252263874738587,"6858":0.9142010840242486,"6859":1.9380615914075077,"6860":1.6505102996776353,"6861":-0.3266209487585631,"6862":1.0918107179528276,"6863":2.1502164560121546,"6864":-1.122163890615899,"6865":0.19567366419723423,"6866":-0.20797466210898474,"6867":-0.012226352629675346,"6868":-1.0566738138845786,"6869":-1.634765336473566,"6870":-0.8728750577275156,"6871":-0.2203590928381896,"6872":0.7047022517357252,"6873":-0.20418603388391574,"6874":2.292329836566421,"6875":1.9716721873960503,"6876":-0.5882710021366981,"6877":-1.335871827177204,"6878":-0.8750061089969247,"6879":-2.057654361991544,"6880":-1.314874068406223,"6881":1.3196924460546542,"6882":1.198234223506866,"6883":-1.5369167315798142,"6884":0.05225211366843782,"6885":0.7819092835201421,"6886":-2.939333710332334,"6887":0.8866919541127356,"6888":2.532225520438814,"6889":-0.9074632323073752,"6890":0.7366116172996191,"6891":2.1575240689735375,"6892":4.0307667444686945,"6893":3.678309446178925,"6894":1.4451914526452188,"6895":2.219961416939881,"6896":1.1436921687787323,"6897":3.919696957520171,"6898":1.9301692290764785,"6899":-5.4694177416867085,"6900":-1.8655962272198126,"6901":-1.6389819151944403,"6902":-0.7463520817851473,"6903":1.7308190102844987,"6904":-1.1050700356335001,"6905":0.05289935958403744,"6906":2.8307555735476875,"6907":-3.6524777561615442,"6908":-2.0146514319788102,"6909":-4.314988764168821,"6910":-0.8559469780662581,"6911":-2.897628655968957,"6912":3.3364001593512564,"6913":1.406159302099521,"6914":3.4853493984399124,"6915":0.2834205379171949,"6916":-0.08481398543578504,"6917":2.5816895396846524,"6918":-0.5380845472687384,"6919":-0.12107942956775218,"6920":-2.035355098177513,"6921":-1.3540738493666653,"6922":0.4239662142681169,"6923":-0.2693450623999596,"6924":4.164852955228575,"6925":-1.3822581365037787,"6926":-1.484489884967101,"6927":-3.0928967877922378,"6928":6.067839808461793,"6929":4.576822775374783,"6930":7.766331246021332,"6931":4.301572710325899,"6932":1.5523887149154012,"6933":-2.1693182693567175,"6934":-7.008650218502389,"6935":0.6200427148022473,"6936":-0.08029974648034445,"6937":-3.038668511687475,"6938":1.6216169029465273,"6939":-0.6021140821200848,"6940":0.23021627896012284,"6941":3.7297142143383755,"6942":0.5368611649184314,"6943":3.904478847555962,"6944":2.016505042992259,"6945":-1.1878666938467974,"6946":0.21223298733560428,"6947":-0.40855498085797476,"6948":2.261031235263541,"6949":-2.175458919421802,"6950":-0.5623548780186498,"6951":1.174150998770382,"6952":-0.054829404282417255,"6953":0.4089963140846775,"6954":0.441239629274709,"6955":-0.698185781469539,"6956":0.6583416530752504,"6957":-2.1585236888553556,"6958":0.06776090614369328,"6959":0.4305971619744636,"6960":2.4324902581829098,"6961":-1.2779489240834188,"6962":0.6971178541034908,"6963":-0.28994198507066327,"6964":0.8136605666813684,"6965":-1.00435399028906,"6966":-1.8664385375562473,"6967":0.08999248545966103,"6968":2.30319019393895,"6969":-0.7452628131629083,"6970":-0.9358096412938135,"6971":0.11312857721075571,"6972":1.3127950098824692,"6973":-0.21426858541423557,"6974":-1.1279940477976707,"6975":-1.0636429150751119,"6976":-0.238118753939896,"6977":-0.6116823063566761,"6978":-0.41828826202143105,"6979":-1.298548981737829,"6980":-0.2040209997718122,"6981":2.1387050015781077,"6982":-1.5121619410193596,"6983":-1.5221457431648953,"6984":-0.5026450046652686,"6985":-0.21164894520330568,"6986":-0.292753922542856,"6987":-0.6102285275892273,"6988":1.046318550638795,"6989":1.3443776298915828,"6990":-0.19076431621480067,"6991":-1.8006846222638324,"6992":-0.6555595672668257,"6993":-0.7701471686437635,"6994":-0.07915687730161529,"6995":-0.1804383659344303,"6996":-0.5133790766701635,"6997":-2.6561627580784206,"6998":0.39878741862181233,"6999":0.5490976466441546,"7000":-0.4395428034431433,"7001":-1.6095904457261223,"7002":-0.5534689335719454,"7003":-0.8648535632615996,"7004":-0.42480305045262307,"7005":-0.4429233444687496,"7006":-1.424573345641642,"7007":-1.127243555862638,"7008":4.6600877533877405,"7009":-2.0372780006743887,"7010":-0.9872873627180725,"7011":-0.6490956710292028,"7012":-0.9328406435821006,"7013":-0.6177306232387662,"7014":-0.28005176559496286,"7015":-1.950675502259167,"7016":1.3809495966363903,"7017":-2.2598268942172868,"7018":-1.4225590936133838,"7019":-0.9129631293410096,"7020":-0.7442725885888549,"7021":-0.46635222032572465,"7022":-0.6145206047644638,"7023":-0.3395752357667527,"7024":0.6274143564731897,"7025":0.7386869830205873,"7026":-0.22749261686878283,"7027":-0.5601476068016735,"7028":-0.7327112365636884,"7029":-1.4181629367777515,"7030":-0.5908458703073491,"7031":-0.6364814642724208,"7032":-0.3687652238486294,"7033":-0.6928973931054657,"7034":-0.9367874136828764,"7035":-1.0721725701686395,"7036":-0.9352355853708206,"7037":-1.9424930959781017,"7038":-1.3040674177905198,"7039":-0.7749209278633782,"7040":-0.4527817951612023,"7041":-0.7439929617531699,"7042":-0.183328964471963,"7043":-0.8522375080902576,"7044":-1.0985976538562898,"7045":-0.09418182921884419,"7046":-1.2311894886280785,"7047":-1.2350396466531528,"7048":-0.736786800078228,"7049":-0.721304512533494,"7050":-0.6457805603760803,"7051":-1.8302817288434643,"7052":-2.571693677881864,"7053":-1.149581567951263,"7054":3.826052337733055,"7055":-1.2175183193447852,"7056":1.8515042747265293,"7057":-2.8120837291029543,"7058":1.0578464272272046,"7059":-0.5488214132654655,"7060":-5.696917869178558,"7061":-2.007767845786728,"7062":0.9178701805727215,"7063":0.251406498081993,"7064":-1.967428803077372,"7065":-0.9269809774370488,"7066":-0.49446340286759705,"7067":-1.6101949287353554,"7068":-0.13498873159418703,"7069":1.3825062224409388,"7070":-1.3850691024411261,"7071":3.387949486525752,"7072":-2.7960900941528566,"7073":2.553814217369958,"7074":5.0663295661082834,"7075":-1.4784819692360314,"7076":-3.819969807530963,"7077":-1.747831287800852,"7078":-0.5868858833121159,"7079":-3.7062340029268324,"7080":1.4011728929029723,"7081":6.310758947530374,"7082":-1.4948268876002064,"7083":2.9993032564989863,"7084":3.559770306105742,"7085":-0.5255757597233394,"7086":2.531337098847062,"7087":4.201657929229729,"7088":-0.7366965597695697,"7089":-0.6698079634390807,"7090":-1.1332858302266466,"7091":3.8879080680548648,"7092":2.1992159077899163,"7093":-1.8174366325353992,"7094":-5.443967759569702,"7095":4.034728684606377,"7096":-2.2101178801518295,"7097":0.7160955358558545,"7098":0.7449359507967164,"7099":-0.1018444611296714,"7100":-1.0914661974974011,"7101":-3.969932234867397,"7102":-1.3858144531267218,"7103":-0.11046182325912567,"7104":-1.4716328587224468,"7105":0.0088146820403146,"7106":-1.3872397469847506,"7107":-1.365893955877864,"7108":-1.2659782753548867,"7109":3.990639231437336,"7110":-1.5015249145966958,"7111":1.2818827778639683,"7112":-3.2730880610771353,"7113":2.149305918674634,"7114":1.538747473564684,"7115":-1.5273855074948248,"7116":-2.613276824817904,"7117":3.196117937360259,"7118":-1.131990948464297,"7119":0.10216213018744441,"7120":-0.43171969655672016,"7121":-1.4228746445243117,"7122":1.318799810770139,"7123":1.340782127105433,"7124":2.935284960275537,"7125":0.18209403068754315,"7126":3.7577289933586053,"7127":-0.1375351528208079,"7128":1.7042486549973106,"7129":2.220364173338495,"7130":2.678585407616327,"7131":-2.726843746362887,"7132":-3.4453461853448477,"7133":0.23257718045504316,"7134":0.21623000711469273,"7135":-0.011630914429109584,"7136":-0.5823667569550567,"7137":0.43831800773083424,"7138":-0.29545793560153694,"7139":-0.5489453452020098,"7140":-0.21720673513018715,"7141":-0.024796107696310292,"7142":-0.13187260465003497,"7143":-0.04121365705625501,"7144":-0.08711755336940305,"7145":0.3097333543888084,"7146":-1.2171402183410713,"7147":-1.2008884018364765,"7148":0.5025980408683448,"7149":0.5939704565850967,"7150":0.3766933096488154,"7151":0.05112311566018445,"7152":-0.9358907179854189,"7153":0.2515113614540646,"7154":-0.50348886589571,"7155":-1.0791590156709572,"7156":-0.010131146775688191,"7157":1.0399155475707464,"7158":-0.2111172586306532,"7159":0.2716949894147047,"7160":0.07816633012645728,"7161":-0.9686681344693074,"7162":-0.45193623638492597,"7163":-0.09299865461014285,"7164":-0.5932720164645601,"7165":4.668648240024992,"7166":1.5533049675776198,"7167":-0.3057826856187305,"7168":-0.3558662805099898,"7169":-0.4027170134695424,"7170":0.8754467459624646,"7171":0.27303139478435473,"7172":0.15727609363585104,"7173":-1.676032168569501,"7174":25.40638569718136,"7175":8.723520688628275,"7176":-0.3031154482941613,"7177":-0.0011322242499232425,"7178":0.05355631548760768,"7179":-0.407553376126394,"7180":0.18167662883031535,"7181":-0.2716871540297825,"7182":1.2723544773752948,"7183":6.003691862308796,"7184":1.0151593574183984,"7185":0.17895287838540916,"7186":0.455965364182425,"7187":-0.30869209411285115,"7188":0.8704918606448179,"7189":-0.769348999459831,"7190":1.027340720613536,"7191":0.018006516619167575,"7192":-0.16345146346648584,"7193":-0.31361431061147,"7194":-0.5215123202405733,"7195":-0.31507225918867415,"7196":0.42692000060616386,"7197":-0.23064432735631812,"7198":0.1369081023115697,"7199":0.1444665565436662,"7200":0.03400342787302473,"7201":-0.655370261732424,"7202":0.647040848801579,"7203":-0.6806863462031956,"7204":-0.8189008128318557,"7205":-0.6391287217860443,"7206":0.3520774219737611,"7207":0.1429366650693546,"7208":0.8289112046691597,"7209":-0.6155532467717069,"7210":-0.9226574033845143,"7211":-0.6823114711252606,"7212":-0.1581320415616779,"7213":0.133669383252207,"7214":0.4400903436722659,"7215":0.8468000527550202,"7216":0.178581635856219,"7217":0.9180059014448818,"7218":0.6830172627614651,"7219":0.41476329882555524,"7220":-0.6206187536265567,"7221":2.8053596571003547,"7222":1.140311443598807,"7223":1.1176031689960166,"7224":1.141409113995321,"7225":-2.5331754052677145,"7226":-1.9198821607483045,"7227":-1.7094784241569903,"7228":2.440607101258907,"7229":3.439157276058188,"7230":3.356260966192041,"7231":1.1342352422433903,"7232":1.2536620510488385,"7233":1.3959540951671756,"7234":-1.222150447743158,"7235":-1.4287912310815527,"7236":-2.1594448366789707,"7237":-0.7337847909266006,"7238":2.057225821235603,"7239":1.8426667453744838,"7240":0.6311870800839258,"7241":1.6741167373081842,"7242":1.5981825698487342,"7243":2.92316572701159,"7244":2.8436980528858036,"7245":-1.8446915301073947,"7246":-2.0933564906936497,"7247":2.5589499033808547,"7248":2.896459310165065,"7249":1.998469903708669,"7250":1.6041919995805614,"7251":1.1037937018098214,"7252":1.6892863230511768,"7253":1.3497022401070098,"7254":-1.6814195683164657,"7255":-6.695230776327607,"7256":-0.0542220423905969,"7257":1.92816473768628,"7258":1.5750854541743247,"7259":0.9944394492765575,"7260":1.0587571933106346,"7261":1.5708100911473877,"7262":1.1928855673932062,"7263":0.3851499659556519,"7264":-1.254376303803985,"7265":3.1099338399651644,"7266":1.622126338751694,"7267":1.5553980798639018,"7268":1.3716004175304801,"7269":1.4333499234131912,"7270":1.7225471476625134,"7271":-1.689211571649761,"7272":2.362071374523773,"7273":-0.47698006522510333,"7274":1.6532798830087752,"7275":3.0510663526402646,"7276":1.8171623383075999,"7277":1.9612349451140807,"7278":1.035477423542163,"7279":0.2761253984399884,"7280":1.0292715050037176,"7281":-0.9724029687667901,"7282":2.12461357254862,"7283":2.375180080980641,"7284":2.885072204496324,"7285":1.0651032891693424,"7286":1.7080707623569709,"7287":0.4202093793241285,"7288":-0.11700659173420398,"7289":0.25569540834432813,"7290":-0.008377798597340513,"7291":0.9182297681730804,"7292":-0.09796301912832554,"7293":1.2320252204788096,"7294":0.2991376456800643,"7295":1.367556194764145,"7296":1.0015870793239579,"7297":2.8203355674584754,"7298":-1.287635227631881,"7299":-0.5524961463171302,"7300":-1.3144969029938407,"7301":0.3198657026626583,"7302":0.5185646839883481,"7303":2.1908762985676944,"7304":0.6112939281317252,"7305":-1.3329269710167746,"7306":0.33790315176614055,"7307":-0.8903852518341931,"7308":0.18187267572417867,"7309":0.6064109691270525,"7310":-1.0762914945772168,"7311":-1.9208148627643362,"7312":0.5871763633972683,"7313":-1.8562251092284552,"7314":-1.110596771700429,"7315":-4.288596342183427,"7316":-1.2053703539012435,"7317":2.7075507005186896,"7318":-1.536603414237832,"7319":2.3332656005454506,"7320":0.7566345231342188,"7321":1.3349617478483724,"7322":-0.17094157093945073,"7323":0.7828533867205651,"7324":2.3257257546770753,"7325":0.4142889164160628,"7326":0.6992496259612021,"7327":0.3233767830303914,"7328":4.492194264594225,"7329":3.2482151197208755,"7330":0.8460309193198682,"7331":7.554194906509179,"7332":4.989294814657232,"7333":2.0927776953045125,"7334":0.13419871783438836,"7335":-2.3460817946341015,"7336":-3.3476538510855773,"7337":2.6729619055167233,"7338":8.615858593252002,"7339":8.768867414646389,"7340":4.963945637418008,"7341":4.8844972290574855,"7342":2.088574855667729,"7343":-1.0556275690987935,"7344":2.677005246323122,"7345":-1.7323948651054808,"7346":-4.086747093933142,"7347":-4.803418120769122,"7348":-6.803420862174519,"7349":-0.9483814548918552,"7350":-4.227683268723921,"7351":1.0069735782556128,"7352":1.560087677032197,"7353":4.114645353598681,"7354":0.31802976229131086,"7355":1.7126798272069064,"7356":-4.500136430262985,"7357":0.4574106291189637,"7358":-0.8456006625482863,"7359":1.6390550111230917,"7360":0.773270430816879,"7361":0.11584860238810248,"7362":-2.4270959006983785,"7363":-3.8476190458047985,"7364":-0.46092000166380076,"7365":-2.448463134483027,"7366":-0.2548187810620494,"7367":-0.6318087956697698,"7368":0.6108757880072737,"7369":0.7425283197117449,"7370":-0.12102701737765828,"7371":-0.18189583161855463,"7372":-0.09730387918923604,"7373":-0.6455455700123883,"7374":1.5275466253365737,"7375":0.7423599316522627,"7376":3.7583641363933085,"7377":-0.2377856800332605,"7378":0.025439200537733183,"7379":-1.694264102382751,"7380":-2.0019045629622196,"7381":-1.6237887199414562,"7382":-4.080474245469307,"7383":0.9749690051283255,"7384":-2.660436602500703,"7385":0.9134041102709208,"7386":0.20396444808426853,"7387":-0.372091956935974,"7388":-2.644150489656985,"7389":1.6672600658247387,"7390":-1.9889428581226223,"7391":3.47110674342617,"7392":-0.4814793378701686,"7393":-2.09034923475572,"7394":-1.301470089851769,"7395":0.6750410086468721,"7396":1.2355355972871644,"7397":0.4461790933168135,"7398":-1.4655859041182357,"7399":-1.3072462206749234,"7400":-1.0465931700271767,"7401":2.9368357754246435,"7402":5.620866388278876,"7403":1.823865302014531,"7404":3.1392614268427645,"7405":-0.08448212456358865,"7406":1.9868695226621456,"7407":-2.5072610238681325,"7408":1.9248010422667865,"7409":0.3599978984771159,"7410":-0.9893216008897572,"7411":-3.113301979584311,"7412":-5.272482036428774,"7413":-6.020342941084084,"7414":-2.351235091714723,"7415":-0.551689190541729,"7416":1.6296036196486008,"7417":0.2743411197025122,"7418":6.981512347330598,"7419":-4.4690965575081885,"7420":-7.381666967604862,"7421":-4.415928541961621,"7422":-0.33475617200726754,"7423":-3.5676329166607594,"7424":0.40447192779042324,"7425":1.583660565609904,"7426":-1.5168390191732795,"7427":2.9533610996478257,"7428":3.7209215392801522,"7429":3.0271261130208797,"7430":0.9237275074585274,"7431":-4.085252690182153,"7432":-1.356707713717314,"7433":4.146849590265105,"7434":1.4548467234476026,"7435":4.273325933494462,"7436":-0.9270678425827595,"7437":-0.44138061437424253,"7438":0.6195809906035238,"7439":1.0468120098830054,"7440":-3.711512469296316,"7441":1.291361293204496,"7442":-1.8462281798372189,"7443":-2.0037449517435357,"7444":0.056060822427528675,"7445":-0.6484906728942915,"7446":1.7790983410727204,"7447":0.5652423327501203,"7448":-1.770317315260939,"7449":-0.7251508488765359,"7450":-0.14602278221527284,"7451":1.1156928295569233,"7452":4.15042635716733,"7453":3.15721137562772,"7454":-0.8166396222637221,"7455":-3.3526956303061106,"7456":-0.705095218696483,"7457":1.807354276279147,"7458":-1.525113279195312,"7459":1.9479984035019346,"7460":2.065470991404739,"7461":-0.9278643419984371,"7462":0.9398037923127496,"7463":3.001299330842163,"7464":0.6163826459717121,"7465":2.44778678958153,"7466":1.1056437854889185,"7467":0.7536022552586601,"7468":0.26784106081567965,"7469":0.2665193833826642,"7470":0.4556668257784389,"7471":-0.6184794212918661,"7472":1.999521456838223,"7473":2.2983646412048917,"7474":2.0212663032989986,"7475":1.4684092760978875,"7476":0.685121326410323,"7477":0.5214587319153303,"7478":0.3212822472354866,"7479":0.4116570017780076,"7480":1.48915829492064,"7481":-0.65929421906507,"7482":-0.2541117915918849,"7483":1.9406126885267192,"7484":1.3870808350046846,"7485":0.6414934137862954,"7486":0.3279737384734363,"7487":0.19516734612892103,"7488":0.09676243575163171,"7489":1.4164674722550905,"7490":0.5851454816626235,"7491":2.2186081299167144,"7492":2.801534580240211,"7493":1.2307709186250329,"7494":0.9009288985259017,"7495":0.28504520398925864,"7496":0.12345604307455843,"7497":0.25374273161168276,"7498":-0.9922989179366662,"7499":-0.827335397698908,"7500":-0.761632899416077,"7501":1.934538291897279,"7502":0.928454085010962,"7503":0.6631846132897621,"7504":0.24657344919026536,"7505":0.2614808873988954,"7506":0.17573412861235596,"7507":-0.1080541910454592,"7508":-2.4098075845822073,"7509":0.5538159634076657,"7510":1.6343779617106307,"7511":1.1013617130675597,"7512":0.5138070341537344,"7513":0.3974154696555485,"7514":0.19501998538718862,"7515":0.3052720424234487,"7516":-0.18493201108229143,"7517":0.6846002861336785,"7518":-0.4594372692341961,"7519":1.7443767450807757,"7520":0.6578070426086728,"7521":0.2716736920335377,"7522":0.31481132025375325,"7523":0.25139167344614155,"7524":0.3745139605750855,"7525":0.981813372397206,"7526":1.8639777500113262,"7527":-1.6905395720840455,"7528":2.3613735134095095,"7529":1.4634433829398115,"7530":0.6064207451376775,"7531":0.31655460241141425,"7532":0.3133537065407649,"7533":0.3152713683402128,"7534":-1.2539387963199802,"7535":-0.5233673776468881,"7536":-0.4613365580021742,"7537":1.6476350268793953,"7538":1.2566511340353308,"7539":1.0412982950673102,"7540":0.4609808481839908,"7541":0.3123482335830062,"7542":0.18251055811058992,"7543":2.3149261381244086,"7544":0.17960327664645184,"7545":0.04537932572549835,"7546":1.0820744427087572,"7547":4.255517797940157,"7548":1.4163786603187773,"7549":2.854433943711957,"7550":0.055350535466659995,"7551":-0.43297247933752725,"7552":2.2050025330266196,"7553":-3.8010451547040858,"7554":1.956104727311319,"7555":0.8662391818225853,"7556":-2.986872316577766,"7557":-0.7301064063983984,"7558":-1.4588471201206357,"7559":0.7735141211582467,"7560":0.6324982444678472,"7561":-1.597816608063686,"7562":-1.1570333215289867,"7563":0.24924425380913462,"7564":0.950989126223233,"7565":0.8925260649019124,"7566":1.5452038849282195,"7567":0.2770076248082308,"7568":0.7450032579581546,"7569":-0.6854076979330364,"7570":3.9921569416433376,"7571":-1.0426574325737428,"7572":1.5610537753394063,"7573":4.307524591844677,"7574":-0.11336084748828384,"7575":-2.323938976539437,"7576":-2.08052782500587,"7577":-2.1826191323706583,"7578":-2.214045535347752,"7579":1.231991421878356,"7580":0.32963151165708376,"7581":-0.17121331801940887,"7582":-1.3870478569636353,"7583":-1.3039526157107366,"7584":-2.50803597463534,"7585":-2.7604007484895674,"7586":-5.824755313649396,"7587":1.7375349018466457,"7588":-1.3505322583043058,"7589":2.400372345857428,"7590":-0.27471684385939626,"7591":0.8676988908125277,"7592":-0.5457903250837975,"7593":0.6191311204977287,"7594":-5.8393349214408765,"7595":-3.3649001708695767,"7596":-1.4045510128272047,"7597":-2.2200391047124195,"7598":-2.446818088811815,"7599":0.3950253751335113,"7600":2.2612785114081113,"7601":0.6625852756838244,"7602":-0.2760035283990847,"7603":-2.241407274045411,"7604":-2.3692730137382334,"7605":-1.564545735675453,"7606":-0.9893901732398254,"7607":0.4110187086960967,"7608":0.10304477819619645,"7609":-1.719000419992984,"7610":-5.600629778629016,"7611":-2.9329882108407532,"7612":-0.5669625829466738,"7613":-0.719587892914849,"7614":-3.4088697454927215,"7615":0.7365833188273738,"7616":0.7248391425336027,"7617":-3.006835726163314,"7618":1.222900646864686,"7619":-1.4966258640331898,"7620":-0.9973671464151801,"7621":-2.128838747178824,"7622":-1.1042984179560795,"7623":1.442942942153096,"7624":0.7225391302518323,"7625":2.9031423316583673,"7626":1.4973982885756394,"7627":0.8403178995503005,"7628":-2.7886258124636627,"7629":1.0900584141091123,"7630":-2.376596379843122,"7631":-0.7483368673812393,"7632":0.9058984579676247,"7633":-0.9598443248929955,"7634":0.09605595436418193,"7635":0.6264364356492236,"7636":-0.8584958553614968,"7637":1.524073629270148,"7638":3.082298847304223,"7639":-0.13081694244229364,"7640":-0.6790467339925887,"7641":-4.380311044262083,"7642":-2.4668045798492497,"7643":-0.4975209569989866,"7644":0.6056549661851669,"7645":-1.2546109838897144,"7646":3.1881671884298424,"7647":0.9897215806833579,"7648":-4.3987420221444795,"7649":-1.2622981481495843,"7650":-2.506318688218198,"7651":-1.2375574813713293,"7652":-2.889799746490616,"7653":-0.7759235514697185,"7654":1.1119414581307565,"7655":-0.040752187100776764,"7656":-9.57814220180207,"7657":-1.5757288530202451,"7658":-1.740778375108025,"7659":-3.0994140908353027,"7660":-0.4236618252327369,"7661":-3.118270116835382,"7662":-1.2831111849939234,"7663":-2.2476812141384412,"7664":-0.08803948798263833,"7665":0.33230811242516295,"7666":9.214209669702559,"7667":8.20402632061276,"7668":3.515370618491637,"7669":3.0062184896896462,"7670":2.015691041971997,"7671":-0.3907072818947924,"7672":0.9484032299030687,"7673":1.201481493972294,"7674":2.5799549483450455,"7675":3.5915722923699156,"7676":5.851419510406518,"7677":4.067689494958765,"7678":0.437602448913275,"7679":2.81788055580823,"7680":-1.149869548105257,"7681":1.4890590872504532,"7682":2.019285208708089,"7683":-1.4801446908698874,"7684":0.4297269919256347,"7685":-1.1103764538683385,"7686":-3.5538772441772566,"7687":2.562943854494182,"7688":1.9217154838816062,"7689":0.09596524188945954,"7690":-2.9321336915470275,"7691":2.853952966273514,"7692":-1.6012258985521721,"7693":-0.2573738229687557,"7694":3.3238824611056694,"7695":-1.1700622158182732,"7696":-1.6219501763719006,"7697":-1.1910763001374325,"7698":0.2677695357428755,"7699":2.796723992980967,"7700":0.8741625683004561,"7701":0.03957323791033776,"7702":-0.4862498796144231,"7703":-2.1922277871829587,"7704":5.9217751836501415,"7705":-0.28453684812773283,"7706":3.8159273195609194,"7707":0.4692510683072032,"7708":1.0222554069738408,"7709":-0.25839991813303553,"7710":-0.37700602778488923,"7711":-2.8702194212084615,"7712":1.6960472888361569,"7713":-0.4940635088392655,"7714":0.9936994701905725,"7715":3.169988349442589,"7716":-0.5113406091076922,"7717":-0.8265011770951143,"7718":-0.3298825609688265,"7719":-1.6127652532583745,"7720":-1.0510803821272596,"7721":0.024046028524104493,"7722":0.7951596873432696,"7723":4.341100782342905,"7724":0.7211961118007891,"7725":-2.2565846430741883,"7726":-0.7203777733439213,"7727":2.000184147794931,"7728":-1.840916320907754,"7729":-2.909615727392047,"7730":2.40366299263672,"7731":0.6336864787318207,"7732":0.8019318401378666,"7733":-1.9147262506481821,"7734":0.5298587788330126,"7735":-0.6953967473197407,"7736":0.2626334140010226,"7737":-1.2023399391310645,"7738":3.6295731129085307,"7739":0.717339103109128,"7740":1.603214048959322,"7741":0.8330671328939129,"7742":0.8198930844374003,"7743":1.0437369958894167,"7744":-0.7926739851040866,"7745":3.9323781571963727,"7746":4.197901712009332,"7747":-1.076264465639257,"7748":-4.000090324878691,"7749":-3.2540349210643753,"7750":3.309865325333545,"7751":4.698114081946971,"7752":-2.073968198237938,"7753":-1.9606736960440148,"7754":-0.8653408308904449,"7755":2.306360259856564,"7756":-0.3192219874400231,"7757":-1.4192911259795573,"7758":-8.725954559728255,"7759":-5.142886171104431,"7760":-6.13538791124261,"7761":-6.361008696327453,"7762":0.42524029267590924,"7763":0.7565385114094535,"7764":0.6155528717677202,"7765":1.0097990635404137,"7766":-1.5334704074316838,"7767":0.2524058725435718,"7768":2.0843387681253516,"7769":1.731158441930516,"7770":-0.4521282007275814,"7771":1.0725787782245269,"7772":-4.250443676706211,"7773":-0.6727163378582159,"7774":-2.006354501330586,"7775":0.4468718304127135,"7776":-1.1581571202601384,"7777":-2.672783907842181,"7778":-1.0065633186481315,"7779":1.3514222783868202,"7780":3.3988510741170126,"7781":-1.2865551809801428,"7782":-2.95532742657076,"7783":0.21828969158072908,"7784":0.6642733471683125,"7785":-2.2767688977257974,"7786":3.0740383744628517,"7787":-2.384469144441856,"7788":-0.43094268260550034,"7789":-0.1900585525741282,"7790":-0.6213074713341784,"7791":0.12999735951990418,"7792":1.2979726116332921,"7793":-0.0937345830280716,"7794":-2.1189222200992788,"7795":-0.7303006054116721,"7796":-1.6747936988085803,"7797":0.14253118144173935,"7798":1.160665338474233,"7799":-0.32490838244929504,"7800":0.4638142460329889,"7801":0.43782436947959397,"7802":0.490825804103503,"7803":-0.6120033512960597,"7804":-1.2724707268318445,"7805":-0.22414026206468954,"7806":-0.7700553817912471,"7807":-0.45797374594027096,"7808":1.8065300500132957,"7809":-0.1107439522212239,"7810":0.20416164206280518,"7811":-0.2148608473431469,"7812":-0.6773479919781962,"7813":0.7827842930527418,"7814":-1.4247994300063083,"7815":-0.7663103910473974,"7816":-0.28529854122766657,"7817":0.5697564761257445,"7818":0.20446538076625126,"7819":-0.04454269290156956,"7820":0.4473530404816951,"7821":-0.5143107369465421,"7822":-1.336723782982238,"7823":-2.7884783091497667,"7824":-1.5279910636460448,"7825":0.22451082449033877,"7826":-0.9026282673778163,"7827":-1.1346703388272896,"7828":0.17410483823298667,"7829":-5.529903953849532,"7830":-1.5020742485208989,"7831":-2.2584119605509225,"7832":-1.0565374017304148,"7833":2.4287347542244873,"7834":1.632337777544238,"7835":0.8592733762557333,"7836":0.27913901243695666,"7837":-0.9900401051561583,"7838":8.756685294917501,"7839":11.101746549961511,"7840":14.099265538343547,"7841":8.596930336308708,"7842":5.5868184319958445,"7843":-1.772374426004181,"7844":0.9616322146702904,"7845":-1.2054853192038804,"7846":0.2704385850738149,"7847":-3.5994294258950372,"7848":-2.6647233585199133,"7849":-2.176624013886041,"7850":-1.0960996807771548,"7851":-1.1270254908501391,"7852":-0.5618020730158013,"7853":-0.32047272566567153,"7854":-0.1999209974635913,"7855":-0.45276760664709453,"7856":1.427384566870245,"7857":0.33196425806369484,"7858":0.07209557205404882,"7859":0.8289504324754601,"7860":1.6163708406045676,"7861":-1.1985948399432012,"7862":-1.0461541925516646,"7863":1.6495276443132547,"7864":-0.0869819214767435,"7865":0.347450377223083,"7866":2.4326016185734343,"7867":0.7887673609533781,"7868":-0.6684748377875559,"7869":1.6324112261265602,"7870":0.8333029682844231,"7871":0.9930323085516246,"7872":1.368793311303033,"7873":-0.39687373740293724,"7874":-0.45776770971535835,"7875":0.35177755808974803,"7876":-2.85150507284492,"7877":-0.29969137224841785,"7878":-1.034694481054546,"7879":-0.6407561489654088,"7880":-1.9733776957759679,"7881":-2.1989925818714626,"7882":2.6248411227411244,"7883":0.35393449790230164,"7884":-2.1248966425821436,"7885":-1.6760854350898526,"7886":-2.009579343076606,"7887":-2.702829867583283,"7888":-1.7738993263985297,"7889":-1.998556451496387,"7890":0.1984206632121991,"7891":-1.2430323150467029,"7892":-1.8551449644075724,"7893":0.11523250354322698,"7894":-2.6485786683002295,"7895":-0.6645424872059034,"7896":0.016421316584320007,"7897":-1.962663590091361,"7898":-1.2456627835816008,"7899":0.27549178850532735,"7900":-1.3414589142749733,"7901":0.2953547548102701,"7902":-1.1934391709467083,"7903":-3.0260633954093263,"7904":-1.9759484471910493,"7905":-0.6674789385957712,"7906":-0.5629747845509901,"7907":-2.0225426249425786,"7908":-0.987841365422487,"7909":0.2970716040832578,"7910":1.4861731761481753,"7911":5.295775457267826,"7912":-5.254259969753378,"7913":-1.2678072610048945,"7914":-2.276031943498413,"7915":-1.1800177792623148,"7916":-2.2274963715101617,"7917":-2.287241522080761,"7918":-0.6018386324957187,"7919":-1.787472497616811,"7920":-0.5086953192133048,"7921":-0.07398240049530032,"7922":-1.1567182937382747,"7923":-0.3944759451891378,"7924":-0.7890109183079091,"7925":-0.25929452735606223,"7926":-0.7418523227931754,"7927":-0.8410882502923808,"7928":-1.2273762045683763,"7929":-0.27702907887668393,"7930":-5.122897414699536,"7931":-0.8861026359828471,"7932":-0.4468619567741099,"7933":-0.6230624377508214,"7934":-1.0688548647810905,"7935":-0.2804528085934473,"7936":0.9559892018839506,"7937":-2.7715686594042768,"7938":1.7642407819729296,"7939":-4.341291478439897,"7940":-0.12576833765313136,"7941":0.4266833971993503,"7942":-1.4176704335543333,"7943":0.31139984094971274,"7944":-0.6512120945809253,"7945":3.9034410858558544,"7946":-0.7351282860643963,"7947":-1.4797802674122702,"7948":-3.2590170255715947,"7949":-2.491350699607643,"7950":-2.529984556700571,"7951":-2.304029446205943,"7952":0.38279161276915075,"7953":0.6640377795885474,"7954":-2.4151185475634342,"7955":1.7429683937756635,"7956":0.1814034739016487,"7957":1.2853363900958368,"7958":-1.4304194248417803,"7959":0.8494701236872539,"7960":-2.0861905818397677,"7961":-0.47034656010864484,"7962":0.37508404410571267,"7963":3.8413961014388187,"7964":-0.4992113056919572,"7965":-1.120255868549364,"7966":-3.463340939462593,"7967":-3.301777556668938,"7968":-0.33646287927087126,"7969":2.7705547618925155,"7970":2.4405738082820267,"7971":0.770286910181143,"7972":3.1616817993350455,"7973":-0.4590658436634946,"7974":-1.4734986239854162,"7975":-0.359391540464213,"7976":2.044841569070706,"7977":1.5051437415463549,"7978":-0.6225145280172019,"7979":-3.7665825991024913,"7980":-4.5525508863596444,"7981":-1.7004121206316334,"7982":-1.6563919803162794,"7983":3.837299456687287,"7984":1.7584805835590698,"7985":0.31359284290573125,"7986":-1.408964124838369,"7987":-1.4796766338083787,"7988":-1.329459464522361,"7989":-2.9165604846343496,"7990":4.169272816846931,"7991":2.365248032157656,"7992":-1.4086486393601712,"7993":-7.278422766136697,"7994":10.096097285679674,"7995":7.198989275141869,"7996":6.729825574538477,"7997":0.8094699846601939,"7998":-0.3220873370907181,"7999":-4.1934865975171824,"8000":-1.0483061986279703,"8001":0.585509969605801,"8002":-0.8591760580440301,"8003":-4.436589060743211,"8004":-1.6630461094634739,"8005":-3.3350635792038767,"8006":0.331260258648233,"8007":3.10101262643778,"8008":-2.1500484226929255,"8009":-4.907241545673318,"8010":-0.8431507098624702,"8011":2.97185858129816,"8012":1.841287842175541,"8013":-1.3322278628276738,"8014":-0.8761169387854822,"8015":-0.2735912854092398,"8016":4.5526738207904005,"8017":1.0590870041013034,"8018":-1.406979992239063,"8019":-0.22324108204057824,"8020":-1.936274521171403,"8021":-2.467684662658974,"8022":-1.4375061583022781,"8023":0.8975112499599653,"8024":-0.2924515116044946,"8025":-2.3952125877598793,"8026":-0.9868614929091013,"8027":1.8557432813308847,"8028":-0.01320665757626056,"8029":-1.2261125387704932,"8030":1.5962849247247939,"8031":-3.069150300132949,"8032":-0.187734844863028,"8033":1.2850614549071964,"8034":0.9425743408691486,"8035":1.0193190635804694,"8036":0.542985364219419,"8037":1.1525010009595056,"8038":-0.4437558441776704,"8039":-1.2824815122466062,"8040":-0.21857144313528487,"8041":-0.08933668331078502,"8042":0.8362940575394351,"8043":-0.5869481704184062,"8044":-0.20671996984377233,"8045":0.04101739671129347,"8046":0.27605865496354265,"8047":0.13054029487836694,"8048":2.534131314043609,"8049":-0.4811595052188838,"8050":-1.3852524016538519,"8051":-1.0672656658616206,"8052":0.1203317418647075,"8053":0.4152206628224745,"8054":-0.3164291919478156,"8055":1.1713869007444502,"8056":0.9104395138877834,"8057":-0.6218470915068024,"8058":-1.0721193699798464,"8059":0.12286419849979432,"8060":1.487830722953019,"8061":-0.780864284577789,"8062":-0.343979839230764,"8063":1.0109106652035955,"8064":0.17733559061549045,"8065":0.8386589158277834,"8066":-3.656650896550713,"8067":-2.420027476419673,"8068":2.3361557522001,"8069":0.7368593585289057,"8070":-1.0465134927318025,"8071":0.19166709098589083,"8072":-0.9426565462505326,"8073":1.266777468289591,"8074":3.56206125304592,"8075":-23.393678661227177,"8076":-15.680006640704917,"8077":3.3431148556190373,"8078":0.7758940520240349,"8079":-0.3945030492317637,"8080":-0.9895210914993398,"8081":0.2671008513127557,"8082":-0.6775531058315882,"8083":0.46006959149244825,"8084":-3.183074017706937,"8085":-2.2325160873998615,"8086":0.1371970471842776,"8087":-0.12791311500417663,"8088":0.0052785221352696235,"8089":0.046574804004587335,"8090":0.0022930547413624034,"8091":-0.9086271344810907,"8092":1.226045082875862,"8093":-1.2908156238071486,"8094":-0.34794251582897834,"8095":-0.6954661518932999,"8096":-0.8797188951619879,"8097":-0.7205702250378727,"8098":-1.2262763866270872,"8099":0.4029627121767372,"8100":1.6475834462168075,"8101":-1.6674108997401578,"8102":0.5863624452973776,"8103":-1.1227899337642304,"8104":1.451697170806436,"8105":-0.4781987385917014,"8106":0.031042176023266844,"8107":1.2208578740806373,"8108":-1.3123054569473531,"8109":-0.6046095270476979,"8110":-0.7745856295069473,"8111":-0.3181338378463618,"8112":-1.2008173219099016,"8113":1.2984371661014753,"8114":-0.5434300251059916,"8115":0.6672947806673404,"8116":-2.9537342230655086,"8117":-0.7941461550586741,"8118":-2.589394036561302,"8119":-1.890560957952248,"8120":1.5469832936305925,"8121":-0.09678942967611388,"8122":-3.2550791309899982,"8123":-0.7421010028888926,"8124":1.9872837789071325,"8125":1.2371889036893904,"8126":1.7895224322613945,"8127":-0.6721377021991105,"8128":-2.55299608158111,"8129":1.280418392197641,"8130":2.029117281925799,"8131":0.6716510432642818,"8132":-1.7396120972724018,"8133":-3.8091534072884623,"8134":0.6454950853745359,"8135":1.7272596420406128,"8136":2.6289701743559175,"8137":-2.0045398774982934,"8138":-4.0390567868706055,"8139":0.18087700652858618,"8140":-1.1524980433646865,"8141":-0.7066284820816989,"8142":0.10895825245010167,"8143":0.44001077786260834,"8144":3.76813925576033,"8145":-1.3818406496363362,"8146":-1.623903743140506,"8147":4.063820337479354,"8148":-0.18718224652588816,"8149":-2.5387237736121375,"8150":2.9355172474356594,"8151":-3.2651980181935945,"8152":-1.2623409151012097,"8153":-3.6899033347478167,"8154":-1.1521591367154669,"8155":-2.106122333281004,"8156":0.9301476351179948,"8157":2.543647592234346,"8158":0.46130108513384144,"8159":-1.9167767408170475,"8160":1.6323144630744284,"8161":-3.0422535511478594,"8162":-2.4981986496854156,"8163":1.0250438693806347,"8164":-0.6564168421273047,"8165":-4.1814465235816,"8166":-2.623089383332778,"8167":-5.283412015059928,"8168":3.3213558804826815,"8169":1.6403208423265734,"8170":2.2393801183119133,"8171":-0.10981937065306602,"8172":-1.5073413098133457,"8173":1.703982818344258,"8174":-0.3859134247374928,"8175":2.784270747461283,"8176":-2.488418969034312,"8177":4.663641992731216,"8178":2.560237045863959,"8179":-4.504209402983941,"8180":-3.089489803447871,"8181":0.9520552857819684,"8182":0.9274187059243589,"8183":-0.5834207262489126,"8184":-2.59136931186079,"8185":2.6029156849240733,"8186":1.0274919296457776,"8187":-1.7626641899587572,"8188":1.0062046196292564,"8189":1.525478947990277,"8190":-0.690108248957557,"8191":-1.4589097478597302,"8192":-0.22620520401134528,"8193":-3.4119158370140754,"8194":2.015350884108992,"8195":2.8920006670332703,"8196":-1.8991996371158053,"8197":-1.3998082683763937,"8198":1.083137301337168,"8199":0.6591841934044682}},"b1":{"n":100,"d":1,"w":{"0":5.268051054508716,"1":-10.7551394501237,"2":1.2945035522794788,"3":-7.43473111628051,"4":-3.9309458350715536,"5":-2.425762372481485,"6":-0.9302740859315549,"7":6.4656846543755995,"8":3.7800108102318273,"9":0.8789788260518656,"10":-3.1992704884360457,"11":9.637745873192827,"12":-10.48557556614635,"13":3.2912761298294644,"14":3.5088294664319757,"15":-6.716644706096596,"16":-0.5066951296592829,"17":-3.7626644201333797,"18":-2.7780669917530822,"19":5.371783828331833,"20":-1.0663572137509567,"21":12.389620855958304,"22":-0.8917970949113558,"23":-3.1003525152331473,"24":0.43366428802793333,"25":1.9452478358660787,"26":-2.1260791858747017,"27":-1.7277533077643938,"28":-5.584746998857015,"29":2.604498238406097,"30":5.9090889061891785,"31":20.467096103845627,"32":-3.7167796966094375,"33":0.7818174834723722,"34":2.0433300676479,"35":-2.250587830694907,"36":-6.178766133471763,"37":-1.2465656183008922,"38":1.2473887357547346,"39":1.5118943785811878,"40":0.2172234582507765,"41":-2.8620248050074624,"42":10.702897505596999,"43":-2.3368043833200103,"44":-5.166049549517082,"45":-1.9904778060566986,"46":8.84546588426958,"47":3.9769639805431813,"48":16.66099430466902,"49":-3.6409828594672593,"50":4.003353967100653,"51":11.571009267816887,"52":13.129353176314599,"53":4.626507077360704,"54":-6.367988859978177,"55":3.6105781819925107,"56":0.6811488091988409,"57":0.27691563253857626,"58":4.940395370164674,"59":-1.335565009209035,"60":-3.131413645028785,"61":3.2921373473223365,"62":-6.072006708074822,"63":-3.2546949713462703,"64":-3.551368609673851,"65":7.852120064039203,"66":1.4846852382403903,"67":-2.4925977453057344,"68":-18.70217353974155,"69":-4.073488540771627,"70":0.36120675002316804,"71":-8.379811383281291,"72":-1.5575476550768514,"73":3.59979616856646,"74":-3.4452765328205164,"75":6.760494165633105,"76":-0.359907537805769,"77":-10.983477571537081,"78":-4.847650218177523,"79":-4.600218358464981,"80":-1.9182042667955703,"81":0.9765529927289016,"82":-4.32953404808332,"83":3.7096202658315858,"84":-7.416441648632481,"85":-0.7119036426893717,"86":2.4285473529371853,"87":-16.99598225936032,"88":1.353537601448152,"89":-8.429971132155833,"90":5.65723253189999,"91":2.0087405939404217,"92":13.721279455919117,"93":-6.790908543169489,"94":-1.9186108861580065,"95":2.230038946831692,"96":1.6829052438144558,"97":3.3013431650053344,"98":20.992407236572305,"99":-1.5354273840483261}},"W2":{"n":4,"d":100,"w":{"0":-0.7796908576870406,"1":-0.34517324113246883,"2":5.938281559316072,"3":-0.3693001392635229,"4":-0.6356763974936465,"5":0.2050159434978522,"6":0.5760830274273895,"7":-1.316279720640323,"8":-0.0360349925275058,"9":0.04055432929407186,"10":-0.9499303882438075,"11":-0.4210522323649648,"12":1.4919529899967938,"13":-1.7574676627053576,"14":1.4585078637501765,"15":-0.3002240864335245,"16":0.7043357080164901,"17":0.03803995052771461,"18":-0.15465303123524723,"19":-0.35694316862845166,"20":-2.9948827909063844,"21":-0.2645832507187665,"22":-0.22369069725540106,"23":0.13492947277515233,"24":-5.40162727756327,"25":0.00149932428212424,"26":0.17671591692038438,"27":0.38485286736470603,"28":0.8750522638336345,"29":-0.578196069898249,"30":-0.9561361643217786,"31":2.329595435543902,"32":-0.18054044432616542,"33":-0.9272892509401336,"34":-0.8423998115128049,"35":-0.7018649445049175,"36":1.1901728955250153,"37":0.18661138606200325,"38":3.4951601293215315,"39":-1.6867097358323355,"40":-0.4450368503393895,"41":3.534645687618483,"42":0.35954185848643866,"43":1.3157835363300672,"44":0.8202963926995782,"45":-8.647422461789686,"46":-0.24376968390052356,"47":-4.033381148523089,"48":-2.1319407637911625,"49":-0.9628399304352963,"50":1.0821290605154894,"51":0.06671356391286058,"52":-0.1709578731196875,"53":-0.7627909298496772,"54":-0.19240402595634565,"55":0.23431696389817058,"56":1.470465584148439,"57":-3.0187385082489775,"58":-0.5555999552656188,"59":-2.2527147750757845,"60":-0.6992560139372596,"61":-0.4608938847204028,"62":0.14736892881519506,"63":-0.6564285900390143,"64":0.6032076512980548,"65":1.3543771045579835,"66":-1.256742291919809,"67":-1.2795983751042956,"68":-0.15619505175716358,"69":2.7416498021968607,"70":-1.5867183049817117,"71":-0.8675762207610354,"72":-0.6053954511078641,"73":3.383966155187124,"74":0.24893835378898116,"75":0.00648381560901265,"76":-0.6975318052021935,"77":-0.8418411407126216,"78":0.1085596446948637,"79":-0.12381702815320193,"80":-0.6383357346737211,"81":-0.6358151008853913,"82":0.2653421258099664,"83":-0.44540114260465274,"84":0.0988707039674717,"85":-3.8965428129770268,"86":1.5085251234615944,"87":-2.587365873631803,"88":2.4218004198653738,"89":0.832507671766238,"90":0.2157807629051895,"91":1.3197953497487955,"92":-0.2755343949151052,"93":0.03620413808019907,"94":-0.9914816042818853,"95":-0.2570170900601376,"96":-2.086955977142321,"97":-0.3683119886877188,"98":0.31852457605257334,"99":-0.21849291096657486,"100":0.7285639868716809,"101":0.41977297538808833,"102":-6.405241425281388,"103":-0.27078885812494835,"104":-0.6350785104774013,"105":-1.341223656144893,"106":-0.10747259752908048,"107":-0.854320515099176,"108":0.36391415404200284,"109":0.8260963905834027,"110":0.2121748780589612,"111":0.5312564173570129,"112":0.4558847115547535,"113":-0.7110160632226573,"114":0.35716547717170266,"115":-0.9430696824147663,"116":0.22961570568173414,"117":-0.3398786281213179,"118":-0.5464534742044818,"119":0.5648354990957317,"120":-2.9823032962019154,"121":0.5712862228735544,"122":-0.5959173780757067,"123":-1.5524605850051318,"124":1.5125825982136134,"125":0.0037352704577408094,"126":-0.51593957582651,"127":0.7696276894320407,"128":0.17664613126712095,"129":-0.26127896950678314,"130":-0.82036707590255,"131":0.4251788124196356,"132":-0.3741633828474711,"133":-0.10229267315707792,"134":-0.8334041872268432,"135":0.8165493006145724,"136":-0.8032620396632446,"137":-0.9653684795970404,"138":0.9805847868836365,"139":0.30450461232421944,"140":-2.4809513163585972,"141":2.887433249429169,"142":0.6867586188965196,"143":-0.05049476016566336,"144":0.048253629809132274,"145":-0.13788550797474713,"146":0.6922776915933763,"147":-0.2894732601388884,"148":-0.6980547771895383,"149":-0.6736476733645088,"150":7.733543183055047,"151":-0.19594785092195993,"152":0.41017688048043915,"153":-0.7072893768614236,"154":0.35763165577983963,"155":-0.0387950623265822,"156":0.7804120077319374,"157":5.17958595635917,"158":-1.0385476897316683,"159":-0.97057384417165,"160":0.09763022673783228,"161":0.05117809571658155,"162":-0.8075153224583391,"163":0.03339135807410126,"164":-0.643564851157906,"165":0.5829202998843449,"166":-4.928973519784298,"167":-0.2635387812714559,"168":-3.0572004858301507,"169":-1.2128386354200766,"170":0.687343638006287,"171":-0.14238478876591093,"172":-1.2226284165882282,"173":0.5725003896600778,"174":0.2031916178383204,"175":0.23932099243105798,"176":2.047212520052102,"177":-0.7207204868116883,"178":-0.4533574639388244,"179":-0.14653558883505394,"180":-0.36344710370711414,"181":0.06264839045405017,"182":-0.5327436438844284,"183":-1.3365606858497232,"184":-0.49352829822965655,"185":-1.8247463584634505,"186":0.2333468989365635,"187":0.2675268509876641,"188":0.7729537021246771,"189":-0.25118158709533733,"190":0.20033842000174262,"191":-0.9916941985769887,"192":-0.6196644302521354,"193":-0.6164214006754557,"194":0.10020457594390088,"195":0.3867250032859939,"196":-1.13891498348088,"197":0.36289457329375563,"198":1.2971468869282456,"199":-0.5208782248486018,"200":-0.3626131384626587,"201":-0.40482102519095736,"202":-1.903173035881296,"203":-0.29710603744038144,"204":-0.15999869345420215,"205":-1.6760678391301114,"206":0.32216398919744704,"207":-0.6742037983158689,"208":0.42804273786077945,"209":-0.6251466327877304,"210":0.6850257781859518,"211":0.1925865312720048,"212":2.576142780067641,"213":-0.7826483695856301,"214":0.3758485580507968,"215":-0.2494037410246381,"216":0.5004315063633181,"217":-0.23514555478729574,"218":0.6077792925433937,"219":0.4976262099127462,"220":0.8040611743894486,"221":0.07412589186099765,"222":-0.076985514170938,"223":0.11888262111288962,"224":0.5409493065331418,"225":-0.2575569727883247,"226":-0.30402297686934004,"227":0.6407134727384207,"228":0.873709955704034,"229":-0.5880153086129507,"230":0.17192826429961436,"231":1.5789619864768047,"232":-0.30612963922100267,"233":0.2393574183541083,"234":-0.8141082224077166,"235":-0.4489433665590252,"236":-0.07136418636890525,"237":-0.27056717955435644,"238":-3.785321185953343,"239":0.8804005932930904,"240":0.30190370189559973,"241":-4.635138059915343,"242":0.3259029754347463,"243":-0.5244209920357791,"244":-0.5968866810082685,"245":-0.40688280220087847,"246":0.2422338946547802,"247":2.083076541927106,"248":-2.5983186621318493,"249":-0.5654455185688929,"250":0.558360658608821,"251":0.8251585991224931,"252":0.35278410075688404,"253":-0.4898461928343753,"254":1.1332271903890048,"255":0.3889923599796745,"256":0.37011697856090114,"257":3.1130429179558505,"258":-0.7046000698883333,"259":-4.392691050337408,"260":-0.2929149060575961,"261":0.4137038923529217,"262":-0.36202002782701725,"263":-0.3321955409699408,"264":-0.23711190900496007,"265":0.13308997269199094,"266":1.2019518213211657,"267":-0.34807241990516546,"268":0.12003037082905257,"269":-0.3291723561017575,"270":-0.9041866823720512,"271":-0.6738868102954143,"272":2.267870078657775,"273":7.513913491739034,"274":0.7559588486322221,"275":0.30469129238810294,"276":1.9099005490532532,"277":-0.2891466446668682,"278":-0.35281501636649476,"279":-0.44148856832548744,"280":-0.38809205677886277,"281":0.18723157752360226,"282":-0.4338807969490321,"283":-0.6598015145062376,"284":-0.2907759617391692,"285":-3.7474997277447697,"286":0.10259410024914194,"287":-2.3064027132848635,"288":3.6128781235550114,"289":-0.5724484873732293,"290":0.40470907191757816,"291":3.1915548917411125,"292":0.35561850840119563,"293":-0.29722852949769996,"294":0.36350872785691674,"295":-0.6096998042098963,"296":-1.4710111150252272,"297":-0.2605518579961694,"298":1.1480548316443138,"299":-0.36273757569975595,"300":-0.525250416452445,"301":-0.179664796325489,"302":2.5201616222890824,"303":-0.23488581443520987,"304":0.30199251454333037,"305":-1.775748522860914,"306":0.5732909133907084,"307":0.5654249111534076,"308":0.24033398318085436,"309":-0.48750464530157633,"310":0.057913249922621084,"311":0.7835337533305983,"312":1.2983243699148344,"313":-0.25755776540582287,"314":-0.15723339087217092,"315":-0.20097512528100164,"316":-0.08907213212253606,"317":-0.33876949091317804,"318":1.2832723829795696,"319":0.7620660352106917,"320":-0.10212206270145156,"321":0.22559204463156146,"322":1.0054729968443479,"323":-2.4355947590026528,"324":-6.795861928649205,"325":0.6253895696905042,"326":-0.3080780266070938,"327":0.6913977242545616,"328":0.373877268893328,"329":0.013725329157782226,"330":0.9924858062562494,"331":1.341378952981083,"332":-0.007127215428548899,"333":0.46518733787695266,"334":-0.47642155443060036,"335":-0.5581186806760073,"336":0.5294703606749058,"337":-0.3891893945204853,"338":-3.582867807885216,"339":0.5161919923143927,"340":0.17456387418363575,"341":2.96230697531403,"342":0.5988905349948762,"343":0.2902554833138582,"344":2.7309020980762986,"345":0.17696402141700515,"346":0.16863066915529565,"347":0.11400700910828988,"348":-0.18940814808690307,"349":-8.934047272696919,"350":0.6121997314022108,"351":0.245670271910859,"352":1.625475454789842,"353":0.1298241919441842,"354":0.912988424778314,"355":0.39503200692865154,"356":0.5254609510780064,"357":-0.9150577779497404,"358":-0.48032014481758906,"359":-4.553983654302409,"360":-0.45915055761977636,"361":-0.1637963535065597,"362":-0.2491724399799779,"363":-0.1660561033733763,"364":0.1475192548192859,"365":0.11667831902854955,"366":-4.359465657168679,"367":-0.6382609343435436,"368":0.2564317123827426,"369":-3.1516035964995246,"370":1.041505056595393,"371":2.203776483687687,"372":-2.7594278327607222,"373":0.8187101611532338,"374":-0.14821023397641547,"375":0.6883738568845483,"376":5.4022518758385285,"377":-0.40120655105230124,"378":-0.3016459180597221,"379":-0.0491821924751675,"380":-0.4488891480308028,"381":0.9300436674981737,"382":-0.04120640994388289,"383":-0.4826881816081027,"384":-0.1650024782434217,"385":-6.692043747409049,"386":0.09287673989769361,"387":-0.8019746760492552,"388":0.8461657326449944,"389":-0.04610024758175961,"390":-0.164057763582005,"391":-1.0606430611203421,"392":0.6634373690940636,"393":-0.16906208590068256,"394":0.01451373647659978,"395":-1.1763977133284023,"396":-0.15884012732689134,"397":0.05285276719671609,"398":0.4475801963601048,"399":-0.0009599715608731895}},"b2":{"n":4,"d":1,"w":{"0":0.5297092570230586,"1":1.7693764541519088,"2":-1.0022761448168516,"3":2.5838641112783156}}}}
/* harmony export (immutable) */ __webpack_exports__["a"] = data;


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Data model that holds what the agent gets to see about the environment
 */
class AgentObservation {
    /**
     *
    // * @param {Array} visibles
     * @param {Array} tileTypes
     * @param {int} score
     * @param {Array} position
     */
    constructor(/*visibles,*/ tileTypes, score, position) {
        /**
         * @type {Array}
         */
        this.tileTypes = tileTypes;
        // this.visibles = visibles;
        /**
         * @type {Number}
         */
        this.score = score;
        this.position = position;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AgentObservation;



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Data model that holds the environment's full internal state
 */
class State {
    /**
     * @param {Array} tileTypes
     * @param {Array} position [x,y]
     * @param {Number} score
     * @param {Boolean} isComplete
     */
    constructor(tileTypes, position, score, isComplete) {
        /**
         * @type {Array}
         */
        this.tileTypes = tileTypes;
        /**
         * @type {Array} position [x,y]
         */
        this.position = position;
        /**
         * @type {Number}
         */
        this.score = score;
        /**
         * @type {Boolean}
         */
        this.isComplete = isComplete;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = State;



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__State__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(0);



/**
 * Returns a random initial starting state
 *
 * @returns {State}
 */
const generateInitialState = () => {
    return new __WEBPACK_IMPORTED_MODULE_0__State__["a" /* default */](
        generateRandomTileTypes(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* config */].size),
        [Math.floor(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* config */].size[0] / 2), 0],
        0,
        false
    );
};
/* harmony export (immutable) */ __webpack_exports__["a"] = generateInitialState;


/**
 * Generates a random set of tileTypes for generated random environment states
 *
 * @param {Array} size
 * @returns {Array}
 */
function generateRandomTileTypes(size) {
    const tileTypes = [];
    const min = 1;
    const max = 9;
    for (let xi = 0; xi < size[0]; xi++) {
        tileTypes[xi] = [];
        for (let yi = 0; yi < size[1]; yi++) {
            let randomValue = Math.floor(Math.random() * (max - min + 1)) + min;

            let tileType;

            if (randomValue < 7) {
                tileType = 0;
            } else {
                tileType = 1;
            }

            tileTypes[xi][yi] = tileType;
        }
    }
    return tileTypes;
}


/***/ })
/******/ ]);
