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
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tensorTools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AgentObservation__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__generateInitialState__ = __webpack_require__(30);



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
    pointsForCompletion: 100
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

        if (this._state.isComplete) {
            this._state.score += config.pointsForCompletion;
        }
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
/* 2 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18).Buffer))

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
	fixUrls = __webpack_require__(23);

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rl__ = __webpack_require__(26);


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

function renderActionResponse(actionResponse) {
    if (actionElements === null) {
        actionElements = [
            document.getElementById('action0'),
            document.getElementById('action1'),
            document.getElementById('action2'),
            document.getElementById('action3'),
        ];
        randomActionElement = document.getElementById('actionRandom');
    }

    if (actionResponse.wasRandom) {
        // randomElement.innerHTML = 100;
        randomActionElement.style.width = (100 * 3 + 50) + 'px';
        actionElements.forEach((element)=> {
            element.innerHTML = 0;
            element.style.width = '50px';
        });
    } else {
        // randomElement.innerHTML = 0;
        randomActionElement.style.width = '10px';
        const minAction = getMinimumVectorIndex(actionResponse.weights);
        // const maxA = maxi(actionResponse.weights);
        const maxAction = actionResponse.action;
        actionResponse.weights.forEach(function (value, i) { //@TODO what about if not in this else?
            let adder = 0;
            if (actionResponse.weights[minAction] < 0) {
                adder = -actionResponse.weights[minAction];
            }
            let fixedValue = Math.floor((value + adder) / (actionResponse.weights[maxAction] + adder) * 100);

            actionElements[i].style.width = (fixedValue * 3 + 50) + 'px';
            actionElements[i].innerHTML = fixedValue;
        });
    }
}

class RlDqn {
    constructor(learningEnabled, numberOfStates, previousSavedData) {
        // create an environment object
        var env = {};
        env.getNumStates = function () {
            return numberOfStates;
        };
        env.getMaxNumActions = function () {
            return 4;
        };

        // create the DQN agent
        var spec = {alpha: 0.01}; // see full options on DQN page
        this._agent = new __WEBPACK_IMPORTED_MODULE_0__rl__["a" /* rl */].DQNAgent(env, spec);
        if (typeof previousSavedData !== 'undefined') {
            this._agent.fromJSON(previousSavedData);
        }

        this._dumpTimer = 0;
        this._learningEnabled = learningEnabled;
    }

    getAction(state, reward) {
        if (this._learningEnabled) {
            if (reward !== null) {
                this._agent.learn(reward);
            }

            this._dumpTimer++;
            if (this._dumpTimer === 1000) {
                this._dumpTimer = 0;
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
                document.getElementById('q-learning-data').innerHTML = JSON.stringify(this._agent.toJSON());
            }

        }
        let actionResponse = this._agent.act(state);

        renderActionResponse(actionResponse);

        return actionResponse.action;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RlDqn;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tensorTools__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = convert9x9to5x5;


function convert9x9to5x5(matrix){
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__tensorTools__["b" /* shiftAndTrimMatrix */])(matrix, [0, -1], 1, [2, 2])
}

/***/ }),
/* 7 */
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
/* 8 */
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
        this._enableRendering = false;
        this._renderer = renderer;
        this._stats = Object.assign({}, defaultStats);
        this._onStatusChange = onStatusChange;
        this._agentObservation = null;
        this._godObservation = null;

        this.newGame = this.newGame.bind(this);
        this.takeAction = this.takeAction.bind(this);
        this.tick = this.tick.bind(this);
        this.clearStats = this.clearStats.bind(this);
    }

    newGame(agent, enableRendering) {
        this._agent = agent;
        this._enableRendering = enableRendering;
        this._environment = new __WEBPACK_IMPORTED_MODULE_0__environment__["b" /* default */]();
        this._stats.currentScore = 0;//@TODO get from environment?
        if (this._enableRendering) {
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
            this.newGame(this._agent, this._enableRendering);
        }

        if (this._enableRendering) {
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

    _updateObservations(){
        this._agentObservation = this._environment.getAgentObservation();
        this._godObservation = this._environment.getGodObservation();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameRunner;


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(2);


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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(2);


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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(2);


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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_feeler__ = __webpack_require__(2);


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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tensorTools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helper_RlDqn__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helper_viewportConversions__ = __webpack_require__(6);



const actions = ['w', 'a', 's', 'd'];

const numberOfStates = 5 * 5 + 1;

let rlDqn = new __WEBPACK_IMPORTED_MODULE_1__helper_RlDqn__["a" /* default */](true, numberOfStates);

class RL_DQN_5X5Viewport_In_Learning_Mode {
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
        if (observation.tileTypes.length !== 9 || observation.tileTypes[0].length !== 9) {
            throw new Error('Incompatible viewport size');
        }

        const state = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__tensorTools__["a" /* matrixToVector */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__helper_viewportConversions__["a" /* convert9x9to5x5 */])(observation.tileTypes));

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
/* harmony export (immutable) */ __webpack_exports__["a"] = RL_DQN_5X5Viewport_In_Learning_Mode;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tensorTools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environment__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__neural_network_saves_view_port_5_5_0_1_best__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helper_RlDqn__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helper_viewportConversions__ = __webpack_require__(6);





const actions = ['w', 'a', 's', 'd'];

// const numberOfStates = environmentConfig.viewPortSize[0] * environmentConfig.viewPortSize[1];
const numberOfStates = 5 * 5 + 1;

let rlDqn = new __WEBPACK_IMPORTED_MODULE_3__helper_RlDqn__["a" /* default */](true, numberOfStates, __WEBPACK_IMPORTED_MODULE_2__neural_network_saves_view_port_5_5_0_1_best__["a" /* data */]);

class RL_DQN_5X5 {
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
        if (observation.tileTypes.length !== 9 || observation.tileTypes[0].length !== 9) {
            throw new Error('Incompatible viewport size');
        }

        const state = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__tensorTools__["a" /* matrixToVector */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__helper_viewportConversions__["a" /* convert9x9to5x5 */])(observation.tileTypes));

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
/* harmony export (immutable) */ __webpack_exports__["a"] = RL_DQN_5X5;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HtmlTableRenderer_css__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HtmlTableRenderer_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__HtmlTableRenderer_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tensorTools__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environment__ = __webpack_require__(0);




function generateTableHtml(size, tableClassName) {
    let html = '';
    for (let y = 0; y < size[1]; y++) {
        html += '<tr>';
        for (let x = 0; x < size[0]; x++) {
            html += '<td class="tile-' + x + '-' + y + '"></td>';
        }
        html += '</tr>';
    }
    return '<table class="' + tableClassName + '">' + html + '</table>';
}

function getTdElements(size, tableClassName) {
    let tdElements = [];
    for (let x = 0; x < size[0]; x++) {
        tdElements[x] = [];
        for (let y = 0; y < size[1]; y++) {
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
        this._previousPositions = [];
    }

    /**
     * Render the current observation of the environment in HTML
     *
     * @param {AgentObservation} agentObservation
     * @param {State} godObservation
     */
    render(agentObservation, godObservation) {
        //Render the agent view
        let agentViewPortSize = [
            agentObservation.tileTypes.length,
            agentObservation.tileTypes[0].length
        ];
        for (let x = 0; x < agentViewPortSize[0]; x++) {
            for (let y = 0; y < agentViewPortSize[1]; y++) {
                let color = {r: 50, g: 50, b: 50};
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
        for (let y = 0; y < __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size[0]; y++) {
            for (let x = 0; x < __WEBPACK_IMPORTED_MODULE_2__environment__["a" /* config */].size[1]; x++) {
                let color = {r: 50, g: 50, b: 50};
                if (x == godObservation.position[0] && y == godObservation.position[1] && godObservation.tileTypes[x][y] !== 0) {
                    color = {r: 255, g: 255, b: 0};
                } else if (x == godObservation.position[0] && y == godObservation.position[1]) {
                    color = {r: 0, g: 255, b: 0};
                } else if (this._previousPositions[x + ',' + y] && godObservation.tileTypes[x][y] !== 0) {
                    color = {r: 255, g: 255, b: 128}
                } else if (this._previousPositions[x + ',' + y]) {
                    color = {r: 0, g: 128, b: 0}
                } else if (godObservation.tileTypes[x][y] !== 0) {
                    color = {r: 230, g: 0, b: 0};
                }
                // } else if (godObservation.visibles[x][y] === 0) {
                //     color = {r: 0, g: 0, b: 0};
                // }
                this._godTds[x][y].style
                    .backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            }
        }

        this._previousPositions[godObservation.position[0] + ',' + godObservation.position[1]] = true;
    };
}
/* harmony export (immutable) */ __webpack_exports__["a"] = HtmlTableRenderer;



/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(17)
var ieee754 = __webpack_require__(22)
var isArray = __webpack_require__(19)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(25)))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "#info {\n    margin-right: 2em;\n    /*float: left*/\n}\n\n.InfectionGameHtmlTableRender {\n    /*float: left;*/\n    overflow: auto;\n}\n\n.InfectionGameHtmlTableRender table {\n    padding-right: 2em;\n    border-spacing: 0;\n    border-collapse:collapse;\n}\n\n.InfectionGameHtmlTableRender table td {\n    border: 0; /*For iphones*/\n}\n\n.InfectionGameHtmlTableRender > div {\n    float: left;\n    border-spacing: 0;\n    margin-right: 2em;\n}\n\n.InfectionGameHtmlTableRender table.renderer-table-canvas-agent {\n    padding: 10px;\n    background-color: black;\n}\n\n.InfectionGameHtmlTableRender .renderer-table-canvas-god td {\n    height: 5px;\n    width: 5px;\n}\n\n.InfectionGameHtmlTableRender .renderer-table-canvas-agent td {\n    height: 20px;\n    width: 20px;\n}\n\n#agentRendererContainer {\n    margin-top: 1em;\n}", ""]);

// exports


/***/ }),
/* 22 */
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
/* 23 */
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
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
/* 25 */
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
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var R = {}; // the Recurrent library

