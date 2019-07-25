(function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.6.9' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _library = false;

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode: _library ? 'pure' : 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _wks = createCommonjsModule(function (module) {
	var store = _shared('wks');

	var Symbol = _global.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var document = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document) && _isObject(document.createElement);
	var _domCreate = function (it) {
	  return is ? document.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
	var _addToUnscopables = function (key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	var _iterators = {};

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var _functionToString = _shared('native-function-to-string', Function.toString);

	var _redefine = createCommonjsModule(function (module) {
	var SRC = _uid('src');

	var TO_STRING = 'toString';
	var TPL = ('' + _functionToString).split(TO_STRING);

	_core.inspectSource = function (it) {
	  return _functionToString.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === _global) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    _hide(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    _hide(O, key, val);
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || _functionToString.call(this);
	});
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // extend global
	    if (target) _redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) _hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	_global.core = _core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.1.15 ToLength

	var min = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var shared = _shared('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (_has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject(O);
	  var keys = _objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var document$1 = _global.document;
	var _html = document$1 && document$1.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



	var IE_PROTO$1 = _sharedKey('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$1 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = _enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var def = _objectDp.f;

	var TAG = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


	var IE_PROTO$2 = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    _hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var ITERATOR$1 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;

	var DOMIterables = {
	  CSSRuleList: true, // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true, // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true, // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
	  var NAME = collections[i];
	  var explicit = DOMIterables[NAME];
	  var Collection = _global[NAME];
	  var proto = Collection && Collection.prototype;
	  var key;
	  if (proto) {
	    if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
	    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
	    _iterators[NAME] = ArrayValues;
	    if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
	  }
	}

	// getting tag from 19.1.3.6 Object.prototype.toString()

	var TAG$1 = _wks('toStringTag');
	// ES3 wrong here
	var ARG = _cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
	    // builtinTag case
	    : ARG ? _cof(O)
	    // ES3 arguments fallback
	    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	// 19.1.3.6 Object.prototype.toString()

	var test = {};
	test[_wks('toStringTag')] = 'z';
	if (test + '' != '[object z]') {
	  _redefine(Object.prototype, 'toString', function toString() {
	    return '[object ' + _classof(this) + ']';
	  }, true);
	}

	// https://github.com/tc39/Array.prototype.includes

	var $includes = _arrayIncludes(true);

	_export(_export.P, 'Array', {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	_addToUnscopables('includes');

	// 7.2.8 IsRegExp(argument)


	var MATCH = _wks('match');
	var _isRegexp = function (it) {
	  var isRegExp;
	  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
	};

	// helper for String#{startsWith, endsWith, includes}



	var _stringContext = function (that, searchString, NAME) {
	  if (_isRegexp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
	  return String(_defined(that));
	};

	var MATCH$1 = _wks('match');
	var _failsIsRegexp = function (KEY) {
	  var re = /./;
	  try {
	    '/./'[KEY](re);
	  } catch (e) {
	    try {
	      re[MATCH$1] = false;
	      return !'/./'[KEY](re);
	    } catch (f) { /* empty */ }
	  } return true;
	};

	var INCLUDES = 'includes';

	_export(_export.P + _export.F * _failsIsRegexp(INCLUDES), 'String', {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~_stringContext(this, searchString, INCLUDES)
	      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES = _wks('species');
	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
	};

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined(that));
	    var i = _toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var at = _stringAt(true);

	 // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var _advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? at(S, index).length : 1);
	};

	var builtinExec = RegExp.prototype.exec;

	 // `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var _regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw new TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }
	  if (_classof(R) !== 'RegExp') {
	    throw new TypeError('RegExp#exec called on incompatible receiver');
	  }
	  return builtinExec.call(R, S);
	};

	// 21.2.5.3 get RegExp.prototype.flags

	var _flags = function () {
	  var that = _anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var LAST_INDEX = 'lastIndex';

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/,
	      re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
	})();

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

	    match = nativeExec.call(re, str);

	    if (UPDATES_LAST_INDEX_WRONG && match) {
	      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      // eslint-disable-next-line no-loop-func
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var _regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: _regexpExec !== /./.exec
	}, {
	  exec: _regexpExec
	});

	var SPECIES$1 = _wks('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
	  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
	})();

	var _fixReWks = function (KEY, length, exec) {
	  var SYMBOL = _wks(KEY);

	  var DELEGATES_TO_SYMBOL = !_fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;
	    re.exec = function () { execCalled = true; return null; };
	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$1] = function () { return re; };
	    }
	    re[SYMBOL]('');
	    return !execCalled;
	  }) : undefined;

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var fns = exec(
	      _defined,
	      SYMBOL,
	      ''[KEY],
	      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
	        if (regexp.exec === _regexpExec) {
	          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	            // The native String method already delegates to @@method (this
	            // polyfilled function), leasing to infinite recursion.
	            // We avoid it by directly calling the native @@method method.
	            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	          }
	          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	        }
	        return { done: false };
	      }
	    );
	    var strfn = fns[0];
	    var rxfn = fns[1];

	    _redefine(String.prototype, KEY, strfn);
	    _hide(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return rxfn.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return rxfn.call(string, this); }
	    );
	  }
	};

	var $min = Math.min;
	var $push = [].push;
	var $SPLIT = 'split';
	var LENGTH = 'length';
	var LAST_INDEX$1 = 'lastIndex';
	var MAX_UINT32 = 0xffffffff;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !_fails(function () { });

	// @@split logic
	_fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
	    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
	    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
	    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
	    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
	    ''[$SPLIT](/.?/)[LENGTH]
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return [];
	      // If `separator` is not a regex, use native split
	      if (!_isRegexp(separator)) return $split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = _regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy[LAST_INDEX$1];
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if (output[LENGTH] >= splitLimit) break;
	        }
	        if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string[LENGTH]) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    };
	  // Chakra, V8
	  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
	    };
	  } else {
	    internalSplit = $split;
	  }

	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = defined(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
	      if (res.done) return res.value;

	      var rx = _anObject(regexp);
	      var S = String(this);
	      var C = _speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = _advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	});

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg) {
	  return _cof(arg) == 'Array';
	};

	var SPECIES$2 = _wks('species');

	var _arraySpeciesConstructor = function (original) {
	  var C;
	  if (_isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
	    if (_isObject(C)) {
	      C = C[SPECIES$2];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


	var _arraySpeciesCreate = function (original, length) {
	  return new (_arraySpeciesConstructor(original))(length);
	};

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex





	var _arrayMethods = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = $create || _arraySpeciesCreate;
	  return function ($this, callbackfn, that) {
	    var O = _toObject($this);
	    var self = _iobject(O);
	    var f = _ctx(callbackfn, that, 3);
	    var length = _toLength(self.length);
	    var index = 0;
	    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var val, res;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      val = self[index];
	      res = f(val, index, O);
	      if (TYPE) {
	        if (IS_MAP) result[index] = res;   // map
	        else if (res) switch (TYPE) {
	          case 3: return true;             // some
	          case 5: return val;              // find
	          case 6: return index;            // findIndex
	          case 2: result.push(val);        // filter
	        } else if (IS_EVERY) return false; // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

	var _strictMethod = function (method, arg) {
	  return !!method && _fails(function () {
	    // eslint-disable-next-line no-useless-call
	    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
	  });
	};

	var $filter = _arrayMethods(2);

	_export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});

	var max$1 = Math.max;
	var min$2 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	_fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = defined(this);
	      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return fn !== undefined
	        ? fn.call(searchValue, O, replaceValue)
	        : $replace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      var res = maybeCallNative($replace, regexp, this, replaceValue);
	      if (res.done) return res.value;

	      var rx = _anObject(regexp);
	      var S = String(this);
	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);
	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = _regexpExecAbstract(rx, S);
	        if (result === null) break;
	        results.push(result);
	        if (!global) break;
	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
	      }
	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];
	        var matched = String(result[0]);
	        var position = max$1(min$2(_toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	    // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = _toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return $replace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	var $sort = [].sort;
	var test$1 = [1, 2, 3];

	_export(_export.P + _export.F * (_fails(function () {
	  // IE8-
	  test$1.sort(undefined);
	}) || !_fails(function () {
	  // V8 bug
	  test$1.sort(null);
	  // Old WebKit
	}) || !_strictMethod($sort)), 'Array', {
	  // 22.1.3.25 Array.prototype.sort(comparefn)
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? $sort.call(_toObject(this))
	      : $sort.call(_toObject(this), _aFunction(comparefn));
	  }
	});

	var $map = _arrayMethods(1);

	_export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});

	var dP$1 = _objectDp.f;
	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME$1 = 'name';

	// 19.2.4.2 name
	NAME$1 in FProto || _descriptors && dP$1(FProto, NAME$1, {
	  configurable: true,
	  get: function () {
	    try {
	      return ('' + this).match(nameRE)[1];
	    } catch (e) {
	      return '';
	    }
	  }
	});

	var $forEach = _arrayMethods(0);
	var STRICT = _strictMethod([].forEach, true);

	_export(_export.P + _export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */) {
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});

	var quot = /"/g;
	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	var createHTML = function (string, tag, attribute, value) {
	  var S = String(_defined(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};
	var _stringHtml = function (NAME, exec) {
	  var O = {};
	  O[NAME] = exec(createHTML);
	  _export(_export.P + _export.F * _fails(function () {
	    var test = ''[NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  }), 'String', O);
	};

	// B.2.3.10 String.prototype.link(url)
	_stringHtml('link', function (createHTML) {
	  return function link(url) {
	    return createHTML(this, 'a', 'href', url);
	  };
	});

	var settingsSankey = {
	  margin: {
	    top: 5,
	    right: 0,
	    left: 2,
	    bottom: 10
	  },
	  aspectRatio: 16 / 30,
	  // ......16 / 9,  // width/height
	  width: 480,
	  // 480,
	  viewBox: {
	    x: 0,
	    y: 0
	  }
	};

	var settingsSA = {
	  margin: {
	    top: 0,
	    right: 20,
	    left: 25,
	    bottom: 47
	  },
	  aspectRatio: 0.91,
	  // 16 / 9,  // width/height
	  width: 220,
	  showUnits: true,
	  x: {
	    ticks: 8
	  },
	  y: {
	    ticks: 3
	  },
	  viewBox: {
	    x: -25,
	    y: -22
	  }
	};

	var settingsAF = {
	  margin: {
	    top: 0,
	    right: 60,
	    left: 50,
	    bottom: 25
	  },
	  aspectRatio: 1.6,
	  // 16 / 9,  // width/height
	  width: 220,
	  showUnits: false,
	  x: {
	    ticks: 8
	  },
	  y: {
	    ticks: 3
	  },
	  viewBox: {
	    x: 0,
	    y: -2
	  }
	};

	var settingsAS = {
	  margin: {
	    top: 0,
	    right: 20,
	    left: 25,
	    bottom: 19
	  },
	  aspectRatio: 0.88,
	  // 16 / 9,  // width/height
	  width: 220,
	  showUnits: false,
	  x: {
	    ticks: 8
	  },
	  y: {
	    ticks: 3
	  },
	  viewBox: {
	    x: -25,
	    y: 0
	  }
	};

	var settingsNA = {
	  margin: {
	    top: 0,
	    right: 60,
	    left: 50,
	    bottom: 40
	  },
	  aspectRatio: 1.1,
	  // 16 / 9,  // width/height
	  width: 220,
	  showUnits: false,
	  x: {
	    ticks: 8
	  },
	  y: {
	    ticks: 3
	  },
	  viewBox: {
	    x: 0,
	    y: -15
	  }
	};

	var settingsOC = {
	  margin: {
	    top: 0,
	    right: 70,
	    left: 50,
	    bottom: 22
	  },
	  aspectRatio: 4.5,
	  // 16 / 9,  // width/height
	  width: 220,
	  showUnits: false,
	  x: {
	    ticks: 8
	  },
	  y: {
	    ticks: 1
	  },
	  viewBox: {
	    x: 0,
	    y: 0
	  }
	};

	var settingsEU = {
	  margin: {
	    top: 0,
	    right: 0,
	    left: 50,
	    bottom: 40
	  },
	  aspectRatio: 2.3,
	  // width/height
	  width: 220,
	  showUnits: false,
	  x: {
	    ticks: 8
	  },
	  y: {
	    ticks: 2
	  },
	  viewBox: {
	    x: 0,
	    y: 0
	  }
	};

	// Define number format (2 decimal places) from utils.js

	var globalSettings = {
	  _selfFormatter: i18n.getNumberFormatter(2),
	  formatNum: function formatNum() {
	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return this._selfFormatter.format(args);
	  }
	};

	var init = function init() {
	  var urlRoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	  var sankeydata1 = {};
	  var sankeydata2 = {};
	  var stackedSA = {};
	  var stackedAfrica = {};
	  var stackedAsia = {};
	  var stackedNAmer = {};
	  var stackedOceania = {};
	  var stackedEurope = {}; // -----------------------------------------------------------------------------
	  // SVGs
	  // Sankeys

	  var chartSankey1 = d3.select(".data.sankey1").append("svg").attr("id", "chart1");
	  var chartSankey2 = d3.select(".data.sankey2").append("svg").attr("id", "chart2"); // Stacked bar charts

	  var chartSA = d3.select(".data.SAdata").append("svg").attr("id", "stackedbar_SA");
	  var chartAF = d3.select(".data.AFdata").append("svg").attr("id", "stackedbar_Africa");
	  var chartAS = d3.select(".data.ASdata").append("svg").attr("id", "stackedbar_Asia");
	  var chartNA = d3.select(".data.NAdata").append("svg").attr("id", "stackedbar_NAmer");
	  var chartOC = d3.select(".data.OCdata").append("svg").attr("id", "stackedbar_Oceania");
	  var chartEU = d3.select(".data.EUdata").append("svg").attr("id", "stackedbar_Europe"); // ----------------------------------------------------------------
	  // Help button

	  d3.select("#helpButton").on("click", function () {
	    createHelp();
	  });

	  function createHelp() {
	    var parameters = {};
	    parameters.parentContainerId = "#thisContainer";
	    parameters.helpArray = [{
	      linkType: "dotOnly",
	      divToHelpId: "helpBU",
	      text: i18next.t("helpBU", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 120,
	      marginLeft: -210,
	      textLengthByLine: 100,
	      myTitle: i18next.t("helpTitle", {
	        ns: "helpOverlay"
	      }),
	      myfooter: i18next.t("helpFooter", {
	        ns: "helpOverlay"
	      })
	    }, {
	      linkType: "dotOnly",
	      divToHelpId: "helpInlandwater",
	      text: i18next.t("helpInlandwater", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 210,
	      marginLeft: -210,
	      textLengthByLine: 70
	    }, {
	      linkType: "left",
	      divToHelpId: "helpHighLat",
	      text: i18next.t("helpHighLat", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 290,
	      marginLeft: 90,
	      textLengthByLine: 40
	    }, {
	      linkType: "dotOnly",
	      divToHelpId: "helpLowLat",
	      text: i18next.t("helpLowLat", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 770,
	      marginLeft: -320,
	      textLengthByLine: 40
	    }, {
	      linkType: "dotOnly",
	      divToHelpId: "helpCountry",
	      text: i18next.t("helpCountry", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 200,
	      marginLeft: 610,
	      textLengthByLine: 25
	    }, {
	      linkType: "dotOnly",
	      divToHelpId: "helpRivers",
	      text: i18next.t("helpRivers", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 370,
	      marginLeft: 147,
	      textLengthByLine: 50
	    }, {
	      linkType: "dotOnly",
	      divToHelpId: "helpAsia",
	      text: i18next.t("helpAsia", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 570,
	      marginLeft: 347,
	      textLengthByLine: 50
	    }, {
	      linkType: "dotOnly",
	      divToHelpId: "helpLakes",
	      text: i18next.t("helpRivers", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 715,
	      marginLeft: 147,
	      textLengthByLine: 50
	    }, {
	      linkType: "dotOnly",
	      divToHelpId: "helpEstuaries",
	      text: i18next.t("helpEstuaries", {
	        ns: "helpOverlay"
	      }),
	      marginTop: 910,
	      marginLeft: 147,
	      textLengthByLine: 60
	    }];
	    new window.Help(parameters);
	  } // -----------------------------------------------------------------------------
	  // FNS
	  // page texts


	  function pageText() {
	    d3.select("#titletag").html(i18next.t("titletag", {
	      ns: "pageText"
	    }));
	    d3.select("#pageTitle").html(i18next.t("title", {
	      ns: "pageText"
	    }));
	    d3.select("#infotext").html(i18next.t("infotext", {
	      ns: "pageText"
	    }));
	    d3.select("#subtitle").html(i18next.t("subtitle", {
	      ns: "pageText"
	    }));
	  } // display areaChart


	  function showSankey(chartNum, svg, settings, graph) {
	    var outerWidth = settings.width;
	    var outerHeight = Math.ceil(outerWidth / settings.aspectRatio);
	    var innerHeight = outerHeight - settings.margin.top - settings.margin.bottom;
	    var innerWidth = outerWidth - settings.margin.left - settings.margin.right;
	    var chartInner = svg.select("g.margin-offset");
	    var dataLayer = chartInner.select(".data");
	    svg.attr("viewBox", "".concat(settings.viewBox.x, " ").concat(settings.viewBox.y, " ").concat(outerWidth, " ").concat(outerHeight)).attr("preserveAspectRatio", "xMidYMid meet").attr("role", "img");

	    if (chartInner.empty()) {
	      chartInner = svg.append("g").attr("class", "margin-offset").attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");
	    }

	    d3.stcExt.addIEShim(svg, outerHeight, outerWidth); // set the sankey diagram properties

	    var sankey = d3.sankey().nodeWidth(30).nodePadding(20).size([innerWidth, innerHeight]);
	    var path = sankey.link();
	    var yshiftTooltip = 90; // amount to raise tooltip in y-dirn

	    make(graph);

	    function make(graph) {
	      var nodeMap = {};
	      graph.nodes.forEach(function (x) {
	        nodeMap[x.name] = x;
	      });
	      graph.links = graph.links.map(function (x) {
	        return {
	          source: nodeMap[x.source],
	          target: nodeMap[x.target],
	          value: x.value
	        };
	      });
	      graph.nodes.sort(function (a, b) {
	        return d3.descending(a.value, b.value);
	      });
	      sankey.nodes(graph.nodes).links(graph.links).layout(32); // tooltip div

	      var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

	      if (dataLayer.empty()) {
	        dataLayer = chartInner.append("g").attr("class", "data");
	      }

	      var link = dataLayer.append("g").selectAll(".link").data(graph.links).enter().append("path").attr("class", function (d) {
	        var fromName = "from".concat(d.source.name.replace(/\s+/g, "")).concat(chartNum);
	        var toName = "to".concat(d.target.name.replace(/\s+/g, "")).concat(chartNum);
	        return "link ".concat(fromName, " ").concat(toName);
	      }).attr("d", path).attr("id", function (d, i) {
	        d.id = i;
	        return "chart".concat(chartNum, "_link-").concat(i);
	      }).style("stroke-width", function (d) {
	        return Math.max(1, d.dy);
	      }).sort(function (a, b) {
	        return b.dy - a.dy;
	      }); // add link tooltip

	      link.on("mousemove", function (d) {
	        // Reduce opacity of all but link that is moused over and connected rects
	        d3.selectAll(".link:not(#".concat(this.id, ")")).style("opacity", 0.5); // Remove inactive class to selected links and make them active

	        highlightFromLink(d, this); // Tooltip

	        var sourceName = i18next.t(d.source.name, {
	          ns: "labels"
	        });
	        div.transition().style("opacity", .9);
	        div.html("<b>".concat(sourceName, "</b><br><br>\n            <table>\n                <tr>\n                  <td>").concat(d.target.name, " flux: </td>\n                  <td><b>").concat(globalSettings.formatNum(d.value), "</td>\n                  <td> ").concat(i18next.t("units", {
	          ns: "constants"
	        }), " </td>\n              </tr>\n            </table>")).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - yshiftTooltip + "px");
	      }).on("mouseout", function () {
	        // Restore opacity
	        d3.selectAll(".link:not(#chart".concat(chartNum, "_").concat(this.id, ")")).style("opacity", 1); // Remove active and inactive classes added on mouseover

	        d3.selectAll("rect").classed("rectInactive", false);
	        div.transition().style("opacity", 0);
	      }); // add in the nodes

	      var node = dataLayer.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", function () {
	        return "node regions";
	      }).attr("transform", function (d) {
	        return "translate(".concat(d.x, ",").concat(d.y, ")");
	      }).style("cursor", function () {
	        return "crosshair";
	      }); // apend rects to the nodes

	      node.append("rect").attr("height", function (d) {
	        return d.dy;
	      }).attr("width", sankey.nodeWidth()).attr("class", function (d) {
	        return d.name.replace(/\s/g, "");
	      }); // apend text to nodes

	      node.append("text").attr("x", -6).attr("y", function (d) {
	        return d.dy / 2;
	      }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function (d) {
	        return i18next.t(d.name, {
	          ns: "labels"
	        });
	      }).filter(function (d) {
	        return d.x < innerWidth / 2;
	      }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start"); // add node tooltip

	      node.on("mousemove", function (d) {
	        highlightFromNode(d); // tooltip

	        var sourceName = i18next.t(d.name, {
	          ns: "labels"
	        });
	        div.transition().style("opacity", .9);
	        div.html("<b>".concat(sourceName, "</b><br><br>\n            <table>\n              <tr>\n                <td> Total flux: </td>\n                <td><b>").concat(globalSettings.formatNum(d.value), "</td>\n                <td> ").concat(i18next.t("units", {
	          ns: "constants"
	        }), " </td>\n              </tr>\n            </table>")).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - yshiftTooltip + "px");
	      }).on("mouseout", function () {
	        // Remove active and inactive classes added on mouseover
	        d3.selectAll(".inactive").classed("inactive", false);
	        d3.selectAll(".active").classed("active", false);
	        d3.selectAll("rect").classed("rectInactive", false);
	        div.transition().style("opacity", 0);
	      }); // selective rect highlight

	      function highlightFromNode(d) {
	        // first deactivate all rects and links
	        d3.select("#chart" + chartNum).selectAll("rect:not(.".concat(d.name.replace(/\s+/g, ""), ")")).classed("rectInactive", true);
	        d3.selectAll(".link").classed("inactive", true); // selectively turn on child rects

	        var childName;
	        var thisLink;
	        var childArray;
	        var thisParent;

	        if (d.sourceLinks.length > 0) {
	          childArray = d.sourceLinks;
	          thisParent = "target"; // store connecting links

	          thisLink = d3.selectAll(".from".concat(d.name.replace(/\s+/g, "")).concat(chartNum));
	        } else if (d.targetLinks.length > 0) {
	          childArray = d.targetLinks;
	          thisParent = "source"; // store connecting links

	          thisLink = d3.selectAll(".to".concat(d.name.replace(/\s+/g, "")).concat(chartNum));
	        } // highlight connecting links


	        thisLink.classed("inactive", !thisLink.classed("inactive"));
	        thisLink.classed("active", true); // highlight target child rects

	        childArray.map(function (n) {
	          childName = n[thisParent].name.replace(/\s+/g, "");
	          d3.select("#chart".concat(chartNum)).select("rect.".concat(childName)).classed("rectInactive", false);
	        });
	      }

	      function highlightFromLink(d, thisLink) {
	        // turn off all rects
	        d3.selectAll("rect").classed("rectInactive", true); // name of source rect

	        var thisName = d.source.sourceLinks.length > 0 ? d.source.name : d.target.name; // turn on only source and its target rect

	        var targetRect = d3.select("#" + thisLink.id).attr("class").split(" ").filter(function (s) {
	          return s.includes("to");
	        })[0].split("to")[1].slice(0, -1);
	        d3.select("#chart".concat(chartNum)).select("rect.".concat(thisName)).classed("rectInactive", false);
	        d3.select("#chart".concat(chartNum)).select("rect.".concat(targetRect)).classed("rectInactive", false);
	      }
	    } // end make()

	  } // end makeSankey()
	  // ----------------------------------------------------------------------------
	  // STACKED BARS


	  function showStackedBar(svg, settings, data) {
	    // tooltip div
	    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
	    var yshiftTooltip = 90; // amount to raise tooltip in y-dirn

	    var outerWidth = settings.width;
	    var outerHeight = Math.ceil(outerWidth / settings.aspectRatio);
	    var innerHeight = outerHeight - settings.margin.top - settings.margin.bottom;
	    var innerWidth = outerWidth - settings.margin.left - settings.margin.right;
	    var chartInner = svg.select("g.margin-offset");
	    svg.attr("viewBox", "".concat(settings.viewBox.x, " ").concat(settings.viewBox.y, " ").concat(outerWidth, " ").concat(outerHeight)).attr("preserveAspectRatio", "xMidYMid meet").attr("role", "img");
	    var xAxisObj = chartInner.select(".x.axis");
	    var yAxisObj = chartInner.select(".y.axis");

	    if (chartInner.empty()) {
	      chartInner = svg.append("g").attr("class", "margin-offset").attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");
	    }

	    var x = d3.scaleBand().rangeRound([5, innerWidth], settings.barWidth ? settings.barWidth : 0.1).paddingInner(0.05);
	    var y = d3.scaleLinear().range([innerHeight, 0]);
	    var color = d3.scaleOrdinal().range(["#A9C1D9", "#607890", "#ABBE71"]);
	    var xAxis = d3.axisBottom(x);
	    var yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s")).ticks(settings.y.ticks);
	    color.domain(d3.keys(data[0]).filter(function (key) {
	      return key !== "country";
	    }));
	    data.forEach(function (d) {
	      var country = d.country;
	      var y0 = 0;
	      d.flux = color.domain().map(function (name) {
	        return {
	          country: country,
	          loac: name,
	          y0: y0,
	          y1: y0 += +d[name]
	        };
	      });
	      d.total = d.flux[d.flux.length - 1].y1;
	    });
	    data.sort(function (a, b) {
	      return b.total - a.total;
	    });
	    x.domain(data.map(function (d) {
	      return d.country;
	    }));
	    y.domain([0, d3.max(data, function (d) {
	      return d.total;
	    })]);
	    xAxisObj = chartInner.select(".x.axis");

	    if (xAxisObj.empty()) {
	      xAxisObj = chartInner.append("g").attr("class", "x axis").attr("aria-hidden", "true").attr("transform", "translate(0, ".concat(innerHeight, ")"));
	    }

	    xAxisObj.call(xAxis);
	    yAxisObj = chartInner.select(".y.axis");

	    if (yAxisObj.empty()) {
	      yAxisObj = chartInner.append("g").attr("class", "y axis").attr("aria-hidden", "true"); // display y-axis units only for first chart

	      if (settings.showUnits) {
	        yAxisObj.append("text").attr("class", "chart-label").attr("x", -50).attr("y", 0).attr("dy", "-0.5em").attr("text-anchor", "start").html("".concat(i18next.t("units", {
	          ns: "constants"
	        }))).append("tspan").text("-1").style("font-size", "9px").attr("y", -11).attr("dx", ".01em").attr("dy", "-.2em");
	      }
	    }

	    yAxisObj.call(yAxis);
	    var country = svg.selectAll(".country").data(data).enter().append("g").attr("class", "g");
	    country.selectAll("rect").data(function (d) {
	      return d.flux;
	    }).enter().append("rect").attr("class", function (d) {
	      return d.loac;
	    }).attr("x", function (d) {
	      return x(d.country) + settings.margin.left; // NB: NEED TO ADD THE LEFT MARGIN
	      // return x(d.country);
	    }).attr("y", function (d) {
	      return y(d.y1);
	    }).attr("width", x.bandwidth()).attr("height", function (d) {
	      return y(d.y0) - y(d.y1);
	    });
	    country.selectAll("rect").on("mousemove", function (d) {
	      var delta = d.y1 - d.y0; // Tooltip

	      div.transition().style("opacity", .9);
	      div.html("<b> ".concat(d.loac, " </b><br><br>\n                <table>\n                  <tr>\n                    <td><b>").concat(globalSettings.formatNum(delta), " </td>\n                    <td> ").concat(i18next.t("units", {
	        ns: "constants"
	      }), " </td>\n                  </tr>\n                </table>")).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - yshiftTooltip + "px");
	    }).on("mouseout", function () {
	      div.transition().style("opacity", 0);
	    });
	    d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
	  } // -----------------------------------------------------------------------------
	  // Initial page load


	  i18n.load(["".concat(urlRoot, "/src/i18n")], function () {
	    d3.queue().defer(d3.json, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_sankey1.json")).defer(d3.json, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_sankey2.json")).defer(d3.csv, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_stackedbar_SAmer.csv")).defer(d3.csv, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_stackedbar_Africa.csv")).defer(d3.csv, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_stackedbar_Asia.csv")).defer(d3.csv, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_stackedbar_NAmer.csv")).defer(d3.csv, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_stackedbar_Oceania.csv")).defer(d3.csv, "".concat(urlRoot, "/data/LOAC_budget_TgCyr181113_stackedbar_Europe.csv"))["await"](function (error, sankeyfile1, sankeyfile2, stackedfileSA, stackedfileAfrica, stackedfileAsia, stackedfileNAmer, stackedfileOceania, stackedfileEurope) {
	      sankeydata1 = sankeyfile1;
	      sankeydata2 = sankeyfile2;
	      stackedSA = stackedfileSA;
	      stackedAfrica = stackedfileAfrica;
	      stackedAsia = stackedfileAsia;
	      stackedNAmer = stackedfileNAmer;
	      stackedOceania = stackedfileOceania;
	      stackedEurope = stackedfileEurope; // Page text

	      pageText(); // Draw graphs

	      showSankey(1, chartSankey1, settingsSankey, sankeydata1);
	      showSankey(2, chartSankey2, settingsSankey, sankeydata2);
	      showStackedBar(chartSA, settingsSA, stackedSA);
	      showStackedBar(chartAF, settingsAF, stackedAfrica);
	      showStackedBar(chartAS, settingsAS, stackedAsia);
	      showStackedBar(chartNA, settingsNA, stackedNAmer);
	      showStackedBar(chartOC, settingsOC, stackedOceania);
	      showStackedBar(chartEU, settingsEU, stackedEurope);
	    });
	  });
	};

	if (typeof Drupal !== "undefined") {
	  Drupal.behaviors.dv = {
	    attach: function attach(context, settings) {
	      init(Drupal.settings.dv && Drupal.settings.dv.urlRoot ? Drupal.settings.dv.urlRoot : "");
	    }
	  };
	} else {
	  init(".");
	}

}());
