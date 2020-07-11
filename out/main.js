(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}


// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}




var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Model$DrawingInactive = {$: 'DrawingInactive'};
var $simonh1000$elm_colorpicker$ColorPicker$State = function (a) {
	return {$: 'State', a: a};
};
var $simonh1000$elm_colorpicker$ColorPicker$Unpressed = {$: 'Unpressed'};
var $simonh1000$elm_colorpicker$ColorPicker$blankModel = {hue: $elm$core$Maybe$Nothing, mouseTarget: $simonh1000$elm_colorpicker$ColorPicker$Unpressed};
var $simonh1000$elm_colorpicker$ColorPicker$empty = $simonh1000$elm_colorpicker$ColorPicker$State($simonh1000$elm_colorpicker$ColorPicker$blankModel);
var $rundis$elm_bootstrap$Bootstrap$Modal$Hide = {$: 'Hide'};
var $rundis$elm_bootstrap$Bootstrap$Modal$hidden = $rundis$elm_bootstrap$Bootstrap$Modal$Hide;
var $author$project$Model$Enemy = F5(
	function (a, b, c, d, e) {
		return {$: 'Enemy', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Model$initEnemy = A5($author$project$Model$Enemy, 'none', 0, 0, 0, '');
var $author$project$Model$Hero = F2(
	function (a, b) {
		return {$: 'Hero', a: a, b: b};
	});
var $author$project$Model$initHero = A2($author$project$Model$Hero, 'none', 0);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$Area = F4(
	function (top, left, width, height) {
		return {height: height, left: left, top: top, width: width};
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed = {$: 'Closed'};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$State = function (a) {
	return {$: 'State', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$initialState = $rundis$elm_bootstrap$Bootstrap$Dropdown$State(
	{
		menuSize: A4($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$Area, 0, 0, 0, 0),
		status: $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed,
		toggleSize: A4($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$Area, 0, 0, 0, 0)
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$Showing = {$: 'Showing'};
var $rundis$elm_bootstrap$Bootstrap$Tab$State = function (a) {
	return {$: 'State', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Tab$initialState = $rundis$elm_bootstrap$Bootstrap$Tab$State(
	{activeTab: $elm$core$Maybe$Nothing, visibility: $rundis$elm_bootstrap$Bootstrap$Tab$Showing});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var $author$project$Model$init = function (_v0) {
	return _Utils_Tuple2(
		{
			addCharacterIcon: $author$project$Model$DrawingInactive,
			bonusDamage: 0,
			characterId: 0,
			characterList: _List_Nil,
			colorPicker: $simonh1000$elm_colorpicker$ColorPicker$empty,
			colour: A3($avh4$elm_color$Color$rgb, 255, 0, 0),
			damage: 0,
			dice: '1W6+0',
			dieFace: 0,
			dieFaces: _List_Nil,
			enemy: $elm$core$Array$empty,
			enemyHero: 'Enemy',
			hover: false,
			iconText: '',
			maxFace: 6,
			myDrop1State: $rundis$elm_bootstrap$Bootstrap$Dropdown$initialState,
			objectIconList: _List_Nil,
			previews: _List_Nil,
			radioCheckedID: 0,
			showAttackModal: $rundis$elm_bootstrap$Bootstrap$Modal$hidden,
			showCustomEnemy: $rundis$elm_bootstrap$Bootstrap$Modal$hidden,
			showDeathAlert: $rundis$elm_bootstrap$Bootstrap$Modal$hidden,
			showObjectIconModal: $rundis$elm_bootstrap$Bootstrap$Modal$hidden,
			showString: '',
			tabState: $rundis$elm_bootstrap$Bootstrap$Tab$initialState,
			tmpEnemy: $author$project$Model$initEnemy,
			tmpHero: $author$project$Model$initHero,
			tmpdice: '1W6+0'
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Model$MyDrop1Msg = function (a) {
	return {$: 'MyDrop1Msg', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$ListenClicks = {$: 'ListenClicks'};
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onClick = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'click');
var $rundis$elm_bootstrap$Bootstrap$Dropdown$updateStatus = F2(
	function (status, _v0) {
		var stateRec = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Dropdown$State(
			_Utils_update(
				stateRec,
				{status: status}));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$subscriptions = F2(
	function (state, toMsg) {
		var status = state.a.status;
		switch (status.$) {
			case 'Open':
				return $elm$browser$Browser$Events$onAnimationFrame(
					function (_v1) {
						return toMsg(
							A2($rundis$elm_bootstrap$Bootstrap$Dropdown$updateStatus, $rundis$elm_bootstrap$Bootstrap$Dropdown$ListenClicks, state));
					});
			case 'ListenClicks':
				return $elm$browser$Browser$Events$onClick(
					$elm$json$Json$Decode$succeed(
						toMsg(
							A2($rundis$elm_bootstrap$Bootstrap$Dropdown$updateStatus, $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed, state))));
			default:
				return $elm$core$Platform$Sub$none;
		}
	});
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($rundis$elm_bootstrap$Bootstrap$Dropdown$subscriptions, model.myDrop1State, $author$project$Model$MyDrop1Msg)
			]));
};
var $author$project$Model$DrawIcon = function (a) {
	return {$: 'DrawIcon', a: a};
};
var $author$project$Model$EnemyLoaded = function (a) {
	return {$: 'EnemyLoaded', a: a};
};
var $author$project$Model$GotFiles = F2(
	function (a, b) {
		return {$: 'GotFiles', a: a, b: b};
	});
var $author$project$Model$GotPreviews = function (a) {
	return {$: 'GotPreviews', a: a};
};
var $author$project$Model$MonsterIcon = F3(
	function (a, b, c) {
		return {$: 'MonsterIcon', a: a, b: b, c: c};
	});
var $author$project$Model$ObjectIcon = F5(
	function (a, b, c, d, e) {
		return {$: 'ObjectIcon', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Model$PlayerIcon = F3(
	function (a, b, c) {
		return {$: 'PlayerIcon', a: a, b: b, c: c};
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$FightingTool$damageCalc = F2(
	function (randValues, bd) {
		return $elm$core$List$sum(randValues) + bd;
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$file$File$Select$files = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			function (_v0) {
				var f = _v0.a;
				var fs = _v0.b;
				return A2(toMsg, f, fs);
			},
			_File_uploadOneOrMore(mimes));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Model$NewRandomList = function (a) {
	return {$: 'NewRandomList', a: a};
};
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
			});
	});
var $author$project$FightingTool$randomListGenerator = F2(
	function (rt, mf) {
		return A2(
			$elm$random$Random$list,
			rt,
			A2($elm$random$Random$int, 1, mf));
	});
var $author$project$FightingTool$generateRandomList = F2(
	function (rt, mf) {
		return A2(
			$elm$random$Random$generate,
			$author$project$Model$NewRandomList,
			A2($author$project$FightingTool$randomListGenerator, rt, mf));
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$isNotId = F2(
	function (id, s) {
		switch (s.$) {
			case 'MonsterIcon':
				var i = s.a;
				return !_Utils_eq(id, i);
			case 'PlayerIcon':
				var i = s.a;
				return !_Utils_eq(id, i);
			default:
				var i = s.a;
				return !_Utils_eq(id, i);
		}
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$FightingTool$parseEnemy = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (n, h, m, s) {
			return A5($author$project$Model$Enemy, n, h, m, s, '');
		}),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'health', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'health', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'armor', $elm$json$Json$Decode$int));
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elm_community$array_extra$Array$Extra$splitAt = F2(
	function (index, xs) {
		var len = $elm$core$Array$length(xs);
		var _v0 = _Utils_Tuple2(
			index > 0,
			_Utils_cmp(index, len) < 0);
		if (_v0.a) {
			if (_v0.b) {
				return _Utils_Tuple2(
					A3($elm$core$Array$slice, 0, index, xs),
					A3($elm$core$Array$slice, index, len, xs));
			} else {
				return _Utils_Tuple2(xs, $elm$core$Array$empty);
			}
		} else {
			if (_v0.b) {
				return _Utils_Tuple2($elm$core$Array$empty, xs);
			} else {
				return _Utils_Tuple2($elm$core$Array$empty, $elm$core$Array$empty);
			}
		}
	});
var $elm_community$array_extra$Array$Extra$removeAt = F2(
	function (index, xs) {
		var _v0 = A2($elm_community$array_extra$Array$Extra$splitAt, index, xs);
		var xs0 = _v0.a;
		var xs1 = _v0.b;
		var len1 = $elm$core$Array$length(xs1);
		return (!len1) ? xs0 : A2(
			$elm$core$Array$append,
			xs0,
			A3($elm$core$Array$slice, 1, len1, xs1));
	});
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$FightingTool$setDice = function (set) {
	return _Utils_ap(
		A2(
			$elm$core$List$take,
			1,
			A2($elm$core$String$split, 'W', set)),
		A2(
			$elm$core$String$split,
			'+',
			A2(
				$elm$core$Maybe$withDefault,
				'6+0',
				$elm$core$List$head(
					A2(
						$elm$core$List$drop,
						1,
						A2($elm$core$String$split, 'W', set))))));
};
var $rundis$elm_bootstrap$Bootstrap$Modal$Show = {$: 'Show'};
var $rundis$elm_bootstrap$Bootstrap$Modal$shown = $rundis$elm_bootstrap$Bootstrap$Modal$Show;
var $elm$file$File$toUrl = _File_toUrl;
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _v0 = _Utils_Tuple3(hue, sat, light);
		var h = _v0.a;
		var s = _v0.b;
		var l = _v0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4($avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var $avh4$elm_color$Color$fromHsla = function (_v0) {
	var hue = _v0.hue;
	var saturation = _v0.saturation;
	var lightness = _v0.lightness;
	var alpha = _v0.alpha;
	return A4($avh4$elm_color$Color$hsla, hue, saturation, lightness, alpha);
};
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $avh4$elm_color$Color$toHsla = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var minColor = A2(
		$elm$core$Basics$min,
		r,
		A2($elm$core$Basics$min, g, b));
	var maxColor = A2(
		$elm$core$Basics$max,
		r,
		A2($elm$core$Basics$max, g, b));
	var l = (minColor + maxColor) / 2;
	var s = _Utils_eq(minColor, maxColor) ? 0 : ((l < 0.5) ? ((maxColor - minColor) / (maxColor + minColor)) : ((maxColor - minColor) / ((2 - maxColor) - minColor)));
	var h1 = _Utils_eq(maxColor, r) ? ((g - b) / (maxColor - minColor)) : (_Utils_eq(maxColor, g) ? (2 + ((b - r) / (maxColor - minColor))) : (4 + ((r - g) / (maxColor - minColor))));
	var h2 = h1 * (1 / 6);
	var h3 = $elm$core$Basics$isNaN(h2) ? 0 : ((h2 < 0) ? (h2 + 1) : h2);
	return {alpha: a, hue: h3, lightness: l, saturation: s};
};
var $simonh1000$elm_colorpicker$ColorPicker$widgetWidth = 200;
var $simonh1000$elm_colorpicker$ColorPicker$calcHue = F2(
	function (col, _v0) {
		var x = _v0.x;
		var mousePressed = _v0.mousePressed;
		var hue = x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		var saturation = hsla.saturation;
		var lightness = hsla.lightness;
		var alpha = hsla.alpha;
		var newCol = ((!saturation) && (lightness < 0.02)) ? _Utils_update(
			hsla,
			{hue: hue, lightness: 0.5, saturation: 0.5}) : _Utils_update(
			hsla,
			{hue: hue});
		return $avh4$elm_color$Color$fromHsla(newCol);
	});
var $simonh1000$elm_colorpicker$ColorPicker$calcOpacity = F3(
	function (col, _v0, _v1) {
		var x = _v1.x;
		var mousePressed = _v1.mousePressed;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		return $avh4$elm_color$Color$fromHsla(
			_Utils_update(
				hsla,
				{alpha: x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth}));
	});
var $simonh1000$elm_colorpicker$ColorPicker$widgetHeight = 150;
var $simonh1000$elm_colorpicker$ColorPicker$calcSatLight = F3(
	function (col, currHue, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		var mousePressed = _v0.mousePressed;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		return $avh4$elm_color$Color$fromHsla(
			_Utils_update(
				hsla,
				{hue: currHue, lightness: 1 - (y / $simonh1000$elm_colorpicker$ColorPicker$widgetHeight), saturation: x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth}));
	});
var $elm$core$Basics$not = _Basics_not;
var $simonh1000$elm_colorpicker$ColorPicker$setHue = F3(
	function (mouseTarget, mouseInfo, model) {
		switch (mouseTarget.$) {
			case 'SatLight':
				var hue = mouseTarget.a;
				return _Utils_update(
					model,
					{
						hue: $elm$core$Maybe$Just(
							A2($elm$core$Maybe$withDefault, hue, model.hue))
					});
			case 'HueSlider':
				return _Utils_update(
					model,
					{
						hue: $elm$core$Maybe$Just(mouseInfo.x / $simonh1000$elm_colorpicker$ColorPicker$widgetWidth)
					});
			case 'OpacitySlider':
				var hue = mouseTarget.a;
				return _Utils_update(
					model,
					{
						hue: $elm$core$Maybe$Just(
							A2($elm$core$Maybe$withDefault, hue, model.hue))
					});
			default:
				return model;
		}
	});
var $simonh1000$elm_colorpicker$ColorPicker$setMouseTarget = F2(
	function (mouseTarget, model) {
		return _Utils_update(
			model,
			{mouseTarget: mouseTarget});
	});
var $simonh1000$elm_colorpicker$ColorPicker$update_ = F3(
	function (message, col, model) {
		var calcNewColour = function (mouseTarget) {
			switch (mouseTarget.$) {
				case 'SatLight':
					var hue = mouseTarget.a;
					return A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$Just,
						A2(
							$simonh1000$elm_colorpicker$ColorPicker$calcSatLight,
							col,
							A2($elm$core$Maybe$withDefault, hue, model.hue)));
				case 'HueSlider':
					return A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$Just,
						$simonh1000$elm_colorpicker$ColorPicker$calcHue(col));
				case 'OpacitySlider':
					var hue = mouseTarget.a;
					return A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$Just,
						A2(
							$simonh1000$elm_colorpicker$ColorPicker$calcOpacity,
							col,
							A2($elm$core$Maybe$withDefault, hue, model.hue)));
				default:
					return function (_v2) {
						return $elm$core$Maybe$Nothing;
					};
			}
		};
		var handleMouseMove = F2(
			function (mouseTarget, mouseInfo) {
				return (mouseInfo.mousePressed && _Utils_eq(model.mouseTarget, mouseTarget)) ? _Utils_Tuple2(
					A3($simonh1000$elm_colorpicker$ColorPicker$setHue, mouseTarget, mouseInfo, model),
					A2(calcNewColour, mouseTarget, mouseInfo)) : (((!mouseInfo.mousePressed) && _Utils_eq(model.mouseTarget, mouseTarget)) ? _Utils_Tuple2(
					A2($simonh1000$elm_colorpicker$ColorPicker$setMouseTarget, $simonh1000$elm_colorpicker$ColorPicker$Unpressed, model),
					$elm$core$Maybe$Nothing) : _Utils_Tuple2(model, $elm$core$Maybe$Nothing));
			});
		switch (message.$) {
			case 'OnMouseDown':
				var mouseTarget = message.a;
				var mouseInfo = message.b;
				return _Utils_Tuple2(
					A3(
						$simonh1000$elm_colorpicker$ColorPicker$setHue,
						mouseTarget,
						mouseInfo,
						A2($simonh1000$elm_colorpicker$ColorPicker$setMouseTarget, mouseTarget, model)),
					A2(calcNewColour, mouseTarget, mouseInfo));
			case 'OnMouseMove':
				var mouseTarget = message.a;
				var mouseInfo = message.b;
				return A2(handleMouseMove, mouseTarget, mouseInfo);
			case 'OnClick':
				var mouseTarget = message.a;
				var mouseInfo = message.b;
				return _Utils_Tuple2(
					A3($simonh1000$elm_colorpicker$ColorPicker$setHue, mouseTarget, mouseInfo, model),
					A2(calcNewColour, mouseTarget, mouseInfo));
			case 'OnMouseUp':
				return _Utils_Tuple2(
					A2($simonh1000$elm_colorpicker$ColorPicker$setMouseTarget, $simonh1000$elm_colorpicker$ColorPicker$Unpressed, model),
					$elm$core$Maybe$Nothing);
			default:
				return _Utils_Tuple2(model, $elm$core$Maybe$Nothing);
		}
	});
var $simonh1000$elm_colorpicker$ColorPicker$update = F3(
	function (message, col, _v0) {
		var model = _v0.a;
		return A2(
			$elm$core$Tuple$mapFirst,
			$simonh1000$elm_colorpicker$ColorPicker$State,
			A3($simonh1000$elm_colorpicker$ColorPicker$update_, message, col, model));
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'LoadEnemy':
				var enemy = msg.a;
				return _Utils_Tuple2(
					model,
					$elm$http$Http$get(
						{
							expect: A2($elm$http$Http$expectJson, $author$project$Model$EnemyLoaded, $author$project$FightingTool$parseEnemy),
							url: './res/' + (enemy + '.json')
						}));
			case 'EnemyLoaded':
				if (msg.a.$ === 'Ok') {
					var newEnemy = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{tmpEnemy: newEnemy}),
						$elm$core$Platform$Cmd$none);
				} else {
					var error = msg.a.a;
					if (error.$ === 'BadBody') {
						var errorMsg = error.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showString: 'Error:  ' + errorMsg}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showString: 'Error:  '}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 'UpdateEnemy':
				var index = msg.a;
				var _new = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							enemy: A3($elm$core$Array$set, index, _new, model.enemy),
							showAttackModal: $rundis$elm_bootstrap$Bootstrap$Modal$hidden
						}),
					$elm$core$Platform$Cmd$none);
			case 'UpdateTmp':
				var _new = msg.a;
				if (_new.$ === 'Enemy') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{tmpEnemy: _new}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{tmpHero: _new}),
						$elm$core$Platform$Cmd$none);
				}
			case 'AddEnemy':
				var _char = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							enemy: A2($elm$core$Array$push, _char, model.enemy),
							showCustomEnemy: $rundis$elm_bootstrap$Bootstrap$Modal$hidden
						}),
					$elm$core$Platform$Cmd$none);
			case 'RemoveEnemy':
				var index = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							enemy: A2($elm_community$array_extra$Array$Extra$removeAt, index, model.enemy)
						}),
					$elm$core$Platform$Cmd$none);
			case 'CharacterDeath':
				var index = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							enemy: A2($elm_community$array_extra$Array$Extra$removeAt, index, model.enemy),
							showAttackModal: $rundis$elm_bootstrap$Bootstrap$Modal$hidden,
							showDeathAlert: $rundis$elm_bootstrap$Bootstrap$Modal$shown
						}),
					$elm$core$Platform$Cmd$none);
			case 'MyDrop1Msg':
				var state = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{myDrop1State: state}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeDamage':
				var newDamage = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							damage: A2(
								$elm$core$Maybe$withDefault,
								0,
								$elm$core$String$toInt(newDamage))
						}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeTmpDice':
				var newTmpDice = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{tmpdice: newTmpDice}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeIconText':
				var newIconText = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{iconText: newIconText}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeIcon':
				var id = msg.a;
				var _v3 = model.addCharacterIcon;
				if ((_v3.$ === 'DrawIcon') && (_v3.a.$ === 'ObjectIcon')) {
					var _v4 = _v3.a;
					var i = _v4.a;
					var x = _v4.b;
					var y = _v4.c;
					var t = _v4.d;
					var c = _v4.e;
					if (id === 3) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									addCharacterIcon: $author$project$Model$DrawIcon(
										A5($author$project$Model$ObjectIcon, id, x, y, t, c)),
									radioCheckedID: id
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									addCharacterIcon: $author$project$Model$DrawIcon(
										A5($author$project$Model$ObjectIcon, id, x, y, t, $elm$core$Maybe$Nothing)),
									radioCheckedID: id
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'DiceAndSlice':
				var newDice = msg.a;
				var rt = A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$String$toInt(
						A2(
							$elm$core$Maybe$withDefault,
							'0',
							$elm$core$List$head(
								$author$project$FightingTool$setDice(newDice)))));
				var mf = A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$String$toInt(
						A2(
							$elm$core$Maybe$withDefault,
							'6',
							$elm$core$List$head(
								A2(
									$elm$core$List$drop,
									1,
									$author$project$FightingTool$setDice(newDice))))));
				var bd = A2(
					$elm$core$Maybe$withDefault,
					0,
					$elm$core$String$toInt(
						A2(
							$elm$core$Maybe$withDefault,
							'0',
							$elm$core$List$head(
								A2(
									$elm$core$List$drop,
									2,
									$author$project$FightingTool$setDice(newDice))))));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bonusDamage: bd, dice: newDice, maxFace: mf}),
					A2($author$project$FightingTool$generateRandomList, rt, mf));
			case 'NewRandomList':
				var intList = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							damage: A2($author$project$FightingTool$damageCalc, intList, model.bonusDamage),
							dieFaces: intList
						}),
					$elm$core$Platform$Cmd$none);
			case 'TabMsg':
				var state = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{tabState: state}),
					$elm$core$Platform$Cmd$none);
			case 'AddCharacterIcon':
				var addCharacterIconMsg = msg.a;
				if (addCharacterIconMsg.$ === 'MouseClick') {
					var characterIcon = addCharacterIconMsg.a;
					switch (characterIcon.$) {
						case 'PlayerIcon':
							var i = characterIcon.a;
							var x = characterIcon.b;
							var y = characterIcon.c;
							return _Utils_eq(
								$elm$core$List$length(model.characterList),
								$elm$core$List$length(
									A2(
										$elm$core$List$filter,
										$author$project$Main$isNotId(i),
										model.characterList))) ? _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawingInactive,
										characterList: _Utils_ap(
											model.characterList,
											_List_fromArray(
												[characterIcon]))
									}),
								$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
								_Utils_update(
									model,
									{addCharacterIcon: $author$project$Model$DrawingInactive}),
								$elm$core$Platform$Cmd$none);
						case 'MonsterIcon':
							var i = characterIcon.a;
							var x = characterIcon.b;
							var y = characterIcon.c;
							return _Utils_eq(
								$elm$core$List$length(model.characterList),
								$elm$core$List$length(
									A2(
										$elm$core$List$filter,
										$author$project$Main$isNotId(i),
										model.characterList))) ? _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawingInactive,
										characterList: _Utils_ap(
											model.characterList,
											_List_fromArray(
												[characterIcon]))
									}),
								$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
								_Utils_update(
									model,
									{addCharacterIcon: $author$project$Model$DrawingInactive}),
								$elm$core$Platform$Cmd$none);
						default:
							var i = characterIcon.a;
							var x = characterIcon.b;
							var y = characterIcon.c;
							var t = characterIcon.d;
							var c = characterIcon.e;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawingInactive,
										iconText: '',
										objectIconList: _Utils_ap(
											model.objectIconList,
											_List_fromArray(
												[
													A5(
													$author$project$Model$ObjectIcon,
													i,
													x,
													y,
													model.iconText,
													$elm$core$Maybe$Just(model.colour))
												])),
										radioCheckedID: 0,
										showObjectIconModal: $rundis$elm_bootstrap$Bootstrap$Modal$hidden
									}),
								$elm$core$Platform$Cmd$none);
					}
				} else {
					var characterIcon = addCharacterIconMsg.a;
					switch (characterIcon.$) {
						case 'PlayerIcon':
							var i = characterIcon.a;
							var x = characterIcon.b;
							var y = characterIcon.c;
							return (_Utils_cmp(
								$elm$core$List$length(model.characterList),
								$elm$core$List$length(
									A2(
										$elm$core$List$filter,
										$author$project$Main$isNotId(i),
										model.characterList))) > 0) ? _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawingInactive,
										characterList: A2(
											$elm$core$List$filter,
											$author$project$Main$isNotId(i),
											model.characterList)
									}),
								$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawIcon(
											A3($author$project$Model$PlayerIcon, i, x, y))
									}),
								$elm$core$Platform$Cmd$none);
						case 'MonsterIcon':
							var i = characterIcon.a;
							var x = characterIcon.b;
							var y = characterIcon.c;
							return (_Utils_cmp(
								$elm$core$List$length(model.characterList),
								$elm$core$List$length(
									A2(
										$elm$core$List$filter,
										$author$project$Main$isNotId(i),
										model.characterList))) > 0) ? _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawingInactive,
										characterList: A2(
											$elm$core$List$filter,
											$author$project$Main$isNotId(i),
											model.characterList)
									}),
								$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawIcon(
											A3($author$project$Model$MonsterIcon, i, x, y))
									}),
								$elm$core$Platform$Cmd$none);
						default:
							var i = characterIcon.a;
							var x = characterIcon.b;
							var y = characterIcon.c;
							var t = characterIcon.d;
							var c = characterIcon.e;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										addCharacterIcon: $author$project$Model$DrawIcon(
											A5($author$project$Model$ObjectIcon, i, x, y, t, c))
									}),
								$elm$core$Platform$Cmd$none);
					}
				}
			case 'ClearCharacterList':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{characterList: _List_Nil, objectIconList: _List_Nil}),
					$elm$core$Platform$Cmd$none);
			case 'CloseModal':
				var modalType = msg.a;
				switch (modalType.$) {
					case 'AttackModal':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showAttackModal: $rundis$elm_bootstrap$Bootstrap$Modal$hidden}),
							$elm$core$Platform$Cmd$none);
					case 'DeathAlert':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showDeathAlert: $rundis$elm_bootstrap$Bootstrap$Modal$hidden}),
							$elm$core$Platform$Cmd$none);
					case 'CustomEnemy':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showCustomEnemy: $rundis$elm_bootstrap$Bootstrap$Modal$hidden}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showObjectIconModal: $rundis$elm_bootstrap$Bootstrap$Modal$hidden}),
							$elm$core$Platform$Cmd$none);
				}
			case 'ShowModal':
				var modalType = msg.a;
				switch (modalType.$) {
					case 'AttackModal':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showAttackModal: $rundis$elm_bootstrap$Bootstrap$Modal$shown}),
							$elm$core$Platform$Cmd$none);
					case 'DeathAlert':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showDeathAlert: $rundis$elm_bootstrap$Bootstrap$Modal$shown}),
							$elm$core$Platform$Cmd$none);
					case 'CustomEnemy':
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showCustomEnemy: $rundis$elm_bootstrap$Bootstrap$Modal$shown}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{showObjectIconModal: $rundis$elm_bootstrap$Bootstrap$Modal$shown}),
							$elm$core$Platform$Cmd$none);
				}
			case 'ShowAttackModal':
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{characterId: id, showAttackModal: $rundis$elm_bootstrap$Bootstrap$Modal$shown}),
					$elm$core$Platform$Cmd$none);
			case 'SwitchEnemyHero':
				var string = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{enemyHero: string}),
					$elm$core$Platform$Cmd$none);
			case 'DoNothing':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'Pick':
				return _Utils_Tuple2(
					model,
					A2(
						$elm$file$File$Select$files,
						_List_fromArray(
							['image/*']),
						$author$project$Model$GotFiles));
			case 'DragEnter':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hover: true}),
					$elm$core$Platform$Cmd$none);
			case 'DragLeave':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hover: false}),
					$elm$core$Platform$Cmd$none);
			case 'GotFiles':
				var file = msg.a;
				var files = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{hover: false}),
					A2(
						$elm$core$Task$perform,
						$author$project$Model$GotPreviews,
						$elm$core$Task$sequence(
							A2(
								$elm$core$List$map,
								$elm$file$File$toUrl,
								A2($elm$core$List$cons, file, files)))));
			case 'GotPreviews':
				var urls = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{previews: urls}),
					$elm$core$Platform$Cmd$none);
			default:
				var cpMsg = msg.a;
				var _v11 = model.addCharacterIcon;
				if ((_v11.$ === 'DrawIcon') && (_v11.a.$ === 'ObjectIcon')) {
					var _v12 = _v11.a;
					var i = _v12.a;
					var x = _v12.b;
					var y = _v12.c;
					var t = _v12.d;
					var c = _v12.e;
					var _v13 = A3($simonh1000$elm_colorpicker$ColorPicker$update, cpMsg, model.colour, model.colorPicker);
					var m = _v13.a;
					var colour = _v13.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								colorPicker: m,
								colour: A2($elm$core$Maybe$withDefault, model.colour, colour)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Model$TabMsg = function (a) {
	return {$: 'TabMsg', a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$About$aboutView = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Das schwarze Auge Edition 5')
				])),
			A2(
			$elm$html$Html$h3,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Übersicht der Kampfesregeln')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('\n                Die wenigsten Geschichten im Pen & Paper Rollenspiel DSA kommen ohne einen Kampf aus.\n                Die Mechanik unterscheidet sich allerdings etwas vom normalen Spielgeschehen.\n            '),
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					$elm$html$Html$text('\n                Zur Vorbereitung wird die Reihenfolge der Kämpfenden bestimmt. Dazu wird der die Initiative (INI) ausgewürfelt.\n                Der Spielleiter würfelt für alle NSCs.\n            '),
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					$elm$html$Html$text('\n                Dieser Reihenfolge nach dürfen die Charaktere jetzt je einen Gegner angreifen.\n            ')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('\n                Um anzugreifen muss zunächst eine Probe mit einem W20 auf den AT-Wert bestanden werden.\n                Gleichzeitig wirft der Angegriffene auf PA oder AW. Gelingt die Probe bricht der Angriff an dieser Stelle ab.\n            '),
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					$elm$html$Html$text('\n                War der Angriff erfolgreich und die Verteidigung ein Fehlschlag wird der Schaden berechnet.\n                Das ist die Gelegenheit den \"Angriff\"-Button zu klicken.\n                Entsprechend der Angabe der Waffe (z.B 1W6+4) wird der Angriffswert erwürfelt.\n                Von diesem wird der RS-Wert des Angegriffenen subtrahiert und das Ergebnis von den LeP abgezogen.\n            '),
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					$elm$html$Html$text('\n                Die Berechnung übernimmt der Manager vollständig!\n            ')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Das ist nur eine minimale Zusammfassung, die genauen Regeln können im '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('http://ulisses-regelwiki.de/index.php/Kampfregeln.html')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('DSA Regelwiki')
						])),
					$elm$html$Html$text(' nachgelesen werden.')
				]))
		]));