(function (global) {
    "use strict";

    // Utility fun
    function assert(condition, message) {
        // from http://stackoverflow.com/questions/15313418/javascript-assert
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    }

    // Random numbers utils
    var return_v = false;
    var v_val = 0.0;
    var gaussRandom = function () {
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
    }
    var randf = function (a, b) {
        return Math.random() * (b - a) + a;
    }
    var randi = function (a, b) {
        return Math.floor(Math.random() * (b - a) + a);
    }
    var randn = function (mu, std) {
        return mu + gaussRandom() * std;
    }

    // helper function returns array of zeros of length n
    // and uses typed arrays if available
    var zeros = function (n) {
        if (typeof(n) === 'undefined' || isNaN(n)) {
            return [];
        }
        if (typeof ArrayBuffer === 'undefined') {
            // lacking browser support
            var arr = new Array(n);
            for (var i = 0; i < n; i++) {
                arr[i] = 0;
            }
            return arr;
        } else {
            return new Float64Array(n);
        }
    }

    // Mat holds a matrix
    var Mat = function (n, d) {
        // n is number of rows d is number of columns
        this.n = n;
        this.d = d;
        this.w = zeros(n * d);
        this.dw = zeros(n * d);
    }
    Mat.prototype = {
        get: function (row, col) {
            // slow but careful accessor function
            // we want row-major order
            var ix = (this.d * row) + col;
            assert(ix >= 0 && ix < this.w.length);
            return this.w[ix];
        },
        set: function (row, col, v) {
            // slow but careful accessor function
            var ix = (this.d * row) + col;
            assert(ix >= 0 && ix < this.w.length);
            this.w[ix] = v;
        },
        setFrom: function (arr) {
            for (var i = 0, n = arr.length; i < n; i++) {
                this.w[i] = arr[i];
            }
        },
        setColumn: function (m, i) {
            for (var q = 0, n = m.w.length; q < n; q++) {
                this.w[(this.d * q) + i] = m.w[q];
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
            this.w = zeros(this.n * this.d);
            this.dw = zeros(this.n * this.d);
            for (var i = 0, n = this.n * this.d; i < n; i++) {
                this.w[i] = json.w[i]; // copy over weights
            }
        }
    }

    var copyMat = function (b) {
        var a = new Mat(b.n, b.d);
        a.setFrom(b.w);
        return a;
    }

    var copyNet = function (net) {
        // nets are (k,v) pairs with k = string key, v = Mat()
        var new_net = {};
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                new_net[p] = copyMat(net[p]);
            }
        }
        return new_net;
    }

    var updateMat = function (m, alpha) {
        // updates in place
        for (var i = 0, n = m.n * m.d; i < n; i++) {
            if (m.dw[i] !== 0) {
                m.w[i] += -alpha * m.dw[i];
                m.dw[i] = 0;
            }
        }
    }

    var updateNet = function (net, alpha) {
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                updateMat(net[p], alpha);
            }
        }
    }

    var netToJSON = function (net) {
        var j = {};
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                j[p] = net[p].toJSON();
            }
        }
        return j;
    }
    var netFromJSON = function (j) {
        var net = {};
        for (var p in j) {
            if (j.hasOwnProperty(p)) {
                net[p] = new Mat(1, 1); // not proud of this
                net[p].fromJSON(j[p]);
            }
        }
        return net;
    }
    var netZeroGrads = function (net) {
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                var mat = net[p];
                gradFillConst(mat, 0);
            }
        }
    }
    var netFlattenGrads = function (net) {
        var n = 0;
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                var mat = net[p];
                n += mat.dw.length;
            }
        }
        var g = new Mat(n, 1);
        var ix = 0;
        for (var p in net) {
            if (net.hasOwnProperty(p)) {
                var mat = net[p];
                for (var i = 0, m = mat.dw.length; i < m; i++) {
                    g.w[ix] = mat.dw[i];
                    ix++;
                }
            }
        }
        return g;
    }

    // return Mat but filled with random numbers from gaussian
    var RandMat = function (n, d, mu, std) {
        var m = new Mat(n, d);
        fillRandn(m, mu, std);
        //fillRand(m,-std,std); // kind of :P
        return m;
    }

    // Mat utils
    // fill matrix with random gaussian numbers
    var fillRandn = function (m, mu, std) {
        for (var i = 0, n = m.w.length; i < n; i++) {
            m.w[i] = randn(mu, std);
        }
    }
    var fillRand = function (m, lo, hi) {
        for (var i = 0, n = m.w.length; i < n; i++) {
            m.w[i] = randf(lo, hi);
        }
    }
    var gradFillConst = function (m, c) {
        for (var i = 0, n = m.dw.length; i < n; i++) {
            m.dw[i] = c
        }
    }

    // Transformer definitions
    var Graph = function (needs_backprop) {
        if (typeof needs_backprop === 'undefined') {
            needs_backprop = true;
        }
        this.needs_backprop = needs_backprop;

        // this will store a list of functions that perform backprop,
        // in their forward pass order. So in backprop we will go
        // backwards and evoke each one
        this.backprop = [];
    }
    Graph.prototype = {
        backward: function () {
            for (var i = this.backprop.length - 1; i >= 0; i--) {
                this.backprop[i](); // tick!
            }
        },
        rowPluck: function (m, ix) {
            // pluck a row of m with index ix and return it as col vector
            assert(ix >= 0 && ix < m.n);
            var d = m.d;
            var out = new Mat(d, 1);
            for (var i = 0, n = d; i < n; i++) {
                out.w[i] = m.w[d * ix + i];
            } // copy over the data

            if (this.needs_backprop) {
                var backward = function () {
                    for (var i = 0, n = d; i < n; i++) {
                        m.dw[d * ix + i] += out.dw[i];
                    }
                }
                this.backprop.push(backward);
            }
            return out;
        },
        tanh: function (m) {
            // tanh nonlinearity
            var out = new Mat(m.n, m.d);
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
                }
                this.backprop.push(backward);
            }
            return out;
        },
        sigmoid: function (m) {
            // sigmoid nonlinearity
            var out = new Mat(m.n, m.d);
            var n = m.w.length;
            for (var i = 0; i < n; i++) {
                out.w[i] = sig(m.w[i]);
            }

            if (this.needs_backprop) {
                var backward = function () {
                    for (var i = 0; i < n; i++) {
                        // grad for z = tanh(x) is (1 - z^2)
                        var mwi = out.w[i];
                        m.dw[i] += mwi * (1.0 - mwi) * out.dw[i];
                    }
                }
                this.backprop.push(backward);
            }
            return out;
        },
        relu: function (m) {
            var out = new Mat(m.n, m.d);
            var n = m.w.length;
            for (var i = 0; i < n; i++) {
                out.w[i] = Math.max(0, m.w[i]); // relu
            }
            if (this.needs_backprop) {
                var backward = function () {
                    for (var i = 0; i < n; i++) {
                        m.dw[i] += m.w[i] > 0 ? out.dw[i] : 0.0;
                    }
                }
                this.backprop.push(backward);
            }
            return out;
        },
        mul: function (m1, m2) {
            // multiply matrices m1 * m2
            assert(m1.d === m2.n, 'matmul dimensions misaligned');

            var n = m1.n;
            var d = m2.d;
            var out = new Mat(n, d);
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
                var backward = function () {
                    for (var i = 0; i < m1.n; i++) { // loop over rows of m1
                        for (var j = 0; j < m2.d; j++) { // loop over cols of m2
                            for (var k = 0; k < m1.d; k++) { // dot product loop
                                var b = out.dw[d * i + j];
                                m1.dw[m1.d * i + k] += m2.w[m2.d * k + j] * b;
                                m2.dw[m2.d * k + j] += m1.w[m1.d * i + k] * b;
                            }
                        }
                    }
                }
                this.backprop.push(backward);
            }
            return out;
        },
        add: function (m1, m2) {
            assert(m1.w.length === m2.w.length);

            var out = new Mat(m1.n, m1.d);
            for (var i = 0, n = m1.w.length; i < n; i++) {
                out.w[i] = m1.w[i] + m2.w[i];
            }
            if (this.needs_backprop) {
                var backward = function () {
                    for (var i = 0, n = m1.w.length; i < n; i++) {
                        m1.dw[i] += out.dw[i];
                        m2.dw[i] += out.dw[i];
                    }
                }
                this.backprop.push(backward);
            }
            return out;
        },
        dot: function (m1, m2) {
            // m1 m2 are both column vectors
            assert(m1.w.length === m2.w.length);
            var out = new Mat(1, 1);
            var dot = 0.0;
            for (var i = 0, n = m1.w.length; i < n; i++) {
                dot += m1.w[i] * m2.w[i];
            }
            out.w[0] = dot;
            if (this.needs_backprop) {
                var backward = function () {
                    for (var i = 0, n = m1.w.length; i < n; i++) {
                        m1.dw[i] += m2.w[i] * out.dw[0];
                        m2.dw[i] += m1.w[i] * out.dw[0];
                    }
                }
                this.backprop.push(backward);
            }
            return out;
        },
        eltmul: function (m1, m2) {
            assert(m1.w.length === m2.w.length);

            var out = new Mat(m1.n, m1.d);
            for (var i = 0, n = m1.w.length; i < n; i++) {
                out.w[i] = m1.w[i] * m2.w[i];
            }
            if (this.needs_backprop) {
                var backward = function () {
                    for (var i = 0, n = m1.w.length; i < n; i++) {
                        m1.dw[i] += m2.w[i] * out.dw[i];
                        m2.dw[i] += m1.w[i] * out.dw[i];
                    }
                }
                this.backprop.push(backward);
            }
            return out;
        },
    }

    var softmax = function (m) {
        var out = new Mat(m.n, m.d); // probability volume
        var maxval = -999999;
        for (var i = 0, n = m.w.length; i < n; i++) {
            if (m.w[i] > maxval) maxval = m.w[i];
        }

        var s = 0.0;
        for (var i = 0, n = m.w.length; i < n; i++) {
            out.w[i] = Math.exp(m.w[i] - maxval);
            s += out.w[i];
        }
        for (var i = 0, n = m.w.length; i < n; i++) {
            out.w[i] /= s;
        }

        // no backward pass here needed
        // since we will use the computed probabilities outside
        // to set gradients directly on m
        return out;
    }

    var Solver = function () {
        this.decay_rate = 0.999;
        this.smooth_eps = 1e-8;
        this.step_cache = {};
    }
    Solver.prototype = {
        step: function (model, step_size, regc, clipval) {
            // perform parameter update
            var solver_stats = {};
            var num_clipped = 0;
            var num_tot = 0;
            for (var k in model) {
                if (model.hasOwnProperty(k)) {
                    var m = model[k]; // mat ref
                    if (!(k in this.step_cache)) {
                        this.step_cache[k] = new Mat(m.n, m.d);
                    }
                    var s = this.step_cache[k];
                    for (var i = 0, n = m.w.length; i < n; i++) {

                        // rmsprop adaptive learning rate
                        var mdwi = m.dw[i];
                        s.w[i] = s.w[i] * this.decay_rate + (1.0 - this.decay_rate) * mdwi * mdwi;

                        // gradient clip
                        if (mdwi > clipval) {
                            mdwi = clipval;
                            num_clipped++;
                        }
                        if (mdwi < -clipval) {
                            mdwi = -clipval;
                            num_clipped++;
                        }
                        num_tot++;

                        // update (and regularize)
                        m.w[i] += -step_size * mdwi / Math.sqrt(s.w[i] + this.smooth_eps) - regc * m.w[i];
                        m.dw[i] = 0; // reset gradients for next iteration
                    }
                }
            }
            solver_stats['ratio_clipped'] = num_clipped * 1.0 / num_tot;
            return solver_stats;
        }
    }

    var initLSTM = function (input_size, hidden_sizes, output_size) {
        // hidden size should be a list

        var model = {};
        for (var d = 0; d < hidden_sizes.length; d++) { // loop over depths
            var prev_size = d === 0 ? input_size : hidden_sizes[d - 1];
            var hidden_size = hidden_sizes[d];

            // gates parameters
            model['Wix' + d] = new RandMat(hidden_size, prev_size, 0, 0.08);
            model['Wih' + d] = new RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bi' + d] = new Mat(hidden_size, 1);
            model['Wfx' + d] = new RandMat(hidden_size, prev_size, 0, 0.08);
            model['Wfh' + d] = new RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bf' + d] = new Mat(hidden_size, 1);
            model['Wox' + d] = new RandMat(hidden_size, prev_size, 0, 0.08);
            model['Woh' + d] = new RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bo' + d] = new Mat(hidden_size, 1);
            // cell write params
            model['Wcx' + d] = new RandMat(hidden_size, prev_size, 0, 0.08);
            model['Wch' + d] = new RandMat(hidden_size, hidden_size, 0, 0.08);
            model['bc' + d] = new Mat(hidden_size, 1);
        }
        // decoder params
        model['Whd'] = new RandMat(output_size, hidden_size, 0, 0.08);
        model['bd'] = new Mat(output_size, 1);
        return model;
    }

    var forwardLSTM = function (G, model, hidden_sizes, x, prev) {
        // forward prop for a single tick of LSTM
        // G is graph to append ops to
        // model contains LSTM parameters
        // x is 1D column vector with observation
        // prev is a struct containing hidden and cell
        // from previous iteration

        if (prev == null || typeof prev.h === 'undefined') {
            var hidden_prevs = [];
            var cell_prevs = [];
            for (var d = 0; d < hidden_sizes.length; d++) {
                hidden_prevs.push(new R.Mat(hidden_sizes[d], 1));
                cell_prevs.push(new R.Mat(hidden_sizes[d], 1));
            }
        } else {
            var hidden_prevs = prev.h;
            var cell_prevs = prev.c;
        }

        var hidden = [];
        var cell = [];
        for (var d = 0; d < hidden_sizes.length; d++) {

            var input_vector = d === 0 ? x : hidden[d - 1];
            var hidden_prev = hidden_prevs[d];
            var cell_prev = cell_prevs[d];

            // input gate
            var h0 = G.mul(model['Wix' + d], input_vector);
            var h1 = G.mul(model['Wih' + d], hidden_prev);
            var input_gate = G.sigmoid(G.add(G.add(h0, h1), model['bi' + d]));

            // forget gate
            var h2 = G.mul(model['Wfx' + d], input_vector);
            var h3 = G.mul(model['Wfh' + d], hidden_prev);
            var forget_gate = G.sigmoid(G.add(G.add(h2, h3), model['bf' + d]));

            // output gate
            var h4 = G.mul(model['Wox' + d], input_vector);
            var h5 = G.mul(model['Woh' + d], hidden_prev);
            var output_gate = G.sigmoid(G.add(G.add(h4, h5), model['bo' + d]));

            // write operation on cells
            var h6 = G.mul(model['Wcx' + d], input_vector);
            var h7 = G.mul(model['Wch' + d], hidden_prev);
            var cell_write = G.tanh(G.add(G.add(h6, h7), model['bc' + d]));

            // compute new cell activation
            var retain_cell = G.eltmul(forget_gate, cell_prev); // what do we keep from cell
            var write_cell = G.eltmul(input_gate, cell_write); // what do we write to cell
            var cell_d = G.add(retain_cell, write_cell); // new cell contents

            // compute hidden state as gated, saturated cell activations
            var hidden_d = G.eltmul(output_gate, G.tanh(cell_d));

            hidden.push(hidden_d);
            cell.push(cell_d);
        }

        // one decoder to outputs at end
        var output = G.add(G.mul(model['Whd'], hidden[hidden.length - 1]), model['bd']);

        // return cell memory, hidden representation and output
        return {'h': hidden, 'c': cell, 'o': output};
    }

    var sig = function (x) {
        // helper function for computing sigmoid
        return 1.0 / (1 + Math.exp(-x));
    }

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
    }

    var samplei = function (w) {
        // sample argmax from w, assuming w are
        // probabilities that sum to one
        var r = randf(0, 1);
        var x = 0.0;
        var i = 0;
        while (true) {
            x += w[i];
            if (x > r) {
                return i;
            }
            i++;
        }
        return w.length - 1; // pretty sure we should never get here?
    }

    // various utils
    global.assert = assert;
    global.zeros = zeros;
    global.maxi = maxi;
    global.samplei = samplei;
    global.randi = randi;
    global.randn = randn;
    global.softmax = softmax;
    // classes
    global.Mat = Mat;
    global.RandMat = RandMat;
    global.forwardLSTM = forwardLSTM;
    global.initLSTM = initLSTM;
    // more utils
    global.updateMat = updateMat;
    global.updateNet = updateNet;
    global.copyMat = copyMat;
    global.copyNet = copyNet;
    global.netToJSON = netToJSON;
    global.netFromJSON = netFromJSON;
    global.netZeroGrads = netZeroGrads;
    global.netFlattenGrads = netFlattenGrads;
    // optimization
    global.Solver = Solver;
    global.Graph = Graph;
})(R);

// END OF RECURRENTJS

var RL = {};
(function (global) {
    "use strict";

// syntactic sugar function for getting default parameter values
    var getopt = function (opt, field_name, default_value) {
        if (typeof opt === 'undefined') {
            return default_value;
        }
        return (typeof opt[field_name] !== 'undefined') ? opt[field_name] : default_value;
    }

    var zeros = R.zeros; // inherit these
    var assert = R.assert;
    var randi = R.randi;
    var randf = R.randf;

    var setConst = function (arr, c) {
        for (var i = 0, n = arr.length; i < n; i++) {
            arr[i] = c;
        }
    }

    var sampleWeighted = function (p) {
        var r = Math.random();
        var c = 0.0;
        for (var i = 0, n = p.length; i < n; i++) {
            c += p[i];
            if (c >= r) {
                return i;
            }
        }
        assert(false, 'wtf');
    }

    var DQNAgent = function (env, opt) {
        this.gamma = getopt(opt, 'gamma', 0.75); // future reward discount factor
        this.epsilon = getopt(opt, 'epsilon', 0.1); // for epsilon-greedy policy
        this.alpha = getopt(opt, 'alpha', 0.01); // value function learning rate

        this.experience_add_every = getopt(opt, 'experience_add_every', 25); // number of time steps before we add another experience to replay memory
        this.experience_size = getopt(opt, 'experience_size', 5000); // size of experience replay
        this.learning_steps_per_iteration = getopt(opt, 'learning_steps_per_iteration', 10);
        this.tderror_clamp = getopt(opt, 'tderror_clamp', 1.0);

        this.num_hidden_units = getopt(opt, 'num_hidden_units', 100);

        this.env = env;
        this.reset();
    }
    DQNAgent.prototype = {
        reset: function () {
            this.nh = this.num_hidden_units; // number of hidden units
            this.ns = this.env.getNumStates();
            this.na = this.env.getMaxNumActions();

            // nets are hardcoded for now as key (str) -> Mat
            // not proud of this. better solution is to have a whole Net object
            // on top of Mats, but for now sticking with this
            this.net = {};
            this.net.W1 = new R.RandMat(this.nh, this.ns, 0, 0.01);
            this.net.b1 = new R.Mat(this.nh, 1, 0, 0.01);
            this.net.W2 = new R.RandMat(this.na, this.nh, 0, 0.01);
            this.net.b2 = new R.Mat(this.na, 1, 0, 0.01);

            this.exp = []; // experience
            this.expi = 0; // where to insert

            this.t = 0;

            this.r0 = null;
            this.s0 = null;
            this.s1 = null;
            this.a0 = null;
            this.a1 = null;

            this.tderror = 0; // for visualization only...
        },
        toJSON: function () {
            // save function
            var j = {};
            j.nh = this.nh;
            j.ns = this.ns;
            j.na = this.na;
            j.net = R.netToJSON(this.net);
            return j;
        },
        fromJSON: function (j) {
            // load function
            this.nh = j.nh;
            this.ns = j.ns;
            this.na = j.na;
            this.net = R.netFromJSON(j.net);
        },
        forwardQ: function (net, s, needs_backprop) {
            var G = new R.Graph(needs_backprop);
            var a1mat = G.add(G.mul(net.W1, s), net.b1);
            var h1mat = G.tanh(a1mat);
            var a2mat = G.add(G.mul(net.W2, h1mat), net.b2);
            this.lastG = G; // back this up. Kind of hacky isn't it
            return a2mat;
        },
        act: function (slist) {
            // convert to a Mat column vector
            var s = new R.Mat(this.ns, 1);
            s.setFrom(slist);

            let actionWasRandom = false;
            let actionWeights = null;
            let a;

            // epsilon greedy policy
            if (Math.random() < this.epsilon) {
                a = randi(0, this.na);
                actionWasRandom = true;
            } else {
                // greedy wrt Q function
                var amat = this.forwardQ(this.net, s, false);

                actionWeights = amat.w;
                a = R.maxi(amat.w); // returns index of argmax action
            }

            // shift state memory
            this.s0 = this.s1;
            this.a0 = this.a1;
            this.s1 = s;
            this.a1 = a;

            return {
                action: a,
                wasRandom: actionWasRandom,
                weights: actionWeights
            };
        },
        learn: function (r1) {
            // perform an update on Q function
            if (!(this.r0 == null) && this.alpha > 0) {

                // learn from this tuple to get a sense of how "surprising" it is to the agent
                var tderror = this.learnFromTuple(this.s0, this.a0, this.r0, this.s1, this.a1);
                this.tderror = tderror; // a measure of surprise

                // decide if we should keep this experience in the replay
                if (this.t % this.experience_add_every === 0) {
                    this.exp[this.expi] = [this.s0, this.a0, this.r0, this.s1, this.a1];
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
                    this.learnFromTuple(e[0], e[1], e[2], e[3], e[4])
                }
            }
            this.r0 = r1; // store for next update
        },
        learnFromTuple: function (s0, a0, r0, s1, a1) {
            // want: Q(s,a) = r + gamma * max_a' Q(s',a')

            // compute the target Q value
            var tmat = this.forwardQ(this.net, s1, false);
            var qmax = r0 + this.gamma * tmat.w[R.maxi(tmat.w)];

            // now predict
            var pred = this.forwardQ(this.net, s0, true);

            var tderror = pred.w[a0] - qmax;
            var clamp = this.tderror_clamp;
            if (Math.abs(tderror) > clamp) {  // huber loss to robustify
                if (tderror > clamp) tderror = clamp;
                if (tderror < -clamp) tderror = -clamp;
            }
            pred.dw[a0] = tderror;
            this.lastG.backward(); // compute gradients on net params

            // update net
            R.updateNet(this.net, this.alpha);
            return tderror;
        }
    }

// exports
//     global.DPAgent = DPAgent;
//     global.TDAgent = TDAgent;
    global.DQNAgent = DQNAgent;
//global.SimpleReinforceAgent = SimpleReinforceAgent;
//global.RecurrentReinforceAgent = RecurrentReinforceAgent;
//global.DeterministPG = DeterministPG;
})(RL);

