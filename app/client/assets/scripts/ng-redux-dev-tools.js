(function(f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f()
  } else if (typeof define === "function" && define.amd) {
    define([], f)
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window
    } else if (typeof global !== "undefined") {
      g = global
    } else if (typeof self !== "undefined") {
      g = self
    } else {
      g = this
    }
    g.ngReduxDevTools = f()
  }
})(function() {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e)
        }, l, l.exports, e, t, n, r)
      }
      return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
  })({
    1: [function(_dereq_, module, exports) {
      /*
       * An Angular service which helps with creating recursive directives.
       * @author Mark Lagendijk
       * @license MIT
       */
      angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile', function($compile) {
        return {
          /**
           * Manually compiles the element, fixing the recursion loop.
           * @param element
           * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
           * @returns An object containing the linking functions.
           */
          compile: function(element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
              link = {
                post: link
              };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
              pre: (link && link.pre) ? link.pre : null,
              /**
               * Compiles and re-adds the contents
               */
              post: function(scope, element) {
                // Compile the contents
                if (!compiledContents) {
                  compiledContents = $compile(contents);
                }
                // Re-add the compiled contents to the element
                compiledContents(scope, function(clone) {
                  element.append(clone);
                });

                // Call the post-linking function, if any
                if (link && link.post) {
                  link.post.apply(null, arguments);
                }
              }
            };
          }
        };
      }]);
    }, {}],
    2: [function(_dereq_, module, exports) {
      var baseDifference = _dereq_('../internal/baseDifference'),
          baseFlatten = _dereq_('../internal/baseFlatten'),
          isArrayLike = _dereq_('../internal/isArrayLike'),
          isObjectLike = _dereq_('../internal/isObjectLike'),
          restParam = _dereq_('../function/restParam');

      /**
       * Creates an array of unique `array` values not included in the other
       * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
       * for equality comparisons.
       *
       * @static
       * @memberOf _
       * @category Array
       * @param {Array} array The array to inspect.
       * @param {...Array} [values] The arrays of values to exclude.
       * @returns {Array} Returns the new array of filtered values.
       * @example
       *
       * _.difference([1, 2, 3], [4, 2]);
       * // => [1, 3]
       */
      var difference = restParam(function(array, values) {
        return (isObjectLike(array) && isArrayLike(array)) ?
               baseDifference(array, baseFlatten(values, false, true)) :
               [];
      });

      module.exports = difference;

    }, {
      "../function/restParam": 4,
      "../internal/baseDifference": 9,
      "../internal/baseFlatten": 10,
      "../internal/isArrayLike": 37,
      "../internal/isObjectLike": 41
    }],
    3: [function(_dereq_, module, exports) {
      /**
       * Gets the last element of `array`.
       *
       * @static
       * @memberOf _
       * @category Array
       * @param {Array} array The array to query.
       * @returns {*} Returns the last element of `array`.
       * @example
       *
       * _.last([1, 2, 3]);
       * // => 3
       */
      function last(array) {
        var length = array ? array.length : 0;
        return length ? array[length - 1] : undefined;
      }

      module.exports = last;

    }, {}],
    4: [function(_dereq_, module, exports) {
      /** Used as the `TypeError` message for "Functions" methods. */
      var FUNC_ERROR_TEXT = 'Expected a function';

      /* Native method references for those with the same name as other `lodash` methods. */
      var nativeMax = Math.max;

      /**
       * Creates a function that invokes `func` with the `this` binding of the
       * created function and arguments from `start` and beyond provided as an array.
       *
       * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
       *
       * @static
       * @memberOf _
       * @category Function
       * @param {Function} func The function to apply a rest parameter to.
       * @param {number} [start=func.length-1] The start position of the rest parameter.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var say = _.restParam(function(what, names) {
             *   return what + ' ' + _.initial(names).join(', ') +
             *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
             * });
       *
       * say('hello', 'fred', 'barney', 'pebbles');
       * // => 'hello fred, barney, & pebbles'
       */
      function restParam(func, start) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
        return function() {
          var args = arguments,
              index = -1,
              length = nativeMax(args.length - start, 0),
              rest = Array(length);

          while (++index < length) {
            rest[index] = args[start + index];
          }
          switch (start) {
            case 0:
              return func.call(this, rest);
            case 1:
              return func.call(this, args[0], rest);
            case 2:
              return func.call(this, args[0], args[1], rest);
          }
          var otherArgs = Array(start + 1);
          index = -1;
          while (++index < start) {
            otherArgs[index] = args[index];
          }
          otherArgs[start] = rest;
          return func.apply(this, otherArgs);
        };
      }

      module.exports = restParam;

    }, {}],
    5: [function(_dereq_, module, exports) {
      (function(global) {
        var cachePush = _dereq_('./cachePush'),
            getNative = _dereq_('./getNative');

        /** Native method references. */
        var Set = getNative(global, 'Set');

        /* Native method references for those with the same name as other `lodash` methods. */
        var nativeCreate = getNative(Object, 'create');

        /**
         *
         * Creates a cache object to store unique values.
         *
         * @private
         * @param {Array} [values] The values to cache.
         */
        function SetCache(values) {
          var length = values ? values.length : 0;

          this.data = {
            'hash': nativeCreate(null),
            'set': new Set
          };
          while (length--) {
            this.push(values[length]);
          }
        }

        // Add functions to the `Set` cache.
        SetCache.prototype.push = cachePush;

        module.exports = SetCache;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./cachePush": 26,
      "./getNative": 35
    }],
    6: [function(_dereq_, module, exports) {
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

      module.exports = arrayPush;

    }, {}],
    7: [function(_dereq_, module, exports) {
      /**
       * A specialized version of `_.some` for arrays without support for callback
       * shorthands and `this` binding.
       *
       * @private
       * @param {Array} array The array to iterate over.
       * @param {Function} predicate The function invoked per iteration.
       * @returns {boolean} Returns `true` if any element passes the predicate check,
       *  else `false`.
       */
      function arraySome(array, predicate) {
        var index = -1,
            length = array.length;

        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }

      module.exports = arraySome;

    }, {}],
    8: [function(_dereq_, module, exports) {
      var baseMatches = _dereq_('./baseMatches'),
          baseMatchesProperty = _dereq_('./baseMatchesProperty'),
          bindCallback = _dereq_('./bindCallback'),
          identity = _dereq_('../utility/identity'),
          property = _dereq_('../utility/property');

      /**
       * The base implementation of `_.callback` which supports specifying the
       * number of arguments to provide to `func`.
       *
       * @private
       * @param {*} [func=_.identity] The value to convert to a callback.
       * @param {*} [thisArg] The `this` binding of `func`.
       * @param {number} [argCount] The number of arguments to provide to `func`.
       * @returns {Function} Returns the callback.
       */
      function baseCallback(func, thisArg, argCount) {
        var type = typeof func;
        if (type == 'function') {
          return thisArg === undefined ?
                 func :
                 bindCallback(func, thisArg, argCount);
        }
        if (func == null) {
          return identity;
        }
        if (type == 'object') {
          return baseMatches(func);
        }
        return thisArg === undefined ?
               property(func) :
               baseMatchesProperty(func, thisArg);
      }

      module.exports = baseCallback;

    }, {
      "../utility/identity": 56,
      "../utility/property": 57,
      "./baseMatches": 18,
      "./baseMatchesProperty": 19,
      "./bindCallback": 24
    }],
    9: [function(_dereq_, module, exports) {
      var baseIndexOf = _dereq_('./baseIndexOf'),
          cacheIndexOf = _dereq_('./cacheIndexOf'),
          createCache = _dereq_('./createCache');

      /** Used as the size to enable large array optimizations. */
      var LARGE_ARRAY_SIZE = 200;

      /**
       * The base implementation of `_.difference` which accepts a single array
       * of values to exclude.
       *
       * @private
       * @param {Array} array The array to inspect.
       * @param {Array} values The values to exclude.
       * @returns {Array} Returns the new array of filtered values.
       */
      function baseDifference(array, values) {
        var length = array ? array.length : 0,
            result = [];

        if (!length) {
          return result;
        }
        var index = -1,
            indexOf = baseIndexOf,
            isCommon = true,
            cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
            valuesLength = values.length;

        if (cache) {
          indexOf = cacheIndexOf;
          isCommon = false;
          values = cache;
        }
        outer:
            while (++index < length) {
              var value = array[index];

              if (isCommon && value === value) {
                var valuesIndex = valuesLength;
                while (valuesIndex--) {
                  if (values[valuesIndex] === value) {
                    continue outer;
                  }
                }
                result.push(value);
              } else if (indexOf(values, value, 0) < 0) {
                result.push(value);
              }
            }
        return result;
      }

      module.exports = baseDifference;

    }, {
      "./baseIndexOf": 14,
      "./cacheIndexOf": 25,
      "./createCache": 28
    }],
    10: [function(_dereq_, module, exports) {
      var arrayPush = _dereq_('./arrayPush'),
          isArguments = _dereq_('../lang/isArguments'),
          isArray = _dereq_('../lang/isArray'),
          isArrayLike = _dereq_('./isArrayLike'),
          isObjectLike = _dereq_('./isObjectLike');

      /**
       * The base implementation of `_.flatten` with added support for restricting
       * flattening and specifying the start index.
       *
       * @private
       * @param {Array} array The array to flatten.
       * @param {boolean} [isDeep] Specify a deep flatten.
       * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
       * @param {Array} [result=[]] The initial result value.
       * @returns {Array} Returns the new flattened array.
       */
      function baseFlatten(array, isDeep, isStrict, result) {
        result || (result = []);

        var index = -1,
            length = array.length;

        while (++index < length) {
          var value = array[index];
          if (isObjectLike(value) && isArrayLike(value) &&
              (isStrict || isArray(value) || isArguments(value))) {
            if (isDeep) {
              // Recursively flatten arrays (susceptible to call stack limits).
              baseFlatten(value, isDeep, isStrict, result);
            } else {
              arrayPush(result, value);
            }
          } else if (!isStrict) {
            result[result.length] = value;
          }
        }
        return result;
      }

      module.exports = baseFlatten;

    }, {
      "../lang/isArguments": 46,
      "../lang/isArray": 47,
      "./arrayPush": 6,
      "./isArrayLike": 37,
      "./isObjectLike": 41
    }],
    11: [function(_dereq_, module, exports) {
      var createBaseFor = _dereq_('./createBaseFor');

      /**
       * The base implementation of `baseForIn` and `baseForOwn` which iterates
       * over `object` properties returned by `keysFunc` invoking `iteratee` for
       * each property. Iteratee functions may exit iteration early by explicitly
       * returning `false`.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @param {Function} keysFunc The function to get the keys of `object`.
       * @returns {Object} Returns `object`.
       */
      var baseFor = createBaseFor();

      module.exports = baseFor;

    }, {
      "./createBaseFor": 27
    }],
    12: [function(_dereq_, module, exports) {
      var baseFor = _dereq_('./baseFor'),
          keys = _dereq_('../object/keys');

      /**
       * The base implementation of `_.forOwn` without support for callback
       * shorthands and `this` binding.
       *
       * @private
       * @param {Object} object The object to iterate over.
       * @param {Function} iteratee The function invoked per iteration.
       * @returns {Object} Returns `object`.
       */
      function baseForOwn(object, iteratee) {
        return baseFor(object, iteratee, keys);
      }

      module.exports = baseForOwn;

    }, {
      "../object/keys": 52,
      "./baseFor": 11
    }],
    13: [function(_dereq_, module, exports) {
      var toObject = _dereq_('./toObject');

      /**
       * The base implementation of `get` without support for string paths
       * and default values.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {Array} path The path of the property to get.
       * @param {string} [pathKey] The key representation of path.
       * @returns {*} Returns the resolved value.
       */
      function baseGet(object, path, pathKey) {
        if (object == null) {
          return;
        }
        if (pathKey !== undefined && pathKey in toObject(object)) {
          path = [pathKey];
        }
        var index = 0,
            length = path.length;

        while (object != null && index < length) {
          object = object[path[index++]];
        }
        return (index && index == length) ? object : undefined;
      }

      module.exports = baseGet;

    }, {
      "./toObject": 44
    }],
    14: [function(_dereq_, module, exports) {
      var indexOfNaN = _dereq_('./indexOfNaN');

      /**
       * The base implementation of `_.indexOf` without support for binary searches.
       *
       * @private
       * @param {Array} array The array to search.
       * @param {*} value The value to search for.
       * @param {number} fromIndex The index to search from.
       * @returns {number} Returns the index of the matched value, else `-1`.
       */
      function baseIndexOf(array, value, fromIndex) {
        if (value !== value) {
          return indexOfNaN(array, fromIndex);
        }
        var index = fromIndex - 1,
            length = array.length;

        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }

      module.exports = baseIndexOf;

    }, {
      "./indexOfNaN": 36
    }],
    15: [function(_dereq_, module, exports) {
      var baseIsEqualDeep = _dereq_('./baseIsEqualDeep'),
          isObject = _dereq_('../lang/isObject'),
          isObjectLike = _dereq_('./isObjectLike');

      /**
       * The base implementation of `_.isEqual` without support for `this` binding
       * `customizer` functions.
       *
       * @private
       * @param {*} value The value to compare.
       * @param {*} other The other value to compare.
       * @param {Function} [customizer] The function to customize comparing values.
       * @param {boolean} [isLoose] Specify performing partial comparisons.
       * @param {Array} [stackA] Tracks traversed `value` objects.
       * @param {Array} [stackB] Tracks traversed `other` objects.
       * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
       */
      function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
      }

      module.exports = baseIsEqual;

    }, {
      "../lang/isObject": 50,
      "./baseIsEqualDeep": 16,
      "./isObjectLike": 41
    }],
    16: [function(_dereq_, module, exports) {
      var equalArrays = _dereq_('./equalArrays'),
          equalByTag = _dereq_('./equalByTag'),
          equalObjects = _dereq_('./equalObjects'),
          isArray = _dereq_('../lang/isArray'),
          isTypedArray = _dereq_('../lang/isTypedArray');

      /** `Object#toString` result references. */
      var argsTag = '[object Arguments]',
          arrayTag = '[object Array]',
          objectTag = '[object Object]';

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to check objects for own properties. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /**
       * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
       * of values.
       */
      var objToString = objectProto.toString;

      /**
       * A specialized version of `baseIsEqual` for arrays and objects which performs
       * deep comparisons and tracks traversed objects enabling objects with circular
       * references to be compared.
       *
       * @private
       * @param {Object} object The object to compare.
       * @param {Object} other The other object to compare.
       * @param {Function} equalFunc The function to determine equivalents of values.
       * @param {Function} [customizer] The function to customize comparing objects.
       * @param {boolean} [isLoose] Specify performing partial comparisons.
       * @param {Array} [stackA=[]] Tracks traversed `value` objects.
       * @param {Array} [stackB=[]] Tracks traversed `other` objects.
       * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
       */
      function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var objIsArr = isArray(object),
            othIsArr = isArray(other),
            objTag = arrayTag,
            othTag = arrayTag;

        if (!objIsArr) {
          objTag = objToString.call(object);
          if (objTag == argsTag) {
            objTag = objectTag;
          } else if (objTag != objectTag) {
            objIsArr = isTypedArray(object);
          }
        }
        if (!othIsArr) {
          othTag = objToString.call(other);
          if (othTag == argsTag) {
            othTag = objectTag;
          } else if (othTag != objectTag) {
            othIsArr = isTypedArray(other);
          }
        }
        var objIsObj = objTag == objectTag,
            othIsObj = othTag == objectTag,
            isSameTag = objTag == othTag;

        if (isSameTag && !(objIsArr || objIsObj)) {
          return equalByTag(object, other, objTag);
        }
        if (!isLoose) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
              othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

          if (objIsWrapped || othIsWrapped) {
            return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
          }
        }
        if (!isSameTag) {
          return false;
        }
        // Assume cyclic values are equal.
        // For more information on detecting circular references see https://es5.github.io/#JO.
        stackA || (stackA = []);
        stackB || (stackB = []);

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == object) {
            return stackB[length] == other;
          }
        }
        // Add `object` and `other` to the stack of traversed objects.
        stackA.push(object);
        stackB.push(other);

        var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

        stackA.pop();
        stackB.pop();

        return result;
      }

      module.exports = baseIsEqualDeep;

    }, {
      "../lang/isArray": 47,
      "../lang/isTypedArray": 51,
      "./equalArrays": 30,
      "./equalByTag": 31,
      "./equalObjects": 32
    }],
    17: [function(_dereq_, module, exports) {
      var baseIsEqual = _dereq_('./baseIsEqual'),
          toObject = _dereq_('./toObject');

      /**
       * The base implementation of `_.isMatch` without support for callback
       * shorthands and `this` binding.
       *
       * @private
       * @param {Object} object The object to inspect.
       * @param {Array} matchData The propery names, values, and compare flags to match.
       * @param {Function} [customizer] The function to customize comparing objects.
       * @returns {boolean} Returns `true` if `object` is a match, else `false`.
       */
      function baseIsMatch(object, matchData, customizer) {
        var index = matchData.length,
            length = index,
            noCustomizer = !customizer;

        if (object == null) {
          return !length;
        }
        object = toObject(object);
        while (index--) {
          var data = matchData[index];
          if ((noCustomizer && data[2]) ?
              data[1] !== object[data[0]] :
              !(data[0] in object)
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
            var result = customizer ? customizer(objValue, srcValue, key) : undefined;
            if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
              return false;
            }
          }
        }
        return true;
      }

      module.exports = baseIsMatch;

    }, {
      "./baseIsEqual": 15,
      "./toObject": 44
    }],
    18: [function(_dereq_, module, exports) {
      var baseIsMatch = _dereq_('./baseIsMatch'),
          getMatchData = _dereq_('./getMatchData'),
          toObject = _dereq_('./toObject');

      /**
       * The base implementation of `_.matches` which does not clone `source`.
       *
       * @private
       * @param {Object} source The object of property values to match.
       * @returns {Function} Returns the new function.
       */
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          var key = matchData[0][0],
              value = matchData[0][1];

          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key] === value && (value !== undefined || (key in toObject(object)));
          };
        }
        return function(object) {
          return baseIsMatch(object, matchData);
        };
      }

      module.exports = baseMatches;

    }, {
      "./baseIsMatch": 17,
      "./getMatchData": 34,
      "./toObject": 44
    }],
    19: [function(_dereq_, module, exports) {
      var baseGet = _dereq_('./baseGet'),
          baseIsEqual = _dereq_('./baseIsEqual'),
          baseSlice = _dereq_('./baseSlice'),
          isArray = _dereq_('../lang/isArray'),
          isKey = _dereq_('./isKey'),
          isStrictComparable = _dereq_('./isStrictComparable'),
          last = _dereq_('../array/last'),
          toObject = _dereq_('./toObject'),
          toPath = _dereq_('./toPath');

      /**
       * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
       *
       * @private
       * @param {string} path The path of the property to get.
       * @param {*} srcValue The value to compare.
       * @returns {Function} Returns the new function.
       */
      function baseMatchesProperty(path, srcValue) {
        var isArr = isArray(path),
            isCommon = isKey(path) && isStrictComparable(srcValue),
            pathKey = (path + '');

        path = toPath(path);
        return function(object) {
          if (object == null) {
            return false;
          }
          var key = pathKey;
          object = toObject(object);
          if ((isArr || !isCommon) && !(key in object)) {
            object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
            if (object == null) {
              return false;
            }
            key = last(path);
            object = toObject(object);
          }
          return object[key] === srcValue ?
                 (srcValue !== undefined || (key in object)) :
                 baseIsEqual(srcValue, object[key], undefined, true);
        };
      }

      module.exports = baseMatchesProperty;

    }, {
      "../array/last": 3,
      "../lang/isArray": 47,
      "./baseGet": 13,
      "./baseIsEqual": 15,
      "./baseSlice": 22,
      "./isKey": 39,
      "./isStrictComparable": 42,
      "./toObject": 44,
      "./toPath": 45
    }],
    20: [function(_dereq_, module, exports) {
      /**
       * The base implementation of `_.property` without support for deep paths.
       *
       * @private
       * @param {string} key The key of the property to get.
       * @returns {Function} Returns the new function.
       */
      function baseProperty(key) {
        return function(object) {
          return object == null ? undefined : object[key];
        };
      }

      module.exports = baseProperty;

    }, {}],
    21: [function(_dereq_, module, exports) {
      var baseGet = _dereq_('./baseGet'),
          toPath = _dereq_('./toPath');

      /**
       * A specialized version of `baseProperty` which supports deep paths.
       *
       * @private
       * @param {Array|string} path The path of the property to get.
       * @returns {Function} Returns the new function.
       */
      function basePropertyDeep(path) {
        var pathKey = (path + '');
        path = toPath(path);
        return function(object) {
          return baseGet(object, path, pathKey);
        };
      }

      module.exports = basePropertyDeep;

    }, {
      "./baseGet": 13,
      "./toPath": 45
    }],
    22: [function(_dereq_, module, exports) {
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

        start = start == null ? 0 : (+start || 0);
        if (start < 0) {
          start = -start > length ? 0 : (length + start);
        }
        end = (end === undefined || end > length) ? length : (+end || 0);
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

      module.exports = baseSlice;

    }, {}],
    23: [function(_dereq_, module, exports) {
      /**
       * Converts `value` to a string if it's not one. An empty string is returned
       * for `null` or `undefined` values.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {string} Returns the string.
       */
      function baseToString(value) {
        return value == null ? '' : (value + '');
      }

      module.exports = baseToString;

    }, {}],
    24: [function(_dereq_, module, exports) {
      var identity = _dereq_('../utility/identity');

      /**
       * A specialized version of `baseCallback` which only supports `this` binding
       * and specifying the number of arguments to provide to `func`.
       *
       * @private
       * @param {Function} func The function to bind.
       * @param {*} thisArg The `this` binding of `func`.
       * @param {number} [argCount] The number of arguments to provide to `func`.
       * @returns {Function} Returns the callback.
       */
      function bindCallback(func, thisArg, argCount) {
        if (typeof func != 'function') {
          return identity;
        }
        if (thisArg === undefined) {
          return func;
        }
        switch (argCount) {
          case 1:
            return function(value) {
              return func.call(thisArg, value);
            };
          case 3:
            return function(value, index, collection) {
              return func.call(thisArg, value, index, collection);
            };
          case 4:
            return function(accumulator, value, index, collection) {
              return func.call(thisArg, accumulator, value, index, collection);
            };
          case 5:
            return function(value, other, key, object, source) {
              return func.call(thisArg, value, other, key, object, source);
            };
        }
        return function() {
          return func.apply(thisArg, arguments);
        };
      }

      module.exports = bindCallback;

    }, {
      "../utility/identity": 56
    }],
    25: [function(_dereq_, module, exports) {
      var isObject = _dereq_('../lang/isObject');

      /**
       * Checks if `value` is in `cache` mimicking the return signature of
       * `_.indexOf` by returning `0` if the value is found, else `-1`.
       *
       * @private
       * @param {Object} cache The cache to search.
       * @param {*} value The value to search for.
       * @returns {number} Returns `0` if `value` is found, else `-1`.
       */
      function cacheIndexOf(cache, value) {
        var data = cache.data,
            result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

        return result ? 0 : -1;
      }

      module.exports = cacheIndexOf;

    }, {
      "../lang/isObject": 50
    }],
    26: [function(_dereq_, module, exports) {
      var isObject = _dereq_('../lang/isObject');

      /**
       * Adds `value` to the cache.
       *
       * @private
       * @name push
       * @memberOf SetCache
       * @param {*} value The value to cache.
       */
      function cachePush(value) {
        var data = this.data;
        if (typeof value == 'string' || isObject(value)) {
          data.set.add(value);
        } else {
          data.hash[value] = true;
        }
      }

      module.exports = cachePush;

    }, {
      "../lang/isObject": 50
    }],
    27: [function(_dereq_, module, exports) {
      var toObject = _dereq_('./toObject');

      /**
       * Creates a base function for `_.forIn` or `_.forInRight`.
       *
       * @private
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {Function} Returns the new base function.
       */
      function createBaseFor(fromRight) {
        return function(object, iteratee, keysFunc) {
          var iterable = toObject(object),
              props = keysFunc(object),
              length = props.length,
              index = fromRight ? length : -1;

          while ((fromRight ? index-- : ++index < length)) {
            var key = props[index];
            if (iteratee(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }

      module.exports = createBaseFor;

    }, {
      "./toObject": 44
    }],
    28: [function(_dereq_, module, exports) {
      (function(global) {
        var SetCache = _dereq_('./SetCache'),
            getNative = _dereq_('./getNative');

        /** Native method references. */
        var Set = getNative(global, 'Set');

        /* Native method references for those with the same name as other `lodash` methods. */
        var nativeCreate = getNative(Object, 'create');

        /**
         * Creates a `Set` cache object to optimize linear searches of large arrays.
         *
         * @private
         * @param {Array} [values] The values to cache.
         * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
         */
        function createCache(values) {
          return (nativeCreate && Set) ? new SetCache(values) : null;
        }

        module.exports = createCache;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./SetCache": 5,
      "./getNative": 35
    }],
    29: [function(_dereq_, module, exports) {
      var baseCallback = _dereq_('./baseCallback'),
          baseForOwn = _dereq_('./baseForOwn');

      /**
       * Creates a function for `_.mapKeys` or `_.mapValues`.
       *
       * @private
       * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
       * @returns {Function} Returns the new map function.
       */
      function createObjectMapper(isMapKeys) {
        return function(object, iteratee, thisArg) {
          var result = {};
          iteratee = baseCallback(iteratee, thisArg, 3);

          baseForOwn(object, function(value, key, object) {
            var mapped = iteratee(value, key, object);
            key = isMapKeys ? mapped : key;
            value = isMapKeys ? value : mapped;
            result[key] = value;
          });
          return result;
        };
      }

      module.exports = createObjectMapper;

    }, {
      "./baseCallback": 8,
      "./baseForOwn": 12
    }],
    30: [function(_dereq_, module, exports) {
      var arraySome = _dereq_('./arraySome');

      /**
       * A specialized version of `baseIsEqualDeep` for arrays with support for
       * partial deep comparisons.
       *
       * @private
       * @param {Array} array The array to compare.
       * @param {Array} other The other array to compare.
       * @param {Function} equalFunc The function to determine equivalents of values.
       * @param {Function} [customizer] The function to customize comparing arrays.
       * @param {boolean} [isLoose] Specify performing partial comparisons.
       * @param {Array} [stackA] Tracks traversed `value` objects.
       * @param {Array} [stackB] Tracks traversed `other` objects.
       * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
       */
      function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var index = -1,
            arrLength = array.length,
            othLength = other.length;

        if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
          return false;
        }
        // Ignore non-index properties.
        while (++index < arrLength) {
          var arrValue = array[index],
              othValue = other[index],
              result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

          if (result !== undefined) {
            if (result) {
              continue;
            }
            return false;
          }
          // Recursively compare arrays (susceptible to call stack limits).
          if (isLoose) {
            if (!arraySome(other, function(othValue) {
                  return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
                })) {
              return false;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
            return false;
          }
        }
        return true;
      }

      module.exports = equalArrays;

    }, {
      "./arraySome": 7
    }],
    31: [function(_dereq_, module, exports) {
      /** `Object#toString` result references. */
      var boolTag = '[object Boolean]',
          dateTag = '[object Date]',
          errorTag = '[object Error]',
          numberTag = '[object Number]',
          regexpTag = '[object RegExp]',
          stringTag = '[object String]';

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
       * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
       */
      function equalByTag(object, other, tag) {
        switch (tag) {
          case boolTag:
          case dateTag:
            // Coerce dates and booleans to numbers, dates to milliseconds and booleans
            // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
            return +object == +other;

          case errorTag:
            return object.name == other.name && object.message == other.message;

          case numberTag:
            // Treat `NaN` vs. `NaN` as equal.
            return (object != +object) ?
                   other != +other :
                   object == +other;

          case regexpTag:
          case stringTag:
            // Coerce regexes to strings and treat strings primitives and string
            // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
            return object == (other + '');
        }
        return false;
      }

      module.exports = equalByTag;

    }, {}],
    32: [function(_dereq_, module, exports) {
      var keys = _dereq_('../object/keys');

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to check objects for own properties. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /**
       * A specialized version of `baseIsEqualDeep` for objects with support for
       * partial deep comparisons.
       *
       * @private
       * @param {Object} object The object to compare.
       * @param {Object} other The other object to compare.
       * @param {Function} equalFunc The function to determine equivalents of values.
       * @param {Function} [customizer] The function to customize comparing values.
       * @param {boolean} [isLoose] Specify performing partial comparisons.
       * @param {Array} [stackA] Tracks traversed `value` objects.
       * @param {Array} [stackB] Tracks traversed `other` objects.
       * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
       */
      function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
        var objProps = keys(object),
            objLength = objProps.length,
            othProps = keys(other),
            othLength = othProps.length;

        if (objLength != othLength && !isLoose) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key = objProps[index];
          if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
            return false;
          }
        }
        var skipCtor = isLoose;
        while (++index < objLength) {
          key = objProps[index];
          var objValue = object[key],
              othValue = other[key],
              result = customizer ? customizer(isLoose ? othValue : objValue, isLoose ? objValue : othValue, key) : undefined;

          // Recursively compare objects (susceptible to call stack limits).
          if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
            return false;
          }
          skipCtor || (skipCtor = key == 'constructor');
        }
        if (!skipCtor) {
          var objCtor = object.constructor,
              othCtor = other.constructor;

          // Non `Object` object instances with different constructors are not equal.
          if (objCtor != othCtor &&
              ('constructor' in object && 'constructor' in other) &&
              !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
            return false;
          }
        }
        return true;
      }

      module.exports = equalObjects;

    }, {
      "../object/keys": 52
    }],
    33: [function(_dereq_, module, exports) {
      var baseProperty = _dereq_('./baseProperty');

      /**
       * Gets the "length" property value of `object`.
       *
       * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
       * that affects Safari on at least iOS 8.1-8.3 ARM64.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {*} Returns the "length" value.
       */
      var getLength = baseProperty('length');

      module.exports = getLength;

    }, {
      "./baseProperty": 20
    }],
    34: [function(_dereq_, module, exports) {
      var isStrictComparable = _dereq_('./isStrictComparable'),
          pairs = _dereq_('../object/pairs');

      /**
       * Gets the propery names, values, and compare flags of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the match data of `object`.
       */
      function getMatchData(object) {
        var result = pairs(object),
            length = result.length;

        while (length--) {
          result[length][2] = isStrictComparable(result[length][1]);
        }
        return result;
      }

      module.exports = getMatchData;

    }, {
      "../object/pairs": 55,
      "./isStrictComparable": 42
    }],
    35: [function(_dereq_, module, exports) {
      var isNative = _dereq_('../lang/isNative');

      /**
       * Gets the native function at `key` of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @param {string} key The key of the method to get.
       * @returns {*} Returns the function if it's native, else `undefined`.
       */
      function getNative(object, key) {
        var value = object == null ? undefined : object[key];
        return isNative(value) ? value : undefined;
      }

      module.exports = getNative;

    }, {
      "../lang/isNative": 49
    }],
    36: [function(_dereq_, module, exports) {
      /**
       * Gets the index at which the first occurrence of `NaN` is found in `array`.
       *
       * @private
       * @param {Array} array The array to search.
       * @param {number} fromIndex The index to search from.
       * @param {boolean} [fromRight] Specify iterating from right to left.
       * @returns {number} Returns the index of the matched `NaN`, else `-1`.
       */
      function indexOfNaN(array, fromIndex, fromRight) {
        var length = array.length,
            index = fromIndex + (fromRight ? 0 : -1);

        while ((fromRight ? index-- : ++index < length)) {
          var other = array[index];
          if (other !== other) {
            return index;
          }
        }
        return -1;
      }

      module.exports = indexOfNaN;

    }, {}],
    37: [function(_dereq_, module, exports) {
      var getLength = _dereq_('./getLength'),
          isLength = _dereq_('./isLength');

      /**
       * Checks if `value` is array-like.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
       */
      function isArrayLike(value) {
        return value != null && isLength(getLength(value));
      }

      module.exports = isArrayLike;

    }, {
      "./getLength": 33,
      "./isLength": 40
    }],
    38: [function(_dereq_, module, exports) {
      /** Used to detect unsigned integer values. */
      var reIsUint = /^\d+$/;

      /**
       * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
       * of an array-like value.
       */
      var MAX_SAFE_INTEGER = 9007199254740991;

      /**
       * Checks if `value` is a valid array-like index.
       *
       * @private
       * @param {*} value The value to check.
       * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
       * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
       */
      function isIndex(value, length) {
        value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return value > -1 && value % 1 == 0 && value < length;
      }

      module.exports = isIndex;

    }, {}],
    39: [function(_dereq_, module, exports) {
      var isArray = _dereq_('../lang/isArray'),
          toObject = _dereq_('./toObject');

      /** Used to match property names within property paths. */
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
          reIsPlainProp = /^\w*$/;

      /**
       * Checks if `value` is a property name and not a property path.
       *
       * @private
       * @param {*} value The value to check.
       * @param {Object} [object] The object to query keys on.
       * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
       */
      function isKey(value, object) {
        var type = typeof value;
        if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
          return true;
        }
        if (isArray(value)) {
          return false;
        }
        var result = !reIsDeepProp.test(value);
        return result || (object != null && value in toObject(object));
      }

      module.exports = isKey;

    }, {
      "../lang/isArray": 47,
      "./toObject": 44
    }],
    40: [function(_dereq_, module, exports) {
      /**
       * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
       * of an array-like value.
       */
      var MAX_SAFE_INTEGER = 9007199254740991;

      /**
       * Checks if `value` is a valid array-like length.
       *
       * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
       */
      function isLength(value) {
        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }

      module.exports = isLength;

    }, {}],
    41: [function(_dereq_, module, exports) {
      /**
       * Checks if `value` is object-like.
       *
       * @private
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
       */
      function isObjectLike(value) {
        return !!value && typeof value == 'object';
      }

      module.exports = isObjectLike;

    }, {}],
    42: [function(_dereq_, module, exports) {
      var isObject = _dereq_('../lang/isObject');

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

      module.exports = isStrictComparable;

    }, {
      "../lang/isObject": 50
    }],
    43: [function(_dereq_, module, exports) {
      var isArguments = _dereq_('../lang/isArguments'),
          isArray = _dereq_('../lang/isArray'),
          isIndex = _dereq_('./isIndex'),
          isLength = _dereq_('./isLength'),
          keysIn = _dereq_('../object/keysIn');

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to check objects for own properties. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /**
       * A fallback implementation of `Object.keys` which creates an array of the
       * own enumerable property names of `object`.
       *
       * @private
       * @param {Object} object The object to query.
       * @returns {Array} Returns the array of property names.
       */
      function shimKeys(object) {
        var props = keysIn(object),
            propsLength = props.length,
            length = propsLength && object.length;

        var allowIndexes = !!length && isLength(length) &&
            (isArray(object) || isArguments(object));

        var index = -1,
            result = [];

        while (++index < propsLength) {
          var key = props[index];
          if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
            result.push(key);
          }
        }
        return result;
      }

      module.exports = shimKeys;

    }, {
      "../lang/isArguments": 46,
      "../lang/isArray": 47,
      "../object/keysIn": 53,
      "./isIndex": 38,
      "./isLength": 40
    }],
    44: [function(_dereq_, module, exports) {
      var isObject = _dereq_('../lang/isObject');

      /**
       * Converts `value` to an object if it's not one.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {Object} Returns the object.
       */
      function toObject(value) {
        return isObject(value) ? value : Object(value);
      }

      module.exports = toObject;

    }, {
      "../lang/isObject": 50
    }],
    45: [function(_dereq_, module, exports) {
      var baseToString = _dereq_('./baseToString'),
          isArray = _dereq_('../lang/isArray');

      /** Used to match property names within property paths. */
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

      /** Used to match backslashes in property paths. */
      var reEscapeChar = /\\(\\)?/g;

      /**
       * Converts `value` to property path array if it's not one.
       *
       * @private
       * @param {*} value The value to process.
       * @returns {Array} Returns the property path array.
       */
      function toPath(value) {
        if (isArray(value)) {
          return value;
        }
        var result = [];
        baseToString(value).replace(rePropName, function(match, number, quote, string) {
          result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
        });
        return result;
      }

      module.exports = toPath;

    }, {
      "../lang/isArray": 47,
      "./baseToString": 23
    }],
    46: [function(_dereq_, module, exports) {
      var isArrayLike = _dereq_('../internal/isArrayLike'),
          isObjectLike = _dereq_('../internal/isObjectLike');

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to check objects for own properties. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /** Native method references. */
      var propertyIsEnumerable = objectProto.propertyIsEnumerable;

      /**
       * Checks if `value` is classified as an `arguments` object.
       *
       * @static
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
       * @example
       *
       * _.isArguments(function() { return arguments; }());
       * // => true
       *
       * _.isArguments([1, 2, 3]);
       * // => false
       */
      function isArguments(value) {
        return isObjectLike(value) && isArrayLike(value) &&
            hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
      }

      module.exports = isArguments;

    }, {
      "../internal/isArrayLike": 37,
      "../internal/isObjectLike": 41
    }],
    47: [function(_dereq_, module, exports) {
      var getNative = _dereq_('../internal/getNative'),
          isLength = _dereq_('../internal/isLength'),
          isObjectLike = _dereq_('../internal/isObjectLike');

      /** `Object#toString` result references. */
      var arrayTag = '[object Array]';

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /**
       * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
       * of values.
       */
      var objToString = objectProto.toString;

      /* Native method references for those with the same name as other `lodash` methods. */
      var nativeIsArray = getNative(Array, 'isArray');

      /**
       * Checks if `value` is classified as an `Array` object.
       *
       * @static
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
       * @example
       *
       * _.isArray([1, 2, 3]);
       * // => true
       *
       * _.isArray(function() { return arguments; }());
       * // => false
       */
      var isArray = nativeIsArray || function(value) {
            return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
          };

      module.exports = isArray;

    }, {
      "../internal/getNative": 35,
      "../internal/isLength": 40,
      "../internal/isObjectLike": 41
    }],
    48: [function(_dereq_, module, exports) {
      var isObject = _dereq_('./isObject');

      /** `Object#toString` result references. */
      var funcTag = '[object Function]';

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /**
       * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
       * of values.
       */
      var objToString = objectProto.toString;

      /**
       * Checks if `value` is classified as a `Function` object.
       *
       * @static
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
       * @example
       *
       * _.isFunction(_);
       * // => true
       *
       * _.isFunction(/abc/);
       * // => false
       */
      function isFunction(value) {
        // The use of `Object#toString` avoids issues with the `typeof` operator
        // in older versions of Chrome and Safari which return 'function' for regexes
        // and Safari 8 which returns 'object' for typed array constructors.
        return isObject(value) && objToString.call(value) == funcTag;
      }

      module.exports = isFunction;

    }, {
      "./isObject": 50
    }],
    49: [function(_dereq_, module, exports) {
      var isFunction = _dereq_('./isFunction'),
          isObjectLike = _dereq_('../internal/isObjectLike');

      /** Used to detect host constructors (Safari > 5). */
      var reIsHostCtor = /^\[object .+?Constructor\]$/;

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to resolve the decompiled source of functions. */
      var fnToString = Function.prototype.toString;

      /** Used to check objects for own properties. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /** Used to detect if a method is native. */
      var reIsNative = RegExp('^' +
          fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
              .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
      );

      /**
       * Checks if `value` is a native function.
       *
       * @static
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
       * @example
       *
       * _.isNative(Array.prototype.push);
       * // => true
       *
       * _.isNative(_);
       * // => false
       */
      function isNative(value) {
        if (value == null) {
          return false;
        }
        if (isFunction(value)) {
          return reIsNative.test(fnToString.call(value));
        }
        return isObjectLike(value) && reIsHostCtor.test(value);
      }

      module.exports = isNative;

    }, {
      "../internal/isObjectLike": 41,
      "./isFunction": 48
    }],
    50: [function(_dereq_, module, exports) {
      /**
       * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
       * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
       *
       * @static
       * @memberOf _
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
       * _.isObject(1);
       * // => false
       */
      function isObject(value) {
        // Avoid a V8 JIT bug in Chrome 19-20.
        // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
        var type = typeof value;
        return !!value && (type == 'object' || type == 'function');
      }

      module.exports = isObject;

    }, {}],
    51: [function(_dereq_, module, exports) {
      var isLength = _dereq_('../internal/isLength'),
          isObjectLike = _dereq_('../internal/isObjectLike');

      /** `Object#toString` result references. */
      var argsTag = '[object Arguments]',
          arrayTag = '[object Array]',
          boolTag = '[object Boolean]',
          dateTag = '[object Date]',
          errorTag = '[object Error]',
          funcTag = '[object Function]',
          mapTag = '[object Map]',
          numberTag = '[object Number]',
          objectTag = '[object Object]',
          regexpTag = '[object RegExp]',
          setTag = '[object Set]',
          stringTag = '[object String]',
          weakMapTag = '[object WeakMap]';

      var arrayBufferTag = '[object ArrayBuffer]',
          float32Tag = '[object Float32Array]',
          float64Tag = '[object Float64Array]',
          int8Tag = '[object Int8Array]',
          int16Tag = '[object Int16Array]',
          int32Tag = '[object Int32Array]',
          uint8Tag = '[object Uint8Array]',
          uint8ClampedTag = '[object Uint8ClampedArray]',
          uint16Tag = '[object Uint16Array]',
          uint32Tag = '[object Uint32Array]';

      /** Used to identify `toStringTag` values of typed arrays. */
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
          typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
              typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
                  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
                      typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
          typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
              typedArrayTags[dateTag] = typedArrayTags[errorTag] =
                  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
                      typedArrayTags[numberTag] = typedArrayTags[objectTag] =
                          typedArrayTags[regexpTag] = typedArrayTags[setTag] =
                              typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /**
       * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
       * of values.
       */
      var objToString = objectProto.toString;

      /**
       * Checks if `value` is classified as a typed array.
       *
       * @static
       * @memberOf _
       * @category Lang
       * @param {*} value The value to check.
       * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
       * @example
       *
       * _.isTypedArray(new Uint8Array);
       * // => true
       *
       * _.isTypedArray([]);
       * // => false
       */
      function isTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
      }

      module.exports = isTypedArray;

    }, {
      "../internal/isLength": 40,
      "../internal/isObjectLike": 41
    }],
    52: [function(_dereq_, module, exports) {
      var getNative = _dereq_('../internal/getNative'),
          isArrayLike = _dereq_('../internal/isArrayLike'),
          isObject = _dereq_('../lang/isObject'),
          shimKeys = _dereq_('../internal/shimKeys');

      /* Native method references for those with the same name as other `lodash` methods. */
      var nativeKeys = getNative(Object, 'keys');

      /**
       * Creates an array of the own enumerable property names of `object`.
       *
       * **Note:** Non-object values are coerced to objects. See the
       * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
       * for more details.
       *
       * @static
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
      var keys = !nativeKeys ? shimKeys : function(object) {
        var Ctor = object == null ? undefined : object.constructor;
        if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
            (typeof object != 'function' && isArrayLike(object))) {
          return shimKeys(object);
        }
        return isObject(object) ? nativeKeys(object) : [];
      };

      module.exports = keys;

    }, {
      "../internal/getNative": 35,
      "../internal/isArrayLike": 37,
      "../internal/shimKeys": 43,
      "../lang/isObject": 50
    }],
    53: [function(_dereq_, module, exports) {
      var isArguments = _dereq_('../lang/isArguments'),
          isArray = _dereq_('../lang/isArray'),
          isIndex = _dereq_('../internal/isIndex'),
          isLength = _dereq_('../internal/isLength'),
          isObject = _dereq_('../lang/isObject');

      /** Used for native method references. */
      var objectProto = Object.prototype;

      /** Used to check objects for own properties. */
      var hasOwnProperty = objectProto.hasOwnProperty;

      /**
       * Creates an array of the own and inherited enumerable property names of `object`.
       *
       * **Note:** Non-object values are coerced to objects.
       *
       * @static
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
       * _.keysIn(new Foo);
       * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
       */
      function keysIn(object) {
        if (object == null) {
          return [];
        }
        if (!isObject(object)) {
          object = Object(object);
        }
        var length = object.length;
        length = (length && isLength(length) &&
            (isArray(object) || isArguments(object)) && length) || 0;

        var Ctor = object.constructor,
            index = -1,
            isProto = typeof Ctor == 'function' && Ctor.prototype === object,
            result = Array(length),
            skipIndexes = length > 0;

        while (++index < length) {
          result[index] = (index + '');
        }
        for (var key in object) {
          if (!(skipIndexes && isIndex(key, length)) &&
              !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
            result.push(key);
          }
        }
        return result;
      }

      module.exports = keysIn;

    }, {
      "../internal/isIndex": 38,
      "../internal/isLength": 40,
      "../lang/isArguments": 46,
      "../lang/isArray": 47,
      "../lang/isObject": 50
    }],
    54: [function(_dereq_, module, exports) {
      var createObjectMapper = _dereq_('../internal/createObjectMapper');

      /**
       * Creates an object with the same keys as `object` and values generated by
       * running each own enumerable property of `object` through `iteratee`. The
       * iteratee function is bound to `thisArg` and invoked with three arguments:
       * (value, key, object).
       *
       * If a property name is provided for `iteratee` the created `_.property`
       * style callback returns the property value of the given element.
       *
       * If a value is also provided for `thisArg` the created `_.matchesProperty`
       * style callback returns `true` for elements that have a matching property
       * value, else `false`.
       *
       * If an object is provided for `iteratee` the created `_.matches` style
       * callback returns `true` for elements that have the properties of the given
       * object, else `false`.
       *
       * @static
       * @memberOf _
       * @category Object
       * @param {Object} object The object to iterate over.
       * @param {Function|Object|string} [iteratee=_.identity] The function invoked
       *  per iteration.
       * @param {*} [thisArg] The `this` binding of `iteratee`.
       * @returns {Object} Returns the new mapped object.
       * @example
       *
       * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
             *   return n * 3;
             * });
       * // => { 'a': 3, 'b': 6 }
       *
       * var users = {
             *   'fred':    { 'user': 'fred',    'age': 40 },
             *   'pebbles': { 'user': 'pebbles', 'age': 1 }
             * };
       *
       * // using the `_.property` callback shorthand
       * _.mapValues(users, 'age');
       * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
       */
      var mapValues = createObjectMapper();

      module.exports = mapValues;

    }, {
      "../internal/createObjectMapper": 29
    }],
    55: [function(_dereq_, module, exports) {
      var keys = _dereq_('./keys'),
          toObject = _dereq_('../internal/toObject');

      /**
       * Creates a two dimensional array of the key-value pairs for `object`,
       * e.g. `[[key1, value1], [key2, value2]]`.
       *
       * @static
       * @memberOf _
       * @category Object
       * @param {Object} object The object to query.
       * @returns {Array} Returns the new array of key-value pairs.
       * @example
       *
       * _.pairs({ 'barney': 36, 'fred': 40 });
       * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
       */
      function pairs(object) {
        object = toObject(object);

        var index = -1,
            props = keys(object),
            length = props.length,
            result = Array(length);

        while (++index < length) {
          var key = props[index];
          result[index] = [key, object[key]];
        }
        return result;
      }

      module.exports = pairs;

    }, {
      "../internal/toObject": 44,
      "./keys": 52
    }],
    56: [function(_dereq_, module, exports) {
      /**
       * This method returns the first argument provided to it.
       *
       * @static
       * @memberOf _
       * @category Utility
       * @param {*} value Any value.
       * @returns {*} Returns `value`.
       * @example
       *
       * var object = { 'user': 'fred' };
       *
       * _.identity(object) === object;
       * // => true
       */
      function identity(value) {
        return value;
      }

      module.exports = identity;

    }, {}],
    57: [function(_dereq_, module, exports) {
      var baseProperty = _dereq_('../internal/baseProperty'),
          basePropertyDeep = _dereq_('../internal/basePropertyDeep'),
          isKey = _dereq_('../internal/isKey');

      /**
       * Creates a function that returns the property value at `path` on a
       * given object.
       *
       * @static
       * @memberOf _
       * @category Utility
       * @param {Array|string} path The path of the property to get.
       * @returns {Function} Returns the new function.
       * @example
       *
       * var objects = [
       *   { 'a': { 'b': { 'c': 2 } } },
       *   { 'a': { 'b': { 'c': 1 } } }
       * ];
       *
       * _.map(objects, _.property('a.b.c'));
       * // => [2, 1]
       *
       * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
       * // => [1, 2]
       */
      function property(path) {
        return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
      }

      module.exports = property;

    }, {
      "../internal/baseProperty": 20,
      "../internal/basePropertyDeep": 21,
      "../internal/isKey": 39
    }],
    58: [function(_dereq_, module, exports) {
      // Most of these are according to this table: http://www.ssicom.org/js/x171166.htm
      // However where nodejs readline diverges, they are adjusted to conform to it
      module.exports = {
        nomod: {
          escape: '\u001b',
          space: ' ' // actually '\u0020'
        },
        ctrl: {
          ' ': '\u0000',
          'a': '\u0001',
          'b': '\u0002',
          'c': '\u0003',
          'd': '\u0004',
          'e': '\u0005',
          'f': '\u0006',
          'g': '\u0007',
          'h': '\u0008',
          'i': '\u0009',
          'j': '\u000a',
          'k': '\u000b',
          'm': '\u000c',
          'n': '\u000d',
          'l': '\u000e',
          'o': '\u000f',
          'p': '\u0010',
          'q': '\u0011',
          'r': '\u0012',
          's': '\u0013',
          't': '\u0014',
          'u': '\u0015',
          'v': '\u0016',
          'w': '\u0017',
          'x': '\u0018',
          'y': '\u0019',
          'z': '\u001a',
          '[': '\u001b',
          '\\': '\u001c',
          ']': '\u001d',
          '^': '\u001e',
          '_': '\u001f'

          ,
          'space': '\u0000'
        }
      };

    }, {}],
    59: [function(_dereq_, module, exports) {
      'use strict';

      var keycodes = _dereq_('./keycodes');

      function assertKeyString(s) {
        if (!/^(ctrl-|shift-|alt-|meta-){0,4}\w+$/.test(s))
          throw new Error('The string to parse needs to be of the format "c", "ctrl-c", "shift-ctrl-c".');
      }

      module.exports = function parse(s) {
        var keyString = s.trim().toLowerCase();

        assertKeyString(keyString);

        var key = {
              name: undefined,
              ctrl: false,
              meta: false,
              shift: false,
              alt: false,
              sequence: undefined
            },
            parts = keyString.split('-'),
            c;

        key.name = parts.pop();
        while ((c = parts.pop())) key[c] = true;
        key.sequence = key.ctrl ?
                       keycodes.ctrl[key.name] || key.name :
                       keycodes.nomod[key.name] || key.name;

        // uppercase sequence for single chars when shift was pressed
        if (key.shift && key.sequence && key.sequence.length === 1)
          key.sequence = key.sequence.toUpperCase();

        return key;
      };

    }, {
      "./keycodes": 58
    }],
    60: [function(_dereq_, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var ActionTypes = exports.ActionTypes = {
        PERFORM_ACTION: 'PERFORM_ACTION',
        RESET: 'RESET',
        ROLLBACK: 'ROLLBACK',
        COMMIT: 'COMMIT',
        SWEEP: 'SWEEP',
        TOGGLE_ACTION: 'TOGGLE_ACTION',
        JUMP_TO_STATE: 'JUMP_TO_STATE',
        IMPORT_STATE: 'IMPORT_STATE'
      };

      var ActionCreators = exports.ActionCreators = {
        performAction: function performAction(action) {
          return {
            type: ActionTypes.PERFORM_ACTION,
            action: action,
            timestamp: Date.now()
          };
        },
        reset: function reset() {
          return {
            type: ActionTypes.RESET,
            timestamp: Date.now()
          };
        },
        rollback: function rollback() {
          return {
            type: ActionTypes.ROLLBACK,
            timestamp: Date.now()
          };
        },
        commit: function commit() {
          return {
            type: ActionTypes.COMMIT,
            timestamp: Date.now()
          };
        },
        sweep: function sweep() {
          return {
            type: ActionTypes.SWEEP
          };
        },
        toggleAction: function toggleAction(id) {
          return {
            type: ActionTypes.TOGGLE_ACTION,
            id: id
          };
        },
        jumpToState: function jumpToState(index) {
          return {
            type: ActionTypes.JUMP_TO_STATE,
            index: index
          };
        },
        importState: function importState(nextLiftedState) {
          return {
            type: ActionTypes.IMPORT_STATE,
            nextLiftedState: nextLiftedState
          };
        }
      };

    }, {}],
    61: [function(_dereq_, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.DevToolsActionCreatorsService = undefined;

      var _actions = _dereq_('./actions');

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var DevToolsActionCreatorsService = exports.DevToolsActionCreatorsService = function DevToolsActionCreatorsService() {
        _classCallCheck(this, DevToolsActionCreatorsService);

        Object.assign(this, _actions.ActionCreators);
      };

    }, {
      "./actions": 60
    }],
    62: [function(_dereq_, module, exports) {
      'use strict';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })(); /* eslint complexity: 0 */

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.DevToolsServiceProvider = undefined;

      var _difference = _dereq_('lodash/array/difference');

      var _difference2 = _interopRequireDefault(_difference);

      var _mapValues = _dereq_('lodash/object/mapValues');

      var _mapValues2 = _interopRequireDefault(_mapValues);

      var _identity = _dereq_('lodash/utility/identity');

      var _identity2 = _interopRequireDefault(_identity);

      var _devToolsService = _dereq_('./dev-tools-service');

      var _actions = _dereq_('./actions');

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
          }
          return arr2;
        } else {
          return Array.from(arr);
        }
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var DevToolsServiceProvider = exports.DevToolsServiceProvider = (function() {
        DevToolsServiceProvider.$inject = ["$injector", "$logProvider", "$windowProvider"];

        function DevToolsServiceProvider($injector, $logProvider, $windowProvider) {
          'ngInject';

          _classCallCheck(this, DevToolsServiceProvider);

          this.monitorReducers = [];
          this.INIT_ACTION = {
            type: '@@INIT'
          };

          this.$log = $injector.invoke($logProvider.$get, null, {
            $window: $windowProvider.$get()
          });
        }

        _createClass(DevToolsServiceProvider, [{
          key: 'registerReducer',
          value: function registerReducer(reducer) {
            this.monitorReducers.push(reducer);
          }
        }, {
          key: 'computeNextEntry',
          value: function computeNextEntry(reducer, action, state, error) {
            if (error) {
              return {
                state: state,
                error: 'Interrupted by an error up the chain'
              };
            }

            var nextState = state;
            var nextError = undefined;
            try {
              nextState = reducer(state, action);
            } catch (err) {
              nextError = err.toString();
              this.$log.error(err.stack || err);
            }

            return {
              state: nextState,
              error: nextError
            };
          }
        }, {
          key: 'recomputeStates',
          value: function recomputeStates(states, minStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds) {
            // Optimization: exit early and return the same reference
            // if we know nothing could have changed.
            if (minStateIndex >= states.length && states.length === stagedActionIds.length) {
              return states;
            }

            var nextComputedStates = states.slice(0, minStateIndex);
            for (var i = minStateIndex; i < stagedActionIds.length; i += 1) {
              var stagedActionId = stagedActionIds[i];
              var action = actionsById[stagedActionId].action;

              var previousEntry = nextComputedStates[i - 1];
              var previousState = previousEntry ? previousEntry.state : committedState;
              var previousError = previousEntry ? previousEntry.error : undefined; // eslint-disable-line no-undefined

              var shouldSkip = skippedActionIds.indexOf(stagedActionId) > -1;
              var entry = shouldSkip ? previousEntry : this.computeNextEntry(reducer, action, previousState, previousError);

              nextComputedStates.push(entry);
            }

            return nextComputedStates;
          }
        }, {
          key: 'unliftStore',
          value: function unliftStore(liftedStore, liftReducer) {
            var lastDefinedState = undefined;

            return Object.assign({}, liftedStore, {
              liftedStore: liftedStore,

              dispatch: function dispatch(action) {
                liftedStore.dispatch(DevToolsServiceProvider.liftAction(action));
                return action;
              },
              getState: function getState() {
                var state = DevToolsServiceProvider.unliftState(liftedStore.getState());
                if (!!state) {
                  lastDefinedState = state;
                }
                return lastDefinedState;
              },
              replaceReducer: function replaceReducer(nextReducer) {
                liftedStore.replaceReducer(liftReducer(nextReducer));
              }
            });
          }
        }, {
          key: 'liftReducerWith',
          value: function liftReducerWith(reducer, initialCommittedState, monitorReducer) {
            var _this = this;

            var initialLiftedState = {
              monitorState: monitorReducer(undefined, {}), // eslint-disable-line no-undefined
              nextActionId: 1,
              actionsById: {
                0: DevToolsServiceProvider.liftAction(this.INIT_ACTION)
              },
              stagedActionIds: [0],
              skippedActionIds: [],
              committedState: initialCommittedState,
              currentStateIndex: 0,
              computedStates: []
            };

            // Manages how the history actions modify the history state.
            return function() {
              var liftedState = arguments.length <= 0 || arguments[0] === undefined ? initialLiftedState : arguments[0];
              var liftedAction = arguments[1];
              var monitorState = liftedState.monitorState;
              var actionsById = liftedState.actionsById;
              var nextActionId = liftedState.nextActionId;
              var stagedActionIds = liftedState.stagedActionIds;
              var skippedActionIds = liftedState.skippedActionIds;
              var committedState = liftedState.committedState;
              var currentStateIndex = liftedState.currentStateIndex;
              var computedStates = liftedState.computedStates;

              // By default, agressively recompute every state whatever happens.
              // This has O(n) performance, so we'll override this to a sensible
              // value whenever we feel like we don't have to recompute the states.

              var minInvalidatedStateIndex = 0;

              switch (liftedAction.type) {
                case _actions.ActionTypes.RESET:
                  // Get back to the state the store was created with.
                  actionsById = {
                    0: DevToolsServiceProvider.liftAction(_this.INIT_ACTION)
                  };
                  nextActionId = 1;
                  stagedActionIds = [0];
                  skippedActionIds = [];
                  committedState = initialCommittedState;
                  currentStateIndex = 0;
                  computedStates = [];
                  break;
                case _actions.ActionTypes.COMMIT:
                  // Consider the last committed state the new starting point.
                  // Squash any staged actions into a single committed state.
                  actionsById = {
                    0: DevToolsServiceProvider.liftAction(_this.INIT_ACTION)
                  };
                  nextActionId = 1;
                  stagedActionIds = [0];
                  skippedActionIds = [];
                  committedState = computedStates[currentStateIndex].state;
                  currentStateIndex = 0;
                  computedStates = [];
                  break;
                case _actions.ActionTypes.ROLLBACK:
                  // Forget about any staged actions.
                  // Start again from the last committed state.
                  actionsById = {
                    0: DevToolsServiceProvider.liftAction(_this.INIT_ACTION)
                  };
                  nextActionId = 1;
                  stagedActionIds = [0];
                  skippedActionIds = [];
                  currentStateIndex = 0;
                  computedStates = [];
                  break;
                case _actions.ActionTypes.TOGGLE_ACTION:
                  // Toggle whether an action with given ID is skipped.
                  // Being skipped means it is a no-op during the computation.
                  var liftedActionId = liftedAction.id;

                  var index = skippedActionIds.indexOf(liftedActionId);
                  if (index === -1) {
                    skippedActionIds = [liftedActionId].concat(_toConsumableArray(skippedActionIds));
                  } else {
                    skippedActionIds = skippedActionIds.filter(function(id) {
                      return id !== liftedActionId;
                    });
                  }
                  // Optimization: we know history before this action hasn't changed
                  minInvalidatedStateIndex = stagedActionIds.indexOf(liftedActionId);
                  break;
                case _actions.ActionTypes.JUMP_TO_STATE:
                  // Without recomputing anything, move the pointer that tell us
                  // which state is considered the current one. Useful for sliders.
                  currentStateIndex = liftedAction.index;
                  // Optimization: we know the history has not changed.
                  minInvalidatedStateIndex = Infinity;
                  break;
                case _actions.ActionTypes.SWEEP:
                  // Forget any actions that are currently being skipped.
                  stagedActionIds = (0, _difference2.default)(stagedActionIds, skippedActionIds);
                  skippedActionIds = [];
                  currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
                  break;
                case _actions.ActionTypes.PERFORM_ACTION:
                  if (currentStateIndex === stagedActionIds.length - 1) {
                    currentStateIndex += 1;
                  }
                  var actionId = nextActionId;
                  nextActionId += 1;
                  // Mutation! This is the hottest path, and we optimize on purpose.
                  // It is safe because we set a new key in a cache dictionary.
                  actionsById[actionId] = liftedAction;
                  stagedActionIds = [].concat(_toConsumableArray(stagedActionIds), [actionId]);
                  // Optimization: we know that only the new action needs computing.
                  minInvalidatedStateIndex = stagedActionIds.length - 1;
                  break;
                case _actions.ActionTypes.IMPORT_STATE:
                  var _liftedAction$nextLif = liftedAction.nextLiftedState;
                  // Completely replace everything.

                  monitorState = _liftedAction$nextLif.monitorState;
                  actionsById = _liftedAction$nextLif.actionsById;
                  nextActionId = _liftedAction$nextLif.nextActionId;
                  stagedActionIds = _liftedAction$nextLif.stagedActionIds;
                  skippedActionIds = _liftedAction$nextLif.skippedActionIds;
                  committedState = _liftedAction$nextLif.committedState;
                  currentStateIndex = _liftedAction$nextLif.currentStateIndex;
                  computedStates = _liftedAction$nextLif.computedStates;

                  break;
                case '@@redux/INIT':
                  // Always recompute states on hot reload and init.
                  minInvalidatedStateIndex = 0;
                  break;
                default:
                  // If the action is not recognized, it's a monitor action.
                  // Optimization: a monitor action can't change history.
                  minInvalidatedStateIndex = Infinity;
                  break;
              }

              computedStates = _this.recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds);
              monitorState = monitorReducer(monitorState, liftedAction);
              return {
                monitorState: monitorState,
                actionsById: actionsById,
                nextActionId: nextActionId,
                stagedActionIds: stagedActionIds,
                skippedActionIds: skippedActionIds,
                committedState: committedState,
                currentStateIndex: currentStateIndex,
                computedStates: computedStates
              };
            };
          }
        }, {
          key: 'liftReducer',
          value: function liftReducer(reducer, initialState) {
            var _this2 = this;

            return this.liftReducerWith(reducer, initialState, function(state, action) {
              return _this2.monitorReducers.reduce(function(s, r) {
                return r(s, action);
              }, state);
            });
          }
        }, {
          key: 'instrument',
          value: function instrument() {
            var _this3 = this;

            return function(createStore) {
              return function(reducer, initialState) {
                var liftedStore = createStore(_this3.liftReducer(reducer, initialState));
                return _this3.unliftStore(liftedStore, _this3.liftReducer);
              };
            };
          }
        }, {
          key: 'persistState',
          value: function persistState(sessionId) {
            var _this4 = this;

            var deserializeState = arguments.length <= 1 || arguments[1] === undefined ? _identity2.default : arguments[1];
            var deserializeAction = arguments.length <= 2 || arguments[2] === undefined ? _identity2.default : arguments[2];

            if (!sessionId) {
              return function(next) {
                return function() {
                  return next.apply(undefined, arguments);
                };
              };
            }

            function deserialize(state) {
              return Object.assign({}, state, {
                actionsById: (0, _mapValues2.default)(state.actionsById, function(liftedAction) {
                  return Object.assign({}, liftedAction, {
                    action: deserializeAction(liftedAction.action)
                  });
                }),
                committedState: deserializeState(state.committedState),
                computedStates: state.computedStates.map(function(computedState) {
                  return Object.assign({}, computedState, {
                    state: deserializeState(computedState.state)
                  });
                })
              });
            }

            return function(next) {
              return function(reducer, initialState) {
                var key = 'redux-dev-session-' + sessionId;

                var finalInitialState = undefined;
                try {
                  var json = localStorage.getItem(key);
                  if (json) {
                    finalInitialState = deserialize(JSON.parse(json)) || initialState;
                    next(reducer, initialState);
                  }
                } catch (e) {
                  _this4.$log.warn('Could not read debug session from localStorage:', e);
                  try {
                    localStorage.removeItem(key);
                  } finally {
                    finalInitialState = undefined; // eslint-disable-line no-undefined
                  }
                }

                var store = next(reducer, finalInitialState);

                return Object.assign({}, store, {
                  dispatch: function dispatch(action) {
                    store.dispatch(action);

                    try {
                      localStorage.setItem(key, JSON.stringify(store.getState()));
                    } catch (e) {
                      this.$log.warn('Could not write debug session to localStorage:', e);
                    }

                    return action;
                  }
                });
              };
            };
          }
        }, {
          key: '$get',
          value: ["$ngRedux", function $get($ngRedux) {
            'ngInject';

            return new _devToolsService.DevToolsService($ngRedux);
          }]
        }], [{
          key: 'liftAction',
          value: function liftAction(action) {
            return _actions.ActionCreators.performAction(action);
          }
        }, {
          key: 'unliftState',
          value: function unliftState(liftedState) {
            var computedStates = liftedState.computedStates;
            var currentStateIndex = liftedState.currentStateIndex;
            var state = computedStates[currentStateIndex].state;

            return state;
          }
        }]);

        return DevToolsServiceProvider;
      })();

    }, {
      "./actions": 60,
      "./dev-tools-service": 63,
      "lodash/array/difference": 2,
      "lodash/object/mapValues": 54,
      "lodash/utility/identity": 56
    }],
    63: [function(_dereq_, module, exports) {
      'use strict';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var DevToolsService = exports.DevToolsService = (function() {
        DevToolsService.$inject = ["store"];

        function DevToolsService(store) {
          'ngInject';

          _classCallCheck(this, DevToolsService);

          this.defaultMapStateToTarget = function() {
            return {};
          };
          this.defaultMapDispatchToTarget = function(dispatch) {
            return {
              dispatch: dispatch
            };
          };
          this.store = store.liftedStore;
        }

        _createClass(DevToolsService, [{
          key: 'connect',
          value: function connect(mapStateToTarget, mapDispatchToTarget) {
            var _this = this;

            var finalMapStateToTarget = mapStateToTarget || this.defaultMapStateToTarget;
            var finalMapDispatchToTarget = mapDispatchToTarget || this.defaultMapDispatchToTarget;

            var slice = finalMapStateToTarget(this.store.getState());

            var boundActionCreators = finalMapDispatchToTarget(this.store.dispatch);

            return function(target) {
              _this.updateTarget(target, slice, boundActionCreators);

              return _this.store.subscribe(function() {
                var nextSlice = finalMapStateToTarget(_this.store.getState());
                if (!_this.shallowEqual(slice, nextSlice)) {
                  slice = nextSlice;
                  _this.updateTarget(target, slice, boundActionCreators);
                }
              });
            };
          }
        }, {
          key: 'updateTarget',
          value: function updateTarget(target, stateSlice, dispatch) {
            if (typeof target === 'function') {
              target(stateSlice, dispatch);
            } else {
              Object.assign(target, stateSlice, dispatch);
            }
          }
        }, {
          key: 'shallowEqual',
          value: function shallowEqual(objA, objB) {
            if (objA === objB) {
              return true;
            }

            /* $$hashKey is added by angular when using ng-repeat, we ignore that*/
            var keysA = Object.keys(objA).filter(function(k) {
              return k !== '$$hashKey';
            });
            var keysB = Object.keys(objB).filter(function(k) {
              return k !== '$$hashKey';
            });

            if (keysA.length !== keysB.length) {
              return false;
            }

            // Test for A's keys different from B.
            var hasOwn = Object.prototype.hasOwnProperty;
            for (var i = 0; i < keysA.length; i += 1) {
              if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
                return false;
              }
            }

            return true;
          }
        }]);

        return DevToolsService;
      })();

    }, {}],
    64: [function(_dereq_, module, exports) {
      (function(global) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var _angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

        var _devToolsServiceProvider = _dereq_('./dev-tools-service-provider');

        var _devToolsActionCreatorsService = _dereq_('./dev-tools-action-creators-service');

        exports.default = (0, _angular.module)('ngReduxDevToolsServices', ['ngRedux']).provider('devToolsService', _devToolsServiceProvider.DevToolsServiceProvider).service('devToolsActionCreatorsService', _devToolsActionCreatorsService.DevToolsActionCreatorsService).name;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./dev-tools-action-creators-service": 61,
      "./dev-tools-service-provider": 62
    }],
    65: [function(_dereq_, module, exports) {
      'use strict';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.DockMonitorController = undefined;

      var _reducer = _dereq_('../reducer');

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var DockMonitorController = exports.DockMonitorController = (function() {
        DockMonitorController.$inject = ["devToolsService", "$scope"];

        function DockMonitorController(devToolsService, $scope) {
          'ngInject';

          _classCallCheck(this, DockMonitorController);

          var unsubscribe = devToolsService.connect(function(state) {
            return state;
          })(this);
          $scope.$on('$destroy', unsubscribe);

          this.store = devToolsService.store;

          if (this.defaultVisible) {
            this.store.dispatch((0, _reducer.toggleVisibility)());
          }
        }

        _createClass(DockMonitorController, [{
          key: 'getDockMonitorClass',
          value: function getDockMonitorClass() {
            return 'dock-monitor--' + (this.monitorState.isVisible ? 'visible' : 'hidden');
          }
        }, {
          key: 'toggleVisibility',
          value: function toggleVisibility() {
            this.store.dispatch((0, _reducer.toggleVisibility)());
          }
        }]);

        return DockMonitorController;
      })();

    }, {
      "../reducer": 69
    }],
    66: [function(_dereq_, module, exports) {
      module.exports = "<div ng-class=\"dockMonitorCtrl.getDockMonitorClass()\">\n  <div class=\"dock-monitor__container\" ng-transclude></div>\n  <div class=\"dock-monitor__resize-hook\"></div>\n</div>\n";

    }, {}],
    67: [function(_dereq_, module, exports) {
      (function(global) {
        'use strict';

        dockMonitorDirective.$inject = ["$window", "$document"];
        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.default = dockMonitorDirective;

        var _angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

        var _angular2 = _interopRequireDefault(_angular);

        var _parseKey = _dereq_('parse-key');

        var _parseKey2 = _interopRequireDefault(_parseKey);

        var _dockMonitorDirective = _dereq_('./dock-monitor-directive.html');

        var _dockMonitorDirective2 = _interopRequireDefault(_dockMonitorDirective);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
            default: obj
          };
        }

        function dockMonitorDirective($window, $document) {
          'ngInject';

          return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: _dockMonitorDirective2.default,
            scope: {},
            bindToController: {
              defaultSize: '=',
              defaultVisible: '=',
              toggleVisibilityKey: '='
            },
            controllerAs: 'dockMonitorCtrl',
            controller: 'DockMonitorController',
            link: function link(scope, elem) {
              var $hook = _angular2.default.element(elem[0].querySelector('.dock-monitor__resize-hook'));

              if (scope.dockMonitorCtrl.defaultSize) {
                elem.css('width', '' + scope.dockMonitorCtrl.defaultSize);
              }

              function matchesKey(key, event) {
                var charCode = event.keyCode || event.which;
                var char = String.fromCharCode(charCode);
                return key.name.toUpperCase() === char.toUpperCase() && key.alt === event.altKey && key.ctrl === event.ctrlKey && key.meta === event.metaKey && key.shift === event.shiftKey;
              }

              function mouseMoveListener(e) {
                elem.css('width', $window.innerWidth - e.pageX + 'px');
                e.preventDefault();
              }

              function mouseUpListener() {
                $document.off('mousemove', mouseMoveListener);
              }

              function mouseDownListener(e) {
                $document.on('mousemove', mouseMoveListener).on('mouseup', mouseUpListener);
                e.preventDefault();
              }

              function keyDownListener(e) {
                var visibilityKey = (0, _parseKey2.default)(scope.dockMonitorCtrl.toggleVisibilityKey || 'ctrl-h');

                if (matchesKey(visibilityKey, e)) {
                  scope.dockMonitorCtrl.toggleVisibility();
                  scope.$digest();
                  e.preventDefault();
                }
              }

              $hook.on('mousedown', mouseDownListener);
              $document.on('keydown', keyDownListener);
            }
          };
        }

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./dock-monitor-directive.html": 66,
      "parse-key": 59
    }],
    68: [function(_dereq_, module, exports) {
      (function(global) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var _angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

        var _devToolsServices = _dereq_('../dev-tools-services');

        var _devToolsServices2 = _interopRequireDefault(_devToolsServices);

        var _dockMonitorDirective = _dereq_('./dock-monitor-directive/dock-monitor-directive');

        var _dockMonitorDirective2 = _interopRequireDefault(_dockMonitorDirective);

        var _dockMonitorController = _dereq_('./dock-monitor-directive/dock-monitor-controller');

        var _reducer = _dereq_('./reducer');

        var _reducer2 = _interopRequireDefault(_reducer);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
            default: obj
          };
        }

        exports.default = (0, _angular.module)('ngDockMonitor', [_devToolsServices2.default]).directive('dockMonitor', _dockMonitorDirective2.default).controller('DockMonitorController', _dockMonitorController.DockMonitorController).config(["devToolsServiceProvider", function(devToolsServiceProvider) {
          'ngInject';

          devToolsServiceProvider.registerReducer(_reducer2.default);
        }]).name;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "../dev-tools-services": 64,
      "./dock-monitor-directive/dock-monitor-controller": 65,
      "./dock-monitor-directive/dock-monitor-directive": 67,
      "./reducer": 69
    }],
    69: [function(_dereq_, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.toggleVisibility = toggleVisibility;
      exports.isVisible = isVisible;

      exports.default = function() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var action = arguments[1];

        return {
          isVisible: isVisible(state.isVisible, action)
        };
      };

      var TOGGLE_VISIBILITY = exports.TOGGLE_VISIBILITY = '@@redux-ng-devtools/TOGGLE_VISIBILITY';

      function toggleVisibility() {
        return {
          type: TOGGLE_VISIBILITY
        };
      }

      function isVisible() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
        var action = arguments[1];

        return action.type === TOGGLE_VISIBILITY ? !state : state;
      }

    }, {}],
    70: [function(_dereq_, module, exports) {
      (function(global) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
          value: true
        });
        exports.ActionCreators = undefined;

        var _actions = _dereq_('./dev-tools-services/actions');

        Object.defineProperty(exports, 'ActionCreators', {
          enumerable: true,
          get: function get() {
            return _actions.ActionCreators;
          }
        });

        var _angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

        var _angular2 = _interopRequireDefault(_angular);

        var _dockMonitor = _dereq_('./dock-monitor');

        var _dockMonitor2 = _interopRequireDefault(_dockMonitor);

        var _logMonitor = _dereq_('./log-monitor');

        var _logMonitor2 = _interopRequireDefault(_logMonitor);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
            default: obj
          };
        }

        exports.default = _angular2.default.module('ngReduxDevTools', [_dockMonitor2.default, _logMonitor2.default]).name;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "./dev-tools-services/actions": 60,
      "./dock-monitor": 68,
      "./log-monitor": 71
    }],
    71: [function(_dereq_, module, exports) {
      (function(global) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
          value: true
        });

        var _angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

        _dereq_('angular-recursion');

        var _logMonitorButtonDirective = _dereq_('./log-monitor-button-directive/log-monitor-button-directive');

        var _logMonitorButtonDirective2 = _interopRequireDefault(_logMonitorButtonDirective);

        var _logMonitorDirective = _dereq_('./log-monitor-directive/log-monitor-directive');

        var _logMonitorDirective2 = _interopRequireDefault(_logMonitorDirective);

        var _logMonitorController = _dereq_('./log-monitor-directive/log-monitor-controller');

        var _logMonitorEntryDirective = _dereq_('./log-monitor-entry-directive/log-monitor-entry-directive');

        var _logMonitorEntryDirective2 = _interopRequireDefault(_logMonitorEntryDirective);

        var _logMonitorEntryController = _dereq_('./log-monitor-entry-directive/log-monitor-entry-controller');

        var _logMonitorJsonDirective = _dereq_('./log-monitor-json-directive/log-monitor-json-directive');

        var _logMonitorJsonDirective2 = _interopRequireDefault(_logMonitorJsonDirective);

        var _logMonitorJsonController = _dereq_('./log-monitor-json-directive/log-monitor-json-controller');

        var _devToolsServices = _dereq_('../dev-tools-services');

        var _devToolsServices2 = _interopRequireDefault(_devToolsServices);

        function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
            default: obj
          };
        }

        exports.default = (0, _angular.module)('ngReduxDevTools.logMonitor', [_devToolsServices2.default, 'RecursionHelper']).directive('logMonitor', _logMonitorDirective2.default).directive('lmButton', _logMonitorButtonDirective2.default).directive('lmEntry', _logMonitorEntryDirective2.default).directive('lmJson', _logMonitorJsonDirective2.default).controller('LogMonitorController', _logMonitorController.LogMonitorController).controller('LogMonitorEntryController', _logMonitorEntryController.LogMonitorEntryController).controller('LogMonitorJSONController', _logMonitorJsonController.LogMonitorJSONController).name;

      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
      "../dev-tools-services": 64,
      "./log-monitor-button-directive/log-monitor-button-directive": 72,
      "./log-monitor-directive/log-monitor-controller": 73,
      "./log-monitor-directive/log-monitor-directive": 75,
      "./log-monitor-entry-directive/log-monitor-entry-controller": 76,
      "./log-monitor-entry-directive/log-monitor-entry-directive": 78,
      "./log-monitor-json-directive/log-monitor-json-controller": 79,
      "./log-monitor-json-directive/log-monitor-json-directive": 81,
      "angular-recursion": 1
    }],
    72: [function(_dereq_, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = logMonitorButtonDirective;

      function logMonitorButtonDirective() {
        return {
          restrict: 'E',
          replace: true,
          transclude: true,
          template: '\n      <button\n       ng-class="logMonitorBtnCtrl.getBtnClass()"\n       ng-disabled="!logMonitorBtnCtrl.enabled" ng-transclude></button>',
          scope: {},
          bindToController: {
            enabled: '='
          },
          controllerAs: 'logMonitorBtnCtrl',
          controller: function controller() {
            this.getBtnClass = function() {
              return 'log-monitor__button' + (this.enabled ? '--enabled' : '--disabled');
            };
          }
        };
      }

    }, {}],
    73: [function(_dereq_, module, exports) {
      'use strict';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var LogMonitorController = exports.LogMonitorController = (function() {
        LogMonitorController.$inject = ["devToolsService", "devToolsActionCreatorsService", "$scope"];

        function LogMonitorController(devToolsService, devToolsActionCreatorsService, $scope) {
          'ngInject';

          _classCallCheck(this, LogMonitorController);

          var unsubscribe = devToolsService.connect(this.select || function(state) {
                return state;
              })(this);
          $scope.$on('$destroy', unsubscribe);

          this.store = devToolsService.store;
          this.actions = devToolsActionCreatorsService;
          this.$scope = $scope;
        }

        _createClass(LogMonitorController, [{
          key: 'getActionById',
          value: function getActionById(actionId) {
            return this.actionsById[actionId].action;
          }
        }, {
          key: 'getError',
          value: function getError(index) {
            return this.computedStates[index].error;
          }
        }, {
          key: 'getComputedState',
          value: function getComputedState(index) {
            return this.computedStates[index].state;
          }
        }, {
          key: 'getPreviousComputedState',
          value: function getPreviousComputedState(index) {
            return index > 0 ? this.computedStates[index - 1].state : null;
          }
        }, {
          key: 'isSkippedAction',
          value: function isSkippedAction(id) {
            return this.skippedActionIds.indexOf(id) > -1;
          }
        }, {
          key: 'handleToggleAction',
          value: function handleToggleAction(id) {
            if (id > 0) {
              this.store.dispatch(this.actions.toggleAction(id));
            }
          }
        }, {
          key: 'reset',
          value: function reset() {
            this.store.dispatch(this.actions.reset());
          }
        }, {
          key: 'revert',
          value: function revert() {
            this.store.dispatch(this.actions.rollback());
          }
        }, {
          key: 'sweep',
          value: function sweep() {
            this.store.dispatch(this.actions.sweep());
          }
        }, {
          key: 'commit',
          value: function commit() {
            this.store.dispatch(this.actions.commit());
          }
        }, {
          key: 'hasComputedStates',
          value: function hasComputedStates() {
            return this.computedStates.length > 1;
          }
        }, {
          key: 'hasSkippedActions',
          value: function hasSkippedActions() {
            return this.skippedActionIds.length > 0;
          }
        }]);

        return LogMonitorController;
      })();

    }, {}],
    74: [function(_dereq_, module, exports) {
      module.exports = "<div class=\"log-monitor\">\n  <div class=\"log-monitor__button-group\">\n    <lm-button ng-click=\"logMonitorCtrl.reset()\" enabled=\"true\">Reset</lm-button>\n    <lm-button ng-click=\"logMonitorCtrl.revert()\" enabled=\"logMonitorCtrl.hasComputedStates()\">Revert</lm-button>\n    <lm-button ng-click=\"logMonitorCtrl.sweep()\" enabled=\"logMonitorCtrl.hasSkippedActions()\">Sweep</lm-button>\n    <lm-button ng-click=\"logMonitorCtrl.commit()\" enabled=\"logMonitorCtrl.hasComputedStates()\">Commit</lm-button>\n  </div>\n  <div class=\"log-monitor__entries\">\n    <lm-entry\n      ng-repeat=\"actionId in logMonitorCtrl.stagedActionIds track by $index\"\n      action-id=\"::actionId\"\n      action=\"::logMonitorCtrl.getActionById(actionId)\"\n      state=\"logMonitorCtrl.getComputedState($index)\"\n      error=\"logMonitorCtrl.getError($index)\"\n      previous-state=\"::logMonitorCtrl.getPreviousComputedState($index)\"\n      collapsed=\"logMonitorCtrl.isSkippedAction(actionId)\"\n      toggle-action-handler=\"::logMonitorCtrl.handleToggleAction(id)\"></lm-entry>\n  </div>\n</div>\n";

    }, {}],
    75: [function(_dereq_, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = logMonitorDirective;

      var _logMonitorDirective = _dereq_('./log-monitor-directive.html');

      var _logMonitorDirective2 = _interopRequireDefault(_logMonitorDirective);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function logMonitorDirective() {
        return {
          restrict: 'E',
          replace: true,
          require: '^devTools',
          template: _logMonitorDirective2.default,
          bindToController: {
            select: '='
          },
          controllerAs: 'logMonitorCtrl',
          controller: 'LogMonitorController'
        };
      }

    }, {
      "./log-monitor-directive.html": 74
    }],
    76: [function(_dereq_, module, exports) {
      'use strict';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var LogMonitorEntryController = exports.LogMonitorEntryController = (function() {
        function LogMonitorEntryController() {
          _classCallCheck(this, LogMonitorEntryController);
        }

        _createClass(LogMonitorEntryController, [{
          key: 'getEntryTypeClass',
          value: function getEntryTypeClass() {
            return this.collapsed ? 'log-monitor__entry__type--collapsed' : 'log-monitor__entry__type';
          }
        }]);

        return LogMonitorEntryController;
      })();

    }, {}],
    77: [function(_dereq_, module, exports) {
      module.exports = "<div class=\"log-monitor__entry\">\n  <div\n   ng-class=\"logEntryCtrl.getEntryTypeClass()\"\n   title=\"{{::logEntryCtrl.action.type.toString()}}\"\n   ng-click=\"logEntryCtrl.toggleActionHandler({id: logEntryCtrl.actionId})\"\n   ng-bind=\"::logEntryCtrl.action.type.toString()\"></div>\n  <div class=\"log-monitor__entry__payload\" ng-if=\"!logEntryCtrl.collapsed\">\n    <lm-json\n     ng-if=\"::logEntryCtrl.action.payload\"\n     key=\"'action'\"\n     value=\"::logEntryCtrl.action.payload\"\n     start-expanded=\"true\"></lm-json>\n    <lm-json\n     ng-if=\"!logEntryCtrl.error\"\n     key=\"'state'\"\n     value=\"logEntryCtrl.state\"\n     start-expanded=\"true\"></lm-json>\n    <div class=\"log-monitor__error\" ng-if=\"logEntryCtrl.error\" ng-bind=\"logEntryCtrl.error\"></div>\n  </div>\n</div>\n";

    }, {}],
    78: [function(_dereq_, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = logMonitorEntryDirective;

      var _logMonitorEntryDirective = _dereq_('./log-monitor-entry-directive.html');

      var _logMonitorEntryDirective2 = _interopRequireDefault(_logMonitorEntryDirective);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function logMonitorEntryDirective() {
        return {
          restrict: 'E',
          template: _logMonitorEntryDirective2.default,
          scope: {},
          bindToController: {
            actionId: '=',
            action: '=',
            state: '=',
            error: '=',
            collapsed: '=',
            toggleActionHandler: '&'
          },
          controllerAs: 'logEntryCtrl',
          controller: 'LogMonitorEntryController'
        };
      }

    }, {
      "./log-monitor-entry-directive.html": 77
    }],
    79: [function(_dereq_, module, exports) {
      'use strict';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      /* eslint complexity: 0, max-statements: 0 */

      var LogMonitorJSONController = exports.LogMonitorJSONController = (function() {
        LogMonitorJSONController.$inject = ["$scope"];

        function LogMonitorJSONController($scope) {
          'ngInject';

          var _this = this;

          _classCallCheck(this, LogMonitorJSONController);

          this.isExpandable = true;
          this.key = $scope.key + ':';
          this.value = $scope.value;
          this.startExpanded = $scope.startExpanded;

          $scope.$watch('value', function(value) {
            return _this.value = value && value.toJS && value.toJS() || value;
          });

          this.classModifier = LogMonitorJSONController.whatClass(this.value).toLowerCase();

          var isObject = LogMonitorJSONController.is(this.value, 'Object');
          var isArray = LogMonitorJSONController.is(this.value, 'Array');
          if (!isObject && !isArray) {
            this.isExpandable = false;
            return;
          }

          if (Object.keys(this.value).length === 0) {
            this.isExpandable = false;
            return;
          }

          // Setup preview text
          this.preview = LogMonitorJSONController.makePreviewText(this.value);

          // Setup isExpanded state handling
          this.isExpanded = this.startExpanded ? this.startExpanded() : false;
        }

        _createClass(LogMonitorJSONController, [{
          key: 'getNodeClass',
          value: function getNodeClass() {
            var baseClass = 'log-monitor__json--' + this.classModifier;
            var expandableClass = this.isExpandable ? ' expandable' : '';
            var expandedClass = this.isExpanded ? ' expanded' : '';
            return baseClass + expandableClass + expandedClass;
          }
        }, {
          key: 'getShowedValue',
          value: function getShowedValue() {
            var isObject = LogMonitorJSONController.is(this.value, 'Object');
            var isArray = LogMonitorJSONController.is(this.value, 'Array');

            if (!isObject && !isArray) {
              if (LogMonitorJSONController.is(this.value, 'String')) {
                return '"' + this.value + '"';
              }

              if (LogMonitorJSONController.is(this.value, 'Null')) {
                return 'null';
              }

              if (LogMonitorJSONController.is(this.value, 'Undefined')) {
                return 'undefined';
              }

              return this.value;
            }

            if (Object.keys(this.value).length === 0) {
              return isArray ? '[]' : '{}';
            }

            return this.value;
          }
        }, {
          key: 'toggleExpanded',
          value: function toggleExpanded() {
            this.isExpanded = !this.isExpanded;
          }
        }], [{
          key: 'makePreviewText',
          value: function makePreviewText(value) {
            var isArray = LogMonitorJSONController.is(value, 'Array');

            if (isArray) {
              return '[] ' + value.length + ' ' + LogMonitorJSONController.pluralize(value.length, 'item');
            }

            var keys = Object.keys(value);
            return '{} ' + keys.length + ' ' + LogMonitorJSONController.pluralize(keys.length, 'key');
          }
        }, {
          key: 'pluralize',
          value: function pluralize(value, str) {
            return value > 1 ? str + 's' : str;
          }
        }, {
          key: 'whatClass',
          value: function whatClass(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1);
          }
        }, {
          key: 'is',
          value: function is(obj, type) {
            return Object.prototype.toString.call(obj).slice(8, -1) === type;
          }
        }]);

        return LogMonitorJSONController;
      })();

    }, {}],
    80: [function(_dereq_, module, exports) {
      module.exports = "<div ng-class=\"jsonCtrl.getNodeClass()\">\n  <span\n   class=\"log-monitor__json__key\"\n   ng-click=\"jsonCtrl.toggleExpanded()\"\n   ng-bind=\"jsonCtrl.key\"></span>\n  <span\n   class=\"log-monitor__json__leaf-value\"\n   ng-if=\"!jsonCtrl.isExpandable\"\n   ng-bind=\"jsonCtrl.getShowedValue()\"></span>\n  <span\n   class=\"log-monitor__json__branch-preview\"\n   ng-if=\"jsonCtrl.isExpandable\"\n   ng-show=\"!jsonCtrl.isExpanded\"\n   ng-click=\"toggleExpanded()\"\n   ng-bind=\"jsonCtrl.preview\"></span>\n  <ul\n   class=\"log-monitor__json__branch-value\"\n   ng-if=\"jsonCtrl.isExpandable && jsonCtrl.isExpanded\">\n    <li ng-repeat=\"(subkey,subval) in jsonCtrl.value\">\n      <lm-json key=\"subkey\" value=\"subval\"></lm-json>\n    </li>\n  </ul>\n</div>\n";

    }, {}],
    81: [function(_dereq_, module, exports) {
      'use strict';

      devToolsJSONDirective.$inject = ["RecursionHelper"];
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = devToolsJSONDirective;

      var _logMonitorJsonDirective = _dereq_('./log-monitor-json-directive.html');

      var _logMonitorJsonDirective2 = _interopRequireDefault(_logMonitorJsonDirective);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      function devToolsJSONDirective(RecursionHelper) {
        'ngInject';

        return {
          restrict: 'E',
          replace: true,
          template: _logMonitorJsonDirective2.default,
          scope: {
            key: '=',
            value: '=',
            startExpanded: '&?'
          },
          controllerAs: 'jsonCtrl',
          controller: 'LogMonitorJSONController',
          compile: function compile(elem) {
            return RecursionHelper.compile(elem, this);
          }
        };
      }

    }, {
      "./log-monitor-json-directive.html": 80
    }]
  }, {}, [70])(70)
});