var $author$project$Model$CustomEnemy = {$: 'CustomEnemy'};
var $author$project$Model$ShowModal = function (a) {
	return {$: 'ShowModal', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs(attrs_);
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Block = {$: 'Block'};
var $rundis$elm_bootstrap$Bootstrap$Button$block = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Block;
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						size: $elm$core$Maybe$Just(size)
					});
			case 'Coloring':
				var coloring = modifier.a;
				return _Utils_update(
					options,
					{
						coloring: $elm$core$Maybe$Just(coloring)
					});
			case 'Block':
				return _Utils_update(
					options,
					{block: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions = {attributes: _List_Nil, block: false, coloring: $elm$core$Maybe$Nothing, disabled: false, size: $elm$core$Maybe$Nothing};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass = function (role) {
	switch (role.$) {
		case 'Primary':
			return 'primary';
		case 'Secondary':
			return 'secondary';
		case 'Success':
			return 'success';
		case 'Info':
			return 'info';
		case 'Warning':
			return 'warning';
		case 'Danger':
			return 'danger';
		case 'Dark':
			return 'dark';
		case 'Light':
			return 'light';
		default:
			return 'link';
	}
};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption = function (size) {
	switch (size.$) {
		case 'XS':
			return $elm$core$Maybe$Nothing;
		case 'SM':
			return $elm$core$Maybe$Just('sm');
		case 'MD':
			return $elm$core$Maybe$Just('md');
		case 'LG':
			return $elm$core$Maybe$Just('lg');
		default:
			return $elm$core$Maybe$Just('xl');
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier, $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-block', options.block),
						_Utils_Tuple2('disabled', options.disabled)
					])),
				$elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			function () {
				var _v0 = A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.size);
				if (_v0.$ === 'Just') {
					var s = _v0.a;
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn-' + s)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.coloring;
					if (_v1.$ === 'Just') {
						if (_v1.a.$ === 'Roled') {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						} else {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-outline-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
				options.attributes)));
};
var $rundis$elm_bootstrap$Bootstrap$Button$button = F2(
	function (options, children) {
		return A2(
			$elm$html$Html$button,
			$rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(options),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Table$CellAttr = function (a) {
	return {$: 'CellAttr', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$cellAttr = function (attr_) {
	return $rundis$elm_bootstrap$Bootstrap$Table$CellAttr(attr_);
};
var $elm$html$Html$Attributes$colspan = function (n) {
	return A2(
		_VirtualDom_attribute,
		'colspan',
		$elm$core$String$fromInt(n));
};
var $author$project$Model$CloseModal = function (a) {
	return {$: 'CloseModal', a: a};
};
var $author$project$Model$DeathAlert = {$: 'DeathAlert'};
var $rundis$elm_bootstrap$Bootstrap$Modal$Body = function (a) {
	return {$: 'Body', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Modal$Config = function (a) {
	return {$: 'Config', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Modal$body = F3(
	function (attributes, children, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Modal$Config(
			_Utils_update(
				conf,
				{
					body: $elm$core$Maybe$Just(
						$rundis$elm_bootstrap$Bootstrap$Modal$Body(
							{attributes: attributes, children: children}))
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Modal$config = function (closeMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Modal$Config(
		{
			body: $elm$core$Maybe$Nothing,
			closeMsg: closeMsg,
			footer: $elm$core$Maybe$Nothing,
			header: $elm$core$Maybe$Nothing,
			options: {attrs: _List_Nil, centered: true, hideOnBackdropClick: true, modalSize: $elm$core$Maybe$Nothing, scrollableBody: false},
			withAnimation: $elm$core$Maybe$Nothing
		});
};
var $rundis$elm_bootstrap$Bootstrap$Modal$Footer = function (a) {
	return {$: 'Footer', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Modal$footer = F3(
	function (attributes, children, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Modal$Config(
			_Utils_update(
				conf,
				{
					footer: $elm$core$Maybe$Just(
						$rundis$elm_bootstrap$Bootstrap$Modal$Footer(
							{attributes: attributes, children: children}))
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Modal$Header = function (a) {
	return {$: 'Header', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Modal$header = F3(
	function (attributes, children, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Modal$Config(
			_Utils_update(
				conf,
				{
					header: $elm$core$Maybe$Just(
						$rundis$elm_bootstrap$Bootstrap$Modal$Header(
							{attributes: attributes, children: children}))
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Modal$titledHeader = F3(
	function (itemFn, attributes, children) {
		return A2(
			$rundis$elm_bootstrap$Bootstrap$Modal$header,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					itemFn,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('modal-title'),
						attributes),
					children)
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Modal$h3 = $rundis$elm_bootstrap$Bootstrap$Modal$titledHeader($elm$html$Html$h3);
var $rundis$elm_bootstrap$Bootstrap$Modal$hideOnBackdropClick = F2(
	function (hide, _v0) {
		var conf = _v0.a;
		var options = conf.options;
		return $rundis$elm_bootstrap$Bootstrap$Modal$Config(
			_Utils_update(
				conf,
				{
					options: _Utils_update(
						options,
						{hideOnBackdropClick: hide})
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$General$Internal$SM = {$: 'SM'};
var $rundis$elm_bootstrap$Bootstrap$Modal$small = function (_v0) {
	var conf = _v0.a;
	var options = conf.options;
	return $rundis$elm_bootstrap$Bootstrap$Modal$Config(
		_Utils_update(
			conf,
			{
				options: _Utils_update(
					options,
					{
						modalSize: $elm$core$Maybe$Just($rundis$elm_bootstrap$Bootstrap$General$Internal$SM)
					})
			}));
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $rundis$elm_bootstrap$Bootstrap$Modal$StartClose = {$: 'StartClose'};
var $rundis$elm_bootstrap$Bootstrap$Modal$getCloseMsg = function (config_) {
	var _v0 = config_.withAnimation;
	if (_v0.$ === 'Just') {
		var animationMsg = _v0.a;
		return animationMsg($rundis$elm_bootstrap$Bootstrap$Modal$StartClose);
	} else {
		return config_.closeMsg;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Modal$isFade = function (conf) {
	return A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (_v0) {
				return true;
			},
			conf.withAnimation));
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $rundis$elm_bootstrap$Bootstrap$Modal$backdrop = F2(
	function (visibility, conf) {
		var attributes = function () {
			switch (visibility.$) {
				case 'Show':
					return _Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('modal-backdrop', true),
										_Utils_Tuple2(
										'fade',
										$rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
										_Utils_Tuple2('show', true)
									]))
							]),
						conf.options.hideOnBackdropClick ? _List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$rundis$elm_bootstrap$Bootstrap$Modal$getCloseMsg(conf))
							]) : _List_Nil);
				case 'StartClose':
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('modal-backdrop', true),
									_Utils_Tuple2('fade', true),
									_Utils_Tuple2('show', true)
								]))
						]);
				case 'FadeClose':
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('modal-backdrop', true),
									_Utils_Tuple2('fade', true),
									_Utils_Tuple2('show', false)
								]))
						]);
				default:
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('modal-backdrop', false),
									_Utils_Tuple2(
									'fade',
									$rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
									_Utils_Tuple2('show', false)
								]))
						]);
			}
		}();
		return _List_fromArray(
			[
				A2($elm$html$Html$div, attributes, _List_Nil)
			]);
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['className']),
	$elm$json$Json$Decode$string);
var $elm$json$Json$Decode$fail = _Json_fail;
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$target = function (decoder) {
	return A2($elm$json$Json$Decode$field, 'target', decoder);
};
var $rundis$elm_bootstrap$Bootstrap$Modal$containerClickDecoder = function (closeMsg) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (c) {
			return A2($elm$core$String$contains, 'elm-bootstrap-modal', c) ? $elm$json$Json$Decode$succeed(closeMsg) : $elm$json$Json$Decode$fail('ignoring');
		},
		$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$target($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $rundis$elm_bootstrap$Bootstrap$Modal$display = F2(
	function (visibility, conf) {
		switch (visibility.$) {
			case 'Show':
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2(
								'fade',
								$rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
								_Utils_Tuple2('show', true)
							]))
					]);
			case 'StartClose':
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2('fade', true),
								_Utils_Tuple2('show', true)
							]))
					]);
			case 'FadeClose':
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2('fade', true),
								_Utils_Tuple2('show', false)
							])),
						A2(
						$elm$html$Html$Events$on,
						'transitionend',
						$elm$json$Json$Decode$succeed(conf.closeMsg))
					]);
			default:
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'height', '0px'),
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('modal', true),
								_Utils_Tuple2(
								'fade',
								$rundis$elm_bootstrap$Bootstrap$Modal$isFade(conf)),
								_Utils_Tuple2('show', false)
							]))
					]);
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Modal$modalClass = function (size) {
	var _v0 = $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size);
	if (_v0.$ === 'Just') {
		var s = _v0.a;
		return _List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal-' + s)
			]);
	} else {
		return _List_Nil;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Modal$modalAttributes = function (options) {
	return _Utils_ap(
		options.attrs,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('modal-dialog', true),
							_Utils_Tuple2('modal-dialog-centered', options.centered),
							_Utils_Tuple2('modal-dialog-scrollable', options.scrollableBody)
						])),
					A2($elm$html$Html$Attributes$style, 'pointer-events', 'auto')
				]),
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Modal$modalClass, options.modalSize))));
};
var $rundis$elm_bootstrap$Bootstrap$Modal$renderBody = function (maybeBody) {
	if (maybeBody.$ === 'Just') {
		var cfg = maybeBody.a.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('modal-body'),
					cfg.attributes),
				cfg.children));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Modal$renderFooter = function (maybeFooter) {
	if (maybeFooter.$ === 'Just') {
		var cfg = maybeFooter.a.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('modal-footer'),
					cfg.attributes),
				cfg.children));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Modal$closeButton = function (closeMsg) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('close'),
				$elm$html$Html$Events$onClick(closeMsg)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('×')
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Modal$renderHeader = function (conf_) {
	var _v0 = conf_.header;
	if (_v0.$ === 'Just') {
		var cfg = _v0.a.a;
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('modal-header'),
					cfg.attributes),
				_Utils_ap(
					cfg.children,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Modal$closeButton(
							$rundis$elm_bootstrap$Bootstrap$Modal$getCloseMsg(conf_))
						]))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $rundis$elm_bootstrap$Bootstrap$Modal$view = F2(
	function (visibility, _v0) {
		var conf = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_Utils_ap(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$tabindex(-1)
								]),
							A2($rundis$elm_bootstrap$Bootstrap$Modal$display, visibility, conf)),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_Utils_ap(
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$attribute, 'role', 'document'),
											$elm$html$Html$Attributes$class('elm-bootstrap-modal')
										]),
									_Utils_ap(
										$rundis$elm_bootstrap$Bootstrap$Modal$modalAttributes(conf.options),
										conf.options.hideOnBackdropClick ? _List_fromArray(
											[
												A2(
												$elm$html$Html$Events$on,
												'click',
												$rundis$elm_bootstrap$Bootstrap$Modal$containerClickDecoder(conf.closeMsg))
											]) : _List_Nil)),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('modal-content')
											]),
										A2(
											$elm$core$List$filterMap,
											$elm$core$Basics$identity,
											_List_fromArray(
												[
													$rundis$elm_bootstrap$Bootstrap$Modal$renderHeader(conf),
													$rundis$elm_bootstrap$Bootstrap$Modal$renderBody(conf.body),
													$rundis$elm_bootstrap$Bootstrap$Modal$renderFooter(conf.footer)
												])))
									]))
							]))
					]),
				A2($rundis$elm_bootstrap$Bootstrap$Modal$backdrop, visibility, conf)));
	});