const rl = RL;
/* harmony export (immutable) */ __webpack_exports__["a"] = rl;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const data =
{"nh":100,"ns":26,"na":4,"net":{"W1":{"n":100,"d":26,"w":{"0":1.366244053857598,"1":-0.944190519924953,"2":1.6020521912190395,"3":-1.1878559201783039,"4":0.003499777119376719,"5":0.6977648237242878,"6":0.5303574596926814,"7":-0.13205940992576723,"8":0.5566288106593679,"9":0.6578980089476806,"10":-0.05482184865860638,"11":2.837157591874451,"12":3.677681765330576,"13":1.7993158532858884,"14":2.4038735360628736,"15":0.6613376028568139,"16":-13.32815770228787,"17":-10.368696020748613,"18":-16.042817256825657,"19":-9.166245849043987,"20":0.53486823215489,"21":0.8184091412859616,"22":0.5304892316606765,"23":-0.6248343004768532,"24":1.5639631830471048,"25":1.4654148860717142,"26":1.551330255826146,"27":1.7506646753928308,"28":4.261543576159237,"29":-6.848144158851664,"30":-5.150128423779035,"31":-1.7501179811901582,"32":-0.9361674219399162,"33":-1.6270860417321689,"34":-5.876689469650313,"35":-4.867398470124552,"36":-0.9980522197659931,"37":-3.456126941235564,"38":-6.80333301318428,"39":-3.003853095022454,"40":-4.468320665273246,"41":-7.419605147531595,"42":-0.8905000428218994,"43":-4.729477287695988,"44":-7.324466150291819,"45":-6.154803921745473,"46":-2.5343145585605837,"47":1.3489558197441922,"48":-2.8193359290790365,"49":-7.630609837120612,"50":-5.619755692774341,"51":-0.9269339196821844,"52":-2.8789504165506448,"53":-0.9877226181275964,"54":-7.2160071310937575,"55":-4.535236465520689,"56":-1.808312020437493,"57":7.900049984372979,"58":2.725476964334932,"59":-2.280187799820717,"60":-3.2491801498682147,"61":-3.626301724604115,"62":-2.0183812876706897,"63":-5.777955833746983,"64":-3.0920407080456194,"65":-2.8175290430713256,"66":-3.5720087137181635,"67":-1.0762823972749445,"68":-5.475306056474224,"69":-5.5920081899660605,"70":-4.510109757678623,"71":-0.9207445083837198,"72":-7.224812981178195,"73":4.641749710748857,"74":-4.734993049909933,"75":-5.501727778484896,"76":-5.188128020725291,"77":0.8083038999498937,"78":-10.568142133547987,"79":-6.585083675771641,"80":-7.169256061575165,"81":-6.471778066812158,"82":-5.40509972874299,"83":1.9407348243625164,"84":8.345105882141455,"85":-9.948801404118674,"86":-4.25808039394312,"87":-2.3644036939128266,"88":-6.079299868190834,"89":3.2202750258454897,"90":-6.8238281139956,"91":-7.102523132229803,"92":-4.181685669961594,"93":-6.195470072905747,"94":0.7824427048886818,"95":-10.494775828672369,"96":-9.001556131766753,"97":-7.321125459954209,"98":0.7687805641469363,"99":6.305792062972601,"100":-5.890287228955458,"101":-5.896846235671072,"102":-0.9221925475983087,"103":-0.26733294224449256,"104":5.359473854680246,"105":0.5878073776439328,"106":6.240182248781006,"107":1.5398043137259876,"108":3.2192005621933717,"109":3.9139909827966557,"110":6.070277799565852,"111":3.2989746087427885,"112":5.377123701407367,"113":2.571770430938763,"114":-1.5415307849726791,"115":3.14190387543706,"116":5.691419526235864,"117":2.1537437332451805,"118":2.2687734314796626,"119":-4.0234617339055765,"120":-2.4290726932574245,"121":1.0258307845373462,"122":3.652779617091693,"123":2.993558341761342,"124":-1.6437686235375732,"125":7.672572981674833,"126":0.19107369369876637,"127":1.4058950417433733,"128":4.787183710130309,"129":3.070885120114883,"130":0.6363869426400421,"131":-4.928669393184721,"132":-0.7329764914334952,"133":-3.0863744228274066,"134":-5.187005121016805,"135":-3.3855693554687387,"136":5.729919679582942,"137":-2.2735812973593466,"138":-2.931748027676185,"139":-2.3551805721879293,"140":-2.574236989106029,"141":-2.419960141584177,"142":-0.3794781330931865,"143":-3.9573402330127774,"144":-3.135164223026723,"145":1.4526610754678677,"146":-1.98600074254525,"147":-3.176109398865852,"148":-2.6947273346358247,"149":-2.6461565324942016,"150":-5.10471352454739,"151":-1.7724421558319372,"152":-0.38300368875097746,"153":-3.2591873195010908,"154":-2.087786508050645,"155":-1.5324591847674975,"156":2.415611105428249,"157":-5.6407721638596975,"158":-6.692487567862438,"159":-5.448688868732262,"160":-4.850775188662332,"161":-1.1032906388305044,"162":6.539147466107662,"163":-2.8976846272105927,"164":-7.155957418587615,"165":-5.1916381167112835,"166":3.3101120319611277,"167":7.058551904865333,"168":-2.747430784060302,"169":-5.042037590681913,"170":-5.946464618046032,"171":1.602205902825175,"172":6.514843732722741,"173":-7.976536496501579,"174":-5.369620422264312,"175":-5.019226314700131,"176":-5.297272898650209,"177":-4.75635131430069,"178":-5.850186679923358,"179":-2.2186972757682235,"180":-5.59322659851131,"181":-6.0622239015995705,"182":-6.967342944308068,"183":-5.326173200495402,"184":-11.376419022291632,"185":-11.787572604016392,"186":-10.960555151594974,"187":2.8765011147157953,"188":-2.0204471229149887,"189":-8.529194164167478,"190":-8.941117477505145,"191":-8.037131395421918,"192":1.811689944248841,"193":-4.612776466382654,"194":-8.52029286138947,"195":-8.36369075760124,"196":-4.601974048202553,"197":-11.528970856766493,"198":-8.710811433794868,"199":-10.070077437748594,"200":-8.04228618862174,"201":-6.061996100342784,"202":2.1137880890711362,"203":5.81401878136024,"204":-13.34060773757907,"205":-9.287165966679613,"206":-5.955973282834314,"207":-2.9864212299476143,"208":-1.5245588857412096,"209":-5.250697107518055,"210":-1.1595607254776692,"211":1.5605024232940319,"212":2.4300487917611093,"213":1.0053563457590216,"214":-2.02492372715489,"215":3.381656643082613,"216":7.193764503976425,"217":0.32125370102264655,"218":-5.889167859625663,"219":-2.2034906282823266,"220":1.4311803367823164,"221":-2.3598246872338655,"222":-0.4633647149570276,"223":1.683807163706019,"224":-7.685034898540575,"225":-10.65652664408899,"226":-6.522892691383056,"227":0.5381453761644448,"228":-0.0661450525860553,"229":-1.4118082270479395,"230":-5.5177462658726935,"231":-2.4082020394234354,"232":-2.8464910011736975,"233":4.813902485522569,"234":2.890675194839319,"235":-1.9504252996603637,"236":0.044983574824876756,"237":-3.81903946568146,"238":-8.615003303958487,"239":-1.1645864070411378,"240":-3.0219477816140863,"241":4.217217218079447,"242":-8.279571694384366,"243":-8.847326812866044,"244":-5.011461802673385,"245":-3.5822961449819446,"246":-6.903999769637834,"247":-6.140787645323914,"248":-8.54719025720257,"249":-4.989912160932669,"250":-0.4136782815477072,"251":-0.788071201589751,"252":-9.92342937391357,"253":-5.029681394448088,"254":6.5428090301158965,"255":-3.117545759050729,"256":-1.557694672421853,"257":-8.40237688491208,"258":-4.898396717681572,"259":-6.7886345502750585,"260":0.26361720455832083,"261":2.3804420869151994,"262":5.920734585319038,"263":3.021089369681815,"264":4.148722471855898,"265":1.153775846143516,"266":-0.719511241253984,"267":3.2971779768650733,"268":3.927567281737702,"269":3.5438545470946416,"270":-0.9645715117156121,"271":0.48726609219351685,"272":2.703975130028121,"273":2.3753166794640195,"274":4.012224677960797,"275":1.2179689563644975,"276":-0.716120816797684,"277":5.55380738200907,"278":3.9293295530411707,"279":2.6272366562743557,"280":-1.3459635649195758,"281":1.926396035985745,"282":6.330547350433071,"283":3.0242009633838074,"284":3.9880043069338273,"285":1.8948354019920466,"286":2.524594250785579,"287":1.3110551515760756,"288":-7.110195101321131,"289":-3.1865198161737496,"290":-5.094243249708548,"291":4.044771634186404,"292":-5.75462638282525,"293":-6.368589582675157,"294":-4.085485903736183,"295":-4.723290821953124,"296":-2.0650677593451054,"297":0.7514197499202052,"298":-0.3053762976125903,"299":-1.9407726630114208,"300":-3.522506811170813,"301":-3.834082061585761,"302":3.5942282965032324,"303":-7.653360462306472,"304":-5.749967311277201,"305":-2.724300294215674,"306":-0.4609309867026305,"307":-0.24777546446305881,"308":-7.60510804587859,"309":-4.414062590725767,"310":-1.292014967614078,"311":-5.774299942270521,"312":14.734072867554067,"313":3.9083230195391487,"314":10.804269560429319,"315":15.026021631227593,"316":5.521883130771208,"317":-15.429943489109682,"318":12.57335534032129,"319":10.417447870599117,"320":11.864326311404348,"321":10.376275596513699,"322":4.6552922355398625,"323":-1.1649455881974362,"324":17.508550447817782,"325":5.639351331069251,"326":7.483187356592771,"327":3.29913360290775,"328":-8.341323568891086,"329":12.520162025753333,"330":7.184840913438125,"331":5.403745135240679,"332":9.875080481612743,"333":-3.136820087448667,"334":11.217326969804738,"335":10.999629876885054,"336":6.119539369713621,"337":2.7300826206559132,"338":1.0302417022341837,"339":4.479404261487499,"340":-5.461063975507948,"341":3.1807741320205687,"342":-8.603602311489677,"343":-7.184189288941132,"344":6.041017086583297,"345":3.9591591001895625,"346":-4.2268104781716165,"347":-3.2698019937707676,"348":-4.68872334293424,"349":-9.78785863227193,"350":0.11952147698016573,"351":7.138551396511592,"352":15.103151817928781,"353":-7.169643152824658,"354":2.3729475604529027,"355":-5.029758989417272,"356":4.046576720439792,"357":-0.5273541041547849,"358":-3.0104237091307318,"359":2.2727464201102436,"360":-2.511194259710613,"361":4.705324257448277,"362":1.7588636301496912,"363":1.3490592048843673,"364":2.523441721178163,"365":2.3910083625537033,"366":2.5274787481919025,"367":-0.577922643992657,"368":2.351691308906372,"369":-1.3260703189054763,"370":0.6156892184277609,"371":1.7498404629661894,"372":0.6014474229362622,"373":0.7588398204365318,"374":-1.7185184169367893,"375":0.615924633022561,"376":-2.176686220359105,"377":-21.54706942952071,"378":-19.02757966665637,"379":0.9510806688573642,"380":-0.1788297695939211,"381":-0.1937746705953496,"382":1.1714020979269704,"383":0.7407891529909073,"384":-1.5538183499890845,"385":-0.49239674714470455,"386":-0.8817942098403123,"387":1.7201975266556127,"388":2.57799762317077,"389":-1.8807659280249478,"390":3.612577477506135,"391":6.625403192175984,"392":14.597647746286025,"393":10.290294066642529,"394":11.171909817645973,"395":-4.467271721113323,"396":10.312440199645948,"397":6.85808201693726,"398":8.699558405127933,"399":8.6741291624611,"400":-0.324554093720042,"401":1.8431012460849332,"402":12.943528342373542,"403":4.285981013920592,"404":6.691917361842819,"405":3.8989363804861785,"406":1.9576428112296427,"407":4.666700869539683,"408":5.826457825914779,"409":5.777068301748608,"410":-2.364153744418196,"411":-7.537922730736696,"412":8.224655793593003,"413":9.369722007375985,"414":8.477914958603769,"415":-4.070225488114537,"416":5.590384264650656,"417":3.4465457338802628,"418":-9.606409943718173,"419":-6.3769106390647865,"420":-6.624475135427973,"421":0.3366250034092735,"422":1.0796598920599505,"423":-3.6106461312297347,"424":-2.264891932509125,"425":-6.193132050160415,"426":2.5622119700326373,"427":-6.0405952290766365,"428":-11.444937631692532,"429":-4.652414073396043,"430":-3.9191039358042525,"431":5.385248345415746,"432":-6.800184302801554,"433":-10.290275101857786,"434":-8.769973450818107,"435":-5.227650367986221,"436":4.021904166457068,"437":-2.9837320405313617,"438":-6.133304167891944,"439":-9.692224940412299,"440":-6.8057835221263545,"441":-7.1798322670367245,"442":-5.442307704413427,"443":-8.96495310905768,"444":5.898627047881488,"445":8.108707903697624,"446":5.344549398547117,"447":-1.5569916701952298,"448":7.027170215863147,"449":11.953523915311123,"450":8.243797324578424,"451":5.674580256837242,"452":0.2156225720368577,"453":5.701209667636977,"454":11.065372151602089,"455":7.244339931229048,"456":3.3895021112698185,"457":1.0195749714865343,"458":-1.067690583341184,"459":7.6464895024861645,"460":6.541136982674774,"461":4.524844143903036,"462":-3.9613049158838423,"463":7.155357854475449,"464":10.889602274801902,"465":6.191602993231085,"466":8.195132022248934,"467":1.8239236782479453,"468":2.471698814221703,"469":0.6765670041773353,"470":-7.241353164397027,"471":-6.84398116646756,"472":-8.562346608454792,"473":5.4301778018142315,"474":4.73605752373611,"475":-12.524731141805306,"476":-8.584123336960806,"477":-8.179497229413128,"478":-2.981947617249398,"479":-2.328857204445181,"480":-5.505830908275016,"481":-7.430618166932527,"482":-6.991651230140341,"483":-5.677197646426964,"484":-1.676398239907248,"485":-11.012933563849673,"486":-10.139647887936793,"487":-3.050344121483424,"488":10.799200856261427,"489":-8.361305962530015,"490":-6.384562401352094,"491":-6.147517808463738,"492":-6.699584328445101,"493":-0.7033169960382252,"494":-1.8145881339011694,"495":0.07158225037990629,"496":19.284152141552685,"497":15.33608088212185,"498":12.149369114806957,"499":3.1155643694496438,"500":1.6200485998031082,"501":18.048535407300342,"502":15.261274531247377,"503":13.177819230688671,"504":-1.3051958956737515,"505":4.046032739092879,"506":17.365044239372484,"507":12.381298187195672,"508":13.624113294306031,"509":0.08647375695841453,"510":0.9708380599909113,"511":17.3118642424866,"512":14.632076609944159,"513":13.060106495175937,"514":0.6651642821031,"515":0.5442128018072651,"516":18.99525539224763,"517":15.434320147835573,"518":14.665414508478255,"519":-6.4811523899285906,"520":3.4275465388136204,"521":-3.0430501602972426,"522":-3.140123467252829,"523":-9.192933437580127,"524":-4.712596926305205,"525":-4.231870753978105,"526":-0.03374519474391967,"527":9.079410893301231,"528":-8.466608922796063,"529":-7.492283319458707,"530":-4.351510455789268,"531":1.031705727721923,"532":-0.44466700763662104,"533":-6.3525735967854855,"534":-6.8459682438974605,"535":-2.852475972276816,"536":3.5629447069588354,"537":4.35372076293366,"538":-3.118346417437065,"539":-5.53117176745629,"540":1.4023608067147717,"541":-0.9310815072087425,"542":1.3905722936248968,"543":-4.428569194609804,"544":-6.713223005913969,"545":-7.352382636460714,"546":-4.563733214612344,"547":-6.258154854274609,"548":-15.596521393910725,"549":-11.858961794590915,"550":-16.459191098785816,"551":4.208976036534664,"552":3.3632986798966624,"553":-15.644337913298989,"554":-11.834672895102875,"555":-8.478856313689938,"556":6.503612600347388,"557":-2.0932839998389716,"558":-11.777118928607518,"559":-10.534113843628932,"560":-9.984918339280018,"561":-8.9315645711215,"562":-5.502320633109271,"563":-17.245402157303232,"564":-12.025576425430105,"565":-7.357354085904913,"566":-6.489600414811519,"567":4.258537246321459,"568":-14.631268326207254,"569":-8.403855927206811,"570":-10.07123545712926,"571":7.546063129841995,"572":5.1009132988985835,"573":-5.251668649183817,"574":-23.174660059243042,"575":-7.343640602339131,"576":-15.194307760316782,"577":8.229676499007692,"578":-2.482803075146007,"579":-11.730506500675316,"580":-12.390702902913004,"581":-6.528303771561944,"582":-0.011393929418494654,"583":1.0101491379785146,"584":-18.054520992328445,"585":-13.746964043843324,"586":-8.549521566651139,"587":-1.5511242617891383,"588":2.18757983889803,"589":-13.203466137120772,"590":-12.608345634220198,"591":-7.60262243836085,"592":14.54834670798905,"593":-4.718578101421375,"594":-18.014319371297443,"595":-10.19686342644051,"596":-8.910315446874758,"597":-0.30685883582145446,"598":0.7758715575229366,"599":0.8489463167934014,"600":0.6699557134906358,"601":-1.0894181655824926,"602":-0.9724851305622607,"603":-0.6676647040129462,"604":0.42244873367028674,"605":3.4123337600639854,"606":-0.2559978866029043,"607":-2.4736392243514604,"608":2.3954852205740136,"609":1.6236355201561778,"610":-1.9652263851135792,"611":-13.712696259624332,"612":-8.597230948476987,"613":-1.0727913883342273,"614":-2.3551247176003374,"615":-4.176424668378341,"616":-8.74262188158556,"617":-6.012427685538368,"618":-0.8709844484258387,"619":1.2794879414882685,"620":1.4226007917587742,"621":-1.012047425170206,"622":0.2985833179144308,"623":2.1361375841981447,"624":-4.605608473234417,"625":2.0212673634373126,"626":0.703575166816452,"627":-10.83278749495282,"628":-9.29487327902758,"629":0.12937288502141245,"630":3.47493290807068,"631":-9.880502041964084,"632":-11.29178904674522,"633":-10.647924130098268,"634":0.7603616105003069,"635":-1.6873126178198137,"636":-10.887022575782229,"637":-12.579457827505738,"638":-12.05721035484431,"639":4.900799590261711,"640":-6.40785344687868,"641":-11.610638720223854,"642":-13.631105061535663,"643":-9.528438757263851,"644":-2.3810630804613,"645":-2.9354574789067724,"646":-3.6580142321162255,"647":-12.31002310623688,"648":-14.833272278313204,"649":1.301952265646162,"650":-0.9902166227367177,"651":1.4259188367670208,"652":-2.6376611166790394,"653":-6.615745232287837,"654":-3.859429796892359,"655":6.193542969464344,"656":-0.7543984213074649,"657":-6.956533430959149,"658":-5.546220691441891,"659":-3.8596658538617024,"660":-0.6415363927445951,"661":0.5444399259251645,"662":-1.1052842141438657,"663":-2.3334088361858227,"664":-3.5654922085707152,"665":1.3693463018961396,"666":-1.0863456596419283,"667":-5.2567382420080175,"668":-4.265056186754843,"669":-3.499598852298656,"670":-9.062020556579112,"671":0.5886568056893798,"672":-8.95224091767789,"673":-5.970596859616077,"674":-4.823591295329522,"675":-5.617762119781228,"676":6.194119290330094,"677":-2.548647661749735,"678":2.6425362825719647,"679":-0.4163234077448929,"680":1.9186823765219496,"681":-1.158236267129892,"682":-0.2100525526041021,"683":-3.428143317857407,"684":-6.33222128852762,"685":4.695796346927255,"686":0.7587921358033195,"687":0.8482132584819183,"688":-5.715462842545867,"689":-4.458327113899586,"690":-9.974377948260756,"691":-2.52787234277564,"692":-6.675490534010525,"693":-3.5746053788246344,"694":-8.509984445905772,"695":-5.593360454324436,"696":7.791911557136459,"697":2.053433300565667,"698":-0.486906344834246,"699":5.042875376358827,"700":2.4316418022895894,"701":0.15887659738135404,"702":-0.4079144368279865,"703":0.6520503071790961,"704":0.6111503417451563,"705":-0.2644898741122562,"706":0.4900009019658724,"707":-0.5121381793406482,"708":0.031017775302655592,"709":1.2145875995491693,"710":5.066074489513333,"711":4.4213064358791065,"712":0.9530306052044282,"713":0.3159145911476329,"714":3.1394763048478804,"715":4.479552778692025,"716":9.950210929033155,"717":-0.27118726543294464,"718":0.2525001805842932,"719":0.0036065973853499633,"720":4.1268047476076,"721":3.7056605401331995,"722":0.015322222438658372,"723":-0.20339942482565168,"724":0.2082498400407783,"725":0.07145873293964101,"726":-0.3458325854609966,"727":0.7462168162193349,"728":0.825989258489256,"729":2.475997138427182,"730":-0.6630442775305337,"731":-1.1570809448249362,"732":-3.9666618694009657,"733":1.7740857141000612,"734":-0.08284946712230025,"735":-0.7719467911886513,"736":-2.7875491057791164,"737":-3.5512391132927563,"738":-0.8841664722010648,"739":-3.1579912681499636,"740":34.27381209087432,"741":-2.2259280302670144,"742":-3.382895113423043,"743":-1.7118342340599535,"744":1.9569208789406778,"745":2.4021245739456885,"746":1.2668399250060616,"747":-3.5368058416644135,"748":4.967075385107823,"749":3.614131544760374,"750":-1.9272777844828717,"751":-5.19092545265422,"752":-4.808263789389723,"753":0.5686269440519894,"754":-2.1981969200518625,"755":-2.713036725331448,"756":4.318521142673018,"757":2.9833532010313473,"758":2.97590184218478,"759":2.2717776474110227,"760":0.5476354488429559,"761":3.525617295177022,"762":-1.3955511169181543,"763":3.0747107734451746,"764":0.07371526857683301,"765":0.5463311442641177,"766":2.578052997766246,"767":3.1076557861466667,"768":1.5436346495818387,"769":1.0097077460196404,"770":-2.112038262463773,"771":1.3112820629213788,"772":0.748559813471867,"773":3.872340360603027,"774":4.486658926812304,"775":4.550125610898354,"776":2.4431815598640183,"777":-0.6796707110065713,"778":3.5842222989557597,"779":2.1627376692921576,"780":0.39453340082476623,"781":7.731848904483626,"782":14.725497002726003,"783":13.259814480139315,"784":8.048592104050638,"785":-5.047905906282421,"786":-5.0884491443055095,"787":10.009111433659506,"788":7.030739326539125,"789":9.31852167855758,"790":-5.432898488816581,"791":1.8329194274649325,"792":6.614121973155003,"793":11.900441724485216,"794":4.2399795430998335,"795":13.817530813297491,"796":2.025329207119742,"797":17.059813786659763,"798":9.4360623332374,"799":7.449247561986322,"800":14.447624594822564,"801":-1.5643880244897541,"802":12.68704034021225,"803":13.13347942758733,"804":5.549300336376052,"805":1.4896335746003242,"806":2.9304175542598614,"807":15.779071164825158,"808":9.403720573389991,"809":14.249047908484357,"810":12.15893998530833,"811":8.224646298316793,"812":-1.6914811128989717,"813":2.780755947369754,"814":12.138213409469492,"815":11.346401588389721,"816":3.3661544276602133,"817":8.490872505347758,"818":7.493081526203806,"819":10.379301735218165,"820":14.650511571061454,"821":-10.0283573368881,"822":1.8745959158020042,"823":1.1864267140950102,"824":13.062912937670214,"825":8.481586511748556,"826":-8.258692920650049,"827":4.398851238585201,"828":10.21568846750019,"829":14.966991839463581,"830":10.832184726265513,"831":2.206550317490093,"832":-1.2942367339686176,"833":-0.41717856932019054,"834":-2.911416281039493,"835":-7.373389288176918,"836":-0.717260487510188,"837":-9.509428132694353,"838":7.23253517663806,"839":-4.051005322316455,"840":-2.549814787037247,"841":-1.6635810819633436,"842":9.244265882750081,"843":7.550381531355997,"844":-0.12695308926128693,"845":-8.541629493708742,"846":-11.297883606700978,"847":-1.2802833071007653,"848":4.676373588856218,"849":-0.5045950010540979,"850":-0.4649495460090011,"851":-5.6792886228441795,"852":4.216313579834699,"853":-2.86833564603351,"854":-4.18104901584973,"855":-2.609275673394596,"856":-6.062518446432395,"857":3.188347770196819,"858":-3.840759469200212,"859":-2.571725516961318,"860":-6.848525722360799,"861":-5.5722252869947795,"862":-5.167014646276081,"863":6.104862535613081,"864":0.048415108584732865,"865":-10.918248614728489,"866":-5.371411567924121,"867":-2.1050200337719636,"868":-6.292677827248017,"869":-0.30410898872173375,"870":-5.811596161564767,"871":-7.722417295272243,"872":-6.306719352714198,"873":-9.02428855990735,"874":5.66780874441849,"875":-12.73223231720489,"876":-7.4074616771954815,"877":-7.044812429828035,"878":-6.102632544418624,"879":-6.968441964813302,"880":-15.428303751814239,"881":-3.5976136515782104,"882":-6.138693914249869,"883":-5.882765167323766,"884":-0.5835397564974354,"885":4.554309940020316,"886":1.834943731187977,"887":-1.1145157182319134,"888":-0.7311606975277735,"889":2.368864380525627,"890":9.722092049862443,"891":-0.1584779588265167,"892":-6.617357481267601,"893":-1.090055826130601,"894":7.846326161612251,"895":-1.12361635186961,"896":-1.549464860781596,"897":3.10451633852256,"898":3.0788588006378563,"899":-1.430174855770828,"900":-14.568457660246715,"901":-3.145737244863919,"902":-5.099317255716749,"903":-6.125148797615959,"904":-1.7948657331715414,"905":-1.367486983348813,"906":-0.8642632069927949,"907":0.14994846810659676,"908":4.736388559090522,"909":-1.3381566297551941,"910":4.298413686397773,"911":-0.5866480324204579,"912":-3.6459109566430223,"913":8.063586247769116,"914":6.604631050327929,"915":-0.46907442589613035,"916":0.8346329571190721,"917":6.197656308452021,"918":10.124726843490881,"919":9.210105590981215,"920":-3.519154801234379,"921":3.2435664324752778,"922":1.5779977268378667,"923":10.715379040938725,"924":5.647669653369474,"925":-0.34859372874710565,"926":-2.9083412060606855,"927":-1.1618032446777835,"928":4.377874924521396,"929":9.92953119752805,"930":-1.5783984189936444,"931":8.119254739370133,"932":-2.6502501792911453,"933":9.231903603332261,"934":8.022358756636057,"935":7.535336206175218,"936":-11.432108772589224,"937":2.9571419023904864,"938":-10.253387351908732,"939":-6.1297047875546395,"940":-6.326896360351881,"941":-4.519149496463609,"942":-9.40264333620419,"943":-8.199238823307276,"944":-4.7785274441588115,"945":-4.3327030568254985,"946":-0.4106392073918158,"947":-5.005979874041408,"948":-2.4948523940870415,"949":-5.1201507699347,"950":-3.6534558018207006,"951":1.4945448507188028,"952":2.906874989943102,"953":-8.069151618572121,"954":-4.3981356691898,"955":-6.4789755428931946,"956":-2.837048463138114,"957":-10.15086376372297,"958":-11.02749872547406,"959":-8.095088848830802,"960":-8.484529615378731,"961":-0.4582965264951864,"962":1.099966595992606,"963":5.105335952263307,"964":0.8246537809437928,"965":10.760167136276026,"966":12.75861466192755,"967":1.0439085071871073,"968":0.7241625489638841,"969":-4.416046414159528,"970":8.29295590854203,"971":5.506107147427864,"972":-5.3254641342663795,"973":1.2060768958538608,"974":-12.013548624317036,"975":-0.7289818895076071,"976":3.763257941789725,"977":-1.075565911752737,"978":3.9653640512992476,"979":5.93654979009399,"980":10.605523201364347,"981":9.546264759098644,"982":5.149343429677575,"983":2.1365123334425724,"984":4.478758012212767,"985":4.965530915354879,"986":7.295267164408531,"987":0.38065767471235534,"988":-2.675487023489563,"989":1.9596314025238948,"990":0.5754459958168104,"991":-1.3612311260485226,"992":1.036859996468569,"993":1.018199119082659,"994":20.832846165097507,"995":1.7483712098477804,"996":2.0149998110327925,"997":0.35027289970007597,"998":-0.1441433588266798,"999":0.2761229753928593,"1000":1.6400004685727883,"1001":0.24268599561129525,"1002":1.496192294898829,"1003":0.7793224700654213,"1004":1.474612968703194,"1005":0.5182884005431998,"1006":0.9930372176405333,"1007":0.630262864691015,"1008":1.4435213127748008,"1009":0.7673201083557741,"1010":0.711872473889864,"1011":0.03949313221170695,"1012":1.0652586823513148,"1013":-1.3597216233368892,"1014":17.757967055523434,"1015":8.690443259578348,"1016":13.348168008031145,"1017":7.928059716403661,"1018":8.78913995710195,"1019":11.065312723185288,"1020":-6.250969582814215,"1021":5.8702594668841055,"1022":9.541707782741035,"1023":5.7339037662639125,"1024":-6.396644387121509,"1025":-0.7016477887121876,"1026":9.445037966738068,"1027":7.4496275269106835,"1028":8.070098015606533,"1029":-3.972479035868646,"1030":-12.840860577325998,"1031":4.687350288819445,"1032":11.09609049722646,"1033":10.193416345737232,"1034":-0.9009951428258983,"1035":2.008530328549619,"1036":16.08570265027723,"1037":8.362647089052391,"1038":10.676859243076349,"1039":1.2590572289252582,"1040":7.115482675479773,"1041":-0.6003322865387034,"1042":3.7022918820514104,"1043":9.68731994933801,"1044":5.364062721757233,"1045":9.609085886087257,"1046":-9.272873943627607,"1047":7.499533774797181,"1048":7.042793081762677,"1049":6.0736237986041335,"1050":-4.394691732087945,"1051":3.7260267662683013,"1052":6.792833515440669,"1053":4.578424013860952,"1054":4.42606098207239,"1055":4.6064615019424595,"1056":4.8124118731734,"1057":7.038193048677454,"1058":3.8671363096061184,"1059":3.194993379753081,"1060":-4.450197793044489,"1061":1.4401433526671357,"1062":10.517751648334967,"1063":3.248046847091326,"1064":4.502330102965865,"1065":-2.570227312146615,"1066":-10.804700468556218,"1067":0.32713388842069646,"1068":-5.439049885256843,"1069":15.057003711631905,"1070":6.9575637758050695,"1071":-6.759823463533693,"1072":-1.094409335479855,"1073":16.796349237727032,"1074":10.51547589427793,"1075":10.953394082470867,"1076":5.6703787439924005,"1077":-1.6608374603528318,"1078":3.122268411018787,"1079":8.610829993097235,"1080":7.688415430971141,"1081":5.378049458482178,"1082":7.768449021459207,"1083":9.88928789032333,"1084":12.055410642161643,"1085":6.84211241022408,"1086":-4.4972559064802,"1087":-5.320291882170368,"1088":-0.34434210071644855,"1089":10.945465210142622,"1090":10.150745504602035,"1091":2.283515031040757,"1092":-9.867152098711736,"1093":5.014480525731679,"1094":11.292857190371425,"1095":4.368375432001282,"1096":2.448889051259419,"1097":3.5102085271279266,"1098":2.622707521563351,"1099":0.5668786636929515,"1100":5.406935259013553,"1101":6.9825054234380675,"1102":-1.4965237644198173,"1103":4.748745789356557,"1104":3.7698060817479235,"1105":5.2443096063873105,"1106":7.251008248998499,"1107":6.51994113184536,"1108":-6.21753586664867,"1109":4.916696830676005,"1110":-2.9236058740247657,"1111":4.027862624508034,"1112":2.187726131975776,"1113":1.913564934237894,"1114":10.191713412215657,"1115":6.782686352444079,"1116":2.07696230489655,"1117":2.555630830986445,"1118":5.527448187481751,"1119":1.260502333939733,"1120":0.0014493208348409358,"1121":3.7290476500453034,"1122":0.5738006258464433,"1123":-0.2336435732465646,"1124":-4.845711331509292,"1125":2.5497077155953316,"1126":-6.554231748604627,"1127":-5.120159618620216,"1128":11.719591686815772,"1129":7.300920293338081,"1130":0.5961077911776133,"1131":1.2573102246091974,"1132":-3.146160021175454,"1133":1.109511955196771,"1134":-13.53597722828527,"1135":-6.5456473625289995,"1136":0.4239616051238649,"1137":2.063859734849269,"1138":2.3923620380823563,"1139":-1.7099442758224275,"1140":-12.602771360598576,"1141":5.141796733100458,"1142":-4.279179764824828,"1143":5.998023970824012,"1144":5.290515901974562,"1145":4.636887230803648,"1146":6.3318592203561685,"1147":8.654919589258654,"1148":3.9612203250846036,"1149":-10.478126282657787,"1150":-2.8366214746363383,"1151":11.197660006473013,"1152":4.7025795779510835,"1153":9.513844819572906,"1154":12.557546613419658,"1155":11.405943832098876,"1156":5.02450395908554,"1157":6.363652258447122,"1158":4.809400595059072,"1159":-0.7950076085476182,"1160":-3.4685385865100775,"1161":6.140885096214827,"1162":6.269164425611873,"1163":8.263159071271273,"1164":-12.402908855607668,"1165":5.824205098936012,"1166":10.137752787021663,"1167":3.902576493908151,"1168":-2.170989816006534,"1169":3.2558639816849513,"1170":-7.199114941478908,"1171":-8.466067316392586,"1172":-0.8359677132290493,"1173":-12.555006502179156,"1174":-11.47655608555368,"1175":-1.2782730974678862,"1176":8.721665922499884,"1177":-1.0501513362426613,"1178":-7.769017047786149,"1179":-9.85148702801217,"1180":6.10375123174222,"1181":-4.555539271546082,"1182":-8.115925574888355,"1183":-11.396698940083414,"1184":-10.537206013120432,"1185":-6.254581906958435,"1186":-2.562415541458238,"1187":-5.161644399971406,"1188":-8.235668989847687,"1189":-12.080061586047837,"1190":-2.4407898421475815,"1191":0.7226234364372306,"1192":-2.796636647266637,"1193":-9.228124162745406,"1194":-12.928554335752205,"1195":-1.0688725410844386,"1196":-1.7121458999688435,"1197":-2.8835135099283957,"1198":-0.6317261864202626,"1199":-3.6056760145243714,"1200":-2.161060897145207,"1201":-2.43796903354164,"1202":-1.996274328592462,"1203":-3.295281339436268,"1204":-2.6901943588033475,"1205":-2.3973277034992027,"1206":2.7817823254618324,"1207":-1.5193135658654926,"1208":-2.083241865525959,"1209":-1.7229723471116665,"1210":-2.5593111723208333,"1211":-1.3277082411067107,"1212":3.882357532281717,"1213":-3.555138480724354,"1214":-2.817654543992579,"1215":-1.13723659121636,"1216":0.21273501922114135,"1217":-0.48243296187756524,"1218":-4.254771156167212,"1219":-2.0572866787345325,"1220":-2.4122054557242327,"1221":-4.258226846621055,"1222":-4.348238753149598,"1223":-0.8984916344303051,"1224":4.040677564922407,"1225":5.3986281892485835,"1226":5.610056742692642,"1227":-1.7548566575037372,"1228":5.4998110375149505,"1229":-3.617451214568441,"1230":2.9261725232158935,"1231":2.2047917049474504,"1232":5.753526827079253,"1233":2.582427710062684,"1234":6.366214679619819,"1235":5.138429371462188,"1236":5.859888005826008,"1237":6.821820735587814,"1238":-2.93917919898616,"1239":-1.3168747078067484,"1240":3.4051363202824296,"1241":5.872212886080369,"1242":5.872813973597114,"1243":4.1496906560091045,"1244":7.629873584902156,"1245":6.792761338871236,"1246":3.558223331213097,"1247":2.502670080730354,"1248":-8.479043207475954,"1249":-3.221508362354288,"1250":6.787769674802715,"1251":8.967282477775404,"1252":7.020561228024283,"1253":-4.693351266872275,"1254":-1.0217841004029848,"1255":11.140129074937446,"1256":6.453049226432161,"1257":3.4381007782723234,"1258":-2.9423050383096863,"1259":5.584844843706037,"1260":8.822689475127513,"1261":4.911958747545562,"1262":6.875032269499404,"1263":12.12598573504239,"1264":8.123427720943518,"1265":9.308433504228361,"1266":9.024559200008282,"1267":7.906981813745283,"1268":0.9554845054911443,"1269":1.5962225031095576,"1270":6.390374955395669,"1271":8.353598893710462,"1272":6.493041886998547,"1273":1.1853469010297177,"1274":2.198680326007309,"1275":-12.9431052298312,"1276":-18.60491573433444,"1277":-12.36405912453729,"1278":-12.577560902748706,"1279":1.1821658669822095,"1280":7.381029211225849,"1281":-19.10311034781584,"1282":-14.825567124527051,"1283":-18.661413542517256,"1284":-0.28938577539419014,"1285":1.907479815273783,"1286":-16.361470625015645,"1287":-16.6779868859311,"1288":-12.03611052195666,"1289":-2.7258608443810948,"1290":-3.8278180631435523,"1291":-18.296873923860378,"1292":-12.703505961759873,"1293":-18.332803757452005,"1294":-8.730213487720224,"1295":2.7888102002200035,"1296":-19.229662465171295,"1297":-14.245136713082713,"1298":-10.373594530532078,"1299":-0.7215855615760259,"1300":-6.702670318083924,"1301":-1.6863148134186337,"1302":-7.81770735765638,"1303":-5.294045296855914,"1304":-5.534787657866908,"1305":-8.881537316635168,"1306":-0.6427376236623393,"1307":-7.827133575198039,"1308":-5.451940805213127,"1309":-7.842787156248343,"1310":0.41607932898735195,"1311":-5.922637114630561,"1312":-6.737158107792636,"1313":-5.346110301827636,"1314":-5.56146348662573,"1315":4.5187206851321795,"1316":-1.3373087787077247,"1317":-5.400515019921205,"1318":-5.9295016236173685,"1319":-6.0098900944038425,"1320":7.216009985863272,"1321":5.6344503766362255,"1322":-10.329556936583373,"1323":-5.745531976133764,"1324":-5.131216228785609,"1325":-4.465347485379629,"1326":-1.2167778920728742,"1327":3.7817186107717427,"1328":-2.3859660406431478,"1329":-4.438159524403005,"1330":0.31222239174847094,"1331":0.8609095289071165,"1332":-7.659843445431562,"1333":5.910068764922206,"1334":-3.577106771616284,"1335":-6.4334662534001525,"1336":-0.7773973276907561,"1337":-3.18991834818204,"1338":-1.7454795587380252,"1339":5.5050867844462195,"1340":-7.506139526979984,"1341":-3.118727717693768,"1342":-8.946631207164447,"1343":3.6121967975930014,"1344":-6.779191385834724,"1345":0.570267596434772,"1346":-1.0791216755129027,"1347":-5.5541960543369004,"1348":-2.8733061853282478,"1349":-8.062879995954553,"1350":-7.619827140886006,"1351":1.9583432895328563,"1352":-0.6517205496853605,"1353":0.09190425635531731,"1354":11.92311597571502,"1355":4.2174479511450365,"1356":5.271793234056773,"1357":3.7268804721983386,"1358":-3.040975472284319,"1359":10.00627595764741,"1360":6.483672326491768,"1361":4.461169714657573,"1362":-1.2856532294325227,"1363":0.6228371237981302,"1364":11.14366142101171,"1365":2.8135716046365187,"1366":4.778250151806104,"1367":3.387584474179996,"1368":1.5952018142066842,"1369":11.277858827052093,"1370":7.526232049940991,"1371":1.9214739808625938,"1372":3.240773401226192,"1373":3.5840405339535626,"1374":10.762439493711815,"1375":5.130203281336024,"1376":5.93462363223008,"1377":-8.73848278314755,"1378":-3.489952995003974,"1379":-8.75061121186745,"1380":-2.1701692031815805,"1381":0.3661932865625122,"1382":-5.012315311857468,"1383":-0.4612897410148371,"1384":9.714085366154697,"1385":-2.4391489768977395,"1386":-6.3291450988275475,"1387":-6.7863584745554295,"1388":13.712587659834183,"1389":-4.317742582307659,"1390":1.5065067914639114,"1391":2.6373140493474923,"1392":-3.735822735993743,"1393":-3.786353054338395,"1394":-3.471454806054101,"1395":-1.5959001375762194,"1396":-3.8456331053775044,"1397":-5.529099476231629,"1398":-3.5907981375775027,"1399":-3.5437477515434073,"1400":-2.1041825124585936,"1401":-3.315739017208114,"1402":-6.788547522565619,"1403":-1.953016995285452,"1404":-3.5707749755808376,"1405":6.216062658401913,"1406":-0.5608799180893563,"1407":-6.747615688895616,"1408":-3.059085060685176,"1409":-6.4573690802855435,"1410":-3.2977218135702846,"1411":-5.670269048516533,"1412":-3.0183479321922824,"1413":-6.928428366739885,"1414":0.04561948418533694,"1415":-3.3056599646176945,"1416":1.136881003788858,"1417":-3.3412781193053913,"1418":-2.486885452815225,"1419":-7.0062547691102415,"1420":2.009173301185308,"1421":6.201630553421719,"1422":-3.332439667528149,"1423":-6.029273442189304,"1424":-1.7754115007121287,"1425":3.514614110562044,"1426":-0.39155576010163234,"1427":-1.0758962978221633,"1428":-3.810733393121941,"1429":-0.3704434321789207,"1430":0.1473527139263594,"1431":3.338283602006257,"1432":0.3938749814248456,"1433":2.4364901649918553,"1434":-2.3265573714776067,"1435":-5.775061232860029,"1436":0.5876445737482376,"1437":9.668668469636636,"1438":2.073372843888705,"1439":4.225070229129912,"1440":1.0566612630752867,"1441":1.018996104335588,"1442":11.826630861744656,"1443":1.993444495215026,"1444":-0.7438920953630864,"1445":1.972450153090443,"1446":-7.900951986766535,"1447":-7.400163955828096,"1448":-6.919066930450327,"1449":-4.757316418903574,"1450":2.029898174555394,"1451":-2.4586965879304232,"1452":-6.401295142700946,"1453":-4.788629439105451,"1454":-6.402368226681356,"1455":0.6458285753618289,"1456":8.524523052138342,"1457":7.016005408965625,"1458":-1.899140554395735,"1459":7.226607131342567,"1460":8.423414321005898,"1461":10.520059917740387,"1462":5.913554472748878,"1463":9.153954235495284,"1464":7.905583594596447,"1465":8.58469111052108,"1466":0.5254184396744221,"1467":0.7428383132242341,"1468":-0.4736599574577719,"1469":2.875700848613118,"1470":7.095288324060175,"1471":4.5766414238563415,"1472":-5.794751833919473,"1473":-8.027246952536409,"1474":7.169221318212274,"1475":4.969761216841636,"1476":3.835614176674548,"1477":-0.7473189783184204,"1478":2.9773846058620275,"1479":6.370602227284367,"1480":6.271059369128371,"1481":-0.21261522281269016,"1482":4.368026943583057,"1483":4.973954481550636,"1484":6.007665835601008,"1485":4.2216203221237745,"1486":5.464444218653927,"1487":1.150857757141791,"1488":3.9885549131973166,"1489":0.7333151670711465,"1490":1.4976313937699306,"1491":-6.80652564902738,"1492":2.744769799077808,"1493":3.7614556523325673,"1494":-2.9207474312539654,"1495":2.8532183802493067,"1496":-0.007514202506967736,"1497":0.3901423494577148,"1498":1.4734149215965924,"1499":0.28551462105405373,"1500":2.9744251113297904,"1501":-1.0637603981559651,"1502":1.9246395022854892,"1503":-0.7048464066443317,"1504":1.0075902239172847,"1505":1.6481555278051976,"1506":-1.6136377431872158,"1507":0.8458875509123835,"1508":-11.701791454978544,"1509":-6.868904285868216,"1510":21.053024416651336,"1511":15.73379033113612,"1512":7.43203412612215,"1513":2.34862816380295,"1514":-3.4127641197573135,"1515":7.41576116461362,"1516":13.418278732122046,"1517":8.293431488607167,"1518":-10.273757069877725,"1519":4.321512415138721,"1520":13.807818341662355,"1521":10.091298815077435,"1522":9.023113993278844,"1523":19.374534359904086,"1524":4.7562351975858315,"1525":14.89798284817161,"1526":9.288497616116526,"1527":10.764854160154126,"1528":2.1699373038279117,"1529":8.70530127597306,"1530":18.855144097124672,"1531":10.063616826009468,"1532":9.740865240579115,"1533":4.557784422704042,"1534":0.12220612091034556,"1535":-1.949801188831622,"1536":-1.142245428151996,"1537":-1.6448933227988374,"1538":-0.4239366438597323,"1539":0.17560038223631336,"1540":-2.249379623162399,"1541":0.2664467175755556,"1542":-1.22147818737691,"1543":-1.5064769166059155,"1544":-0.8847868867888787,"1545":-0.5148392674056635,"1546":4.696635542760501,"1547":-1.6218540493571936,"1548":-2.138641598529683,"1549":-0.6050847766662233,"1550":22.48962177639026,"1551":12.922260424540646,"1552":-1.1155871866332048,"1553":-0.7894147407189567,"1554":0.10094677114830632,"1555":5.125837234925696,"1556":2.56486799941971,"1557":1.6511226923370297,"1558":-1.0238333201153702,"1559":-0.6539885050058268,"1560":2.5030628140163422,"1561":-0.5616125714876996,"1562":6.607975534110245,"1563":5.044075139444064,"1564":6.037637348439423,"1565":0.5597848553261258,"1566":6.201322497413744,"1567":8.658770754933087,"1568":7.09250192033635,"1569":5.475558131370998,"1570":1.2571545817315861,"1571":-0.22878410474176566,"1572":4.7430177305149614,"1573":3.8690629830804664,"1574":4.9153638411647504,"1575":2.070358271168635,"1576":-2.73712849711357,"1577":6.3399681844175015,"1578":5.761321564412907,"1579":3.8114304811439004,"1580":-0.8176414431199269,"1581":9.30000601586552,"1582":8.579158489065506,"1583":5.871374300666435,"1584":4.949982390201982,"1585":-5.103037903144703,"1586":-2.7327875773671484,"1587":2.5024180817919626,"1588":4.658901673089306,"1589":4.75935749642825,"1590":4.128256523597644,"1591":0.29241169505984943,"1592":-4.309390564624655,"1593":-1.5168130346956714,"1594":4.731812017375293,"1595":1.9269792847819438,"1596":5.410609566770101,"1597":7.01712752206539,"1598":4.777920961801867,"1599":9.702154972124172,"1600":7.5383377555477145,"1601":2.9305540040975724,"1602":7.055913003688384,"1603":-8.110424960668375,"1604":4.557497174985591,"1605":6.760253486856075,"1606":-5.223749154806889,"1607":-0.6843752894071431,"1608":13.125879075256796,"1609":-4.454220500256191,"1610":3.5648751855667107,"1611":-1.773205484429447,"1612":16.083246165526518,"1613":-7.465771017525079,"1614":3.770585861860122,"1615":14.21166306138316,"1616":8.527852970361376,"1617":-5.479131666412644,"1618":10.72095363833253,"1619":12.172586025966044,"1620":13.785328567148214,"1621":10.710005794339322,"1622":-2.416661626250909,"1623":1.937524184249449,"1624":11.325632211896293,"1625":11.668754084195848,"1626":9.34297356592144,"1627":-15.090715595342987,"1628":4.213597881983416,"1629":15.276887485075573,"1630":12.615047344031627,"1631":5.8341578941076735,"1632":1.7748913718822579,"1633":7.063676557672354,"1634":12.91671100162764,"1635":13.374917551073155,"1636":7.940210280280534,"1637":6.250666712629695,"1638":-1.8581523852163544,"1639":-5.950499459846995,"1640":-5.773000038876509,"1641":-7.941105974012199,"1642":-7.795906576910333,"1643":-3.64788281696351,"1644":-2.6712520563258275,"1645":-6.000560034611904,"1646":8.304756069655644,"1647":-2.7771869908212468,"1648":13.648616957724307,"1649":-1.702296759350428,"1650":2.1788228021652225,"1651":5.891100008816255,"1652":5.3048241194135946,"1653":-3.575395057730742,"1654":-0.5271011758612312,"1655":0.041109632465017434,"1656":-4.136264862753054,"1657":-5.2328432266940625,"1658":-0.2994477692461891,"1659":-0.9464896209891557,"1660":-1.6440822330659421,"1661":-4.342170823449284,"1662":-5.468416982661815,"1663":1.2749088957624373,"1664":-0.7705047074794573,"1665":0.17822142951694345,"1666":-2.0155653918529106,"1667":-2.117009930209051,"1668":-4.479042060924475,"1669":-1.1774314776567734,"1670":2.138378802197202,"1671":0.6367989485653937,"1672":-0.2685455790423968,"1673":-0.6166725250865285,"1674":-2.7007350517401276,"1675":-1.356672436483775,"1676":1.1189340494971562,"1677":-1.4634693979253093,"1678":-0.908380538021892,"1679":-2.3485430310575537,"1680":3.954418402631909,"1681":-1.1863357266735937,"1682":-1.8742209425411902,"1683":-1.5609123268948963,"1684":-3.241327320432644,"1685":-1.8722647418906153,"1686":0.43613625142582674,"1687":-1.212378492999672,"1688":-1.4240272920996546,"1689":-4.973311504773333,"1690":-2.6978624671948737,"1691":-2.940753996227508,"1692":0.31709866332024755,"1693":3.0344437751144278,"1694":1.9629146287406813,"1695":0.4776064248575808,"1696":-1.2985318394013672,"1697":-0.24277932008491135,"1698":3.8521659008981888,"1699":4.59297033044899,"1700":8.010794630940564,"1701":3.0567941161329766,"1702":1.4505790587348442,"1703":5.875064695114852,"1704":5.116393151235291,"1705":7.1475659147475925,"1706":3.539304937727503,"1707":2.8930695853973454,"1708":3.5856135075787714,"1709":4.051387064951056,"1710":2.668245965285537,"1711":1.6831845626154864,"1712":4.9762379653411895,"1713":3.27830175700396,"1714":3.9879718043819876,"1715":1.5474208334725508,"1716":-4.078183485581649,"1717":10.128147595010516,"1718":4.148336942935837,"1719":5.034125906527778,"1720":5.847704090033203,"1721":-5.545725184127032,"1722":-3.3172205238458132,"1723":6.33553928926396,"1724":6.388274215495631,"1725":3.8269082610662,"1726":-1.1352166139838014,"1727":3.5058089087295254,"1728":3.9166231469275385,"1729":4.725461708153858,"1730":3.1811535066944914,"1731":4.181079138482142,"1732":4.33845890825544,"1733":8.815477131294418,"1734":4.70107154112194,"1735":5.254985954531425,"1736":3.510101495574387,"1737":2.3930819710418803,"1738":8.49706462610028,"1739":5.649628980617913,"1740":5.418784432148157,"1741":-1.995828652956331,"1742":-7.957138501199475,"1743":-12.274889425702495,"1744":-6.129989105737057,"1745":-6.168336895820464,"1746":-2.55563452687001,"1747":7.834941823483413,"1748":1.5068662889522852,"1749":-3.498871649126062,"1750":-5.053888300325884,"1751":-5.271127184455197,"1752":0.6069122660947083,"1753":1.1114307262645915,"1754":-5.892019814137027,"1755":-4.395562496564333,"1756":-2.6881276185659524,"1757":-8.381185543168503,"1758":-1.3746232071127198,"1759":-6.97158997409094,"1760":-4.822234371972966,"1761":-5.540117536738462,"1762":-6.688887435921235,"1763":4.784961049438603,"1764":-5.238614906968292,"1765":-3.719680941805253,"1766":-6.357193580656101,"1767":-1.4590159269404974,"1768":-2.7060459769176317,"1769":-2.765928669166803,"1770":0.12486126986000776,"1771":-2.103762974859916,"1772":-2.5508755919627952,"1773":1.3638580934834692,"1774":1.2201734984677226,"1775":-3.6442546085774303,"1776":-0.156096424923073,"1777":-3.4066855663019755,"1778":0.3142177264924387,"1779":-1.0249434845321503,"1780":-2.0642029189359974,"1781":-2.566291505932812,"1782":-3.8042287684183607,"1783":-1.8968362272223267,"1784":-3.288041807971475,"1785":2.030979716811423,"1786":-2.762152934083727,"1787":-3.593415471952302,"1788":-1.1679240427083422,"1789":-1.699977699445505,"1790":-4.529488841190777,"1791":-2.95967667776406,"1792":-4.116356082115922,"1793":-1.878750133035991,"1794":1.9435530888671162,"1795":-6.6796912674392726,"1796":2.376322281181634,"1797":3.726283280767546,"1798":4.742961776860467,"1799":3.385204215022762,"1800":-0.8549473474547973,"1801":-1.4136323829280406,"1802":-0.6792706814725569,"1803":6.399193692759099,"1804":-1.9443776225082063,"1805":0.035604476922293,"1806":7.4363581054204815,"1807":5.220046138844979,"1808":5.3180361391679005,"1809":-0.3684552973194117,"1810":1.5968080151900226,"1811":-1.1992969879819197,"1812":5.639135044926251,"1813":8.392394907037772,"1814":0.5133124305309372,"1815":-2.3840552947312363,"1816":0.5885760302498011,"1817":5.820821307353132,"1818":3.5363030952660868,"1819":5.847542281042539,"1820":3.709261381685999,"1821":8.805610488464136,"1822":6.212749723608715,"1823":7.5795829130014445,"1824":3.898678870413933,"1825":9.829734858030122,"1826":6.479567381143132,"1827":9.960627719636062,"1828":7.304587843363407,"1829":4.276871936474713,"1830":-0.6978687787825237,"1831":-7.809855690891544,"1832":8.75428779404901,"1833":5.5521712736337,"1834":2.452473665389059,"1835":-6.395808604581988,"1836":-2.466926353929298,"1837":7.259527580765613,"1838":4.165505293166605,"1839":2.889752090157478,"1840":-5.042448888888258,"1841":8.176508828499358,"1842":8.884067697265253,"1843":6.1046248617012475,"1844":5.6118177342112805,"1845":2.0353154518439425,"1846":0.13453345299298686,"1847":-10.330525769861158,"1848":-10.257143531900274,"1849":-6.383369478228124,"1850":-2.1827804797249852,"1851":-8.812982510544005,"1852":7.0471453033339175,"1853":-4.161825767712711,"1854":-3.1251500055637114,"1855":1.104909630692244,"1856":6.88577359407817,"1857":-3.133680964844,"1858":-2.3687296959398583,"1859":-0.6526531079806492,"1860":-11.184000884176683,"1861":-5.283131698550968,"1862":-12.397299590450887,"1863":-9.245952106931483,"1864":-4.805921567548011,"1865":-5.3950638924533045,"1866":-0.9432393491393332,"1867":9.394927601782982,"1868":-2.294771777042257,"1869":-1.815223352642052,"1870":-0.8099238494553153,"1871":5.3729040205360725,"1872":3.8295016847787586,"1873":-6.712622489185858,"1874":18.416920816351222,"1875":14.249647942815315,"1876":7.305757033459427,"1877":17.63683067652053,"1878":17.702243067568872,"1879":15.88857631996144,"1880":12.403177249614904,"1881":4.819906031728788,"1882":-8.233765884104931,"1883":-6.8679608371989636,"1884":10.697644377196324,"1885":8.24126730794003,"1886":6.655374540788401,"1887":4.077829160181523,"1888":0.3955074353558294,"1889":11.009132451739603,"1890":12.052151113738775,"1891":9.092088835121418,"1892":-10.922133929968478,"1893":4.083012014178533,"1894":4.020351719872195,"1895":1.6518185241843937,"1896":6.743475464863662,"1897":3.5926486811599387,"1898":3.272308388135473,"1899":-2.3625431855738346,"1900":-10.658837227107156,"1901":-2.8091700777143283,"1902":-5.012008321723131,"1903":-2.755564291564441,"1904":3.1486416766963865,"1905":-5.31860686113103,"1906":-3.079954715394344,"1907":-2.437780458370427,"1908":-5.552337699646837,"1909":-3.6050191863210856,"1910":-3.569088803927299,"1911":-2.5197004436808546,"1912":-8.150278081466432,"1913":5.056247064608872,"1914":14.246819480233958,"1915":-2.1564015799963783,"1916":-3.1537549756323324,"1917":-3.486996469389929,"1918":-6.067717923024597,"1919":1.088326480937441,"1920":-2.9361468832479902,"1921":-6.19081924303763,"1922":-3.7169797430378275,"1923":-6.05827221470487,"1924":1.3457958983467495,"1925":2.949668442300434,"1926":5.847744310963206,"1927":3.669155289847822,"1928":3.09735378295518,"1929":2.4286441471938907,"1930":-5.970925328837235,"1931":6.268789326305098,"1932":3.771336391111908,"1933":3.4535705430700716,"1934":-0.6683891760392233,"1935":3.2151784208620393,"1936":3.480234996258319,"1937":2.4115107821282304,"1938":2.6616067947194626,"1939":-3.568985555498834,"1940":2.2474285711045785,"1941":4.897642112945503,"1942":2.4386625135323037,"1943":2.8875865225763504,"1944":5.522186850825498,"1945":-2.896309646817009,"1946":-0.1697703323097109,"1947":3.5504024118197517,"1948":2.8222193283816064,"1949":2.9663972177141655,"1950":-0.8909290409983219,"1951":-0.7592649704021694,"1952":-9.326571674225715,"1953":-4.890553236935058,"1954":-5.6959208617633195,"1955":1.9002595477052868,"1956":4.259463788849517,"1957":-6.914471145041399,"1958":-5.3970242404095465,"1959":-2.9834151807512623,"1960":3.722071577050611,"1961":-4.096581915069991,"1962":-3.5419224898590906,"1963":-5.209812105596127,"1964":-3.673290593157468,"1965":-3.4006284489911986,"1966":-5.833830457648247,"1967":-6.938336744638162,"1968":-4.007283795712209,"1969":-4.5154068243624605,"1970":-6.090112707297177,"1971":-2.7531201503688125,"1972":-9.146675837973476,"1973":-3.2067145664419106,"1974":-3.542665104846677,"1975":-2.484164913864635,"1976":-0.29076655386341704,"1977":-2.1428966470644135,"1978":-0.7317956312299263,"1979":-1.5892248370630229,"1980":-2.200130644985008,"1981":0.9255617350401274,"1982":0.11587411084388938,"1983":18.749248813889,"1984":17.286263332356057,"1985":11.327636852839815,"1986":0.3744186554561883,"1987":0.5956799791746766,"1988":-2.195232393263231,"1989":-3.8652413300347246,"1990":-3.1965193016628817,"1991":2.203175396043043,"1992":0.08112724817477077,"1993":-0.4991465124719575,"1994":-2.1282922514853606,"1995":-2.0725253892879345,"1996":-1.2744286148168098,"1997":0.7975626487836324,"1998":-1.6743940672707234,"1999":1.4559489802852839,"2000":0.5455860114935105,"2001":-0.2585203580397125,"2002":-6.76443992154188,"2003":6.462831287984565,"2004":-1.8507296873325927,"2005":-1.4928674861568771,"2006":-4.384878967759894,"2007":3.561821607003187,"2008":-1.1272346646941203,"2009":-4.7838601039089035,"2010":-5.621536045992012,"2011":-1.917236143163001,"2012":-3.3010019300945235,"2013":-2.984687574000975,"2014":0.3024638630842717,"2015":-4.598299743420306,"2016":-6.216186730606155,"2017":1.323518757367651,"2018":-4.850336388732112,"2019":-3.1853795639269498,"2020":-3.089560251131523,"2021":-0.8909964995975709,"2022":0.9721572230989206,"2023":-9.764953204949286,"2024":-5.065426929182035,"2025":-2.3250795652709084,"2026":-2.2465690146609165,"2027":0.20667283213907284,"2028":7.516387229461025,"2029":0.6912357117690163,"2030":-13.151070894095486,"2031":-8.843200489219788,"2032":-14.256885214369566,"2033":12.323368890256427,"2034":4.73510289958677,"2035":-12.461577723905224,"2036":-13.309669132352642,"2037":-7.181178710016605,"2038":-12.394577051158231,"2039":-4.607970051948893,"2040":-5.04816191678228,"2041":-6.960468579461181,"2042":-8.856358431526191,"2043":-9.30532136328064,"2044":0.23716954813786634,"2045":-15.190598745730393,"2046":-11.720209881020965,"2047":-8.924264623375352,"2048":3.282354373557507,"2049":12.03990995662899,"2050":-6.050996853147708,"2051":-13.530622433795324,"2052":-6.251928574887028,"2053":-0.6211276971909444,"2054":4.4039175876814625,"2055":6.571902135100415,"2056":-5.3895763989258665,"2057":-1.414618197484636,"2058":2.418747150306975,"2059":1.7462463497598166,"2060":5.1436929062724985,"2061":-2.825693136516268,"2062":4.115746051577455,"2063":-2.8546757689015574,"2064":-0.33274774865469187,"2065":4.946088042562804,"2066":7.1341756633922575,"2067":0.11946832845912217,"2068":9.119917578311306,"2069":-4.229703461628468,"2070":-10.556141050511203,"2071":-9.00225455476909,"2072":-3.2248331657885996,"2073":-0.7255248631283518,"2074":0.9224798096022834,"2075":2.549064826847579,"2076":4.689378812901789,"2077":-2.255629361843178,"2078":-2.3783119244980067,"2079":-3.7239915288843775,"2080":1.5149500967734701,"2081":5.234279320767447,"2082":-8.08858991607978,"2083":-5.672822790952981,"2084":-7.986016739511091,"2085":-2.3287532554418258,"2086":5.018424504375132,"2087":-9.946532193649128,"2088":-6.464510218706049,"2089":-7.341759440387362,"2090":-3.840148270947412,"2091":-2.903153207379441,"2092":2.1874530500418197,"2093":-6.355951404416982,"2094":-6.432255821217616,"2095":7.422633187585723,"2096":-2.6917151021099777,"2097":-2.4646716185445814,"2098":-6.75298195614307,"2099":-6.704005959407449,"2100":0.5615974527170735,"2101":2.01438766454129,"2102":-2.7363597705814793,"2103":-1.1144847505264464,"2104":-7.008789775216196,"2105":1.0623651984224793,"2106":0.12859323507415957,"2107":5.921656837696782,"2108":-6.1788497361882255,"2109":12.91462826576418,"2110":11.52781705731507,"2111":10.576137267609917,"2112":2.357085265136439,"2113":-3.4023243879286147,"2114":14.511006153599526,"2115":12.728321103618395,"2116":8.750920803906183,"2117":-0.8062961984579766,"2118":0.009211513123205685,"2119":9.550025556005476,"2120":8.79993897315588,"2121":-0.6248216384970285,"2122":-3.7743709348460985,"2123":8.111784982223536,"2124":15.66876311502979,"2125":12.677357618333243,"2126":-2.2583938038301605,"2127":2.6858353216642934,"2128":-4.957469046104578,"2129":9.481303852387027,"2130":7.820885591604972,"2131":0.38053466548393083,"2132":-5.42583842696333,"2133":-0.031856004534592655,"2134":-0.2135635225833573,"2135":-9.857988354689036,"2136":-7.8141925472170035,"2137":-7.647430959884108,"2138":-1.0192560889639972,"2139":-6.822342594527028,"2140":-8.194235416481403,"2141":-9.66574130424111,"2142":-5.388164123242245,"2143":-7.195274214569742,"2144":-6.20419775186438,"2145":-5.852892107474387,"2146":-6.892212960859519,"2147":-5.170206834387595,"2148":7.1502445149030205,"2149":-1.769513371603139,"2150":-14.402578167158225,"2151":-7.867424572599326,"2152":1.3389170987835743,"2153":-7.257389698446244,"2154":-11.581169475209856,"2155":-6.292346142505317,"2156":-8.476844840495673,"2157":-4.886858023862821,"2158":-0.1412697365149445,"2159":-11.176343930497413,"2160":-4.383890578102343,"2161":-8.702850001656596,"2162":-7.861010251043758,"2163":-6.125320331632945,"2164":-11.28238444695,"2165":-1.8888109443619776,"2166":-14.472911754672102,"2167":-5.71638700883545,"2168":-0.06904586021914073,"2169":-0.008575286749873701,"2170":-3.3196078625177896,"2171":-8.372571406883008,"2172":-6.991858136354183,"2173":-0.5007271335825599,"2174":-8.670278834831771,"2175":-0.7202916064152174,"2176":-9.142675323927843,"2177":-8.599751219418012,"2178":8.371306970944266,"2179":-9.70307241824964,"2180":1.1449665165992484,"2181":-10.603506664061065,"2182":-9.619645526990764,"2183":2.3963387957394024,"2184":-1.9592163184765288,"2185":-3.860989733932698,"2186":22.213198792487514,"2187":18.48768931215831,"2188":11.62151768403496,"2189":-2.650514376070406,"2190":-5.5361542570168,"2191":18.28429598494018,"2192":16.90118716675797,"2193":19.108250538255557,"2194":-5.96878011505145,"2195":-0.45920665573347247,"2196":19.817784879485895,"2197":13.05257527371551,"2198":12.975023936217346,"2199":7.4299730250021385,"2200":2.0162592302542186,"2201":19.864654047525796,"2202":15.190673285931783,"2203":16.216866982272276,"2204":12.126510523492344,"2205":-0.610455083446358,"2206":21.530798304807455,"2207":16.706322514996927,"2208":13.274483179121374,"2209":-1.792417264851026,"2210":5.171719176987474,"2211":7.2851942350625825,"2212":7.767630519742442,"2213":13.210918669263092,"2214":12.931777270025586,"2215":16.90532731401152,"2216":0.6949224218769909,"2217":2.7897229715939225,"2218":13.570835187795934,"2219":14.080880185293145,"2220":10.209266188054414,"2221":7.553248668232121,"2222":13.002199129337576,"2223":9.827435277095054,"2224":10.048895384768182,"2225":-8.906652566011129,"2226":-3.33964966257276,"2227":10.328248419540547,"2228":11.49826929141067,"2229":8.732377247666077,"2230":4.956454833295952,"2231":-6.703171908706706,"2232":2.5266772650986637,"2233":11.704082873365842,"2234":13.062984898022401,"2235":-2.369448486397336,"2236":-3.621360839977146,"2237":-0.6490750729001804,"2238":-0.8083341066541733,"2239":3.40408173486813,"2240":-4.696913808598667,"2241":-1.5508785864299734,"2242":-4.129603770894526,"2243":-1.6826067726251022,"2244":-1.585716403574617,"2245":-2.8034294107337465,"2246":4.922081629360757,"2247":-1.3200040438445353,"2248":-6.190440698722789,"2249":-3.477899204324379,"2250":0.5867284984509661,"2251":0.07314832333432122,"2252":22.2088612458081,"2253":5.082748919303585,"2254":-0.3520660079692019,"2255":3.7524991349352352,"2256":-0.1934850470961008,"2257":-0.4173882193377389,"2258":-0.8042527014358251,"2259":-2.689083731121317,"2260":2.086131897361509,"2261":-3.5125278441942647,"2262":1.5999600613176772,"2263":2.3458931992331373,"2264":3.628247703082627,"2265":2.9307064646717103,"2266":3.3531610977242,"2267":0.9475177299527658,"2268":0.683810723932145,"2269":-0.2906690675418498,"2270":3.717393446496999,"2271":2.752495901600769,"2272":0.3032510238108516,"2273":2.229935689011871,"2274":2.8385141364723006,"2275":2.164031858787433,"2276":2.941016853921785,"2277":-2.1090830178093016,"2278":0.12286527087066142,"2279":0.5787588675003807,"2280":3.1626581920829597,"2281":3.2970662253063385,"2282":2.5810543718424803,"2283":0.034641027449014726,"2284":-0.6374498999124396,"2285":3.218089121372751,"2286":2.935812862869531,"2287":1.9563764593099908,"2288":0.1759269948089905,"2289":0.563838870650732,"2290":0.609793890678294,"2291":1.0083153950725454,"2292":0.008283831874147397,"2293":0.9281312502104808,"2294":-0.8438391378451693,"2295":2.6976121054203657,"2296":1.858385079209484,"2297":1.5408173123670483,"2298":0.2732494297100689,"2299":0.44720179533306154,"2300":19.050676617181402,"2301":12.852206219483026,"2302":-1.4890237814056528,"2303":0.5019657085781001,"2304":0.48161285783902097,"2305":4.712258056434876,"2306":3.9477292898507392,"2307":1.492876631133191,"2308":-0.25481139940359804,"2309":-0.7719040240233928,"2310":0.060383922988867314,"2311":-0.14199040491813822,"2312":0.9746616619006181,"2313":0.015999522924635398,"2314":-6.05312799840957,"2315":-2.1142072742863784,"2316":6.292651153764214,"2317":8.79437575370296,"2318":5.254199937561838,"2319":-3.6711710565929434,"2320":1.4900132236031167,"2321":9.945021518538852,"2322":10.515618254292972,"2323":5.903467876932252,"2324":-3.459592490920294,"2325":-2.236610909750231,"2326":8.467128912486512,"2327":5.136629590159308,"2328":6.911597467417245,"2329":12.363125432749854,"2330":7.6197045664808805,"2331":1.8970620600395154,"2332":6.566345483874596,"2333":8.883113349206964,"2334":7.754829300421597,"2335":-3.9633190186332845,"2336":9.053750643406504,"2337":6.744300857374657,"2338":6.62938309801224,"2339":4.055797396964426,"2340":-0.9948689787171417,"2341":-7.990125072735107,"2342":-7.079745461801828,"2343":-4.240023038072166,"2344":-2.141491891465974,"2345":-7.32801087579041,"2346":-3.171211329268276,"2347":-1.6878151483598898,"2348":-5.998949043821048,"2349":-5.142762278359964,"2350":-0.002193764775303723,"2351":3.7270231206838322,"2352":4.799888200633687,"2353":-4.711531626803592,"2354":-5.785671634571803,"2355":5.543320742221897,"2356":6.199358486933998,"2357":-5.823941587271707,"2358":-4.748768712224228,"2359":-4.553082976765434,"2360":-8.487016237995585,"2361":-5.838279534703463,"2362":1.8076209142115398,"2363":-4.579526301119416,"2364":-4.0444046600258945,"2365":-0.6113023153321864,"2366":-0.4020227521219784,"2367":-4.466414748888486,"2368":-8.760681110971708,"2369":-6.155266917128943,"2370":-4.835462931495676,"2371":6.5681802018978415,"2372":-6.661805054738505,"2373":-6.6209568042280855,"2374":-3.254200285813246,"2375":-3.154500871882734,"2376":-4.9437073432550545,"2377":5.156661605881064,"2378":-5.459580494374847,"2379":-5.849566457627392,"2380":-5.769703744952394,"2381":-7.307985405273894,"2382":-6.749189305156963,"2383":-9.645058388879155,"2384":-5.824653304218447,"2385":-4.171281240678504,"2386":-7.796395252974807,"2387":3.6557476909911846,"2388":-0.3181576678055527,"2389":-6.922263689729613,"2390":-3.8856318020188017,"2391":-5.014857363186101,"2392":2.878921041677416,"2393":6.002727356916534,"2394":7.795356402212063,"2395":13.124133015271156,"2396":10.016334361900922,"2397":7.112286752559602,"2398":-4.092308216856992,"2399":11.556016920264058,"2400":11.59549386373172,"2401":11.379295210193273,"2402":-0.9773093862026311,"2403":7.4739963660421616,"2404":14.373162683386797,"2405":7.927639715459131,"2406":10.144652881033451,"2407":-6.234105699728853,"2408":-9.09514354923284,"2409":17.254965789742993,"2410":11.07407755938841,"2411":10.901269618649893,"2412":12.369785058940916,"2413":-4.74146477850214,"2414":14.159444338839288,"2415":9.645155935057195,"2416":13.266793116320482,"2417":0.07377906538821008,"2418":8.647381348202858,"2419":7.269680387575911,"2420":-3.6517136443959606,"2421":2.918272948714976,"2422":2.4526992839455213,"2423":-5.524478478416008,"2424":0.8666245174186608,"2425":11.991354630403626,"2426":7.54389453526853,"2427":2.2829899662636337,"2428":-3.7167987147873753,"2429":-6.221297760124676,"2430":6.303335194622178,"2431":4.321473561592284,"2432":5.439480841638216,"2433":2.3347143245507214,"2434":-2.76110897569427,"2435":2.7018029372164984,"2436":0.8307647946648585,"2437":5.634081824992391,"2438":-6.50050118231736,"2439":0.8539733553481085,"2440":9.315847664803181,"2441":4.9423165379271,"2442":3.5297215744709547,"2443":1.6042194265161946,"2444":12.531698987716263,"2445":-1.4655550647071223,"2446":-4.745854449104676,"2447":-12.74843967714676,"2448":-11.628949917626324,"2449":2.1713809113948717,"2450":-11.257726289512465,"2451":2.6911112526403076,"2452":-13.668808373966883,"2453":-9.773355087995515,"2454":0.4747967202083482,"2455":-10.447124909958733,"2456":3.184066779373921,"2457":-8.959730464464224,"2458":-12.95968901794286,"2459":-3.9341102219575066,"2460":-0.8808823140024324,"2461":-6.823655587182514,"2462":-11.786229608384701,"2463":-11.016922028447773,"2464":4.132472172721389,"2465":1.4451929074781515,"2466":0.7175983424057759,"2467":-11.84921748055624,"2468":-10.60849526184506,"2469":-5.285610405376027,"2470":2.312982970494482,"2471":-1.8322407462438453,"2472":1.5942383669944538,"2473":-0.5121024593089283,"2474":-2.08189577713592,"2475":-0.4053655731041952,"2476":1.2204236933436414,"2477":-2.2915228387808027,"2478":-5.1920740186393095,"2479":-3.0496294364386807,"2480":0.20983149985341268,"2481":-3.8773926140647235,"2482":2.190485795711716,"2483":-1.9254146491147586,"2484":0.6538157929285704,"2485":-0.8216040168536713,"2486":-3.019768312271016,"2487":0.770564170279453,"2488":-4.01372938940759,"2489":-2.15333248106336,"2490":4.621619562208722,"2491":-0.9572955011592661,"2492":-1.5613934214309066,"2493":-3.286082814637806,"2494":-1.653329879057506,"2495":-7.422314606342117,"2496":0.3415905628237226,"2497":-9.099220952442103,"2498":-2.301937833898611,"2499":-8.083937056306395,"2500":2.146939877850776,"2501":-2.6207185578074585,"2502":-2.973018567054914,"2503":-9.25781025299839,"2504":1.0197130330472999,"2505":-3.4353929858275993,"2506":3.478162613447325,"2507":1.1106545619862545,"2508":-6.089005045934649,"2509":-7.349117177275158,"2510":-8.877904862436214,"2511":-6.656614502041614,"2512":0.6326534996343497,"2513":0.5942551214493608,"2514":-4.383234942948063,"2515":1.9476206697852076,"2516":5.463362231719513,"2517":-3.3318995735136783,"2518":-1.2001848967028128,"2519":-6.936049281701565,"2520":-1.0802135998204958,"2521":0.5027889848074365,"2522":-1.1023249592755011,"2523":-3.4303282654466978,"2524":1.3361179621247163,"2525":0.4649552322098636,"2526":3.088028472570925,"2527":-3.6827357628971447,"2528":6.0697790315554965,"2529":16.234027984636597,"2530":3.8029952624874364,"2531":3.7069370741885,"2532":1.204413729284267,"2533":-3.5272664227063975,"2534":-15.692320972541893,"2535":4.043683110024252,"2536":1.1001237918980682,"2537":-3.3638543468624515,"2538":5.316832020208317,"2539":4.3368442047287665,"2540":2.8943295963742823,"2541":1.97574083824009,"2542":-0.14230085186819927,"2543":1.0942579663848846,"2544":0.09147253626992329,"2545":2.441201394570595,"2546":2.410326429567523,"2547":1.462095113274415,"2548":-7.920351294157715,"2549":-3.542320537665803,"2550":2.174322220004559,"2551":-11.139314222466284,"2552":-12.671105711462168,"2553":-5.635499360329894,"2554":0.7673611067090201,"2555":-12.97706879960897,"2556":-10.01929704096912,"2557":-12.274049599185098,"2558":0.6156044860181742,"2559":-3.249754476039356,"2560":-6.231091483646049,"2561":-13.316927854349673,"2562":-9.709665610909951,"2563":-8.228142735939315,"2564":3.174537841641566,"2565":11.598750853683885,"2566":-13.45092395859222,"2567":-12.156757675692296,"2568":0.3112671440302261,"2569":4.638231576977945,"2570":-7.228209226773595,"2571":-14.31452343741639,"2572":-9.694976225056626,"2573":0.8936623004085468,"2574":5.047454720903121,"2575":2.3864119827734167,"2576":3.2513300722736207,"2577":3.3504613476854126,"2578":1.0500293694285197,"2579":-1.0891619033992792,"2580":-1.2600959838841725,"2581":3.8139123172652996,"2582":3.028650883453672,"2583":2.9730562784642602,"2584":-5.876970947547598,"2585":-1.195054263489648,"2586":3.954876627232163,"2587":1.9906506480967427,"2588":3.338797137831434,"2589":3.9135287601743443,"2590":4.127570329727829,"2591":-0.1268666326271341,"2592":2.7062686731741903,"2593":3.2132327318251432,"2594":0.98378443980466,"2595":0.7404806062448436,"2596":2.030164710499306,"2597":1.0149280449731077,"2598":3.0979709699277036,"2599":-1.8053211835082326}},"b1":{"n":100,"d":1,"w":{"0":-6.282123001142105,"1":-10.955814816696105,"2":-12.339906717973266,"3":-3.7277902515249135,"4":0.039917470756835945,"5":-0.917262143477595,"6":-5.968842234334851,"7":7.915615665960821,"8":-5.1893713918762945,"9":-3.4638956824622316,"10":3.922116879760356,"11":2.700385060326492,"12":3.3222415135104986,"13":0.17175254432333975,"14":6.522740021698369,"15":6.686275193823263,"16":-4.067450884673212,"17":11.454617767210074,"18":-3.5401240260411178,"19":8.534598683695314,"20":-3.868182634408392,"21":-8.573765569198068,"22":-2.4139014122081814,"23":11.746284911963892,"24":-0.6019476697545366,"25":1.8663625352186357,"26":-2.5277687495849945,"27":-19.987265347081248,"28":-11.958653201653432,"29":5.432382013080776,"30":-8.963974081463848,"31":-1.739115805792201,"32":-3.92648432206482,"33":7.781395296452639,"34":6.832608281559544,"35":-1.6123642114956458,"36":2.8750659816753785,"37":7.530337011220589,"38":-12.046786724955536,"39":11.14067673634656,"40":11.876703274570541,"41":11.075469453470154,"42":1.057515041846784,"43":-8.28301010725803,"44":2.115044617056158,"45":4.908282606650071,"46":-3.1522377830155777,"47":1.2177384882345947,"48":2.6208921013973256,"49":3.8354584458830576,"50":-4.935445117081118,"51":-6.6691819082255686,"52":19.753548634287565,"53":1.0634857118805896,"54":-13.079553029784245,"55":-5.981853026198182,"56":5.178831821450916,"57":-5.150365427131884,"58":-4.146664420192362,"59":-9.62036483121698,"60":13.045926871841171,"61":2.648000758358877,"62":5.895818889608926,"63":2.9293736377811483,"64":-3.0244135622373856,"65":6.744218952725232,"66":7.116114109625755,"67":-10.280238469788044,"68":-4.5591652359089565,"69":1.9845592842452278,"70":6.675044706644041,"71":-3.7415013356092564,"72":1.4459776778754596,"73":-3.6995606074480287,"74":3.102501005458508,"75":3.2360601533786184,"76":2.2465648777159637,"77":-3.6342896108955705,"78":-21.42542832268122,"79":3.035634690514325,"80":-12.558200061730739,"81":5.459248549934783,"82":6.645580170190815,"83":-11.17049720604593,"84":0.4069355552981108,"85":4.043918077620828,"86":2.7399568439952806,"87":4.845586089025412,"88":-18.87972243211146,"89":1.642865572093192,"90":-9.11923183005531,"91":-2.3326267120918827,"92":3.694877576643689,"93":4.261363151107965,"94":-5.446788826615399,"95":-4.773860929717368,"96":-3.4815382444560727,"97":-5.5515922214260245,"98":-12.303501896936277,"99":6.794388404676162}},"W2":{"n":4,"d":100,"w":{"0":0.12441616733056998,"1":2.5217180408057547,"2":19.522525203562317,"3":12.283113159380825,"4":-13.933359482744532,"5":7.605132895850832,"6":8.950342650117255,"7":25.00161317598851,"8":2.6508194738632485,"9":3.693210893782806,"10":2.831159415893619,"11":18.052127240751098,"12":44.5002831268912,"13":2.4555314676656117,"14":0.28487733849445,"15":-14.551315679367383,"16":18.70172729112812,"17":-18.60228102150591,"18":16.360521491507598,"19":13.702078089759578,"20":-3.3141603088355174,"21":-13.1617296900966,"22":-31.030768292610794,"23":0.15193541611524772,"24":1.9795336284323801,"25":0.3540984644630903,"26":2.15791453093681,"27":-0.6656329747749242,"28":-2.9771464926338203,"29":-4.127290374033616,"30":24.556175038776555,"31":-1.4006846992320712,"32":-4.3356673001156265,"33":11.706585923001906,"34":-1.4421387132394705,"35":-1.0707664087863853,"36":8.08332644918023,"37":-2.1088005565669024,"38":0.5034728590779424,"39":41.99307433569156,"40":-17.183086741239467,"41":15.076728793846902,"42":-6.048642698105384,"43":-3.3402538326488878,"44":14.950876868095913,"45":3.8448432317152843,"46":-4.61784587048146,"47":2.059115670775605,"48":-26.233552092539433,"49":7.079217176856089,"50":13.38244910156796,"51":0.8123660990881924,"52":-21.08149563512468,"53":-3.332182848820277,"54":2.9206614696340534,"55":0.2996209151795605,"56":-4.9708403525793114,"57":-1.3024869620040775,"58":29.407464109099326,"59":-0.3397426781926185,"60":-12.652453114515138,"61":-2.4511858616131605,"62":33.57873072699878,"63":-3.750387200768146,"64":5.303119666975166,"65":-4.022863132066172,"66":9.482470591274755,"67":20.86094511497235,"68":5.594471647723969,"69":1.5565216687720316,"70":-19.385152439175435,"71":-3.7454951718006155,"72":23.825455655475356,"73":-20.65882184548703,"74":-10.964646112030733,"75":6.7100087648307625,"76":-0.13886151150387877,"77":-17.958359798340233,"78":-38.55343790099677,"79":-1.365705389026207,"80":4.667012746236245,"81":-0.17804540732907612,"82":13.997777973506642,"83":0.5295207562806364,"84":13.451309020831294,"85":-8.52025266394587,"86":-2.13628383199106,"87":-3.463125256143969,"88":-1.908101749904369,"89":-13.72942384760133,"90":-0.11536553071428508,"91":-25.8503558261159,"92":16.38295532333546,"93":9.790203568194206,"94":2.0702265225545395,"95":3.059781107747848,"96":4.369656249158885,"97":-2.342716756540958,"98":-4.285359081788802,"99":-5.148247581662839,"100":-0.6798862687839629,"101":5.677476098267602,"102":4.2154983401296935,"103":-8.488171967058445,"104":-4.849681190094611,"105":5.532335166895745,"106":10.433169316746447,"107":7.008856346185662,"108":0.10594248568397546,"109":-2.2513742162156047,"110":-1.4676653786067604,"111":5.092741788452376,"112":15.486566116502683,"113":0.23450843672111776,"114":0.617364404097242,"115":-2.674465621321539,"116":4.272822243469634,"117":1.111612230128105,"118":10.556223738711239,"119":19.947633145348995,"120":-1.5170990074434463,"121":-2.8090006119556965,"122":-6.65040734811224,"123":-0.4561280236106863,"124":2.648342998280031,"125":16.934726335230856,"126":0.9799679088254939,"127":-1.080337007803956,"128":-1.0545044132894836,"129":-3.7585255424092407,"130":21.09997137790609,"131":-0.7162743645737101,"132":-0.751433354390932,"133":-6.951132302619363,"134":-0.288358464464258,"135":1.1203976563260352,"136":8.983312103298694,"137":-2.9131442148524718,"138":-8.472479212358481,"139":-2.8315383439881225,"140":1.6979966640749202,"141":3.9384916360873503,"142":-4.055757858173906,"143":-0.02758945188375432,"144":0.6349102579453572,"145":0.33934212451070905,"146":7.580769342085077,"147":-3.657556530393422,"148":-20.674237168823655,"149":-31.419387450091097,"150":-9.942125639812934,"151":-0.4509321459065475,"152":-23.282124819129688,"153":0.09569495488735244,"154":-0.5943798222155954,"155":-1.6534191056827707,"156":-0.3501038304315847,"157":-1.7727072485259259,"158":3.184592839757826,"159":-0.04702988599656544,"160":-10.533842516286958,"161":-0.5119821226635214,"162":24.915500164529547,"163":0.902731731839914,"164":8.043485735636649,"165":8.948748661606402,"166":-16.559439967720376,"167":1.837172476359611,"168":5.677881589638654,"169":0.9921323562730425,"170":-11.631665993231085,"171":-1.1157291990836296,"172":10.563291676409557,"173":-2.939299927401789,"174":-5.20509252856605,"175":15.677889878704955,"176":-4.101760056784329,"177":-1.571739430885719,"178":9.93289496492617,"179":0.08484274499091413,"180":-21.42046183442766,"181":-0.7416057943049432,"182":4.393167698140199,"183":0.06112123733111949,"184":33.75242331671435,"185":6.522293465290098,"186":0.5999789710406478,"187":-4.312823437254028,"188":-0.5817900237584358,"189":-1.37906228997713,"190":3.5042510047418363,"191":-12.30881839325565,"192":18.67477064296009,"193":1.6676709470590791,"194":2.960978321020748,"195":3.4613200049433743,"196":-3.269369962081545,"197":-1.4322579445065655,"198":-0.25637759316880737,"199":-5.350287804571576,"200":0.4589117870505261,"201":18.124998964659653,"202":2.3425165491765783,"203":0.678034053615544,"204":-7.162714211808129,"205":13.209245467428547,"206":13.143707473449346,"207":-1.1100314202364034,"208":-0.16036145989242684,"209":-19.149258273575757,"210":2.483605965208698,"211":2.1364379258783672,"212":7.778139104830521,"213":-0.14691904076074055,"214":2.9806747355278316,"215":-7.9593226703554585,"216":-16.166239206619757,"217":3.252279832619357,"218":-0.07821246108059528,"219":41.41475796766189,"220":-13.577745682542512,"221":-6.406645236507469,"222":-0.6037614369926853,"223":0.8917809358559903,"224":14.303995129135044,"225":12.036376943749556,"226":-0.29870450196880194,"227":-1.1670114760096513,"228":-6.6425535869956445,"229":-10.758383136951029,"230":-6.4156582652584015,"231":32.26323673593565,"232":0.15014923088458187,"233":-1.139403867623954,"234":-0.0641059322598966,"235":21.53633861114642,"236":-4.071682049877595,"237":21.816927153310317,"238":-0.0749467319203486,"239":15.748306173472775,"240":3.5153031712184704,"241":16.727520704613447,"242":-0.014625389824587113,"243":-0.007998274677675034,"244":-0.20999155698417188,"245":-16.40370841609261,"246":0.20518254777992648,"247":18.555532060889465,"248":-17.507786728363143,"249":-34.409998091938355,"250":15.631985237108154,"251":-1.6664744270036091,"252":-24.061193217403986,"253":0.30986667354378317,"254":19.864523945371683,"255":0.5336984642484447,"256":15.944042214344014,"257":0.16053559129063497,"258":14.506879706177823,"259":-0.029384542173787505,"260":-23.599733487770663,"261":-0.5717508486877797,"262":15.722532462259784,"263":0.0928551509342895,"264":4.735157269643508,"265":-5.363002993804435,"266":-22.91051208201422,"267":17.002850381976803,"268":11.455135515268072,"269":1.801414722465198,"270":16.383974776675075,"271":-0.19060162673538608,"272":-6.697578872879812,"273":-0.7130431354989633,"274":-17.999827572340237,"275":15.739879488839646,"276":-0.5817425204905582,"277":-0.19907958777973142,"278":-17.160845534409678,"279":0.1725377761332387,"280":-2.101554177192352,"281":-16.030433777907326,"282":15.411692781092501,"283":-26.939182627655086,"284":34.75568142908835,"285":-29.79994892209851,"286":-0.04128142144035301,"287":-11.994027662654407,"288":-2.7975589521889077,"289":-27.260849444990658,"290":-27.04195850336988,"291":8.379906589073103,"292":21.52706045154655,"293":-1.1307407595526655,"294":10.12992916767783,"295":10.40253930895128,"296":-1.9592014115978207,"297":0.024629544355360987,"298":21.9361311209654,"299":-13.67406707136541,"300":2.5568377389430483,"301":-0.2409226792626988,"302":14.376228327299058,"303":11.192561946463575,"304":-9.509868543336207,"305":5.54294436142842,"306":7.459725917429472,"307":8.524945731982166,"308":1.2219669962623994,"309":0.8028701191269972,"310":7.008978587401883,"311":5.128025910993797,"312":8.167921074240668,"313":0.12459650029154036,"314":0.02905974578880249,"315":-13.07835543045725,"316":10.653521558168325,"317":34.61266313821847,"318":-5.45997026185817,"319":34.55823464413157,"320":-1.1688262338285293,"321":-19.341824950039182,"322":-11.172424210913391,"323":0.47057900959380516,"324":0.8064149740751023,"325":10.537878739654348,"326":0.9284164925039214,"327":-0.6077085681417915,"328":-0.046296541737133136,"329":-7.225683813120566,"330":5.588051272416584,"331":1.0343878207990076,"332":-0.016441291017433725,"333":18.03579240792582,"334":0.6374686203751488,"335":-1.662007977384878,"336":12.632822272172492,"337":1.506461915471755,"338":-0.17059149958645822,"339":17.165180651707864,"340":20.07839808473163,"341":1.100937719410597,"342":-2.4241615052482017,"343":-0.11790861268633701,"344":1.0513531178273074,"345":1.9528989926723928,"346":-5.695377116649983,"347":-1.7556693948554665,"348":-4.658041368007129,"349":-27.44574025589273,"350":-13.610782665328355,"351":0.8593951775456837,"352":-18.37241669952744,"353":1.3195674751776327,"354":0.9684790417108426,"355":0.8278798475100583,"356":2.4054573007957356,"357":-0.4266865710647263,"358":0.10617201366535833,"359":-3.644564491487431,"360":-12.178661455848527,"361":-1.6013016872566415,"362":14.277809713367025,"363":0.3087609294643237,"364":5.77175792445935,"365":-13.667356593818994,"366":-16.603410162387313,"367":10.838362278390203,"368":4.9923162970116755,"369":-5.025915054450952,"370":-0.8243144000765769,"371":-0.017055305779051018,"372":10.056009008763304,"373":-2.8161045015059107,"374":-9.244003578035416,"375":13.56717580621373,"376":-0.47534582651063345,"377":1.1848706290996567,"378":-10.625053056653092,"379":0.32007115600722025,"380":-1.8393117868989854,"381":-1.3691428525798168,"382":12.9393715185438,"383":1.0670545784962562,"384":24.32429864227732,"385":1.2630130265378436,"386":-4.44286548372713,"387":-4.428796526932928,"388":-0.8330408521183832,"389":-1.5440405810092306,"390":-3.2786923683686333,"391":9.437675424912829,"392":19.385412892682695,"393":20.628625781027544,"394":-0.8106187587395403,"395":7.782257640928603,"396":2.702097231120637,"397":-0.27193526883221963,"398":-0.4803618469836775,"399":-6.969902595246051}},"b2":{"n":4,"d":1,"w":{"0":-3.036042787427386,"1":-5.786585386428978,"2":-3.7198869575605618,"3":-3.8160866059236027}}}}
/* harmony export (immutable) */ __webpack_exports__["a"] = data;


