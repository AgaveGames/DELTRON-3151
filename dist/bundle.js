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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);

// import 'phaser/build/custom/pixi.js';
// import 'p2';
// import * as Phaser from 'phaser';
// var Phaser = require('phaser');
// uk

__webpack_require__(5);
__webpack_require__(7);
__webpack_require__(9);

var SCREEN_WIDTH = 960;
var SCREEN_HEIGHT = 640;

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'game');

var PhaserGame = function (game) {
  this.map = null;
  this.layer = null;
  this.hero = null;
  this.activeTile = null;
  this.gridsize = 32;
  this.marker = new Phaser.Point();
  this.attack = null;
  this.attacks = null;
  this.attackTime = null;
  this.statusMenu = null;
  // eventually load attributes from cached state
  this.heroAttributes = {
    speed: 300,
    health: 100,
    attack: 1,
    defense: 1,
    magic: 48
  };

  this.statusBar = {};
  this.statusBarDimensions = {};

  this.statusBarDimensions.width = this.gridsize * 5;
  this.statusBarDimensions.padding = this.gridsize;
  this.statusBarDimensions.x = SCREEN_WIDTH - this.statusBarDimensions.width + this.statusBarDimensions.padding;
  this.statusBarDimensions.y = this.statusBarDimensions.padding;
};

PhaserGame.prototype = {

  init: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.tilemap('map', 'assets/firstMap.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/tiles.png');
    this.load.image('attack', 'assets/attackArea3.png');
    this.load.spritesheet('ship', 'assets/UFO.png', this.gridsize, this.gridsize)
  },

  create: function () {

    // map
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('tiles', 'tiles');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.statusMenu = this.map.createLayer('Status Menu');
    this.map.setCollision(20, true, this.layer);


    // attack group
    this.attacks = this.add.sprite(null, null, 'attack');
    this.attacks.anchor.set(0.5)


    // hero
    this.hero = this.add.sprite(48, 48, 'ship');
    this.hero.anchor.set(0.5);
    this.hero.setHealth(this.heroAttributes.health);
    this.physics.arcade.enable(this.hero);
    this.hero.animations.add('spin', [0,1,2,3], 10, true);
    this.hero.animations.play('spin');

    //input object
    this.cursors = this.input.keyboard.createCursorKeys();

    var index = 0;
    for (var attribute in this.heroAttributes) {
      this.statusBar[attribute] = this.add.text(null, null, null, { fill: "#fff", fontSize: this.gridsize / 2 });

      // TODO: replace with spread operator once we support ES6
      // es6: const { x, y, width, height } = this.statusBar;
      var x = this.statusBarDimensions.x;
      var y = this.statusBarDimensions.y;
      var width = this.statusBarDimensions.width;
      var height = this.statusBarDimensions.height;

      this.statusBar[attribute].setTextBounds.apply(this.statusBar[attribute], [x, y, width, height])
      this.statusBar[attribute].top = index * this.gridsize / 2;
      
      index += 1;
    }

  },

  update: function () {
    this.physics.arcade.collide(this.hero, this.layer);

    // It would be nice if this could be conditionally performed
    for (var attribute in this.heroAttributes) {
      this.statusBar[attribute].setText(__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.capitalize(attribute)+": "+this.heroAttributes[attribute]);
    }

    this.marker.x = this.math.snapToFloor(Math.floor(this.hero.x), this.gridsize) / this.gridsize;
    this.marker.y = this.math.snapToFloor(Math.floor(this.hero.y), this.gridsize) / this.gridsize;
    this.activeTile = this.map.getTile(this.marker.x, this.marker.y, 'Tile Layer 1');

    this.hero.body.velocity.x = 0;
    this.hero.body.velocity.y = 0;

    if (this.cursors.left.isDown)
    {
      this.hero.body.velocity.x = -this.heroAttributes.speed;
    }
    if (this.cursors.right.isDown)
    {
      this.hero.body.velocity.x = this.heroAttributes.speed;
    }
    if (this.cursors.up.isDown)
    {
      this.hero.body.velocity.y = -this.heroAttributes.speed;
    }
    if (this.cursors.down.isDown)
    {
      this.hero.body.velocity.y = this.heroAttributes.speed;
    }
    if (this.input.keyboard.isDown(16))
    {
      this.attackArea();
    }

    this.resetAttack();


  },

  render: function () {
    //this.game.debug.geom(new Phaser.Rectangle(this.activeTile.worldX, this.activeTile.worldY, 32, 32), '#ffff00', false);
    //console.log(this.activeTile.x)
  },    

  attackArea: function () {
    if (this.time.now > this.attackTime)
    {

      if (this.attacks)
      {
        //  And fire it
        this.attacks.reset(this.activeTile.worldX+16, this.activeTile.worldY+16);
        this.attackTime = this.time.now + 1500;
        // example side effects for debugging purposes
        this.heroAttributes.speed -= 10;
        this.heroAttributes.health -= 3;
      }
    }
  },

  resetAttack: function () {
    if (this.attacks && this.time.now > this.attackTime-100)
    {
      this.attacks.kill();
      this.attacks.alpha = 1;
    }
    else
    {
      if (this.attacks.alpha >= .015)
      {
        this.attacks.alpha -= .015;
      }
    }
  }

}