var $author$project$FightingTool$deathAlert = function (model) {
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Modal$view,
		model.showDeathAlert,
		A3(
			$rundis$elm_bootstrap$Bootstrap$Modal$footer,
			_List_Nil,
			_List_Nil,
			A3(
				$rundis$elm_bootstrap$Bootstrap$Modal$body,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Das Monster ist besiegt!')
							]))
					]),
				A3(
					$rundis$elm_bootstrap$Bootstrap$Modal$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Gewonnen ☠')
						]),
					A2(
						$rundis$elm_bootstrap$Bootstrap$Modal$hideOnBackdropClick,
						true,
						$rundis$elm_bootstrap$Bootstrap$Modal$small(
							$rundis$elm_bootstrap$Bootstrap$Modal$config(
								$author$project$Model$CloseModal($author$project$Model$DeathAlert))))))));
};
var $author$project$Model$RemoveEnemy = function (a) {
	return {$: 'RemoveEnemy', a: a};
};
var $author$project$Model$ShowAttackModal = function (a) {
	return {$: 'ShowAttackModal', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring = function (a) {
	return {$: 'Coloring', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Danger = {$: 'Danger'};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled = function (a) {
	return {$: 'Roled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$danger = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Button$Danger));
var $rundis$elm_bootstrap$Bootstrap$Table$Td = function (a) {
	return {$: 'Td', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$td = F2(
	function (options, children) {
		return $rundis$elm_bootstrap$Bootstrap$Table$Td(
			{children: children, options: options});
	});
var $rundis$elm_bootstrap$Bootstrap$Table$Row = function (a) {
	return {$: 'Row', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$tr = F2(
	function (options, cells) {
		return $rundis$elm_bootstrap$Bootstrap$Table$Row(
			{cells: cells, options: options});
	});
var $author$project$FightingTool$displayCharacters = function (chars) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, c) {
				var _v0 = function () {
					if (c.$ === 'Enemy') {
						var n = c.a;
						var h = c.b;
						var a = c.d;
						var p = c.e;
						return {armor: a, health: h, name: n, pain: p};
					} else {
						var n = c.a;
						var a = c.b;
						return {armor: a, health: 0, name: n, pain: ''};
					}
				}();
				var name = _v0.name;
				var health = _v0.health;
				var armor = _v0.armor;
				var pain = _v0.pain;
				if (c.$ === 'Enemy') {
					return A2(
						$rundis$elm_bootstrap$Bootstrap$Table$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(i + 1))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(name)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(pain)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(armor))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(health))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('metalButton'),
												$elm$html$Html$Events$onClick(
												$author$project$Model$ShowAttackModal(i))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Angriff')
											]))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Button$button,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Button$danger,
												$rundis$elm_bootstrap$Bootstrap$Button$attrs(
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick(
														$author$project$Model$RemoveEnemy(i))
													]))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Löschen')
											]))
									]))
							]));
				} else {
					return A2(
						$rundis$elm_bootstrap$Bootstrap$Table$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(i + 1))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
										$elm$html$Html$Attributes$colspan(2))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(name)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(armor))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('')
									])),
								A2($rundis$elm_bootstrap$Bootstrap$Table$td, _List_Nil, _List_Nil),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Button$button,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Button$danger,
												$rundis$elm_bootstrap$Bootstrap$Button$attrs(
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick(
														$author$project$Model$RemoveEnemy(i))
													]))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Löschen')
											]))
									]))
							]));
				}
			}),
		$elm$core$Array$toList(chars));
};
var $rundis$elm_bootstrap$Bootstrap$Table$Hover = {$: 'Hover'};
var $rundis$elm_bootstrap$Bootstrap$Table$hover = $rundis$elm_bootstrap$Bootstrap$Table$Hover;
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Light = {$: 'Light'};
var $rundis$elm_bootstrap$Bootstrap$Button$light = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Button$Light));
var $rundis$elm_bootstrap$Bootstrap$Table$RowAttr = function (a) {
	return {$: 'RowAttr', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$rowAttr = function (attr_) {
	return $rundis$elm_bootstrap$Bootstrap$Table$RowAttr(attr_);
};
var $rundis$elm_bootstrap$Bootstrap$Table$THead = function (a) {
	return {$: 'THead', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$thead = F2(
	function (options, rows) {
		return $rundis$elm_bootstrap$Bootstrap$Table$THead(
			{options: options, rows: rows});
	});
var $rundis$elm_bootstrap$Bootstrap$Table$simpleThead = function (cells) {
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Table$thead,
		_List_Nil,
		_List_fromArray(
			[
				A2($rundis$elm_bootstrap$Bootstrap$Table$tr, _List_Nil, cells)
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Table$Inversed = {$: 'Inversed'};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Table$isResponsive = function (option) {
	if (option.$ === 'Responsive') {
		return true;
	} else {
		return false;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$KeyedTBody = function (a) {
	return {$: 'KeyedTBody', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$TBody = function (a) {
	return {$: 'TBody', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$InversedRow = function (a) {
	return {$: 'InversedRow', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$KeyedRow = function (a) {
	return {$: 'KeyedRow', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$InversedCell = function (a) {
	return {$: 'InversedCell', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$Th = function (a) {
	return {$: 'Th', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell = function (cell) {
	var inverseOptions = function (options) {
		return A2(
			$elm$core$List$map,
			function (opt) {
				if (opt.$ === 'RoledCell') {
					var role = opt.a;
					return $rundis$elm_bootstrap$Bootstrap$Table$InversedCell(role);
				} else {
					return opt;
				}
			},
			options);
	};
	if (cell.$ === 'Th') {
		var cellCfg = cell.a;
		return $rundis$elm_bootstrap$Bootstrap$Table$Th(
			_Utils_update(
				cellCfg,
				{
					options: inverseOptions(cellCfg.options)
				}));
	} else {
		var cellCfg = cell.a;
		return $rundis$elm_bootstrap$Bootstrap$Table$Td(
			_Utils_update(
				cellCfg,
				{
					options: inverseOptions(cellCfg.options)
				}));
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow = function (row) {
	var inversedOptions = function (options) {
		return A2(
			$elm$core$List$map,
			function (opt) {
				if (opt.$ === 'RoledRow') {
					var role = opt.a;
					return $rundis$elm_bootstrap$Bootstrap$Table$InversedRow(role);
				} else {
					return opt;
				}
			},
			options);
	};
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		return $rundis$elm_bootstrap$Bootstrap$Table$Row(
			{
				cells: A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell, cells),
				options: inversedOptions(options)
			});
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		return $rundis$elm_bootstrap$Bootstrap$Table$KeyedRow(
			{
				cells: A2(
					$elm$core$List$map,
					function (_v1) {
						var key = _v1.a;
						var cell = _v1.b;
						return _Utils_Tuple2(
							key,
							$rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell(cell));
					},
					cells),
				options: inversedOptions(options)
			});
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTBody = F2(
	function (isTableInversed, tbody_) {
		var _v0 = _Utils_Tuple2(isTableInversed, tbody_);
		if (!_v0.a) {
			return tbody_;
		} else {
			if (_v0.b.$ === 'TBody') {
				var body = _v0.b.a;
				return $rundis$elm_bootstrap$Bootstrap$Table$TBody(
					_Utils_update(
						body,
						{
							rows: A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow, body.rows)
						}));
			} else {
				var keyedBody = _v0.b.a;
				return $rundis$elm_bootstrap$Bootstrap$Table$KeyedTBody(
					_Utils_update(
						keyedBody,
						{
							rows: A2(
								$elm$core$List$map,
								function (_v1) {
									var key = _v1.a;
									var row = _v1.b;
									return _Utils_Tuple2(
										key,
										$rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow(row));
								},
								keyedBody.rows)
						}));
			}
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Table$InversedHead = {$: 'InversedHead'};
var $rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTHead = F2(
	function (isTableInversed, _v0) {
		var thead_ = _v0.a;
		var isHeadInversed = A2(
			$elm$core$List$any,
			function (opt) {
				return _Utils_eq(opt, $rundis$elm_bootstrap$Bootstrap$Table$InversedHead);
			},
			thead_.options);
		return $rundis$elm_bootstrap$Bootstrap$Table$THead(
			(isTableInversed || isHeadInversed) ? _Utils_update(
				thead_,
				{
					rows: A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow, thead_.rows)
				}) : thead_);
	});
var $rundis$elm_bootstrap$Bootstrap$Table$maybeWrapResponsive = F2(
	function (options, table_) {
		var responsiveClass = $elm$html$Html$Attributes$class(
			'table-responsive' + A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					function (v) {
						return '-' + v;
					},
					A2(
						$elm$core$Maybe$andThen,
						$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption,
						A2(
							$elm$core$Maybe$andThen,
							function (opt) {
								if (opt.$ === 'Responsive') {
									var val = opt.a;
									return val;
								} else {
									return $elm$core$Maybe$Nothing;
								}
							},
							$elm$core$List$head(
								A2($elm$core$List$filter, $rundis$elm_bootstrap$Bootstrap$Table$isResponsive, options)))))));
		return A2($elm$core$List$any, $rundis$elm_bootstrap$Bootstrap$Table$isResponsive, options) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[responsiveClass]),
			_List_fromArray(
				[table_])) : table_;
	});
var $elm$html$Html$Attributes$scope = $elm$html$Html$Attributes$stringProperty('scope');
var $rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh = function (cell) {
	if (cell.$ === 'Th') {
		var cellConfig = cell.a;
		return $rundis$elm_bootstrap$Bootstrap$Table$Th(
			_Utils_update(
				cellConfig,
				{
					options: A2(
						$elm$core$List$cons,
						$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
							$elm$html$Html$Attributes$scope('row')),
						cellConfig.options)
				}));
	} else {
		return cell;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell = function (row) {
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		if (!cells.b) {
			return row;
		} else {
			var first = cells.a;
			var rest = cells.b;
			return $rundis$elm_bootstrap$Bootstrap$Table$Row(
				{
					cells: A2(
						$elm$core$List$cons,
						$rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh(first),
						rest),
					options: options
				});
		}
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		if (!cells.b) {
			return row;
		} else {
			var _v3 = cells.a;
			var firstKey = _v3.a;
			var first = _v3.b;
			var rest = cells.b;
			return $rundis$elm_bootstrap$Bootstrap$Table$KeyedRow(
				{
					cells: A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							firstKey,
							$rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh(first)),
						rest),
					options: options
				});
		}
	}
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass = F2(
	function (prefix, role) {
		return $elm$html$Html$Attributes$class(
			prefix + ('-' + function () {
				switch (role.$) {
					case 'Primary':
						return 'primary';
					case 'Secondary':
						return 'secondary';
					case 'Success':
						return 'success';
					case 'Info':
						return 'info';
					case 'Warning':
						return 'warning';
					case 'Danger':
						return 'danger';
					case 'Light':
						return 'light';
					default:
						return 'dark';
				}
			}()));
	});
var $rundis$elm_bootstrap$Bootstrap$Table$cellAttribute = function (option) {
	switch (option.$) {
		case 'RoledCell':
			if (option.a.$ === 'Roled') {
				var role = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'table', role);
			} else {
				var _v1 = option.a;
				return $elm$html$Html$Attributes$class('table-active');
			}
		case 'InversedCell':
			if (option.a.$ === 'Roled') {
				var role = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg-', role);
			} else {
				var _v2 = option.a;
				return $elm$html$Html$Attributes$class('bg-active');
			}
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$cellAttributes = function (options) {
	return A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$cellAttribute, options);
};
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $rundis$elm_bootstrap$Bootstrap$Table$renderCell = function (cell) {
	if (cell.$ === 'Td') {
		var options = cell.a.options;
		var children = cell.a.children;
		return A2(
			$elm$html$Html$td,
			$rundis$elm_bootstrap$Bootstrap$Table$cellAttributes(options),
			children);
	} else {
		var options = cell.a.options;
		var children = cell.a.children;
		return A2(
			$elm$html$Html$th,
			$rundis$elm_bootstrap$Bootstrap$Table$cellAttributes(options),
			children);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$rowClass = function (option) {
	switch (option.$) {
		case 'RoledRow':
			if (option.a.$ === 'Roled') {
				var role_ = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'table', role_);
			} else {
				var _v1 = option.a;
				return $elm$html$Html$Attributes$class('table-active');
			}
		case 'InversedRow':
			if (option.a.$ === 'Roled') {
				var role_ = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role_);
			} else {
				var _v2 = option.a;
				return $elm$html$Html$Attributes$class('bg-active');
			}
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$rowAttributes = function (options) {
	return A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$rowClass, options);
};
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $rundis$elm_bootstrap$Bootstrap$Table$renderRow = function (row) {
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		return A2(
			$elm$html$Html$tr,
			$rundis$elm_bootstrap$Bootstrap$Table$rowAttributes(options),
			A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$renderCell, cells));
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		return A3(
			$elm$html$Html$Keyed$node,
			'tr',
			$rundis$elm_bootstrap$Bootstrap$Table$rowAttributes(options),
			A2(
				$elm$core$List$map,
				function (_v1) {
					var key = _v1.a;
					var cell = _v1.b;
					return _Utils_Tuple2(
						key,
						$rundis$elm_bootstrap$Bootstrap$Table$renderCell(cell));
				},
				cells));
	}
};
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $rundis$elm_bootstrap$Bootstrap$Table$renderTBody = function (body) {
	if (body.$ === 'TBody') {
		var attributes = body.a.attributes;
		var rows = body.a.rows;
		return A2(
			$elm$html$Html$tbody,
			attributes,
			A2(
				$elm$core$List$map,
				function (row) {
					return $rundis$elm_bootstrap$Bootstrap$Table$renderRow(
						$rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell(row));
				},
				rows));
	} else {
		var attributes = body.a.attributes;
		var rows = body.a.rows;
		return A3(
			$elm$html$Html$Keyed$node,
			'tbody',
			attributes,
			A2(
				$elm$core$List$map,
				function (_v1) {
					var key = _v1.a;
					var row = _v1.b;
					return _Utils_Tuple2(
						key,
						$rundis$elm_bootstrap$Bootstrap$Table$renderRow(
							$rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell(row)));
				},
				rows));
	}
};
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $rundis$elm_bootstrap$Bootstrap$Table$theadAttribute = function (option) {
	switch (option.$) {
		case 'InversedHead':
			return $elm$html$Html$Attributes$class('thead-dark');
		case 'DefaultHead':
			return $elm$html$Html$Attributes$class('thead-default');
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$theadAttributes = function (options) {
	return A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$theadAttribute, options);
};
var $rundis$elm_bootstrap$Bootstrap$Table$renderTHead = function (_v0) {
	var options = _v0.a.options;
	var rows = _v0.a.rows;
	return A2(
		$elm$html$Html$thead,
		$rundis$elm_bootstrap$Bootstrap$Table$theadAttributes(options),
		A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$renderRow, rows));
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $rundis$elm_bootstrap$Bootstrap$Table$tableClass = function (option) {
	switch (option.$) {
		case 'Inversed':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-dark'));
		case 'Striped':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-striped'));
		case 'Bordered':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-bordered'));
		case 'Hover':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-hover'));
		case 'Small':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-sm'));
		case 'Responsive':
			return $elm$core$Maybe$Nothing;
		case 'Reflow':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-reflow'));
		default:
			var attr_ = option.a;
			return $elm$core$Maybe$Just(attr_);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$tableAttributes = function (options) {
	return A2(
		$elm$core$List$cons,
		$elm$html$Html$Attributes$class('table'),
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$tableClass, options)));
};
var $rundis$elm_bootstrap$Bootstrap$Table$table = function (rec) {
	var isInversed = A2(
		$elm$core$List$any,
		function (opt) {
			return _Utils_eq(opt, $rundis$elm_bootstrap$Bootstrap$Table$Inversed);
		},
		rec.options);
	var classOptions = A2(
		$elm$core$List$filter,
		function (opt) {
			return !$rundis$elm_bootstrap$Bootstrap$Table$isResponsive(opt);
		},
		rec.options);
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Table$maybeWrapResponsive,
		rec.options,
		A2(
			$elm$html$Html$table,
			$rundis$elm_bootstrap$Bootstrap$Table$tableAttributes(classOptions),
			_List_fromArray(
				[
					$rundis$elm_bootstrap$Bootstrap$Table$renderTHead(
					A2($rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTHead, isInversed, rec.thead)),
					$rundis$elm_bootstrap$Bootstrap$Table$renderTBody(
					A2($rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTBody, isInversed, rec.tbody))
				])));
};
var $rundis$elm_bootstrap$Bootstrap$Table$tbody = F2(
	function (attributes, rows) {
		return $rundis$elm_bootstrap$Bootstrap$Table$TBody(
			{attributes: attributes, rows: rows});
	});
var $rundis$elm_bootstrap$Bootstrap$Table$th = F2(
	function (options, children) {
		return $rundis$elm_bootstrap$Bootstrap$Table$Th(
			{children: children, options: options});
	});
var $author$project$Model$AttackModal = {$: 'AttackModal'};
var $author$project$Model$ChangeDamage = function (a) {
	return {$: 'ChangeDamage', a: a};
};
var $author$project$Model$ChangeTmpDice = function (a) {
	return {$: 'ChangeTmpDice', a: a};
};
var $author$project$Model$DiceAndSlice = function (a) {
	return {$: 'DiceAndSlice', a: a};
};
var $author$project$Model$CharacterDeath = function (a) {
	return {$: 'CharacterDeath', a: a};
};
var $author$project$Model$DoNothing = {$: 'DoNothing'};
var $author$project$Model$UpdateEnemy = F2(
	function (a, b) {
		return {$: 'UpdateEnemy', a: a, b: b};
	});
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$FightingTool$attack = F3(
	function (model, id, damage) {
		var _v0 = A2($elm$core$Array$get, id, model.enemy);
		if (_v0.$ === 'Just') {
			if (_v0.a.$ === 'Enemy') {
				var _v1 = _v0.a;
				var name = _v1.a;
				var health = _v1.b;
				var maxHealth = _v1.c;
				var armor = _v1.d;
				var pain = _v1.e;
				return (_Utils_cmp(damage, armor) > 0) ? ((((health - damage) + armor) <= 0) ? $author$project$Model$CharacterDeath(id) : ((_Utils_cmp(health - damage, 0.25 * maxHealth) < 1) ? A2(
					$author$project$Model$UpdateEnemy,
					id,
					A5($author$project$Model$Enemy, name, (health - damage) + armor, maxHealth, armor, 'Schmerz III')) : ((_Utils_cmp(health - damage, 0.5 * maxHealth) < 1) ? A2(
					$author$project$Model$UpdateEnemy,
					id,
					A5($author$project$Model$Enemy, name, (health - damage) + armor, maxHealth, armor, 'Schmerz II')) : ((_Utils_cmp(health - damage, 0.75 * maxHealth) < 1) ? A2(
					$author$project$Model$UpdateEnemy,
					id,
					A5($author$project$Model$Enemy, name, (health - damage) + armor, maxHealth, armor, 'Schmerz I')) : A2(
					$author$project$Model$UpdateEnemy,
					id,
					A5($author$project$Model$Enemy, name, (health - damage) + armor, maxHealth, armor, pain)))))) : $author$project$Model$CloseModal($author$project$Model$AttackModal);
			} else {
				var _v2 = _v0.a;
				return $author$project$Model$DoNothing;
			}
		} else {
			return $author$project$Model$DoNothing;
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Number = {$: 'Number'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Input = function (a) {
	return {$: 'Input', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Type = function (a) {
	return {$: 'Type', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$create = F2(
	function (tipe, options) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Input$Input(
			{
				options: A2(
					$elm$core$List$cons,
					$rundis$elm_bootstrap$Bootstrap$Form$Input$Type(tipe),
					options)
			});
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size_ = modifier.a;
				return _Utils_update(
					options,
					{
						size: $elm$core$Maybe$Just(size_)
					});
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: $elm$core$Maybe$Just(id_)
					});
			case 'Type':
				var tipe = modifier.a;
				return _Utils_update(
					options,
					{tipe: tipe});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'Value':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						value: $elm$core$Maybe$Just(value_)
					});
			case 'Placeholder':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						placeholder: $elm$core$Maybe$Just(value_)
					});
			case 'OnInput':
				var onInput_ = modifier.a;
				return _Utils_update(
					options,
					{
						onInput: $elm$core$Maybe$Just(onInput_)
					});
			case 'Validation':
				var validation_ = modifier.a;
				return _Utils_update(
					options,
					{
						validation: $elm$core$Maybe$Just(validation_)
					});
			case 'Readonly':
				var val = modifier.a;
				return _Utils_update(
					options,
					{readonly: val});
			case 'PlainText':
				var val = modifier.a;
				return _Utils_update(
					options,
					{plainText: val});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Text = {$: 'Text'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions = {attributes: _List_Nil, disabled: false, id: $elm$core$Maybe$Nothing, onInput: $elm$core$Maybe$Nothing, placeholder: $elm$core$Maybe$Nothing, plainText: false, readonly: false, size: $elm$core$Maybe$Nothing, tipe: $rundis$elm_bootstrap$Bootstrap$Form$Input$Text, validation: $elm$core$Maybe$Nothing, value: $elm$core$Maybe$Nothing};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute = function (size) {
	return A2(
		$elm$core$Maybe$map,
		function (s) {
			return $elm$html$Html$Attributes$class('form-control-' + s);
		},
		$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute = function (inputType) {
	return $elm$html$Html$Attributes$type_(
		function () {
			switch (inputType.$) {
				case 'Text':
					return 'text';
				case 'Password':
					return 'password';
				case 'DatetimeLocal':
					return 'datetime-local';
				case 'Date':
					return 'date';
				case 'Month':
					return 'month';
				case 'Time':
					return 'time';
				case 'Week':
					return 'week';
				case 'Number':
					return 'number';
				case 'Email':
					return 'email';
				case 'Url':
					return 'url';
				case 'Search':
					return 'search';
				case 'Tel':
					return 'tel';
				default:
					return 'color';
			}
		}());
};
var $rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString = function (validation) {
	if (validation.$ === 'Success') {
		return 'is-valid';
	} else {
		return 'is-invalid';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute = function (validation) {
	return $elm$html$Html$Attributes$class(
		$rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation));
};
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				options.plainText ? 'form-control-plaintext' : 'form-control'),
				$elm$html$Html$Attributes$disabled(options.disabled),
				$elm$html$Html$Attributes$readonly(options.readonly || options.plainText),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute(options.tipe)
			]),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$id, options.id),
						A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute, options.size),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$value, options.value),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$placeholder, options.placeholder),
						A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, options.onInput),
						A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute, options.validation)
					])),
			options.attributes));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$view = function (_v0) {
	var options = _v0.a.options;
	return A2(
		$elm$html$Html$input,
		$rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes(options),
		_List_Nil);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$input = F2(
	function (tipe, options) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Input$view(
			A2($rundis$elm_bootstrap$Bootstrap$Form$Input$create, tipe, options));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$number = $rundis$elm_bootstrap$Bootstrap$Form$Input$input($rundis$elm_bootstrap$Bootstrap$Form$Input$Number);
var $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput = function (a) {
	return {$: 'OnInput', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$onInput = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput(toMsg);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Placeholder = function (a) {
	return {$: 'Placeholder', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder = function (value_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Placeholder(value_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$text = $rundis$elm_bootstrap$Bootstrap$Form$Input$input($rundis$elm_bootstrap$Bootstrap$Form$Input$Text);
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Value = function (a) {
	return {$: 'Value', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$value = function (value_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Value(value_);
};
var $author$project$FightingTool$viewAttackModal = function (model) {
	var insideInput = function () {
		var _v0 = model.damage;
		if (!_v0) {
			return $rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Schaden');
		} else {
			return $rundis$elm_bootstrap$Bootstrap$Form$Input$value(
				$elm$core$String$fromInt(model.damage));
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Modal$view,
				model.showAttackModal,
				A3(
					$rundis$elm_bootstrap$Bootstrap$Modal$footer,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('colored-header-footer')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('metalButton'),
									$elm$html$Html$Events$onClick(
									A3($author$project$FightingTool$attack, model, model.characterId, model.damage))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Schaden zufügen')
								]))
						]),
					A3(
						$rundis$elm_bootstrap$Bootstrap$Modal$body,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('body')
							]),
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(model.dice),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('1W6+0'),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$Model$ChangeTmpDice)
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('metalButton'),
										$elm$html$Html$Events$onClick(
										$author$project$Model$DiceAndSlice(model.tmpdice))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Schaden würfeln')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$number(
								_List_fromArray(
									[
										insideInput,
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$Model$ChangeDamage)
									]))
							]),
						A3(
							$rundis$elm_bootstrap$Bootstrap$Modal$header,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colored-header-footer')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Angriff')
										]))
								]),
							A2(
								$rundis$elm_bootstrap$Bootstrap$Modal$hideOnBackdropClick,
								true,
								$rundis$elm_bootstrap$Bootstrap$Modal$config(
									$author$project$Model$CloseModal($author$project$Model$AttackModal)))))))
			]));
};
var $author$project$Model$SwitchEnemyHero = function (a) {
	return {$: 'SwitchEnemyHero', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config = function (a) {
	return {$: 'Config', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapOptions = F2(
	function (mapper, _v0) {
		var conf = _v0.a;
		var options = conf.options;
		return $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config(
			_Utils_update(
				conf,
				{
					options: mapper(options)
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$asGroup = $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapOptions(
	function (opts) {
		return _Utils_update(
			opts,
			{isGroup: true});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$Checked = function (a) {
	return {$: 'Checked', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$checked = function (isCheck) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Radio$Checked(isCheck);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapConfig = F2(
	function (mapper, _v0) {
		var configRec = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config(
			mapper(configRec));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children = function (children_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapConfig(
		function (conf) {
			return _Utils_update(
				conf,
				{children: children_});
		});
};
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config = $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$Config(
	{
		children: _List_Nil,
		legend: $elm$core$Maybe$Nothing,
		options: {attributes: _List_Nil, disabled: false, isGroup: false}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$Radio = function (a) {
	return {$: 'Radio', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$createAdvanced = F2(
	function (options, label_) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Radio$Radio(
			{label: label_, options: options});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$Label = function (a) {
	return {$: 'Label', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$label = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Radio$Label(
			{attributes: attributes, children: children});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$create = F2(
	function (options, label_) {
		return A2(
			$rundis$elm_bootstrap$Bootstrap$Form$Radio$createAdvanced,
			options,
			A2(
				$rundis$elm_bootstrap$Bootstrap$Form$Radio$label,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(label_)
					])));
	});
var $author$project$Model$AddEnemy = function (a) {
	return {$: 'AddEnemy', a: a};
};
var $author$project$Model$UpdateTmp = function (a) {
	return {$: 'UpdateTmp', a: a};
};
var $elm$html$Html$label = _VirtualDom_node('label');
var $rundis$elm_bootstrap$Bootstrap$Form$label = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$label,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('form-control-label'),
				attributes),
			children);
	});
var $author$project$FightingTool$customEnemy = function (model) {
	var _v0 = function () {
		var _v1 = model.tmpEnemy;
		if (_v1.$ === 'Enemy') {
			var n = _v1.a;
			var h = _v1.b;
			var a = _v1.d;
			if (n === 'none') {
				return _Utils_Tuple3(
					$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder(''),
					$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder(''),
					$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder(''));
			} else {
				return _Utils_Tuple3(
					$rundis$elm_bootstrap$Bootstrap$Form$Input$value(n),
					$rundis$elm_bootstrap$Bootstrap$Form$Input$value(
						$elm$core$String$fromInt(h)),
					$rundis$elm_bootstrap$Bootstrap$Form$Input$value(
						$elm$core$String$fromInt(a)));
			}
		} else {
			return _Utils_Tuple3(
				$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder(''),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder(''),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder(''));
		}
	}();
	var ddName = _v0.a;
	var ddHealth = _v0.b;
	var ddArmor = _v0.c;
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$label,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Name:')
					])),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(
						function (n) {
							var _v3 = function () {
								var _v4 = model.tmpEnemy;
								if (_v4.$ === 'Enemy') {
									var h = _v4.b;
									var m = _v4.c;
									var a = _v4.d;
									var p = _v4.e;
									return {armor: a, health: h, maxHealth: m, pain: p};
								} else {
									return {armor: 0, health: 0, maxHealth: 0, pain: ''};
								}
							}();
							var health = _v3.health;
							var maxHealth = _v3.maxHealth;
							var armor = _v3.armor;
							var pain = _v3.pain;
							return $author$project$Model$UpdateTmp(
								A5($author$project$Model$Enemy, n, health, maxHealth, armor, pain));
						}),
						ddName
					])),
				A2($elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$label,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('LeP:')
					])),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$number(
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(
						function (h) {
							var _v5 = function () {
								var _v6 = model.tmpEnemy;
								if (_v6.$ === 'Enemy') {
									var n = _v6.a;
									var a = _v6.d;
									var s = _v6.e;
									return _Utils_Tuple3(n, a, s);
								} else {
									return _Utils_Tuple3('', 0, '');
								}
							}();
							var name = _v5.a;
							var armor = _v5.b;
							var pain = _v5.c;
							return $author$project$Model$UpdateTmp(
								A5(
									$author$project$Model$Enemy,
									name,
									A2(
										$elm$core$Maybe$withDefault,
										1,
										$elm$core$String$toInt(h)),
									A2(
										$elm$core$Maybe$withDefault,
										1,
										$elm$core$String$toInt(h)),
									armor,
									pain));
						}),
						ddHealth
					])),
				A2($elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$label,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('RS:')
					])),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$number(
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(
						function (a) {
							var _v7 = function () {
								var _v8 = model.tmpEnemy;
								if (_v8.$ === 'Enemy') {
									var n = _v8.a;
									var h = _v8.b;
									var m = _v8.c;
									var p = _v8.e;
									return {health: h, maxHealth: m, name: n, pain: p};
								} else {
									return {health: 0, maxHealth: 0, name: '', pain: ''};
								}
							}();
							var name = _v7.name;
							var health = _v7.health;
							var maxHealth = _v7.maxHealth;
							var pain = _v7.pain;
							return $author$project$Model$UpdateTmp(
								A5(
									$author$project$Model$Enemy,
									name,
									health,
									maxHealth,
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toInt(a)),
									pain));
						}),
						ddArmor
					])),
				A2($elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('metalButton'),
						$elm$html$Html$Events$onClick(
						$author$project$Model$AddEnemy(model.tmpEnemy))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Hinzufügen')
					]))
			]));
};
var $author$project$FightingTool$customHero = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$label,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Name')
					])),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(
						function (n) {
							var armor = function () {
								var _v0 = model.tmpHero;
								if (_v0.$ === 'Hero') {
									var a = _v0.b;
									return a;
								} else {
									return 0;
								}
							}();
							return $author$project$Model$UpdateTmp(
								A2($author$project$Model$Hero, n, armor));
						})
					])),
				A2($elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$label,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('RS')
					])),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$number(
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(
						function (a) {
							var name = function () {
								var _v1 = model.tmpHero;
								if (_v1.$ === 'Hero') {
									var n = _v1.a;
									return n;
								} else {
									return '';
								}
							}();
							return $author$project$Model$UpdateTmp(
								A2(
									$author$project$Model$Hero,
									name,
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toInt(a))));
						})
					])),
				A2($elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('metalButton'),
						$elm$html$Html$Events$onClick(
						$author$project$Model$AddEnemy(model.tmpHero))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Hinzufügen')
					]))
			]));
};
var $author$project$Model$LoadEnemy = function (a) {
	return {$: 'LoadEnemy', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$DropdownItem = function (a) {
	return {$: 'DropdownItem', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Dropdown$DropdownItem(
			A2(
				$elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Attributes$class('dropdown-item')
						]),
					attributes),
				children));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$DropToDir = function (a) {
	return {$: 'DropToDir', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$Dropright = {$: 'Dropright'};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropRight = $rundis$elm_bootstrap$Bootstrap$Dropdown$DropToDir($rundis$elm_bootstrap$Bootstrap$Dropdown$Dropright);
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropDir = function (maybeDir) {
	var toAttrs = function (dir) {
		return _List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				'drop' + function () {
					if (dir.$ === 'Dropleft') {
						return 'left';
					} else {
						return 'right';
					}
				}())
			]);
	};
	return A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		A2($elm$core$Maybe$map, toAttrs, maybeDir));
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownAttributes = F2(
	function (status, config) {
		return _Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('btn-group', true),
							_Utils_Tuple2(
							'show',
							!_Utils_eq(status, $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed)),
							_Utils_Tuple2('dropup', config.isDropUp)
						]))
				]),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Dropdown$dropDir(config.dropDirection),
				config.attributes));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $rundis$elm_bootstrap$Bootstrap$Dropdown$menuStyles = F2(
	function (_v0, config) {
		var status = _v0.a.status;
		var toggleSize = _v0.a.toggleSize;
		var menuSize = _v0.a.menuSize;
		var px = function (n) {
			return $elm$core$String$fromFloat(n) + 'px';
		};
		var translate = F3(
			function (x, y, z) {
				return 'translate3d(' + (px(x) + (',' + (px(y) + (',' + (px(z) + ')')))));
			});
		var _default = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0')
			]);
		var _v1 = _Utils_Tuple2(config.isDropUp, config.dropDirection);
		_v1$0:
		while (true) {
			if (_v1.b.$ === 'Just') {
				if (_v1.b.a.$ === 'Dropright') {
					if (_v1.a) {
						break _v1$0;
					} else {
						var _v2 = _v1.b.a;
						return _default;
					}
				} else {
					if (_v1.a) {
						break _v1$0;
					} else {
						var _v3 = _v1.b.a;
						return _Utils_ap(
							_default,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$Attributes$style,
									'transform',
									A3(translate, (-toggleSize.width) - menuSize.width, 0, 0))
								]));
					}
				}
			} else {
				if (_v1.a) {
					break _v1$0;
				} else {
					return _Utils_ap(
						_default,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$Attributes$style,
								'transform',
								A3(translate, -toggleSize.width, toggleSize.height, 0))
							]));
				}
			}
		}
		return _Utils_ap(
			_default,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'transform',
					A3(translate, -toggleSize.width, -menuSize.height, 0))
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownMenu = F3(
	function (state, config, items) {
		var status = state.a.status;
		var menuSize = state.a.menuSize;
		var wrapperStyles = _Utils_eq(status, $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'height', '0'),
				A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
				A2($elm$html$Html$Attributes$style, 'position', 'relative')
			]) : _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative')
			]);
		return A2(
			$elm$html$Html$div,
			wrapperStyles,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('dropdown-menu', true),
										_Utils_Tuple2('dropdown-menu-right', config.hasMenuRight),
										_Utils_Tuple2(
										'show',
										!_Utils_eq(status, $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed))
									]))
							]),
						_Utils_ap(
							A2($rundis$elm_bootstrap$Bootstrap$Dropdown$menuStyles, state, config),
							config.menuAttrs)),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var x = _v0.a;
							return x;
						},
						items))
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$applyModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 'AlignMenuRight':
				return _Utils_update(
					options,
					{hasMenuRight: true});
			case 'Dropup':
				return _Utils_update(
					options,
					{isDropUp: true});
			case 'Attrs':
				var attrs_ = option.a;
				return _Utils_update(
					options,
					{attributes: attrs_});
			case 'DropToDir':
				var dir = option.a;
				return _Utils_update(
					options,
					{
						dropDirection: $elm$core$Maybe$Just(dir)
					});
			default:
				var attrs_ = option.a;
				return _Utils_update(
					options,
					{menuAttrs: attrs_});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$defaultOptions = {attributes: _List_Nil, dropDirection: $elm$core$Maybe$Nothing, hasMenuRight: false, isDropUp: false, menuAttrs: _List_Nil};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$toConfig = function (options) {
	return A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Dropdown$applyModifier, $rundis$elm_bootstrap$Bootstrap$Dropdown$defaultOptions, options);
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$dropdown = F2(
	function (state, _v0) {
		var status = state.a.status;
		var toggleMsg = _v0.toggleMsg;
		var toggleButton = _v0.toggleButton;
		var items = _v0.items;
		var options = _v0.options;
		var config = $rundis$elm_bootstrap$Bootstrap$Dropdown$toConfig(options);
		var _v1 = toggleButton;
		var buttonFn = _v1.a;
		return A2(
			$elm$html$Html$div,
			A2($rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownAttributes, status, config),
			_List_fromArray(
				[
					A2(buttonFn, toggleMsg, state),
					A3($rundis$elm_bootstrap$Bootstrap$Dropdown$dropdownMenu, state, config, items)
				]));
	});
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $rundis$elm_bootstrap$Bootstrap$Dropdown$header = function (children) {
	return $rundis$elm_bootstrap$Bootstrap$Dropdown$DropdownItem(
		A2(
			$elm$html$Html$h6,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dropdown-header')
				]),
			children));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary = {$: 'Primary'};