/***/ }),
/* 28 */
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
/* 29 */
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
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__State__ = __webpack_require__(29);
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


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__renderer_HtmlTableRenderer__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__agent_ColumnCompare__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__agent_LookAheadWide__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__agent_LookAheadWideAndDeep__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__agent_AlwaysDown__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__agent_RL_DQN_5X5Viewport_In_Learning_Mode__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__agent_BarelyLookAhead__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__agent_RL_DQN_5X5Viewport_PreTrained__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__environment__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__GameRunner__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style_css__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__style_css__);











// import ReinforcementLearnerDeepQNetworkPreTrained from './agent/ReinforcementLearnerDeepQNetworkPreTrained'


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
    `<div id="agentRendererContainer">
    Deep Q-Network Stats:
    <div style="overflow: auto"><div style="float: left">w:&nbsp;</div> <div id="action0" style="background-color: lightgoldenrodyellow;"></div></div>
    <div style="overflow: auto"><div style="float: left">a:&nbsp;</div> <div id="action1" style="background-color: lightsalmon"></div></div>
    <div style="overflow: auto"><div style="float: left">s:&nbsp;</div> <div id="action2" style="background-color: lightskyblue"></div></div>
    <div style="overflow: auto"><div style="float: left">d:&nbsp;</div> <div id="action3" style="background-color: lightseagreen"></div></div>
        <div style="overflow: auto"><div style="float: left">random action&nbsp;</div> <div id="actionRandom" style="background-color: lightcoral;height: 1em"></div></div>
    </div>` +
    '<pre>' +
    '\nGame Rules:' +
    '\n- Gain ' + __WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].pointsForCompletion + ' points for making it to the bottom row' +
    '\n- Gain ' + __WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].verticalDeltaScore + ' points for every row lower you go' +
    '\n- Loose ' + __WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].verticalDeltaScore + ' points for every row higher you go' +
    '\n- Loose ' + -__WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].tileValueMap[1] + ' points when moving into a red square' +
    '\n- Loose ' + -__WEBPACK_IMPORTED_MODULE_8__environment__["a" /* config */].tileValueMap[0] + ' points when moving into a grey square' +
    '</pre>';