game.state.add('Game', PhaserGame, true);



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.4';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      reLeadingDot = /^\./,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g,
      reTrimStart = /^\s+/,
      reTrimEnd = /\s+$/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)',
      rsOrdUpper = '\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */
  function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }

  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */
  function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
  }

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        if (isObject(srcValue)) {
          stack || (stack = new Stack);
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(object[key], srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = object[key],
          srcValue = source[key],
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      var index = -1;
      iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array == null ? 0 : array.length,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor);
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (reLeadingDot.test(string)) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            result = wait - timeSinceLastCall;

        return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(args) {
      args.push(undefined, customDefaultsAssignIn);
      return apply(assignInWith, undefined, args);
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrim, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimEnd, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = (lodashFunc.name + ''),
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (true) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = _)._ = _;
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(4)(module)))

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0)(__webpack_require__(6))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "/**\n* @author       Richard Davey <rich@photonstorm.com>\n* @copyright    2016 Photon Storm Ltd.\n* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}\n*\n* @overview\n*\n* Phaser - http://phaser.io\n*\n* v2.6.2 \"Kore Springs\" - Built: Fri Aug 26 2016 01:03:18\n*\n* By Richard Davey http://www.photonstorm.com @photonstorm\n*\n* Phaser is a fun, free and fast 2D game framework for making HTML5 games\n* for desktop and mobile web browsers, supporting Canvas and WebGL rendering.\n*\n* Phaser uses Pixi.js for rendering, created by Mat Groves http://matgroves.com @Doormat23\n* Phaser uses p2.js for full-body physics, created by Stefan Hedman https://github.com/schteppe/p2.js @schteppe\n* Phaser contains a port of N+ Physics, converted by Richard Davey, original by http://www.metanetsoftware.com\n*\n* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel, from which both Phaser and my love of framework development originate.\n*\n* Follow development at http://phaser.io and on our forum\n*\n* \"If you want your children to be intelligent,  read them fairy tales.\"\n* \"If you want them to be more intelligent, read them more fairy tales.\"\n*                                                     -- Albert Einstein\n*/\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n(function(){\n\n    var root = this;\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * The [pixi.js](http://www.pixijs.com/) module/namespace.\n *\n * @module PIXI\n */\n \n/**\n * Namespace-class for [pixi.js](http://www.pixijs.com/).\n *\n * Contains assorted static properties and enumerations.\n *\n * @class PIXI\n * @static\n */\nvar PIXI = PIXI || {};\n\n/**\n * A reference to the Phaser Game instance that owns this Pixi renderer.\n * @property {Phaser.Game} game\n * @static \n */\nPIXI.game = null;\n\n/**\n * @property {Number} WEBGL_RENDERER\n * @protected\n * @static \n */\nPIXI.WEBGL_RENDERER = 0;\n\n/**\n * @property {Number} CANVAS_RENDERER\n * @protected\n * @static\n */\nPIXI.CANVAS_RENDERER = 1;\n\n/**\n * Version of pixi that is loaded.\n * @property {String} VERSION\n * @static \n */\nPIXI.VERSION = \"v2.2.9\";\n\n// used to create uids for various pixi objects.\nPIXI._UID = 0;\n\nif (typeof(Float32Array) != 'undefined')\n{\n    PIXI.Float32Array = Float32Array;\n    PIXI.Uint16Array = Uint16Array;\n\n    // Uint32Array and ArrayBuffer only used by WebGL renderer\n    // We can suppose that if WebGL is supported then typed arrays are supported too\n    // as they predate WebGL support for all browsers:\n    // see typed arrays support: http://caniuse.com/#search=TypedArrays\n    // see WebGL support: http://caniuse.com/#search=WebGL\n    PIXI.Uint32Array = Uint32Array;\n    PIXI.ArrayBuffer = ArrayBuffer;\n}\nelse\n{\n    PIXI.Float32Array = Array;\n    PIXI.Uint16Array = Array;\n}\n\n/**\n * @property {Number} PI_2\n * @static\n */\nPIXI.PI_2 = Math.PI * 2;\n\n/**\n * @property {Number} RAD_TO_DEG\n * @static\n */\nPIXI.RAD_TO_DEG = 180 / Math.PI;\n\n/**\n * @property {Number} DEG_TO_RAD\n * @static\n */\nPIXI.DEG_TO_RAD = Math.PI / 180;\n\n/**\n * @property {String} RETINA_PREFIX\n * @protected\n * @static\n */\nPIXI.RETINA_PREFIX = \"@2x\";\n\n/**\n * The default render options if none are supplied to\n * {{#crossLink \"WebGLRenderer\"}}{{/crossLink}} or {{#crossLink \"CanvasRenderer\"}}{{/crossLink}}.\n *\n * @property {Object} defaultRenderOptions\n * @property {Object} defaultRenderOptions.view=null\n * @property {Boolean} defaultRenderOptions.transparent=false\n * @property {Boolean} defaultRenderOptions.antialias=false\n * @property {Boolean} defaultRenderOptions.preserveDrawingBuffer=false\n * @property {Number} defaultRenderOptions.resolution=1\n * @property {Boolean} defaultRenderOptions.clearBeforeRender=true\n * @property {Boolean} defaultRenderOptions.autoResize=false\n * @static\nPIXI.defaultRenderOptions = {\n    view: null,\n    transparent: false,\n    antialias: false, \n    preserveDrawingBuffer: false,\n    resolution: 1,\n    clearBeforeRender: true,\n    autoResize: false\n};\n */\n\n/**\n* @author       Mat Groves http://matgroves.com @Doormat23\n* @author       Richard Davey <rich@photonstorm.com>\n* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}\n*/\n\n/**\n* The base class for all objects that are rendered. Contains properties for position, scaling,\n* rotation, masks and cache handling.\n* \n* This is an abstract class and should not be used on its own, rather it should be extended.\n*\n* It is used internally by the likes of PIXI.Sprite.\n*\n* @class PIXI.DisplayObject\n* @constructor\n*/\nPIXI.DisplayObject = function () {\n\n    /**\n    * The coordinates, in pixels, of this DisplayObject, relative to its parent container.\n    * \n    * The value of this property does not reflect any positioning happening further up the display list.\n    * To obtain that value please see the `worldPosition` property.\n    * \n    * @property {PIXI.Point} position\n    * @default\n    */\n    this.position = new PIXI.Point(0, 0);\n\n    /**\n    * The scale of this DisplayObject. A scale of 1:1 represents the DisplayObject\n    * at its default size. A value of 0.5 would scale this DisplayObject by half, and so on.\n    * \n    * The value of this property does not reflect any scaling happening further up the display list.\n    * To obtain that value please see the `worldScale` property.\n    * \n    * @property {PIXI.Point} scale\n    * @default\n    */\n    this.scale = new PIXI.Point(1, 1);\n\n    /**\n    * The pivot point of this DisplayObject that it rotates around. The values are expressed\n    * in pixel values.\n    * @property {PIXI.Point} pivot\n    * @default\n    */\n    this.pivot = new PIXI.Point(0, 0);\n\n    /**\n    * The rotation of this DisplayObject. The value is given, and expressed, in radians, and is based on\n    * a right-handed orientation.\n    * \n    * The value of this property does not reflect any rotation happening further up the display list.\n    * To obtain that value please see the `worldRotation` property.\n    * \n    * @property {number} rotation\n    * @default\n    */\n    this.rotation = 0;\n\n    /**\n    * The alpha value of this DisplayObject. A value of 1 is fully opaque. A value of 0 is transparent.\n    * Please note that an object with an alpha value of 0 is skipped during the render pass.\n    * \n    * The value of this property does not reflect any alpha values set further up the display list.\n    * To obtain that value please see the `worldAlpha` property.\n    * \n    * @property {number} alpha\n    * @default\n    */\n    this.alpha = 1;\n\n    /**\n    * The visibility of this DisplayObject. A value of `false` makes the object invisible.\n    * A value of `true` makes it visible. Please note that an object with a visible value of\n    * `false` is skipped during the render pass. Equally a DisplayObject with visible false will\n    * not render any of its children.\n    * \n    * The value of this property does not reflect any visible values set further up the display list.\n    * To obtain that value please see the `worldVisible` property.\n    * \n    * @property {boolean} visible\n    * @default\n    */\n    this.visible = true;\n\n    /**\n     * This is the defined area that will pick up mouse / touch events. It is null by default.\n     * Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)\n     *\n     * @property hitArea\n     * @type Rectangle|Circle|Ellipse|Polygon\n     */\n    this.hitArea = null;\n\n    /**\n    * Should this DisplayObject be rendered by the renderer? An object with a renderable value of\n    * `false` is skipped during the render pass.\n    * \n    * @property {boolean} renderable\n    * @default\n    */\n    this.renderable = false;\n\n    /**\n    * The parent DisplayObjectContainer that this DisplayObject is a child of.\n    * All DisplayObjects must belong to a parent in order to be rendered.\n    * The root parent is the Stage object. This property is set automatically when the\n    * DisplayObject is added to, or removed from, a DisplayObjectContainer.\n    * \n    * @property {PIXI.DisplayObjectContainer} parent\n    * @default\n    * @readOnly\n    */\n    this.parent = null;\n\n    /**\n    * The multiplied alpha value of this DisplayObject. A value of 1 is fully opaque. A value of 0 is transparent.\n    * This value is the calculated total, based on the alpha values of all parents of this DisplayObjects \n    * in the display list.\n    * \n    * To obtain, and set, the local alpha value, see the `alpha` property.\n    *\n    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until \n    * that happens this property will contain values based on the previous frame. Be mindful of this if\n    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.\n    * \n    * @property {number} worldAlpha\n    * @readOnly\n    */\n    this.worldAlpha = 1;\n\n    /**\n    * The current transform of this DisplayObject.\n    * \n    * This property contains the calculated total, based on the transforms of all parents of this \n    * DisplayObject in the display list.\n    *\n    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until \n    * that happens this property will contain values based on the previous frame. Be mindful of this if\n    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.\n    *\n    * @property {PIXI.Matrix} worldTransform\n    * @readOnly\n    */\n    this.worldTransform = new PIXI.Matrix();\n\n    /**\n    * The coordinates, in pixels, of this DisplayObject within the world.\n    * \n    * This property contains the calculated total, based on the positions of all parents of this \n    * DisplayObject in the display list.\n    *\n    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until \n    * that happens this property will contain values based on the previous frame. Be mindful of this if\n    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.\n    * \n    * @property {PIXI.Point} worldPosition\n    * @readOnly\n    */\n    this.worldPosition = new PIXI.Point(0, 0);\n\n    /**\n    * The global scale of this DisplayObject.\n    * \n    * This property contains the calculated total, based on the scales of all parents of this \n    * DisplayObject in the display list.\n    *\n    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until \n    * that happens this property will contain values based on the previous frame. Be mindful of this if\n    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.\n    * \n    * @property {PIXI.Point} worldScale\n    * @readOnly\n    */\n    this.worldScale = new PIXI.Point(1, 1);\n\n    /**\n    * The rotation, in radians, of this DisplayObject.\n    * \n    * This property contains the calculated total, based on the rotations of all parents of this \n    * DisplayObject in the display list.\n    *\n    * Note: This property is only updated at the end of the `updateTransform` call, once per render. Until \n    * that happens this property will contain values based on the previous frame. Be mindful of this if\n    * accessing this property outside of the normal game flow, i.e. from an asynchronous event callback.\n    * \n    * @property {number} worldRotation\n    * @readOnly\n    */\n    this.worldRotation = 0;\n\n    /**\n    * The rectangular area used by filters when rendering a shader for this DisplayObject.\n    *\n    * @property {PIXI.Rectangle} filterArea\n    * @type Rectangle\n    * @default\n    */\n    this.filterArea = null;\n\n    /**\n    * @property {number} _sr - Cached rotation value.\n    * @private\n    */\n    this._sr = 0;\n\n    /**\n    * @property {number} _cr - Cached rotation value.\n    * @private\n    */\n    this._cr = 1;\n\n    /**\n    * @property {PIXI.Rectangle} _bounds - The cached bounds of this object.\n    * @private\n    */\n    this._bounds = new PIXI.Rectangle(0, 0, 0, 0);\n\n    /**\n    * @property {PIXI.Rectangle} _currentBounds - The most recently calculated bounds of this object.\n    * @private\n    */\n    this._currentBounds = null;\n\n    /**\n    * @property {PIXI.Rectangle} _mask - The cached mask of this object.\n    * @private\n    */\n    this._mask = null;\n\n    /**\n    * @property {boolean} _cacheAsBitmap - Internal cache as bitmap flag.\n    * @private\n    */\n    this._cacheAsBitmap = false;\n\n    /**\n    * @property {boolean} _cacheIsDirty - Internal dirty cache flag.\n    * @private\n    */\n    this._cacheIsDirty = false;\n\n};\n\nPIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;\n\nPIXI.DisplayObject.prototype = {\n\n    /**\n    * Destroy this DisplayObject.\n    *\n    * Removes any cached sprites, sets renderable flag to false, and nulls filters, bounds and mask.\n    *\n    * Also iteratively calls `destroy` on any children.\n    *\n    * @method PIXI.DisplayObject#destroy\n    */\n    destroy: function () {\n\n        if (this.children)\n        {\n            var i = this.children.length;\n\n            while (i--)\n            {\n                this.children[i].destroy();\n            }\n\n            this.children = [];\n        }\n\n        this.hitArea = null;\n        this.parent = null;\n        this.worldTransform = null;\n        this.filterArea = null;\n        this.renderable = false;\n\n        this._bounds = null;\n        this._currentBounds = null;\n        this._mask = null;\n\n        this._destroyCachedSprite();\n\n    },\n\n    /*\n    * Updates the transform matrix this DisplayObject uses for rendering.\n    *\n    * If the object has no parent, and no parent parameter is provided, it will default to \n    * Phaser.Game.World as the parent transform to use. If that is unavailable the transform fails to take place.\n    *\n    * The `parent` parameter has priority over the actual parent. Use it as a parent override.\n    * Setting it does **not** change the actual parent of this DisplayObject.\n    *\n    * Calling this method updates the `worldTransform`, `worldAlpha`, `worldPosition`, `worldScale` \n    * and `worldRotation` properties.\n    *\n    * If a `transformCallback` has been specified, it is called at the end of this method, and is passed\n    * the new, updated, worldTransform property, along with the parent transform used.\n    *\n    * @method PIXI.DisplayObject#updateTransform\n    * @param {PIXI.DisplayObjectContainer} [parent] - Optional parent to calculate this DisplayObjects transform from.\n    * @return {PIXI.DisplayObject} - A reference to this DisplayObject.\n    */\n    updateTransform: function (parent) {\n\n        if (!parent && !this.parent && !this.game)\n        {\n            return this;\n        }\n\n        var p = this.parent;\n\n        if (parent)\n        {\n            p = parent;\n        }\n        else if (!this.parent)\n        {\n            p = this.game.world;\n        }\n\n        // create some matrix refs for easy access\n        var pt = p.worldTransform;\n        var wt = this.worldTransform;\n\n        // temporary matrix variables\n        var a, b, c, d, tx, ty;\n\n        // so if rotation is between 0 then we can simplify the multiplication process..\n        if (this.rotation % PIXI.PI_2)\n        {\n            // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes\n            if (this.rotation !== this.rotationCache)\n            {\n                this.rotationCache = this.rotation;\n                this._sr = Math.sin(this.rotation);\n                this._cr = Math.cos(this.rotation);\n            }\n\n            // get the matrix values of the displayobject based on its transform properties..\n            a  =  this._cr * this.scale.x;\n            b  =  this._sr * this.scale.x;\n            c  = -this._sr * this.scale.y;\n            d  =  this._cr * this.scale.y;\n            tx =  this.position.x;\n            ty =  this.position.y;\n            \n            // check for pivot.. not often used so geared towards that fact!\n            if (this.pivot.x || this.pivot.y)\n            {\n                tx -= this.pivot.x * a + this.pivot.y * c;\n                ty -= this.pivot.x * b + this.pivot.y * d;\n            }\n\n            // concat the parent matrix with the objects transform.\n            wt.a  = a  * pt.a + b  * pt.c;\n            wt.b  = a  * pt.b + b  * pt.d;\n            wt.c  = c  * pt.a + d  * pt.c;\n            wt.d  = c  * pt.b + d  * pt.d;\n            wt.tx = tx * pt.a + ty * pt.c + pt.tx;\n            wt.ty = tx * pt.b + ty * pt.d + pt.ty;\n        }\n        else\n        {\n            // lets do the fast version as we know there is no rotation..\n            a  = this.scale.x;\n            d  = this.scale.y;\n\n            tx = this.position.x - this.pivot.x * a;\n            ty = this.position.y - this.pivot.y * d;\n\n            wt.a  = a  * pt.a;\n            wt.b  = a  * pt.b;\n            wt.c  = d  * pt.c;\n            wt.d  = d  * pt.d;\n            wt.tx = tx * pt.a + ty * pt.c + pt.tx;\n            wt.ty = tx * pt.b + ty * pt.d + pt.ty;\n        }\n\n        //  Set the World values\n        this.worldAlpha = this.alpha * p.worldAlpha;\n        this.worldPosition.set(wt.tx, wt.ty);\n        this.worldScale.set(this.scale.x * Math.sqrt(wt.a * wt.a + wt.c * wt.c), this.scale.y * Math.sqrt(wt.b * wt.b + wt.d * wt.d));\n        this.worldRotation = Math.atan2(-wt.c, wt.d);\n\n        // reset the bounds each time this is called!\n        this._currentBounds = null;\n\n        //  Custom callback?\n        if (this.transformCallback)\n        {\n            this.transformCallback.call(this.transformCallbackContext, wt, pt);\n        }\n\n        return this;\n\n    },\n\n    /**\n    * To be overridden by classes that require it.\n    *\n    * @method PIXI.DisplayObject#preUpdate\n    */\n    preUpdate: function () {\n\n    },\n\n    /**\n    * Generates a RenderTexture based on this DisplayObject, which can they be used to texture other Sprites.\n    * This can be useful if your DisplayObject is static, or complicated, and needs to be reused multiple times.\n    *\n    * Please note that no garbage collection takes place on old textures. It is up to you to destroy old textures,\n    * and references to them, so they don't linger in memory.\n    *\n    * @method PIXI.DisplayObject#generateTexture\n    * @param {number} [resolution=1] - The resolution of the texture being generated.\n    * @param {number} [scaleMode=PIXI.scaleModes.DEFAULT] - See {{#crossLink \"PIXI/scaleModes:property\"}}PIXI.scaleModes{{/crossLink}} for possible values.\n    * @param {PIXI.CanvasRenderer|PIXI.WebGLRenderer} renderer - The renderer used to generate the texture.\n    * @return {PIXI.RenderTexture} - A RenderTexture containing an image of this DisplayObject at the time it was invoked.\n    */\n    generateTexture: function (resolution, scaleMode, renderer) {\n\n        var bounds = this.getLocalBounds();\n\n        var renderTexture = new PIXI.RenderTexture(bounds.width | 0, bounds.height | 0, renderer, scaleMode, resolution);\n        \n        PIXI.DisplayObject._tempMatrix.tx = -bounds.x;\n        PIXI.DisplayObject._tempMatrix.ty = -bounds.y;\n        \n        renderTexture.render(this, PIXI.DisplayObject._tempMatrix);\n\n        return renderTexture;\n\n    },\n\n    /**\n    * If this DisplayObject has a cached Sprite, this method generates and updates it.\n    *\n    * @method PIXI.DisplayObject#updateCache\n    * @return {PIXI.DisplayObject} - A reference to this DisplayObject.\n    */\n    updateCache: function () {\n\n        this._generateCachedSprite();\n\n        return this;\n\n    },\n\n    /**\n    * Calculates the global position of this DisplayObject, based on the position given.\n    *\n    * @method PIXI.DisplayObject#toGlobal\n    * @param {PIXI.Point} position - The global position to calculate from.\n    * @return {PIXI.Point} - A point object representing the position of this DisplayObject based on the global position given.\n    */\n    toGlobal: function (position) {\n\n        this.updateTransform();\n\n        return this.worldTransform.apply(position);\n\n    },\n\n    /**\n    * Calculates the local position of this DisplayObject, relative to another point.\n    *\n    * @method PIXI.DisplayObject#toLocal\n    * @param {PIXI.Point} position - The world origin to calculate from.\n    * @param {PIXI.DisplayObject} [from] - An optional DisplayObject to calculate the global position from.\n    * @return {PIXI.Point} - A point object representing the position of this DisplayObject based on the global position given.\n    */\n    toLocal: function (position, from) {\n\n        if (from)\n        {\n            position = from.toGlobal(position);\n        }\n\n        this.updateTransform();\n\n        return this.worldTransform.applyInverse(position);\n\n    },\n\n    /**\n    * Internal method.\n    *\n    * @method PIXI.DisplayObject#_renderCachedSprite\n    * @private\n    * @param {Object} renderSession - The render session\n    */\n    _renderCachedSprite: function (renderSession) {\n\n        this._cachedSprite.worldAlpha = this.worldAlpha;\n\n        if (renderSession.gl)\n        {\n            PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, renderSession);\n        }\n        else\n        {\n            PIXI.Sprite.prototype._renderCanvas.call(this._cachedSprite, renderSession);\n        }\n\n    },\n\n    /**\n    * Internal method.\n    *\n    * @method PIXI.DisplayObject#_generateCachedSprite\n    * @private\n    */\n    _generateCachedSprite: function () {\n\n        this._cacheAsBitmap = false;\n\n        var bounds = this.getLocalBounds();\n\n        //  Round it off and force non-zero dimensions\n        bounds.width = Math.max(1, Math.ceil(bounds.width));\n        bounds.height = Math.max(1, Math.ceil(bounds.height));\n\n        this.updateTransform();\n\n        if (!this._cachedSprite)\n        {\n            var renderTexture = new PIXI.RenderTexture(bounds.width, bounds.height);\n            this._cachedSprite = new PIXI.Sprite(renderTexture);\n            this._cachedSprite.worldTransform = this.worldTransform;\n        }\n        else\n        {\n            this._cachedSprite.texture.resize(bounds.width, bounds.height);\n        }\n\n        //  Remove filters\n        var tempFilters = this._filters;\n\n        this._filters = null;\n        this._cachedSprite.filters = tempFilters;\n\n        PIXI.DisplayObject._tempMatrix.tx = -bounds.x;\n        PIXI.DisplayObject._tempMatrix.ty = -bounds.y;\n\n        this._cachedSprite.texture.render(this, PIXI.DisplayObject._tempMatrix, true);\n        this._cachedSprite.anchor.x = -(bounds.x / bounds.width);\n        this._cachedSprite.anchor.y = -(bounds.y / bounds.height);\n\n        this._filters = tempFilters;\n\n        this._cacheAsBitmap = true;\n\n    },\n\n    /**\n    * Destroys a cached Sprite.\n    *\n    * @method PIXI.DisplayObject#_destroyCachedSprite\n    * @private\n    */\n    _destroyCachedSprite: function () {\n\n        if (!this._cachedSprite)\n        {\n            return;\n        }\n\n        this._cachedSprite.texture.destroy(true);\n\n        this._cachedSprite = null;\n\n    }\n\n};\n\n//  Alias for updateTransform. As used in DisplayObject container, etc.\nPIXI.DisplayObject.prototype.displayObjectUpdateTransform = PIXI.DisplayObject.prototype.updateTransform;\n\nObject.defineProperties(PIXI.DisplayObject.prototype, {\n\n    /**\n    * The horizontal position of the DisplayObject, in pixels, relative to its parent.\n    * If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.\n    * @name PIXI.DisplayObject#x\n    * @property {number} x - The horizontal position of the DisplayObject, in pixels, relative to its parent.\n    */\n    'x': {\n\n        get: function () {\n\n            return this.position.x;\n\n        },\n\n        set: function (value) {\n\n            this.position.x = value;\n\n        }\n\n    },\n\n    /**\n    * The vertical position of the DisplayObject, in pixels, relative to its parent.\n    * If you need the world position of the DisplayObject, use `DisplayObject.worldPosition` instead.\n    * @name PIXI.DisplayObject#y\n    * @property {number} y - The vertical position of the DisplayObject, in pixels, relative to its parent.\n    */\n    'y': {\n\n        get: function () {\n\n            return this.position.y;\n\n        },\n\n        set: function (value) {\n\n            this.position.y = value;\n\n        }\n\n    },\n\n    /**\n    * Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.\n    * @name PIXI.DisplayObject#worldVisible\n    * @property {boolean} worldVisible - Indicates if this DisplayObject is visible, based on it, and all of its parents, `visible` property values.\n    */\n    'worldVisible': {\n\n        get: function () {\n\n            if (!this.visible)\n            {\n                return false;\n            }\n            else\n            {\n                var item = this.parent;\n\n                if (!item)\n                {\n                    return this.visible;\n                }\n                else\n                {\n                    do\n                    {\n                        if (!item.visible)\n                        {\n                            return false;\n                        }\n\n                        item = item.parent;\n                    }\n                    while (item);\n\n                }\n\n                return true;\n            }\n\n        }\n\n    },\n\n    /**\n    * Sets a mask for this DisplayObject. A mask is an instance of a Graphics object.\n    * When applied it limits the visible area of this DisplayObject to the shape of the mask.\n    * Under a Canvas renderer it uses shape clipping. Under a WebGL renderer it uses a Stencil Buffer.\n    * To remove a mask, set this property to `null`.\n    * \n    * @name PIXI.DisplayObject#mask\n    * @property {PIXI.Graphics} mask - The mask applied to this DisplayObject. Set to `null` to remove an existing mask.\n    */\n    'mask': {\n\n        get: function () {\n\n            return this._mask;\n\n        },\n\n        set: function (value) {\n\n            if (this._mask)\n            {\n                this._mask.isMask = false;\n            }\n\n            this._mask = value;\n\n            if (value)\n            {\n                this._mask.isMask = true;\n            }\n\n        }\n\n    },\n\n    /**\n    * Sets the filters for this DisplayObject. This is a WebGL only feature, and is ignored by the Canvas\n    * Renderer. A filter is a shader applied to this DisplayObject. You can modify the placement of the filter\n    * using `DisplayObject.filterArea`.\n    * \n    * To remove filters, set this property to `null`.\n    *\n    * Note: You cannot have a filter set, and a MULTIPLY Blend Mode active, at the same time. Setting a \n    * filter will reset this DisplayObjects blend mode to NORMAL.\n    * \n    * @name PIXI.DisplayObject#filters\n    * @property {Array} filters - An Array of PIXI.AbstractFilter objects, or objects that extend them.\n    */\n    'filters': {\n\n        get: function () {\n\n            return this._filters;\n\n        },\n\n        set: function (value) {\n\n            if (Array.isArray(value))\n            {\n                //  Put all the passes in one place.\n                var passes = [];\n\n                for (var i = 0; i < value.length; i++)\n                {\n                    var filterPasses = value[i].passes;\n\n                    for (var j = 0; j < filterPasses.length; j++)\n                    {\n                        passes.push(filterPasses[j]);\n                    }\n                }\n\n                //  Needed any more?\n                this._filterBlock = { target: this, filterPasses: passes };\n            }\n\n            this._filters = value;\n\n            if (this.blendMode && this.blendMode === PIXI.blendModes.MULTIPLY)\n            {\n                this.blendMode = PIXI.blendModes.NORMAL;\n            }\n\n        }\n\n    },\n\n    /**\n    * Sets if this DisplayObject should be cached as a bitmap.\n    *\n    * When invoked it will take a snapshot of the DisplayObject, as it is at that moment, and store it \n    * in a RenderTexture. This is then used whenever this DisplayObject is rendered. It can provide a\n    * performance benefit for complex, but static, DisplayObjects. I.e. those with lots of children.\n    *\n    * Cached Bitmaps do not track their parents. If you update a property of this DisplayObject, it will not\n    * re-generate the cached bitmap automatically. To do that you need to call `DisplayObject.updateCache`.\n    * \n    * To remove a cached bitmap, set this property to `null`.\n    * \n    * @name PIXI.DisplayObject#cacheAsBitmap\n    * @property {boolean} cacheAsBitmap - Cache this DisplayObject as a Bitmap. Set to `null` to remove an existing cached bitmap.\n    */\n    'cacheAsBitmap': {\n\n        get: function () {\n\n            return this._cacheAsBitmap;\n\n        },\n\n        set: function (value) {\n\n            if (this._cacheAsBitmap === value)\n            {\n                return;\n            }\n\n            if (value)\n            {\n                this._generateCachedSprite();\n            }\n            else\n            {\n                this._destroyCachedSprite();\n            }\n\n            this._cacheAsBitmap = value;\n\n        }\n\n    }\n\n});\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * A DisplayObjectContainer represents a collection of display objects.\n * It is the base class of all display objects that act as a container for other objects.\n *\n * @class DisplayObjectContainer\n * @extends DisplayObject\n * @constructor\n */\nPIXI.DisplayObjectContainer = function () {\n\n    PIXI.DisplayObject.call(this);\n\n    /**\n     * [read-only] The array of children of this container.\n     *\n     * @property children\n     * @type Array(DisplayObject)\n     * @readOnly\n     */\n    this.children = [];\n\n    /**\n    * If `ignoreChildInput`  is `false` it will allow this objects _children_ to be considered as valid for Input events.\n    * \n    * If this property is `true` then the children will _not_ be considered as valid for Input events.\n    * \n    * Note that this property isn't recursive: only immediate children are influenced, it doesn't scan further down.\n    * @property {boolean} ignoreChildInput\n    * @default\n    */\n    this.ignoreChildInput = false;\n    \n};\n\nPIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );\nPIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;\n\n/**\n * Adds a child to the container.\n *\n * @method addChild\n * @param child {DisplayObject} The DisplayObject to add to the container\n * @return {DisplayObject} The child that was added.\n */\nPIXI.DisplayObjectContainer.prototype.addChild = function (child) {\n\n    return this.addChildAt(child, this.children.length);\n\n};\n\n/**\n * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown\n *\n * @method addChildAt\n * @param child {DisplayObject} The child to add\n * @param index {Number} The index to place the child in\n * @return {DisplayObject} The child that was added.\n */\nPIXI.DisplayObjectContainer.prototype.addChildAt = function (child, index) {\n\n    if (index >= 0 && index <= this.children.length)\n    {\n        if (child.parent)\n        {\n            child.parent.removeChild(child);\n        }\n\n        child.parent = this;\n\n        this.children.splice(index, 0, child);\n\n        return child;\n    }\n    else\n    {\n        throw new Error(child + 'addChildAt: The index '+ index +' supplied is out of bounds ' + this.children.length);\n    }\n\n};\n\n/**\n * Swaps the position of 2 Display Objects within this container.\n *\n * @method swapChildren\n * @param child {DisplayObject}\n * @param child2 {DisplayObject}\n */\nPIXI.DisplayObjectContainer.prototype.swapChildren = function (child, child2) {\n\n    if (child === child2)\n    {\n        return;\n    }\n\n    var index1 = this.getChildIndex(child);\n    var index2 = this.getChildIndex(child2);\n\n    if (index1 < 0 || index2 < 0)\n    {\n        throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');\n    }\n\n    this.children[index1] = child2;\n    this.children[index2] = child;\n\n};\n\n/**\n * Returns the index position of a child DisplayObject instance\n *\n * @method getChildIndex\n * @param child {DisplayObject} The DisplayObject instance to identify\n * @return {Number} The index position of the child display object to identify\n */\nPIXI.DisplayObjectContainer.prototype.getChildIndex = function (child) {\n\n    var index = this.children.indexOf(child);\n\n    if (index === -1)\n    {\n        throw new Error('The supplied DisplayObject must be a child of the caller');\n    }\n\n    return index;\n\n};\n\n/**\n * Changes the position of an existing child in the display object container\n *\n * @method setChildIndex\n * @param child {DisplayObject} The child DisplayObject instance for which you want to change the index number\n * @param index {Number} The resulting index number for the child display object\n */\nPIXI.DisplayObjectContainer.prototype.setChildIndex = function (child, index) {\n\n    if (index < 0 || index >= this.children.length)\n    {\n        throw new Error('The supplied index is out of bounds');\n    }\n\n    var currentIndex = this.getChildIndex(child);\n\n    this.children.splice(currentIndex, 1); //remove from old position\n    this.children.splice(index, 0, child); //add at new position\n\n};\n\n/**\n * Returns the child at the specified index\n *\n * @method getChildAt\n * @param index {Number} The index to get the child from\n * @return {DisplayObject} The child at the given index, if any.\n */\nPIXI.DisplayObjectContainer.prototype.getChildAt = function (index) {\n\n    if (index < 0 || index >= this.children.length)\n    {\n        throw new Error('getChildAt: Supplied index '+ index +' does not exist in the child list, or the supplied DisplayObject must be a child of the caller');\n    }\n\n    return this.children[index];\n    \n};\n\n/**\n * Removes a child from the container.\n *\n * @method removeChild\n * @param child {DisplayObject} The DisplayObject to remove\n * @return {DisplayObject} The child that was removed.\n */\nPIXI.DisplayObjectContainer.prototype.removeChild = function (child) {\n\n    var index = this.children.indexOf(child);\n\n    if (index === -1)\n    {\n        return;\n    }\n    \n    return this.removeChildAt(index);\n\n};\n\n/**\n * Removes a child from the specified index position.\n *\n * @method removeChildAt\n * @param index {Number} The index to get the child from\n * @return {DisplayObject} The child that was removed.\n */\nPIXI.DisplayObjectContainer.prototype.removeChildAt = function (index) {\n\n    var child = this.getChildAt(index);\n\n    if (child)\n    {\n        child.parent = undefined;\n\n        this.children.splice(index, 1);\n    }\n\n    return child;\n\n};\n\n/**\n* Removes all children from this container that are within the begin and end indexes.\n*\n* @method removeChildren\n* @param beginIndex {Number} The beginning position. Default value is 0.\n* @param endIndex {Number} The ending position. Default value is size of the container.\n*/\nPIXI.DisplayObjectContainer.prototype.removeChildren = function (beginIndex, endIndex) {\n\n    if (beginIndex === undefined) { beginIndex = 0; }\n    if (endIndex === undefined) { endIndex = this.children.length; }\n\n    var range = endIndex - beginIndex;\n\n    if (range > 0 && range <= endIndex)\n    {\n        var removed = this.children.splice(begin, range);\n\n        for (var i = 0; i < removed.length; i++)\n        {\n            var child = removed[i];\n            child.parent = undefined;\n        }\n\n        return removed;\n    }\n    else if (range === 0 && this.children.length === 0)\n    {\n        return [];\n    }\n    else\n    {\n        throw new Error( 'removeChildren: Range Error, numeric values are outside the acceptable range' );\n    }\n\n};\n\n/*\n * Updates the transform on all children of this container for rendering\n *\n * @method updateTransform\n * @private\n */\nPIXI.DisplayObjectContainer.prototype.updateTransform = function () {\n\n    if (!this.visible)\n    {\n        return;\n    }\n\n    this.displayObjectUpdateTransform();\n\n    if (this._cacheAsBitmap)\n    {\n        return;\n    }\n\n    for (var i = 0; i < this.children.length; i++)\n    {\n        this.children[i].updateTransform();\n    }\n\n};\n\n// performance increase to avoid using call.. (10x faster)\nPIXI.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = PIXI.DisplayObjectContainer.prototype.updateTransform;\n\n/**\n * Retrieves the global bounds of the displayObjectContainer as a rectangle. The bounds calculation takes all visible children into consideration.\n *\n * @method getBounds\n * @param {PIXI.DisplayObject|PIXI.Matrix} [targetCoordinateSpace] Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.\n * @return {Rectangle} The rectangular bounding area\n */\nPIXI.DisplayObjectContainer.prototype.getBounds = function (targetCoordinateSpace) {\n\n    var isTargetCoordinateSpaceDisplayObject = (targetCoordinateSpace && targetCoordinateSpace instanceof PIXI.DisplayObject);\n    var isTargetCoordinateSpaceThisOrParent = true;\n\n    if (!isTargetCoordinateSpaceDisplayObject) \n\t{\n        targetCoordinateSpace = this;\n    } \n\telse if (targetCoordinateSpace instanceof PIXI.DisplayObjectContainer) \n\t{\n        isTargetCoordinateSpaceThisOrParent = targetCoordinateSpace.contains(this);\n    } \n\telse \n\t{\n        isTargetCoordinateSpaceThisOrParent = false;\n    }\n\n    var i;\n\n    if (isTargetCoordinateSpaceDisplayObject)\n    {\n        var matrixCache = targetCoordinateSpace.worldTransform;\n\n        targetCoordinateSpace.worldTransform = PIXI.identityMatrix;\n\n        for (i = 0; i < targetCoordinateSpace.children.length; i++) \n\t\t{\n            targetCoordinateSpace.children[i].updateTransform();\n        }\n    }\n\n    var minX = Infinity;\n    var minY = Infinity;\n\n    var maxX = -Infinity;\n    var maxY = -Infinity;\n\n    var childBounds;\n    var childMaxX;\n    var childMaxY;\n\n    var childVisible = false;\n\n    for (i = 0; i < this.children.length; i++)\n    {\n        var child = this.children[i];\n\n        if (!child.visible)\n        {\n            continue;\n        }\n\n        childVisible = true;\n\n        childBounds = this.children[i].getBounds();\n\n        minX = (minX < childBounds.x) ? minX : childBounds.x;\n        minY = (minY < childBounds.y) ? minY : childBounds.y;\n\n        childMaxX = childBounds.width + childBounds.x;\n        childMaxY = childBounds.height + childBounds.y;\n\n        maxX = (maxX > childMaxX) ? maxX : childMaxX;\n        maxY = (maxY > childMaxY) ? maxY : childMaxY;\n    }\n\n    var bounds = this._bounds;\n\n    if (!childVisible) \n\t{\n        bounds = new PIXI.Rectangle();\n\n        var w0 = bounds.x;\n        var w1 = bounds.width + bounds.x;\n\n        var h0 = bounds.y;\n        var h1 = bounds.height + bounds.y;\n\n        var worldTransform = this.worldTransform;\n\n        var a = worldTransform.a;\n        var b = worldTransform.b;\n        var c = worldTransform.c;\n        var d = worldTransform.d;\n        var tx = worldTransform.tx;\n        var ty = worldTransform.ty;\n\n        var x1 = a * w1 + c * h1 + tx;\n        var y1 = d * h1 + b * w1 + ty;\n\n        var x2 = a * w0 + c * h1 + tx;\n        var y2 = d * h1 + b * w0 + ty;\n\n        var x3 = a * w0 + c * h0 + tx;\n        var y3 = d * h0 + b * w0 + ty;\n\n        var x4 = a * w1 + c * h0 + tx;\n        var y4 = d * h0 + b * w1 + ty;\n\n        maxX = x1;\n        maxY = y1;\n\n        minX = x1;\n        minY = y1;\n\n        minX = x2 < minX ? x2 : minX;\n        minX = x3 < minX ? x3 : minX;\n        minX = x4 < minX ? x4 : minX;\n\n        minY = y2 < minY ? y2 : minY;\n        minY = y3 < minY ? y3 : minY;\n        minY = y4 < minY ? y4 : minY;\n\n        maxX = x2 > maxX ? x2 : maxX;\n        maxX = x3 > maxX ? x3 : maxX;\n        maxX = x4 > maxX ? x4 : maxX;\n\n        maxY = y2 > maxY ? y2 : maxY;\n        maxY = y3 > maxY ? y3 : maxY;\n        maxY = y4 > maxY ? y4 : maxY;\n    }\n\n    bounds.x = minX;\n    bounds.y = minY;\n    bounds.width = maxX - minX;\n    bounds.height = maxY - minY;\n\n    if (isTargetCoordinateSpaceDisplayObject) \n\t{\n        targetCoordinateSpace.worldTransform = matrixCache;\n\n        for (i = 0; i < targetCoordinateSpace.children.length; i++) \n\t\t{\n            targetCoordinateSpace.children[i].updateTransform();\n        }\n    }\n\n    if (!isTargetCoordinateSpaceThisOrParent) \n\t{\n        var targetCoordinateSpaceBounds = targetCoordinateSpace.getBounds();\n\n        bounds.x -= targetCoordinateSpaceBounds.x;\n        bounds.y -= targetCoordinateSpaceBounds.y;\n    }\n\n    return bounds;\n\n};\n\n/**\n * Retrieves the non-global local bounds of the displayObjectContainer as a rectangle without any transformations. The calculation takes all visible children into consideration.\n *\n * @method getLocalBounds\n * @return {Rectangle} The rectangular bounding area\n */\nPIXI.DisplayObjectContainer.prototype.getLocalBounds = function () {\n\n    return this.getBounds(this);\n\n};\n\n/**\n* Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself.\n*\n* @method contains\n* @param {DisplayObject} child\n* @returns {boolean}\n*/\nPIXI.DisplayObjectContainer.prototype.contains = function (child) {\n\n    if (!child)\n    {\n        return false;\n    }\n    else if (child === this) \n\t{\n        return true;\n    }\n    else \n\t{\n        return this.contains(child.parent);\n    }\n};\n\n/**\n* Renders the object using the WebGL renderer\n*\n* @method _renderWebGL\n* @param renderSession {RenderSession} \n* @private\n*/\nPIXI.DisplayObjectContainer.prototype._renderWebGL = function (renderSession) {\n\n    if (!this.visible || this.alpha <= 0)\n    {\n        return;\n    }\n    \n    if (this._cacheAsBitmap)\n    {\n        this._renderCachedSprite(renderSession);\n        return;\n    }\n    \n    var i;\n\n    if (this._mask || this._filters)\n    {\n        // push filter first as we need to ensure the stencil buffer is correct for any masking\n        if (this._filters)\n        {\n            renderSession.spriteBatch.flush();\n            renderSession.filterManager.pushFilter(this._filterBlock);\n        }\n\n        if (this._mask)\n        {\n            renderSession.spriteBatch.stop();\n            renderSession.maskManager.pushMask(this.mask, renderSession);\n            renderSession.spriteBatch.start();\n        }\n\n        // simple render children!\n        for (i = 0; i < this.children.length; i++)\n        {\n            this.children[i]._renderWebGL(renderSession);\n        }\n\n        renderSession.spriteBatch.stop();\n\n        if (this._mask) renderSession.maskManager.popMask(this._mask, renderSession);\n        if (this._filters) renderSession.filterManager.popFilter();\n        \n        renderSession.spriteBatch.start();\n    }\n    else\n    {\n        // simple render children!\n        for (i = 0; i < this.children.length; i++)\n        {\n            this.children[i]._renderWebGL(renderSession);\n        }\n    }\n\n};\n\n/**\n* Renders the object using the Canvas renderer\n*\n* @method _renderCanvas\n* @param renderSession {RenderSession} \n* @private\n*/\nPIXI.DisplayObjectContainer.prototype._renderCanvas = function (renderSession) {\n\n    if (this.visible === false || this.alpha === 0)\n    {\n        return;\n    }\n\n    if (this._cacheAsBitmap)\n    {\n        this._renderCachedSprite(renderSession);\n        return;\n    }\n\n    if (this._mask)\n    {\n        renderSession.maskManager.pushMask(this._mask, renderSession);\n    }\n\n    for (var i = 0; i < this.children.length; i++)\n    {\n        this.children[i]._renderCanvas(renderSession);\n    }\n\n    if (this._mask)\n    {\n        renderSession.maskManager.popMask(renderSession);\n    }\n\n};\n\n/**\n * The width of the displayObjectContainer, setting this will actually modify the scale to achieve the value set\n *\n * @property width\n * @type Number\n */\nObject.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {\n\n    get: function() {\n        return this.getLocalBounds().width * this.scale.x;\n    },\n\n    set: function(value) {\n        \n        var width = this.getLocalBounds().width;\n\n        if (width !== 0)\n        {\n            this.scale.x = value / width;\n        }\n        else\n        {\n            this.scale.x = 1;\n        }\n        \n        this._width = value;\n    }\n});\n\n/**\n * The height of the displayObjectContainer, setting this will actually modify the scale to achieve the value set\n *\n * @property height\n * @type Number\n */\nObject.defineProperty(PIXI.DisplayObjectContainer.prototype, 'height', {\n\n    get: function() {\n        return this.getLocalBounds().height * this.scale.y;\n    },\n\n    set: function(value) {\n\n        var height = this.getLocalBounds().height;\n\n        if (height !== 0)\n        {\n            this.scale.y = value / height;\n        }\n        else\n        {\n            this.scale.y = 1;\n        }\n\n        this._height = value;\n    }\n\n});\n\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * The Sprite object is the base for all textured objects that are rendered to the screen\n *\n * @class Sprite\n * @extends DisplayObjectContainer\n * @constructor\n * @param texture {Texture} The texture for this sprite\n */\nPIXI.Sprite = function (texture) {\n\n    PIXI.DisplayObjectContainer.call(this);\n\n    /**\n     * The anchor sets the origin point of the texture.\n     * The default is 0,0 this means the texture's origin is the top left\n     * Setting than anchor to 0.5,0.5 means the textures origin is centered\n     * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner\n     *\n     * @property anchor\n     * @type Point\n     */\n    this.anchor = new PIXI.Point();\n\n    /**\n     * The texture that the sprite is using\n     *\n     * @property texture\n     * @type Texture\n     */\n    this.texture = texture || PIXI.Texture.emptyTexture;\n\n    /**\n     * The width of the sprite (this is initially set by the texture)\n     *\n     * @property _width\n     * @type Number\n     * @private\n     */\n    this._width = 0;\n\n    /**\n     * The height of the sprite (this is initially set by the texture)\n     *\n     * @property _height\n     * @type Number\n     * @private\n     */\n    this._height = 0;\n\n    /**\n     * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.\n     *\n     * @property tint\n     * @type Number\n     * @default 0xFFFFFF\n     */\n    this.tint = 0xFFFFFF;\n\n    /**\n     * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.\n     *\n     * @property cachedTint\n     * @private\n     * @type Number\n     * @default -1\n     */\n    this.cachedTint = -1;\n\n    /**\n     * A canvas that contains the tinted version of the Sprite (in Canvas mode, WebGL doesn't populate this)\n     *\n     * @property tintedTexture\n     * @type Canvas\n     * @default null\n     */\n    this.tintedTexture = null;\n\n    /**\n     * The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.\n     *\n     * Warning: You cannot have a blend mode and a filter active on the same Sprite. Doing so will render the sprite invisible.\n     *\n     * @property blendMode\n     * @type Number\n     * @default PIXI.blendModes.NORMAL;\n     */\n    this.blendMode = PIXI.blendModes.NORMAL;\n\n    /**\n     * The shader that will be used to render this Sprite.\n     * Set to null to remove a current shader.\n     *\n     * @property shader\n     * @type AbstractFilter\n     * @default null\n     */\n    this.shader = null;\n\n    /**\n    * Controls if this Sprite is processed by the core Phaser game loops and Group loops.\n    *\n    * @property exists\n    * @type Boolean\n    * @default true\n    */\n    this.exists = true;\n\n    if (this.texture.baseTexture.hasLoaded)\n    {\n        this.onTextureUpdate();\n    }\n\n    this.renderable = true;\n\n};\n\n// constructor\nPIXI.Sprite.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);\nPIXI.Sprite.prototype.constructor = PIXI.Sprite;\n\n/**\n * The width of the sprite, setting this will actually modify the scale to achieve the value set\n *\n * @property width\n * @type Number\n */\nObject.defineProperty(PIXI.Sprite.prototype, 'width', {\n\n    get: function() {\n        return this.scale.x * this.texture.frame.width;\n    },\n\n    set: function(value) {\n        this.scale.x = value / this.texture.frame.width;\n        this._width = value;\n    }\n\n});\n\n/**\n * The height of the sprite, setting this will actually modify the scale to achieve the value set\n *\n * @property height\n * @type Number\n */\nObject.defineProperty(PIXI.Sprite.prototype, 'height', {\n\n    get: function() {\n        return  this.scale.y * this.texture.frame.height;\n    },\n\n    set: function(value) {\n        this.scale.y = value / this.texture.frame.height;\n        this._height = value;\n    }\n\n});\n\n/**\n * Sets the texture of the sprite. Be warned that this doesn't remove or destroy the previous\n * texture this Sprite was using.\n *\n * @method setTexture\n * @param texture {Texture} The PIXI texture that is displayed by the sprite\n * @param [destroy=false] {boolean} Call Texture.destroy on the current texture before replacing it with the new one?\n */\nPIXI.Sprite.prototype.setTexture = function(texture, destroyBase)\n{\n    if (destroyBase !== undefined)\n    {\n        this.texture.baseTexture.destroy();\n    }\n\n    //  Over-ridden by loadTexture as needed\n    this.texture.baseTexture.skipRender = false;\n    this.texture = texture;\n    this.texture.valid = true;\n    this.cachedTint = -1;\n};\n\n/**\n * When the texture is updated, this event will fire to update the scale and frame\n *\n * @method onTextureUpdate\n * @param event\n * @private\n */\nPIXI.Sprite.prototype.onTextureUpdate = function()\n{\n    // so if _width is 0 then width was not set..\n    if (this._width) this.scale.x = this._width / this.texture.frame.width;\n    if (this._height) this.scale.y = this._height / this.texture.frame.height;\n};\n\n/**\n* Returns the bounds of the Sprite as a rectangle.\n* The bounds calculation takes the worldTransform into account.\n*\n* It is important to note that the transform is not updated when you call this method.\n* So if this Sprite is the child of a Display Object which has had its transform\n* updated since the last render pass, those changes will not yet have been applied\n* to this Sprites worldTransform. If you need to ensure that all parent transforms\n* are factored into this getBounds operation then you should call `updateTransform`\n* on the root most object in this Sprites display list first.\n*\n* @method getBounds\n* @param matrix {Matrix} the transformation matrix of the sprite\n* @return {Rectangle} the framing rectangle\n*/\nPIXI.Sprite.prototype.getBounds = function(matrix)\n{\n    var width = this.texture.frame.width;\n    var height = this.texture.frame.height;\n\n    var w0 = width * (1-this.anchor.x);\n    var w1 = width * -this.anchor.x;\n\n    var h0 = height * (1-this.anchor.y);\n    var h1 = height * -this.anchor.y;\n\n    var worldTransform = matrix || this.worldTransform;\n\n    var a = worldTransform.a;\n    var b = worldTransform.b;\n    var c = worldTransform.c;\n    var d = worldTransform.d;\n    var tx = worldTransform.tx;\n    var ty = worldTransform.ty;\n\n    var maxX = -Infinity;\n    var maxY = -Infinity;\n\n    var minX = Infinity;\n    var minY = Infinity;\n\n    if (b === 0 && c === 0)\n    {\n        // scale may be negative!\n        if (a < 0)\n        {\n            a *= -1;\n            var temp = w0;\n            w0 = -w1;\n            w1 = -temp; \n        }\n\n        if (d < 0)\n        {\n            d *= -1;\n            var temp = h0;\n            h0 = -h1;\n            h1 = -temp; \n        }\n\n        // this means there is no rotation going on right? RIGHT?\n        // if thats the case then we can avoid checking the bound values! yay         \n        minX = a * w1 + tx;\n        maxX = a * w0 + tx;\n        minY = d * h1 + ty;\n        maxY = d * h0 + ty;\n    }\n    else\n    {\n        var x1 = a * w1 + c * h1 + tx;\n        var y1 = d * h1 + b * w1 + ty;\n\n        var x2 = a * w0 + c * h1 + tx;\n        var y2 = d * h1 + b * w0 + ty;\n\n        var x3 = a * w0 + c * h0 + tx;\n        var y3 = d * h0 + b * w0 + ty;\n\n        var x4 =  a * w1 + c * h0 + tx;\n        var y4 =  d * h0 + b * w1 + ty;\n\n        minX = x1 < minX ? x1 : minX;\n        minX = x2 < minX ? x2 : minX;\n        minX = x3 < minX ? x3 : minX;\n        minX = x4 < minX ? x4 : minX;\n\n        minY = y1 < minY ? y1 : minY;\n        minY = y2 < minY ? y2 : minY;\n        minY = y3 < minY ? y3 : minY;\n        minY = y4 < minY ? y4 : minY;\n\n        maxX = x1 > maxX ? x1 : maxX;\n        maxX = x2 > maxX ? x2 : maxX;\n        maxX = x3 > maxX ? x3 : maxX;\n        maxX = x4 > maxX ? x4 : maxX;\n\n        maxY = y1 > maxY ? y1 : maxY;\n        maxY = y2 > maxY ? y2 : maxY;\n        maxY = y3 > maxY ? y3 : maxY;\n        maxY = y4 > maxY ? y4 : maxY;\n    }\n\n    var bounds = this._bounds;\n\n    bounds.x = minX;\n    bounds.width = maxX - minX;\n\n    bounds.y = minY;\n    bounds.height = maxY - minY;\n\n    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate\n    this._currentBounds = bounds;\n\n    return bounds;\n};\n\n/**\n * Retrieves the non-global local bounds of the Sprite as a rectangle. The calculation takes all visible children into consideration.\n *\n * @method getLocalBounds\n * @return {Rectangle} The rectangular bounding area\n */\nPIXI.Sprite.prototype.getLocalBounds = function () {\n\n    var matrixCache = this.worldTransform;\n\n    this.worldTransform = PIXI.identityMatrix;\n\n    for (var i = 0; i < this.children.length; i++)\n    {\n        this.children[i].updateTransform();\n    }\n\n    var bounds = this.getBounds();\n\n    this.worldTransform = matrixCache;\n\n    for (i = 0; i < this.children.length; i++)\n    {\n        this.children[i].updateTransform();\n    }\n\n    return bounds;\n\n};\n\n/**\n* Renders the object using the WebGL renderer\n*\n* @method _renderWebGL\n* @param renderSession {RenderSession}\n* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.\n* @private\n*/\nPIXI.Sprite.prototype._renderWebGL = function(renderSession, matrix)\n{\n    // if the sprite is not visible or the alpha is 0 then no need to render this element\n    if (!this.visible || this.alpha <= 0 || !this.renderable) return;\n\n    //  They provided an alternative rendering matrix, so use it\n    var wt = this.worldTransform;\n\n    if (matrix)\n    {\n        wt = matrix;\n    }\n\n    //  A quick check to see if this element has a mask or a filter.\n    if (this._mask || this._filters)\n    {\n        var spriteBatch = renderSession.spriteBatch;\n\n        // push filter first as we need to ensure the stencil buffer is correct for any masking\n        if (this._filters)\n        {\n            spriteBatch.flush();\n            renderSession.filterManager.pushFilter(this._filterBlock);\n        }\n\n        if (this._mask)\n        {\n            spriteBatch.stop();\n            renderSession.maskManager.pushMask(this.mask, renderSession);\n            spriteBatch.start();\n        }\n\n        // add this sprite to the batch\n        spriteBatch.render(this);\n\n        // now loop through the children and make sure they get rendered\n        for (var i = 0; i < this.children.length; i++)\n        {\n            this.children[i]._renderWebGL(renderSession);\n        }\n\n        // time to stop the sprite batch as either a mask element or a filter draw will happen next\n        spriteBatch.stop();\n\n        if (this._mask) renderSession.maskManager.popMask(this._mask, renderSession);\n        if (this._filters) renderSession.filterManager.popFilter();\n\n        spriteBatch.start();\n    }\n    else\n    {\n        renderSession.spriteBatch.render(this);\n\n        //  Render children!\n        for (var i = 0; i < this.children.length; i++)\n        {\n            this.children[i]._renderWebGL(renderSession, wt);\n        }\n\n    }\n};\n\n/**\n* Renders the object using the Canvas renderer\n*\n* @method _renderCanvas\n* @param renderSession {RenderSession}\n* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.\n* @private\n*/\nPIXI.Sprite.prototype._renderCanvas = function(renderSession, matrix)\n{\n    // If the sprite is not visible or the alpha is 0 then no need to render this element\n    if (!this.visible || this.alpha === 0 || !this.renderable || this.texture.crop.width <= 0 || this.texture.crop.height <= 0)\n    {\n        return;\n    }\n\n    var wt = this.worldTransform;\n\n    //  If they provided an alternative rendering matrix then use it\n    if (matrix)\n    {\n        wt = matrix;\n    }\n\n    if (this.blendMode !== renderSession.currentBlendMode)\n    {\n        renderSession.currentBlendMode = this.blendMode;\n        renderSession.context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];\n    }\n\n    if (this._mask)\n    {\n        renderSession.maskManager.pushMask(this._mask, renderSession);\n    }\n\n    //  Ignore null sources\n    if (this.texture.valid)\n    {\n        var resolution = this.texture.baseTexture.resolution / renderSession.resolution;\n\n        renderSession.context.globalAlpha = this.worldAlpha;\n\n        //  If smoothingEnabled is supported and we need to change the smoothing property for this texture\n        if (renderSession.smoothProperty && renderSession.scaleMode !== this.texture.baseTexture.scaleMode)\n        {\n            renderSession.scaleMode = this.texture.baseTexture.scaleMode;\n            renderSession.context[renderSession.smoothProperty] = (renderSession.scaleMode === PIXI.scaleModes.LINEAR);\n        }\n\n        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions\n        var dx = (this.texture.trim) ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width;\n        var dy = (this.texture.trim) ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;\n\n        var tx = (wt.tx * renderSession.resolution) + renderSession.shakeX;\n        var ty = (wt.ty * renderSession.resolution) + renderSession.shakeY;\n\n        //  Allow for pixel rounding\n        if (renderSession.roundPixels)\n        {\n            renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx | 0, ty | 0);\n            dx |= 0;\n            dy |= 0;\n        }\n        else\n        {\n            renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, tx, ty);\n        }\n\n        var cw = this.texture.crop.width;\n        var ch = this.texture.crop.height;\n\n        dx /= resolution;\n        dy /= resolution;\n\n        if (this.tint !== 0xFFFFFF)\n        {\n            if (this.texture.requiresReTint || this.cachedTint !== this.tint)\n            {\n                this.tintedTexture = PIXI.CanvasTinter.getTintedTexture(this, this.tint);\n\n                this.cachedTint = this.tint;\n                this.texture.requiresReTint = false;\n            }\n\n            renderSession.context.drawImage(this.tintedTexture, 0, 0, cw, ch, dx, dy, cw / resolution, ch / resolution);\n        }\n        else\n        {\n            var cx = this.texture.crop.x;\n            var cy = this.texture.crop.y;\n            renderSession.context.drawImage(this.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);\n        }\n    }\n\n    for (var i = 0; i < this.children.length; i++)\n    {\n        this.children[i]._renderCanvas(renderSession);\n    }\n\n    if (this._mask)\n    {\n        renderSession.maskManager.popMask(renderSession);\n    }\n\n};\n\n/**\n * @author Mat Groves http://matgroves.com/\n */\n\n/**\n * The SpriteBatch class is a really fast version of the DisplayObjectContainer \n * built solely for speed, so use when you need a lot of sprites or particles.\n * And it's extremely easy to use : \n\n    var container = new PIXI.SpriteBatch();\n \n    for(var i  = 0; i < 100; i++)\n    {\n        var sprite = new PIXI.Sprite.fromImage(\"myImage.png\");\n        container.addChild(sprite);\n    }\n * And here you have a hundred sprites that will be renderer at the speed of light\n *\n * @class SpriteBatch\n * @constructor\n * @param texture {Texture}\n */\nPIXI.SpriteBatch = function(texture)\n{\n    PIXI.DisplayObjectContainer.call( this);\n\n    this.textureThing = texture;\n\n    this.ready = false;\n};\n\nPIXI.SpriteBatch.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);\nPIXI.SpriteBatch.prototype.constructor = PIXI.SpriteBatch;\n\n/*\n * Initialises the spriteBatch\n *\n * @method initWebGL\n * @param gl {WebGLContext} the current WebGL drawing context\n */\nPIXI.SpriteBatch.prototype.initWebGL = function(gl)\n{\n    // TODO only one needed for the whole engine really?\n    this.fastSpriteBatch = new PIXI.WebGLFastSpriteBatch(gl);\n\n    this.ready = true;\n};\n\n/*\n * Updates the object transform for rendering\n *\n * @method updateTransform\n * @private\n */\nPIXI.SpriteBatch.prototype.updateTransform = function()\n{\n    // TODO don't need to!\n    this.displayObjectUpdateTransform();\n    //  PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );\n};\n\n/**\n* Renders the object using the WebGL renderer\n*\n* @method _renderWebGL\n* @param renderSession {RenderSession} \n* @private\n*/\nPIXI.SpriteBatch.prototype._renderWebGL = function(renderSession)\n{\n    if (!this.visible || this.alpha <= 0 || !this.children.length) return;\n\n    if (!this.ready)\n    {\n        this.initWebGL(renderSession.gl);\n    }\n    \n    if (this.fastSpriteBatch.gl !== renderSession.gl)\n    {\n        this.fastSpriteBatch.setContext(renderSession.gl);\n    }\n\n    renderSession.spriteBatch.stop();\n    \n    renderSession.shaderManager.setShader(renderSession.shaderManager.fastShader);\n    \n    this.fastSpriteBatch.begin(this, renderSession);\n    this.fastSpriteBatch.render(this);\n\n    renderSession.spriteBatch.start();\n \n};\n\n/**\n* Renders the object using the Canvas renderer\n*\n* @method _renderCanvas\n* @param renderSession {RenderSession} \n* @private\n*/\nPIXI.SpriteBatch.prototype._renderCanvas = function(renderSession)\n{\n    if (!this.visible || this.alpha <= 0 || !this.children.length) return;\n    \n    var context = renderSession.context;\n\n    context.globalAlpha = this.worldAlpha;\n\n    this.displayObjectUpdateTransform();\n\n    var transform = this.worldTransform;\n       \n    var isRotated = true;\n\n    for (var i = 0; i < this.children.length; i++)\n    {\n        var child = this.children[i];\n\n        if (!child.visible) continue;\n\n        var texture = child.texture;\n        var frame = texture.frame;\n\n        context.globalAlpha = this.worldAlpha * child.alpha;\n\n        if (child.rotation % (Math.PI * 2) === 0)\n        {\n            if (isRotated)\n            {\n                context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx, transform.ty);\n                isRotated = false;\n            }\n\n            // this is the fastest  way to optimise! - if rotation is 0 then we can avoid any kind of setTransform call\n            context.drawImage(texture.baseTexture.source,\n                                 frame.x,\n                                 frame.y,\n                                 frame.width,\n                                 frame.height,\n                                 ((child.anchor.x) * (-frame.width * child.scale.x) + child.position.x + 0.5 + renderSession.shakeX) | 0,\n                                 ((child.anchor.y) * (-frame.height * child.scale.y) + child.position.y + 0.5 + renderSession.shakeY) | 0,\n                                 frame.width * child.scale.x,\n                                 frame.height * child.scale.y);\n        }\n        else\n        {\n            if (!isRotated) isRotated = true;\n    \n            child.displayObjectUpdateTransform();\n           \n            var childTransform = child.worldTransform;\n            var tx = (childTransform.tx * renderSession.resolution) + renderSession.shakeX;\n            var ty = (childTransform.ty * renderSession.resolution) + renderSession.shakeY;\n\n            // allow for trimming\n           \n            if (renderSession.roundPixels)\n            {\n                context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, tx | 0, ty | 0);\n            }\n            else\n            {\n                context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, tx, ty);\n            }\n\n            context.drawImage(texture.baseTexture.source,\n                                 frame.x,\n                                 frame.y,\n                                 frame.width,\n                                 frame.height,\n                                 ((child.anchor.x) * (-frame.width) + 0.5) | 0,\n                                 ((child.anchor.y) * (-frame.height) + 0.5) | 0,\n                                 frame.width,\n                                 frame.height);\n        }\n    }\n\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n \n/**\n * Converts a hex color number to an [R, G, B] array\n *\n * @method hex2rgb\n * @param hex {Number}\n */\nPIXI.hex2rgb = function(hex) {\n    return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];\n};\n\n/**\n * Converts a color as an [R, G, B] array to a hex number\n *\n * @method rgb2hex\n * @param rgb {Array}\n */\nPIXI.rgb2hex = function(rgb) {\n    return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);\n};\n\n/**\n * Checks whether the Canvas BlendModes are supported by the current browser for drawImage\n *\n * @method canUseNewCanvasBlendModes\n * @return {Boolean} whether they are supported\n */\nPIXI.canUseNewCanvasBlendModes = function()\n{\n    if (document === undefined) return false;\n\n    var pngHead = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/';\n    var pngEnd = 'AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';\n\n    var magenta = new Image();\n    magenta.src = pngHead + 'AP804Oa6' + pngEnd;\n\n    var yellow = new Image();\n    yellow.src = pngHead + '/wCKxvRF' + pngEnd;\n\n    var canvas = PIXI.CanvasPool.create(this, 6, 1);\n    var context = canvas.getContext('2d');\n    context.globalCompositeOperation = 'multiply';\n    context.drawImage(magenta, 0, 0);\n    context.drawImage(yellow, 2, 0);\n\n    if (!context.getImageData(2,0,1,1))\n    {\n        return false;\n    }\n\n    var data = context.getImageData(2,0,1,1).data;\n\n    PIXI.CanvasPool.remove(this);\n\n    return (data[0] === 255 && data[1] === 0 && data[2] === 0);\n\n};\n\n/**\n * Given a number, this function returns the closest number that is a power of two\n * this function is taken from Starling Framework as its pretty neat ;)\n *\n * @method getNextPowerOfTwo\n * @param number {Number}\n * @return {Number} the closest number that is a power of two\n */\nPIXI.getNextPowerOfTwo = function(number)\n{\n    if (number > 0 && (number & (number - 1)) === 0) // see: http://goo.gl/D9kPj\n        return number;\n    else\n    {\n        var result = 1;\n        while (result < number) result <<= 1;\n        return result;\n    }\n};\n\n/**\n * checks if the given width and height make a power of two texture\n * @method isPowerOfTwo\n * @param width {Number}\n * @param height {Number}\n * @return {Boolean} \n */\nPIXI.isPowerOfTwo = function(width, height)\n{\n    return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);\n\n};\n\n/**\n* @author       Richard Davey <rich@photonstorm.com>\n* @copyright    2016 Photon Storm Ltd.\n* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}\n*/\n\n/**\n* The CanvasPool is a global static object that allows Pixi and Phaser to pool canvas DOM elements.\n*\n* @class CanvasPool\n* @static\n*/\nPIXI.CanvasPool = {\n\n    /**\n    * Creates a new Canvas DOM element, or pulls one from the pool if free.\n    * \n    * @method create\n    * @static\n    * @param parent {any} The parent of the canvas element.\n    * @param width {number} The width of the canvas element.\n    * @param height {number} The height of the canvas element.\n    * @return {HTMLCanvasElement} The canvas element.\n    */\n    create: function (parent, width, height) {\n\n        var idx = PIXI.CanvasPool.getFirst();\n        var canvas;\n\n        if (idx === -1)\n        {\n            var container = {\n                parent: parent,\n                canvas: document.createElement('canvas')\n            }\n\n            PIXI.CanvasPool.pool.push(container);\n\n            canvas = container.canvas;\n        }\n        else\n        {\n            PIXI.CanvasPool.pool[idx].parent = parent;\n\n            canvas = PIXI.CanvasPool.pool[idx].canvas;\n        }\n\n        if (width !== undefined)\n        {\n            canvas.width = width;\n            canvas.height = height;\n        }\n\n        return canvas;\n\n    },\n\n    /**\n    * Gets the first free canvas index from the pool.\n    * \n    * @method getFirst\n    * @static\n    * @return {number}\n    */\n    getFirst: function () {\n\n        var pool = PIXI.CanvasPool.pool;\n\n        for (var i = 0; i < pool.length; i++)\n        {\n            if (!pool[i].parent)\n            {\n                return i;\n            }\n        }\n\n        return -1;\n\n    },\n\n    /**\n    * Removes the parent from a canvas element from the pool, freeing it up for re-use.\n    * \n    * @method remove\n    * @param parent {any} The parent of the canvas element.\n    * @static\n    */\n    remove: function (parent) {\n\n        var pool = PIXI.CanvasPool.pool;\n\n        for (var i = 0; i < pool.length; i++)\n        {\n            if (pool[i].parent === parent)\n            {\n                pool[i].parent = null;\n                pool[i].canvas.width = 1;\n                pool[i].canvas.height = 1;\n            }\n        }\n\n    },\n\n    /**\n    * Removes the parent from a canvas element from the pool, freeing it up for re-use.\n    * \n    * @method removeByCanvas\n    * @param canvas {HTMLCanvasElement} The canvas element to remove\n    * @static\n    */\n    removeByCanvas: function (canvas) {\n\n        var pool = PIXI.CanvasPool.pool;\n\n        for (var i = 0; i < pool.length; i++)\n        {\n            if (pool[i].canvas === canvas)\n            {\n                pool[i].parent = null;\n                pool[i].canvas.width = 1;\n                pool[i].canvas.height = 1;\n            }\n        }\n\n    },\n\n    /**\n    * Gets the total number of used canvas elements in the pool.\n    * \n    * @method getTotal\n    * @static\n    * @return {number} The number of in-use (parented) canvas elements in the pool.\n    */\n    getTotal: function () {\n\n        var pool = PIXI.CanvasPool.pool;\n        var c = 0;\n\n        for (var i = 0; i < pool.length; i++)\n        {\n            if (pool[i].parent)\n            {\n                c++;\n            }\n        }\n\n        return c;\n\n    },\n\n    /**\n    * Gets the total number of free canvas elements in the pool.\n    * \n    * @method getFree\n    * @static\n    * @return {number} The number of free (un-parented) canvas elements in the pool.\n    */\n    getFree: function () {\n\n        var pool = PIXI.CanvasPool.pool;\n        var c = 0;\n\n        for (var i = 0; i < pool.length; i++)\n        {\n            if (!pool[i].parent)\n            {\n                c++;\n            }\n        }\n\n        return c;\n\n    }\n\n};\n\n/**\n * The pool into which the canvas dom elements are placed.\n *\n * @property pool\n * @type Array\n * @static\n */\nPIXI.CanvasPool.pool = [];\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @method initDefaultShaders\n* @static\n* @private\n*/\nPIXI.initDefaultShaders = function()\n{\n};\n\n/**\n* @method CompileVertexShader\n* @static\n* @param gl {WebGLContext} the current WebGL drawing context\n* @param shaderSrc {Array}\n* @return {Any}\n*/\nPIXI.CompileVertexShader = function(gl, shaderSrc)\n{\n    return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);\n};\n\n/**\n* @method CompileFragmentShader\n* @static\n* @param gl {WebGLContext} the current WebGL drawing context\n* @param shaderSrc {Array}\n* @return {Any}\n*/\nPIXI.CompileFragmentShader = function(gl, shaderSrc)\n{\n    return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);\n};\n\n/**\n* @method _CompileShader\n* @static\n* @private\n* @param gl {WebGLContext} the current WebGL drawing context\n* @param shaderSrc {Array}\n* @param shaderType {Number}\n* @return {Any}\n*/\nPIXI._CompileShader = function(gl, shaderSrc, shaderType)\n{\n    var src = shaderSrc;\n\n    if (Array.isArray(shaderSrc))\n    {\n        src = shaderSrc.join(\"\\n\");\n    }\n\n    var shader = gl.createShader(shaderType);\n    gl.shaderSource(shader, src);\n    gl.compileShader(shader);\n\n    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))\n    {\n        window.console.log(gl.getShaderInfoLog(shader));\n        return null;\n    }\n\n    return shader;\n};\n\n/**\n* @method compileProgram\n* @static\n* @param gl {WebGLContext} the current WebGL drawing context\n* @param vertexSrc {Array}\n* @param fragmentSrc {Array}\n* @return {Any}\n*/\nPIXI.compileProgram = function(gl, vertexSrc, fragmentSrc)\n{\n    var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);\n    var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);\n\n    var shaderProgram = gl.createProgram();\n\n    gl.attachShader(shaderProgram, vertexShader);\n    gl.attachShader(shaderProgram, fragmentShader);\n    gl.linkProgram(shaderProgram);\n\n    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))\n    {\n        window.console.log(gl.getProgramInfoLog(shaderProgram));\n        window.console.log(\"Could not initialise shaders\");\n    }\n\n    return shaderProgram;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n * @author Richard Davey http://www.photonstorm.com @photonstorm\n */\n\n/**\n* @class PixiShader\n* @constructor\n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.PixiShader = function(gl)\n{\n    /**\n     * @property _UID\n     * @type Number\n     * @private\n     */\n    this._UID = PIXI._UID++;\n\n    /**\n     * @property gl\n     * @type WebGLContext\n     */\n    this.gl = gl;\n\n    /**\n     * The WebGL program.\n     * @property program\n     * @type Any\n     */\n    this.program = null;\n\n    /**\n     * The fragment shader.\n     * @property fragmentSrc\n     * @type Array\n     */\n    this.fragmentSrc = [\n        'precision lowp float;',\n        'varying vec2 vTextureCoord;',\n        'varying vec4 vColor;',\n        'uniform sampler2D uSampler;',\n        'void main(void) {',\n        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',\n        '}'\n    ];\n\n    /**\n     * A local texture counter for multi-texture shaders.\n     * @property textureCount\n     * @type Number\n     */\n    this.textureCount = 0;\n\n    /**\n     * A local flag\n     * @property firstRun\n     * @type Boolean\n     * @private\n     */\n    this.firstRun = true;\n\n    /**\n     * A dirty flag\n     * @property dirty\n     * @type Boolean\n     */\n    this.dirty = true;\n\n    /**\n     * Uniform attributes cache.\n     * @property attributes\n     * @type Array\n     * @private\n     */\n    this.attributes = [];\n\n    this.init();\n};\n\nPIXI.PixiShader.prototype.constructor = PIXI.PixiShader;\n\n/**\n* Initialises the shader.\n*\n* @method init\n*/\nPIXI.PixiShader.prototype.init = function()\n{\n    var gl = this.gl;\n\n    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);\n\n    gl.useProgram(program);\n\n    // get and store the uniforms for the shader\n    this.uSampler = gl.getUniformLocation(program, 'uSampler');\n    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');\n    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');\n    this.dimensions = gl.getUniformLocation(program, 'dimensions');\n\n    // get and store the attributes\n    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');\n    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');\n    this.colorAttribute = gl.getAttribLocation(program, 'aColor');\n\n    // Begin worst hack eva //\n\n    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?\n    // maybe its something to do with the current state of the gl context.\n    // I'm convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel\n    // If theres any webGL people that know why could happen please help :)\n    if(this.colorAttribute === -1)\n    {\n        this.colorAttribute = 2;\n    }\n\n    this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];\n\n    // End worst hack eva //\n\n    // add those custom shaders!\n    for (var key in this.uniforms)\n    {\n        // get the uniform locations..\n        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);\n    }\n\n    this.initUniforms();\n\n    this.program = program;\n};\n\n/**\n* Initialises the shader uniform values.\n*\n* Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/\n* http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf\n*\n* @method initUniforms\n*/\nPIXI.PixiShader.prototype.initUniforms = function()\n{\n    this.textureCount = 1;\n    var gl = this.gl;\n    var uniform;\n\n    for (var key in this.uniforms)\n    {\n        uniform = this.uniforms[key];\n\n        var type = uniform.type;\n\n        if (type === 'sampler2D')\n        {\n            uniform._init = false;\n\n            if (uniform.value !== null)\n            {\n                this.initSampler2D(uniform);\n            }\n        }\n        else if (type === 'mat2' || type === 'mat3' || type === 'mat4')\n        {\n            //  These require special handling\n            uniform.glMatrix = true;\n            uniform.glValueLength = 1;\n\n            if (type === 'mat2')\n            {\n                uniform.glFunc = gl.uniformMatrix2fv;\n            }\n            else if (type === 'mat3')\n            {\n                uniform.glFunc = gl.uniformMatrix3fv;\n            }\n            else if (type === 'mat4')\n            {\n                uniform.glFunc = gl.uniformMatrix4fv;\n            }\n        }\n        else\n        {\n            //  GL function reference\n            uniform.glFunc = gl['uniform' + type];\n\n            if (type === '2f' || type === '2i')\n            {\n                uniform.glValueLength = 2;\n            }\n            else if (type === '3f' || type === '3i')\n            {\n                uniform.glValueLength = 3;\n            }\n            else if (type === '4f' || type === '4i')\n            {\n                uniform.glValueLength = 4;\n            }\n            else\n            {\n                uniform.glValueLength = 1;\n            }\n        }\n    }\n\n};\n\n/**\n* Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture has loaded)\n*\n* @method initSampler2D\n*/\nPIXI.PixiShader.prototype.initSampler2D = function(uniform)\n{\n    if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded)\n    {\n        return;\n    }\n\n    var gl = this.gl;\n\n    gl.activeTexture(gl['TEXTURE' + this.textureCount]);\n    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);\n\n    //  Extended texture data\n    if (uniform.textureData)\n    {\n        var data = uniform.textureData;\n\n        // GLTexture = mag linear, min linear_mipmap_linear, wrap repeat + gl.generateMipmap(gl.TEXTURE_2D);\n        // GLTextureLinear = mag/min linear, wrap clamp\n        // GLTextureNearestRepeat = mag/min NEAREST, wrap repeat\n        // GLTextureNearest = mag/min nearest, wrap clamp\n        // AudioTexture = whatever + luminance + width 512, height 2, border 0\n        // KeyTexture = whatever + luminance + width 256, height 2, border 0\n\n        //  magFilter can be: gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR or gl.NEAREST\n        //  wrapS/T can be: gl.CLAMP_TO_EDGE or gl.REPEAT\n\n        var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;\n        var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;\n        var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;\n        var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;\n        var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;\n\n        if (data.repeat)\n        {\n            wrapS = gl.REPEAT;\n            wrapT = gl.REPEAT;\n        }\n\n        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!data.flipY);\n\n        if (data.width)\n        {\n            var width = (data.width) ? data.width : 512;\n            var height = (data.height) ? data.height : 2;\n            var border = (data.border) ? data.border : 0;\n\n            // void texImage2D(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, ArrayBufferView? pixels);\n            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);\n        }\n        else\n        {\n            //  void texImage2D(GLenum target, GLint level, GLenum internalformat, GLenum format, GLenum type, ImageData? pixels);\n            gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);\n        }\n\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);\n    }\n\n    gl.uniform1i(uniform.uniformLocation, this.textureCount);\n\n    uniform._init = true;\n\n    this.textureCount++;\n\n};\n\n/**\n* Updates the shader uniform values.\n*\n* @method syncUniforms\n*/\nPIXI.PixiShader.prototype.syncUniforms = function()\n{\n    this.textureCount = 1;\n    var uniform;\n    var gl = this.gl;\n\n    //  This would probably be faster in an array and it would guarantee key order\n    for (var key in this.uniforms)\n    {\n        uniform = this.uniforms[key];\n\n        if (uniform.glValueLength === 1)\n        {\n            if (uniform.glMatrix === true)\n            {\n                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);\n            }\n            else\n            {\n                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);\n            }\n        }\n        else if (uniform.glValueLength === 2)\n        {\n            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);\n        }\n        else if (uniform.glValueLength === 3)\n        {\n            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);\n        }\n        else if (uniform.glValueLength === 4)\n        {\n            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);\n        }\n        else if (uniform.type === 'sampler2D')\n        {\n            if (uniform._init)\n            {\n                gl.activeTexture(gl['TEXTURE' + this.textureCount]);\n\n                if(uniform.value.baseTexture._dirty[gl.id])\n                {\n                    PIXI.instances[gl.id].updateTexture(uniform.value.baseTexture);\n                }\n                else\n                {\n                    // bind the current texture\n                    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id]);\n                }\n\n                //  gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture( uniform.value.baseTexture, gl));\n                gl.uniform1i(uniform.uniformLocation, this.textureCount);\n                this.textureCount++;\n            }\n            else\n            {\n                this.initSampler2D(uniform);\n            }\n        }\n    }\n\n};\n\n/**\n* Destroys the shader.\n*\n* @method destroy\n*/\nPIXI.PixiShader.prototype.destroy = function()\n{\n    this.gl.deleteProgram( this.program );\n    this.uniforms = null;\n    this.gl = null;\n\n    this.attributes = null;\n};\n\n/**\n* The Default Vertex shader source.\n*\n* @property defaultVertexSrc\n* @type String\n*/\nPIXI.PixiShader.defaultVertexSrc = [\n    'attribute vec2 aVertexPosition;',\n    'attribute vec2 aTextureCoord;',\n    'attribute vec4 aColor;',\n\n    'uniform vec2 projectionVector;',\n    'uniform vec2 offsetVector;',\n\n    'varying vec2 vTextureCoord;',\n    'varying vec4 vColor;',\n\n    'const vec2 center = vec2(-1.0, 1.0);',\n\n    'void main(void) {',\n    '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);',\n    '   vTextureCoord = aTextureCoord;',\n    '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',\n    '}'\n];\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class PixiFastShader\n* @constructor\n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.PixiFastShader = function(gl)\n{\n    /**\n     * @property _UID\n     * @type Number\n     * @private\n     */\n    this._UID = PIXI._UID++;\n    \n    /**\n     * @property gl\n     * @type WebGLContext\n     */\n    this.gl = gl;\n\n    /**\n     * The WebGL program.\n     * @property program\n     * @type Any\n     */\n    this.program = null;\n\n    /**\n     * The fragment shader.\n     * @property fragmentSrc\n     * @type Array\n     */\n    this.fragmentSrc = [\n        'precision lowp float;',\n        'varying vec2 vTextureCoord;',\n        'varying float vColor;',\n        'uniform sampler2D uSampler;',\n        'void main(void) {',\n        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',\n        '}'\n    ];\n\n    /**\n     * The vertex shader.\n     * @property vertexSrc\n     * @type Array\n     */\n    this.vertexSrc = [\n        'attribute vec2 aVertexPosition;',\n        'attribute vec2 aPositionCoord;',\n        'attribute vec2 aScale;',\n        'attribute float aRotation;',\n        'attribute vec2 aTextureCoord;',\n        'attribute float aColor;',\n\n        'uniform vec2 projectionVector;',\n        'uniform vec2 offsetVector;',\n        'uniform mat3 uMatrix;',\n\n        'varying vec2 vTextureCoord;',\n        'varying float vColor;',\n\n        'const vec2 center = vec2(-1.0, 1.0);',\n\n        'void main(void) {',\n        '   vec2 v;',\n        '   vec2 sv = aVertexPosition * aScale;',\n        '   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);',\n        '   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);',\n        '   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;',\n        '   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);',\n        '   vTextureCoord = aTextureCoord;',\n      //  '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',\n        '   vColor = aColor;',\n        '}'\n    ];\n\n    /**\n     * A local texture counter for multi-texture shaders.\n     * @property textureCount\n     * @type Number\n     */\n    this.textureCount = 0;\n    \n    this.init();\n};\n\nPIXI.PixiFastShader.prototype.constructor = PIXI.PixiFastShader;\n\n/**\n* Initialises the shader.\n* \n* @method init\n*/\nPIXI.PixiFastShader.prototype.init = function()\n{\n    var gl = this.gl;\n\n    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);\n    \n    gl.useProgram(program);\n\n    // get and store the uniforms for the shader\n    this.uSampler = gl.getUniformLocation(program, 'uSampler');\n\n    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');\n    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');\n    this.dimensions = gl.getUniformLocation(program, 'dimensions');\n    this.uMatrix = gl.getUniformLocation(program, 'uMatrix');\n\n    // get and store the attributes\n    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');\n    this.aPositionCoord = gl.getAttribLocation(program, 'aPositionCoord');\n\n    this.aScale = gl.getAttribLocation(program, 'aScale');\n    this.aRotation = gl.getAttribLocation(program, 'aRotation');\n\n    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');\n    this.colorAttribute = gl.getAttribLocation(program, 'aColor');\n   \n    // Begin worst hack eva //\n\n    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?\n    // maybe its somthing to do with the current state of the gl context.\n    // Im convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel\n    // If theres any webGL people that know why could happen please help :)\n    if(this.colorAttribute === -1)\n    {\n        this.colorAttribute = 2;\n    }\n\n    this.attributes = [this.aVertexPosition, this.aPositionCoord,  this.aScale, this.aRotation, this.aTextureCoord, this.colorAttribute];\n    \n    // End worst hack eva //\n\n    this.program = program;\n};\n\n/**\n* Destroys the shader.\n* \n* @method destroy\n*/\nPIXI.PixiFastShader.prototype.destroy = function()\n{\n    this.gl.deleteProgram( this.program );\n    this.uniforms = null;\n    this.gl = null;\n\n    this.attributes = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class StripShader\n* @constructor\n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.StripShader = function(gl)\n{\n    /**\n     * @property _UID\n     * @type Number\n     * @private\n     */\n    this._UID = PIXI._UID++;\n    \n    /**\n     * @property gl\n     * @type WebGLContext\n     */\n    this.gl = gl;\n\n    /**\n     * The WebGL program.\n     * @property program\n     * @type Any\n     */\n    this.program = null;\n\n    /**\n     * The fragment shader.\n     * @property fragmentSrc\n     * @type Array\n     */\n    this.fragmentSrc = [\n        'precision mediump float;',\n        'varying vec2 vTextureCoord;',\n     //   'varying float vColor;',\n        'uniform float alpha;',\n        'uniform sampler2D uSampler;',\n\n        'void main(void) {',\n        '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * alpha;',\n      //  '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',//gl_FragColor * alpha;',\n        '}'\n    ];\n\n    /**\n     * The vertex shader.\n     * @property vertexSrc\n     * @type Array\n     */\n    this.vertexSrc  = [\n        'attribute vec2 aVertexPosition;',\n        'attribute vec2 aTextureCoord;',\n        'uniform mat3 translationMatrix;',\n        'uniform vec2 projectionVector;',\n        'uniform vec2 offsetVector;',\n      //  'uniform float alpha;',\n       // 'uniform vec3 tint;',\n        'varying vec2 vTextureCoord;',\n      //  'varying vec4 vColor;',\n\n        'void main(void) {',\n        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',\n        '   v -= offsetVector.xyx;',\n        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',\n        '   vTextureCoord = aTextureCoord;',\n       // '   vColor = aColor * vec4(tint * alpha, alpha);',\n        '}'\n    ];\n\n    this.init();\n};\n\nPIXI.StripShader.prototype.constructor = PIXI.StripShader;\n\n/**\n* Initialises the shader.\n* \n* @method init\n*/\nPIXI.StripShader.prototype.init = function()\n{\n    var gl = this.gl;\n\n    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);\n    gl.useProgram(program);\n\n    // get and store the uniforms for the shader\n    this.uSampler = gl.getUniformLocation(program, 'uSampler');\n    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');\n    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');\n    this.colorAttribute = gl.getAttribLocation(program, 'aColor');\n    //this.dimensions = gl.getUniformLocation(this.program, 'dimensions');\n\n    // get and store the attributes\n    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');\n    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');\n\n    this.attributes = [this.aVertexPosition, this.aTextureCoord];\n\n    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');\n    this.alpha = gl.getUniformLocation(program, 'alpha');\n\n    this.program = program;\n};\n\n/**\n* Destroys the shader.\n* \n* @method destroy\n*/\nPIXI.StripShader.prototype.destroy = function()\n{\n    this.gl.deleteProgram( this.program );\n    this.uniforms = null;\n    this.gl = null;\n\n    this.attribute = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class PrimitiveShader\n* @constructor\n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.PrimitiveShader = function(gl)\n{\n    /**\n     * @property _UID\n     * @type Number\n     * @private\n     */\n    this._UID = PIXI._UID++;\n \n    /**\n     * @property gl\n     * @type WebGLContext\n     */\n    this.gl = gl;\n\n    /**\n     * The WebGL program.\n     * @property program\n     * @type Any\n     */\n    this.program = null;\n\n    /**\n     * The fragment shader.\n     * @property fragmentSrc\n     * @type Array\n     */\n    this.fragmentSrc = [\n        'precision mediump float;',\n        'varying vec4 vColor;',\n\n        'void main(void) {',\n        '   gl_FragColor = vColor;',\n        '}'\n    ];\n\n    /**\n     * The vertex shader.\n     * @property vertexSrc\n     * @type Array\n     */\n    this.vertexSrc  = [\n        'attribute vec2 aVertexPosition;',\n        'attribute vec4 aColor;',\n        'uniform mat3 translationMatrix;',\n        'uniform vec2 projectionVector;',\n        'uniform vec2 offsetVector;',\n        'uniform float alpha;',\n        'uniform float flipY;',\n        'uniform vec3 tint;',\n        'varying vec4 vColor;',\n\n        'void main(void) {',\n        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',\n        '   v -= offsetVector.xyx;',\n        '   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);',\n        '   vColor = aColor * vec4(tint * alpha, alpha);',\n        '}'\n    ];\n\n    this.init();\n};\n\nPIXI.PrimitiveShader.prototype.constructor = PIXI.PrimitiveShader;\n\n/**\n* Initialises the shader.\n* \n* @method init\n*/\nPIXI.PrimitiveShader.prototype.init = function()\n{\n    var gl = this.gl;\n\n    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);\n    gl.useProgram(program);\n\n    // get and store the uniforms for the shader\n    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');\n    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');\n    this.tintColor = gl.getUniformLocation(program, 'tint');\n    this.flipY = gl.getUniformLocation(program, 'flipY');\n\n    // get and store the attributes\n    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');\n    this.colorAttribute = gl.getAttribLocation(program, 'aColor');\n\n    this.attributes = [this.aVertexPosition, this.colorAttribute];\n\n    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');\n    this.alpha = gl.getUniformLocation(program, 'alpha');\n\n    this.program = program;\n};\n\n/**\n* Destroys the shader.\n* \n* @method destroy\n*/\nPIXI.PrimitiveShader.prototype.destroy = function()\n{\n    this.gl.deleteProgram( this.program );\n    this.uniforms = null;\n    this.gl = null;\n\n    this.attributes = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class ComplexPrimitiveShader\n* @constructor\n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.ComplexPrimitiveShader = function(gl)\n{\n    /**\n     * @property _UID\n     * @type Number\n     * @private\n     */\n    this._UID = PIXI._UID++;\n\n    /**\n     * @property gl\n     * @type WebGLContext\n     */\n    this.gl = gl;\n\n    /**\n     * The WebGL program.\n     * @property program\n     * @type Any\n     */\n    this.program = null;\n\n    /**\n     * The fragment shader.\n     * @property fragmentSrc\n     * @type Array\n     */\n    this.fragmentSrc = [\n\n        'precision mediump float;',\n\n        'varying vec4 vColor;',\n\n        'void main(void) {',\n        '   gl_FragColor = vColor;',\n        '}'\n    ];\n\n    /**\n     * The vertex shader.\n     * @property vertexSrc\n     * @type Array\n     */\n    this.vertexSrc  = [\n        'attribute vec2 aVertexPosition;',\n        //'attribute vec4 aColor;',\n        'uniform mat3 translationMatrix;',\n        'uniform vec2 projectionVector;',\n        'uniform vec2 offsetVector;',\n        \n        'uniform vec3 tint;',\n        'uniform float alpha;',\n        'uniform vec3 color;',\n        'uniform float flipY;',\n        'varying vec4 vColor;',\n\n        'void main(void) {',\n        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',\n        '   v -= offsetVector.xyx;',\n        '   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);',\n        '   vColor = vec4(color * alpha * tint, alpha);',//\" * vec4(tint * alpha, alpha);',\n        '}'\n    ];\n\n    this.init();\n};\n\nPIXI.ComplexPrimitiveShader.prototype.constructor = PIXI.ComplexPrimitiveShader;\n\n/**\n* Initialises the shader.\n* \n* @method init\n*/\nPIXI.ComplexPrimitiveShader.prototype.init = function()\n{\n    var gl = this.gl;\n\n    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);\n    gl.useProgram(program);\n\n    // get and store the uniforms for the shader\n    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');\n    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');\n    this.tintColor = gl.getUniformLocation(program, 'tint');\n    this.color = gl.getUniformLocation(program, 'color');\n    this.flipY = gl.getUniformLocation(program, 'flipY');\n\n    // get and store the attributes\n    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');\n   // this.colorAttribute = gl.getAttribLocation(program, 'aColor');\n\n    this.attributes = [this.aVertexPosition, this.colorAttribute];\n\n    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');\n    this.alpha = gl.getUniformLocation(program, 'alpha');\n\n    this.program = program;\n};\n\n/**\n* Destroys the shader.\n* \n* @method destroy\n*/\nPIXI.ComplexPrimitiveShader.prototype.destroy = function()\n{\n    this.gl.deleteProgram( this.program );\n    this.uniforms = null;\n    this.gl = null;\n\n    this.attribute = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\nPIXI.glContexts = []; // this is where we store the webGL contexts for easy access.\nPIXI.instances = [];\n\n/**\n * The WebGLRenderer draws the stage and all its content onto a webGL enabled canvas. This renderer\n * should be used for browsers that support webGL. This Render works by automatically managing webGLBatchs.\n * So no need for Sprite Batches or Sprite Clouds.\n * Don't forget to add the view to your DOM or you will not see anything :)\n *\n * @class WebGLRenderer\n * @constructor\n * @param game {Phaser.Game} A reference to the Phaser Game instance\n */\nPIXI.WebGLRenderer = function(game) {\n\n    /**\n    * @property {Phaser.Game} game - A reference to the Phaser Game instance.\n    */\n    this.game = game;\n\n    if (!PIXI.defaultRenderer)\n    {\n        PIXI.defaultRenderer = this;\n    }\n\n    /**\n     * @property type\n     * @type Number\n     */\n    this.type = PIXI.WEBGL_RENDERER;\n\n    /**\n     * The resolution of the renderer\n     *\n     * @property resolution\n     * @type Number\n     * @default 1\n     */\n    this.resolution = game.resolution;\n\n    /**\n     * Whether the render view is transparent\n     *\n     * @property transparent\n     * @type Boolean\n     */\n    this.transparent = game.transparent;\n\n    /**\n     * Whether the render view should be resized automatically\n     *\n     * @property autoResize\n     * @type Boolean\n     */\n    this.autoResize = false;\n\n    /**\n     * The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.\n     *\n     * @property preserveDrawingBuffer\n     * @type Boolean\n     */\n    this.preserveDrawingBuffer = game.preserveDrawingBuffer;\n\n    /**\n     * This sets if the WebGLRenderer will clear the context texture or not before the new render pass. If true:\n     * If the Stage is NOT transparent, Pixi will clear to alpha (0, 0, 0, 0).\n     * If the Stage is transparent, Pixi will clear to the target Stage's background color.\n     * Disable this by setting this to false. For example: if your game has a canvas filling background image, you often don't need this set.\n     *\n     * @property clearBeforeRender\n     * @type Boolean\n     * @default\n     */\n    this.clearBeforeRender = game.clearBeforeRender;\n\n    /**\n     * The width of the canvas view\n     *\n     * @property width\n     * @type Number\n     */\n    this.width = game.width;\n\n    /**\n     * The height of the canvas view\n     *\n     * @property height\n     * @type Number\n     */\n    this.height = game.height;\n\n    /**\n     * The canvas element that everything is drawn to\n     *\n     * @property view\n     * @type HTMLCanvasElement\n     */\n    this.view = game.canvas;\n\n    /**\n     * @property _contextOptions\n     * @type Object\n     * @private\n     */\n    this._contextOptions = {\n        alpha: this.transparent,\n        antialias: game.antialias,\n        premultipliedAlpha: this.transparent && this.transparent !== 'notMultiplied',\n        stencil: true,\n        preserveDrawingBuffer: this.preserveDrawingBuffer\n    };\n\n    /**\n     * @property projection\n     * @type Point\n     */\n    this.projection = new PIXI.Point();\n\n    /**\n     * @property offset\n     * @type Point\n     */\n    this.offset = new PIXI.Point();\n\n    // time to create the render managers! each one focuses on managing a state in webGL\n\n    /**\n     * Deals with managing the shader programs and their attribs\n     * @property shaderManager\n     * @type WebGLShaderManager\n     */\n    this.shaderManager = new PIXI.WebGLShaderManager();\n\n    /**\n     * Manages the rendering of sprites\n     * @property spriteBatch\n     * @type WebGLSpriteBatch\n     */\n    this.spriteBatch = new PIXI.WebGLSpriteBatch();\n\n    /**\n     * Manages the masks using the stencil buffer\n     * @property maskManager\n     * @type WebGLMaskManager\n     */\n    this.maskManager = new PIXI.WebGLMaskManager();\n\n    /**\n     * Manages the filters\n     * @property filterManager\n     * @type WebGLFilterManager\n     */\n    this.filterManager = new PIXI.WebGLFilterManager();\n\n    /**\n     * Manages the stencil buffer\n     * @property stencilManager\n     * @type WebGLStencilManager\n     */\n    this.stencilManager = new PIXI.WebGLStencilManager();\n\n    /**\n     * Manages the blendModes\n     * @property blendModeManager\n     * @type WebGLBlendModeManager\n     */\n    this.blendModeManager = new PIXI.WebGLBlendModeManager();\n\n    /**\n     * @property renderSession\n     * @type Object\n     */\n    this.renderSession = {};\n\n    //  Needed?\n    this.renderSession.game = this.game;\n    this.renderSession.gl = this.gl;\n    this.renderSession.drawCount = 0;\n    this.renderSession.shaderManager = this.shaderManager;\n    this.renderSession.maskManager = this.maskManager;\n    this.renderSession.filterManager = this.filterManager;\n    this.renderSession.blendModeManager = this.blendModeManager;\n    this.renderSession.spriteBatch = this.spriteBatch;\n    this.renderSession.stencilManager = this.stencilManager;\n    this.renderSession.renderer = this;\n    this.renderSession.resolution = this.resolution;\n\n    // time init the context..\n    this.initContext();\n\n    // map some webGL blend modes..\n    this.mapBlendModes();\n\n};\n\n// constructor\nPIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;\n\n/**\n* @method initContext\n*/\nPIXI.WebGLRenderer.prototype.initContext = function()\n{\n    var gl = this.view.getContext('webgl', this._contextOptions) || this.view.getContext('experimental-webgl', this._contextOptions);\n\n    this.gl = gl;\n\n    if (!gl) {\n        // fail, not able to get a context\n        throw new Error('This browser does not support webGL. Try using the canvas renderer');\n    }\n\n    this.glContextId = gl.id = PIXI.WebGLRenderer.glContextId++;\n\n    PIXI.glContexts[this.glContextId] = gl;\n\n    PIXI.instances[this.glContextId] = this;\n\n    // set up the default pixi settings..\n    gl.disable(gl.DEPTH_TEST);\n    gl.disable(gl.CULL_FACE);\n    gl.enable(gl.BLEND);\n\n    // need to set the context for all the managers...\n    this.shaderManager.setContext(gl);\n    this.spriteBatch.setContext(gl);\n    this.maskManager.setContext(gl);\n    this.filterManager.setContext(gl);\n    this.blendModeManager.setContext(gl);\n    this.stencilManager.setContext(gl);\n\n    this.renderSession.gl = this.gl;\n\n    // now resize and we are good to go!\n    this.resize(this.width, this.height);\n};\n\n/**\n * Renders the stage to its webGL view\n *\n * @method render\n * @param stage {Stage} the Stage element to be rendered\n */\nPIXI.WebGLRenderer.prototype.render = function(stage)\n{\n    // no point rendering if our context has been blown up!\n    if (this.contextLost)\n    {\n        return;\n    }\n\n    var gl = this.gl;\n\n    // -- Does this need to be set every frame? -- //\n    gl.viewport(0, 0, this.width, this.height);\n\n    // make sure we are bound to the main frame buffer\n    gl.bindFramebuffer(gl.FRAMEBUFFER, null);\n\n    if (this.game.clearBeforeRender)\n    {\n        gl.clearColor(stage._bgColor.r, stage._bgColor.g, stage._bgColor.b, stage._bgColor.a);\n\n        gl.clear(gl.COLOR_BUFFER_BIT);\n    }\n\n    this.offset.x = this.game.camera._shake.x;\n    this.offset.y = this.game.camera._shake.y;\n\n    this.renderDisplayObject(stage, this.projection);\n};\n\n/**\n * Renders a Display Object.\n *\n * @method renderDisplayObject\n * @param displayObject {DisplayObject} The DisplayObject to render\n * @param projection {Point} The projection\n * @param buffer {Array} a standard WebGL buffer\n */\nPIXI.WebGLRenderer.prototype.renderDisplayObject = function(displayObject, projection, buffer, matrix)\n{\n    this.renderSession.blendModeManager.setBlendMode(PIXI.blendModes.NORMAL);\n\n    // reset the render session data..\n    this.renderSession.drawCount = 0;\n\n    // make sure to flip the Y if using a render texture..\n    this.renderSession.flipY = buffer ? -1 : 1;\n\n    // set the default projection\n    this.renderSession.projection = projection;\n\n    //set the default offset\n    this.renderSession.offset = this.offset;\n\n    // start the sprite batch\n    this.spriteBatch.begin(this.renderSession);\n\n    // start the filter manager\n    this.filterManager.begin(this.renderSession, buffer);\n\n    // render the scene!\n    displayObject._renderWebGL(this.renderSession, matrix);\n\n    // finish the sprite batch\n    this.spriteBatch.end();\n};\n\n/**\n * Resizes the webGL view to the specified width and height.\n *\n * @method resize\n * @param width {Number} the new width of the webGL view\n * @param height {Number} the new height of the webGL view\n */\nPIXI.WebGLRenderer.prototype.resize = function(width, height)\n{\n    this.width = width * this.resolution;\n    this.height = height * this.resolution;\n\n    this.view.width = this.width;\n    this.view.height = this.height;\n\n    if (this.autoResize) {\n        this.view.style.width = this.width / this.resolution + 'px';\n        this.view.style.height = this.height / this.resolution + 'px';\n    }\n\n    this.gl.viewport(0, 0, this.width, this.height);\n\n    this.projection.x =  this.width / 2 / this.resolution;\n    this.projection.y =  -this.height / 2 / this.resolution;\n};\n\n/**\n * Updates and Creates a WebGL texture for the renderers context.\n *\n * @method updateTexture\n * @param texture {Texture} the texture to update\n * @return {boolean} True if the texture was successfully bound, otherwise false.\n */\nPIXI.WebGLRenderer.prototype.updateTexture = function(texture)\n{\n    if (!texture.hasLoaded)\n    {\n        return false;\n    }\n\n    var gl = this.gl;\n\n    if (!texture._glTextures[gl.id])\n    {\n        texture._glTextures[gl.id] = gl.createTexture();\n    }\n\n    gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);\n\n    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultipliedAlpha);\n\n    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);\n\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);\n\n    if (texture.mipmap && PIXI.isPowerOfTwo(texture.width, texture.height))\n    {\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);\n        gl.generateMipmap(gl.TEXTURE_2D);\n    }\n    else\n    {\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);\n    }\n\n    if (!texture._powerOf2)\n    {\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);\n    }\n    else\n    {\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);\n        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);\n    }\n\n    texture._dirty[gl.id] = false;\n\n    // return texture._glTextures[gl.id];\n    return true;\n\n};\n\n/**\n * Removes everything from the renderer (event listeners, spritebatch, etc...)\n *\n * @method destroy\n */\nPIXI.WebGLRenderer.prototype.destroy = function()\n{\n    PIXI.glContexts[this.glContextId] = null;\n\n    this.projection = null;\n    this.offset = null;\n\n    this.shaderManager.destroy();\n    this.spriteBatch.destroy();\n    this.maskManager.destroy();\n    this.filterManager.destroy();\n\n    this.shaderManager = null;\n    this.spriteBatch = null;\n    this.maskManager = null;\n    this.filterManager = null;\n\n    this.gl = null;\n    this.renderSession = null;\n\n    PIXI.CanvasPool.remove(this);\n\n    PIXI.instances[this.glContextId] = null;\n\n    PIXI.WebGLRenderer.glContextId--;\n};\n\n/**\n * Maps Pixi blend modes to WebGL blend modes.\n *\n * @method mapBlendModes\n */\nPIXI.WebGLRenderer.prototype.mapBlendModes = function()\n{\n    var gl = this.gl;\n\n    if (!PIXI.blendModesWebGL)\n    {\n        var b = [];\n        var modes = PIXI.blendModes;\n\n        b[modes.NORMAL]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.ADD]           = [gl.SRC_ALPHA, gl.DST_ALPHA];\n        b[modes.MULTIPLY]      = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.SCREEN]        = [gl.SRC_ALPHA, gl.ONE];\n        b[modes.OVERLAY]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.DARKEN]        = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.LIGHTEN]       = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.COLOR_DODGE]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.COLOR_BURN]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.HARD_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.SOFT_LIGHT]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.DIFFERENCE]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.EXCLUSION]     = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.HUE]           = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.SATURATION]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.COLOR]         = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n        b[modes.LUMINOSITY]    = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];\n\n        PIXI.blendModesWebGL = b;\n    }\n};\n\nPIXI.WebGLRenderer.glContextId = 0;\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class WebGLBlendModeManager\n* @constructor\n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.WebGLBlendModeManager = function()\n{\n    /**\n     * @property currentBlendMode\n     * @type Number\n     */\n    this.currentBlendMode = 99999;\n};\n\nPIXI.WebGLBlendModeManager.prototype.constructor = PIXI.WebGLBlendModeManager;\n\n/**\n * Sets the WebGL Context.\n *\n * @method setContext\n * @param gl {WebGLContext} the current WebGL drawing context\n */\nPIXI.WebGLBlendModeManager.prototype.setContext = function(gl)\n{\n    this.gl = gl;\n};\n\n/**\n* Sets-up the given blendMode from WebGL's point of view.\n* \n* @method setBlendMode \n* @param blendMode {Number} the blendMode, should be a Pixi const, such as PIXI.BlendModes.ADD\n*/\nPIXI.WebGLBlendModeManager.prototype.setBlendMode = function(blendMode)\n{\n    if(this.currentBlendMode === blendMode)return false;\n\n    this.currentBlendMode = blendMode;\n    \n    var blendModeWebGL = PIXI.blendModesWebGL[this.currentBlendMode];\n\n    if (blendModeWebGL)\n    {\n        this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);\n    }\n    \n    return true;\n};\n\n/**\n* Destroys this object.\n* \n* @method destroy\n*/\nPIXI.WebGLBlendModeManager.prototype.destroy = function()\n{\n    this.gl = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class WebGLMaskManager\n* @constructor\n* @private\n*/\nPIXI.WebGLMaskManager = function()\n{\n};\n\nPIXI.WebGLMaskManager.prototype.constructor = PIXI.WebGLMaskManager;\n\n/**\n* Sets the drawing context to the one given in parameter.\n* \n* @method setContext \n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.WebGLMaskManager.prototype.setContext = function(gl)\n{\n    this.gl = gl;\n};\n\n/**\n* Applies the Mask and adds it to the current filter stack.\n* \n* @method pushMask\n* @param maskData {Array}\n* @param renderSession {Object}\n*/\nPIXI.WebGLMaskManager.prototype.pushMask = function(maskData, renderSession)\n{\n    var gl = renderSession.gl;\n\n    if (maskData.dirty)\n    {\n        PIXI.WebGLGraphics.updateGraphics(maskData, gl);\n    }\n\n    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)\n    {\n        return;\n    }\n\n    renderSession.stencilManager.pushStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);\n};\n\n/**\n* Removes the last filter from the filter stack and doesn't return it.\n* \n* @method popMask\n* @param maskData {Array}\n* @param renderSession {Object} an object containing all the useful parameters\n*/\nPIXI.WebGLMaskManager.prototype.popMask = function(maskData, renderSession)\n{\n    var gl = this.gl;\n\n    if (maskData._webGL[gl.id] === undefined || maskData._webGL[gl.id].data === undefined || maskData._webGL[gl.id].data.length === 0)\n    {\n        return;\n    }\n\n    renderSession.stencilManager.popStencil(maskData, maskData._webGL[gl.id].data[0], renderSession);\n\n};\n\n/**\n* Destroys the mask stack.\n* \n* @method destroy\n*/\nPIXI.WebGLMaskManager.prototype.destroy = function()\n{\n    this.gl = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class WebGLStencilManager\n* @constructor\n* @private\n*/\nPIXI.WebGLStencilManager = function()\n{\n    this.stencilStack = [];\n    this.reverse = true;\n    this.count = 0;\n};\n\n/**\n* Sets the drawing context to the one given in parameter.\n* \n* @method setContext \n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.WebGLStencilManager.prototype.setContext = function(gl)\n{\n    this.gl = gl;\n};\n\n/**\n* Applies the Mask and adds it to the current filter stack.\n* \n* @method pushMask\n* @param graphics {Graphics}\n* @param webGLData {Array}\n* @param renderSession {Object}\n*/\nPIXI.WebGLStencilManager.prototype.pushStencil = function(graphics, webGLData, renderSession)\n{\n    var gl = this.gl;\n    this.bindGraphics(graphics, webGLData, renderSession);\n\n    if(this.stencilStack.length === 0)\n    {\n        gl.enable(gl.STENCIL_TEST);\n        gl.clear(gl.STENCIL_BUFFER_BIT);\n        this.reverse = true;\n        this.count = 0;\n    }\n\n    this.stencilStack.push(webGLData);\n\n    var level = this.count;\n\n    gl.colorMask(false, false, false, false);\n\n    gl.stencilFunc(gl.ALWAYS,0,0xFF);\n    gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);\n\n    // draw the triangle strip!\n\n    if(webGLData.mode === 1)\n    {\n        gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );\n       \n        if(this.reverse)\n        {\n            gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);\n            gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);\n        }\n        else\n        {\n            gl.stencilFunc(gl.EQUAL,level, 0xFF);\n            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);\n        }\n\n        // draw a quad to increment..\n        gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );\n               \n        if(this.reverse)\n        {\n            gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);\n        }\n        else\n        {\n            gl.stencilFunc(gl.EQUAL,level+1, 0xFF);\n        }\n\n        this.reverse = !this.reverse;\n    }\n    else\n    {\n        if(!this.reverse)\n        {\n            gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);\n            gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);\n        }\n        else\n        {\n            gl.stencilFunc(gl.EQUAL,level, 0xFF);\n            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);\n        }\n\n        gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );\n\n        if(!this.reverse)\n        {\n            gl.stencilFunc(gl.EQUAL,0xFF-(level+1), 0xFF);\n        }\n        else\n        {\n            gl.stencilFunc(gl.EQUAL,level+1, 0xFF);\n        }\n    }\n\n    gl.colorMask(true, true, true, true);\n    gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);\n\n    this.count++;\n};\n\n/**\n * TODO this does not belong here!\n * \n * @method bindGraphics\n * @param graphics {Graphics}\n * @param webGLData {Array}\n * @param renderSession {Object}\n */\nPIXI.WebGLStencilManager.prototype.bindGraphics = function(graphics, webGLData, renderSession)\n{\n    //if(this._currentGraphics === graphics)return;\n    this._currentGraphics = graphics;\n\n    var gl = this.gl;\n\n     // bind the graphics object..\n    var projection = renderSession.projection,\n        offset = renderSession.offset,\n        shader;// = renderSession.shaderManager.primitiveShader;\n\n    if(webGLData.mode === 1)\n    {\n        shader = renderSession.shaderManager.complexPrimitiveShader;\n\n        renderSession.shaderManager.setShader( shader );\n\n        gl.uniform1f(shader.flipY, renderSession.flipY);\n       \n        gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));\n\n        gl.uniform2f(shader.projectionVector, projection.x, -projection.y);\n        gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);\n\n        gl.uniform3fv(shader.tintColor, PIXI.hex2rgb(graphics.tint));\n        gl.uniform3fv(shader.color, webGLData.color);\n\n        gl.uniform1f(shader.alpha, graphics.worldAlpha * webGLData.alpha);\n\n        gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);\n\n        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 2, 0);\n\n\n        // now do the rest..\n        // set the index buffer!\n        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);\n    }\n    else\n    {\n        //renderSession.shaderManager.activatePrimitiveShader();\n        shader = renderSession.shaderManager.primitiveShader;\n        renderSession.shaderManager.setShader( shader );\n\n        gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));\n\n        gl.uniform1f(shader.flipY, renderSession.flipY);\n        gl.uniform2f(shader.projectionVector, projection.x, -projection.y);\n        gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);\n\n        gl.uniform3fv(shader.tintColor, PIXI.hex2rgb(graphics.tint));\n\n        gl.uniform1f(shader.alpha, graphics.worldAlpha);\n        \n        gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);\n\n        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);\n        gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);\n\n        // set the index buffer!\n        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);\n    }\n};\n\n/**\n * @method popStencil\n * @param graphics {Graphics}\n * @param webGLData {Array}\n * @param renderSession {Object}\n */\nPIXI.WebGLStencilManager.prototype.popStencil = function(graphics, webGLData, renderSession)\n{\n\tvar gl = this.gl;\n    this.stencilStack.pop();\n   \n    this.count--;\n\n    if(this.stencilStack.length === 0)\n    {\n        // the stack is empty!\n        gl.disable(gl.STENCIL_TEST);\n\n    }\n    else\n    {\n\n        var level = this.count;\n\n        this.bindGraphics(graphics, webGLData, renderSession);\n\n        gl.colorMask(false, false, false, false);\n    \n        if(webGLData.mode === 1)\n        {\n            this.reverse = !this.reverse;\n\n            if(this.reverse)\n            {\n                gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);\n                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);\n            }\n            else\n            {\n                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);\n                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);\n            }\n\n            // draw a quad to increment..\n            gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, ( webGLData.indices.length - 4 ) * 2 );\n            \n            gl.stencilFunc(gl.ALWAYS,0,0xFF);\n            gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);\n\n            // draw the triangle strip!\n            gl.drawElements(gl.TRIANGLE_FAN,  webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0 );\n           \n            if(!this.reverse)\n            {\n                gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);\n            }\n            else\n            {\n                gl.stencilFunc(gl.EQUAL,level, 0xFF);\n            }\n\n        }\n        else\n        {\n          //  console.log(\"<<>>\")\n            if(!this.reverse)\n            {\n                gl.stencilFunc(gl.EQUAL, 0xFF - (level+1), 0xFF);\n                gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);\n            }\n            else\n            {\n                gl.stencilFunc(gl.EQUAL,level+1, 0xFF);\n                gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);\n            }\n\n            gl.drawElements(gl.TRIANGLE_STRIP,  webGLData.indices.length, gl.UNSIGNED_SHORT, 0 );\n\n            if(!this.reverse)\n            {\n                gl.stencilFunc(gl.EQUAL,0xFF-(level), 0xFF);\n            }\n            else\n            {\n                gl.stencilFunc(gl.EQUAL,level, 0xFF);\n            }\n        }\n\n        gl.colorMask(true, true, true, true);\n        gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);\n\n\n    }\n};\n\n/**\n* Destroys the mask stack.\n* \n* @method destroy\n*/\nPIXI.WebGLStencilManager.prototype.destroy = function()\n{\n    this.stencilStack = null;\n    this.gl = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class WebGLShaderManager\n* @constructor\n* @private\n*/\nPIXI.WebGLShaderManager = function()\n{\n    /**\n     * @property maxAttibs\n     * @type Number\n     */\n    this.maxAttibs = 10;\n\n    /**\n     * @property attribState\n     * @type Array\n     */\n    this.attribState = [];\n\n    /**\n     * @property tempAttribState\n     * @type Array\n     */\n    this.tempAttribState = [];\n\n    for (var i = 0; i < this.maxAttibs; i++)\n    {\n        this.attribState[i] = false;\n    }\n\n    /**\n     * @property stack\n     * @type Array\n     */\n    this.stack = [];\n\n};\n\nPIXI.WebGLShaderManager.prototype.constructor = PIXI.WebGLShaderManager;\n\n/**\n* Initialises the context and the properties.\n* \n* @method setContext \n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.WebGLShaderManager.prototype.setContext = function(gl)\n{\n    this.gl = gl;\n    \n    // the next one is used for rendering primitives\n    this.primitiveShader = new PIXI.PrimitiveShader(gl);\n\n    // the next one is used for rendering triangle strips\n    this.complexPrimitiveShader = new PIXI.ComplexPrimitiveShader(gl);\n\n    // this shader is used for the default sprite rendering\n    this.defaultShader = new PIXI.PixiShader(gl);\n\n    // this shader is used for the fast sprite rendering\n    this.fastShader = new PIXI.PixiFastShader(gl);\n\n    // the next one is used for rendering triangle strips\n    this.stripShader = new PIXI.StripShader(gl);\n\n    this.setShader(this.defaultShader);\n};\n\n/**\n* Takes the attributes given in parameters.\n* \n* @method setAttribs\n* @param attribs {Array} attribs \n*/\nPIXI.WebGLShaderManager.prototype.setAttribs = function(attribs)\n{\n    // reset temp state\n    var i;\n\n    for (i = 0; i < this.tempAttribState.length; i++)\n    {\n        this.tempAttribState[i] = false;\n    }\n\n    // set the new attribs\n    for (i = 0; i < attribs.length; i++)\n    {\n        var attribId = attribs[i];\n        this.tempAttribState[attribId] = true;\n    }\n\n    var gl = this.gl;\n\n    for (i = 0; i < this.attribState.length; i++)\n    {\n        if(this.attribState[i] !== this.tempAttribState[i])\n        {\n            this.attribState[i] = this.tempAttribState[i];\n\n            if(this.tempAttribState[i])\n            {\n                gl.enableVertexAttribArray(i);\n            }\n            else\n            {\n                gl.disableVertexAttribArray(i);\n            }\n        }\n    }\n};\n\n/**\n* Sets the current shader.\n* \n* @method setShader\n* @param shader {Any}\n*/\nPIXI.WebGLShaderManager.prototype.setShader = function(shader)\n{\n    if(this._currentId === shader._UID)return false;\n    \n    this._currentId = shader._UID;\n\n    this.currentShader = shader;\n\n    this.gl.useProgram(shader.program);\n    this.setAttribs(shader.attributes);\n\n    return true;\n};\n\n/**\n* Destroys this object.\n* \n* @method destroy\n*/\nPIXI.WebGLShaderManager.prototype.destroy = function()\n{\n    this.attribState = null;\n\n    this.tempAttribState = null;\n\n    this.primitiveShader.destroy();\n\n    this.complexPrimitiveShader.destroy();\n\n    this.defaultShader.destroy();\n\n    this.fastShader.destroy();\n\n    this.stripShader.destroy();\n\n    this.gl = null;\n};\n\n/**\n * @author Mat Groves\n * \n * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/\n * for creating the original pixi version!\n * Also a thanks to https://github.com/bchevalier for tweaking the tint and alpha so that they now share 4 bytes on the vertex buffer\n * \n * Heavily inspired by LibGDX's WebGLSpriteBatch:\n * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java\n */\n\n /**\n *\n * @class WebGLSpriteBatch\n * @private\n * @constructor\n */\nPIXI.WebGLSpriteBatch = function()\n{\n    /**\n     * @property vertSize\n     * @type Number\n     */\n    this.vertSize = 5;\n\n    /**\n     * The number of images in the SpriteBatch before it flushes\n     * @property size\n     * @type Number\n     */\n    this.size = 2000;//Math.pow(2, 16) /  this.vertSize;\n\n    //the total number of bytes in our batch\n    var numVerts = this.size * 4 * 4 * this.vertSize;\n    //the total number of indices in our batch\n    var numIndices = this.size * 6;\n\n    /**\n    * Holds the vertices\n    *\n    * @property vertices\n    * @type ArrayBuffer\n    */\n    this.vertices = new PIXI.ArrayBuffer(numVerts);\n\n    /**\n    * View on the vertices as a Float32Array\n    *\n    * @property positions\n    * @type Float32Array\n    */\n    this.positions = new PIXI.Float32Array(this.vertices);\n\n    /**\n    * View on the vertices as a Uint32Array\n    *\n    * @property colors\n    * @type Uint32Array\n    */\n    this.colors = new PIXI.Uint32Array(this.vertices);\n\n    /**\n     * Holds the indices\n     *\n     * @property indices\n     * @type Uint16Array\n     */\n    this.indices = new PIXI.Uint16Array(numIndices);\n    \n    /**\n     * @property lastIndexCount\n     * @type Number\n     */\n    this.lastIndexCount = 0;\n\n    for (var i=0, j=0; i < numIndices; i += 6, j += 4)\n    {\n        this.indices[i + 0] = j + 0;\n        this.indices[i + 1] = j + 1;\n        this.indices[i + 2] = j + 2;\n        this.indices[i + 3] = j + 0;\n        this.indices[i + 4] = j + 2;\n        this.indices[i + 5] = j + 3;\n    }\n\n    /**\n     * @property drawing\n     * @type Boolean\n     */\n    this.drawing = false;\n\n    /**\n     * @property currentBatchSize\n     * @type Number\n     */\n    this.currentBatchSize = 0;\n\n    /**\n     * @property currentBaseTexture\n     * @type BaseTexture\n     */\n    this.currentBaseTexture = null;\n\n    /**\n     * @property dirty\n     * @type Boolean\n     */\n    this.dirty = true;\n\n    /**\n     * @property textures\n     * @type Array\n     */\n    this.textures = [];\n\n    /**\n     * @property blendModes\n     * @type Array\n     */\n    this.blendModes = [];\n\n    /**\n     * @property shaders\n     * @type Array\n     */\n    this.shaders = [];\n\n    /**\n     * @property sprites\n     * @type Array\n     */\n    this.sprites = [];\n\n    /**\n     * @property defaultShader\n     * @type AbstractFilter\n     */\n    this.defaultShader = new PIXI.AbstractFilter([\n        'precision lowp float;',\n        'varying vec2 vTextureCoord;',\n        'varying vec4 vColor;',\n        'uniform sampler2D uSampler;',\n        'void main(void) {',\n        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',\n        '}'\n    ]);\n};\n\n/**\n* @method setContext\n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.WebGLSpriteBatch.prototype.setContext = function(gl)\n{\n    this.gl = gl;\n\n    // create a couple of buffers\n    this.vertexBuffer = gl.createBuffer();\n    this.indexBuffer = gl.createBuffer();\n\n    // 65535 is max index, so 65535 / 6 = 10922.\n\n    //upload the index data\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);\n    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);\n\n    this.currentBlendMode = 99999;\n\n    var shader = new PIXI.PixiShader(gl);\n\n    shader.fragmentSrc = this.defaultShader.fragmentSrc;\n    shader.uniforms = {};\n    shader.init();\n\n    this.defaultShader.shaders[gl.id] = shader;\n};\n\n/**\n* @method begin\n* @param renderSession {Object} The RenderSession object\n*/\nPIXI.WebGLSpriteBatch.prototype.begin = function(renderSession)\n{\n    this.renderSession = renderSession;\n    this.shader = this.renderSession.shaderManager.defaultShader;\n\n    this.start();\n};\n\n/**\n* @method end\n*/\nPIXI.WebGLSpriteBatch.prototype.end = function()\n{\n    this.flush();\n};\n\n/**\n* @method render\n* @param sprite {Sprite} the sprite to render when using this spritebatch\n* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.\n*/\nPIXI.WebGLSpriteBatch.prototype.render = function(sprite, matrix)\n{\n    var texture = sprite.texture;\n\n    //  They provided an alternative rendering matrix, so use it\n    var wt = sprite.worldTransform;\n\n    if (matrix)\n    {\n        wt = matrix;\n    }\n\n    // check texture..\n    if (this.currentBatchSize >= this.size)\n    {\n        this.flush();\n        this.currentBaseTexture = texture.baseTexture;\n    }\n\n    // get the uvs for the texture\n    var uvs = texture._uvs;\n\n    // if the uvs have not updated then no point rendering just yet!\n    if (!uvs)\n    {\n        return;\n    }\n\n    var aX = sprite.anchor.x;\n    var aY = sprite.anchor.y;\n\n    var w0, w1, h0, h1;\n        \n    if (texture.trim)\n    {\n        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords.\n        var trim = texture.trim;\n\n        w1 = trim.x - aX * trim.width;\n        w0 = w1 + texture.crop.width;\n\n        h1 = trim.y - aY * trim.height;\n        h0 = h1 + texture.crop.height;\n    }\n    else\n    {\n        w0 = (texture.frame.width) * (1-aX);\n        w1 = (texture.frame.width) * -aX;\n\n        h0 = texture.frame.height * (1-aY);\n        h1 = texture.frame.height * -aY;\n    }\n\n    var i = this.currentBatchSize * 4 * this.vertSize;\n    var resolution = texture.baseTexture.resolution;\n\n    var a = wt.a / resolution;\n    var b = wt.b / resolution;\n    var c = wt.c / resolution;\n    var d = wt.d / resolution;\n    var tx = wt.tx;\n    var ty = wt.ty;\n\n    var colors = this.colors;\n    var positions = this.positions;\n\n    if (this.renderSession.roundPixels)\n    {\n        // xy\n        positions[i] = a * w1 + c * h1 + tx | 0;\n        positions[i+1] = d * h1 + b * w1 + ty | 0;\n\n        // xy\n        positions[i+5] = a * w0 + c * h1 + tx | 0;\n        positions[i+6] = d * h1 + b * w0 + ty | 0;\n\n         // xy\n        positions[i+10] = a * w0 + c * h0 + tx | 0;\n        positions[i+11] = d * h0 + b * w0 + ty | 0;\n\n        // xy\n        positions[i+15] = a * w1 + c * h0 + tx | 0;\n        positions[i+16] = d * h0 + b * w1 + ty | 0;\n    }\n    else\n    {\n        // xy\n        positions[i] = a * w1 + c * h1 + tx;\n        positions[i+1] = d * h1 + b * w1 + ty;\n\n        // xy\n        positions[i+5] = a * w0 + c * h1 + tx;\n        positions[i+6] = d * h1 + b * w0 + ty;\n\n         // xy\n        positions[i+10] = a * w0 + c * h0 + tx;\n        positions[i+11] = d * h0 + b * w0 + ty;\n\n        // xy\n        positions[i+15] = a * w1 + c * h0 + tx;\n        positions[i+16] = d * h0 + b * w1 + ty;\n    }\n    \n    // uv\n    positions[i+2] = uvs.x0;\n    positions[i+3] = uvs.y0;\n\n    // uv\n    positions[i+7] = uvs.x1;\n    positions[i+8] = uvs.y1;\n\n     // uv\n    positions[i+12] = uvs.x2;\n    positions[i+13] = uvs.y2;\n\n    // uv\n    positions[i+17] = uvs.x3;\n    positions[i+18] = uvs.y3;\n\n    // color and alpha\n    var tint = sprite.tint;\n\n    colors[i+4] = colors[i+9] = colors[i+14] = colors[i+19] = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);\n\n    // increment the batchsize\n    this.sprites[this.currentBatchSize++] = sprite;\n\n};\n\n/**\n* Renders a TilingSprite using the spriteBatch.\n* \n* @method renderTilingSprite\n* @param sprite {TilingSprite} the sprite to render\n*/\nPIXI.WebGLSpriteBatch.prototype.renderTilingSprite = function(sprite)\n{\n    var texture = sprite.tilingTexture;\n\n    // check texture..\n    if (this.currentBatchSize >= this.size)\n    {\n        this.flush();\n        this.currentBaseTexture = texture.baseTexture;\n    }\n\n    // set the textures uvs temporarily\n    if (!sprite._uvs)\n    {\n        sprite._uvs = new PIXI.TextureUvs();\n    }\n\n    var uvs = sprite._uvs;\n\n    var w = texture.baseTexture.width;\n    var h = texture.baseTexture.height;\n\n    // var w = sprite._frame.sourceSizeW;\n    // var h = sprite._frame.sourceSizeH;\n\n    // w = 16;\n    // h = 16;\n\n    sprite.tilePosition.x %= w * sprite.tileScaleOffset.x;\n    sprite.tilePosition.y %= h * sprite.tileScaleOffset.y;\n\n    var offsetX = sprite.tilePosition.x / (w * sprite.tileScaleOffset.x);\n    var offsetY = sprite.tilePosition.y / (h * sprite.tileScaleOffset.y);\n\n    var scaleX = (sprite.width / w) / (sprite.tileScale.x * sprite.tileScaleOffset.x);\n    var scaleY = (sprite.height / h) / (sprite.tileScale.y * sprite.tileScaleOffset.y);\n\n    uvs.x0 = 0 - offsetX;\n    uvs.y0 = 0 - offsetY;\n\n    uvs.x1 = (1 * scaleX) - offsetX;\n    uvs.y1 = 0 - offsetY;\n\n    uvs.x2 = (1 * scaleX) - offsetX;\n    uvs.y2 = (1 * scaleY) - offsetY;\n\n    uvs.x3 = 0 - offsetX;\n    uvs.y3 = (1 * scaleY) - offsetY;\n\n    //  Get the sprites current alpha and tint and combine them into a single color\n    var tint = sprite.tint;\n    var color = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);\n\n    var positions = this.positions;\n    var colors = this.colors;\n\n    var width = sprite.width;\n    var height = sprite.height;\n\n    // TODO trim??\n    var aX = sprite.anchor.x;\n    var aY = sprite.anchor.y;\n    var w0 = width * (1-aX);\n    var w1 = width * -aX;\n\n    var h0 = height * (1-aY);\n    var h1 = height * -aY;\n\n    var i = this.currentBatchSize * 4 * this.vertSize;\n\n    var resolution = texture.baseTexture.resolution;\n\n    var wt = sprite.worldTransform;\n\n    var a = wt.a / resolution;\n    var b = wt.b / resolution;\n    var c = wt.c / resolution;\n    var d = wt.d / resolution;\n    var tx = wt.tx;\n    var ty = wt.ty;\n\n    // xy\n    positions[i++] = a * w1 + c * h1 + tx;\n    positions[i++] = d * h1 + b * w1 + ty;\n    // uv\n    positions[i++] = uvs.x0;\n    positions[i++] = uvs.y0;\n    // color\n    colors[i++] = color;\n\n    // xy\n    positions[i++] = (a * w0 + c * h1 + tx);\n    positions[i++] = d * h1 + b * w0 + ty;\n    // uv\n    positions[i++] = uvs.x1;\n    positions[i++] = uvs.y1;\n    // color\n    colors[i++] = color;\n    \n    // xy\n    positions[i++] = a * w0 + c * h0 + tx;\n    positions[i++] = d * h0 + b * w0 + ty;\n    // uv\n    positions[i++] = uvs.x2;\n    positions[i++] = uvs.y2;\n    // color\n    colors[i++] = color;\n\n    // xy\n    positions[i++] = a * w1 + c * h0 + tx;\n    positions[i++] = d * h0 + b * w1 + ty;\n    // uv\n    positions[i++] = uvs.x3;\n    positions[i++] = uvs.y3;\n    // color\n    colors[i++] = color;\n\n    // increment the batchsize\n    this.sprites[this.currentBatchSize++] = sprite;\n};\n\n/**\n* Renders the content and empties the current batch.\n*\n* @method flush\n*/\nPIXI.WebGLSpriteBatch.prototype.flush = function()\n{\n    // If the batch is length 0 then return as there is nothing to draw\n    if (this.currentBatchSize === 0)\n    {\n        return;\n    }\n\n    var gl = this.gl;\n    var shader;\n\n    if (this.dirty)\n    {\n        this.dirty = false;\n\n        // bind the main texture\n        gl.activeTexture(gl.TEXTURE0);\n\n        // bind the buffers\n        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);\n\n        shader = this.defaultShader.shaders[gl.id];\n\n        // this is the same for each shader?\n        var stride = this.vertSize * 4;\n        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);\n        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);\n\n        // color attributes will be interpreted as unsigned bytes and normalized\n        gl.vertexAttribPointer(shader.colorAttribute, 4, gl.UNSIGNED_BYTE, true, stride, 4 * 4);\n    }\n\n    // upload the verts to the buffer  \n    if (this.currentBatchSize > (this.size * 0.5))\n    {\n        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);\n    }\n    else\n    {\n        var view = this.positions.subarray(0, this.currentBatchSize * 4 * this.vertSize);\n        gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);\n    }\n\n    var nextTexture, nextBlendMode, nextShader;\n    var batchSize = 0;\n    var start = 0;\n\n    var currentBaseTexture = null;\n    var currentBlendMode = this.renderSession.blendModeManager.currentBlendMode;\n    var currentShader = null;\n\n    var blendSwap = false;\n    var shaderSwap = false;\n    var sprite;\n\n    for (var i = 0, j = this.currentBatchSize; i < j; i++) {\n        \n        sprite = this.sprites[i];\n\n        if (sprite.tilingTexture)\n        {\n            nextTexture = sprite.tilingTexture.baseTexture;\n        }\n        else\n        {\n            nextTexture = sprite.texture.baseTexture;\n        }\n\n        nextBlendMode = sprite.blendMode;\n        nextShader = sprite.shader || this.defaultShader;\n\n        blendSwap = currentBlendMode !== nextBlendMode;\n        shaderSwap = currentShader !== nextShader; // should I use _UIDS???\n\n        var skip = nextTexture.skipRender;\n\n        if (skip && sprite.children.length > 0)\n        {\n            skip = false;\n        }\n\n        if ((currentBaseTexture !== nextTexture && !skip) || blendSwap || shaderSwap)\n        {\n            this.renderBatch(currentBaseTexture, batchSize, start);\n\n            start = i;\n            batchSize = 0;\n            currentBaseTexture = nextTexture;\n\n            if (blendSwap)\n            {\n                currentBlendMode = nextBlendMode;\n                this.renderSession.blendModeManager.setBlendMode(currentBlendMode);\n            }\n\n            if (shaderSwap)\n            {\n                currentShader = nextShader;\n                \n                shader = currentShader.shaders[gl.id];\n\n                if (!shader)\n                {\n                    shader = new PIXI.PixiShader(gl);\n\n                    shader.fragmentSrc = currentShader.fragmentSrc;\n                    shader.uniforms = currentShader.uniforms;\n                    shader.init();\n\n                    currentShader.shaders[gl.id] = shader;\n                }\n\n                // set shader function???\n                this.renderSession.shaderManager.setShader(shader);\n\n                if (shader.dirty)\n                {\n                    shader.syncUniforms();\n                }\n                \n                // both these only need to be set if they are changing..\n                // set the projection\n                var projection = this.renderSession.projection;\n                gl.uniform2f(shader.projectionVector, projection.x, projection.y);\n\n                // TODO - this is temporary!\n                var offsetVector = this.renderSession.offset;\n                gl.uniform2f(shader.offsetVector, offsetVector.x, offsetVector.y);\n\n                // set the pointers\n            }\n        }\n\n        batchSize++;\n    }\n\n    this.renderBatch(currentBaseTexture, batchSize, start);\n\n    // then reset the batch!\n    this.currentBatchSize = 0;\n};\n\n/**\n* @method renderBatch\n* @param texture {Texture}\n* @param size {Number}\n* @param startIndex {Number}\n*/\nPIXI.WebGLSpriteBatch.prototype.renderBatch = function(texture, size, startIndex)\n{\n    if (size === 0)\n    {\n        return;\n    }\n\n    var gl = this.gl;\n\n    // check if a texture is dirty..\n    if (texture._dirty[gl.id])\n    {\n        if (!this.renderSession.renderer.updateTexture(texture))\n        {\n            //  If updateTexture returns false then we cannot render it, so bail out now\n            return;\n        }\n    }\n    else\n    {\n        // bind the current texture\n        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);\n    }\n\n    // now draw those suckas!\n    gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);\n    \n    // increment the draw count\n    this.renderSession.drawCount++;\n};\n\n/**\n* @method stop\n*/\nPIXI.WebGLSpriteBatch.prototype.stop = function()\n{\n    this.flush();\n    this.dirty = true;\n};\n\n/**\n* @method start\n*/\nPIXI.WebGLSpriteBatch.prototype.start = function()\n{\n    this.dirty = true;\n};\n\n/**\n* Destroys the SpriteBatch.\n* \n* @method destroy\n*/\nPIXI.WebGLSpriteBatch.prototype.destroy = function()\n{\n    this.vertices = null;\n    this.indices = null;\n    \n    this.gl.deleteBuffer(this.vertexBuffer);\n    this.gl.deleteBuffer(this.indexBuffer);\n    \n    this.currentBaseTexture = null;\n    \n    this.gl = null;\n};\n/**\n * @author Mat Groves\n * \n * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/\n * for creating the original pixi version!\n *\n * Heavily inspired by LibGDX's WebGLSpriteBatch:\n * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java\n */\n\n/**\n* @class WebGLFastSpriteBatch\n* @constructor\n*/\nPIXI.WebGLFastSpriteBatch = function(gl)\n{\n    /**\n     * @property vertSize\n     * @type Number\n     */\n    this.vertSize = 10;\n\n    /**\n     * @property maxSize\n     * @type Number\n     */\n    this.maxSize = 6000;//Math.pow(2, 16) /  this.vertSize;\n\n    /**\n     * @property size\n     * @type Number\n     */\n    this.size = this.maxSize;\n\n    //the total number of floats in our batch\n    var numVerts = this.size * 4 *  this.vertSize;\n\n    //the total number of indices in our batch\n    var numIndices = this.maxSize * 6;\n\n    /**\n     * Vertex data\n     * @property vertices\n     * @type Float32Array\n     */\n    this.vertices = new PIXI.Float32Array(numVerts);\n\n    /**\n     * Index data\n     * @property indices\n     * @type Uint16Array\n     */\n    this.indices = new PIXI.Uint16Array(numIndices);\n    \n    /**\n     * @property vertexBuffer\n     * @type Object\n     */\n    this.vertexBuffer = null;\n\n    /**\n     * @property indexBuffer\n     * @type Object\n     */\n    this.indexBuffer = null;\n\n    /**\n     * @property lastIndexCount\n     * @type Number\n     */\n    this.lastIndexCount = 0;\n\n    for (var i=0, j=0; i < numIndices; i += 6, j += 4)\n    {\n        this.indices[i + 0] = j + 0;\n        this.indices[i + 1] = j + 1;\n        this.indices[i + 2] = j + 2;\n        this.indices[i + 3] = j + 0;\n        this.indices[i + 4] = j + 2;\n        this.indices[i + 5] = j + 3;\n    }\n\n    /**\n     * @property drawing\n     * @type Boolean\n     */\n    this.drawing = false;\n\n    /**\n     * @property currentBatchSize\n     * @type Number\n     */\n    this.currentBatchSize = 0;\n\n    /**\n     * @property currentBaseTexture\n     * @type BaseTexture\n     */\n    this.currentBaseTexture = null;\n   \n    /**\n     * @property currentBlendMode\n     * @type Number\n     */\n    this.currentBlendMode = 0;\n\n    /**\n     * @property renderSession\n     * @type Object\n     */\n    this.renderSession = null;\n    \n    /**\n     * @property shader\n     * @type Object\n     */\n    this.shader = null;\n\n    /**\n     * @property matrix\n     * @type Matrix\n     */\n    this.matrix = null;\n\n    this.setContext(gl);\n};\n\nPIXI.WebGLFastSpriteBatch.prototype.constructor = PIXI.WebGLFastSpriteBatch;\n\n/**\n * Sets the WebGL Context.\n *\n * @method setContext\n * @param gl {WebGLContext} the current WebGL drawing context\n */\nPIXI.WebGLFastSpriteBatch.prototype.setContext = function(gl)\n{\n    this.gl = gl;\n\n    // create a couple of buffers\n    this.vertexBuffer = gl.createBuffer();\n    this.indexBuffer = gl.createBuffer();\n\n    // 65535 is max index, so 65535 / 6 = 10922.\n\n    //upload the index data\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);\n    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);\n};\n\n/**\n * @method begin\n * @param spriteBatch {WebGLSpriteBatch}\n * @param renderSession {Object}\n */\nPIXI.WebGLFastSpriteBatch.prototype.begin = function(spriteBatch, renderSession)\n{\n    this.renderSession = renderSession;\n    this.shader = this.renderSession.shaderManager.fastShader;\n\n    this.matrix = spriteBatch.worldTransform.toArray(true);\n\n    this.start();\n};\n\n/**\n * @method end\n */\nPIXI.WebGLFastSpriteBatch.prototype.end = function()\n{\n    this.flush();\n};\n\n/**\n * @method render\n * @param spriteBatch {WebGLSpriteBatch}\n */\nPIXI.WebGLFastSpriteBatch.prototype.render = function(spriteBatch)\n{\n    var children = spriteBatch.children;\n    var sprite = children[0];\n\n    // if the uvs have not updated then no point rendering just yet!\n    \n    // check texture.\n    if(!sprite.texture._uvs)return;\n   \n    this.currentBaseTexture = sprite.texture.baseTexture;\n    \n    // check blend mode\n    if(sprite.blendMode !== this.renderSession.blendModeManager.currentBlendMode)\n    {\n        this.flush();\n        this.renderSession.blendModeManager.setBlendMode(sprite.blendMode);\n    }\n    \n    for(var i=0,j= children.length; i<j; i++)\n    {\n        this.renderSprite(children[i]);\n    }\n\n    this.flush();\n};\n\n/**\n * @method renderSprite\n * @param sprite {Sprite}\n */\nPIXI.WebGLFastSpriteBatch.prototype.renderSprite = function(sprite)\n{\n    //sprite = children[i];\n    if(!sprite.visible)return;\n    \n    // TODO trim??\n    if(sprite.texture.baseTexture !== this.currentBaseTexture && !sprite.texture.baseTexture.skipRender)\n    {\n        this.flush();\n        this.currentBaseTexture = sprite.texture.baseTexture;\n        \n        if(!sprite.texture._uvs)return;\n    }\n\n    var uvs, vertices = this.vertices, width, height, w0, w1, h0, h1, index;\n\n    uvs = sprite.texture._uvs;\n\n    width = sprite.texture.frame.width;\n    height = sprite.texture.frame.height;\n\n    if (sprite.texture.trim)\n    {\n        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords..\n        var trim = sprite.texture.trim;\n\n        w1 = trim.x - sprite.anchor.x * trim.width;\n        w0 = w1 + sprite.texture.crop.width;\n\n        h1 = trim.y - sprite.anchor.y * trim.height;\n        h0 = h1 + sprite.texture.crop.height;\n    }\n    else\n    {\n        w0 = (sprite.texture.frame.width ) * (1-sprite.anchor.x);\n        w1 = (sprite.texture.frame.width ) * -sprite.anchor.x;\n\n        h0 = sprite.texture.frame.height * (1-sprite.anchor.y);\n        h1 = sprite.texture.frame.height * -sprite.anchor.y;\n    }\n\n    index = this.currentBatchSize * 4 * this.vertSize;\n\n    // xy\n    vertices[index++] = w1;\n    vertices[index++] = h1;\n\n    vertices[index++] = sprite.position.x;\n    vertices[index++] = sprite.position.y;\n\n    //scale\n    vertices[index++] = sprite.scale.x;\n    vertices[index++] = sprite.scale.y;\n\n    //rotation\n    vertices[index++] = sprite.rotation;\n\n    // uv\n    vertices[index++] = uvs.x0;\n    vertices[index++] = uvs.y1;\n    // color\n    vertices[index++] = sprite.alpha;\n \n\n    // xy\n    vertices[index++] = w0;\n    vertices[index++] = h1;\n\n    vertices[index++] = sprite.position.x;\n    vertices[index++] = sprite.position.y;\n\n    //scale\n    vertices[index++] = sprite.scale.x;\n    vertices[index++] = sprite.scale.y;\n\n     //rotation\n    vertices[index++] = sprite.rotation;\n\n    // uv\n    vertices[index++] = uvs.x1;\n    vertices[index++] = uvs.y1;\n    // color\n    vertices[index++] = sprite.alpha;\n  \n\n    // xy\n    vertices[index++] = w0;\n    vertices[index++] = h0;\n\n    vertices[index++] = sprite.position.x;\n    vertices[index++] = sprite.position.y;\n\n    //scale\n    vertices[index++] = sprite.scale.x;\n    vertices[index++] = sprite.scale.y;\n\n     //rotation\n    vertices[index++] = sprite.rotation;\n\n    // uv\n    vertices[index++] = uvs.x2;\n    vertices[index++] = uvs.y2;\n    // color\n    vertices[index++] = sprite.alpha;\n \n\n\n\n    // xy\n    vertices[index++] = w1;\n    vertices[index++] = h0;\n\n    vertices[index++] = sprite.position.x;\n    vertices[index++] = sprite.position.y;\n\n    //scale\n    vertices[index++] = sprite.scale.x;\n    vertices[index++] = sprite.scale.y;\n\n     //rotation\n    vertices[index++] = sprite.rotation;\n\n    // uv\n    vertices[index++] = uvs.x3;\n    vertices[index++] = uvs.y3;\n    // color\n    vertices[index++] = sprite.alpha;\n\n    // increment the batchs\n    this.currentBatchSize++;\n\n    if(this.currentBatchSize >= this.size)\n    {\n        this.flush();\n    }\n};\n\n/**\n * @method flush\n */\nPIXI.WebGLFastSpriteBatch.prototype.flush = function()\n{\n    // If the batch is length 0 then return as there is nothing to draw\n    if (this.currentBatchSize===0)return;\n\n    var gl = this.gl;\n    \n    // bind the current texture\n\n    if(!this.currentBaseTexture._glTextures[gl.id])this.renderSession.renderer.updateTexture(this.currentBaseTexture, gl);\n\n    gl.bindTexture(gl.TEXTURE_2D, this.currentBaseTexture._glTextures[gl.id]);\n\n    // upload the verts to the buffer\n   \n    if(this.currentBatchSize > ( this.size * 0.5 ) )\n    {\n        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);\n    }\n    else\n    {\n        var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);\n\n        gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);\n    }\n    \n    // now draw those suckas!\n    gl.drawElements(gl.TRIANGLES, this.currentBatchSize * 6, gl.UNSIGNED_SHORT, 0);\n   \n    // then reset the batch!\n    this.currentBatchSize = 0;\n\n    // increment the draw count\n    this.renderSession.drawCount++;\n};\n\n\n/**\n * @method stop\n */\nPIXI.WebGLFastSpriteBatch.prototype.stop = function()\n{\n    this.flush();\n};\n\n/**\n * @method start\n */\nPIXI.WebGLFastSpriteBatch.prototype.start = function()\n{\n    var gl = this.gl;\n\n    // bind the main texture\n    gl.activeTexture(gl.TEXTURE0);\n\n    // bind the buffers\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);\n\n    // set the projection\n    var projection = this.renderSession.projection;\n    gl.uniform2f(this.shader.projectionVector, projection.x, projection.y);\n\n    // set the matrix\n    gl.uniformMatrix3fv(this.shader.uMatrix, false, this.matrix);\n\n    // set the pointers\n    var stride =  this.vertSize * 4;\n\n    gl.vertexAttribPointer(this.shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);\n    gl.vertexAttribPointer(this.shader.aPositionCoord, 2, gl.FLOAT, false, stride, 2 * 4);\n    gl.vertexAttribPointer(this.shader.aScale, 2, gl.FLOAT, false, stride, 4 * 4);\n    gl.vertexAttribPointer(this.shader.aRotation, 1, gl.FLOAT, false, stride, 6 * 4);\n    gl.vertexAttribPointer(this.shader.aTextureCoord, 2, gl.FLOAT, false, stride, 7 * 4);\n    gl.vertexAttribPointer(this.shader.colorAttribute, 1, gl.FLOAT, false, stride, 9 * 4);\n    \n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class WebGLFilterManager\n* @constructor\n*/\nPIXI.WebGLFilterManager = function()\n{\n    /**\n     * @property filterStack\n     * @type Array\n     */\n    this.filterStack = [];\n    \n    /**\n     * @property offsetX\n     * @type Number\n     */\n    this.offsetX = 0;\n\n    /**\n     * @property offsetY\n     * @type Number\n     */\n    this.offsetY = 0;\n};\n\nPIXI.WebGLFilterManager.prototype.constructor = PIXI.WebGLFilterManager;\n\n/**\n* Initialises the context and the properties.\n* \n* @method setContext \n* @param gl {WebGLContext} the current WebGL drawing context\n*/\nPIXI.WebGLFilterManager.prototype.setContext = function(gl)\n{\n    this.gl = gl;\n    this.texturePool = [];\n\n    this.initShaderBuffers();\n};\n\n/**\n* @method begin\n* @param renderSession {RenderSession} \n* @param buffer {ArrayBuffer} \n*/\nPIXI.WebGLFilterManager.prototype.begin = function(renderSession, buffer)\n{\n    this.renderSession = renderSession;\n    this.defaultShader = renderSession.shaderManager.defaultShader;\n\n    var projection = this.renderSession.projection;\n    this.width = projection.x * 2;\n    this.height = -projection.y * 2;\n    this.buffer = buffer;\n};\n\n/**\n* Applies the filter and adds it to the current filter stack.\n* \n* @method pushFilter\n* @param filterBlock {Object} the filter that will be pushed to the current filter stack\n*/\nPIXI.WebGLFilterManager.prototype.pushFilter = function(filterBlock)\n{\n    var gl = this.gl;\n\n    var projection = this.renderSession.projection;\n    var offset = this.renderSession.offset;\n\n    filterBlock._filterArea = filterBlock.target.filterArea || filterBlock.target.getBounds();\n    \n    // >>> modify by nextht\n    filterBlock._previous_stencil_mgr = this.renderSession.stencilManager;\n    this.renderSession.stencilManager = new PIXI.WebGLStencilManager();\n    this.renderSession.stencilManager.setContext(gl);\n    gl.disable(gl.STENCIL_TEST);\n    // <<<  modify by nextht \n   \n    // filter program\n    // OPTIMISATION - the first filter is free if its a simple color change?\n    this.filterStack.push(filterBlock);\n\n    var filter = filterBlock.filterPasses[0];\n\n    this.offsetX += filterBlock._filterArea.x;\n    this.offsetY += filterBlock._filterArea.y;\n\n    var texture = this.texturePool.pop();\n    if(!texture)\n    {\n        texture = new PIXI.FilterTexture(this.gl, this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);\n    }\n    else\n    {\n        texture.resize(this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);\n    }\n\n    gl.bindTexture(gl.TEXTURE_2D,  texture.texture);\n\n    var filterArea = filterBlock._filterArea;// filterBlock.target.getBounds();///filterBlock.target.filterArea;\n\n    var padding = filter.padding;\n    filterArea.x -= padding;\n    filterArea.y -= padding;\n    filterArea.width += padding * 2;\n    filterArea.height += padding * 2;\n\n    // cap filter to screen size..\n    if(filterArea.x < 0)filterArea.x = 0;\n    if(filterArea.width > this.width)filterArea.width = this.width;\n    if(filterArea.y < 0)filterArea.y = 0;\n    if(filterArea.height > this.height)filterArea.height = this.height;\n\n    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  filterArea.width, filterArea.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);\n    gl.bindFramebuffer(gl.FRAMEBUFFER, texture.frameBuffer);\n\n    // set view port\n    gl.viewport(0, 0, filterArea.width * this.renderSession.resolution, filterArea.height * this.renderSession.resolution);\n\n    projection.x = filterArea.width/2;\n    projection.y = -filterArea.height/2;\n\n    offset.x = -filterArea.x;\n    offset.y = -filterArea.y;\n\n    // update projection\n    // now restore the regular shader..\n    // this.renderSession.shaderManager.setShader(this.defaultShader);\n    //gl.uniform2f(this.defaultShader.projectionVector, filterArea.width/2, -filterArea.height/2);\n    //gl.uniform2f(this.defaultShader.offsetVector, -filterArea.x, -filterArea.y);\n\n    gl.colorMask(true, true, true, true);\n    gl.clearColor(0,0,0, 0);\n    gl.clear(gl.COLOR_BUFFER_BIT);\n\n    filterBlock._glFilterTexture = texture;\n\n};\n\n/**\n* Removes the last filter from the filter stack and doesn't return it.\n* \n* @method popFilter\n*/\nPIXI.WebGLFilterManager.prototype.popFilter = function()\n{\n    var gl = this.gl;\n    var filterBlock = this.filterStack.pop();\n    var filterArea = filterBlock._filterArea;\n    var texture = filterBlock._glFilterTexture;\n    var projection = this.renderSession.projection;\n    var offset = this.renderSession.offset;\n\n    if(filterBlock.filterPasses.length > 1)\n    {\n        gl.viewport(0, 0, filterArea.width * this.renderSession.resolution, filterArea.height * this.renderSession.resolution);\n\n        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n\n        this.vertexArray[0] = 0;\n        this.vertexArray[1] = filterArea.height;\n\n        this.vertexArray[2] = filterArea.width;\n        this.vertexArray[3] = filterArea.height;\n\n        this.vertexArray[4] = 0;\n        this.vertexArray[5] = 0;\n\n        this.vertexArray[6] = filterArea.width;\n        this.vertexArray[7] = 0;\n\n        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);\n\n        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);\n        // now set the uvs..\n        this.uvArray[2] = filterArea.width/this.width;\n        this.uvArray[5] = filterArea.height/this.height;\n        this.uvArray[6] = filterArea.width/this.width;\n        this.uvArray[7] = filterArea.height/this.height;\n\n        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);\n\n        var inputTexture = texture;\n        var outputTexture = this.texturePool.pop();\n        if(!outputTexture)outputTexture = new PIXI.FilterTexture(this.gl, this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);\n        outputTexture.resize(this.width * this.renderSession.resolution, this.height * this.renderSession.resolution);\n\n        // need to clear this FBO as it may have some left over elements from a previous filter.\n        gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );\n        gl.clear(gl.COLOR_BUFFER_BIT);\n\n        gl.disable(gl.BLEND);\n\n        for (var i = 0; i < filterBlock.filterPasses.length-1; i++)\n        {\n            var filterPass = filterBlock.filterPasses[i];\n\n            gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );\n\n            // set texture\n            gl.activeTexture(gl.TEXTURE0);\n            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);\n\n            // draw texture..\n            //filterPass.applyFilterPass(filterArea.width, filterArea.height);\n            this.applyFilterPass(filterPass, filterArea, filterArea.width, filterArea.height);\n\n            // swap the textures..\n            var temp = inputTexture;\n            inputTexture = outputTexture;\n            outputTexture = temp;\n        }\n\n        gl.enable(gl.BLEND);\n\n        texture = inputTexture;\n        this.texturePool.push(outputTexture);\n    }\n\n    var filter = filterBlock.filterPasses[filterBlock.filterPasses.length-1];\n\n    this.offsetX -= filterArea.x;\n    this.offsetY -= filterArea.y;\n\n    var sizeX = this.width;\n    var sizeY = this.height;\n\n    var offsetX = 0;\n    var offsetY = 0;\n\n    var buffer = this.buffer;\n\n    // time to render the filters texture to the previous scene\n    if(this.filterStack.length === 0)\n    {\n        gl.colorMask(true, true, true, true);//this.transparent);\n    }\n    else\n    {\n        var currentFilter = this.filterStack[this.filterStack.length-1];\n        filterArea = currentFilter._filterArea;\n\n        sizeX = filterArea.width;\n        sizeY = filterArea.height;\n\n        offsetX = filterArea.x;\n        offsetY = filterArea.y;\n\n        buffer =  currentFilter._glFilterTexture.frameBuffer;\n    }\n\n    // TODO need to remove these global elements..\n    projection.x = sizeX/2;\n    projection.y = -sizeY/2;\n\n    offset.x = offsetX;\n    offset.y = offsetY;\n\n    filterArea = filterBlock._filterArea;\n\n    var x = filterArea.x-offsetX;\n    var y = filterArea.y-offsetY;\n\n    // update the buffers..\n    // make sure to flip the y!\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n\n    this.vertexArray[0] = x;\n    this.vertexArray[1] = y + filterArea.height;\n\n    this.vertexArray[2] = x + filterArea.width;\n    this.vertexArray[3] = y + filterArea.height;\n\n    this.vertexArray[4] = x;\n    this.vertexArray[5] = y;\n\n    this.vertexArray[6] = x + filterArea.width;\n    this.vertexArray[7] = y;\n\n    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);\n\n    this.uvArray[2] = filterArea.width/this.width;\n    this.uvArray[5] = filterArea.height/this.height;\n    this.uvArray[6] = filterArea.width/this.width;\n    this.uvArray[7] = filterArea.height/this.height;\n\n    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);\n\n    gl.viewport(0, 0, sizeX * this.renderSession.resolution, sizeY * this.renderSession.resolution);\n\n    // bind the buffer\n    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer );\n\n    // set the blend mode! \n    //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)\n\n    // set texture\n    gl.activeTexture(gl.TEXTURE0);\n    gl.bindTexture(gl.TEXTURE_2D, texture.texture);\n\n    // >>> modify by nextht\n    if (this.renderSession.stencilManager) {\n        this.renderSession.stencilManager.destroy();\n    }\n    this.renderSession.stencilManager = filterBlock._previous_stencil_mgr;\n    filterBlock._previous_stencil_mgr = null;\n    if (this.renderSession.stencilManager.count > 0) {\n        gl.enable(gl.STENCIL_TEST);\n    }\n    else {\n        gl.disable(gl.STENCIL_TEST);\n    }    \n    // <<< modify by nextht\n\n    // apply!\n    this.applyFilterPass(filter, filterArea, sizeX, sizeY);\n\n    // now restore the regular shader.. should happen automatically now..\n    // this.renderSession.shaderManager.setShader(this.defaultShader);\n    // gl.uniform2f(this.defaultShader.projectionVector, sizeX/2, -sizeY/2);\n    // gl.uniform2f(this.defaultShader.offsetVector, -offsetX, -offsetY);\n\n    // return the texture to the pool\n    this.texturePool.push(texture);\n    filterBlock._glFilterTexture = null;\n};\n\n\n/**\n* Applies the filter to the specified area.\n* \n* @method applyFilterPass\n* @param filter {AbstractFilter} the filter that needs to be applied\n* @param filterArea {Texture} TODO - might need an update\n* @param width {Number} the horizontal range of the filter\n* @param height {Number} the vertical range of the filter\n*/\nPIXI.WebGLFilterManager.prototype.applyFilterPass = function(filter, filterArea, width, height)\n{\n    // use program\n    var gl = this.gl;\n    var shader = filter.shaders[gl.id];\n\n    if(!shader)\n    {\n        shader = new PIXI.PixiShader(gl);\n\n        shader.fragmentSrc = filter.fragmentSrc;\n        shader.uniforms = filter.uniforms;\n        shader.init();\n\n        filter.shaders[gl.id] = shader;\n    }\n\n    // set the shader\n    this.renderSession.shaderManager.setShader(shader);\n\n//    gl.useProgram(shader.program);\n\n    gl.uniform2f(shader.projectionVector, width/2, -height/2);\n    gl.uniform2f(shader.offsetVector, 0,0);\n\n    if(filter.uniforms.dimensions)\n    {\n        filter.uniforms.dimensions.value[0] = this.width;//width;\n        filter.uniforms.dimensions.value[1] = this.height;//height;\n        filter.uniforms.dimensions.value[2] = this.vertexArray[0];\n        filter.uniforms.dimensions.value[3] = this.vertexArray[5];//filterArea.height;\n    }\n\n    shader.syncUniforms();\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n    gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);\n    gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);\n    gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);\n\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);\n\n    // draw the filter...\n    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );\n\n    this.renderSession.drawCount++;\n};\n\n/**\n* Initialises the shader buffers.\n* \n* @method initShaderBuffers\n*/\nPIXI.WebGLFilterManager.prototype.initShaderBuffers = function()\n{\n    var gl = this.gl;\n\n    // create some buffers\n    this.vertexBuffer = gl.createBuffer();\n    this.uvBuffer = gl.createBuffer();\n    this.colorBuffer = gl.createBuffer();\n    this.indexBuffer = gl.createBuffer();\n\n    // bind and upload the vertexs..\n    // keep a reference to the vertexFloatData..\n    this.vertexArray = new PIXI.Float32Array([0.0, 0.0,\n                                         1.0, 0.0,\n                                         0.0, 1.0,\n                                         1.0, 1.0]);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);\n\n    // bind and upload the uv buffer\n    this.uvArray = new PIXI.Float32Array([0.0, 0.0,\n                                     1.0, 0.0,\n                                     0.0, 1.0,\n                                     1.0, 1.0]);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, this.uvArray, gl.STATIC_DRAW);\n\n    this.colorArray = new PIXI.Float32Array([1.0, 0xFFFFFF,\n                                        1.0, 0xFFFFFF,\n                                        1.0, 0xFFFFFF,\n                                        1.0, 0xFFFFFF]);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);\n\n    // bind and upload the index\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);\n    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 3, 2]), gl.STATIC_DRAW);\n\n};\n\n/**\n* Destroys the filter and removes it from the filter stack.\n* \n* @method destroy\n*/\nPIXI.WebGLFilterManager.prototype.destroy = function()\n{\n    var gl = this.gl;\n\n    this.filterStack = null;\n    \n    this.offsetX = 0;\n    this.offsetY = 0;\n\n    // destroy textures\n    for (var i = 0; i < this.texturePool.length; i++) {\n        this.texturePool[i].destroy();\n    }\n    \n    this.texturePool = null;\n\n    //destroy buffers..\n    gl.deleteBuffer(this.vertexBuffer);\n    gl.deleteBuffer(this.uvBuffer);\n    gl.deleteBuffer(this.colorBuffer);\n    gl.deleteBuffer(this.indexBuffer);\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n* @class FilterTexture\n* @constructor\n* @param gl {WebGLContext} the current WebGL drawing context\n* @param width {Number} the horizontal range of the filter\n* @param height {Number} the vertical range of the filter\n* @param scaleMode {Number} See {{#crossLink \"PIXI/scaleModes:property\"}}PIXI.scaleModes{{/crossLink}} for possible values\n*/\nPIXI.FilterTexture = function(gl, width, height, scaleMode)\n{\n    /**\n     * @property gl\n     * @type WebGLContext\n     */\n    this.gl = gl;\n\n    // next time to create a frame buffer and texture\n\n    /**\n     * @property frameBuffer\n     * @type Any\n     */\n    this.frameBuffer = gl.createFramebuffer();\n\n    /**\n     * @property texture\n     * @type Any\n     */\n    this.texture = gl.createTexture();\n\n    /**\n     * @property scaleMode\n     * @type Number\n     */\n    scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;\n\n    gl.bindTexture(gl.TEXTURE_2D,  this.texture);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, scaleMode === PIXI.scaleModes.LINEAR ? gl.LINEAR : gl.NEAREST);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);\n    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer );\n\n    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer );\n    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);\n\n    // required for masking a mask??\n    this.renderBuffer = gl.createRenderbuffer();\n    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);\n    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);\n  \n    this.resize(width, height);\n};\n\nPIXI.FilterTexture.prototype.constructor = PIXI.FilterTexture;\n\n/**\n* Clears the filter texture.\n* \n* @method clear\n*/\nPIXI.FilterTexture.prototype.clear = function()\n{\n    var gl = this.gl;\n    \n    gl.clearColor(0,0,0, 0);\n    gl.clear(gl.COLOR_BUFFER_BIT);\n};\n\n/**\n * Resizes the texture to the specified width and height\n *\n * @method resize\n * @param width {Number} the new width of the texture\n * @param height {Number} the new height of the texture\n */\nPIXI.FilterTexture.prototype.resize = function(width, height)\n{\n    if(this.width === width && this.height === height) return;\n\n    this.width = width;\n    this.height = height;\n\n    var gl = this.gl;\n\n    gl.bindTexture(gl.TEXTURE_2D,  this.texture);\n    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  width , height , 0, gl.RGBA, gl.UNSIGNED_BYTE, null);\n    // update the stencil buffer width and height\n    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);\n    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width , height );\n};\n\n/**\n* Destroys the filter texture.\n* \n* @method destroy\n*/\nPIXI.FilterTexture.prototype.destroy = function()\n{\n    var gl = this.gl;\n    gl.deleteFramebuffer( this.frameBuffer );\n    gl.deleteTexture( this.texture );\n\n    this.frameBuffer = null;\n    this.texture = null;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * Creates a Canvas element of the given size.\n *\n * @class CanvasBuffer\n * @constructor\n * @param width {Number} the width for the newly created canvas\n * @param height {Number} the height for the newly created canvas\n */\nPIXI.CanvasBuffer = function(width, height)\n{\n    /**\n     * The width of the Canvas in pixels.\n     *\n     * @property width\n     * @type Number\n     */\n    this.width = width;\n\n    /**\n     * The height of the Canvas in pixels.\n     *\n     * @property height\n     * @type Number\n     */\n    this.height = height;\n\n    /**\n     * The Canvas object that belongs to this CanvasBuffer.\n     *\n     * @property canvas\n     * @type HTMLCanvasElement\n     */\n    this.canvas = PIXI.CanvasPool.create(this, this.width, this.height);\n\n    /**\n     * A CanvasRenderingContext2D object representing a two-dimensional rendering context.\n     *\n     * @property context\n     * @type CanvasRenderingContext2D\n     */\n    this.context = this.canvas.getContext(\"2d\");\n\n    this.canvas.width = width;\n    this.canvas.height = height;\n};\n\nPIXI.CanvasBuffer.prototype.constructor = PIXI.CanvasBuffer;\n\n/**\n * Clears the canvas that was created by the CanvasBuffer class.\n *\n * @method clear\n * @private\n */\nPIXI.CanvasBuffer.prototype.clear = function()\n{\n    this.context.setTransform(1, 0, 0, 1, 0, 0);\n    this.context.clearRect(0,0, this.width, this.height);\n};\n\n/**\n * Resizes the canvas to the specified width and height.\n *\n * @method resize\n * @param width {Number} the new width of the canvas\n * @param height {Number} the new height of the canvas\n */\nPIXI.CanvasBuffer.prototype.resize = function(width, height)\n{\n    this.width = this.canvas.width = width;\n    this.height = this.canvas.height = height;\n};\n\n/**\n * Frees the canvas up for use again.\n *\n * @method destroy\n */\nPIXI.CanvasBuffer.prototype.destroy = function()\n{\n    PIXI.CanvasPool.remove(this);\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * A set of functions used to handle masking.\n *\n * @class CanvasMaskManager\n * @constructor\n */\nPIXI.CanvasMaskManager = function()\n{\n};\n\nPIXI.CanvasMaskManager.prototype.constructor = PIXI.CanvasMaskManager;\n\n/**\n * This method adds it to the current stack of masks.\n *\n * @method pushMask\n * @param maskData {Object} the maskData that will be pushed\n * @param renderSession {Object} The renderSession whose context will be used for this mask manager.\n */\nPIXI.CanvasMaskManager.prototype.pushMask = function(maskData, renderSession) {\n\n\tvar context = renderSession.context;\n\n    context.save();\n    \n    var cacheAlpha = maskData.alpha;\n    var transform = maskData.worldTransform;\n\n    var resolution = renderSession.resolution;\n\n    context.setTransform(transform.a * resolution,\n                         transform.b * resolution,\n                         transform.c * resolution,\n                         transform.d * resolution,\n                         transform.tx * resolution,\n                         transform.ty * resolution);\n\n    PIXI.CanvasGraphics.renderGraphicsMask(maskData, context);\n\n    context.clip();\n\n    maskData.worldAlpha = cacheAlpha;\n};\n\n/**\n * Restores the current drawing context to the state it was before the mask was applied.\n *\n * @method popMask\n * @param renderSession {Object} The renderSession whose context will be used for this mask manager.\n */\nPIXI.CanvasMaskManager.prototype.popMask = function(renderSession)\n{\n    renderSession.context.restore();\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * Utility methods for Sprite/Texture tinting.\n *\n * @class CanvasTinter\n * @static\n */\nPIXI.CanvasTinter = function() {};\n\n/**\n * Basically this method just needs a sprite and a color and tints the sprite with the given color.\n * \n * @method getTintedTexture \n * @static\n * @param sprite {Sprite} the sprite to tint\n * @param color {Number} the color to use to tint the sprite with\n * @return {HTMLCanvasElement} The tinted canvas\n */\nPIXI.CanvasTinter.getTintedTexture = function(sprite, color)\n{\n    var canvas = sprite.tintedTexture || PIXI.CanvasPool.create(this);\n    \n    PIXI.CanvasTinter.tintMethod(sprite.texture, color, canvas);\n\n    return canvas;\n};\n\n/**\n * Tint a texture using the \"multiply\" operation.\n * \n * @method tintWithMultiply\n * @static\n * @param texture {Texture} the texture to tint\n * @param color {Number} the color to use to tint the sprite with\n * @param canvas {HTMLCanvasElement} the current canvas\n */\nPIXI.CanvasTinter.tintWithMultiply = function(texture, color, canvas)\n{\n    var context = canvas.getContext(\"2d\");\n\n    var crop = texture.crop;\n\n    if (canvas.width !== crop.width || canvas.height !== crop.height)\n    {\n        canvas.width = crop.width;\n        canvas.height = crop.height;\n    }\n\n    context.clearRect(0, 0, crop.width, crop.height);\n\n    context.fillStyle = \"#\" + (\"00000\" + (color | 0).toString(16)).substr(-6);\n    context.fillRect(0, 0, crop.width, crop.height);\n\n    context.globalCompositeOperation = \"multiply\";\n    context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);\n\n    context.globalCompositeOperation = \"destination-atop\";\n    context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);\n\n};\n\n/**\n * Tint a texture pixel per pixel.\n * \n * @method tintPerPixel\n * @static\n * @param texture {Texture} the texture to tint\n * @param color {Number} the color to use to tint the sprite with\n * @param canvas {HTMLCanvasElement} the current canvas\n */ \nPIXI.CanvasTinter.tintWithPerPixel = function(texture, color, canvas)\n{\n    var context = canvas.getContext(\"2d\");\n\n    var crop = texture.crop;\n\n    canvas.width = crop.width;\n    canvas.height = crop.height;\n  \n    context.globalCompositeOperation = \"copy\";\n\n    context.drawImage(texture.baseTexture.source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);\n\n    var rgbValues = PIXI.hex2rgb(color);\n    var r = rgbValues[0], g = rgbValues[1], b = rgbValues[2];\n\n    var pixelData = context.getImageData(0, 0, crop.width, crop.height);\n\n    var pixels = pixelData.data;\n\n    for (var i = 0; i < pixels.length; i += 4)\n    {\n        pixels[i + 0] *= r;\n        pixels[i + 1] *= g;\n        pixels[i + 2] *= b;\n\n        if (!PIXI.CanvasTinter.canHandleAlpha)\n        {\n            var alpha = pixels[i + 3];\n\n            pixels[i + 0] /= 255 / alpha;\n            pixels[i + 1] /= 255 / alpha;\n            pixels[i + 2] /= 255 / alpha;\n        }\n    }\n\n    context.putImageData(pixelData, 0, 0);\n};\n\n/**\n * Checks if the browser correctly supports putImageData alpha channels.\n * \n * @method checkInverseAlpha\n * @static\n */\nPIXI.CanvasTinter.checkInverseAlpha = function()\n{\n    var canvas = new PIXI.CanvasBuffer(2, 1);\n\n    canvas.context.fillStyle = \"rgba(10, 20, 30, 0.5)\";\n\n    //  Draw a single pixel\n    canvas.context.fillRect(0, 0, 1, 1);\n\n    //  Get the color values\n    var s1 = canvas.context.getImageData(0, 0, 1, 1);\n\n    if (s1 === null)\n    {\n        return false;\n    }\n\n    //  Plot them to x2\n    canvas.context.putImageData(s1, 1, 0);\n\n    //  Get those values\n    var s2 = canvas.context.getImageData(1, 0, 1, 1);\n\n    //  Compare and return\n    return (s2.data[0] === s1.data[0] && s2.data[1] === s1.data[1] && s2.data[2] === s1.data[2] && s2.data[3] === s1.data[3]);\n};\n\n/**\n * If the browser isn't capable of handling tinting with alpha this will be false.\n * This property is only applicable if using tintWithPerPixel.\n *\n * @property canHandleAlpha\n * @type Boolean\n * @static\n */\nPIXI.CanvasTinter.canHandleAlpha = PIXI.CanvasTinter.checkInverseAlpha();\n\n/**\n * Whether or not the Canvas BlendModes are supported, consequently the ability to tint using the multiply method.\n *\n * @property canUseMultiply\n * @type Boolean\n * @static\n */\nPIXI.CanvasTinter.canUseMultiply = PIXI.canUseNewCanvasBlendModes();\n\n/**\n * The tinting method that will be used.\n * \n * @method tintMethod\n * @static\n */\nPIXI.CanvasTinter.tintMethod = PIXI.CanvasTinter.canUseMultiply ? PIXI.CanvasTinter.tintWithMultiply :  PIXI.CanvasTinter.tintWithPerPixel;\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * The CanvasRenderer draws the Stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.\n * Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)\n *\n * @class CanvasRenderer\n * @constructor\n * @param game {Phaser.Game} A reference to the Phaser Game instance\n */\nPIXI.CanvasRenderer = function (game) {\n\n    /**\n    * @property {Phaser.Game} game - A reference to the Phaser Game instance.\n    */\n    this.game = game;\n\n    if (!PIXI.defaultRenderer)\n    {\n        PIXI.defaultRenderer = this;\n    }\n\n    /**\n     * The renderer type.\n     *\n     * @property type\n     * @type Number\n     */\n    this.type = PIXI.CANVAS_RENDERER;\n\n    /**\n     * The resolution of the canvas.\n     *\n     * @property resolution\n     * @type Number\n     */\n    this.resolution = game.resolution;\n\n    /**\n     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.\n     * If the Stage is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.\n     * If the Stage is transparent Pixi will use clearRect to clear the canvas every frame.\n     * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.\n     *\n     * @property clearBeforeRender\n     * @type Boolean\n     * @default\n     */\n    this.clearBeforeRender = game.clearBeforeRender;\n\n    /**\n     * Whether the render view is transparent\n     *\n     * @property transparent\n     * @type Boolean\n     */\n    this.transparent = game.transparent;\n\n    /**\n     * Whether the render view should be resized automatically\n     *\n     * @property autoResize\n     * @type Boolean\n     */\n    this.autoResize = false;\n\n    /**\n     * The width of the canvas view\n     *\n     * @property width\n     * @type Number\n     * @default 800\n     */\n    this.width = game.width * this.resolution;\n\n    /**\n     * The height of the canvas view\n     *\n     * @property height\n     * @type Number\n     * @default 600\n     */\n    this.height = game.height * this.resolution;\n\n    /**\n     * The canvas element that everything is drawn to.\n     *\n     * @property view\n     * @type HTMLCanvasElement\n     */\n    this.view = game.canvas;\n\n    /**\n     * The canvas 2d context that everything is drawn with\n     * @property context\n     * @type CanvasRenderingContext2D\n     */\n    this.context = this.view.getContext(\"2d\", { alpha: this.transparent } );\n\n    /**\n     * Boolean flag controlling canvas refresh.\n     *\n     * @property refresh\n     * @type Boolean\n     */\n    this.refresh = true;\n\n    /**\n     * Internal var.\n     *\n     * @property count\n     * @type Number\n     */\n    this.count = 0;\n\n    /**\n     * Instance of a PIXI.CanvasMaskManager, handles masking when using the canvas renderer\n     * @property CanvasMaskManager\n     * @type CanvasMaskManager\n     */\n    this.maskManager = new PIXI.CanvasMaskManager();\n\n    /**\n     * The render session is just a bunch of parameter used for rendering\n     * @property renderSession\n     * @type Object\n     */\n    this.renderSession = {\n        context: this.context,\n        maskManager: this.maskManager,\n        scaleMode: null,\n        smoothProperty: Phaser.Canvas.getSmoothingPrefix(this.context),\n\n        /**\n         * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.\n         * Handy for crisp pixel art and speed on legacy devices.\n         */\n        roundPixels: false\n    };\n\n    this.mapBlendModes();\n    \n    this.resize(this.width, this.height);\n\n};\n\n// constructor\nPIXI.CanvasRenderer.prototype.constructor = PIXI.CanvasRenderer;\n\n/**\n * Renders the DisplayObjectContainer, usually the Phaser.Stage, to this canvas view.\n *\n * @method render\n * @param root {Phaser.Stage|PIXI.DisplayObjectContainer} The root element to be rendered.\n */\nPIXI.CanvasRenderer.prototype.render = function (root) {\n\n    this.context.setTransform(1, 0, 0, 1, 0, 0);\n\n    this.context.globalAlpha = 1;\n\n    this.renderSession.currentBlendMode = 0;\n    this.renderSession.shakeX = this.game.camera._shake.x;\n    this.renderSession.shakeY = this.game.camera._shake.y;\n\n    this.context.globalCompositeOperation = 'source-over';\n\n    if (navigator.isCocoonJS && this.view.screencanvas)\n    {\n        this.context.fillStyle = \"black\";\n        this.context.clear();\n    }\n    \n    if (this.clearBeforeRender)\n    {\n        if (this.transparent)\n        {\n            this.context.clearRect(0, 0, this.width, this.height);\n        }\n        else if (root._bgColor)\n        {\n            this.context.fillStyle = root._bgColor.rgba;\n            this.context.fillRect(0, 0, this.width , this.height);\n        }\n    }\n    \n    this.renderDisplayObject(root);\n\n};\n\n\n/**\n * Removes everything from the renderer and optionally removes the Canvas DOM element.\n *\n * @method destroy\n * @param [removeView=true] {boolean} Removes the Canvas element from the DOM.\n */\nPIXI.CanvasRenderer.prototype.destroy = function (removeView) {\n\n    if (removeView === undefined) { removeView = true; }\n\n    if (removeView && this.view.parent)\n    {\n        this.view.parent.removeChild(this.view);\n    }\n\n    this.view = null;\n    this.context = null;\n    this.maskManager = null;\n    this.renderSession = null;\n\n};\n\n/**\n * Resizes the canvas view to the specified width and height\n *\n * @method resize\n * @param width {Number} the new width of the canvas view\n * @param height {Number} the new height of the canvas view\n */\nPIXI.CanvasRenderer.prototype.resize = function (width, height) {\n\n    this.width = width * this.resolution;\n    this.height = height * this.resolution;\n\n    this.view.width = this.width;\n    this.view.height = this.height;\n\n    if (this.autoResize)\n    {\n        this.view.style.width = this.width / this.resolution + \"px\";\n        this.view.style.height = this.height / this.resolution + \"px\";\n    }\n\n    if (this.renderSession.smoothProperty)\n    {\n        this.context[this.renderSession.smoothProperty] = (this.renderSession.scaleMode === PIXI.scaleModes.LINEAR);\n    }\n\n};\n\n/**\n * Renders a display object\n *\n * @method renderDisplayObject\n * @param displayObject {DisplayObject} The displayObject to render\n * @param context {CanvasRenderingContext2D} the context 2d method of the canvas\n * @param [matrix] {Matrix} Optional matrix to apply to the display object before rendering.\n * @private\n */\nPIXI.CanvasRenderer.prototype.renderDisplayObject = function (displayObject, context, matrix) {\n\n    this.renderSession.context = context || this.context;\n    this.renderSession.resolution = this.resolution;\n    displayObject._renderCanvas(this.renderSession, matrix);\n\n};\n\n/**\n * Maps Pixi blend modes to canvas blend modes.\n *\n * @method mapBlendModes\n * @private\n */\nPIXI.CanvasRenderer.prototype.mapBlendModes = function () {\n\n    if (!PIXI.blendModesCanvas)\n    {\n        var b = [];\n        var modes = PIXI.blendModes;\n        var useNew = PIXI.canUseNewCanvasBlendModes();\n\n        b[modes.NORMAL] = 'source-over';\n        b[modes.ADD] = 'lighter';\n        b[modes.MULTIPLY] = (useNew) ? 'multiply' : 'source-over';\n        b[modes.SCREEN] = (useNew) ? 'screen' : 'source-over';\n        b[modes.OVERLAY] = (useNew) ? 'overlay' : 'source-over';\n        b[modes.DARKEN] = (useNew) ? 'darken' : 'source-over';\n        b[modes.LIGHTEN] = (useNew) ? 'lighten' : 'source-over';\n        b[modes.COLOR_DODGE] = (useNew) ? 'color-dodge' : 'source-over';\n        b[modes.COLOR_BURN] = (useNew) ? 'color-burn' : 'source-over';\n        b[modes.HARD_LIGHT] = (useNew) ? 'hard-light' : 'source-over';\n        b[modes.SOFT_LIGHT] = (useNew) ? 'soft-light' : 'source-over';\n        b[modes.DIFFERENCE] = (useNew) ? 'difference' : 'source-over';\n        b[modes.EXCLUSION] = (useNew) ? 'exclusion' : 'source-over';\n        b[modes.HUE] = (useNew) ? 'hue' : 'source-over';\n        b[modes.SATURATION] = (useNew) ? 'saturation' : 'source-over';\n        b[modes.COLOR] = (useNew) ? 'color' : 'source-over';\n        b[modes.LUMINOSITY] = (useNew) ? 'luminosity' : 'source-over';\n\n        PIXI.blendModesCanvas = b;\n    }\n\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * A texture stores the information that represents an image. All textures have a base texture.\n *\n * @class BaseTexture\n * @uses EventTarget\n * @constructor\n * @param source {String|Canvas} the source object (image or canvas)\n * @param scaleMode {Number} See {{#crossLink \"PIXI/scaleModes:property\"}}PIXI.scaleModes{{/crossLink}} for possible values\n */\nPIXI.BaseTexture = function(source, scaleMode)\n{\n    /**\n     * The Resolution of the texture. \n     *\n     * @property resolution\n     * @type Number\n     */\n    this.resolution = 1;\n    \n    /**\n     * [read-only] The width of the base texture set when the image has loaded\n     *\n     * @property width\n     * @type Number\n     * @readOnly\n     */\n    this.width = 100;\n\n    /**\n     * [read-only] The height of the base texture set when the image has loaded\n     *\n     * @property height\n     * @type Number\n     * @readOnly\n     */\n    this.height = 100;\n\n    /**\n     * The scale mode to apply when scaling this texture\n     * \n     * @property scaleMode\n     * @type {Number}\n     * @default PIXI.scaleModes.LINEAR\n     */\n    this.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;\n\n    /**\n     * [read-only] Set to true once the base texture has loaded\n     *\n     * @property hasLoaded\n     * @type Boolean\n     * @readOnly\n     */\n    this.hasLoaded = false;\n\n    /**\n     * The image source that is used to create the texture.\n     *\n     * @property source\n     * @type Image\n     */\n    this.source = source;\n\n    /**\n     * Controls if RGB channels should be pre-multiplied by Alpha  (WebGL only)\n     *\n     * @property premultipliedAlpha\n     * @type Boolean\n     * @default true\n     */\n    this.premultipliedAlpha = true;\n\n    // used for webGL\n\n    /**\n     * @property _glTextures\n     * @type Array\n     * @private\n     */\n    this._glTextures = [];\n\n    /**\n     * Set this to true if a mipmap of this texture needs to be generated. This value needs to be set before the texture is used\n     * Also the texture must be a power of two size to work\n     * \n     * @property mipmap\n     * @type {Boolean}\n     */\n    this.mipmap = false;\n\n    /**\n     * @property _dirty\n     * @type Array\n     * @private\n     */\n    this._dirty = [true, true, true, true];\n\n    if (!source)\n    {\n        return;\n    }\n\n    if ((this.source.complete || this.source.getContext) && this.source.width && this.source.height)\n    {\n        this.hasLoaded = true;\n        this.width = this.source.naturalWidth || this.source.width;\n        this.height = this.source.naturalHeight || this.source.height;\n        this.dirty();\n    }\n\n    /**\n     * A BaseTexture can be set to skip the rendering phase in the WebGL Sprite Batch.\n     * \n     * You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture)\n     * that has children that you do want to render, without causing a batch flush in the process.\n     * \n     * @property skipRender\n     * @type Boolean\n     */\n    this.skipRender = false;\n\n    /**\n     * @property _powerOf2\n     * @type Boolean\n     * @private\n     */\n    this._powerOf2 = false;\n\n};\n\nPIXI.BaseTexture.prototype.constructor = PIXI.BaseTexture;\n\n/**\n * Forces this BaseTexture to be set as loaded, with the given width and height.\n * Then calls BaseTexture.dirty.\n * Important for when you don't want to modify the source object by forcing in `complete` or dimension properties it may not have.\n *\n * @method forceLoaded\n * @param {number} width - The new width to force the BaseTexture to be.\n * @param {number} height - The new height to force the BaseTexture to be.\n */\nPIXI.BaseTexture.prototype.forceLoaded = function(width, height)\n{\n    this.hasLoaded = true;\n    this.width = width;\n    this.height = height;\n    this.dirty();\n};\n\n/**\n * Destroys this base texture\n *\n * @method destroy\n */\nPIXI.BaseTexture.prototype.destroy = function()\n{\n    if (this.source)\n    {\n        PIXI.CanvasPool.removeByCanvas(this.source);\n    }\n\n    this.source = null;\n\n    this.unloadFromGPU();\n};\n\n/**\n * Changes the source image of the texture\n *\n * @method updateSourceImage\n * @param newSrc {String} the path of the image\n * @deprecated This method is deprecated. Please use Phaser.Sprite.loadTexture instead.\n */\nPIXI.BaseTexture.prototype.updateSourceImage = function(newSrc)\n{\n    console.warn(\"PIXI.BaseTexture.updateSourceImage is deprecated. Use Phaser.Sprite.loadTexture instead.\");\n};\n\n/**\n * Sets all glTextures to be dirty.\n *\n * @method dirty\n */\nPIXI.BaseTexture.prototype.dirty = function()\n{\n    for (var i = 0; i < this._glTextures.length; i++)\n    {\n        this._dirty[i] = true;\n    }\n};\n\n/**\n * Removes the base texture from the GPU, useful for managing resources on the GPU.\n * Atexture is still 100% usable and will simply be reuploaded if there is a sprite on screen that is using it.\n *\n * @method unloadFromGPU\n */\nPIXI.BaseTexture.prototype.unloadFromGPU = function()\n{\n    this.dirty();\n\n    // delete the webGL textures if any.\n    for (var i = this._glTextures.length - 1; i >= 0; i--)\n    {\n        var glTexture = this._glTextures[i];\n        var gl = PIXI.glContexts[i];\n\n        if(gl && glTexture)\n        {\n            gl.deleteTexture(glTexture);\n        }\n        \n    }\n\n    this._glTextures.length = 0;\n\n    this.dirty();\n};\n\n/**\n * Helper function that creates a base texture from the given canvas element.\n *\n * @static\n * @method fromCanvas\n * @param canvas {Canvas} The canvas element source of the texture\n * @param scaleMode {Number} See {{#crossLink \"PIXI/scaleModes:property\"}}PIXI.scaleModes{{/crossLink}} for possible values\n * @return {BaseTexture}\n */\nPIXI.BaseTexture.fromCanvas = function(canvas, scaleMode)\n{\n    if (canvas.width === 0)\n    {\n        canvas.width = 1;\n    }\n\n    if (canvas.height === 0)\n    {\n        canvas.height = 1;\n    }\n\n    return new PIXI.BaseTexture(canvas, scaleMode);\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * TextureSilentFail is a boolean that defaults to `false`. \n * If `true` then `PIXI.Texture.setFrame` will no longer throw an error if the texture dimensions are incorrect. \n * Instead `Texture.valid` will be set to `false` (#1556)\n *\n * @type {boolean}\n */\nPIXI.TextureSilentFail = false;\n\n/**\n * A texture stores the information that represents an image or part of an image. It cannot be added\n * to the display list directly. Instead use it as the texture for a PIXI.Sprite. If no frame is provided then the whole image is used.\n *\n * @class Texture\n * @uses EventTarget\n * @constructor\n * @param baseTexture {BaseTexture} The base texture source to create the texture from\n * @param frame {Rectangle} The rectangle frame of the texture to show\n * @param [crop] {Rectangle} The area of original texture \n * @param [trim] {Rectangle} Trimmed texture rectangle\n */\nPIXI.Texture = function(baseTexture, frame, crop, trim)\n{\n    /**\n     * Does this Texture have any frame data assigned to it?\n     *\n     * @property noFrame\n     * @type Boolean\n     */\n    this.noFrame = false;\n\n    if (!frame)\n    {\n        this.noFrame = true;\n        frame = new PIXI.Rectangle(0,0,1,1);\n    }\n\n    if (baseTexture instanceof PIXI.Texture)\n    {\n        baseTexture = baseTexture.baseTexture;\n    }\n\n    /**\n     * The base texture that this texture uses.\n     *\n     * @property baseTexture\n     * @type BaseTexture\n     */\n    this.baseTexture = baseTexture;\n\n    /**\n     * The frame specifies the region of the base texture that this texture uses\n     *\n     * @property frame\n     * @type Rectangle\n     */\n    this.frame = frame;\n\n    /**\n     * The texture trim data.\n     *\n     * @property trim\n     * @type Rectangle\n     */\n    this.trim = trim;\n\n    /**\n     * This will let the renderer know if the texture is valid. If it's not then it cannot be rendered.\n     *\n     * @property valid\n     * @type Boolean\n     */\n    this.valid = false;\n\n    /**\n     * Is this a tiling texture? As used by the likes of a TilingSprite.\n     *\n     * @property isTiling\n     * @type Boolean\n     */\n    this.isTiling = false;\n\n    /**\n     * This will let a renderer know that a texture has been updated (used mainly for webGL uv updates)\n     *\n     * @property requiresUpdate\n     * @type Boolean\n     */\n    this.requiresUpdate = false;\n\n    /**\n     * This will let a renderer know that a tinted parent has updated its texture.\n     *\n     * @property requiresReTint\n     * @type Boolean\n     */\n    this.requiresReTint = false;\n\n    /**\n     * The WebGL UV data cache.\n     *\n     * @property _uvs\n     * @type Object\n     * @private\n     */\n    this._uvs = null;\n\n    /**\n     * The width of the Texture in pixels.\n     *\n     * @property width\n     * @type Number\n     */\n    this.width = 0;\n\n    /**\n     * The height of the Texture in pixels.\n     *\n     * @property height\n     * @type Number\n     */\n    this.height = 0;\n\n    /**\n     * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,\n     * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)\n     *\n     * @property crop\n     * @type Rectangle\n     */\n    this.crop = crop || new PIXI.Rectangle(0, 0, 1, 1);\n\n    if (baseTexture.hasLoaded)\n    {\n        if (this.noFrame) frame = new PIXI.Rectangle(0, 0, baseTexture.width, baseTexture.height);\n        this.setFrame(frame);\n    }\n\n};\n\nPIXI.Texture.prototype.constructor = PIXI.Texture;\n\n/**\n * Called when the base texture is loaded\n *\n * @method onBaseTextureLoaded\n * @private\n */\nPIXI.Texture.prototype.onBaseTextureLoaded = function()\n{\n    var baseTexture = this.baseTexture;\n\n    if (this.noFrame)\n    {\n        this.frame = new PIXI.Rectangle(0, 0, baseTexture.width, baseTexture.height);\n    }\n\n    this.setFrame(this.frame);\n};\n\n/**\n * Destroys this texture\n *\n * @method destroy\n * @param destroyBase {Boolean} Whether to destroy the base texture as well\n */\nPIXI.Texture.prototype.destroy = function(destroyBase)\n{\n    if (destroyBase) this.baseTexture.destroy();\n\n    this.valid = false;\n};\n\n/**\n * Specifies the region of the baseTexture that this texture will use.\n *\n * @method setFrame\n * @param frame {Rectangle} The frame of the texture to set it to\n */\nPIXI.Texture.prototype.setFrame = function(frame)\n{\n    this.noFrame = false;\n\n    this.frame = frame;\n    this.width = frame.width;\n    this.height = frame.height;\n\n    this.crop.x = frame.x;\n    this.crop.y = frame.y;\n    this.crop.width = frame.width;\n    this.crop.height = frame.height;\n\n    if (!this.trim && (frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height))\n    {\n        if (!PIXI.TextureSilentFail)\n        {\n            throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);\n        }\n\n        this.valid = false;\n        return;\n    }\n\n    this.valid = frame && frame.width && frame.height && this.baseTexture.source && this.baseTexture.hasLoaded;\n\n    if (this.trim)\n    {\n        this.width = this.trim.width;\n        this.height = this.trim.height;\n        this.frame.width = this.trim.width;\n        this.frame.height = this.trim.height;\n    }\n    \n    if (this.valid) this._updateUvs();\n\n};\n\n/**\n * Updates the internal WebGL UV cache.\n *\n * @method _updateUvs\n * @private\n */\nPIXI.Texture.prototype._updateUvs = function()\n{\n    if(!this._uvs)this._uvs = new PIXI.TextureUvs();\n\n    var frame = this.crop;\n    var tw = this.baseTexture.width;\n    var th = this.baseTexture.height;\n    \n    this._uvs.x0 = frame.x / tw;\n    this._uvs.y0 = frame.y / th;\n\n    this._uvs.x1 = (frame.x + frame.width) / tw;\n    this._uvs.y1 = frame.y / th;\n\n    this._uvs.x2 = (frame.x + frame.width) / tw;\n    this._uvs.y2 = (frame.y + frame.height) / th;\n\n    this._uvs.x3 = frame.x / tw;\n    this._uvs.y3 = (frame.y + frame.height) / th;\n};\n\n/**\n * Helper function that creates a new a Texture based on the given canvas element.\n *\n * @static\n * @method fromCanvas\n * @param canvas {Canvas} The canvas element source of the texture\n * @param scaleMode {Number} See {{#crossLink \"PIXI/scaleModes:property\"}}PIXI.scaleModes{{/crossLink}} for possible values\n * @return {Texture}\n */\nPIXI.Texture.fromCanvas = function(canvas, scaleMode)\n{\n    var baseTexture = PIXI.BaseTexture.fromCanvas(canvas, scaleMode);\n\n    return new PIXI.Texture(baseTexture);\n};\n\nPIXI.TextureUvs = function()\n{\n    this.x0 = 0;\n    this.y0 = 0;\n\n    this.x1 = 0;\n    this.y1 = 0;\n\n    this.x2 = 0;\n    this.y2 = 0;\n\n    this.x3 = 0;\n    this.y3 = 0;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * A RenderTexture is a special texture that allows any Pixi display object to be rendered to it.\n *\n * __Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded otherwise black rectangles will be drawn instead.\n *\n * A RenderTexture takes a snapshot of any Display Object given to its render method. The position and rotation of the given Display Objects is ignored. For example:\n *\n *    var renderTexture = new PIXI.RenderTexture(800, 600);\n *    var sprite = PIXI.Sprite.fromImage(\"spinObj_01.png\");\n *    sprite.position.x = 800/2;\n *    sprite.position.y = 600/2;\n *    sprite.anchor.x = 0.5;\n *    sprite.anchor.y = 0.5;\n *    renderTexture.render(sprite);\n *\n * The Sprite in this case will be rendered to a position of 0,0. To render this sprite at its actual position a DisplayObjectContainer should be used:\n *\n *    var doc = new PIXI.DisplayObjectContainer();\n *    doc.addChild(sprite);\n *    renderTexture.render(doc);  // Renders to center of renderTexture\n *\n * @class RenderTexture\n * @extends Texture\n * @constructor\n * @param width {Number} The width of the render texture\n * @param height {Number} The height of the render texture\n * @param renderer {CanvasRenderer|WebGLRenderer} The renderer used for this RenderTexture\n * @param scaleMode {Number} See {{#crossLink \"PIXI/scaleModes:property\"}}PIXI.scaleModes{{/crossLink}} for possible values\n * @param resolution {Number} The resolution of the texture being generated\n */\nPIXI.RenderTexture = function(width, height, renderer, scaleMode, resolution)\n{\n    /**\n     * The with of the render texture\n     *\n     * @property width\n     * @type Number\n     */\n    this.width = width || 100;\n\n    /**\n     * The height of the render texture\n     *\n     * @property height\n     * @type Number\n     */\n    this.height = height || 100;\n\n    /**\n     * The Resolution of the texture.\n     *\n     * @property resolution\n     * @type Number\n     */\n    this.resolution = resolution || 1;\n\n    /**\n     * The framing rectangle of the render texture\n     *\n     * @property frame\n     * @type Rectangle\n     */\n    this.frame = new PIXI.Rectangle(0, 0, this.width * this.resolution, this.height * this.resolution);\n\n    /**\n     * This is the area of the BaseTexture image to actually copy to the Canvas / WebGL when rendering,\n     * irrespective of the actual frame size or placement (which can be influenced by trimmed texture atlases)\n     *\n     * @property crop\n     * @type Rectangle\n     */\n    this.crop = new PIXI.Rectangle(0, 0, this.width * this.resolution, this.height * this.resolution);\n\n    /**\n     * The base texture object that this texture uses\n     *\n     * @property baseTexture\n     * @type BaseTexture\n     */\n    this.baseTexture = new PIXI.BaseTexture();\n    this.baseTexture.width = this.width * this.resolution;\n    this.baseTexture.height = this.height * this.resolution;\n    this.baseTexture._glTextures = [];\n    this.baseTexture.resolution = this.resolution;\n\n    this.baseTexture.scaleMode = scaleMode || PIXI.scaleModes.DEFAULT;\n\n    this.baseTexture.hasLoaded = true;\n\n    PIXI.Texture.call(this,\n        this.baseTexture,\n        new PIXI.Rectangle(0, 0, this.width * this.resolution, this.height * this.resolution)\n    );\n\n    /**\n     * The renderer this RenderTexture uses. A RenderTexture can only belong to one renderer at the moment if its webGL.\n     *\n     * @property renderer\n     * @type CanvasRenderer|WebGLRenderer\n     */\n    this.renderer = renderer || PIXI.defaultRenderer;\n\n    if (this.renderer.type === PIXI.WEBGL_RENDERER)\n    {\n        var gl = this.renderer.gl;\n        this.baseTexture._dirty[gl.id] = false;\n\n        this.textureBuffer = new PIXI.FilterTexture(gl, this.width, this.height, this.baseTexture.scaleMode);\n        this.baseTexture._glTextures[gl.id] =  this.textureBuffer.texture;\n\n        this.render = this.renderWebGL;\n        this.projection = new PIXI.Point(this.width * 0.5, -this.height * 0.5);\n    }\n    else\n    {\n        this.render = this.renderCanvas;\n        this.textureBuffer = new PIXI.CanvasBuffer(this.width * this.resolution, this.height * this.resolution);\n        this.baseTexture.source = this.textureBuffer.canvas;\n    }\n\n    /**\n     * @property valid\n     * @type Boolean\n     */\n    this.valid = true;\n\n    this.tempMatrix = new Phaser.Matrix();\n\n    this._updateUvs();\n};\n\nPIXI.RenderTexture.prototype = Object.create(PIXI.Texture.prototype);\nPIXI.RenderTexture.prototype.constructor = PIXI.RenderTexture;\n\n/**\n * Resizes the RenderTexture.\n *\n * @method resize\n * @param width {Number} The width to resize to.\n * @param height {Number} The height to resize to.\n * @param updateBase {Boolean} Should the baseTexture.width and height values be resized as well?\n */\nPIXI.RenderTexture.prototype.resize = function(width, height, updateBase)\n{\n    if (width === this.width && height === this.height)return;\n\n    this.valid = (width > 0 && height > 0);\n\n    this.width = width;\n    this.height = height;\n    this.frame.width = this.crop.width = width * this.resolution;\n    this.frame.height = this.crop.height = height * this.resolution;\n\n    if (updateBase)\n    {\n        this.baseTexture.width = this.width * this.resolution;\n        this.baseTexture.height = this.height * this.resolution;\n    }\n\n    if (this.renderer.type === PIXI.WEBGL_RENDERER)\n    {\n        this.projection.x = this.width / 2;\n        this.projection.y = -this.height / 2;\n    }\n\n    if(!this.valid)return;\n\n    this.textureBuffer.resize(this.width, this.height);\n};\n\n/**\n * Clears the RenderTexture.\n *\n * @method clear\n */\nPIXI.RenderTexture.prototype.clear = function()\n{\n    if (!this.valid)\n    {\n        return;\n    }\n\n    if (this.renderer.type === PIXI.WEBGL_RENDERER)\n    {\n        this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);\n    }\n\n    this.textureBuffer.clear();\n};\n\n/**\n * This function will draw the display object to the texture.\n *\n * @method renderWebGL\n * @param displayObject {DisplayObject} The display object to render this texture on\n * @param [matrix] {Matrix} Optional matrix to apply to the display object before rendering.\n * @param [clear] {Boolean} If true the texture will be cleared before the displayObject is drawn\n * @private\n */\nPIXI.RenderTexture.prototype.renderWebGL = function(displayObject, matrix, clear)\n{\n    if (!this.valid || displayObject.alpha === 0)\n    {\n        return;\n    }\n   \n    //  Let's create a nice matrix to apply to our display object.\n    //  Frame buffers come in upside down so we need to flip the matrix.\n    var wt = displayObject.worldTransform;\n    wt.identity();\n    wt.translate(0, this.projection.y * 2);\n\n    if (matrix)\n    {\n        wt.append(matrix);\n    }\n\n    wt.scale(1, -1);\n\n    //  Time to update all the children of the displayObject with the new matrix.\n    for (var i = 0; i < displayObject.children.length; i++)\n    {\n        displayObject.children[i].updateTransform();\n    }\n    \n    //  Time for the webGL fun stuff!\n    var gl = this.renderer.gl;\n\n    gl.viewport(0, 0, this.width * this.resolution, this.height * this.resolution);\n\n    gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer );\n\n    if (clear)\n    {\n        this.textureBuffer.clear();\n    }\n\n    this.renderer.spriteBatch.dirty = true;\n\n    this.renderer.renderDisplayObject(displayObject, this.projection, this.textureBuffer.frameBuffer, matrix);\n\n    this.renderer.spriteBatch.dirty = true;\n\n};\n\n/**\n * This function will draw the display object to the texture.\n *\n * @method renderCanvas\n * @param displayObject {DisplayObject} The display object to render this texture on\n * @param [matrix] {Matrix} Optional matrix to apply to the display object before rendering.\n * @param [clear] {Boolean} If true the texture will be cleared before the displayObject is drawn\n * @private\n */\nPIXI.RenderTexture.prototype.renderCanvas = function(displayObject, matrix, clear)\n{\n    if (!this.valid || displayObject.alpha === 0)\n    {\n        return;\n    }\n\n    //  Let's create a nice matrix to apply to our display object.\n    //  Frame buffers come in upside down so we need to flip the matrix.\n    var wt = displayObject.worldTransform;\n    wt.identity();\n\n    if (matrix)\n    {\n        wt.append(matrix);\n    }\n\n    // Time to update all the children of the displayObject with the new matrix (what new matrix? there isn't one!)\n    for (var i = 0; i < displayObject.children.length; i++)\n    {\n        displayObject.children[i].updateTransform();\n    }\n\n    if (clear)\n    {\n        this.textureBuffer.clear();\n    }\n\n    var realResolution = this.renderer.resolution;\n\n    this.renderer.resolution = this.resolution;\n\n    this.renderer.renderDisplayObject(displayObject, this.textureBuffer.context, matrix);\n\n    this.renderer.resolution = realResolution;\n};\n\n/**\n * Will return a HTML Image of the texture\n *\n * @method getImage\n * @return {Image}\n */\nPIXI.RenderTexture.prototype.getImage = function()\n{\n    var image = new Image();\n    image.src = this.getBase64();\n    return image;\n};\n\n/**\n * Will return a base64 encoded string of this texture. It works by calling RenderTexture.getCanvas and then running toDataURL on that.\n *\n * @method getBase64\n * @return {String} A base64 encoded string of the texture.\n */\nPIXI.RenderTexture.prototype.getBase64 = function()\n{\n    return this.getCanvas().toDataURL();\n};\n\n/**\n * Creates a Canvas element, renders this RenderTexture to it and then returns it.\n *\n * @method getCanvas\n * @return {HTMLCanvasElement} A Canvas element with the texture rendered on.\n */\nPIXI.RenderTexture.prototype.getCanvas = function()\n{\n    if (this.renderer.type === PIXI.WEBGL_RENDERER)\n    {\n        var gl =  this.renderer.gl;\n        var width = this.textureBuffer.width;\n        var height = this.textureBuffer.height;\n\n        var webGLPixels = new Uint8Array(4 * width * height);\n\n        gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer);\n        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, webGLPixels);\n        gl.bindFramebuffer(gl.FRAMEBUFFER, null);\n\n        var tempCanvas = new PIXI.CanvasBuffer(width, height);\n        var canvasData = tempCanvas.context.getImageData(0, 0, width, height);\n        canvasData.data.set(webGLPixels);\n\n        tempCanvas.context.putImageData(canvasData, 0, 0);\n\n        return tempCanvas.canvas;\n    }\n    else\n    {\n        return this.textureBuffer.canvas;\n    }\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n/**\n * This is the base class for creating a PIXI filter. Currently only webGL supports filters.\n * If you want to make a custom filter this should be your base class.\n * \n * @class AbstractFilter\n * @constructor\n * @param fragmentSrc {Array} The fragment source in an array of strings.\n * @param uniforms {Object} An object containing the uniforms for this filter.\n */\nPIXI.AbstractFilter = function(fragmentSrc, uniforms)\n{\n    /**\n    * An array of passes - some filters contain a few steps this array simply stores the steps in a liniear fashion.\n    * For example the blur filter has two passes blurX and blurY.\n    * @property passes\n    * @type Array\n    * @private\n    */\n    this.passes = [this];\n\n    /**\n    * @property shaders\n    * @type Array\n    * @private\n    */\n    this.shaders = [];\n    \n    /**\n    * @property dirty\n    * @type Boolean\n    */\n    this.dirty = true;\n\n    /**\n    * @property padding\n    * @type Number\n    */\n    this.padding = 0;\n\n    /**\n    * @property uniforms\n    * @type Object\n    * @private\n    */\n    this.uniforms = uniforms || {};\n\n    /**\n    * @property fragmentSrc\n    * @type Array\n    * @private\n    */\n    this.fragmentSrc = fragmentSrc || [];\n};\n\nPIXI.AbstractFilter.prototype.constructor = PIXI.AbstractFilter;\n\n/**\n * Syncs the uniforms between the class object and the shaders.\n *\n * @method syncUniforms\n */\nPIXI.AbstractFilter.prototype.syncUniforms = function()\n{\n    for(var i=0,j=this.shaders.length; i<j; i++)\n    {\n        this.shaders[i].dirty = true;\n    }\n};\n\n/**\n * @author Mat Groves http://matgroves.com/\n */\n\n /**\n *\n * @class Strip\n * @extends DisplayObjectContainer\n * @constructor\n * @param texture {Texture} The texture to use\n * @param width {Number} the width\n * @param height {Number} the height\n *\n */\nPIXI.Strip = function(texture)\n{\n    PIXI.DisplayObjectContainer.call( this );\n\n\n    /**\n     * The texture of the strip\n     *\n     * @property texture\n     * @type Texture\n     */\n    this.texture = texture;\n\n    // set up the main bits..\n    this.uvs = new PIXI.Float32Array([0, 1,\n                                      1, 1,\n                                      1, 0,\n                                      0, 1]);\n\n    this.vertices = new PIXI.Float32Array([0, 0,\n                                            100, 0,\n                                            100, 100,\n                                            0, 100]);\n\n    this.colors = new PIXI.Float32Array([1, 1, 1, 1]);\n\n    this.indices = new PIXI.Uint16Array([0, 1, 2, 3]);\n\n    /**\n     * Whether the strip is dirty or not\n     *\n     * @property dirty\n     * @type Boolean\n     */\n    this.dirty = true;\n\n    /**\n     * The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.\n     *\n     * @property blendMode\n     * @type Number\n     * @default PIXI.blendModes.NORMAL;\n     */\n    this.blendMode = PIXI.blendModes.NORMAL;\n\n    /**\n     * Triangles in canvas mode are automatically antialiased, use this value to force triangles to overlap a bit with each other.\n     *\n     * @property canvasPadding\n     * @type Number\n     */\n    this.canvasPadding = 0;\n\n    this.drawMode = PIXI.Strip.DrawModes.TRIANGLE_STRIP;\n\n};\n\n// constructor\nPIXI.Strip.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);\nPIXI.Strip.prototype.constructor = PIXI.Strip;\n\nPIXI.Strip.prototype._renderWebGL = function(renderSession)\n{\n    // if the sprite is not visible or the alpha is 0 then no need to render this element\n    if(!this.visible || this.alpha <= 0)return;\n    // render triangle strip..\n\n    renderSession.spriteBatch.stop();\n\n    // init! init!\n    if(!this._vertexBuffer)this._initWebGL(renderSession);\n\n    renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);\n\n    this._renderStrip(renderSession);\n\n    ///renderSession.shaderManager.activateDefaultShader();\n\n    renderSession.spriteBatch.start();\n\n    //TODO check culling\n};\n\nPIXI.Strip.prototype._initWebGL = function(renderSession)\n{\n    // build the strip!\n    var gl = renderSession.gl;\n\n    this._vertexBuffer = gl.createBuffer();\n    this._indexBuffer = gl.createBuffer();\n    this._uvBuffer = gl.createBuffer();\n    this._colorBuffer = gl.createBuffer();\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER,  this.uvs, gl.STATIC_DRAW);\n\n    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);\n    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);\n\n    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);\n    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);\n};\n\nPIXI.Strip.prototype._renderStrip = function(renderSession)\n{\n    var gl = renderSession.gl;\n    var projection = renderSession.projection,\n        offset = renderSession.offset,\n        shader = renderSession.shaderManager.stripShader;\n\n    var drawMode = this.drawMode === PIXI.Strip.DrawModes.TRIANGLE_STRIP ? gl.TRIANGLE_STRIP : gl.TRIANGLES;\n\n    // gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mat4Real);\n\n    renderSession.blendModeManager.setBlendMode(this.blendMode);\n\n\n    // set uniforms\n    gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));\n    gl.uniform2f(shader.projectionVector, projection.x, -projection.y);\n    gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);\n    gl.uniform1f(shader.alpha, this.worldAlpha);\n\n    if(!this.dirty)\n    {\n\n        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);\n        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);\n        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);\n\n        // update the uvs\n        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);\n        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);\n\n        gl.activeTexture(gl.TEXTURE0);\n\n        // check if a texture is dirty..\n        if(this.texture.baseTexture._dirty[gl.id])\n        {\n            renderSession.renderer.updateTexture(this.texture.baseTexture);\n        }\n        else\n        {\n            // bind the current texture\n            gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);\n        }\n\n        // dont need to upload!\n        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);\n\n\n    }\n    else\n    {\n\n        this.dirty = false;\n        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);\n        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);\n        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);\n\n        // update the uvs\n        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);\n        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);\n        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);\n\n        gl.activeTexture(gl.TEXTURE0);\n\n        // check if a texture is dirty..\n        if(this.texture.baseTexture._dirty[gl.id])\n        {\n            renderSession.renderer.updateTexture(this.texture.baseTexture);\n        }\n        else\n        {\n            gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);\n        }\n\n        // dont need to upload!\n        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);\n        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);\n\n    }\n    //console.log(gl.TRIANGLE_STRIP)\n    //\n    //\n    gl.drawElements(drawMode, this.indices.length, gl.UNSIGNED_SHORT, 0);\n\n\n};\n\n\n\nPIXI.Strip.prototype._renderCanvas = function(renderSession)\n{\n    var context = renderSession.context;\n\n    var transform = this.worldTransform;\n\n    var tx = (transform.tx * renderSession.resolution) + renderSession.shakeX;\n    var ty = (transform.ty * renderSession.resolution) + renderSession.shakeY;\n\n    if (renderSession.roundPixels)\n    {\n        context.setTransform(transform.a, transform.b, transform.c, transform.d, tx | 0, ty | 0);\n    }\n    else\n    {\n        context.setTransform(transform.a, transform.b, transform.c, transform.d, tx, ty);\n    }\n\n    if (this.drawMode === PIXI.Strip.DrawModes.TRIANGLE_STRIP)\n    {\n        this._renderCanvasTriangleStrip(context);\n    }\n    else\n    {\n        this._renderCanvasTriangles(context);\n    }\n};\n\nPIXI.Strip.prototype._renderCanvasTriangleStrip = function(context)\n{\n    // draw triangles!!\n    var vertices = this.vertices;\n    var uvs = this.uvs;\n\n    var length = vertices.length / 2;\n    this.count++;\n\n    for (var i = 0; i < length - 2; i++) {\n        // draw some triangles!\n        var index = i * 2;\n        this._renderCanvasDrawTriangle(context, vertices, uvs, index, (index + 2), (index + 4));\n    }\n};\n\nPIXI.Strip.prototype._renderCanvasTriangles = function(context)\n{\n    // draw triangles!!\n    var vertices = this.vertices;\n    var uvs = this.uvs;\n    var indices = this.indices;\n\n    var length = indices.length;\n    this.count++;\n\n    for (var i = 0; i < length; i += 3) {\n        // draw some triangles!\n        var index0 = indices[i] * 2, index1 = indices[i + 1] * 2, index2 = indices[i + 2] * 2;\n        this._renderCanvasDrawTriangle(context, vertices, uvs, index0, index1, index2);\n    }\n};\n\nPIXI.Strip.prototype._renderCanvasDrawTriangle = function(context, vertices, uvs, index0, index1, index2)\n{\n    var textureSource = this.texture.baseTexture.source;\n    var textureWidth = this.texture.width;\n    var textureHeight = this.texture.height;\n\n    var x0 = vertices[index0], x1 = vertices[index1], x2 = vertices[index2];\n    var y0 = vertices[index0 + 1], y1 = vertices[index1 + 1], y2 = vertices[index2 + 1];\n\n    var u0 = uvs[index0] * textureWidth, u1 = uvs[index1] * textureWidth, u2 = uvs[index2] * textureWidth;\n    var v0 = uvs[index0 + 1] * textureHeight, v1 = uvs[index1 + 1] * textureHeight, v2 = uvs[index2 + 1] * textureHeight;\n\n    if (this.canvasPadding > 0) {\n        var paddingX = this.canvasPadding / this.worldTransform.a;\n        var paddingY = this.canvasPadding / this.worldTransform.d;\n        var centerX = (x0 + x1 + x2) / 3;\n        var centerY = (y0 + y1 + y2) / 3;\n\n        var normX = x0 - centerX;\n        var normY = y0 - centerY;\n\n        var dist = Math.sqrt(normX * normX + normY * normY);\n        x0 = centerX + (normX / dist) * (dist + paddingX);\n        y0 = centerY + (normY / dist) * (dist + paddingY);\n\n        //\n\n        normX = x1 - centerX;\n        normY = y1 - centerY;\n\n        dist = Math.sqrt(normX * normX + normY * normY);\n        x1 = centerX + (normX / dist) * (dist + paddingX);\n        y1 = centerY + (normY / dist) * (dist + paddingY);\n\n        normX = x2 - centerX;\n        normY = y2 - centerY;\n\n        dist = Math.sqrt(normX * normX + normY * normY);\n        x2 = centerX + (normX / dist) * (dist + paddingX);\n        y2 = centerY + (normY / dist) * (dist + paddingY);\n    }\n\n    context.save();\n    context.beginPath();\n\n\n    context.moveTo(x0, y0);\n    context.lineTo(x1, y1);\n    context.lineTo(x2, y2);\n\n    context.closePath();\n\n    context.clip();\n\n    // Compute matrix transform\n    var delta =  (u0 * v1)      + (v0 * u2)      + (u1 * v2)      - (v1 * u2)      - (v0 * u1)      - (u0 * v2);\n    var deltaA = (x0 * v1)      + (v0 * x2)      + (x1 * v2)      - (v1 * x2)      - (v0 * x1)      - (x0 * v2);\n    var deltaB = (u0 * x1)      + (x0 * u2)      + (u1 * x2)      - (x1 * u2)      - (x0 * u1)      - (u0 * x2);\n    var deltaC = (u0 * v1 * x2) + (v0 * x1 * u2) + (x0 * u1 * v2) - (x0 * v1 * u2) - (v0 * u1 * x2) - (u0 * x1 * v2);\n    var deltaD = (y0 * v1)      + (v0 * y2)      + (y1 * v2)      - (v1 * y2)      - (v0 * y1)      - (y0 * v2);\n    var deltaE = (u0 * y1)      + (y0 * u2)      + (u1 * y2)      - (y1 * u2)      - (y0 * u1)      - (u0 * y2);\n    var deltaF = (u0 * v1 * y2) + (v0 * y1 * u2) + (y0 * u1 * v2) - (y0 * v1 * u2) - (v0 * u1 * y2) - (u0 * y1 * v2);\n\n    context.transform(deltaA / delta, deltaD / delta,\n        deltaB / delta, deltaE / delta,\n        deltaC / delta, deltaF / delta);\n\n    context.drawImage(textureSource, 0, 0);\n    context.restore();\n};\n\n\n\n/**\n * Renders a flat strip\n *\n * @method renderStripFlat\n * @param strip {Strip} The Strip to render\n * @private\n */\nPIXI.Strip.prototype.renderStripFlat = function(strip)\n{\n    var context = this.context;\n    var vertices = strip.vertices;\n\n    var length = vertices.length/2;\n    this.count++;\n\n    context.beginPath();\n    for (var i=1; i < length-2; i++)\n    {\n        // draw some triangles!\n        var index = i*2;\n\n        var x0 = vertices[index],   x1 = vertices[index+2], x2 = vertices[index+4];\n        var y0 = vertices[index+1], y1 = vertices[index+3], y2 = vertices[index+5];\n\n        context.moveTo(x0, y0);\n        context.lineTo(x1, y1);\n        context.lineTo(x2, y2);\n    }\n\n    context.fillStyle = '#FF0000';\n    context.fill();\n    context.closePath();\n};\n\n/*\nPIXI.Strip.prototype.setTexture = function(texture)\n{\n    //TODO SET THE TEXTURES\n    //TODO VISIBILITY\n\n    // stop current texture\n    this.texture = texture;\n    this.width   = texture.frame.width;\n    this.height  = texture.frame.height;\n    this.updateFrame = true;\n};\n*/\n\n/**\n * When the texture is updated, this event will fire to update the scale and frame\n *\n * @method onTextureUpdate\n * @param event\n * @private\n */\n\nPIXI.Strip.prototype.onTextureUpdate = function()\n{\n    this.updateFrame = true;\n};\n\n/**\n * Returns the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.\n *\n * @method getBounds\n * @param matrix {Matrix} the transformation matrix of the sprite\n * @return {Rectangle} the framing rectangle\n */\nPIXI.Strip.prototype.getBounds = function(matrix)\n{\n    var worldTransform = matrix || this.worldTransform;\n\n    var a = worldTransform.a;\n    var b = worldTransform.b;\n    var c = worldTransform.c;\n    var d = worldTransform.d;\n    var tx = worldTransform.tx;\n    var ty = worldTransform.ty;\n\n    var maxX = -Infinity;\n    var maxY = -Infinity;\n\n    var minX = Infinity;\n    var minY = Infinity;\n\n    var vertices = this.vertices;\n    for (var i = 0, n = vertices.length; i < n; i += 2)\n    {\n        var rawX = vertices[i], rawY = vertices[i + 1];\n        var x = (a * rawX) + (c * rawY) + tx;\n        var y = (d * rawY) + (b * rawX) + ty;\n\n        minX = x < minX ? x : minX;\n        minY = y < minY ? y : minY;\n\n        maxX = x > maxX ? x : maxX;\n        maxY = y > maxY ? y : maxY;\n    }\n\n    if (minX === -Infinity || maxY === Infinity)\n    {\n        return PIXI.EmptyRectangle;\n    }\n\n    var bounds = this._bounds;\n\n    bounds.x = minX;\n    bounds.width = maxX - minX;\n\n    bounds.y = minY;\n    bounds.height = maxY - minY;\n\n    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate\n    this._currentBounds = bounds;\n\n    return bounds;\n};\n\n/**\n * Different drawing buffer modes supported\n *\n * @property\n * @type {{TRIANGLE_STRIP: number, TRIANGLES: number}}\n * @static\n */\nPIXI.Strip.DrawModes = {\n    TRIANGLE_STRIP: 0,\n    TRIANGLES: 1\n};\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n * @copyright Mat Groves, Rovanion Luckey\n */\n\n/**\n *\n * @class Rope\n * @constructor\n * @extends Strip\n * @param {Texture} texture - The texture to use on the rope.\n * @param {Array} points - An array of {PIXI.Point}.\n *\n */\nPIXI.Rope = function(texture, points)\n{\n    PIXI.Strip.call( this, texture );\n    this.points = points;\n\n    this.vertices = new PIXI.Float32Array(points.length * 4);\n    this.uvs = new PIXI.Float32Array(points.length * 4);\n    this.colors = new PIXI.Float32Array(points.length * 2);\n    this.indices = new PIXI.Uint16Array(points.length * 2);\n\n\n    this.refresh();\n};\n\n\n// constructor\nPIXI.Rope.prototype = Object.create( PIXI.Strip.prototype );\nPIXI.Rope.prototype.constructor = PIXI.Rope;\n\n/*\n * Refreshes\n *\n * @method refresh\n */\nPIXI.Rope.prototype.refresh = function()\n{\n    var points = this.points;\n    if(points.length < 1) return;\n\n    var uvs = this.uvs;\n\n    var lastPoint = points[0];\n    var indices = this.indices;\n    var colors = this.colors;\n\n    this.count-=0.2;\n\n    uvs[0] = 0;\n    uvs[1] = 0;\n    uvs[2] = 0;\n    uvs[3] = 1;\n\n    colors[0] = 1;\n    colors[1] = 1;\n\n    indices[0] = 0;\n    indices[1] = 1;\n\n    var total = points.length,\n        point, index, amount;\n\n    for (var i = 1; i < total; i++)\n    {\n        point = points[i];\n        index = i * 4;\n        // time to do some smart drawing!\n        amount = i / (total-1);\n\n        if(i%2)\n        {\n            uvs[index] = amount;\n            uvs[index+1] = 0;\n\n            uvs[index+2] = amount;\n            uvs[index+3] = 1;\n        }\n        else\n        {\n            uvs[index] = amount;\n            uvs[index+1] = 0;\n\n            uvs[index+2] = amount;\n            uvs[index+3] = 1;\n        }\n\n        index = i * 2;\n        colors[index] = 1;\n        colors[index+1] = 1;\n\n        index = i * 2;\n        indices[index] = index;\n        indices[index + 1] = index + 1;\n\n        lastPoint = point;\n    }\n};\n\n/*\n * Updates the object transform for rendering\n *\n * @method updateTransform\n * @private\n */\nPIXI.Rope.prototype.updateTransform = function()\n{\n\n    var points = this.points;\n    if(points.length < 1)return;\n\n    var lastPoint = points[0];\n    var nextPoint;\n    var perp = {x:0, y:0};\n\n    this.count-=0.2;\n\n    var vertices = this.vertices;\n    var total = points.length,\n        point, index, ratio, perpLength, num;\n\n    for (var i = 0; i < total; i++)\n    {\n        point = points[i];\n        index = i * 4;\n\n        if(i < points.length-1)\n        {\n            nextPoint = points[i+1];\n        }\n        else\n        {\n            nextPoint = point;\n        }\n\n        perp.y = -(nextPoint.x - lastPoint.x);\n        perp.x = nextPoint.y - lastPoint.y;\n\n        ratio = (1 - (i / (total-1))) * 10;\n\n        if(ratio > 1) ratio = 1;\n\n        perpLength = Math.sqrt(perp.x * perp.x + perp.y * perp.y);\n        num = this.texture.height / 2; //(20 + Math.abs(Math.sin((i + this.count) * 0.3) * 50) )* ratio;\n        perp.x /= perpLength;\n        perp.y /= perpLength;\n\n        perp.x *= num;\n        perp.y *= num;\n\n        vertices[index] = point.x + perp.x;\n        vertices[index+1] = point.y + perp.y;\n        vertices[index+2] = point.x - perp.x;\n        vertices[index+3] = point.y - perp.y;\n\n        lastPoint = point;\n    }\n\n    PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );\n};\n/*\n * Sets the texture that the Rope will use\n *\n * @method setTexture\n * @param texture {Texture} the texture that will be used\n */\nPIXI.Rope.prototype.setTexture = function(texture)\n{\n    // stop current texture\n    this.texture = texture;\n    //this.updateFrame = true;\n};\n\n/**\n * @author Mat Groves http://matgroves.com/\n */\n\n/**\n * A tiling sprite is a fast way of rendering a tiling image\n *\n * @class TilingSprite\n * @extends Sprite\n * @constructor\n * @param texture {Texture} the texture of the tiling sprite\n * @param width {Number}  the width of the tiling sprite\n * @param height {Number} the height of the tiling sprite\n */\nPIXI.TilingSprite = function(texture, width, height)\n{\n    PIXI.Sprite.call(this, texture);\n\n    /**\n     * The width of the tiling sprite\n     *\n     * @property width\n     * @type Number\n     */\n    this._width = width || 128;\n\n    /**\n     * The height of the tiling sprite\n     *\n     * @property height\n     * @type Number\n     */\n    this._height = height || 128;\n\n    /**\n     * The scaling of the image that is being tiled\n     *\n     * @property tileScale\n     * @type Point\n     */\n    this.tileScale = new PIXI.Point(1, 1);\n\n    /**\n     * A point that represents the scale of the texture object\n     *\n     * @property tileScaleOffset\n     * @type Point\n     */\n    this.tileScaleOffset = new PIXI.Point(1, 1);\n    \n    /**\n     * The offset position of the image that is being tiled\n     *\n     * @property tilePosition\n     * @type Point\n     */\n    this.tilePosition = new PIXI.Point();\n\n    /**\n     * Whether this sprite is renderable or not\n     *\n     * @property renderable\n     * @type Boolean\n     * @default true\n     */\n    this.renderable = true;\n\n    /**\n     * The tint applied to the sprite. This is a hex value\n     *\n     * @property tint\n     * @type Number\n     * @default 0xFFFFFF\n     */\n    this.tint = 0xFFFFFF;\n\n    /**\n     * If enabled a green rectangle will be drawn behind the generated tiling texture, allowing you to visually\n     * debug the texture being used.\n     *\n     * @property textureDebug\n     * @type Boolean\n     */\n    this.textureDebug = false;\n    \n    /**\n     * The blend mode to be applied to the sprite\n     *\n     * @property blendMode\n     * @type Number\n     * @default PIXI.blendModes.NORMAL;\n     */\n    this.blendMode = PIXI.blendModes.NORMAL;\n\n    /**\n     * The CanvasBuffer object that the tiled texture is drawn to.\n     *\n     * @property canvasBuffer\n     * @type PIXI.CanvasBuffer\n     */\n    this.canvasBuffer = null;\n\n    /**\n     * An internal Texture object that holds the tiling texture that was generated from TilingSprite.texture.\n     *\n     * @property tilingTexture\n     * @type PIXI.Texture\n     */\n    this.tilingTexture = null;\n\n    /**\n     * The Context fill pattern that is used to draw the TilingSprite in Canvas mode only (will be null in WebGL).\n     *\n     * @property tilePattern\n     * @type PIXI.Texture\n     */\n    this.tilePattern = null;\n\n    /**\n     * If true the TilingSprite will run generateTexture on its **next** render pass.\n     * This is set by the likes of Phaser.LoadTexture.setFrame.\n     *\n     * @property refreshTexture\n     * @type Boolean\n     * @default true\n     */\n    this.refreshTexture = true;\n\n    this.frameWidth = 0;\n    this.frameHeight = 0;\n\n};\n\nPIXI.TilingSprite.prototype = Object.create(PIXI.Sprite.prototype);\nPIXI.TilingSprite.prototype.constructor = PIXI.TilingSprite;\n\nPIXI.TilingSprite.prototype.setTexture = function(texture)\n{\n    if (this.texture !== texture)\n    {\n        this.texture = texture;\n        this.refreshTexture = true;\n        this.cachedTint = 0xFFFFFF;\n    }\n\n};\n\n/**\n* Renders the object using the WebGL renderer\n*\n* @method _renderWebGL\n* @param renderSession {RenderSession} \n* @private\n*/\nPIXI.TilingSprite.prototype._renderWebGL = function(renderSession)\n{\n    if (!this.visible || !this.renderable || this.alpha === 0)\n    {\n        return;\n    }\n\n    if (this._mask)\n    {\n        renderSession.spriteBatch.stop();\n        renderSession.maskManager.pushMask(this.mask, renderSession);\n        renderSession.spriteBatch.start();\n    }\n\n    if (this._filters)\n    {\n        renderSession.spriteBatch.flush();\n        renderSession.filterManager.pushFilter(this._filterBlock);\n    }\n\n    if (this.refreshTexture)\n    {\n        this.generateTilingTexture(true, renderSession);\n\n        if (this.tilingTexture)\n        {\n            if (this.tilingTexture.needsUpdate)\n            {\n                renderSession.renderer.updateTexture(this.tilingTexture.baseTexture);\n                this.tilingTexture.needsUpdate = false;\n            }\n        }\n        else\n        {\n            return;\n        }\n    }\n    \n    renderSession.spriteBatch.renderTilingSprite(this);\n\n    for (var i = 0; i < this.children.length; i++)\n    {\n        this.children[i]._renderWebGL(renderSession);\n    }\n\n    renderSession.spriteBatch.stop();\n\n    if (this._filters)\n    {\n        renderSession.filterManager.popFilter();\n    }\n\n    if (this._mask)\n    {\n        renderSession.maskManager.popMask(this._mask, renderSession);\n    }\n    \n    renderSession.spriteBatch.start();\n\n};\n\n/**\n* Renders the object using the Canvas renderer\n*\n* @method _renderCanvas\n* @param renderSession {RenderSession} \n* @private\n*/\nPIXI.TilingSprite.prototype._renderCanvas = function(renderSession)\n{\n    if (!this.visible || !this.renderable || this.alpha === 0)\n    {\n        return;\n    }\n    \n    var context = renderSession.context;\n\n    if (this._mask)\n    {\n        renderSession.maskManager.pushMask(this._mask, renderSession);\n    }\n\n    context.globalAlpha = this.worldAlpha;\n    \n    var wt = this.worldTransform;\n    var resolution = renderSession.resolution;\n    var tx = (wt.tx * resolution) + renderSession.shakeX;\n    var ty = (wt.ty * resolution) + renderSession.shakeY;\n\n    context.setTransform(wt.a * resolution, wt.b * resolution, wt.c * resolution, wt.d * resolution, tx, ty);\n\n    if (this.refreshTexture)\n    {\n        this.generateTilingTexture(false, renderSession);\n    \n        if (this.tilingTexture)\n        {\n            this.tilePattern = context.createPattern(this.tilingTexture.baseTexture.source, 'repeat');\n        }\n        else\n        {\n            return;\n        }\n    }\n\n    var sessionBlendMode = renderSession.currentBlendMode;\n\n    //  Check blend mode\n    if (this.blendMode !== renderSession.currentBlendMode)\n    {\n        renderSession.currentBlendMode = this.blendMode;\n        context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];\n    }\n\n    var tilePosition = this.tilePosition;\n    var tileScale = this.tileScale;\n\n    tilePosition.x %= this.tilingTexture.baseTexture.width;\n    tilePosition.y %= this.tilingTexture.baseTexture.height;\n\n    //  Translate\n    context.scale(tileScale.x, tileScale.y);\n    context.translate(tilePosition.x + (this.anchor.x * -this._width), tilePosition.y + (this.anchor.y * -this._height));\n\n    context.fillStyle = this.tilePattern;\n\n    var tx = -tilePosition.x;\n    var ty = -tilePosition.y;\n    var tw = this._width / tileScale.x;\n    var th = this._height / tileScale.y;\n\n    //  Allow for pixel rounding\n    if (renderSession.roundPixels)\n    {\n        tx |= 0;\n        ty |= 0;\n        tw |= 0;\n        th |= 0;\n    }\n\n    context.fillRect(tx, ty, tw, th);\n\n    //  Translate back again\n    context.scale(1 / tileScale.x, 1 / tileScale.y);\n    context.translate(-tilePosition.x + (this.anchor.x * this._width), -tilePosition.y + (this.anchor.y * this._height));\n\n    if (this._mask)\n    {\n        renderSession.maskManager.popMask(renderSession);\n    }\n\n    for (var i = 0; i < this.children.length; i++)\n    {\n        this.children[i]._renderCanvas(renderSession);\n    }\n\n    //  Reset blend mode\n    if (sessionBlendMode !== this.blendMode)\n    {\n        renderSession.currentBlendMode = sessionBlendMode;\n        context.globalCompositeOperation = PIXI.blendModesCanvas[sessionBlendMode];\n    }\n\n};\n\n/**\n * When the texture is updated, this event will fire to update the scale and frame\n *\n * @method onTextureUpdate\n * @param event\n * @private\n */\nPIXI.TilingSprite.prototype.onTextureUpdate = function()\n{\n   // overriding the sprite version of this!\n};\n\n/**\n* \n* @method generateTilingTexture\n* \n* @param forcePowerOfTwo {Boolean} Whether we want to force the texture to be a power of two\n* @param renderSession {RenderSession} \n*/\nPIXI.TilingSprite.prototype.generateTilingTexture = function(forcePowerOfTwo, renderSession)\n{\n    if (!this.texture.baseTexture.hasLoaded)\n    {\n        return;\n    }\n\n    var texture = this.texture;\n    var frame = texture.frame;\n\n    var targetWidth = this._frame.sourceSizeW || this._frame.width;\n    var targetHeight = this._frame.sourceSizeH || this._frame.height;\n\n    var dx = 0;\n    var dy = 0;\n\n    if (this._frame.trimmed)\n    {\n        dx = this._frame.spriteSourceSizeX;\n        dy = this._frame.spriteSourceSizeY;\n    }\n\n    if (forcePowerOfTwo)\n    {\n        targetWidth = PIXI.getNextPowerOfTwo(targetWidth);\n        targetHeight = PIXI.getNextPowerOfTwo(targetHeight);\n    }\n\n    if (this.canvasBuffer)\n    {\n        this.canvasBuffer.resize(targetWidth, targetHeight);\n        this.tilingTexture.baseTexture.width = targetWidth;\n        this.tilingTexture.baseTexture.height = targetHeight;\n        this.tilingTexture.needsUpdate = true;\n    }\n    else\n    {\n        this.canvasBuffer = new PIXI.CanvasBuffer(targetWidth, targetHeight);\n        this.tilingTexture = PIXI.Texture.fromCanvas(this.canvasBuffer.canvas);\n        this.tilingTexture.isTiling = true;\n        this.tilingTexture.needsUpdate = true;\n    }\n\n    if (this.textureDebug)\n    {\n        this.canvasBuffer.context.strokeStyle = '#00ff00';\n        this.canvasBuffer.context.strokeRect(0, 0, targetWidth, targetHeight);\n    }\n\n    //  If a sprite sheet we need this:\n    var w = texture.crop.width;\n    var h = texture.crop.height;\n\n    if (w !== targetWidth || h !== targetHeight)\n    {\n        w = targetWidth;\n        h = targetHeight;\n    }\n\n    this.canvasBuffer.context.drawImage(texture.baseTexture.source,\n                           texture.crop.x,\n                           texture.crop.y,\n                           texture.crop.width,\n                           texture.crop.height,\n                           dx,\n                           dy,\n                           w,\n                           h);\n\n    this.tileScaleOffset.x = frame.width / targetWidth;\n    this.tileScaleOffset.y = frame.height / targetHeight;\n\n    this.refreshTexture = false;\n\n    this.tilingTexture.baseTexture._powerOf2 = true;\n\n};\n\n/**\n* Returns the framing rectangle of the sprite as a PIXI.Rectangle object\n*\n* @method getBounds\n* @return {Rectangle} the framing rectangle\n*/\nPIXI.TilingSprite.prototype.getBounds = function()\n{\n    var width = this._width;\n    var height = this._height;\n\n    var w0 = width * (1-this.anchor.x);\n    var w1 = width * -this.anchor.x;\n\n    var h0 = height * (1-this.anchor.y);\n    var h1 = height * -this.anchor.y;\n\n    var worldTransform = this.worldTransform;\n\n    var a = worldTransform.a;\n    var b = worldTransform.b;\n    var c = worldTransform.c;\n    var d = worldTransform.d;\n    var tx = worldTransform.tx;\n    var ty = worldTransform.ty;\n    \n    var x1 = a * w1 + c * h1 + tx;\n    var y1 = d * h1 + b * w1 + ty;\n\n    var x2 = a * w0 + c * h1 + tx;\n    var y2 = d * h1 + b * w0 + ty;\n\n    var x3 = a * w0 + c * h0 + tx;\n    var y3 = d * h0 + b * w0 + ty;\n\n    var x4 =  a * w1 + c * h0 + tx;\n    var y4 =  d * h0 + b * w1 + ty;\n\n    var maxX = -Infinity;\n    var maxY = -Infinity;\n\n    var minX = Infinity;\n    var minY = Infinity;\n\n    minX = x1 < minX ? x1 : minX;\n    minX = x2 < minX ? x2 : minX;\n    minX = x3 < minX ? x3 : minX;\n    minX = x4 < minX ? x4 : minX;\n\n    minY = y1 < minY ? y1 : minY;\n    minY = y2 < minY ? y2 : minY;\n    minY = y3 < minY ? y3 : minY;\n    minY = y4 < minY ? y4 : minY;\n\n    maxX = x1 > maxX ? x1 : maxX;\n    maxX = x2 > maxX ? x2 : maxX;\n    maxX = x3 > maxX ? x3 : maxX;\n    maxX = x4 > maxX ? x4 : maxX;\n\n    maxY = y1 > maxY ? y1 : maxY;\n    maxY = y2 > maxY ? y2 : maxY;\n    maxY = y3 > maxY ? y3 : maxY;\n    maxY = y4 > maxY ? y4 : maxY;\n\n    var bounds = this._bounds;\n\n    bounds.x = minX;\n    bounds.width = maxX - minX;\n\n    bounds.y = minY;\n    bounds.height = maxY - minY;\n\n    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate\n    this._currentBounds = bounds;\n\n    return bounds;\n};\n\nPIXI.TilingSprite.prototype.destroy = function () {\n\n    PIXI.Sprite.prototype.destroy.call(this);\n\n    if (this.canvasBuffer)\n    {\n        this.canvasBuffer.destroy();\n        this.canvasBuffer = null;\n    }\n\n    this.tileScale = null;\n    this.tileScaleOffset = null;\n    this.tilePosition = null;\n\n    if (this.tilingTexture)\n    {\n        this.tilingTexture.destroy(true);\n        this.tilingTexture = null;\n    }\n\n};\n\n/**\n * The width of the sprite, setting this will actually modify the scale to achieve the value set\n *\n * @property width\n * @type Number\n */\nObject.defineProperty(PIXI.TilingSprite.prototype, 'width', {\n\n    get: function() {\n        return this._width;\n    },\n\n    set: function(value) {\n        this._width = value;\n    }\n\n});\n\n/**\n * The height of the TilingSprite, setting this will actually modify the scale to achieve the value set\n *\n * @property height\n * @type Number\n */\nObject.defineProperty(PIXI.TilingSprite.prototype, 'height', {\n\n    get: function() {\n        return  this._height;\n    },\n\n    set: function(value) {\n        this._height = value;\n    }\n\n});\n\n/**\n * @author Mat Groves http://matgroves.com/ @Doormat23\n */\n\n    if (typeof exports !== 'undefined') {\n        if (typeof module !== 'undefined' && module.exports) {\n            exports = module.exports = PIXI;\n        }\n        exports.PIXI = PIXI;\n    } else if (typeof define !== 'undefined' && define.amd) {\n        define('PIXI', (function() { return root.PIXI = PIXI; })() );\n    } else {\n        root.PIXI = PIXI;\n    }\n\n    return PIXI;\n}).call(this);"

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0)(__webpack_require__(8))

/***/ }),
/* 8 */
/***/ (function(module, exports) {


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0)(__webpack_require__(10))

/***/ }),
/* 10 */
/***/ (function(module, exports) {


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map