var $rundis$elm_bootstrap$Bootstrap$Button$primary = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary));
var $rundis$elm_bootstrap$Bootstrap$Dropdown$DropdownToggle = function (a) {
	return {$: 'DropdownToggle', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$Open = {$: 'Open'};
var $rundis$elm_bootstrap$Bootstrap$Dropdown$nextStatus = function (status) {
	switch (status.$) {
		case 'Open':
			return $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed;
		case 'ListenClicks':
			return $rundis$elm_bootstrap$Bootstrap$Dropdown$Closed;
		default:
			return $rundis$elm_bootstrap$Bootstrap$Dropdown$Open;
	}
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetHeight = A2($elm$json$Json$Decode$field, 'offsetHeight', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetWidth = A2($elm$json$Json$Decode$field, 'offsetWidth', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetLeft = A2($elm$json$Json$Decode$field, 'offsetLeft', $elm$json$Json$Decode$float);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetParent = F2(
	function (x, decoder) {
		return $elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$field,
					'offsetParent',
					$elm$json$Json$Decode$null(x)),
					A2($elm$json$Json$Decode$field, 'offsetParent', decoder)
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetTop = A2($elm$json$Json$Decode$field, 'offsetTop', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollLeft = A2($elm$json$Json$Decode$field, 'scrollLeft', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollTop = A2($elm$json$Json$Decode$field, 'scrollTop', $elm$json$Json$Decode$float);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position = F2(
	function (x, y) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (_v0) {
				var x_ = _v0.a;
				var y_ = _v0.b;
				return A2(
					$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetParent,
					_Utils_Tuple2(x_, y_),
					A2($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position, x_, y_));
			},
			A5(
				$elm$json$Json$Decode$map4,
				F4(
					function (scrollLeft_, scrollTop_, offsetLeft_, offsetTop_) {
						return _Utils_Tuple2((x + offsetLeft_) - scrollLeft_, (y + offsetTop_) - scrollTop_);
					}),
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollLeft,
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$scrollTop,
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetLeft,
				$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetTop));
	});
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (_v0, width, height) {
			var x = _v0.a;
			var y = _v0.b;
			return {height: height, left: x, top: y, width: width};
		}),
	A2($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$position, 0, 0),
	$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetWidth,
	$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$offsetHeight);
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$childNode = function (idx) {
	return $elm$json$Json$Decode$at(
		_List_fromArray(
			[
				'childNodes',
				$elm$core$String$fromInt(idx)
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$nextSibling = function (decoder) {
	return A2($elm$json$Json$Decode$field, 'nextSibling', decoder);
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$isToggle = A2(
	$elm$json$Json$Decode$andThen,
	function (_class) {
		return A2($elm$core$String$contains, 'dropdown-toggle', _class) ? $elm$json$Json$Decode$succeed(true) : $elm$json$Json$Decode$succeed(false);
	},
	$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className);
var $rundis$elm_bootstrap$Bootstrap$Dropdown$toggler = F2(
	function (path, decoder) {
		return $elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$andThen,
					function (res) {
						return res ? A2($elm$json$Json$Decode$at, path, decoder) : $elm$json$Json$Decode$fail('');
					},
					A2($elm$json$Json$Decode$at, path, $rundis$elm_bootstrap$Bootstrap$Dropdown$isToggle)),
					A2(
					$elm$json$Json$Decode$andThen,
					function (_v0) {
						return A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$toggler,
							_Utils_ap(
								path,
								_List_fromArray(
									['parentElement'])),
							decoder);
					},
					A2(
						$elm$json$Json$Decode$at,
						_Utils_ap(
							path,
							_List_fromArray(
								['parentElement'])),
						$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$className)),
					$elm$json$Json$Decode$fail('No toggler found')
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$sizeDecoder = A3(
	$elm$json$Json$Decode$map2,
	$elm$core$Tuple$pair,
	A2(
		$rundis$elm_bootstrap$Bootstrap$Dropdown$toggler,
		_List_fromArray(
			['target']),
		$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea),
	A2(
		$rundis$elm_bootstrap$Bootstrap$Dropdown$toggler,
		_List_fromArray(
			['target']),
		$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$nextSibling(
			A2($rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$childNode, 0, $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$boundingArea))));
var $rundis$elm_bootstrap$Bootstrap$Dropdown$clickHandler = F2(
	function (toMsg, state) {
		var status = state.a.status;
		return A2(
			$elm$json$Json$Decode$andThen,
			function (_v0) {
				var b = _v0.a;
				var m = _v0.b;
				return $elm$json$Json$Decode$succeed(
					toMsg(
						$rundis$elm_bootstrap$Bootstrap$Dropdown$State(
							{
								menuSize: m,
								status: $rundis$elm_bootstrap$Bootstrap$Dropdown$nextStatus(status),
								toggleSize: b
							})));
			},
			$rundis$elm_bootstrap$Bootstrap$Dropdown$sizeDecoder);
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$togglePrivate = F4(
	function (buttonOptions, children, toggleMsg, state) {
		return A2(
			$elm$html$Html$button,
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(buttonOptions),
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dropdown-toggle'),
						$elm$html$Html$Attributes$type_('button'),
						A2(
						$elm$html$Html$Events$on,
						'click',
						A2($rundis$elm_bootstrap$Bootstrap$Dropdown$clickHandler, toggleMsg, state))
					])),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Dropdown$toggle = F2(
	function (buttonOptions, children) {
		return $rundis$elm_bootstrap$Bootstrap$Dropdown$DropdownToggle(
			A2($rundis$elm_bootstrap$Bootstrap$Dropdown$togglePrivate, buttonOptions, children));
	});
var $author$project$FightingTool$dropdownMenu = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Dropdown$dropdown,
				model.myDrop1State,
				{
					items: _List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Dropdown$header(
							_List_fromArray(
								[
									$elm$html$Html$text('Kulturschaffender')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('goblin'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Goblin')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('oger'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Oger')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('ork'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Ork')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('troll'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Troll')
								])),
							$rundis$elm_bootstrap$Bootstrap$Dropdown$header(
							_List_fromArray(
								[
									$elm$html$Html$text('Tier')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('höhlenspinne'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Höhlensspinne')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('gruftassel'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Gruftassel')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('grimwolf'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Grimwolf')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('schwarzbär'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Schwarzbär')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('wildschwein'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Wildschwein')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('wolfsratte'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Wolfsratte')
								])),
							$rundis$elm_bootstrap$Bootstrap$Dropdown$header(
							_List_fromArray(
								[
									$elm$html$Html$text('übernatürliches Wesen')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('krakenmolch'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Krakenmolch')
								])),
							$rundis$elm_bootstrap$Bootstrap$Dropdown$header(
							_List_fromArray(
								[
									$elm$html$Html$text('Drache')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('tatzelwurm'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Tatzelwurm')
								])),
							$rundis$elm_bootstrap$Bootstrap$Dropdown$header(
							_List_fromArray(
								[
									$elm$html$Html$text('Pflanze')
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Dropdown$buttonItem,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$LoadEnemy('waldschrat'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Waldschrat')
								]))
						]),
					options: _List_fromArray(
						[$rundis$elm_bootstrap$Bootstrap$Dropdown$dropRight]),
					toggleButton: A2(
						$rundis$elm_bootstrap$Bootstrap$Dropdown$toggle,
						_List_fromArray(
							[$rundis$elm_bootstrap$Bootstrap$Button$primary]),
						_List_fromArray(
							[
								$elm$html$Html$text('Gegner')
							])),
					toggleMsg: $author$project$Model$MyDrop1Msg
				})
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$Id = function (a) {
	return {$: 'Id', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$id = function (theId) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Radio$Id(theId);
};
var $elm$html$Html$legend = _VirtualDom_node('legend');
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$legend = F2(
	function (attributes, children_) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$mapConfig(
			function (conf) {
				return _Utils_update(
					conf,
					{
						legend: $elm$core$Maybe$Just(
							A2($elm$html$Html$legend, attributes, children_))
					});
			});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$OnClick = function (a) {
	return {$: 'OnClick', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$onClick = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Radio$OnClick(toMsg);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$addOption = F2(
	function (opt, _v0) {
		var radio_ = _v0.a;
		var options = radio_.options;
		return $rundis$elm_bootstrap$Bootstrap$Form$Radio$Radio(
			_Utils_update(
				radio_,
				{
					options: A2($elm$core$List$cons, opt, options)
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$Name = function (a) {
	return {$: 'Name', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$name = function (name_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Radio$Name(name_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Id':
				var val = modifier.a;
				return _Utils_update(
					options,
					{
						id: $elm$core$Maybe$Just(val)
					});
			case 'Checked':
				var val = modifier.a;
				return _Utils_update(
					options,
					{checked: val});
			case 'Name':
				var val = modifier.a;
				return _Utils_update(
					options,
					{
						name: $elm$core$Maybe$Just(val)
					});
			case 'Inline':
				return _Utils_update(
					options,
					{inline: true});
			case 'OnClick':
				var toMsg = modifier.a;
				return _Utils_update(
					options,
					{
						onClick: $elm$core$Maybe$Just(toMsg)
					});
			case 'Custom':
				return _Utils_update(
					options,
					{custom: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'Validation':
				var validation = modifier.a;
				return _Utils_update(
					options,
					{
						validation: $elm$core$Maybe$Just(validation)
					});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$defaultOptions = {attributes: _List_Nil, checked: false, custom: false, disabled: false, id: $elm$core$Maybe$Nothing, inline: false, name: $elm$core$Maybe$Nothing, onClick: $elm$core$Maybe$Nothing, validation: $elm$core$Maybe$Nothing};
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$toAttributes = function (options) {
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('form-check-input', !options.custom),
						_Utils_Tuple2('custom-control-input', options.custom)
					])),
				$elm$html$Html$Attributes$type_('radio'),
				$elm$html$Html$Attributes$disabled(options.disabled),
				$elm$html$Html$Attributes$checked(options.checked)
			]),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, options.onClick),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$name, options.name),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$id, options.id)
					])),
			options.attributes));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$view = function (_v0) {
	var radio_ = _v0.a;
	var opts = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$Radio$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$Radio$defaultOptions, radio_.options);
	var _v1 = radio_.label;
	var label_ = _v1.a;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('form-check', !opts.custom),
						_Utils_Tuple2('form-check-inline', (!opts.custom) && opts.inline),
						_Utils_Tuple2('custom-control', opts.custom),
						_Utils_Tuple2('custom-radio', opts.custom),
						_Utils_Tuple2('custom-control-inline', opts.inline && opts.custom)
					]))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				$rundis$elm_bootstrap$Bootstrap$Form$Radio$toAttributes(opts),
				_List_Nil),
				A2(
				$elm$html$Html$label,
				_Utils_ap(
					label_.attributes,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('form-check-label', !opts.custom),
										_Utils_Tuple2('custom-control-label', opts.custom)
									]))
							]),
						function () {
							var _v2 = opts.id;
							if (_v2.$ === 'Just') {
								var v = _v2.a;
								return _List_fromArray(
									[
										$elm$html$Html$Attributes$for(v)
									]);
							} else {
								return _List_Nil;
							}
						}())),
				label_.children)
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$radioList = F2(
	function (groupName, radios) {
		return A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeL,
				$rundis$elm_bootstrap$Bootstrap$Form$Radio$view,
				$rundis$elm_bootstrap$Bootstrap$Form$Radio$addOption(
					$rundis$elm_bootstrap$Bootstrap$Form$Radio$name(groupName))),
			radios);
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var $rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view = function (_v0) {
	var rec = _v0.a;
	var options = rec.options;
	return A2(
		$elm$html$Html$fieldset,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('form-group', options.isGroup)
						])),
					$elm$html$Html$Attributes$disabled(options.disabled)
				]),
			options.attributes),
		function (xs) {
			return A2($elm$core$List$append, xs, rec.children);
		}(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					function (e) {
						return _List_fromArray(
							[e]);
					},
					rec.legend))));
};
var $author$project$FightingTool$viewCustomEnemyModal = function (model) {
	var herobool = function () {
		var _v1 = model.enemyHero;
		if (_v1 === 'Hero') {
			return true;
		} else {
			return false;
		}
	}();
	var enemybool = function () {
		var _v0 = model.enemyHero;
		if (_v0 === 'Enemy') {
			return true;
		} else {
			return false;
		}
	}();
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Modal$view,
		model.showCustomEnemy,
		A3(
			$rundis$elm_bootstrap$Bootstrap$Modal$footer,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('colored-header-footer')
				]),
			_List_Nil,
			A3(
				$rundis$elm_bootstrap$Bootstrap$Modal$body,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('body')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$FightingTool$dropdownMenu(model),
								A2($elm$html$Html$br, _List_Nil, _List_Nil),
								$rundis$elm_bootstrap$Bootstrap$Form$Fieldset$view(
								A2(
									$rundis$elm_bootstrap$Bootstrap$Form$Fieldset$children,
									A2(
										$rundis$elm_bootstrap$Bootstrap$Form$Radio$radioList,
										'EnemyHero',
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Form$Radio$create,
												_List_fromArray(
													[
														$rundis$elm_bootstrap$Bootstrap$Form$Radio$id('enemy'),
														$rundis$elm_bootstrap$Bootstrap$Form$Radio$onClick(
														$author$project$Model$SwitchEnemyHero('Enemy')),
														$rundis$elm_bootstrap$Bootstrap$Form$Radio$checked(enemybool)
													]),
												'Gegner'),
												A2(
												$rundis$elm_bootstrap$Bootstrap$Form$Radio$create,
												_List_fromArray(
													[
														$rundis$elm_bootstrap$Bootstrap$Form$Radio$id('hero'),
														$rundis$elm_bootstrap$Bootstrap$Form$Radio$onClick(
														$author$project$Model$SwitchEnemyHero('Hero')),
														$rundis$elm_bootstrap$Bootstrap$Form$Radio$checked(herobool)
													]),
												'Held')
											])),
									A3(
										$rundis$elm_bootstrap$Bootstrap$Form$Fieldset$legend,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Benutzerdefiniert: ')
											]),
										$rundis$elm_bootstrap$Bootstrap$Form$Fieldset$asGroup($rundis$elm_bootstrap$Bootstrap$Form$Fieldset$config)))),
								(model.enemyHero === 'Hero') ? $author$project$FightingTool$customHero(model) : ((model.enemyHero === 'Enemy') ? $author$project$FightingTool$customEnemy(model) : A2($elm$html$Html$p, _List_Nil, _List_Nil))
							]))
					]),
				A3(
					$rundis$elm_bootstrap$Bootstrap$Modal$header,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('colored-header-footer')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Charakter hinzufügen')
								]))
						]),
					A2(
						$rundis$elm_bootstrap$Bootstrap$Modal$hideOnBackdropClick,
						true,
						$rundis$elm_bootstrap$Bootstrap$Modal$config(
							$author$project$Model$CloseModal($author$project$Model$CustomEnemy)))))));
};
var $author$project$FightingTool$body = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Table$table(
						{
							options: _List_fromArray(
								[$rundis$elm_bootstrap$Bootstrap$Table$hover]),
							tbody: A2(
								$rundis$elm_bootstrap$Bootstrap$Table$tbody,
								_List_Nil,
								_Utils_ap(
									$author$project$FightingTool$displayCharacters(model.enemy),
									_List_fromArray(
										[
											A2(
											$rundis$elm_bootstrap$Bootstrap$Table$tr,
											_List_fromArray(
												[
													$rundis$elm_bootstrap$Bootstrap$Table$rowAttr(
													$elm$html$Html$Attributes$class('tr'))
												]),
											_List_fromArray(
												[
													A2(
													$rundis$elm_bootstrap$Bootstrap$Table$td,
													_List_fromArray(
														[
															$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
															$elm$html$Html$Attributes$colspan(10))
														]),
													_List_fromArray(
														[
															A2(
															$rundis$elm_bootstrap$Bootstrap$Button$button,
															_List_fromArray(
																[
																	$rundis$elm_bootstrap$Bootstrap$Button$light,
																	$rundis$elm_bootstrap$Bootstrap$Button$block,
																	$rundis$elm_bootstrap$Bootstrap$Button$attrs(
																	_List_fromArray(
																		[
																			$elm$html$Html$Events$onClick(
																			$author$project$Model$ShowModal($author$project$Model$CustomEnemy))
																		]))
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('+')
																]))
														]))
												]))
										]))),
							thead: $rundis$elm_bootstrap$Bootstrap$Table$simpleThead(
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$th,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$class('th'))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('ID')
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$th,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$colspan(2)),
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$class('th'))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Name')
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$th,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$class('th'))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('RS')
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$th,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$class('th'))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('LeP')
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$th,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$class('th'))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(' ')
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$th,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$class('th'))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(' ')
											]))
									]))
						})
					])),
				$author$project$FightingTool$viewCustomEnemyModal(model),
				$author$project$FightingTool$deathAlert(model),
				$author$project$FightingTool$viewAttackModal(model)
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Tab$Config = function (a) {
	return {$: 'Config', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Tab$config = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Tab$Config(
		{attributes: _List_Nil, isPill: false, items: _List_Nil, layout: $elm$core$Maybe$Nothing, toMsg: toMsg, useHash: false, withAnimation: false});
};
var $author$project$Model$ClearCharacterList = {$: 'ClearCharacterList'};
var $rundis$elm_bootstrap$Bootstrap$Grid$Column = function (a) {
	return {$: 'Column', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Grid$col = F2(
	function (options, children) {
		return $rundis$elm_bootstrap$Bootstrap$Grid$Column(
			{children: children, options: options});
	});
var $rundis$elm_bootstrap$Bootstrap$Table$Bordered = {$: 'Bordered'};
var $rundis$elm_bootstrap$Bootstrap$Table$bordered = $rundis$elm_bootstrap$Bootstrap$Table$Bordered;
var $author$project$Model$AddCharacterIcon = function (a) {
	return {$: 'AddCharacterIcon', a: a};
};
var $author$project$Model$MouseDraw = function (a) {
	return {$: 'MouseDraw', a: a};
};
var $author$project$DungeonMap$stopBubbling = function (msg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		A2(
			$elm$json$Json$Decode$map,
			function (m) {
				return _Utils_Tuple2(m, true);
			},
			$elm$json$Json$Decode$succeed(msg)));
};
var $author$project$DungeonMap$characters2rows = function (chars) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, c) {
				if (c.$ === 'Enemy') {
					var name = c.a;
					var health = c.b;
					return A2(
						$rundis$elm_bootstrap$Bootstrap$Table$tr,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Table$rowAttr(
								$author$project$DungeonMap$stopBubbling(
									$author$project$Model$AddCharacterIcon(
										$author$project$Model$MouseDraw(
											A3($author$project$Model$MonsterIcon, i + 1, '-100', '-100')))))
							]),
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(i + 1))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(name)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(health))
									]))
							]));
				} else {
					var name = c.a;
					var health = c.b;
					return A2(
						$rundis$elm_bootstrap$Bootstrap$Table$tr,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Table$rowAttr(
								$author$project$DungeonMap$stopBubbling(
									$author$project$Model$AddCharacterIcon(
										$author$project$Model$MouseDraw(
											A3($author$project$Model$PlayerIcon, i + 1, '-100', '-100')))))
							]),
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(i + 1))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(name)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(health))
									]))
							]));
				}
			}),
		$elm$core$Array$toList(chars));
};
var $rundis$elm_bootstrap$Bootstrap$Table$Responsive = function (a) {
	return {$: 'Responsive', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$responsive = $rundis$elm_bootstrap$Bootstrap$Table$Responsive($elm$core$Maybe$Nothing);
var $rundis$elm_bootstrap$Bootstrap$Table$Striped = {$: 'Striped'};
var $rundis$elm_bootstrap$Bootstrap$Table$striped = $rundis$elm_bootstrap$Bootstrap$Table$Striped;
var $author$project$DungeonMap$dungeonMap_MonsterList = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				$rundis$elm_bootstrap$Bootstrap$Table$table(
				{
					options: _List_fromArray(
						[$rundis$elm_bootstrap$Bootstrap$Table$striped, $rundis$elm_bootstrap$Bootstrap$Table$hover, $rundis$elm_bootstrap$Bootstrap$Table$bordered, $rundis$elm_bootstrap$Bootstrap$Table$responsive]),
					tbody: A2(
						$rundis$elm_bootstrap$Bootstrap$Table$tbody,
						_List_Nil,
						$author$project$DungeonMap$characters2rows(model.enemy)),
					thead: $rundis$elm_bootstrap$Bootstrap$Table$simpleThead(
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('ID')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Name')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('LeP')
									]))
							]))
				})
			]));
};
var $author$project$Model$DragEnter = {$: 'DragEnter'};
var $author$project$Model$DragLeave = {$: 'DragLeave'};
var $author$project$Model$ObjectIconModal = {$: 'ObjectIconModal'};
var $author$project$Model$Pick = {$: 'Pick'};
var $elm$file$File$decoder = _File_decoder;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$oneOrMoreHelp = F2(
	function (toValue, xs) {
		if (!xs.b) {
			return $elm$json$Json$Decode$fail('a ARRAY with at least ONE element');
		} else {
			var y = xs.a;
			var ys = xs.b;
			return $elm$json$Json$Decode$succeed(
				A2(toValue, y, ys));
		}
	});