const scoreElement = document.getElementById('score');

let enableRendering = true;
let autoPlay = true;
let speed = 250;
let intervalReference = null;
let agent;
let currentAgentName;
let renderer = new __WEBPACK_IMPORTED_MODULE_0__renderer_HtmlTableRenderer__["a" /* default */](document.getElementById('rendererContainer'));

let gameRunner = new __WEBPACK_IMPORTED_MODULE_9__GameRunner__["a" /* default */](renderer, handleGameRunnerStatusChange);

let agents = {
    'RL_DQN_5X5Viewport_PreTrained - ranked 241': __WEBPACK_IMPORTED_MODULE_7__agent_RL_DQN_5X5Viewport_PreTrained__["a" /* default */],
    'RL_DQN_5X5Viewport_In_Learning_Mode': __WEBPACK_IMPORTED_MODULE_5__agent_RL_DQN_5X5Viewport_In_Learning_Mode__["a" /* default */],
    'LookAheadWideAndDeep - ranked 334': __WEBPACK_IMPORTED_MODULE_3__agent_LookAheadWideAndDeep__["a" /* default */],
    'LookAheadWide - ranked 330': __WEBPACK_IMPORTED_MODULE_2__agent_LookAheadWide__["a" /* default */],
    'ColumnCompare - ranked 308': __WEBPACK_IMPORTED_MODULE_1__agent_ColumnCompare__["a" /* default */],
    'BarelyLookAhead - ranked 292': __WEBPACK_IMPORTED_MODULE_6__agent_BarelyLookAhead__["a" /* default */],
    'AlwaysDown - ranked 180': __WEBPACK_IMPORTED_MODULE_4__agent_AlwaysDown__["a" /* default */],
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
    if (newEnableRenderingValue != enableRendering) {
        enableRendering = newEnableRenderingValue;
        newGame();
    }
    setupInterval();
});

function setupInterval() {
    clearInterval(intervalReference);
    if (autoPlay) {
        if (enableRendering) {
            intervalReference = setInterval(gameRunner.tick, speed);
        } else {
            //Normal ticking takes 3ms between ticks which is not fast enough, so tick 100 times
            intervalReference = setInterval(function () {
                for (let i = 0; i < 100; i++) {
                    gameRunner.tick();
                }
            }, 0);
        }
    }
}

document.body.addEventListener('keydown', function (event) {
    gameRunner.takeAction(event.key);
    // if (enableRendering) {
    //     const agentObservation = environment.getAgentObservation();
    //     renderer.render(agentObservation, environment.getGodObservation());
    // }
});

function newGame() {
    gameRunner.newGame(new agents[currentAgentName], enableRendering);
}

newGame();
setupInterval();


/***/ })
/******/ ]);