var $elm$json$Json$Decode$oneOrMore = F2(
	function (toValue, decoder) {
		return A2(
			$elm$json$Json$Decode$andThen,
			$elm$json$Json$Decode$oneOrMoreHelp(toValue),
			$elm$json$Json$Decode$list(decoder));
	});
var $author$project$DungeonMap$dropDecoder = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['dataTransfer', 'files']),
	A2($elm$json$Json$Decode$oneOrMore, $author$project$Model$GotFiles, $elm$file$File$decoder));
var $elm$html$Html$figure = _VirtualDom_node('figure');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $author$project$DungeonMap$hijack = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$DungeonMap$hijackOn = F2(
	function (event, decoder) {
		return A2(
			$elm$html$Html$Events$preventDefaultOn,
			event,
			A2($elm$json$Json$Decode$map, $author$project$DungeonMap$hijack, decoder));
	});
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$image = $elm$svg$Svg$trustedNode('image');
var $author$project$Model$MouseClick = function (a) {
	return {$: 'MouseClick', a: a};
};
var $elm$svg$Svg$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Model$MousePosition = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var $author$project$DungeonMap$mousePosition = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Model$MousePosition,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['detail', 'x']),
		$elm$json$Json$Decode$float),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['detail', 'y']),
		$elm$json$Json$Decode$float));
var $elm$svg$Svg$Events$on = $elm$html$Html$Events$on;
var $author$project$DungeonMap$onMouseMove = function (mapMousePositionToMsg) {
	return A2(
		$elm$svg$Svg$Events$on,
		'mousemoveWithCoordinates',
		A2($elm$json$Json$Decode$map, mapMousePositionToMsg, $author$project$DungeonMap$mousePosition));
};
var $author$project$DungeonMap$positionToCircleCenter = F2(
	function (i, position) {
		return $author$project$Model$AddCharacterIcon(
			$author$project$Model$MouseDraw(
				A3(
					$author$project$Model$PlayerIcon,
					i,
					$elm$core$String$fromFloat(position.x),
					$elm$core$String$fromFloat(position.y))));
	});
var $author$project$DungeonMap$positionToIconCenter = F2(
	function (i, position) {
		return $author$project$Model$AddCharacterIcon(
			$author$project$Model$MouseDraw(
				A5(
					$author$project$Model$ObjectIcon,
					i,
					$elm$core$String$fromFloat(position.x),
					$elm$core$String$fromFloat(position.y),
					'',
					$elm$core$Maybe$Nothing)));
	});
var $author$project$DungeonMap$positionToRectangleCorner = F2(
	function (i, position) {
		return $author$project$Model$AddCharacterIcon(
			$author$project$Model$MouseDraw(
				A3(
					$author$project$Model$MonsterIcon,
					i,
					$elm$core$String$fromFloat(position.x),
					$elm$core$String$fromFloat(position.y))));
	});
var $author$project$DungeonMap$mouseDrawEvents = function (addCharacterIcon) {
	if (addCharacterIcon.$ === 'DrawIcon') {
		var characterIcon = addCharacterIcon.a;
		switch (characterIcon.$) {
			case 'PlayerIcon':
				var i = characterIcon.a;
				var x = characterIcon.b;
				var y = characterIcon.c;
				return _List_fromArray(
					[
						$elm$svg$Svg$Events$onClick(
						$author$project$Model$AddCharacterIcon(
							$author$project$Model$MouseClick(characterIcon))),
						$author$project$DungeonMap$onMouseMove(
						$author$project$DungeonMap$positionToCircleCenter(i))
					]);
			case 'MonsterIcon':
				var i = characterIcon.a;
				var x = characterIcon.b;
				var y = characterIcon.c;
				return _List_fromArray(
					[
						$elm$svg$Svg$Events$onClick(
						$author$project$Model$AddCharacterIcon(
							$author$project$Model$MouseClick(characterIcon))),
						$author$project$DungeonMap$onMouseMove(
						$author$project$DungeonMap$positionToRectangleCorner(i))
					]);
			default:
				var i = characterIcon.a;
				var x = characterIcon.b;
				var y = characterIcon.c;
				var t = characterIcon.d;
				var c = characterIcon.e;
				return _List_fromArray(
					[
						$elm$svg$Svg$Events$onClick(
						$author$project$Model$ShowModal($author$project$Model$ObjectIconModal)),
						$author$project$DungeonMap$onMouseMove(
						$author$project$DungeonMap$positionToIconCenter(i))
					]);
		}
	} else {
		return _List_fromArray(
			[
				$author$project$DungeonMap$onMouseMove(
				$author$project$DungeonMap$positionToIconCenter(0))
			]);
	}
};
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$Basics$round = _Basics_round;
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $author$project$DungeonMap$buildCustomObjectIconStyle = function (color) {
	return 'stroke:black;stroke-width:4;fill:' + $avh4$elm_color$Color$toCssString(
		A2($elm$core$Maybe$withDefault, $avh4$elm_color$Color$black, color));
};
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $author$project$DungeonMap$getIconPath = function (id) {
	switch (id) {
		case 1:
			return 'res/icons/chest.png';
		case 2:
			return 'res/icons/key.png';
		case 3:
			return 'custom';
		default:
			return '';
	}
};
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$title = _VirtualDom_attribute('title');
var $elm$core$String$toFloat = _String_toFloat;
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$DungeonMap$placeIcon = F5(
	function (iconType, id, x, y, color) {
		switch (iconType) {
			case 'monster':
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$image,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$width('30'),
								$elm$svg$Svg$Attributes$height('30'),
								$elm$svg$Svg$Attributes$x(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(x)) - 17.5)),
								$elm$svg$Svg$Attributes$y(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(y)) - 17.5)),
								$elm$svg$Svg$Attributes$title('MonsterIcon'),
								$elm$svg$Svg$Attributes$xlinkHref('res/icons/enemy.png')
							]),
						_List_Nil),
						A2(
						$elm$svg$Svg$text_,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$textAnchor('middle'),
								$elm$svg$Svg$Attributes$x(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(x)) - 3)),
								$elm$svg$Svg$Attributes$y(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(y)) - 0.5)),
								$elm$svg$Svg$Attributes$dominantBaseline('middle')
							]),
						_List_fromArray(
							[
								$elm$svg$Svg$text(
								$elm$core$String$fromInt(id))
							]))
					]);
			case 'player':
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$image,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$width('25'),
								$elm$svg$Svg$Attributes$height('25'),
								$elm$svg$Svg$Attributes$x(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(x)) - 11.5)),
								$elm$svg$Svg$Attributes$y(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(y)) - 11.5)),
								$elm$svg$Svg$Attributes$title('ObjectIcon'),
								$elm$svg$Svg$Attributes$xlinkHref('res/icons/hero.png')
							]),
						_List_Nil),
						A2(
						$elm$svg$Svg$text_,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$textAnchor('middle'),
								$elm$svg$Svg$Attributes$x(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(x)) + 1)),
								$elm$svg$Svg$Attributes$y(
								$elm$core$String$fromFloat(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(y)) + 2.5)),
								$elm$svg$Svg$Attributes$dominantBaseline('middle')
							]),
						_List_fromArray(
							[
								$elm$svg$Svg$text(
								$elm$core$String$fromInt(id))
							]))
					]);
			case 'object':
				var _v1 = $author$project$DungeonMap$getIconPath(id);
				if (_v1 === 'custom') {
					return _List_fromArray(
						[
							A2(
							$elm$svg$Svg$circle,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id(
									$elm$core$String$fromInt(id)),
									$elm$svg$Svg$Attributes$cx(x),
									$elm$svg$Svg$Attributes$cy(y),
									$elm$svg$Svg$Attributes$r('10'),
									$elm$svg$Svg$Attributes$style(
									$author$project$DungeonMap$buildCustomObjectIconStyle(color))
								]),
							_List_Nil)
						]);
				} else {
					return _List_fromArray(
						[
							A2(
							$elm$svg$Svg$image,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('25'),
									$elm$svg$Svg$Attributes$height('25'),
									$elm$svg$Svg$Attributes$x(
									$elm$core$String$fromFloat(
										A2(
											$elm$core$Maybe$withDefault,
											0,
											$elm$core$String$toFloat(x)) - 11.5)),
									$elm$svg$Svg$Attributes$y(
									$elm$core$String$fromFloat(
										A2(
											$elm$core$Maybe$withDefault,
											0,
											$elm$core$String$toFloat(y)) - 11.5)),
									$elm$svg$Svg$Attributes$title('ObjectIcon'),
									$elm$svg$Svg$Attributes$xlinkHref(
									$author$project$DungeonMap$getIconPath(id))
								]),
							_List_Nil)
						]);
				}
			default:
				return _List_Nil;
		}
	});
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $author$project$DungeonMap$newIconsView = function (addCharacterIcon) {
	if (addCharacterIcon.$ === 'DrawIcon') {
		var characterIcon = addCharacterIcon.a;
		switch (characterIcon.$) {
			case 'ObjectIcon':
				var i = characterIcon.a;
				var x = characterIcon.b;
				var y = characterIcon.c;
				var t = characterIcon.d;
				var c = characterIcon.e;
				return _List_Nil;
			case 'PlayerIcon':
				var i = characterIcon.a;
				var x = characterIcon.b;
				var y = characterIcon.c;
				return _Utils_ap(
					A5($author$project$DungeonMap$placeIcon, 'player', i, x, y, $elm$core$Maybe$Nothing),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$rect,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('800'),
									$elm$svg$Svg$Attributes$height('600'),
									$elm$svg$Svg$Attributes$x('0'),
									$elm$svg$Svg$Attributes$y('0'),
									$elm$svg$Svg$Attributes$style('fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9')
								]),
							_List_Nil)
						]));
			default:
				var i = characterIcon.a;
				var x = characterIcon.b;
				var y = characterIcon.c;
				return _Utils_ap(
					A5($author$project$DungeonMap$placeIcon, 'monster', i, x, y, $elm$core$Maybe$Nothing),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$rect,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('800'),
									$elm$svg$Svg$Attributes$height('600'),
									$elm$svg$Svg$Attributes$x('0'),
									$elm$svg$Svg$Attributes$y('0'),
									$elm$svg$Svg$Attributes$style('fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9')
								]),
							_List_Nil)
						]));
		}
	} else {
		return _List_Nil;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Button$onClick = function (message) {
	return $rundis$elm_bootstrap$Bootstrap$Button$attrs(
		_List_fromArray(
			[
				A2(
				$elm$html$Html$Events$preventDefaultOn,
				'click',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2(message, true)))
			]));
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $author$project$DungeonMap$getColor = function (object) {
	switch (object.$) {
		case 'MonsterIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return $elm$core$Maybe$Nothing;
		case 'PlayerIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return $elm$core$Maybe$Nothing;
		default:
			var i = object.a;
			var x = object.b;
			var y = object.c;
			var t = object.d;
			var c = object.e;
			return c;
	}
};
var $author$project$DungeonMap$getCoord = function (object) {
	switch (object.$) {
		case 'MonsterIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return x + (',' + y);
		case 'PlayerIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return x + (',' + y);
		default:
			var i = object.a;
			var x = object.b;
			var y = object.c;
			var t = object.d;
			var c = object.e;
			return x + (',' + y);
	}
};
var $author$project$DungeonMap$getID = function (object) {
	switch (object.$) {
		case 'MonsterIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return i;
		case 'PlayerIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return i;
		default:
			var i = object.a;
			var x = object.b;
			var y = object.c;
			var t = object.d;
			var c = object.e;
			return i;
	}
};
var $author$project$DungeonMap$getIconType = function (object) {
	switch (object.$) {
		case 'MonsterIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return 'monster';
		case 'PlayerIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return 'player';
		default:
			var i = object.a;
			var x = object.b;
			var y = object.c;
			var t = object.d;
			var c = object.e;
			return 'object';
	}
};
var $author$project$DungeonMap$getObjectText = function (object) {
	switch (object.$) {
		case 'MonsterIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return '';
		case 'PlayerIcon':
			var i = object.a;
			var x = object.b;
			var y = object.c;
			return '';
		default:
			var i = object.a;
			var x = object.b;
			var y = object.c;
			var t = object.d;
			var c = object.e;
			return t;
	}
};
var $author$project$DungeonMap$getAreaParam = function (s) {
	var yCor = A2(
		$elm$core$Maybe$withDefault,
		'0',
		$elm$core$List$head(
			A2(
				$elm$core$List$drop,
				1,
				A2(
					$elm$core$String$split,
					',',
					$author$project$DungeonMap$getCoord(s)))));
	var xCor = A2(
		$elm$core$Maybe$withDefault,
		'0',
		$elm$core$List$head(
			A2(
				$elm$core$String$split,
				',',
				$author$project$DungeonMap$getCoord(s))));
	var objectText = $author$project$DungeonMap$getObjectText(s);
	var id = $author$project$DungeonMap$getID(s);
	var color = $author$project$DungeonMap$getColor(s);
	return A5(
		$author$project$DungeonMap$placeIcon,
		$author$project$DungeonMap$getIconType(s),
		id,
		xCor,
		yCor,
		color);
};
var $author$project$DungeonMap$svgIconList = function (model) {
	return A3(
		$elm$core$List$foldl,
		$elm$core$Basics$append,
		_List_Nil,
		A2(
			$elm$core$List$map,
			$author$project$DungeonMap$getAreaParam,
			_Utils_ap(model.characterList, model.objectIconList)));
};
var $elm$svg$Svg$Attributes$version = _VirtualDom_attribute('version');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$DungeonMap$dungeonMap_Svg = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container'),
				A2(
				$elm$html$Html$Attributes$style,
				'border',
				model.hover ? '6px dashed purple' : '6px dashed #ccc'),
				A2(
				$author$project$DungeonMap$hijackOn,
				'dragenter',
				$elm$json$Json$Decode$succeed($author$project$Model$DragEnter)),
				A2(
				$author$project$DungeonMap$hijackOn,
				'dragover',
				$elm$json$Json$Decode$succeed($author$project$Model$DragEnter)),
				A2(
				$author$project$DungeonMap$hijackOn,
				'dragleave',
				$elm$json$Json$Decode$succeed($author$project$Model$DragLeave)),
				A2($author$project$DungeonMap$hijackOn, 'drop', $author$project$DungeonMap$dropDecoder)
			]),
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Button$button,
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Button$onClick($author$project$Model$Pick)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Upload Map')
					])),
				A2(
				$elm$html$Html$figure,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('image')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$svg,
						_Utils_ap(
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('100%'),
									$elm$svg$Svg$Attributes$viewBox('0 0 800 600'),
									$elm$svg$Svg$Attributes$version('1.1')
								]),
							_Utils_ap(
								$author$project$DungeonMap$mouseDrawEvents(model.addCharacterIcon),
								_Utils_eq(model.addCharacterIcon, $author$project$Model$DrawingInactive) ? _List_fromArray(
									[
										$elm$svg$Svg$Events$onClick(
										$author$project$Model$ShowModal($author$project$Model$ObjectIconModal))
									]) : _List_Nil)),
						_Utils_ap(
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$image,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$width('800'),
											$elm$svg$Svg$Attributes$height('600'),
											$elm$svg$Svg$Attributes$title('DungeonMap'),
											$elm$svg$Svg$Attributes$xlinkHref(
											A2(
												$elm$core$Maybe$withDefault,
												'',
												$elm$core$List$head(model.previews)))
										]),
									_List_Nil)
								]),
							_Utils_ap(
								$author$project$DungeonMap$svgIconList(model),
								$author$project$DungeonMap$newIconsView(model.addCharacterIcon))))
					]))
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Info = {$: 'Info'};
var $rundis$elm_bootstrap$Bootstrap$Button$info = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Button$Info));
var $author$project$Model$ChangeIcon = function (a) {
	return {$: 'ChangeIcon', a: a};
};
var $author$project$Model$ChangeIconText = function (a) {
	return {$: 'ChangeIconText', a: a};
};
var $author$project$Model$ColorPickerMsg = function (a) {
	return {$: 'ColorPickerMsg', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$Custom = {$: 'Custom'};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$createCustom = function (options) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Radio$create(
		A2($elm$core$List$cons, $rundis$elm_bootstrap$Bootstrap$Form$Radio$Custom, options));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled = function (a) {
	return {$: 'Disabled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$disabled = function (disabled_) {
	return $rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled(disabled_);
};
var $author$project$DungeonMap$getCharIcon = function (state) {
	if (state.$ === 'DrawIcon') {
		var charIcon = state.a;
		return charIcon;
	} else {
		return A5($author$project$Model$ObjectIcon, 0, '', '', '', $elm$core$Maybe$Nothing);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$Inline = {$: 'Inline'};
var $rundis$elm_bootstrap$Bootstrap$Form$Radio$inline = $rundis$elm_bootstrap$Bootstrap$Form$Radio$Inline;
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Success = {$: 'Success'};
var $rundis$elm_bootstrap$Bootstrap$Button$success = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Button$Success));
var $simonh1000$elm_colorpicker$ColorPicker$markerAttrs = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
		A2($elm$html$Html$Attributes$style, 'top', '1px'),
		A2($elm$html$Html$Attributes$style, 'bottom', '1px'),
		A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
		A2($elm$html$Html$Attributes$style, 'background-color', '#ffffff'),
		A2($elm$html$Html$Attributes$style, 'width', '6px'),
		A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
	]);
var $simonh1000$elm_colorpicker$ColorPicker$alphaMarker = function (alpha) {
	var correction = 4;
	var xVal = $elm$core$String$fromInt(
		$elm$core$Basics$round((alpha * $simonh1000$elm_colorpicker$ColorPicker$widgetWidth) - correction));
	return A2(
		$elm$html$Html$div,
		A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'left', xVal + 'px'),
			$simonh1000$elm_colorpicker$ColorPicker$markerAttrs),
		_List_Nil);
};
var $simonh1000$elm_colorpicker$ColorPicker$NoOp = {$: 'NoOp'};
var $simonh1000$elm_colorpicker$ColorPicker$bubblePreventer = A2(
	$elm$html$Html$Events$stopPropagationOn,
	'click',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2($simonh1000$elm_colorpicker$ColorPicker$NoOp, true)));
var $simonh1000$elm_colorpicker$ColorPicker$checkedBkgStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background-size', '12px 12px'),
		A2($elm$html$Html$Attributes$style, 'background-position', '0 0, 0 6px, 6px -6px, -6px 0px'),
		A2($elm$html$Html$Attributes$style, 'background-image', 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)')
	]);
var $avh4$elm_color$Color$hsl = F3(
	function (h, s, l) {
		return A4($avh4$elm_color$Color$hsla, h, s, l, 1.0);
	});
var $simonh1000$elm_colorpicker$ColorPicker$hueMarker = function (lastHue) {
	var correction = 4;
	var xVal = $elm$core$String$fromInt(
		$elm$core$Basics$round((lastHue * $simonh1000$elm_colorpicker$ColorPicker$widgetWidth) - correction));
	return A2(
		$elm$html$Html$div,
		A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'left', xVal + 'px'),
			$simonh1000$elm_colorpicker$ColorPicker$markerAttrs),
		_List_Nil);
};
var $simonh1000$elm_colorpicker$ColorPicker$HueSlider = {$: 'HueSlider'};
var $simonh1000$elm_colorpicker$ColorPicker$OnMouseMove = F2(
	function (a, b) {
		return {$: 'OnMouseMove', a: a, b: b};
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$linearGradient = $elm$svg$Svg$trustedNode('linearGradient');
var $elm$svg$Svg$Attributes$offset = _VirtualDom_attribute('offset');
var $elm$svg$Svg$Attributes$display = _VirtualDom_attribute('display');
var $simonh1000$elm_colorpicker$ColorPicker$sliderStyles = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$width(
		$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
		$elm$svg$Svg$Attributes$height('100%'),
		$elm$svg$Svg$Attributes$display('block')
	]);
var $elm$svg$Svg$stop = $elm$svg$Svg$trustedNode('stop');
var $elm$svg$Svg$Attributes$stopColor = _VirtualDom_attribute('stop-color');
var $elm$svg$Svg$Attributes$stopOpacity = _VirtualDom_attribute('stop-opacity');
var $simonh1000$elm_colorpicker$ColorPicker$OnClick = F2(
	function (a, b) {
		return {$: 'OnClick', a: a, b: b};
	});
var $simonh1000$elm_colorpicker$ColorPicker$OnMouseDown = F2(
	function (a, b) {
		return {$: 'OnMouseDown', a: a, b: b};
	});
var $simonh1000$elm_colorpicker$ColorPicker$OnMouseUp = {$: 'OnMouseUp'};
var $simonh1000$elm_colorpicker$ColorPicker$MouseInfo = F3(
	function (x, y, mousePressed) {
		return {mousePressed: mousePressed, x: x, y: y};
	});
var $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo = A4(
	$elm$json$Json$Decode$map3,
	$simonh1000$elm_colorpicker$ColorPicker$MouseInfo,
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$neq(0),
		A2($elm$json$Json$Decode$field, 'buttons', $elm$json$Json$Decode$int)));
var $simonh1000$elm_colorpicker$ColorPicker$onClickSvg = function (msgCreator) {
	return A2(
		$elm$svg$Svg$Events$on,
		'click',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $simonh1000$elm_colorpicker$ColorPicker$onMouseDownSvg = function (msgCreator) {
	return A2(
		$elm$svg$Svg$Events$on,
		'mousedown',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $simonh1000$elm_colorpicker$ColorPicker$onMouseMoveSvg = function (msgCreator) {
	return A2(
		$elm$svg$Svg$Events$on,
		'mousemove',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $elm$svg$Svg$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $simonh1000$elm_colorpicker$ColorPicker$svgDragAttrs = F3(
	function (currMouseTgt, thisTgt, onMoveMsg) {
		var common = _List_fromArray(
			[
				$simonh1000$elm_colorpicker$ColorPicker$onMouseDownSvg(
				$simonh1000$elm_colorpicker$ColorPicker$OnMouseDown(thisTgt)),
				$elm$svg$Svg$Events$onMouseUp($simonh1000$elm_colorpicker$ColorPicker$OnMouseUp),
				$simonh1000$elm_colorpicker$ColorPicker$onClickSvg(
				$simonh1000$elm_colorpicker$ColorPicker$OnClick(thisTgt))
			]);
		return _Utils_eq(currMouseTgt, thisTgt) ? A2(
			$elm$core$List$cons,
			$simonh1000$elm_colorpicker$ColorPicker$onMouseMoveSvg(onMoveMsg),
			common) : common;
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $simonh1000$elm_colorpicker$ColorPicker$huePalette = function (mouseTarget) {
	var stops = _List_fromArray(
		[
			_Utils_Tuple2('0%', '#FF0000'),
			_Utils_Tuple2('17%', '#FF00FF'),
			_Utils_Tuple2('33%', '#0000FF'),
			_Utils_Tuple2('50%', '#00FFFF'),
			_Utils_Tuple2('66%', '#00FF00'),
			_Utils_Tuple2('83%', '#FFFF00'),
			_Utils_Tuple2('100%', '#FF0000')
		]);
	var mkStop = function (_v0) {
		var os = _v0.a;
		var sc = _v0.b;
		return A2(
			$elm$svg$Svg$stop,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$offset(os),
					$elm$svg$Svg$Attributes$stopColor(sc),
					$elm$svg$Svg$Attributes$stopOpacity('1')
				]),
			_List_Nil);
	};
	return A2(
		$elm$svg$Svg$svg,
		A2(
			$elm$core$List$cons,
			$elm$svg$Svg$Attributes$class('hue-picker'),
			$simonh1000$elm_colorpicker$ColorPicker$sliderStyles),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$defs,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$linearGradient,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$id('gradient-hsv'),
								$elm$svg$Svg$Attributes$x1('100%'),
								$elm$svg$Svg$Attributes$y1('0%'),
								$elm$svg$Svg$Attributes$x2('0%'),
								$elm$svg$Svg$Attributes$y2('0%')
							]),
						A2($elm$core$List$map, mkStop, stops))
					])),
				A2(
				$elm$svg$Svg$rect,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x('0'),
							$elm$svg$Svg$Attributes$y('0'),
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
							$elm$svg$Svg$Attributes$height('100%'),
							$elm$svg$Svg$Attributes$fill('url(#gradient-hsv)')
						]),
					A3(
						$simonh1000$elm_colorpicker$ColorPicker$svgDragAttrs,
						mouseTarget,
						$simonh1000$elm_colorpicker$ColorPicker$HueSlider,
						$simonh1000$elm_colorpicker$ColorPicker$OnMouseMove($simonh1000$elm_colorpicker$ColorPicker$HueSlider))),
				_List_Nil)
			]));
};
var $simonh1000$elm_colorpicker$ColorPicker$OpacitySlider = function (a) {
	return {$: 'OpacitySlider', a: a};
};
var $simonh1000$elm_colorpicker$ColorPicker$onClickHtml = function (msgCreator) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		A2($elm$json$Json$Decode$map, msgCreator, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo));
};
var $elm$html$Html$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $simonh1000$elm_colorpicker$ColorPicker$htmlDragAttrs = F3(
	function (currMouseTgt, thisTgt, onMoveMsg) {
		var common = _List_fromArray(
			[
				A2(
				$elm$html$Html$Events$on,
				'mousedown',
				A2(
					$elm$json$Json$Decode$map,
					$simonh1000$elm_colorpicker$ColorPicker$OnMouseDown(thisTgt),
					$simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo)),
				$elm$html$Html$Events$onMouseUp($simonh1000$elm_colorpicker$ColorPicker$OnMouseUp),
				$simonh1000$elm_colorpicker$ColorPicker$onClickHtml(
				$simonh1000$elm_colorpicker$ColorPicker$OnClick(thisTgt))
			]);
		return _Utils_eq(currMouseTgt, thisTgt) ? A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$Events$on,
				'mousemove',
				A2($elm$json$Json$Decode$map, onMoveMsg, $simonh1000$elm_colorpicker$ColorPicker$decodeMouseInfo)),
			common) : common;
	});
var $simonh1000$elm_colorpicker$ColorPicker$opacityPalette = F2(
	function (hsla, model) {
		var mouseTarget = $simonh1000$elm_colorpicker$ColorPicker$OpacitySlider(hsla.hue);
		var mkCol = function (op) {
			return $avh4$elm_color$Color$toCssString(
				A4($avh4$elm_color$Color$hsla, hsla.hue, hsla.saturation, hsla.lightness, op));
		};
		var grad = 'linear-gradient(0.25turn, ' + (mkCol(0) + (', ' + (mkCol(1) + ')')));
		var overlay = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', grad),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'width', '100%')
			]);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				overlay,
				A3(
					$simonh1000$elm_colorpicker$ColorPicker$htmlDragAttrs,
					model.mouseTarget,
					mouseTarget,
					$simonh1000$elm_colorpicker$ColorPicker$OnMouseMove(mouseTarget))),
			_List_Nil);
	});
var $simonh1000$elm_colorpicker$ColorPicker$pickerIndicator = function (col) {
	var adjustment = 4;
	var _v0 = $avh4$elm_color$Color$toHsla(col);
	var saturation = _v0.saturation;
	var lightness = _v0.lightness;
	var borderColor = (lightness > 0.95) ? '#cccccc' : '#ffffff';
	var cy_ = $elm$core$String$fromInt(
		$elm$core$Basics$round(($simonh1000$elm_colorpicker$ColorPicker$widgetHeight - (lightness * $simonh1000$elm_colorpicker$ColorPicker$widgetHeight)) - adjustment));
	var cx_ = $elm$core$String$fromInt(
		$elm$core$Basics$round((saturation * $simonh1000$elm_colorpicker$ColorPicker$widgetWidth) - adjustment));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2($elm$html$Html$Attributes$style, 'top', cy_ + 'px'),
				A2($elm$html$Html$Attributes$style, 'left', cx_ + 'px'),
				A2($elm$html$Html$Attributes$style, 'border-radius', '100%'),
				A2($elm$html$Html$Attributes$style, 'border', '2px solid ' + borderColor),
				A2($elm$html$Html$Attributes$style, 'width', '6px'),
				A2($elm$html$Html$Attributes$style, 'height', '6px'),
				A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
			]),
		_List_Nil);
};
var $simonh1000$elm_colorpicker$ColorPicker$pickerStyles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'cursor', 'crosshair'),
		A2($elm$html$Html$Attributes$style, 'position', 'relative')
	]);
var $simonh1000$elm_colorpicker$ColorPicker$SatLight = function (a) {
	return {$: 'SatLight', a: a};
};
var $simonh1000$elm_colorpicker$ColorPicker$satLightPalette = F3(
	function (hue, colCss, mouseTarget) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
					$elm$svg$Svg$Attributes$class('main-picker'),
					$elm$svg$Svg$Attributes$display('block')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$defs,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$linearGradient,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('pickerSaturation')
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0'),
											$elm$svg$Svg$Attributes$stopColor('#808080'),
											$elm$svg$Svg$Attributes$stopOpacity('1')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('1'),
											$elm$svg$Svg$Attributes$stopColor('#808080'),
											$elm$svg$Svg$Attributes$stopOpacity('0')
										]),
									_List_Nil)
								])),
							A2(
							$elm$svg$Svg$linearGradient,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id('pickerBrightness'),
									$elm$svg$Svg$Attributes$x1('0'),
									$elm$svg$Svg$Attributes$y1('0'),
									$elm$svg$Svg$Attributes$x2('0'),
									$elm$svg$Svg$Attributes$y2('1')
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0'),
											$elm$svg$Svg$Attributes$stopColor('#fff'),
											$elm$svg$Svg$Attributes$stopOpacity('1')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0.499'),
											$elm$svg$Svg$Attributes$stopColor('#fff'),
											$elm$svg$Svg$Attributes$stopOpacity('0')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('0.5'),
											$elm$svg$Svg$Attributes$stopColor('#000'),
											$elm$svg$Svg$Attributes$stopOpacity('0')
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$stop,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$offset('1'),
											$elm$svg$Svg$Attributes$stopColor('#000'),
											$elm$svg$Svg$Attributes$stopOpacity('1')
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
							$elm$svg$Svg$Attributes$fill(colCss),
							$elm$svg$Svg$Attributes$id('picker')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
							$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
							$elm$svg$Svg$Attributes$fill('url(#pickerSaturation)')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$rect,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$width(
								$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth)),
								$elm$svg$Svg$Attributes$height(
								$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetHeight)),
								$elm$svg$Svg$Attributes$fill('url(#pickerBrightness)')
							]),
						A3(
							$simonh1000$elm_colorpicker$ColorPicker$svgDragAttrs,
							mouseTarget,
							$simonh1000$elm_colorpicker$ColorPicker$SatLight(hue),
							$simonh1000$elm_colorpicker$ColorPicker$OnMouseMove(
								$simonh1000$elm_colorpicker$ColorPicker$SatLight(hue)))),
					_List_Nil)
				]));
	});
var $simonh1000$elm_colorpicker$ColorPicker$sliderContainerStyles = function (name) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$Attributes$style,
			'width',
			$elm$core$String$fromInt($simonh1000$elm_colorpicker$ColorPicker$widgetWidth) + 'px'),
			A2($elm$html$Html$Attributes$style, 'height', '12px'),
			A2($elm$html$Html$Attributes$style, 'marginTop', '8px'),
			$elm$html$Html$Attributes$class('color-picker-slider ' + name)
		]);
};
var $simonh1000$elm_colorpicker$ColorPicker$view = F2(
	function (col, _v0) {
		var model = _v0.a;
		var hsla = $avh4$elm_color$Color$toHsla(col);
		var hue = A2($elm$core$Maybe$withDefault, hsla.hue, model.hue);
		var colCss = $avh4$elm_color$Color$toCssString(
			A3($avh4$elm_color$Color$hsl, hue, 1, 0.5));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background-color', 'white'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px'),
					A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '5px'),
					A2($elm$html$Html$Attributes$style, 'box-shadow', 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px'),
					$elm$html$Html$Attributes$class('color-picker-container'),
					$simonh1000$elm_colorpicker$ColorPicker$bubblePreventer
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					$simonh1000$elm_colorpicker$ColorPicker$pickerStyles,
					_List_fromArray(
						[
							A3($simonh1000$elm_colorpicker$ColorPicker$satLightPalette, hue, colCss, model.mouseTarget),
							$simonh1000$elm_colorpicker$ColorPicker$pickerIndicator(col)
						])),
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						$simonh1000$elm_colorpicker$ColorPicker$pickerStyles,
						$simonh1000$elm_colorpicker$ColorPicker$sliderContainerStyles('hue')),
					_List_fromArray(
						[
							$simonh1000$elm_colorpicker$ColorPicker$huePalette(model.mouseTarget),
							$simonh1000$elm_colorpicker$ColorPicker$hueMarker(hue)
						])),
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						$simonh1000$elm_colorpicker$ColorPicker$checkedBkgStyles,
						_Utils_ap(
							$simonh1000$elm_colorpicker$ColorPicker$pickerStyles,
							$simonh1000$elm_colorpicker$ColorPicker$sliderContainerStyles('opacity'))),
					_List_fromArray(
						[
							A2($simonh1000$elm_colorpicker$ColorPicker$opacityPalette, hsla, model),
							$simonh1000$elm_colorpicker$ColorPicker$alphaMarker(hsla.alpha)
						]))
				]));
	});
var $author$project$DungeonMap$newObjectIconModal = function (model) {
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Modal$view,
		model.showObjectIconModal,
		A3(
			$rundis$elm_bootstrap$Bootstrap$Modal$footer,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$attrs(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Model$AddCharacterIcon(
										$author$project$Model$MouseClick(
											$author$project$DungeonMap$getCharIcon(model.addCharacterIcon))))
								])),
							$rundis$elm_bootstrap$Bootstrap$Button$success,
							$rundis$elm_bootstrap$Bootstrap$Button$disabled(!model.radioCheckedID)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Icon hinzufügen')
						]))
				]),
			A3(
				$rundis$elm_bootstrap$Bootstrap$Modal$body,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								A2(
									$rundis$elm_bootstrap$Bootstrap$Form$Radio$radioList,
									'customradiogroup',
									_List_fromArray(
										[
											A2(
											$rundis$elm_bootstrap$Bootstrap$Form$Radio$createCustom,
											_List_fromArray(
												[
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$id('rdi1'),
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$inline,
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$onClick(
													$author$project$Model$ChangeIcon(1)),
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$checked(1 === model.radioCheckedID)
												]),
											'Kiste'),
											A2(
											$rundis$elm_bootstrap$Bootstrap$Form$Radio$createCustom,
											_List_fromArray(
												[
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$id('rdi2'),
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$inline,
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$onClick(
													$author$project$Model$ChangeIcon(2)),
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$checked(2 === model.radioCheckedID)
												]),
											'Schlüssel'),
											A2(
											$rundis$elm_bootstrap$Bootstrap$Form$Radio$createCustom,
											_List_fromArray(
												[
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$id('rdi3'),
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$inline,
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$onClick(
													$author$project$Model$ChangeIcon(3)),
													$rundis$elm_bootstrap$Bootstrap$Form$Radio$checked(3 === model.radioCheckedID)
												]),
											'Benutzerdefiniert')
										]))),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_Utils_ap(
									_List_fromArray(
										[
											A2($elm$html$Html$br, _List_Nil, _List_Nil),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
											_List_fromArray(
												[
													$rundis$elm_bootstrap$Bootstrap$Form$Input$value(model.iconText),
													$rundis$elm_bootstrap$Bootstrap$Form$Input$placeholder('Beschreibung'),
													$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$Model$ChangeIconText)
												]))
										]),
									function () {
										var _v0 = model.radioCheckedID;
										if (_v0 === 3) {
											return _List_fromArray(
												[
													A2($elm$html$Html$br, _List_Nil, _List_Nil),
													A2(
													$elm$html$Html$map,
													$author$project$Model$ColorPickerMsg,
													A2($simonh1000$elm_colorpicker$ColorPicker$view, model.colour, model.colorPicker))
												]);
										} else {
											return _List_Nil;
										}
									}()))
							]))
					]),
				A3(
					$rundis$elm_bootstrap$Bootstrap$Modal$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Neues Icon')
						]),
					A2(
						$rundis$elm_bootstrap$Bootstrap$Modal$hideOnBackdropClick,
						true,
						$rundis$elm_bootstrap$Bootstrap$Modal$config(
							$author$project$Model$CloseModal($author$project$Model$ObjectIconModal)))))));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$Col = {$: 'Col'};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$Width = F2(
	function (screenSize, columnCount) {
		return {columnCount: columnCount, screenSize: screenSize};
	});
var $rundis$elm_bootstrap$Bootstrap$General$Internal$XS = {$: 'XS'};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColAlign = F2(
	function (align_, options) {
		var _v0 = align_.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						alignXs: $elm$core$Maybe$Just(align_)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						alignSm: $elm$core$Maybe$Just(align_)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						alignMd: $elm$core$Maybe$Just(align_)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						alignLg: $elm$core$Maybe$Just(align_)
					});
			default:
				return _Utils_update(
					options,
					{
						alignXl: $elm$core$Maybe$Just(align_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOffset = F2(
	function (offset_, options) {
		var _v0 = offset_.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						offsetXs: $elm$core$Maybe$Just(offset_)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						offsetSm: $elm$core$Maybe$Just(offset_)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						offsetMd: $elm$core$Maybe$Just(offset_)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						offsetLg: $elm$core$Maybe$Just(offset_)
					});
			default:
				return _Utils_update(
					options,
					{
						offsetXl: $elm$core$Maybe$Just(offset_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOrder = F2(
	function (order_, options) {
		var _v0 = order_.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						orderXs: $elm$core$Maybe$Just(order_)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						orderSm: $elm$core$Maybe$Just(order_)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						orderMd: $elm$core$Maybe$Just(order_)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						orderLg: $elm$core$Maybe$Just(order_)
					});
			default:
				return _Utils_update(
					options,
					{
						orderXl: $elm$core$Maybe$Just(order_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPull = F2(
	function (pull_, options) {
		var _v0 = pull_.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						pullXs: $elm$core$Maybe$Just(pull_)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						pullSm: $elm$core$Maybe$Just(pull_)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						pullMd: $elm$core$Maybe$Just(pull_)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						pullLg: $elm$core$Maybe$Just(pull_)
					});
			default:
				return _Utils_update(
					options,
					{
						pullXl: $elm$core$Maybe$Just(pull_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPush = F2(
	function (push_, options) {
		var _v0 = push_.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						pushXs: $elm$core$Maybe$Just(push_)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						pushSm: $elm$core$Maybe$Just(push_)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						pushMd: $elm$core$Maybe$Just(push_)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						pushLg: $elm$core$Maybe$Just(push_)
					});
			default:
				return _Utils_update(
					options,
					{
						pushXl: $elm$core$Maybe$Just(push_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColWidth = F2(
	function (width_, options) {
		var _v0 = width_.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						widthXs: $elm$core$Maybe$Just(width_)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						widthSm: $elm$core$Maybe$Just(width_)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						widthMd: $elm$core$Maybe$Just(width_)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						widthLg: $elm$core$Maybe$Just(width_)
					});
			default:
				return _Utils_update(
					options,
					{
						widthXl: $elm$core$Maybe$Just(width_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOption = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'ColAttrs':
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
			case 'ColWidth':
				var width_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColWidth, width_, options);
			case 'ColOffset':
				var offset_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOffset, offset_, options);
			case 'ColPull':
				var pull_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPull, pull_, options);
			case 'ColPush':
				var push_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPush, push_, options);
			case 'ColOrder':
				var order_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOrder, order_, options);
			case 'ColAlign':
				var align = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColAlign, align, options);
			default:
				var align = modifier.a;
				return _Utils_update(
					options,
					{
						textAlign: $elm$core$Maybe$Just(align)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$columnCountOption = function (size) {
	switch (size.$) {
		case 'Col':
			return $elm$core$Maybe$Nothing;
		case 'Col1':
			return $elm$core$Maybe$Just('1');
		case 'Col2':
			return $elm$core$Maybe$Just('2');
		case 'Col3':
			return $elm$core$Maybe$Just('3');
		case 'Col4':
			return $elm$core$Maybe$Just('4');
		case 'Col5':
			return $elm$core$Maybe$Just('5');
		case 'Col6':
			return $elm$core$Maybe$Just('6');
		case 'Col7':
			return $elm$core$Maybe$Just('7');
		case 'Col8':
			return $elm$core$Maybe$Just('8');
		case 'Col9':
			return $elm$core$Maybe$Just('9');
		case 'Col10':
			return $elm$core$Maybe$Just('10');
		case 'Col11':
			return $elm$core$Maybe$Just('11');
		case 'Col12':
			return $elm$core$Maybe$Just('12');
		default:
			return $elm$core$Maybe$Just('auto');
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthClass = function (_v0) {
	var screenSize = _v0.screenSize;
	var columnCount = _v0.columnCount;
	return $elm$html$Html$Attributes$class(
		'col' + (A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (v) {
					return '-' + v;
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize))) + A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (v) {
					return '-' + v;
				},
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$columnCountOption(columnCount)))));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthsToAttributes = function (widths) {
	var width_ = function (w) {
		return A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthClass, w);
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, width_, widths));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultColOptions = {alignLg: $elm$core$Maybe$Nothing, alignMd: $elm$core$Maybe$Nothing, alignSm: $elm$core$Maybe$Nothing, alignXl: $elm$core$Maybe$Nothing, alignXs: $elm$core$Maybe$Nothing, attributes: _List_Nil, offsetLg: $elm$core$Maybe$Nothing, offsetMd: $elm$core$Maybe$Nothing, offsetSm: $elm$core$Maybe$Nothing, offsetXl: $elm$core$Maybe$Nothing, offsetXs: $elm$core$Maybe$Nothing, orderLg: $elm$core$Maybe$Nothing, orderMd: $elm$core$Maybe$Nothing, orderSm: $elm$core$Maybe$Nothing, orderXl: $elm$core$Maybe$Nothing, orderXs: $elm$core$Maybe$Nothing, pullLg: $elm$core$Maybe$Nothing, pullMd: $elm$core$Maybe$Nothing, pullSm: $elm$core$Maybe$Nothing, pullXl: $elm$core$Maybe$Nothing, pullXs: $elm$core$Maybe$Nothing, pushLg: $elm$core$Maybe$Nothing, pushMd: $elm$core$Maybe$Nothing, pushSm: $elm$core$Maybe$Nothing, pushXl: $elm$core$Maybe$Nothing, pushXs: $elm$core$Maybe$Nothing, textAlign: $elm$core$Maybe$Nothing, widthLg: $elm$core$Maybe$Nothing, widthMd: $elm$core$Maybe$Nothing, widthSm: $elm$core$Maybe$Nothing, widthXl: $elm$core$Maybe$Nothing, widthXs: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetCountOption = function (size) {
	switch (size.$) {
		case 'Offset0':
			return '0';
		case 'Offset1':
			return '1';
		case 'Offset2':
			return '2';
		case 'Offset3':
			return '3';
		case 'Offset4':
			return '4';
		case 'Offset5':
			return '5';
		case 'Offset6':
			return '6';
		case 'Offset7':
			return '7';
		case 'Offset8':
			return '8';
		case 'Offset9':
			return '9';
		case 'Offset10':
			return '10';
		default:
			return '11';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString = function (screenSize) {
	var _v0 = $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize);
	if (_v0.$ === 'Just') {
		var s = _v0.a;
		return '-' + (s + '-');
	} else {
		return '-';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetClass = function (_v0) {
	var screenSize = _v0.screenSize;
	var offsetCount = _v0.offsetCount;
	return $elm$html$Html$Attributes$class(
		'offset' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetCountOption(offsetCount)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetsToAttributes = function (offsets) {
	var offset_ = function (m) {
		return A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetClass, m);
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, offset_, offsets));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderColOption = function (size) {
	switch (size.$) {
		case 'OrderFirst':
			return 'first';
		case 'Order1':
			return '1';
		case 'Order2':
			return '2';
		case 'Order3':
			return '3';
		case 'Order4':
			return '4';
		case 'Order5':
			return '5';
		case 'Order6':
			return '6';
		case 'Order7':
			return '7';
		case 'Order8':
			return '8';
		case 'Order9':
			return '9';
		case 'Order10':
			return '10';
		case 'Order11':
			return '11';
		case 'Order12':
			return '12';
		default:
			return 'last';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderToAttributes = function (orders) {
	var order_ = function (m) {
		if (m.$ === 'Just') {
			var screenSize = m.a.screenSize;
			var moveCount = m.a.moveCount;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class(
					'order' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderColOption(moveCount))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, order_, orders));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$moveCountOption = function (size) {
	switch (size.$) {
		case 'Move0':
			return '0';
		case 'Move1':
			return '1';
		case 'Move2':
			return '2';
		case 'Move3':
			return '3';
		case 'Move4':
			return '4';
		case 'Move5':
			return '5';
		case 'Move6':
			return '6';
		case 'Move7':
			return '7';
		case 'Move8':
			return '8';
		case 'Move9':
			return '9';
		case 'Move10':
			return '10';
		case 'Move11':
			return '11';
		default:
			return '12';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$pullsToAttributes = function (pulls) {
	var pull_ = function (m) {
		if (m.$ === 'Just') {
			var screenSize = m.a.screenSize;
			var moveCount = m.a.moveCount;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class(
					'pull' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$moveCountOption(moveCount))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, pull_, pulls));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$pushesToAttributes = function (pushes) {
	var push_ = function (m) {
		if (m.$ === 'Just') {
			var screenSize = m.a.screenSize;
			var moveCount = m.a.moveCount;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class(
					'push' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$moveCountOption(moveCount))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, push_, pushes));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption = function (dir) {
	switch (dir.$) {
		case 'Center':
			return 'center';
		case 'Left':
			return 'left';
		default:
			return 'right';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass = function (_v0) {
	var dir = _v0.dir;
	var size = _v0.size;
	return $elm$html$Html$Attributes$class(
		'text' + (A2(
			$elm$core$Maybe$withDefault,
			'-',
			A2(
				$elm$core$Maybe$map,
				function (s) {
					return '-' + (s + '-');
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size))) + $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption(dir)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$verticalAlignOption = function (align) {
	switch (align.$) {
		case 'Top':
			return 'start';
		case 'Middle':
			return 'center';
		default:
			return 'end';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignClass = F2(
	function (prefix, _v0) {
		var align = _v0.align;
		var screenSize = _v0.screenSize;
		return $elm$html$Html$Attributes$class(
			_Utils_ap(
				prefix,
				_Utils_ap(
					A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function (v) {
								return v + '-';
							},
							$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize))),
					$rundis$elm_bootstrap$Bootstrap$Grid$Internal$verticalAlignOption(align))));
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignsToAttributes = F2(
	function (prefix, aligns) {
		var align = function (a) {
			return A2(
				$elm$core$Maybe$map,
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignClass(prefix),
				a);
		};
		return A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A2($elm$core$List$map, align, aligns));
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOption, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultColOptions, modifiers);
	var shouldAddDefaultXs = !$elm$core$List$length(
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[options.widthXs, options.widthSm, options.widthMd, options.widthLg, options.widthXl])));
	return _Utils_ap(
		$rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthsToAttributes(
			_List_fromArray(
				[
					shouldAddDefaultXs ? $elm$core$Maybe$Just(
					A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$Width, $rundis$elm_bootstrap$Bootstrap$General$Internal$XS, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$Col)) : options.widthXs,
					options.widthSm,
					options.widthMd,
					options.widthLg,
					options.widthXl
				])),
		_Utils_ap(
			$rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetsToAttributes(
				_List_fromArray(
					[options.offsetXs, options.offsetSm, options.offsetMd, options.offsetLg, options.offsetXl])),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$pullsToAttributes(
					_List_fromArray(
						[options.pullXs, options.pullSm, options.pullMd, options.pullLg, options.pullXl])),
				_Utils_ap(
					$rundis$elm_bootstrap$Bootstrap$Grid$Internal$pushesToAttributes(
						_List_fromArray(
							[options.pushXs, options.pushSm, options.pushMd, options.pushLg, options.pushXl])),
					_Utils_ap(
						$rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderToAttributes(
							_List_fromArray(
								[options.orderXs, options.orderSm, options.orderMd, options.orderLg, options.orderXl])),
						_Utils_ap(
							A2(
								$rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignsToAttributes,
								'align-self-',
								_List_fromArray(
									[options.alignXs, options.alignSm, options.alignMd, options.alignLg, options.alignXl])),
							_Utils_ap(
								function () {
									var _v0 = options.textAlign;
									if (_v0.$ === 'Just') {
										var a = _v0.a;
										return _List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(a)
											]);
									} else {
										return _List_Nil;
									}
								}(),
								options.attributes)))))));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$renderCol = function (column) {
	switch (column.$) {
		case 'Column':
			var options = column.a.options;
			var children = column.a.children;
			return A2(
				$elm$html$Html$div,
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$colAttributes(options),
				children);
		case 'ColBreak':
			var e = column.a;
			return e;
		default:
			var options = column.a.options;
			var children = column.a.children;
			return A3(
				$elm$html$Html$Keyed$node,
				'div',
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$colAttributes(options),
				children);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowHAlign = F2(
	function (align, options) {
		var _v0 = align.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						hAlignXs: $elm$core$Maybe$Just(align)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						hAlignSm: $elm$core$Maybe$Just(align)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						hAlignMd: $elm$core$Maybe$Just(align)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						hAlignLg: $elm$core$Maybe$Just(align)
					});
			default:
				return _Utils_update(
					options,
					{
						hAlignXl: $elm$core$Maybe$Just(align)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowVAlign = F2(
	function (align_, options) {
		var _v0 = align_.screenSize;
		switch (_v0.$) {
			case 'XS':
				return _Utils_update(
					options,
					{
						vAlignXs: $elm$core$Maybe$Just(align_)
					});
			case 'SM':
				return _Utils_update(
					options,
					{
						vAlignSm: $elm$core$Maybe$Just(align_)
					});
			case 'MD':
				return _Utils_update(
					options,
					{
						vAlignMd: $elm$core$Maybe$Just(align_)
					});
			case 'LG':
				return _Utils_update(
					options,
					{
						vAlignLg: $elm$core$Maybe$Just(align_)
					});
			default:
				return _Utils_update(
					options,
					{
						vAlignXl: $elm$core$Maybe$Just(align_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowOption = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'RowAttrs':
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
			case 'RowVAlign':
				var align = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowVAlign, align, options);
			default:
				var align = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowHAlign, align, options);
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultRowOptions = {attributes: _List_Nil, hAlignLg: $elm$core$Maybe$Nothing, hAlignMd: $elm$core$Maybe$Nothing, hAlignSm: $elm$core$Maybe$Nothing, hAlignXl: $elm$core$Maybe$Nothing, hAlignXs: $elm$core$Maybe$Nothing, vAlignLg: $elm$core$Maybe$Nothing, vAlignMd: $elm$core$Maybe$Nothing, vAlignSm: $elm$core$Maybe$Nothing, vAlignXl: $elm$core$Maybe$Nothing, vAlignXs: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$horizontalAlignOption = function (align) {
	switch (align.$) {
		case 'Left':
			return 'start';
		case 'Center':
			return 'center';
		case 'Right':
			return 'end';
		case 'Around':
			return 'around';
		default:
			return 'between';
	}
};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$hAlignClass = function (_v0) {
	var align = _v0.align;
	var screenSize = _v0.screenSize;
	return $elm$html$Html$Attributes$class(
		'justify-content-' + (A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (v) {
					return v + '-';
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize))) + $rundis$elm_bootstrap$Bootstrap$General$Internal$horizontalAlignOption(align)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$hAlignsToAttributes = function (aligns) {
	var align = function (a) {
		return A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$General$Internal$hAlignClass, a);
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, align, aligns));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$rowAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowOption, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultRowOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row')
			]),
		_Utils_ap(
			A2(
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignsToAttributes,
				'align-items-',
				_List_fromArray(
					[options.vAlignXs, options.vAlignSm, options.vAlignMd, options.vAlignLg, options.vAlignXl])),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$hAlignsToAttributes(
					_List_fromArray(
						[options.hAlignXs, options.hAlignSm, options.hAlignMd, options.hAlignLg, options.hAlignXl])),
				options.attributes)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$row = F2(
	function (options, cols) {
		return A2(
			$elm$html$Html$div,
			$rundis$elm_bootstrap$Bootstrap$Grid$Internal$rowAttributes(options),
			A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Grid$renderCol, cols));
	});
var $elm$html$Html$section = _VirtualDom_node('section');
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$Col4 = {$: 'Col4'};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$ColWidth = function (a) {
	return {$: 'ColWidth', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$width = F2(
	function (size, count) {
		return $rundis$elm_bootstrap$Bootstrap$Grid$Internal$ColWidth(
			A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$Width, size, count));
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Col$xs4 = A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$width, $rundis$elm_bootstrap$Bootstrap$General$Internal$XS, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$Col4);
var $author$project$DungeonMap$dungeonMapView = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container is-widescreen')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('section')
					]),
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Grid$row,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Grid$col,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$DungeonMap$dungeonMap_Svg(model)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Grid$col,
								_List_fromArray(
									[$rundis$elm_bootstrap$Bootstrap$Grid$Col$xs4]),
								_List_fromArray(
									[
										$author$project$DungeonMap$dungeonMap_MonsterList(model)
									]))
							]))
					])),
				A2(
				$rundis$elm_bootstrap$Bootstrap$Button$button,
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Button$info,
						$rundis$elm_bootstrap$Bootstrap$Button$onClick($author$project$Model$ClearCharacterList)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Clear Map')
					])),
				$author$project$DungeonMap$newObjectIconModal(model)
			]));
};
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $author$project$FightingTool$footer = A2(
	$elm$html$Html$footer,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('footer animate__animated animate__fadeInUp page-footer')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Entwickelt von Laura Spilling, Stefan Kranz, Marcus Gagelmann und Alexander Kampf')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Einführung in das World Wide Web')
						]))
				]))
		]));
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$FightingTool$header = A2(
	$elm$html$Html$header,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('header animate__animated animate__fadeInDown')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('grid-container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$figure,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('image animate__animated animate__rollIn')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('100%'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '-18%'),
									A2($elm$html$Html$Attributes$style, 'margin-left', '10%')
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$image,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$width('100%'),
											$elm$svg$Svg$Attributes$height('100%'),
											$elm$svg$Svg$Attributes$title('Logo'),
											$elm$svg$Svg$Attributes$xlinkHref('res/P&P Manager Logo 512x512px noBG.png')
										]),
									_List_Nil)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('item1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('title'),
									A2($elm$html$Html$Attributes$style, 'margin-left', '2%'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '4px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Pen & Paper Manager')
								])),
							A2(
							$elm$html$Html$h2,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('subtitle'),
									A2($elm$html$Html$Attributes$style, 'margin-left', '2%')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Für \"Das schwarze Auge\" Version 5')
								]))
						]))
				]))
		]));
var $rundis$elm_bootstrap$Bootstrap$Tab$Item = function (a) {
	return {$: 'Item', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Tab$item = function (rec) {
	return $rundis$elm_bootstrap$Bootstrap$Tab$Item(
		{id: rec.id, link: rec.link, pane: rec.pane});
};
var $rundis$elm_bootstrap$Bootstrap$Tab$items = F2(
	function (items_, _v0) {
		var configRec = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Tab$Config(
			_Utils_update(
				configRec,
				{items: items_}));
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$Link = function (a) {
	return {$: 'Link', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Tab$link = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Tab$Link(
			{attributes: attributes, children: children});
	});
var $rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3 = $elm$html$Html$Attributes$class('mt-3');
var $rundis$elm_bootstrap$Bootstrap$Tab$Pane = function (a) {
	return {$: 'Pane', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Tab$pane = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Tab$Pane(
			{attributes: attributes, children: children});
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$getActiveItem = F2(
	function (_v0, configRec) {
		var activeTab = _v0.a.activeTab;
		if (activeTab.$ === 'Nothing') {
			return $elm$core$List$head(configRec.items);
		} else {
			var id = activeTab.a;
			return function (found) {
				if (found.$ === 'Just') {
					var f = found.a;
					return $elm$core$Maybe$Just(f);
				} else {
					return $elm$core$List$head(configRec.items);
				}
			}(
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (_v2) {
							var item_ = _v2.a;
							return _Utils_eq(item_.id, id);
						},
						configRec.items)));
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$Hidden = {$: 'Hidden'};
var $elm$html$Html$li = _VirtualDom_node('li');
var $rundis$elm_bootstrap$Bootstrap$Tab$Start = {$: 'Start'};
var $rundis$elm_bootstrap$Bootstrap$Tab$visibilityTransition = F2(
	function (withAnimation_, visibility) {
		var _v0 = _Utils_Tuple2(withAnimation_, visibility);
		_v0$2:
		while (true) {
			if (_v0.a) {
				switch (_v0.b.$) {
					case 'Hidden':
						var _v1 = _v0.b;
						return $rundis$elm_bootstrap$Bootstrap$Tab$Start;
					case 'Start':
						var _v2 = _v0.b;
						return $rundis$elm_bootstrap$Bootstrap$Tab$Showing;
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return $rundis$elm_bootstrap$Bootstrap$Tab$Showing;
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$renderLink = F4(
	function (id, active, _v0, configRec) {
		var attributes = _v0.a.attributes;
		var children = _v0.a.children;
		var commonClasses = _List_fromArray(
			[
				_Utils_Tuple2('nav-link', true),
				_Utils_Tuple2('active', active)
			]);
		var clickHandler = $elm$html$Html$Events$onClick(
			configRec.toMsg(
				$rundis$elm_bootstrap$Bootstrap$Tab$State(
					{
						activeTab: $elm$core$Maybe$Just(id),
						visibility: A2($rundis$elm_bootstrap$Bootstrap$Tab$visibilityTransition, configRec.withAnimation && (!active), $rundis$elm_bootstrap$Bootstrap$Tab$Hidden)
					})));
		var linkItem = configRec.useHash ? A2(
			$elm$html$Html$a,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(commonClasses),
						clickHandler,
						$elm$html$Html$Attributes$href('#' + id)
					]),
				attributes),
			children) : A2(
			$elm$html$Html$button,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_Utils_ap(
							commonClasses,
							_List_fromArray(
								[
									_Utils_Tuple2('btn', true),
									_Utils_Tuple2('btn-link', true)
								]))),
						clickHandler
					]),
				attributes),
			children);
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[linkItem]));
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$transitionStyles = function (opacity) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$Attributes$style,
			'opacity',
			$elm$core$String$fromInt(opacity)),
			A2($elm$html$Html$Attributes$style, '-webkit-transition', 'opacity 0.15s linear'),
			A2($elm$html$Html$Attributes$style, '-o-transition', 'opacity 0.15s linear'),
			A2($elm$html$Html$Attributes$style, 'transition', 'opacity 0.15s linear')
		]);
};
var $rundis$elm_bootstrap$Bootstrap$Tab$activeTabAttributes = F2(
	function (_v0, configRec) {
		var visibility = _v0.a.visibility;
		switch (visibility.$) {
			case 'Hidden':
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'none')
					]);
			case 'Start':
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'block'),
						A2($elm$html$Html$Attributes$style, 'opacity', '0')
					]);
			default:
				return _Utils_ap(
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'block')
						]),
					$rundis$elm_bootstrap$Bootstrap$Tab$transitionStyles(1));
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$renderTabPane = F5(
	function (id, active, _v0, state, configRec) {
		var attributes = _v0.a.attributes;
		var children = _v0.a.children;
		var displayAttrs = active ? A2($rundis$elm_bootstrap$Bootstrap$Tab$activeTabAttributes, state, configRec) : _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'none')
			]);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id(id),
						$elm$html$Html$Attributes$class('tab-pane')
					]),
				_Utils_ap(displayAttrs, attributes)),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Tab$tabAttributes = function (configRec) {
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('nav', true),
						_Utils_Tuple2('nav-tabs', !configRec.isPill),
						_Utils_Tuple2('nav-pills', configRec.isPill)
					]))
			]),
		_Utils_ap(
			function () {
				var _v0 = configRec.layout;
				if (_v0.$ === 'Just') {
					switch (_v0.a.$) {
						case 'Justified':
							var _v1 = _v0.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class('nav-justified')
								]);
						case 'Fill':
							var _v2 = _v0.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class('nav-fill')
								]);
						case 'Center':
							var _v3 = _v0.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class('justify-content-center')
								]);
						default:
							var _v4 = _v0.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class('justify-content-end')
								]);
					}
				} else {
					return _List_Nil;
				}
			}(),
			configRec.attributes));
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $rundis$elm_bootstrap$Bootstrap$Tab$view = F2(
	function (state, _v0) {
		var configRec = _v0.a;
		var _v1 = A2($rundis$elm_bootstrap$Bootstrap$Tab$getActiveItem, state, configRec);
		if (_v1.$ === 'Nothing') {
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						$rundis$elm_bootstrap$Bootstrap$Tab$tabAttributes(configRec),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tab-content')
							]),
						_List_Nil)
					]));
		} else {
			var currentItem = _v1.a.a;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$ul,
						$rundis$elm_bootstrap$Bootstrap$Tab$tabAttributes(configRec),
						A2(
							$elm$core$List$map,
							function (_v2) {
								var item_ = _v2.a;
								return A4(
									$rundis$elm_bootstrap$Bootstrap$Tab$renderLink,
									item_.id,
									_Utils_eq(item_.id, currentItem.id),
									item_.link,
									configRec);
							},
							configRec.items)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('tab-content')
							]),
						A2(
							$elm$core$List$map,
							function (_v3) {
								var item_ = _v3.a;
								return A5(
									$rundis$elm_bootstrap$Bootstrap$Tab$renderTabPane,
									item_.id,
									_Utils_eq(item_.id, currentItem.id),
									item_.pane,
									state,
									configRec);
							},
							configRec.items))
					]));
		}
	});
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('wrapper'),
				A2($elm$html$Html$Attributes$style, 'height', '100%')
			]),
		_List_fromArray(
			[
				$author$project$FightingTool$header,
				A2(
				$rundis$elm_bootstrap$Bootstrap$Tab$view,
				model.tabState,
				A2(
					$rundis$elm_bootstrap$Bootstrap$Tab$items,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Tab$item(
							{
								id: 'tabOverview',
								link: A2(
									$rundis$elm_bootstrap$Bootstrap$Tab$link,
									_List_fromArray(
										[$rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3]),
									_List_fromArray(
										[
											$elm$html$Html$text('Overview')
										])),
								pane: A2(
									$rundis$elm_bootstrap$Bootstrap$Tab$pane,
									_List_Nil,
									_List_fromArray(
										[
											$author$project$FightingTool$body(model)
										]))
							}),
							$rundis$elm_bootstrap$Bootstrap$Tab$item(
							{
								id: 'tabMap',
								link: A2(
									$rundis$elm_bootstrap$Bootstrap$Tab$link,
									_List_fromArray(
										[$rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3]),
									_List_fromArray(
										[
											$elm$html$Html$text('Map')
										])),
								pane: A2(
									$rundis$elm_bootstrap$Bootstrap$Tab$pane,
									_List_Nil,
									_List_fromArray(
										[
											$author$project$DungeonMap$dungeonMapView(model)
										]))
							}),
							$rundis$elm_bootstrap$Bootstrap$Tab$item(
							{
								id: 'tabAbout',
								link: A2(
									$rundis$elm_bootstrap$Bootstrap$Tab$link,
									_List_fromArray(
										[$rundis$elm_bootstrap$Bootstrap$Utilities$Spacing$mt3]),
									_List_fromArray(
										[
											$elm$html$Html$text('Info')
										])),
								pane: A2(
									$rundis$elm_bootstrap$Bootstrap$Tab$pane,
									_List_Nil,
									_List_fromArray(
										[$author$project$About$aboutView]))
							})
						]),
					$rundis$elm_bootstrap$Bootstrap$Tab$config($author$project$Model$TabMsg))),
				$author$project$FightingTool$footer
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Model$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));