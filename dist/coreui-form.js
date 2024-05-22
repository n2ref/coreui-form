(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.CoreUI = global.CoreUI || {}, global.CoreUI.form = factory()));
})(this, (function () { 'use strict';

  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  (function (f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = f();
    } else if (typeof define === "function" && define.amd) {
      define([], f);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }
      g.ejs = f();
    }
  })(function () {
    return function () {
      function r(e, n, t) {
        function o(i, f) {
          if (!n[i]) {
            if (!e[i]) {
              var c = "function" == typeof require && require;
              if (!f && c) return c(i, !0);
              if (u) return u(i, !0);
              var a = new Error("Cannot find module '" + i + "'");
              throw a.code = "MODULE_NOT_FOUND", a;
            }
            var p = n[i] = {
              exports: {}
            };
            e[i][0].call(p.exports, function (r) {
              var n = e[i][1][r];
              return o(n || r);
            }, p, p.exports, r, e, n, t);
          }
          return n[i].exports;
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
      }
      return r;
    }()({
      1: [function (require, module, exports) {

        var fs = require("fs");
        var path = require("path");
        var utils = require("./utils");
        var scopeOptionWarned = false;
        var _VERSION_STRING = require("../package.json").version;
        var _DEFAULT_OPEN_DELIMITER = "<";
        var _DEFAULT_CLOSE_DELIMITER = ">";
        var _DEFAULT_DELIMITER = "%";
        var _DEFAULT_LOCALS_NAME = "locals";
        var _NAME = "ejs";
        var _REGEX_STRING = "(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";
        var _OPTS_PASSABLE_WITH_DATA = ["delimiter", "scope", "context", "debug", "compileDebug", "client", "_with", "rmWhitespace", "strict", "filename", "async"];
        var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat("cache");
        var _BOM = /^\uFEFF/;
        var _JS_IDENTIFIER = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
        exports.cache = utils.cache;
        exports.fileLoader = fs.readFileSync;
        exports.localsName = _DEFAULT_LOCALS_NAME;
        exports.promiseImpl = new Function("return this;")().Promise;
        exports.resolveInclude = function (name, filename, isDir) {
          var dirname = path.dirname;
          var extname = path.extname;
          var resolve = path.resolve;
          var includePath = resolve(isDir ? filename : dirname(filename), name);
          var ext = extname(name);
          if (!ext) {
            includePath += ".ejs";
          }
          return includePath;
        };
        function resolvePaths(name, paths) {
          var filePath;
          if (paths.some(function (v) {
            filePath = exports.resolveInclude(name, v, true);
            return fs.existsSync(filePath);
          })) {
            return filePath;
          }
        }
        function getIncludePath(path, options) {
          var includePath;
          var filePath;
          var views = options.views;
          var match = /^[A-Za-z]+:\\|^\//.exec(path);
          if (match && match.length) {
            path = path.replace(/^\/*/, "");
            if (Array.isArray(options.root)) {
              includePath = resolvePaths(path, options.root);
            } else {
              includePath = exports.resolveInclude(path, options.root || "/", true);
            }
          } else {
            if (options.filename) {
              filePath = exports.resolveInclude(path, options.filename);
              if (fs.existsSync(filePath)) {
                includePath = filePath;
              }
            }
            if (!includePath && Array.isArray(views)) {
              includePath = resolvePaths(path, views);
            }
            if (!includePath && typeof options.includer !== "function") {
              throw new Error('Could not find the include file "' + options.escapeFunction(path) + '"');
            }
          }
          return includePath;
        }
        function handleCache(options, template) {
          var func;
          var filename = options.filename;
          var hasTemplate = arguments.length > 1;
          if (options.cache) {
            if (!filename) {
              throw new Error("cache option requires a filename");
            }
            func = exports.cache.get(filename);
            if (func) {
              return func;
            }
            if (!hasTemplate) {
              template = fileLoader(filename).toString().replace(_BOM, "");
            }
          } else if (!hasTemplate) {
            if (!filename) {
              throw new Error("Internal EJS error: no file name or template " + "provided");
            }
            template = fileLoader(filename).toString().replace(_BOM, "");
          }
          func = exports.compile(template, options);
          if (options.cache) {
            exports.cache.set(filename, func);
          }
          return func;
        }
        function tryHandleCache(options, data, cb) {
          var result;
          if (!cb) {
            if (typeof exports.promiseImpl == "function") {
              return new exports.promiseImpl(function (resolve, reject) {
                try {
                  result = handleCache(options)(data);
                  resolve(result);
                } catch (err) {
                  reject(err);
                }
              });
            } else {
              throw new Error("Please provide a callback function");
            }
          } else {
            try {
              result = handleCache(options)(data);
            } catch (err) {
              return cb(err);
            }
            cb(null, result);
          }
        }
        function fileLoader(filePath) {
          return exports.fileLoader(filePath);
        }
        function includeFile(path, options) {
          var opts = utils.shallowCopy(utils.createNullProtoObjWherePossible(), options);
          opts.filename = getIncludePath(path, opts);
          if (typeof options.includer === "function") {
            var includerResult = options.includer(path, opts.filename);
            if (includerResult) {
              if (includerResult.filename) {
                opts.filename = includerResult.filename;
              }
              if (includerResult.template) {
                return handleCache(opts, includerResult.template);
              }
            }
          }
          return handleCache(opts);
        }
        function rethrow(err, str, flnm, lineno, esc) {
          var lines = str.split("\n");
          var start = Math.max(lineno - 3, 0);
          var end = Math.min(lines.length, lineno + 3);
          var filename = esc(flnm);
          var context = lines.slice(start, end).map(function (line, i) {
            var curr = i + start + 1;
            return (curr == lineno ? " >> " : "    ") + curr + "| " + line;
          }).join("\n");
          err.path = filename;
          err.message = (filename || "ejs") + ":" + lineno + "\n" + context + "\n\n" + err.message;
          throw err;
        }
        function stripSemi(str) {
          return str.replace(/;(\s*$)/, "$1");
        }
        exports.compile = function compile(template, opts) {
          var templ;
          if (opts && opts.scope) {
            if (!scopeOptionWarned) {
              console.warn("`scope` option is deprecated and will be removed in EJS 3");
              scopeOptionWarned = true;
            }
            if (!opts.context) {
              opts.context = opts.scope;
            }
            delete opts.scope;
          }
          templ = new Template(template, opts);
          return templ.compile();
        };
        exports.render = function (template, d, o) {
          var data = d || utils.createNullProtoObjWherePossible();
          var opts = o || utils.createNullProtoObjWherePossible();
          if (arguments.length == 2) {
            utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
          }
          return handleCache(opts, template)(data);
        };
        exports.renderFile = function () {
          var args = Array.prototype.slice.call(arguments);
          var filename = args.shift();
          var cb;
          var opts = {
            filename: filename
          };
          var data;
          var viewOpts;
          if (typeof arguments[arguments.length - 1] == "function") {
            cb = args.pop();
          }
          if (args.length) {
            data = args.shift();
            if (args.length) {
              utils.shallowCopy(opts, args.pop());
            } else {
              if (data.settings) {
                if (data.settings.views) {
                  opts.views = data.settings.views;
                }
                if (data.settings["view cache"]) {
                  opts.cache = true;
                }
                viewOpts = data.settings["view options"];
                if (viewOpts) {
                  utils.shallowCopy(opts, viewOpts);
                }
              }
              utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
            }
            opts.filename = filename;
          } else {
            data = utils.createNullProtoObjWherePossible();
          }
          return tryHandleCache(opts, data, cb);
        };
        exports.Template = Template;
        exports.clearCache = function () {
          exports.cache.reset();
        };
        function Template(text, opts) {
          opts = opts || utils.createNullProtoObjWherePossible();
          var options = utils.createNullProtoObjWherePossible();
          this.templateText = text;
          this.mode = null;
          this.truncate = false;
          this.currentLine = 1;
          this.source = "";
          options.client = opts.client || false;
          options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
          options.compileDebug = opts.compileDebug !== false;
          options.debug = !!opts.debug;
          options.filename = opts.filename;
          options.openDelimiter = opts.openDelimiter || exports.openDelimiter || _DEFAULT_OPEN_DELIMITER;
          options.closeDelimiter = opts.closeDelimiter || exports.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
          options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
          options.strict = opts.strict || false;
          options.context = opts.context;
          options.cache = opts.cache || false;
          options.rmWhitespace = opts.rmWhitespace;
          options.root = opts.root;
          options.includer = opts.includer;
          options.outputFunctionName = opts.outputFunctionName;
          options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
          options.views = opts.views;
          options.async = opts.async;
          options.destructuredLocals = opts.destructuredLocals;
          options.legacyInclude = typeof opts.legacyInclude != "undefined" ? !!opts.legacyInclude : true;
          if (options.strict) {
            options._with = false;
          } else {
            options._with = typeof opts._with != "undefined" ? opts._with : true;
          }
          this.opts = options;
          this.regex = this.createRegex();
        }
        Template.modes = {
          EVAL: "eval",
          ESCAPED: "escaped",
          RAW: "raw",
          COMMENT: "comment",
          LITERAL: "literal"
        };
        Template.prototype = {
          createRegex: function () {
            var str = _REGEX_STRING;
            var delim = utils.escapeRegExpChars(this.opts.delimiter);
            var open = utils.escapeRegExpChars(this.opts.openDelimiter);
            var close = utils.escapeRegExpChars(this.opts.closeDelimiter);
            str = str.replace(/%/g, delim).replace(/</g, open).replace(/>/g, close);
            return new RegExp(str);
          },
          compile: function () {
            var src;
            var fn;
            var opts = this.opts;
            var prepended = "";
            var appended = "";
            var escapeFn = opts.escapeFunction;
            var ctor;
            var sanitizedFilename = opts.filename ? JSON.stringify(opts.filename) : "undefined";
            if (!this.source) {
              this.generateSource();
              prepended += '  var __output = "";\n' + "  function __append(s) { if (s !== undefined && s !== null) __output += s }\n";
              if (opts.outputFunctionName) {
                if (!_JS_IDENTIFIER.test(opts.outputFunctionName)) {
                  throw new Error("outputFunctionName is not a valid JS identifier.");
                }
                prepended += "  var " + opts.outputFunctionName + " = __append;" + "\n";
              }
              if (opts.localsName && !_JS_IDENTIFIER.test(opts.localsName)) {
                throw new Error("localsName is not a valid JS identifier.");
              }
              if (opts.destructuredLocals && opts.destructuredLocals.length) {
                var destructuring = "  var __locals = (" + opts.localsName + " || {}),\n";
                for (var i = 0; i < opts.destructuredLocals.length; i++) {
                  var name = opts.destructuredLocals[i];
                  if (!_JS_IDENTIFIER.test(name)) {
                    throw new Error("destructuredLocals[" + i + "] is not a valid JS identifier.");
                  }
                  if (i > 0) {
                    destructuring += ",\n  ";
                  }
                  destructuring += name + " = __locals." + name;
                }
                prepended += destructuring + ";\n";
              }
              if (opts._with !== false) {
                prepended += "  with (" + opts.localsName + " || {}) {" + "\n";
                appended += "  }" + "\n";
              }
              appended += "  return __output;" + "\n";
              this.source = prepended + this.source + appended;
            }
            if (opts.compileDebug) {
              src = "var __line = 1" + "\n" + "  , __lines = " + JSON.stringify(this.templateText) + "\n" + "  , __filename = " + sanitizedFilename + ";" + "\n" + "try {" + "\n" + this.source + "} catch (e) {" + "\n" + "  rethrow(e, __lines, __filename, __line, escapeFn);" + "\n" + "}" + "\n";
            } else {
              src = this.source;
            }
            if (opts.client) {
              src = "escapeFn = escapeFn || " + escapeFn.toString() + ";" + "\n" + src;
              if (opts.compileDebug) {
                src = "rethrow = rethrow || " + rethrow.toString() + ";" + "\n" + src;
              }
            }
            if (opts.strict) {
              src = '"use strict";\n' + src;
            }
            if (opts.debug) {
              console.log(src);
            }
            if (opts.compileDebug && opts.filename) {
              src = src + "\n" + "//# sourceURL=" + sanitizedFilename + "\n";
            }
            try {
              if (opts.async) {
                try {
                  ctor = new Function("return (async function(){}).constructor;")();
                } catch (e) {
                  if (e instanceof SyntaxError) {
                    throw new Error("This environment does not support async/await");
                  } else {
                    throw e;
                  }
                }
              } else {
                ctor = Function;
              }
              fn = new ctor(opts.localsName + ", escapeFn, include, rethrow", src);
            } catch (e) {
              if (e instanceof SyntaxError) {
                if (opts.filename) {
                  e.message += " in " + opts.filename;
                }
                e.message += " while compiling ejs\n\n";
                e.message += "If the above error is not helpful, you may want to try EJS-Lint:\n";
                e.message += "https://github.com/RyanZim/EJS-Lint";
                if (!opts.async) {
                  e.message += "\n";
                  e.message += "Or, if you meant to create an async function, pass `async: true` as an option.";
                }
              }
              throw e;
            }
            var returnedFn = opts.client ? fn : function anonymous(data) {
              var include = function (path, includeData) {
                var d = utils.shallowCopy(utils.createNullProtoObjWherePossible(), data);
                if (includeData) {
                  d = utils.shallowCopy(d, includeData);
                }
                return includeFile(path, opts)(d);
              };
              return fn.apply(opts.context, [data || utils.createNullProtoObjWherePossible(), escapeFn, include, rethrow]);
            };
            if (opts.filename && typeof Object.defineProperty === "function") {
              var filename = opts.filename;
              var basename = path.basename(filename, path.extname(filename));
              try {
                Object.defineProperty(returnedFn, "name", {
                  value: basename,
                  writable: false,
                  enumerable: false,
                  configurable: true
                });
              } catch (e) {}
            }
            return returnedFn;
          },
          generateSource: function () {
            var opts = this.opts;
            if (opts.rmWhitespace) {
              this.templateText = this.templateText.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
            }
            this.templateText = this.templateText.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
            var self = this;
            var matches = this.parseTemplateText();
            var d = this.opts.delimiter;
            var o = this.opts.openDelimiter;
            var c = this.opts.closeDelimiter;
            if (matches && matches.length) {
              matches.forEach(function (line, index) {
                var closing;
                if (line.indexOf(o + d) === 0 && line.indexOf(o + d + d) !== 0) {
                  closing = matches[index + 2];
                  if (!(closing == d + c || closing == "-" + d + c || closing == "_" + d + c)) {
                    throw new Error('Could not find matching close tag for "' + line + '".');
                  }
                }
                self.scanLine(line);
              });
            }
          },
          parseTemplateText: function () {
            var str = this.templateText;
            var pat = this.regex;
            var result = pat.exec(str);
            var arr = [];
            var firstPos;
            while (result) {
              firstPos = result.index;
              if (firstPos !== 0) {
                arr.push(str.substring(0, firstPos));
                str = str.slice(firstPos);
              }
              arr.push(result[0]);
              str = str.slice(result[0].length);
              result = pat.exec(str);
            }
            if (str) {
              arr.push(str);
            }
            return arr;
          },
          _addOutput: function (line) {
            if (this.truncate) {
              line = line.replace(/^(?:\r\n|\r|\n)/, "");
              this.truncate = false;
            }
            if (!line) {
              return line;
            }
            line = line.replace(/\\/g, "\\\\");
            line = line.replace(/\n/g, "\\n");
            line = line.replace(/\r/g, "\\r");
            line = line.replace(/"/g, '\\"');
            this.source += '    ; __append("' + line + '")' + "\n";
          },
          scanLine: function (line) {
            var self = this;
            var d = this.opts.delimiter;
            var o = this.opts.openDelimiter;
            var c = this.opts.closeDelimiter;
            var newLineCount = 0;
            newLineCount = line.split("\n").length - 1;
            switch (line) {
              case o + d:
              case o + d + "_":
                this.mode = Template.modes.EVAL;
                break;
              case o + d + "=":
                this.mode = Template.modes.ESCAPED;
                break;
              case o + d + "-":
                this.mode = Template.modes.RAW;
                break;
              case o + d + "#":
                this.mode = Template.modes.COMMENT;
                break;
              case o + d + d:
                this.mode = Template.modes.LITERAL;
                this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + "\n";
                break;
              case d + d + c:
                this.mode = Template.modes.LITERAL;
                this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + "\n";
                break;
              case d + c:
              case "-" + d + c:
              case "_" + d + c:
                if (this.mode == Template.modes.LITERAL) {
                  this._addOutput(line);
                }
                this.mode = null;
                this.truncate = line.indexOf("-") === 0 || line.indexOf("_") === 0;
                break;
              default:
                if (this.mode) {
                  switch (this.mode) {
                    case Template.modes.EVAL:
                    case Template.modes.ESCAPED:
                    case Template.modes.RAW:
                      if (line.lastIndexOf("//") > line.lastIndexOf("\n")) {
                        line += "\n";
                      }
                  }
                  switch (this.mode) {
                    case Template.modes.EVAL:
                      this.source += "    ; " + line + "\n";
                      break;
                    case Template.modes.ESCAPED:
                      this.source += "    ; __append(escapeFn(" + stripSemi(line) + "))" + "\n";
                      break;
                    case Template.modes.RAW:
                      this.source += "    ; __append(" + stripSemi(line) + ")" + "\n";
                      break;
                    case Template.modes.COMMENT:
                      break;
                    case Template.modes.LITERAL:
                      this._addOutput(line);
                      break;
                  }
                } else {
                  this._addOutput(line);
                }
            }
            if (self.opts.compileDebug && newLineCount) {
              this.currentLine += newLineCount;
              this.source += "    ; __line = " + this.currentLine + "\n";
            }
          }
        };
        exports.escapeXML = utils.escapeXML;
        exports.__express = exports.renderFile;
        exports.VERSION = _VERSION_STRING;
        exports.name = _NAME;
        if (typeof window != "undefined") {
          window.ejs = exports;
        }
      }, {
        "../package.json": 6,
        "./utils": 2,
        fs: 3,
        path: 4
      }],
      2: [function (require, module, exports) {

        var regExpChars = /[|\\{}()[\]^$+*?.]/g;
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var hasOwn = function (obj, key) {
          return hasOwnProperty.apply(obj, [key]);
        };
        exports.escapeRegExpChars = function (string) {
          if (!string) {
            return "";
          }
          return String(string).replace(regExpChars, "\\$&");
        };
        var _ENCODE_HTML_RULES = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&#34;",
          "'": "&#39;"
        };
        var _MATCH_HTML = /[&<>'"]/g;
        function encode_char(c) {
          return _ENCODE_HTML_RULES[c] || c;
        }
        var escapeFuncStr = "var _ENCODE_HTML_RULES = {\n" + '      "&": "&amp;"\n' + '    , "<": "&lt;"\n' + '    , ">": "&gt;"\n' + '    , \'"\': "&#34;"\n' + '    , "\'": "&#39;"\n' + "    }\n" + "  , _MATCH_HTML = /[&<>'\"]/g;\n" + "function encode_char(c) {\n" + "  return _ENCODE_HTML_RULES[c] || c;\n" + "};\n";
        exports.escapeXML = function (markup) {
          return markup == undefined ? "" : String(markup).replace(_MATCH_HTML, encode_char);
        };
        function escapeXMLToString() {
          return Function.prototype.toString.call(this) + ";\n" + escapeFuncStr;
        }
        try {
          if (typeof Object.defineProperty === "function") {
            Object.defineProperty(exports.escapeXML, "toString", {
              value: escapeXMLToString
            });
          } else {
            exports.escapeXML.toString = escapeXMLToString;
          }
        } catch (err) {
          console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)");
        }
        exports.shallowCopy = function (to, from) {
          from = from || {};
          if (to !== null && to !== undefined) {
            for (var p in from) {
              if (!hasOwn(from, p)) {
                continue;
              }
              if (p === "__proto__" || p === "constructor") {
                continue;
              }
              to[p] = from[p];
            }
          }
          return to;
        };
        exports.shallowCopyFromList = function (to, from, list) {
          list = list || [];
          from = from || {};
          if (to !== null && to !== undefined) {
            for (var i = 0; i < list.length; i++) {
              var p = list[i];
              if (typeof from[p] != "undefined") {
                if (!hasOwn(from, p)) {
                  continue;
                }
                if (p === "__proto__" || p === "constructor") {
                  continue;
                }
                to[p] = from[p];
              }
            }
          }
          return to;
        };
        exports.cache = {
          _data: {},
          set: function (key, val) {
            this._data[key] = val;
          },
          get: function (key) {
            return this._data[key];
          },
          remove: function (key) {
            delete this._data[key];
          },
          reset: function () {
            this._data = {};
          }
        };
        exports.hyphenToCamel = function (str) {
          return str.replace(/-[a-z]/g, function (match) {
            return match[1].toUpperCase();
          });
        };
        exports.createNullProtoObjWherePossible = function () {
          if (typeof Object.create == "function") {
            return function () {
              return Object.create(null);
            };
          }
          if (!({
            __proto__: null
          } instanceof Object)) {
            return function () {
              return {
                __proto__: null
              };
            };
          }
          return function () {
            return {};
          };
        }();
      }, {}],
      3: [function (require, module, exports) {}, {}],
      4: [function (require, module, exports) {
        (function (process) {
          function normalizeArray(parts, allowAboveRoot) {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
              var last = parts[i];
              if (last === ".") {
                parts.splice(i, 1);
              } else if (last === "..") {
                parts.splice(i, 1);
                up++;
              } else if (up) {
                parts.splice(i, 1);
                up--;
              }
            }
            if (allowAboveRoot) {
              for (; up--; up) {
                parts.unshift("..");
              }
            }
            return parts;
          }
          exports.resolve = function () {
            var resolvedPath = "",
              resolvedAbsolute = false;
            for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
              var path = i >= 0 ? arguments[i] : process.cwd();
              if (typeof path !== "string") {
                throw new TypeError("Arguments to path.resolve must be strings");
              } else if (!path) {
                continue;
              }
              resolvedPath = path + "/" + resolvedPath;
              resolvedAbsolute = path.charAt(0) === "/";
            }
            resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function (p) {
              return !!p;
            }), !resolvedAbsolute).join("/");
            return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
          };
          exports.normalize = function (path) {
            var isAbsolute = exports.isAbsolute(path),
              trailingSlash = substr(path, -1) === "/";
            path = normalizeArray(filter(path.split("/"), function (p) {
              return !!p;
            }), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
              path = ".";
            }
            if (path && trailingSlash) {
              path += "/";
            }
            return (isAbsolute ? "/" : "") + path;
          };
          exports.isAbsolute = function (path) {
            return path.charAt(0) === "/";
          };
          exports.join = function () {
            var paths = Array.prototype.slice.call(arguments, 0);
            return exports.normalize(filter(paths, function (p, index) {
              if (typeof p !== "string") {
                throw new TypeError("Arguments to path.join must be strings");
              }
              return p;
            }).join("/"));
          };
          exports.relative = function (from, to) {
            from = exports.resolve(from).substr(1);
            to = exports.resolve(to).substr(1);
            function trim(arr) {
              var start = 0;
              for (; start < arr.length; start++) {
                if (arr[start] !== "") break;
              }
              var end = arr.length - 1;
              for (; end >= 0; end--) {
                if (arr[end] !== "") break;
              }
              if (start > end) return [];
              return arr.slice(start, end - start + 1);
            }
            var fromParts = trim(from.split("/"));
            var toParts = trim(to.split("/"));
            var length = Math.min(fromParts.length, toParts.length);
            var samePartsLength = length;
            for (var i = 0; i < length; i++) {
              if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
              }
            }
            var outputParts = [];
            for (var i = samePartsLength; i < fromParts.length; i++) {
              outputParts.push("..");
            }
            outputParts = outputParts.concat(toParts.slice(samePartsLength));
            return outputParts.join("/");
          };
          exports.sep = "/";
          exports.delimiter = ":";
          exports.dirname = function (path) {
            if (typeof path !== "string") path = path + "";
            if (path.length === 0) return ".";
            var code = path.charCodeAt(0);
            var hasRoot = code === 47;
            var end = -1;
            var matchedSlash = true;
            for (var i = path.length - 1; i >= 1; --i) {
              code = path.charCodeAt(i);
              if (code === 47) {
                if (!matchedSlash) {
                  end = i;
                  break;
                }
              } else {
                matchedSlash = false;
              }
            }
            if (end === -1) return hasRoot ? "/" : ".";
            if (hasRoot && end === 1) {
              return "/";
            }
            return path.slice(0, end);
          };
          function basename(path) {
            if (typeof path !== "string") path = path + "";
            var start = 0;
            var end = -1;
            var matchedSlash = true;
            var i;
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1) return "";
            return path.slice(start, end);
          }
          exports.basename = function (path, ext) {
            var f = basename(path);
            if (ext && f.substr(-1 * ext.length) === ext) {
              f = f.substr(0, f.length - ext.length);
            }
            return f;
          };
          exports.extname = function (path) {
            if (typeof path !== "string") path = path + "";
            var startDot = -1;
            var startPart = 0;
            var end = -1;
            var matchedSlash = true;
            var preDotState = 0;
            for (var i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47) {
                if (!matchedSlash) {
                  startPart = i + 1;
                  break;
                }
                continue;
              }
              if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
              if (code === 46) {
                if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
              } else if (startDot !== -1) {
                preDotState = -1;
              }
            }
            if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
              return "";
            }
            return path.slice(startDot, end);
          };
          function filter(xs, f) {
            if (xs.filter) return xs.filter(f);
            var res = [];
            for (var i = 0; i < xs.length; i++) {
              if (f(xs[i], i, xs)) res.push(xs[i]);
            }
            return res;
          }
          var substr = "ab".substr(-1) === "b" ? function (str, start, len) {
            return str.substr(start, len);
          } : function (str, start, len) {
            if (start < 0) start = str.length + start;
            return str.substr(start, len);
          };
        }).call(this, require("_process"));
      }, {
        _process: 5
      }],
      5: [function (require, module, exports) {
        var process = module.exports = {};
        var cachedSetTimeout;
        var cachedClearTimeout;
        function defaultSetTimout() {
          throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
          throw new Error("clearTimeout has not been defined");
        }
        (function () {
          try {
            if (typeof setTimeout === "function") {
              cachedSetTimeout = setTimeout;
            } else {
              cachedSetTimeout = defaultSetTimout;
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout;
          }
          try {
            if (typeof clearTimeout === "function") {
              cachedClearTimeout = clearTimeout;
            } else {
              cachedClearTimeout = defaultClearTimeout;
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
          }
        })();
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            return setTimeout(fun, 0);
          }
          if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }
          try {
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
              return cachedSetTimeout.call(this, fun, 0);
            }
          }
        }
        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            return clearTimeout(marker);
          }
          if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }
          try {
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              return cachedClearTimeout.call(null, marker);
            } catch (e) {
              return cachedClearTimeout.call(this, marker);
            }
          }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;
        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return;
          }
          draining = false;
          if (currentQueue.length) {
            queue = currentQueue.concat(queue);
          } else {
            queueIndex = -1;
          }
          if (queue.length) {
            drainQueue();
          }
        }
        function drainQueue() {
          if (draining) {
            return;
          }
          var timeout = runTimeout(cleanUpNextTick);
          draining = true;
          var len = queue.length;
          while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run();
              }
            }
            queueIndex = -1;
            len = queue.length;
          }
          currentQueue = null;
          draining = false;
          runClearTimeout(timeout);
        }
        process.nextTick = function (fun) {
          var args = new Array(arguments.length - 1);
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
            }
          }
          queue.push(new Item(fun, args));
          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
          }
        };
        function Item(fun, array) {
          this.fun = fun;
          this.array = array;
        }
        Item.prototype.run = function () {
          this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = "";
        process.versions = {};
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;
        process.listeners = function (name) {
          return [];
        };
        process.binding = function (name) {
          throw new Error("process.binding is not supported");
        };
        process.cwd = function () {
          return "/";
        };
        process.chdir = function (dir) {
          throw new Error("process.chdir is not supported");
        };
        process.umask = function () {
          return 0;
        };
      }, {}],
      6: [function (require, module, exports) {
        module.exports = {
          name: "ejs",
          description: "Embedded JavaScript templates",
          keywords: ["template", "engine", "ejs"],
          version: "3.1.8",
          author: "Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",
          license: "Apache-2.0",
          bin: {
            ejs: "./bin/cli.js"
          },
          main: "./lib/ejs.js",
          jsdelivr: "ejs.min.js",
          unpkg: "ejs.min.js",
          repository: {
            type: "git",
            url: "git://github.com/mde/ejs.git"
          },
          bugs: "https://github.com/mde/ejs/issues",
          homepage: "https://github.com/mde/ejs",
          dependencies: {
            jake: "^10.8.5"
          },
          devDependencies: {
            browserify: "^16.5.1",
            eslint: "^6.8.0",
            "git-directory-deploy": "^1.5.1",
            jsdoc: "^4.0.2",
            "lru-cache": "^4.0.1",
            mocha: "^10.2.0",
            "uglify-js": "^3.3.16"
          },
          engines: {
            node: ">=0.10.0"
          },
          scripts: {
            test: "mocha -u tdd"
          }
        };
      }, {}]
    }, {}, [1])(1);
  });

  var tpl$1 = Object.create(null);
  tpl$1['form-control.html'] = ' <div id="coreui-form-<%= form.id %>-control-<%= control.index %>" class="coreui-form__control_container" <% if ( ! control.show) { %>style="display:none"<% } %>> <%- control.content %> </div>';
  tpl$1['form-error.html'] = '<div class="coreui-form__error alert alert-danger alert-dismissible fade show mb-3 <%= options.class %>"> <%- message %> <% if (options.dismiss) { %> <button type="button" class="btn-close" data-bs-dismiss="alert"></button> <% } %> </div>';
  tpl$1['form-field-content.html'] = '<%- content %>';
  tpl$1['form-field-group.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__group_container mb-3"> <div class="coreui-form__group_label pe-2"> <h6 class="coreui-form__field_label_text col-form-label"> <%- group.label %> <% if (group.showCollapsible) { %> <button type="button" class="btn btn-link btn-collapsible text-dark"> <% if ( ! group.show) { %> <i class="bi bi-chevron-right"></i> <% } else { %> <i class="bi bi-chevron-down"></i> <% } %> </button> <% } %> </h6> </div> <div class="coreui-form__group_content"<% if ( ! group.show) { %> style="display:none"<% } %>></div> </div>';
  tpl$1['form-field-label.html'] = '<div id="coreui-form-<%= id %>" class="coreui-form__field_container d-flex flex-column flex-md-row mb-3<% if ( ! field.show) { %> d-none<% } %>"> <% if (field.labelWidth !== 0 && field.labelWidth !== \'0px\') { %> <div class="coreui-form__field_label text-md-end text-sm-start pe-2"<% if (field.labelWidth) { %> style="min-width:<%= field.labelWidth %>;width:<%= field.labelWidth %>"<% } %>> <div class="coreui-form__field_label_content col-form-label"> <% if (field.required) { %> <span class="coreui-form__field_label_req text-danger">*</span> <% } %> <span class="coreui-form__field_label_text fw-medium"><%- field.label %></span> </div> <% if (field.description) { %> <div class="coreui-form__field_label_description text-muted"> <small><%- field.description %></small> </div> <% } %> </div> <% } %> <div class="coreui-form__field_content flex-fill"> <div class="d-inline-block content-<%= hash %>"> <%- content %> </div> <% if (field.outContent) { %> <span class="coreui-form__field-content-out d-inline-block align-top ps-1"> <%- field.outContent %> </span> <% } %> <% if (attachFields && attachFields.length > 0) { %> <% $.each(attachFields, function(key, attachField) { %> <div class="<% if (attachField.hasOwnProperty(\'direction\') && attachField.direction === \'column\') { %>d-block mt-2<% } else { %>d-inline-block<% } %> content-<%= attachField.hash %>"> <%- attachField.content %> </div> <% }); %> <% } %> </div> </div>';
  tpl$1['form.html'] = '<div id="coreui-form-<%= form.id %>" class="coreui-form mb-2" <% if (widthSizes) { %>style="<%= widthSizes.join(\';\') %>"<% } %>> <% if (form.title) { %> <h5 class="mb-4"><%- form.title %></h5> <% } %> <form action="<%= form.send.url %>" method="<%= form.send.method %>"<%- formAttr %>> <div class="coreui-form__fields d-flex justify-content-start flex-column flex-wrap"></div> <% if (controls) { %> <div class="coreui-form__controls d-flex justify-content-start flex-sm-wrap flex-md-nowrap"> <% if (form.controlsOffset !== 0 && form.controlsOffset !== \'0px\') { %> <div class="d-none d-md-block" style="width:<%= form.controlsOffset %>;min-width:<%= form.controlsOffset %>"></div> <% } %> <div class="d-flex justify-content-start flex-wrap gap-2"> <% $.each(controls, function(key, control) { %> <div id="coreui-form-<%= form.id %>-control-<%= control.index %>" class="coreui-form__control_container" <% if ( ! control.show) { %>style="display:none"<% } %>> </div> <% }); %> </div> </div> <% } %> </form> </div>';
  tpl$1['controls/button.html'] = '<button <%- render.attr %>><%- control.content %></button>';
  tpl$1['controls/link.html'] = '<a href="<%- control.url %>"<%- render.attr %>><%- control.content %></a>';
  tpl$1['fields/checkbox.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%- render.selectedItems.join(\', \') %></div> <% } else { %> <div class="pt-2"> <% $.each(render.options, function(key, option) { %> <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>"> <input <%- option.attr %>/> <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label> </div> <% }); %> </div> <% } %>';
  tpl$1['fields/color.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label rounded-1" style="width: 14px;height: 14px;background-color: <%= value %>"></div> <% } else { %> <input <%- render.attr %>/> <% if (render.datalist.length > 0) { %> <datalist id="<%= datalistId %>"> <% $.each(render.datalist, function(key, item) { %> <option <%- item.attr %>/> <% }); %> </datalist> <% } %> <% } %>';
  tpl$1['fields/dataset-row-readonly.html'] = '<tr class="coreui-form__field-dataset-item"> <% $.each(options, function(key, option) { %> <td class="pe-2 pb-1"> <%- option.value %> </td> <% }); %> </tr>';
  tpl$1['fields/dataset-row.html'] = '<tr class="coreui-form__field-dataset-item" id="dataset-item-<%= hashItem %>"> <% $.each(options, function(key, option) { %> <td class="pe-1 pb-1"> <% if (option.type === \'select\') { %> <select <%- option.attr %>> <% $.each(option.items, function(key, item) { %> <option <%- item.attr %>><%- item.text %></option> <% }); %> </select> <% } else if (option.type === \'switch\') { %> <div class="form-check form-switch"> <input <%- option.attr %>/> </div> <% } else { %> <input <%- option.attr %>> <% } %> </td> <% }); %> <td class="pb-1"> <button type="button" class="btn btn-link btn-dataset-remove" data-item-id="dataset-item-<%= hashItem %>"> <i class="bi bi-x text-muted"></i> </button> </td> </tr>';
  tpl$1['fields/dataset.html'] = '<% if (field.readonly) { %> <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>> <thead> <tr> <% $.each(render.headers, function(key, item) { %> <td class="text-muted pe-2"><small><%= item.title %></small></td> <% }); %> </tr> </thead> <tbody class="coreui-form__field-dataset-list"> <% $.each(render.rows, function(key, row) { %> <%- row %> <% }); %> </tbody> </table> <% } else { %> <table class="coreui-form__field-dataset-container" <% if (render.rows.length == 0) { %> style="display:none"<% } %>> <thead> <tr> <% $.each(render.headers, function(key, item) { %> <td class="text-muted"><small><%= item.title %></small></td> <% }); %> <td></td> </tr> </thead> <tbody class="coreui-form__field-dataset-list"> <% $.each(render.rows, function(key, row) { %> <%- row %> <% }); %> </tbody> </table> <button type="button" class="btn btn-link btn-dataset-add"><%= lang.dataset_add %></button> <% } %>';
  tpl$1['fields/file-upload.html'] = ' <% if (showButton) { %> <button type="button" class="btn btn-outline-secondary fileup-btn"> <%= lang.file_upload_select %> <input type="file" id="fileup-<%= id %>"<% if (isMultiple) { %> multiple<% } %><% if (accept) { %> accept="<%= accept %>"<% } %>> </button> <% } else { %> <input type="file" id="fileup-<%= id %>"<% if (isMultiple) { %> multiple<% } %><% if (accept) { %> accept="<%= accept %>"<% } %> style="display:none"> <% } %> <% if (showDropzone) { %> <div id="fileup-<%= id %>-dropzone" class="fileup-dropzone p-4 d-inline-block text-primary-emphasis fs-5 rounded-4 text-center <% if (showButton) { %>mt-2<% } %>>"> <i class="bi bi-folder2-open"></i> <%= lang.file_upload_dropzone %> </div> <% } %> <div id="fileup-<%= id %>-queue"></div>';
  tpl$1['fields/hidden.html'] = '<% if ( ! field.readonly) { %> <input <%- render.attr %>/> <% } %>';
  tpl$1['fields/input.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%- value %></div> <% } else { %> <input <%- render.attr %>/> <% if (render.datalist.length > 0) { %> <datalist id="<%= datalistId %>"> <% $.each(render.datalist, function(key, item) { %> <option <%- item.attr %>/> <% }); %> </datalist> <% } %> <% } %>';
  tpl$1['fields/modal-loading.html'] = '<div class="py-4 d-flex justify-content-center align-items-center gap-2"> <div class="spinner-border mr-2"></div> <%= lang.modal_loading %> </div> ';
  tpl$1['fields/modal.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%= text %></div> <% } else { %> <div class="input-group"<% if (render.width) { %> style="width:<%= render.width %>"<% } %>> <input <%- render.attr %>/> <input type="hidden" name="<%= field.name %>" value="<%= value %>" class="coreui-form-modal-value"/> <% if ( ! field.required) { %> <button class="btn btn-outline-secondary btn-modal-clear border-secondary-subtle" type="button"> <i class="bi bi-x"></i> </button> <% } %> <button class="btn btn-outline-secondary btn-modal-select border-secondary-subtle" type="button"><%= lang.modal_select %></button> </div> <% } %>';
  tpl$1['fields/passwordRepeat.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%- value %></div> <% } else { %> <div class="d-flex gap-1 align-items-center"> <input <%- render.attr %>/> <% if (field.showBtn) { %> <div class="input-group flex-nowrap"> <input <%- render.attr2 %>/> <button class="btn btn-outline-secondary border-secondary-subtle btn-password-change" type="button" data-change="<%- lang.change %>" data-cancel="<%- lang.cancel %>"><%= btn_text %></button> </div> <% } else { %> <input <%- render.attr2 %>/> <% } %> </div> <% } %>';
  tpl$1['fields/radio.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%- render.selectedItem %></div> <% } else { %> <div class="pt-2"> <% $.each(render.options, function(key, option) { %> <div class="form-check<% if (field.inline) { %> form-check-inline<% } %>"> <input <%- option.attr %>/> <label class="form-check-label" for="<%= option.id %>"><%= option.text %></label> </div> <% }); %> </div> <% } %>';
  tpl$1['fields/select.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%= render.selectedOptions.join(\', \') %></div> <% } else { %> <select <%- render.attr %>> <% $.each(render.options, function(key, option) { %> <% if (option.type === \'group\') { %> <optgroup<%- option.attr %>/> <% $.each(option.options, function(key, groupOption) { %> <option <%- groupOption.attr %>/><%= groupOption.text %></option> <% }); %> </optgroup> <% } else { %> <option <%- option.attr %>/><%= option.text %></option> <% } %> <% }); %> </select> <% } %>';
  tpl$1['fields/switch.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%= field.valueY == value ? lang.switch_yes : lang.switch_no %></div> <% } else { %> <div class="form-check form-switch pt-2"> <input <%- render.attr %>/> </div> <% } %>';
  tpl$1['fields/textarea.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%- value %></div> <% } else { %> <textarea <%- render.attr %>><%- value %></textarea> <% } %>';
  tpl$1['fields/wysiwyg.html'] = '<% if (field.readonly) { %> <div class="coreui-form__field-readonly col-form-label"><%- value %></div> <% } else { %> <textarea name="<%= field.name %>" id="editor-<%= editorHash %>"><%- value %></textarea> <% } %>';

  var coreuiFormPrivate = {
    /**
     * Выполнение событий
     * @param {object}      form
     * @param {string}      name
     * @param {object|null} context
     * @param {Array}       params
     * @return {object}
     * @private
     */
    trigger: function trigger(form, name, params, context) {
      params = params || [];
      var results = [];
      if (form._events[name] instanceof Object && form._events[name].length > 0) {
        for (var i = 0; i < form._events[name].length; i++) {
          var callback = form._events[name][i].callback;
          var funcContext = form._events[name][i].context || context || form;
          results.push(callback.apply(funcContext, params));
          if (form._events[name][i].singleExec) {
            form._events[name].splice(i, 1);
            i--;
          }
        }
      }
      return results;
    },
    /**
     * Инициализация поля
     * @param {object} form
     * @param {object} field
     * @return {object|null}
     * @private
     */
    initField: function initField(form, field) {
      if (_typeof(field) !== 'object') {
        return null;
      }
      var type = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : 'input';
      if (type === 'group') {
        return null;
      }
      if (!coreuiForm.fields.hasOwnProperty(type)) {
        type = 'input';
      }
      if (form._options.readonly) {
        field.readonly = true;
      }
      var fieldInstance = $.extend(true, {
        render: function render() {},
        renderContent: function renderContent() {},
        init: function init() {},
        getValue: function getValue() {},
        setValue: function setValue() {},
        getOptions: function getOptions() {},
        show: function show() {},
        hide: function hide() {},
        readonly: function readonly() {},
        validate: function validate() {},
        isValid: function isValid() {}
      }, coreuiForm.fields[type]);
      fieldInstance.init(form, field, form._fieldsIndex++);
      form._fields.push(fieldInstance);
      return fieldInstance;
    },
    /**
     * Инициализация группы
     * @param {object} form
     * @param {object} group
     * @return {object|null}
     * @private
     */
    initGroup: function initGroup(form, group) {
      if (_typeof(group) !== 'object') {
        return null;
      }
      var type = group.hasOwnProperty('type') && typeof group.type === 'string' ? group.type : '';
      if (type !== 'group') {
        return null;
      }
      var groupInstance = $.extend(true, {
        render: function render() {},
        init: function init() {},
        getOptions: function getOptions() {},
        expand: function expand() {},
        collapse: function collapse() {}
      }, coreuiForm.fields[type]);
      groupInstance.init(form, group, form._groupsIndex++);
      form._groups.push(groupInstance);
      return groupInstance;
    },
    /**
     * Инициализация контролов
     * @param {object} form
     * @param {object} control
     * @return {object|null}
     * @private
     */
    initControl: function initControl(form, control) {
      if (_typeof(control) !== 'object') {
        return null;
      }
      var type = control.hasOwnProperty('type') && typeof control.type === 'string' ? control.type : null;
      if (!type || !coreuiForm.controls.hasOwnProperty(type)) {
        return null;
      }
      if (type === 'submit' && form._options.readonly) {
        control.show = false;
      }
      var controlInstance = $.extend(true, {
        render: function render() {},
        init: function init() {},
        getOptions: function getOptions() {},
        show: function show() {},
        hide: function hide() {}
      }, coreuiForm.controls[type]);
      controlInstance.init(form, control, form._controlsIndex++);
      form._controls.push(controlInstance);
      return controlInstance;
    }
  };

  var coreuiFormUtils = {
    /**
     * Получение значения поля
     * @param {coreuiFormInstance} form
     * @param {object}             fieldOptions
     * @returns {string|number|null}
     */
    getFieldValue: function getFieldValue(form, fieldOptions) {
      var formRecord = form.getRecord();
      if (fieldOptions && formRecord && typeof fieldOptions.name === 'string' && _typeof(formRecord) === 'object' && formRecord.hasOwnProperty(fieldOptions.name) && ['string', 'number', 'object'].indexOf(_typeof(formRecord[fieldOptions.name])) >= 0) {
        return formRecord[fieldOptions.name];
      }
      return '';
    },
    /**
     * Получение функции из указанного текста
     * @param functionName
     * @param context
     * @returns {null|Window}
     * @private
     */
    getFunctionByName: function getFunctionByName(functionName, context) {
      var namespaces = functionName.split(".");
      var func = namespaces.pop();
      context = context || window;
      for (var i = 0; i < namespaces.length; i++) {
        if (context.hasOwnProperty(namespaces[i])) {
          context = context[namespaces[i]];
        } else {
          return null;
        }
      }
      if (typeof context[func] === 'function') {
        return context[func];
      }
      return null;
    },
    /**
     * Обработка полей в полях
     * @param form
     * @param defaultOptions
     * @param fieldOptions
     */
    mergeFieldOptions: function mergeFieldOptions(form, defaultOptions, fieldOptions) {
      var options = $.extend(true, {}, defaultOptions);
      if (fieldOptions) {
        if (options.hasOwnProperty('attr') && _typeof(options.attr) === 'object' && fieldOptions.hasOwnProperty('attr') && _typeof(fieldOptions.attr) === 'object') {
          fieldOptions.attr = this.mergeAttr(options.attr, fieldOptions.attr);
        }
        options = $.extend(true, {}, options, fieldOptions);
      }
      if (options.hasOwnProperty('width')) {
        if (options.width) {
          var unit = typeof options.width === 'number' ? 'px' : '';
          options.width = options.width + unit;
        } else if (form._options.fieldWidth && options.type !== 'color') {
          var _unit = typeof form._options.fieldWidth === 'number' ? 'px' : '';
          options.width = form._options.fieldWidth + _unit;
        }
      }
      if (options.hasOwnProperty('labelWidth')) {
        if (options.labelWidth >= 0 && options.labelWidth !== null) {
          var _unit2 = typeof options.labelWidth === 'number' ? 'px' : '';
          options.labelWidth = options.labelWidth + _unit2;
        } else if (form._options.labelWidth) {
          var _unit3 = typeof form._options.labelWidth === 'number' ? 'px' : '';
          options.labelWidth = form._options.labelWidth + _unit3;
        }
      }
      return options;
    },
    /**
     * Объединение атрибутов
     * @param attr1
     * @param attr2
     * @returns {object}
     */
    mergeAttr: function mergeAttr(attr1, attr2) {
      var mergeAttr = Object.assign({}, attr1);
      if (_typeof(attr2) === 'object') {
        $.each(attr2, function (name, value) {
          if (mergeAttr.hasOwnProperty(name)) {
            if (name === 'class') {
              mergeAttr[name] += ' ' + value;
            } else if (name === 'style') {
              mergeAttr[name] += ';' + value;
            } else {
              mergeAttr[name] = value;
            }
          } else {
            mergeAttr[name] = value;
          }
        });
      }
      return mergeAttr;
    },
    /**
     * Инициализация и рендер дополнительных полей
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @returns {object}
     * @private
     */
    getAttacheFields: function getAttacheFields(form, options) {
      var fields = [];
      if (_typeof(options) === 'object' && _typeof(options.fields) === 'object' && Array.isArray(options.fields)) {
        $.each(options.fields, function (key, field) {
          var instance = coreuiFormPrivate.initField(form, field);
          if (_typeof(instance) !== 'object') {
            return;
          }
          fields.push({
            hash: instance._hash,
            direction: options.hasOwnProperty('fieldsDirection') ? options.fieldsDirection : 'row',
            content: instance.renderContent()
          });
        });
      }
      return fields;
    },
    /**
     * Форматирование даты
     * @param {string} value
     * @return {string}
     */
    formatDate: function formatDate(value) {
      if (value && value.length === 10) {
        var date = new Date(value);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        value = day + '.' + month + '.' + year;
      }
      return value;
    },
    /**
     * Форматирование даты со временем
     * @param {string} value
     * @return {string}
     */
    formatDateTime: function formatDateTime(value) {
      if (value && value.length >= 10) {
        var date = new Date(value);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = ("00" + date.getHours()).slice(-2);
        var min = ("00" + date.getMinutes()).slice(-2);
        var sec = ("00" + date.getSeconds()).slice(-2);
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        value = day + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
      }
      return value;
    },
    /**
     * Форматирование даты со временем
     * @param {string} value
     * @param {object} lang
     * @return {string}
     */
    formatDateMonth: function formatDateMonth(value, lang) {
      if (value && value.length === 7) {
        var date = new Date(value);
        var year = date.getFullYear();
        var month = date.getMonth();
        var monthLang = lang.date_months.hasOwnProperty(month) ? lang.date_months[month] : '';
        value = monthLang + ' ' + year;
      }
      return value;
    },
    /**
     * Форматирование даты со временем
     * @param {string} value
     * @param {object} lang
     * @return {string}
     */
    formatDateWeek: function formatDateWeek(value, lang) {
      if (value && value.length >= 7) {
        var year = value.substring(0, 4);
        var week = value.substring(6);
        value = year + ' ' + lang.date_week + ' ' + week;
      }
      return value;
    },
    /**
     * Получение значения из объекта по указанному пути
     * @param {object} obj
     * @param {string} path
     * @return {*}
     */
    getObjValue: function getObjValue(obj, path) {
      path = path.split('.');
      for (var i = 0, len = path.length; i < len; i++) {
        obj = obj[path[i]];
      }
      return obj;
    },
    /**
     * Проверка текста на содержимое JSON
     * @param text
     * @return {boolean}
     */
    isJson: function isJson(text) {
      if (typeof text !== "string") {
        return false;
      }
      try {
        var json = JSON.parse(text);
        return _typeof(json) === 'object' || Array.isArray(json);
      } catch (error) {
        return false;
      }
    },
    /**
     * Проверка на объект
     * @param value
     */
    isObject: function isObject(value) {
      return _typeof(value) === 'object' && !Array.isArray(value) && value !== null;
    },
    /**
     * Проверка на число
     * @param num
     * @returns {boolean}
     * @private
     */
    isNumeric: function isNumeric(num) {
      return (typeof num === 'number' || typeof num === "string" && num.trim() !== '') && !isNaN(num);
    },
    /**
     * @returns {string}
     * @private
     */
    hashCode: function hashCode() {
      return this.crc32((new Date().getTime() + Math.random()).toString()).toString(16);
    },
    /**
     * Hash crc32
     * @param str
     * @returns {number}
     * @private
     */
    crc32: function crc32(str) {
      for (var a, o = [], c = 0; c < 256; c++) {
        a = c;
        for (var f = 0; f < 8; f++) {
          a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
        }
        o[c] = a;
      }
      for (var n = -1, t = 0; t < str.length; t++) {
        n = n >>> 8 ^ o[255 & (n ^ str.charCodeAt(t))];
      }
      return (-1 ^ n) >>> 0;
    },
    /**
     * Округление
     * @param number
     * @param precision
     * @returns {number}
     */
    round: function round(number, precision) {
      precision = typeof precision !== 'undefined' ? parseInt(precision) : 0;
      if (precision === 0) {
        return Math.round(number);
      } else if (precision > 0) {
        var pow = Math.pow(10, precision);
        return Math.round(number * pow) / pow;
      } else {
        var _pow = Math.pow(10, precision);
        return Math.round(number / _pow) * _pow;
      }
    }
  };

  var coreuiFormInstance = {
    _options: {
      id: null,
      title: '',
      lang: 'en',
      langList: {},
      send: {
        url: '',
        method: 'POST',
        format: 'form'
      },
      validResponse: {
        headers: null,
        dataType: null
      },
      width: null,
      minWidth: null,
      maxWidth: null,
      labelWidth: 200,
      fieldWidth: null,
      controlsOffset: null,
      readonly: false,
      validate: false,
      successLoadUrl: '',
      errorClass: '',
      layout: '[position_default]',
      onSubmit: null,
      onSubmitSuccess: null,
      errorMessageScrollOffset: 70,
      record: {},
      fields: [],
      controls: []
    },
    _lock: false,
    _fieldsIndex: 0,
    _groupsIndex: 0,
    _controlsIndex: 0,
    _groups: [],
    _fields: [],
    _controls: [],
    _events: {},
    /**
     * Инициализация
     * @param {object} options
     * @private
     */
    _init: function _init(options) {
      this._options = $.extend(true, {}, this._options, options);
      if (!this._options.id) {
        this._options.id = coreuiFormUtils.hashCode();
      }
      if (this._options.hasOwnProperty('labelWidth')) {
        if (this._options.labelWidth >= 0 && this._options.labelWidth !== null) {
          var unit = typeof this._options.labelWidth === 'number' ? 'px' : '';
          this._options.labelWidth = this._options.labelWidth + unit;
        }
      }
      if (!this._options.hasOwnProperty('controlsOffset') || this._options.controlsOffset === null) {
        this._options.controlsOffset = this._options.labelWidth;
      } else {
        if (this._options.controlsOffset >= 0) {
          var _unit = typeof this._options.controlsOffset === 'number' ? 'px' : '';
          this._options.controlsOffset = this._options.controlsOffset + _unit;
        }
      }
    },
    /**
     * Инициализация событий
     */
    initEvents: function initEvents() {
      var that = this;
      var formContainer = '#coreui-form-' + this._options.id + ' > form';
      $(formContainer).on('submit', function () {
        setTimeout(function () {
          that.send.apply(that);
        }, 0);
        return false;
      });
      coreuiFormPrivate.trigger(this, 'show');
    },
    /**
     * Получение id формы
     * @return {string|null}
     */
    getId: function getId() {
      return this._options.hasOwnProperty('id') ? this._options.id : null;
    },
    /**
     *
     * @param element
     * @returns {*}
     */
    render: function render(element) {
      var that = this;
      var widthSizes = [];
      var layout = this._options.layout && typeof this._options.layout === 'string' ? this._options.layout : '[position_default]';
      var controls = [];
      var formAttr = [];
      if (this._options.width) {
        var unit = typeof this._options.width === 'number' ? 'px' : '';
        widthSizes.push('width:' + this._options.width + unit);
      }
      if (this._options.minWidth) {
        var _unit2 = typeof this._options.minWidth === 'number' ? 'px' : '';
        widthSizes.push('min-width:' + this._options.minWidth + _unit2);
      }
      if (this._options.maxWidth) {
        var _unit3 = typeof this._options.maxWidth === 'number' ? 'px' : '';
        widthSizes.push('max-width:' + this._options.maxWidth + _unit3);
      }
      var positions = [];
      var positionMatches = Array.from(layout.matchAll(/\[position_([\w_\d]+)\]/g));
      if (positionMatches.length > 0) {
        $.each(positionMatches, function (key, match) {
          positions.push(match[1]);
          layout = layout.replace('[position_' + match[1] + ']', '<div class="coreui-form-position-' + match[1] + '"></div>');
        });
      }
      var layoutObj = $(layout);

      // Поля
      if (_typeof(this._options.fields) === 'object' && Array.isArray(this._options.fields) && this._options.fields.length > 0) {
        var positionsContent = {};
        if (positions.length > 0) {
          $.each(this._options.fields, function (key, field) {
            var position = field.hasOwnProperty('position') && (typeof field.position === 'string' || typeof field.position === 'number') ? positions.indexOf(field.position) >= 0 ? field.position : null : 'default';
            if (typeof position !== 'string') {
              return;
            }
            var type = field.hasOwnProperty('type') && typeof field.type === 'string' ? field.type : '';
            var instance = null;
            if (type === 'group') {
              instance = coreuiFormPrivate.initGroup(that, field);
            } else {
              instance = coreuiFormPrivate.initField(that, field);
            }
            if (!instance || _typeof(instance) !== 'object') {
              return;
            }
            if (!positionsContent.hasOwnProperty(position)) {
              positionsContent[position] = [];
            }
            positionsContent[position].push(instance.render());
          });
        }
        if (Object.keys(positionsContent).length >= 0) {
          $.each(positionsContent, function (name, fieldContents) {
            $.each(fieldContents, function (key, fieldContent) {
              var container = layoutObj.closest('.coreui-form-position-' + name);
              if (!container[0]) {
                container = layoutObj.find('.coreui-form-position-' + name);
              }
              container.append(fieldContent);
            });
          });
        }
      }

      // Элементы управления
      if (_typeof(this._options.controls) === 'object' && Array.isArray(this._options.controls) && this._options.controls.length > 0) {
        $.each(this._options.controls, function (key, control) {
          var instance = coreuiFormPrivate.initControl(that, control);
          if (!instance || _typeof(instance) !== 'object') {
            return;
          }
          controls.push({
            show: !control.hasOwnProperty('show') || control.show,
            index: that._controlsIndex - 1,
            content: instance.render()
          });
        });
      }
      if (typeof this._options.validate === 'boolean' && this._options.validate) {
        formAttr.push('novalidate');
      }
      var containerElement = $(ejs.render(tpl$1['form.html'], {
        form: this._options,
        formAttr: formAttr ? ' ' + formAttr.join(' ') : '',
        widthSizes: widthSizes,
        controls: controls
      }));
      containerElement.find('.coreui-form__fields').append(layoutObj);
      var formId = this.getId();
      $.each(controls, function (key, control) {
        containerElement.find('#coreui-form-' + formId + '-control-' + control.index).append(control.content);
      });
      if (element === undefined) {
        return containerElement;
      }

      // Dom element
      var domElement = null;
      if (typeof element === 'string') {
        domElement = document.getElementById(element);
      } else if (element instanceof HTMLElement) {
        domElement = element;
      }
      if (domElement) {
        $(domElement).html(containerElement);
        this.initEvents();
      }
    },
    /**
     *
     */
    lock: function lock() {
      this._lock = true;
      $.each(this._controls, function (key, control) {
        var controlOptions = control.getOptions();
        if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
          control.lock();
        }
      });
    },
    /**
     * Разблокировка
     */
    unlock: function unlock() {
      this._lock = false;
      $.each(this._controls, function (key, control) {
        var controlOptions = control.getOptions();
        if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
          control.unlock();
        }
      });
    },
    /**
     * Отправка данных формы
     */
    send: function send() {
      if (this._lock) {
        return;
      }
      if (typeof this._options.validate === 'boolean' && this._options.validate) {
        var isValid = this.validate();
        if (!isValid) {
          return;
        }
      }
      var onsubmit = null;
      var data = this.getData();
      if (typeof this._options.onSubmit === 'function') {
        onsubmit = this._options.onSubmit;
      } else if (typeof this._options.onSubmit === 'string' && this._options.onSubmit) {
        var func = coreuiFormUtils.getFunctionByName(this._options.onSubmit);
        if (typeof func === 'function') {
          onsubmit = func;
        } else if (typeof this._options.onSubmit === 'string') {
          onsubmit = new Function('form', 'data', this._options.onSubmit);
        }
      }
      if (typeof onsubmit === 'function') {
        var onSubmitResult = onsubmit(this, data);
        if (onSubmitResult === false) {
          return;
        }
      }
      var results = coreuiFormPrivate.trigger(this, 'send', [this, data]);
      var isStopSend = false;
      $.each(results, function (key, result) {
        if (result === false) {
          isStopSend = true;
          return false;
        }
      });
      if (isStopSend) {
        return;
      }

      /**
       * Сборка данных формы для отправки
       * @param {FormData} formData
       * @param {object}   data
       * @param {string}   parentKey
       */
      function buildFormData(formData, data, parentKey) {
        if (data && (Array.isArray(data) || coreuiFormUtils.isObject(data))) {
          Object.keys(data).forEach(function (key) {
            buildFormData(formData, data[key], parentKey ? parentKey + '[' + key + ']' : key);
          });
        } else {
          formData.append(parentKey, data == null ? '' : data);
        }
      }
      this.lock();
      var that = this;
      var sendFormat = ['form', 'json'].indexOf(this._options.send.format) >= 0 ? this._options.send.format : 'form';
      var dataFormat = null;
      var contentType = null;
      if (sendFormat === 'json') {
        contentType = "application/json; charset=utf-8";
        dataFormat = JSON.stringify(data);
      } else {
        contentType = false;
        dataFormat = new FormData();
        buildFormData(dataFormat, data);
      }

      /**
       * Запрос выполнился успешно
       * @param result
       */
      var successSend = function successSend(result) {
        that.hideError();
        coreuiFormPrivate.trigger(that, 'send_success', [that, result]);
        var jsonResponse = null;
        if (typeof result === 'string') {
          try {
            var parsedResponse = JSON.parse(result);
            if (_typeof(parsedResponse) === 'object' && parsedResponse !== null && !Array.isArray(parsedResponse)) {
              jsonResponse = parsedResponse;
            }
          } catch (e) {
            // ignore
          }
        } else {
          jsonResponse = result;
        }
        if (jsonResponse !== null && _typeof(jsonResponse) === 'object') {
          if (jsonResponse.hasOwnProperty('scripts') && Array.isArray(jsonResponse.scripts)) {
            $.each(jsonResponse.scripts, function (key, script) {
              if (typeof script === 'string') {
                new Function(script)();
              }
            });
          }
          if (jsonResponse.hasOwnProperty('loadUrl') && typeof jsonResponse.loadUrl === 'string') {
            location.href = jsonResponse.loadUrl;
          }
        }
        if (that._options.hasOwnProperty('onSubmitSuccess')) {
          if (typeof that._options.onSubmitSuccess === 'function') {
            that._options.onSubmitSuccess();
          } else if (typeof that._options.onSubmitSuccess === 'string') {
            new Function(that._options.onSubmitSuccess)();
          }
        }
        if (that._options.hasOwnProperty('successLoadUrl') && typeof that._options.successLoadUrl === 'string' && that._options.successLoadUrl !== '') {
          var successLoadUrl = that._options.successLoadUrl;

          // Замена параметров
          if (jsonResponse !== null && _typeof(jsonResponse) === 'object') {
            var regx = new RegExp('\\[response\\.([\\d\\w\\.]+)\\]', 'uig');
            var urlParams = {};
            while (result = regx.exec(successLoadUrl)) {
              urlParams[result[0]] = result[1];
            }
            if (Object.keys(urlParams).length > 0) {
              $.each(urlParams, function (param, path) {
                var value = coreuiFormUtils.getObjValue(jsonResponse, path);
                value = typeof value !== 'undefined' ? value : '';
                successLoadUrl = successLoadUrl.replace(new RegExp(param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
              });
            }
          }
          var equalHash = location.hash === successLoadUrl;
          location.href = successLoadUrl;
          if (equalHash) {
            window.onhashchange();
          }
        }
      };

      /**
       * Запрос с ошибкой
       * @param xhr
       * @param textStatus
       * @param errorThrown
       */
      var errorSend = function errorSend(xhr, textStatus, errorThrown) {
        var errorMessage = that.getLang().send_error || '';
        var data = {};
        try {
          var parsedResponse = JSON.parse(xhr.responseText);
          if (_typeof(parsedResponse) === 'object' && parsedResponse !== null && !Array.isArray(parsedResponse)) {
            data = parsedResponse;
          }
        } catch (e) {
          // ignore
        }
        if (data.hasOwnProperty('error_message') && typeof data.error_message === 'string' && data.error_message !== '') {
          errorMessage = data.error_message;
        }
        that.showError(errorMessage);
        coreuiFormPrivate.trigger(that, 'send_error', [that, xhr, textStatus, errorThrown]);
      };
      $.ajax({
        url: this._options.send.url,
        method: this._options.send.method,
        data: dataFormat,
        contentType: contentType,
        processData: false,
        beforeSend: function beforeSend(xhr) {
          coreuiFormPrivate.trigger(that, 'send_start', [that, xhr]);
        },
        success: function success(result, textStatus, xhr) {
          var isValidResponse = true;
          if (_typeof(that._options.validResponse) === 'object') {
            if (Array.isArray(that._options.validResponse.headers)) {
              $.each(that._options.validResponse.headers, function (header, headerValues) {
                if (typeof headerValues === 'string') {
                  if (xhr.getResponseHeader(header) != headerValues) {
                    isValidResponse = false;
                    return false;
                  }
                } else if (Array.isArray(headerValues)) {
                  if (headerValues.indexOf(xhr.getResponseHeader(header)) < 0) {
                    isValidResponse = false;
                    return false;
                  }
                }
              });
            }
            if (isValidResponse) {
              if (typeof that._options.validResponse.dataType === 'string') {
                if (that._options.validResponse.dataType === 'json') {
                  if (_typeof(result) !== 'object' && !Array.isArray(result) && !coreuiFormUtils.isJson(result)) {
                    isValidResponse = false;
                  }
                }
              } else if (Array.isArray(that._options.validResponse.dataType)) {
                $.each(that._options.validResponse.dataType, function (key, dataType) {
                  if (dataType === 'json') {
                    if (_typeof(result) !== 'object' && !Array.isArray(result) && !coreuiFormUtils.isJson(result)) {
                      isValidResponse = false;
                      return false;
                    }
                  }
                });
              }
            }
          }
          if (isValidResponse) {
            successSend(result);
          } else {
            errorSend(xhr, textStatus);
          }
        },
        error: errorSend,
        complete: function complete(xhr, textStatus) {
          that.unlock();
          coreuiFormPrivate.trigger(that, 'send_end', [that, xhr, textStatus]);
        }
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return this._options;
    },
    /**
     * Получение записи
     * @returns {object}
     */
    getRecord: function getRecord() {
      if (this._options.hasOwnProperty('record') && _typeof(this._options.record) === 'object') {
        return this._options.record;
      }
      return {};
    },
    /**
     * Получение данных с формы
     * @returns {object}
     */
    getData: function getData() {
      var data = {};
      $.each(this._fields, function (key, field) {
        var fieldOptions = field.getOptions();
        if (fieldOptions.hasOwnProperty('name') && fieldOptions.name) {
          var value = field.getValue();
          if (value !== null) {
            data[fieldOptions.name] = value;
          }
        }
      });
      return data;
    },
    /**
     * Получение полей
     * @returns {object}
     */
    getFields: function getFields() {
      return this._fields;
    },
    /**
     * Получение элементов управления
     * @returns {object}
     */
    getControls: function getControls() {
      return this._controls;
    },
    /**
     * Получение групп полей
     * @returns {object}
     */
    getGroups: function getGroups() {
      return this._groups;
    },
    /**
     * Получение поля по имени
     * @param {string} name
     * @returns {object}
     */
    getField: function getField(name) {
      var field = {};
      $.each(this._fields, function (key, fieldInstance) {
        var fieldOptions = fieldInstance.getOptions();
        if (fieldOptions.hasOwnProperty('name') && fieldOptions.name === name) {
          field = fieldInstance;
        }
      });
      return field;
    },
    /**
     * Смена состояний полей формы
     */
    readonly: function readonly(isReadonly) {
      $.each(this._fields, function (key, fieldInstance) {
        fieldInstance.readonly(isReadonly);
      });
      $.each(this._controls, function (key, control) {
        var controlOptions = control.getOptions();
        if (controlOptions.hasOwnProperty('type') && controlOptions.type === 'submit') {
          if (isReadonly) {
            control.hide();
          } else {
            control.show();
          }
        }
      });
    },
    /**
     * Показ всех элементов управления
     */
    showControls: function showControls() {
      $.each(this._controls, function (key, control) {
        control.show();
      });
    },
    /**
     * Скрытие всех элементов управления
     */
    hideControls: function hideControls() {
      $.each(this._controls, function (key, control) {
        control.hide();
      });
    },
    /**
     * Валидация полей
     * @return {boolean}
     */
    validate: function validate() {
      var isValid = true;
      $.each(this._fields, function (key, field) {
        if (field.isValid() === false) {
          field.validate(false);
          isValid = false;
        } else {
          field.validate(null);
        }
      });
      return isValid;
    },
    /**
     * Показ сообщения с ошибкой
     * @param {string} message
     * @param {object} options
     */
    showError: function showError(message, options) {
      var formContainer = $('#coreui-form-' + this._options.id + ' > form');
      var formError = formContainer.find('> .coreui-form__error');
      if (formError[0]) {
        formError.remove();
      }
      options = _typeof(options) === 'object' && !Array.isArray(options) && options !== null ? options : {};
      if (typeof this._options.errorClass === 'string' && this._options.errorClass !== '') {
        options["class"] = options.hasOwnProperty('class') ? options["class"] : '';
        options["class"] += ' ' + this._options.errorClass;
      }
      var errorOptions = {
        "class": options.hasOwnProperty('class') && typeof options["class"] === 'string' ? options["class"] : '',
        dismiss: options.hasOwnProperty('dismiss') ? !!options.dismiss : true
      };
      formContainer.prepend(ejs.render(tpl$1['form-error.html'], {
        message: message,
        options: errorOptions
      }));
      if (!options.hasOwnProperty('scroll') || options.scroll) {
        $('html,body').animate({
          scrollTop: formContainer.offset().top - options.errorMessageScrollOffset
        }, 'fast');
      }
    },
    /**
     * Скрытие сообщения с ошибкой
     */
    hideError: function hideError() {
      $('#coreui-form-' + this._options.id + ' > form > .coreui-form__error').remove();
    },
    /**
     * Подписка на событие
     * @param {string}      eventName
     * @param {function}    callback
     * @param {object|null} context
     */
    on: function on(eventName, callback, context) {
      if (_typeof(this._events[eventName]) !== 'object') {
        this._events[eventName] = [];
      }
      this._events[eventName].push({
        context: context || this,
        callback: callback,
        singleExec: false
      });
    },
    /**
     * Подписка на событие таким образом, что оно будет выполнено один раз
     * @param {string}      eventName
     * @param {function}    callback
     * @param {object|null} context
     */
    one: function one(eventName, callback, context) {
      if (_typeof(this._events[eventName]) !== 'object') {
        this._events[eventName] = [];
      }
      this._events[eventName].push({
        context: context || this,
        callback: callback,
        singleExec: true
      });
    },
    /**
     * Удаление формы
     */
    destruct: function destruct() {
      $('#coreui-form-' + this._options.id).remove();
      delete coreuiForm._instances[this.getId()];
    },
    /**
     * Получение настроек языка
     * @private
     */
    getLang: function getLang() {
      return $.extend(true, {}, this._options.langList);
    }
  };

  var coreuiForm = {
    lang: {},
    fields: {},
    controls: {},
    _instances: {},
    _settings: {
      labelWidth: 200,
      lang: 'en',
      "class": '',
      sendDataFormat: 'form',
      errorMessageScrollOffset: 70
    },
    /**
     * Создание экземпляра формы
     * @param {object} options
     * @returns {coreuiFormInstance}
     */
    create: function create(options) {
      if (!coreuiFormUtils.isObject(options)) {
        options = {};
      }
      options = $.extend(true, {}, options);
      if (!options.hasOwnProperty('lang')) {
        options.lang = this.getSetting('lang');
      }
      var langList = this.lang.hasOwnProperty(options.lang) ? this.lang[options.lang] : {};
      options.langList = options.hasOwnProperty('langList') && coreuiFormUtils.isObject(options.langList) ? $.extend(true, {}, langList, options.langList) : langList;
      options.errorMessageScrollOffset = options.hasOwnProperty('errorMessageScrollOffset') && coreuiFormUtils.isNumeric(options.errorMessageScrollOffset) ? options.errorMessageScrollOffset : this.getSetting('errorMessageScrollOffset');
      options.labelWidth = options.hasOwnProperty('labelWidth') ? options.labelWidth : this.getSetting('labelWidth');
      options.errorClass = options.hasOwnProperty('errorClass') && typeof options.errorClass === 'string' ? options.errorClass : this.getSetting('errorClass');
      if (!options.hasOwnProperty('send') || !coreuiFormUtils.isObject(options.send) || !options.send.hasOwnProperty('format') || typeof options.send.format !== 'string') {
        if (!options.hasOwnProperty('send') || !coreuiFormUtils.isObject(options.send)) {
          options.send = {};
        }
        options.send.format = this.getSetting('sendDataFormat');
      }
      var instance = $.extend(true, {}, coreuiFormInstance);
      instance._init(options);
      var formId = instance.getId();
      this._instances[formId] = instance;
      return instance;
    },
    /**
     * Получение экземпляра формы по id
     * @param {string} id
     * @returns {coreuiFormInstance|null}
     */
    get: function get(id) {
      if (!this._instances.hasOwnProperty(id)) {
        return null;
      }
      if (!$('#coreui-form-' + id)[0]) {
        delete this._instances[id];
        return null;
      }
      return this._instances[id];
    },
    /**
     * Установка настроек
     * @param {object} settings
     */
    setSettings: function setSettings(settings) {
      this._settings = $.extend({}, this._settings, settings);
    },
    /**
     * Получение значения настройки
     * @param {string} name
     */
    getSetting: function getSetting(name) {
      var value = null;
      if (this._settings.hasOwnProperty(name)) {
        value = this._settings[name];
      }
      return value;
    }
  };

  coreuiForm.lang.ru = {
    "modal_select": "Выбрать",
    "modal_loading": "Загрузка...",
    "switch_yes": "Да",
    "switch_no": "Нет",
    "dataset_add": "Добавить",
    "date_months": ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    "date_week": "неделя",
    "file_upload_select": "Выберите файл",
    "file_upload_dropzone": "Поместите сюда свои файлы",
    "send_error": "Произошла ошибка. Попробуйте снова или обратитесь к администратору",
    "required_field": "Обязательное поле",
    "change": "изменить",
    "cancel": "отмена"
  };

  coreuiForm.lang.en = {
    "modal_select": "Select",
    "modal_loading": "Loading...",
    "switch_yes": "Yes",
    "switch_no": "No",
    "dataset_add": "Add",
    "date_months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "date_week": "week",
    "file_upload_select": "Выберите файл",
    "file_upload_dropzone": "Drop your files here",
    "send_error": "An error has occurred. Please try again or contact your administrator",
    "required_field": "Required field",
    "change": "change",
    "cancel": "cancel"
  };

  coreuiForm.controls.button = {
    _form: null,
    _index: null,
    _options: {
      type: 'button',
      content: null,
      onClick: null,
      attr: {
        "class": 'btn btn-secondary'
      }
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function init(form, options, index) {
      this._options = $.extend({}, this._options, options);
      this._form = form;
      this._index = index;
      var that = this;
      form.on('show', function () {
        that._initEvents();
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function render() {
      var attributes = [];
      var options = this.getOptions();
      options.attr.type = 'button';
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['controls/button.html'], {
        control: this._options,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
        }
      });
    },
    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._form.getId() + '-control-' + this._index).show(duration || 0);
    },
    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._form.getId() + '-control-' + this._index).hide(duration || 0);
    },
    /**
     *
     */
    lock: function lock() {
      var button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');
      if (!button.find('.spinner-border')[0]) {
        button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
      }
      if (!button.attr('disabled')) {
        button.attr('disabled', 'disabled');
      }
    },
    /**
     * Инициализация событий связанных с элементом управления
     */
    _initEvents: function _initEvents() {
      var that = this;
      if (['function', 'string'].indexOf(_typeof(this._options.onClick)) >= 0) {
        $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button').click(function (event) {
          if (typeof that._options.onClick === 'function') {
            that._options.onClick(that._form, event);
          } else {
            new Function('form', 'event', that._options.onClick)(that._form, event);
          }
        });
      }
    }
  };

  coreuiForm.controls.custom = {
    _form: null,
    _index: null,
    _options: {
      type: 'custom',
      content: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function init(form, options, index) {
      this._options = $.extend({}, this._options, options);
      this._form = form;
      this._index = index;
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + form.getId() + '-control-' + this._index).show(duration || 0);
    },
    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + form.getId() + '-control-' + this._index).hide(duration || 0);
    },
    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function render() {
      return this._options.content;
    }
  };

  coreuiForm.controls.link = {
    _form: null,
    _index: null,
    _options: {
      type: 'link',
      url: null,
      content: null,
      onClick: null,
      attr: {
        "class": 'btn btn-link'
      }
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function init(form, options, index) {
      this._options = $.extend({}, this._options, options);
      this._form = form;
      this._index = index;
      var that = this;
      form.on('show', function () {
        that._initEvents();
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._form.getId() + '-control-' + this._index).show(duration || 0);
    },
    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._form.getId() + '-control-' + this._index).hide(duration || 0);
    },
    /**
     *
     */
    lock: function lock() {
      var button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');
      if (!button.find('.spinner-border')[0]) {
        button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
      }
      if (!button.attr('disabled')) {
        button.attr('disabled', 'disabled');
      }
    },
    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function render() {
      var attributes = [];
      var options = this.getOptions();
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['controls/link.html'], {
        control: this._options,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
        }
      });
    },
    /**
     * Инициализация событий связанных с элементом управления
     */
    _initEvents: function _initEvents() {
      var that = this;
      if (['function', 'string'].indexOf(_typeof(this._options.onClick)) >= 0) {
        $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > a').click(function (event) {
          if (typeof that._options.onClick === 'function') {
            that._options.onClick(that._form, event);
          } else {
            new Function('form', 'event', that._options.onClick)(that._form, event);
          }
        });
      }
    }
  };

  coreuiForm.controls.submit = {
    _form: null,
    _index: null,
    _options: {
      type: 'submit',
      content: null,
      onClick: null,
      show: true,
      attr: {
        "class": 'btn btn-primary'
      }
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object} options
     * @param {int} index
     */
    init: function init(form, options, index) {
      this._options = $.extend({}, this._options, options);
      this._form = form;
      this._index = index;
      var that = this;
      form.on('show', function () {
        that._initEvents();
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Показ контрола
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._form.getId() + '-control-' + this._index).show(duration || 0);
    },
    /**
     * Скрытие контрола
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._form.getId() + '-control-' + this._index).hide(duration || 0);
    },
    /**
     *
     */
    lock: function lock() {
      var button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');
      if (!button.find('.spinner-border')[0]) {
        button.prepend('<span class="spinner-border spinner-border-sm"></span> ');
      }
      if (!button.attr('disabled')) {
        button.attr('disabled', 'disabled');
      }
    },
    /**
     *
     */
    unlock: function unlock() {
      var button = $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button');
      button.find('.spinner-border').remove();
      button.removeAttr('disabled');
    },
    /**
     * Формирование контента для размещения на странице
     * @returns {string}
     */
    render: function render() {
      var attributes = [];
      var options = this.getOptions();
      options.attr.type = 'submit';
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['controls/button.html'], {
        control: this._options,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
        }
      });
    },
    /**
     * Инициализация событий связанных с элементом управления
     */
    _initEvents: function _initEvents() {
      var that = this;
      if (['function', 'string'].indexOf(_typeof(this._options.onClick)) >= 0) {
        $('#coreui-form-' + this._form.getId() + '-control-' + this._index + ' > button').click(function (event) {
          if (typeof that._options.onClick === 'function') {
            that._options.onClick(that._form, event);
          } else {
            new Function('form', 'event', that._options.onClick)(that._form, event);
          }
        });
      }
    }
  };

  coreuiForm.fields.checkbox = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: [],
    _options: {
      type: 'checkbox',
      name: null,
      label: null,
      labelWidth: null,
      inline: false,
      outContent: null,
      description: null,
      errorText: null,
      options: [],
      fields: null,
      required: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {boolean} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {object}
     */
    getValue: function getValue() {
      if (this._options.readonly) {
        return this._value;
      } else {
        var values = [];
        $('.content-' + this._hash + ' input[type=checkbox]:checked').each(function () {
          values.push($(this).val());
        });
        return values;
      }
    },
    /**
     * Установка значений в поле
     * @param {object|null|string|number} value
     */
    setValue: function setValue(value) {
      if (['string', 'number', 'object'].indexOf(_typeof(value)) < 0) {
        return;
      }
      if (_typeof(value) === 'object') {
        if (value !== null && !Array.isArray(value)) {
          return;
        }
      } else {
        value = [value];
      }
      var that = this;
      this._value = [];
      if (this._options.readonly) {
        $('.content-' + that._hash).empty();
        var fieldOptions = this.getOptions();
        if (fieldOptions.hasOwnProperty('options') && _typeof(fieldOptions.options) === 'object' && Array.isArray(fieldOptions.options) && Array.isArray(value)) {
          var selectedItems = [];
          $.each(fieldOptions.options, function (key, option) {
            if (option.hasOwnProperty('value')) {
              $.each(value, function (key, val) {
                if (option.value == val) {
                  if (option.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(option.text)) >= 0) {
                    selectedItems.push(option.text);
                  }
                  that._value.push(val);
                  return false;
                }
              });
            }
          });
          $('.content-' + that._hash).text(selectedItems.join(', '));
        }
      } else {
        $('.content-' + this._hash + ' input[type=radio]').prop('checked', false);
        if (Array.isArray(value)) {
          $('.content-' + this._hash + ' input[type=radio]').each(function (key, itemValue) {
            $.each(value, function (key, val) {
              if (val == $(itemValue).val()) {
                $(itemValue).prop('checked', true);
                that._value.push(val);
                return false;
              }
            });
          });
        }
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var lastInput = $('.form-check:last-child', container);
      var inputs = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        inputs.removeClass('is-invalid');
        inputs.removeClass('is-valid');
      } else if (isValid) {
        inputs.removeClass('is-invalid');
        inputs.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          lastInput.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        inputs.removeClass('is-valid');
        inputs.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          lastInput.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      if (this._options.required && !this._options.readonly) {
        return this.getValue().length > 0;
      }
      return true;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: this._options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var that = this;
      var checkboxOptions = [];
      var fieldOptions = this.getOptions();
      var selectedItems = [];
      if (fieldOptions.hasOwnProperty('options') && _typeof(fieldOptions.options) === 'object' && Array.isArray(fieldOptions.options)) {
        $.each(fieldOptions.options, function (key, option) {
          var attributes = [];
          var itemAttr = {
            type: 'checkbox',
            "class": 'form-check-input'
          };
          var optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(option.text)) >= 0 ? option.text : '';
          if (fieldOptions.name) {
            itemAttr.name = that._options.name;
          }
          if (fieldOptions.required) {
            itemAttr.required = 'required';
          }
          $.each(option, function (name, value) {
            if (name !== 'text') {
              if (name === 'class') {
                itemAttr[name] = itemAttr[name] + ' ' + value;
              } else {
                itemAttr[name] = value;
              }
            }
          });
          itemAttr.id = coreuiFormUtils.hashCode();
          if (_typeof(that._value) === 'object' && Array.isArray(that._value)) {
            $.each(that._value, function (key, itemValue) {
              if (itemValue == option.value) {
                itemAttr.checked = 'checked';
                if (option.hasOwnProperty('text') && option.text) {
                  selectedItems.push(option.text);
                }
                return false;
              }
            });
          } else if (that._value == option.value) {
            if (option.hasOwnProperty('text') && option.text) {
              selectedItems.push(option.text);
            }
            itemAttr.checked = 'checked';
          }
          $.each(itemAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
          });
          checkboxOptions.push({
            id: itemAttr.id,
            text: optionText,
            attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
          });
        });
      }
      var value = _typeof(this._value) === 'object' && Array.isArray(this._value) ? this._value.join(', ') : this._value;
      return ejs.render(tpl$1['fields/checkbox.html'], {
        field: fieldOptions,
        value: value,
        render: {
          options: checkboxOptions,
          selectedItems: selectedItems
        }
      });
    }
  };

  coreuiForm.fields.color = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'color',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-control form-control-color d-inline-block'
      },
      required: null,
      readonly: null,
      datalist: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        $('.content-' + this._hash + ' input').val(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var input = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
      } else if (isValid) {
        input.removeClass('is-invalid');
        input.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        input.removeClass('is-valid');
        input.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      var input = $('.content-' + this._hash + ' input');
      if (input[0]) {
        return input.is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     *
     * @return {*}
     * @private
     */
    _renderContent: function _renderContent() {
      var attributes = [];
      var datalist = [];
      var options = this.getOptions();
      var datalistId = coreuiFormUtils.hashCode();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      options.attr.type = options.type;
      options.attr.value = this._value;
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      if (options.hasOwnProperty('datalist') && _typeof(options.datalist) === 'object' && Array.isArray(options.datalist)) {
        options.attr.list = datalistId;
        $.each(options.datalist, function (key, itemAttributes) {
          var datalistAttr = [];
          $.each(itemAttributes, function (name, value) {
            datalistAttr.push(name + '="' + value + '"');
          });
          datalist.push({
            attr: datalistAttr.length > 0 ? ' ' + datalistAttr.join(' ') : ''
          });
        });
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/color.html'], {
        field: options,
        datalistId: datalistId,
        value: this._value,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          datalist: datalist
        }
      });
    },
    /**
     *
     * @return {*}
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var options = this.getOptions();
      return ejs.render(tpl$1['fields/color.html'], {
        field: options,
        value: this._value
      });
    }
  };

  coreuiForm.fields.custom = {
    _id: '',
    _hash: '',
    _form: null,
    _value: null,
    _options: {
      type: 'custom',
      label: null,
      labelWidth: null,
      width: null,
      content: '',
      outContent: null,
      description: null,
      required: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
      this._hash = coreuiFormUtils.hashCode();
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {},
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения из поля
     */
    getValue: function getValue() {},
    /**
     * Установка значения в поле
     * @param {object} value
     */
    setValue: function setValue(value) {},
    /**
     * Формирование поля
     * @returns {object}
     */
    render: function render() {
      var that = this;
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      var field = $(ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: '',
        attachFields: attachFields
      }));
      $.each(this.renderContent(), function (i, content) {
        field.find(".content-" + that._hash).append(content);
      });
      return field;
    },
    /**
     * Формирование контента поля
     * @return {Array}
     */
    renderContent: function renderContent() {
      var content = this.getOptions().content;
      var result = [];
      if (typeof content === 'string') {
        result.push(content);
      } else if (content instanceof Object) {
        if (!Array.isArray(content)) {
          content = [content];
        }
        for (var i = 0; i < content.length; i++) {
          if (typeof content[i] === 'string') {
            result.push(content[i]);
          } else if (!Array.isArray(content[i]) && content[i].hasOwnProperty('component') && typeof content[i].component === 'string' && content[i].component.substring(0, 6) === 'coreui') {
            var name = content[i].component.split('.')[1];
            if (CoreUI.hasOwnProperty(name) && coreuiFormUtils.isObject(CoreUI[name])) {
              var instance = CoreUI[name].create(content[i]);
              result.push(instance.render());
              this._form.on('show', instance.initEvents, instance, true);
            }
          } else {
            result.push(JSON.stringify(content[i]));
          }
        }
      }
      return result;
    }
  };

  coreuiForm.fields.dataset = {
    _id: '',
    _hash: '',
    _form: null,
    _value: [],
    _renderOptions: [],
    _options: {
      type: 'dataset',
      name: null,
      label: null,
      labelWidth: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      required: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
      this._hash = coreuiFormUtils.hashCode();
      var that = this;
      form.on('show', function () {
        if (!that._options.readonly) {
          that._initEvents();
        }
      });
      if (options.hasOwnProperty('options') && _typeof(options.options) === 'object' && Array.isArray(options.options)) {
        $.each(options.options, function (key, option) {
          var name = option.hasOwnProperty('name') && ['string', 'number'].indexOf(_typeof(option.name)) >= 0 ? option.name : '';
          var type = option.hasOwnProperty('type') && typeof option.type === 'string' ? option.type : 'text';
          var attributes = option.hasOwnProperty('attr') && _typeof(option.attr) === 'object' && !Array.isArray(option.attr) ? option.attr : {};
          var items = option.hasOwnProperty('items') && _typeof(option.items) === 'object' && Array.isArray(option.items) ? option.items : [];
          var valueY = option.hasOwnProperty('valueY') && ['string', 'numeric'].indexOf(_typeof(option.valueY)) >= 0 ? option.valueY : 'Y';
          var valueN = option.hasOwnProperty('valueN') && ['string', 'numeric'].indexOf(_typeof(option.valueN)) >= 0 ? option.valueN : 'N';
          if (name) {
            attributes.name = name;
          }
          if (options.required) {
            attributes.required = 'required';
          }
          if (type === 'select') {
            attributes["class"] = attributes.hasOwnProperty('class') ? 'form-select ' + attributes["class"] : 'form-select';
          } else if (type === 'switch') {
            attributes["class"] = attributes.hasOwnProperty('class') ? 'form-check-input ' + attributes["class"] : 'form-check-input';
            attributes.type = 'checkbox';
            attributes.value = valueY;
          } else {
            attributes["class"] = attributes.hasOwnProperty('class') ? 'form-control ' + attributes["class"] : 'form-control';
            attributes.type = type;
          }
          that._renderOptions.push({
            type: type,
            name: name,
            attr: attributes,
            items: items,
            valueY: valueY,
            valueN: valueN
          });
        });
      }
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
      if (!this._options.readonly) {
        this._initEvents();
      }
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {array}
     */
    getValue: function getValue() {
      if (this._options.readonly) {
        return this._value;
      } else {
        var container = $('.content-' + this._hash);
        var data = [];
        $('.coreui-form__field-dataset-list .coreui-form__field-dataset-item', container).each(function () {
          var items = {};
          $.each($(this).find('input, select').serializeArray(), function (key, item) {
            if (item.name) {
              items[item.name] = item.value;
            }
          });
          data.push(items);
        });
        return data;
      }
    },
    /**
     * Установка значения в поле
     * @param {object} value
     */
    setValue: function setValue(value) {
      if (_typeof(value) !== 'object' || Array.isArray(value) || value === null) {
        return;
      }
      this._value.push(value);
      if (this._options.readonly) {
        $('.content-' + this._hash + ' .coreui-form__field-dataset-list').append(this._renderRowReadonly(value));
      } else {
        this._eventAdd(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      container.find('.text-success').remove();
      container.find('.text-danger').remove();
      if (isValid === null) {
        return;
      }
      if (isValid) {
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="ps-2 text-success">' + text + '</div>');
        }
      } else {
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="ps-2 text-danger">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      if (this._options.required && !this._options.readonly) {
        return this.getValue().length > 0;
      }
      return true;
    },
    /**
     * Удаление всех строк
     */
    removeItems: function removeItems() {
      $('#coreui-form-' + this._id + ' .content-' + this._hash + ' .coreui-form__field-dataset-list').empty();
    },
    /**
     * Удаление строки по id
     * @param {int} itemId
     */
    removeItem: function removeItem(itemId) {
      var element = '#coreui-form-' + this._id + ' .content-' + this._hash;
      $('#' + itemId).hide('fast', function () {
        $('#' + itemId).remove();
        if ($(element + ' .coreui-form__field-dataset-item').length === 0) {
          $(element + ' .coreui-form__field-dataset-container').hide();
        }
      });
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    _renderContent: function _renderContent() {
      var options = this.getOptions();
      var rows = [];
      var headers = [];
      var that = this;
      if (options.hasOwnProperty('options') && _typeof(options.options) === 'object' && Array.isArray(options.options)) {
        // Заголовок
        $.each(options.options, function (key, option) {
          var title = option.hasOwnProperty('title') && ['string', 'numeric'].indexOf(_typeof(option.title)) >= 0 ? option.title : '';
          headers.push({
            title: title
          });
        });

        // Строки
        if (_typeof(this._value) === 'object' && Array.isArray(this._value)) {
          $.each(this._value, function (key, row) {
            if (_typeof(row) !== 'object' || Array.isArray(row)) {
              return;
            }
            rows.push(that._renderRow(row));
          });
        }
      }
      return ejs.render(tpl$1['fields/dataset.html'], {
        field: options,
        value: this._value !== null ? this._value : '',
        lang: this._form.getLang(),
        render: {
          headers: headers,
          rows: rows
        }
      });
    },
    /**
     *
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var options = this.getOptions();
      var rows = [];
      var headers = [];
      var that = this;
      if (options.hasOwnProperty('options') && _typeof(options.options) === 'object' && Array.isArray(options.options)) {
        // Заголовок
        $.each(options.options, function (key, option) {
          var title = option.hasOwnProperty('title') && ['string', 'numeric'].indexOf(_typeof(option.title)) >= 0 ? option.title : '';
          headers.push({
            title: title
          });
        });

        // Строки
        if (_typeof(this._value) === 'object' && Array.isArray(this._value)) {
          $.each(this._value, function (key, row) {
            if (_typeof(row) !== 'object' || Array.isArray(row)) {
              return;
            }
            rows.push(that._renderRowReadonly(row));
          });
        }
      }
      return ejs.render(tpl$1['fields/dataset.html'], {
        field: options,
        value: this._value !== null ? this._value : '',
        lang: this._form.getLang(),
        render: {
          headers: headers,
          rows: rows
        }
      });
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      var that = this;
      var element = '#coreui-form-' + this._id + ' .content-' + this._hash;

      // Кнопка удаления
      $(element + ' .btn-dataset-remove').click(function () {
        that.removeItem($(this).data('item-id'));
      });

      // Кнопка добавления
      $(element + ' .btn-dataset-add').click(function () {
        that._eventAdd();
      });
    },
    /**
     * Событие добавления
     */
    _eventAdd: function _eventAdd(row) {
      var that = this;
      var element = '#coreui-form-' + this._id + ' .content-' + this._hash;
      row = row || {};
      if ($(element + ' .coreui-form__field-dataset-item').length === 0) {
        $(element + ' .coreui-form__field-dataset-container').show();
      }
      $(element + ' .coreui-form__field-dataset-list').append(this._renderRow(row));
      $(element + ' .coreui-form__field-dataset-item:last-child .btn-dataset-remove').click(function () {
        that.removeItem($(this).data('item-id'));
      });
    },
    /**
     * Формирование строки
     * @param {object} row
     * @private
     */
    _renderRow: function _renderRow(row) {
      var rowOptions = [];
      var itemOptions = [];
      $.each(this._renderOptions, function (key, option) {
        var cellValue = row.hasOwnProperty(option.name) ? row[option.name] : '';
        if (option.type === 'select') {
          $.each(option.items, function (key, item) {
            var text = item.hasOwnProperty('text') && ['string', 'numeric'].indexOf(_typeof(item.text)) >= 0 ? item.text : '';
            var itemValue = item.hasOwnProperty('value') && ['string', 'numeric'].indexOf(_typeof(item.value)) >= 0 ? item.value : '';
            var itemAttr = {};
            $.each(item, function (name, value) {
              if (name !== 'text') {
                itemAttr[name] = value;
              }
            });
            if (_typeof(cellValue) === 'object' && Array.isArray(cellValue)) {
              $.each(cellValue, function (key, cellItemValue) {
                if (cellItemValue == itemValue) {
                  itemAttr.selected = 'selected';
                  return false;
                }
              });
            } else if (cellValue == item.value) {
              itemAttr.selected = 'selected';
            }
            var attributes = [];
            $.each(itemAttr, function (name, value) {
              attributes.push(name + '="' + value + '"');
            });
            itemOptions.push({
              attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
              text: text
            });
          });
        } else if (option.type === 'switch') {
          if (cellValue == option.valueY) {
            option.attr.checked = 'checked';
          }
        } else {
          if (['string', 'number'].indexOf(_typeof(cellValue)) >= 0) {
            option.attr.value = cellValue !== null ? cellValue : '';
          }
        }
        var attributes = [];
        $.each(option.attr, function (name, value) {
          attributes.push(name + '="' + value + '"');
        });
        rowOptions.push({
          type: option.type,
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          items: itemOptions
        });
      });
      return ejs.render(tpl$1['fields/dataset-row.html'], {
        hashItem: coreuiFormUtils.hashCode(),
        options: rowOptions
      });
    },
    /**
     * Формирование строки
     * @param {object} row
     * @private
     */
    _renderRowReadonly: function _renderRowReadonly(row) {
      var rowOptions = [];
      var lang = this._form.getLang();
      $.each(this._renderOptions, function (key, option) {
        var optionValue = '';
        var cellValue = row.hasOwnProperty(option.name) ? row[option.name] : '';
        if (option.type === 'select') {
          var itemOptions = [];
          $.each(option.items, function (key, item) {
            var text = item.hasOwnProperty('text') && ['string', 'numeric'].indexOf(_typeof(item.text)) >= 0 ? item.text : '';
            var itemValue = item.hasOwnProperty('value') && ['string', 'numeric'].indexOf(_typeof(item.value)) >= 0 ? item.value : '';
            if (Array.isArray(cellValue)) {
              $.each(cellValue, function (key, cellItemValue) {
                if (cellItemValue == itemValue) {
                  itemOptions.push(text);
                  return false;
                }
              });
            } else if (cellValue == itemValue) {
              itemOptions.push(text);
            }
          });
        } else if (option.type === 'switch') {
          var valueY = 'Y';
          if (option.hasOwnProperty('valueY')) {
            valueY = option.valueY;
          }
          optionValue = cellValue == valueY ? lang.switch_yes : lang.switch_no;
        } else {
          if (['string', 'number'].indexOf(_typeof(cellValue)) >= 0) {
            optionValue = cellValue;
            switch (option.type) {
              case 'date':
                optionValue = coreuiFormUtils.formatDate(optionValue);
                break;
              case 'datetime-local':
                optionValue = coreuiFormUtils.formatDateTime(optionValue);
                break;
              case 'month':
                optionValue = coreuiFormUtils.formatDateMonth(optionValue, lang);
                break;
              case 'week':
                optionValue = coreuiFormUtils.formatDateWeek(optionValue, lang);
                break;
              default:
                optionValue = cellValue;
            }
          }
        }
        rowOptions.push({
          value: optionValue
        });
      });
      return ejs.render(tpl$1['fields/dataset-row-readonly.html'], {
        options: rowOptions
      });
    }
  };

  coreuiForm.fields.group = {
    _id: '',
    _form: null,
    _index: 0,
    _options: {
      type: 'group',
      label: '',
      show: true,
      showCollapsible: true,
      fields: [],
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-group-" + index;
      this._options = $.extend(true, {}, this._options, options);
      var that = this;
      form.on('show', function () {
        that._initEvents();
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options, options);
    },
    /**
     * Скрытие группы
     * @param {int} duration
     */
    collapse: function collapse(duration) {
      var container = '#coreui-form-' + this._id;
      $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-down');
      $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-right');
      $(container + ' .coreui-form__group_content').slideUp(duration);
    },
    /**
     * Показ группы
     * @param {int} duration
     */
    expand: function expand(duration) {
      var container = '#coreui-form-' + this._id;
      $(container + ' > .coreui-form__group_label .btn-collapsible .bi').removeClass('bi-chevron-right');
      $(container + ' > .coreui-form__group_label .btn-collapsible .bi').addClass('bi-chevron-down');
      $(container + ' .coreui-form__group_content').slideDown(duration);
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var container = $(ejs.render(tpl$1['form-field-group.html'], {
        id: this._id,
        form: this._form,
        group: this._options
      }));
      var fields = this.renderContent();
      var groupContent = container.find('.coreui-form__group_content');
      $.each(fields, function (key, field) {
        groupContent.append(field);
      });
      return container;
    },
    /**
     * Формирование контента поля
     * @return {Array}
     */
    renderContent: function renderContent() {
      var fields = [];
      var that = this;
      $.each(this._options.fields, function (key, field) {
        var fieldInstance = coreuiFormPrivate.initField(that._form, field);
        if (_typeof(fieldInstance) !== 'object') {
          return;
        }
        fields.push(fieldInstance.render());
      });
      return fields;
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      if (this._options.showCollapsible) {
        var that = this;
        var container = '#coreui-form-' + this._id;
        $(container + ' > .coreui-form__group_label .btn-collapsible').click(function () {
          if ($(container + ' > .coreui-form__group_content').is(':visible')) {
            that.collapse(80);
          } else {
            that.expand(80);
          }
        });
      }
    }
  };

  coreuiForm.fields.hidden = {
    _id: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'hidden',
      name: null,
      attr: {},
      required: null,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('#coreui-form-' + this._id).val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (!this._options.readonly) {
        $('#coreui-form-' + this._id).val(value);
      }
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      return ejs.render(tpl$1['form-field-content.html'], {
        content: this.renderContent()
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var attributes = [];
      var options = this.getOptions();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      options.attr.id = 'coreui-form-' + this._id;
      if (options.name) {
        options.attr.name = options.name;
      }
      options.attr.type = 'hidden';
      options.attr.value = this._value !== null ? this._value : '';
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/hidden.html'], {
        value: this._value !== null ? this._value : '',
        field: options,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
        }
      });
    }
  };

  coreuiForm.fields.input = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'text',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-control d-inline-block'
      },
      required: null,
      invalidText: null,
      validText: null,
      readonly: null,
      datalist: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        $('.content-' + this._hash + ' input').val(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var input = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
      } else if (isValid) {
        input.removeClass('is-invalid');
        input.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        input.removeClass('is-valid');
        input.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function isValid() {
      var input = $('.content-' + this._hash + ' input');
      if (input[0]) {
        return input.is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     *
     * @private
     */
    _renderContent: function _renderContent() {
      var attributes = [];
      var datalist = [];
      var options = this.getOptions();
      var datalistId = coreuiFormUtils.hashCode();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      options.attr.type = options.type;
      options.attr.value = this._value !== null ? this._value : '';
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      if (options.hasOwnProperty('datalist') && _typeof(options.datalist) === 'object' && Array.isArray(options.datalist)) {
        options.attr.list = datalistId;
        $.each(options.datalist, function (key, itemAttributes) {
          var datalistAttr = [];
          $.each(itemAttributes, function (name, value) {
            datalistAttr.push(name + '="' + value + '"');
          });
          datalist.push({
            attr: datalistAttr.length > 0 ? ' ' + datalistAttr.join(' ') : ''
          });
        });
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        datalistId: datalistId,
        value: this._value !== null ? this._value : '',
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          datalist: datalist
        }
      });
    },
    /**
     *
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var options = this.getOptions();
      var type = 'text';
      var value = this._value;
      var lang = this._form.getLang();
      if (options.hasOwnProperty('type') && typeof options.type === 'string') {
        type = options.type;
      }
      try {
        switch (type) {
          case 'date':
            value = coreuiFormUtils.formatDate(value);
            break;
          case 'datetime-local':
            value = coreuiFormUtils.formatDateTime(value);
            break;
          case 'month':
            value = coreuiFormUtils.formatDateMonth(value, lang);
            break;
          case 'week':
            value = coreuiFormUtils.formatDateWeek(value, lang);
            break;
        }
      } catch (e) {
        console.error(e);
        // ignore
      }

      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        value: value,
        hash: this._hash
      });
    }
  };

  /**
   * jquery.mask.js
   * @version: v1.14.16
   * @author: Igor Escobar
   *
   * Created by Igor Escobar on 2012-03-10. Please report any bug at github.com/igorescobar/jQuery-Mask-Plugin
   *
   * Copyright (c) 2012 Igor Escobar http://igorescobar.com
   *
   * The MIT License (http://www.opensource.org/licenses/mit-license.php)
   *
   * Permission is hereby granted, free of charge, to any person
   * obtaining a copy of this software and associated documentation
   * files (the "Software"), to deal in the Software without
   * restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the
   * Software is furnished to do so, subject to the following
   * conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
   * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
   * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
   * OTHER DEALINGS IN THE SOFTWARE.
   */

  /* jshint laxbreak: true */
  /* jshint maxcomplexity:17 */
  /* global define */

  // UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
  // https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
  (function (factory, jQuery, Zepto) {
    if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
    } else if (typeof exports === 'object' && typeof Meteor === 'undefined') {
      module.exports = factory(require('jquery'));
    } else {
      factory(jQuery || Zepto);
    }
  })(function ($) {

    var Mask = function (el, mask, options) {
      var p = {
        invalid: [],
        getCaret: function () {
          try {
            var sel,
              pos = 0,
              ctrl = el.get(0),
              dSel = document.selection,
              cSelStart = ctrl.selectionStart;

            // IE Support
            if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
              sel = dSel.createRange();
              sel.moveStart('character', -p.val().length);
              pos = sel.text.length;
            }
            // Firefox support
            else if (cSelStart || cSelStart === '0') {
              pos = cSelStart;
            }
            return pos;
          } catch (e) {}
        },
        setCaret: function (pos) {
          try {
            if (el.is(':focus')) {
              var range,
                ctrl = el.get(0);

              // Firefox, WebKit, etc..
              if (ctrl.setSelectionRange) {
                ctrl.setSelectionRange(pos, pos);
              } else {
                // IE
                range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
              }
            }
          } catch (e) {}
        },
        events: function () {
          el.on('keydown.mask', function (e) {
            el.data('mask-keycode', e.keyCode || e.which);
            el.data('mask-previus-value', el.val());
            el.data('mask-previus-caret-pos', p.getCaret());
            p.maskDigitPosMapOld = p.maskDigitPosMap;
          }).on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour).on('paste.mask drop.mask', function () {
            setTimeout(function () {
              el.keydown().keyup();
            }, 100);
          }).on('change.mask', function () {
            el.data('changed', true);
          }).on('blur.mask', function () {
            if (oldValue !== p.val() && !el.data('changed')) {
              el.trigger('change');
            }
            el.data('changed', false);
          })
          // it's very important that this callback remains in this position
          // otherwhise oldValue it's going to work buggy
          .on('blur.mask', function () {
            oldValue = p.val();
          })
          // select all text on focus
          .on('focus.mask', function (e) {
            if (options.selectOnFocus === true) {
              $(e.target).select();
            }
          })
          // clear the value if it not complete the mask
          .on('focusout.mask', function () {
            if (options.clearIfNotMatch && !regexMask.test(p.val())) {
              p.val('');
            }
          });
        },
        getRegexMask: function () {
          var maskChunks = [],
            translation,
            pattern,
            optional,
            recursive,
            oRecursive,
            r;
          for (var i = 0; i < mask.length; i++) {
            translation = jMask.translation[mask.charAt(i)];
            if (translation) {
              pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
              optional = translation.optional;
              recursive = translation.recursive;
              if (recursive) {
                maskChunks.push(mask.charAt(i));
                oRecursive = {
                  digit: mask.charAt(i),
                  pattern: pattern
                };
              } else {
                maskChunks.push(!optional && !recursive ? pattern : pattern + '?');
              }
            } else {
              maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
            }
          }
          r = maskChunks.join('');
          if (oRecursive) {
            r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?').replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
          }
          return new RegExp(r);
        },
        destroyEvents: function () {
          el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
        },
        val: function (v) {
          var isInput = el.is('input'),
            method = isInput ? 'val' : 'text',
            r;
          if (arguments.length > 0) {
            if (el[method]() !== v) {
              el[method](v);
            }
            r = el;
          } else {
            r = el[method]();
          }
          return r;
        },
        calculateCaretPosition: function (oldVal) {
          var newVal = p.getMasked(),
            caretPosNew = p.getCaret();
          if (oldVal !== newVal) {
            var caretPosOld = el.data('mask-previus-caret-pos') || 0,
              newValL = newVal.length,
              oldValL = oldVal.length,
              maskDigitsBeforeCaret = 0,
              maskDigitsAfterCaret = 0,
              maskDigitsBeforeCaretAll = 0,
              maskDigitsBeforeCaretAllOld = 0,
              i = 0;
            for (i = caretPosNew; i < newValL; i++) {
              if (!p.maskDigitPosMap[i]) {
                break;
              }
              maskDigitsAfterCaret++;
            }
            for (i = caretPosNew - 1; i >= 0; i--) {
              if (!p.maskDigitPosMap[i]) {
                break;
              }
              maskDigitsBeforeCaret++;
            }
            for (i = caretPosNew - 1; i >= 0; i--) {
              if (p.maskDigitPosMap[i]) {
                maskDigitsBeforeCaretAll++;
              }
            }
            for (i = caretPosOld - 1; i >= 0; i--) {
              if (p.maskDigitPosMapOld[i]) {
                maskDigitsBeforeCaretAllOld++;
              }
            }

            // if the cursor is at the end keep it there
            if (caretPosNew > oldValL) {
              caretPosNew = newValL * 10;
            } else if (caretPosOld >= caretPosNew && caretPosOld !== oldValL) {
              if (!p.maskDigitPosMapOld[caretPosNew]) {
                var caretPos = caretPosNew;
                caretPosNew -= maskDigitsBeforeCaretAllOld - maskDigitsBeforeCaretAll;
                caretPosNew -= maskDigitsBeforeCaret;
                if (p.maskDigitPosMap[caretPosNew]) {
                  caretPosNew = caretPos;
                }
              }
            } else if (caretPosNew > caretPosOld) {
              caretPosNew += maskDigitsBeforeCaretAll - maskDigitsBeforeCaretAllOld;
              caretPosNew += maskDigitsAfterCaret;
            }
          }
          return caretPosNew;
        },
        behaviour: function (e) {
          e = e || window.event;
          p.invalid = [];
          var keyCode = el.data('mask-keycode');
          if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
            var newVal = p.getMasked(),
              caretPos = p.getCaret(),
              oldVal = el.data('mask-previus-value') || '';

            // this is a compensation to devices/browsers that don't compensate
            // caret positioning the right way
            setTimeout(function () {
              p.setCaret(p.calculateCaretPosition(oldVal));
            }, $.jMaskGlobals.keyStrokeCompensation);
            p.val(newVal);
            p.setCaret(caretPos);
            return p.callbacks(e);
          }
        },
        getMasked: function (skipMaskChars, val) {
          var buf = [],
            value = val === undefined ? p.val() : val + '',
            m = 0,
            maskLen = mask.length,
            v = 0,
            valLen = value.length,
            offset = 1,
            addMethod = 'push',
            resetPos = -1,
            maskDigitCount = 0,
            maskDigitPosArr = [],
            lastMaskChar,
            check;
          if (options.reverse) {
            addMethod = 'unshift';
            offset = -1;
            lastMaskChar = 0;
            m = maskLen - 1;
            v = valLen - 1;
            check = function () {
              return m > -1 && v > -1;
            };
          } else {
            lastMaskChar = maskLen - 1;
            check = function () {
              return m < maskLen && v < valLen;
            };
          }
          var lastUntranslatedMaskChar;
          while (check()) {
            var maskDigit = mask.charAt(m),
              valDigit = value.charAt(v),
              translation = jMask.translation[maskDigit];
            if (translation) {
              if (valDigit.match(translation.pattern)) {
                buf[addMethod](valDigit);
                if (translation.recursive) {
                  if (resetPos === -1) {
                    resetPos = m;
                  } else if (m === lastMaskChar && m !== resetPos) {
                    m = resetPos - offset;
                  }
                  if (lastMaskChar === resetPos) {
                    m -= offset;
                  }
                }
                m += offset;
              } else if (valDigit === lastUntranslatedMaskChar) {
                // matched the last untranslated (raw) mask character that we encountered
                // likely an insert offset the mask character from the last entry; fall
                // through and only increment v
                maskDigitCount--;
                lastUntranslatedMaskChar = undefined;
              } else if (translation.optional) {
                m += offset;
                v -= offset;
              } else if (translation.fallback) {
                buf[addMethod](translation.fallback);
                m += offset;
                v -= offset;
              } else {
                p.invalid.push({
                  p: v,
                  v: valDigit,
                  e: translation.pattern
                });
              }
              v += offset;
            } else {
              if (!skipMaskChars) {
                buf[addMethod](maskDigit);
              }
              if (valDigit === maskDigit) {
                maskDigitPosArr.push(v);
                v += offset;
              } else {
                lastUntranslatedMaskChar = maskDigit;
                maskDigitPosArr.push(v + maskDigitCount);
                maskDigitCount++;
              }
              m += offset;
            }
          }
          var lastMaskCharDigit = mask.charAt(lastMaskChar);
          if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
            buf.push(lastMaskCharDigit);
          }
          var newVal = buf.join('');
          p.mapMaskdigitPositions(newVal, maskDigitPosArr, valLen);
          return newVal;
        },
        mapMaskdigitPositions: function (newVal, maskDigitPosArr, valLen) {
          var maskDiff = options.reverse ? newVal.length - valLen : 0;
          p.maskDigitPosMap = {};
          for (var i = 0; i < maskDigitPosArr.length; i++) {
            p.maskDigitPosMap[maskDigitPosArr[i] + maskDiff] = 1;
          }
        },
        callbacks: function (e) {
          var val = p.val(),
            changed = val !== oldValue,
            defaultArgs = [val, e, el, options],
            callback = function (name, criteria, args) {
              if (typeof options[name] === 'function' && criteria) {
                options[name].apply(this, args);
              }
            };
          callback('onChange', changed === true, defaultArgs);
          callback('onKeyPress', changed === true, defaultArgs);
          callback('onComplete', val.length === mask.length, defaultArgs);
          callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
        }
      };
      el = $(el);
      var jMask = this,
        oldValue = p.val(),
        regexMask;
      mask = typeof mask === 'function' ? mask(p.val(), undefined, el, options) : mask;

      // public methods
      jMask.mask = mask;
      jMask.options = options;
      jMask.remove = function () {
        var caret = p.getCaret();
        if (jMask.options.placeholder) {
          el.removeAttr('placeholder');
        }
        if (el.data('mask-maxlength')) {
          el.removeAttr('maxlength');
        }
        p.destroyEvents();
        p.val(jMask.getCleanVal());
        p.setCaret(caret);
        return el;
      };

      // get value without mask
      jMask.getCleanVal = function () {
        return p.getMasked(true);
      };

      // get masked value without the value being in the input or element
      jMask.getMaskedVal = function (val) {
        return p.getMasked(false, val);
      };
      jMask.init = function (onlyMask) {
        onlyMask = onlyMask || false;
        options = options || {};
        jMask.clearIfNotMatch = $.jMaskGlobals.clearIfNotMatch;
        jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
        jMask.translation = $.extend({}, $.jMaskGlobals.translation, options.translation);
        jMask = $.extend(true, {}, jMask, options);
        regexMask = p.getRegexMask();
        if (onlyMask) {
          p.events();
          p.val(p.getMasked());
        } else {
          if (options.placeholder) {
            el.attr('placeholder', options.placeholder);
          }

          // this is necessary, otherwise if the user submit the form
          // and then press the "back" button, the autocomplete will erase
          // the data. Works fine on IE9+, FF, Opera, Safari.
          if (el.data('mask')) {
            el.attr('autocomplete', 'off');
          }

          // detect if is necessary let the user type freely.
          // for is a lot faster than forEach.
          for (var i = 0, maxlength = true; i < mask.length; i++) {
            var translation = jMask.translation[mask.charAt(i)];
            if (translation && translation.recursive) {
              maxlength = false;
              break;
            }
          }
          if (maxlength) {
            el.attr('maxlength', mask.length).data('mask-maxlength', true);
          }
          p.destroyEvents();
          p.events();
          var caret = p.getCaret();
          p.val(p.getMasked());
          p.setCaret(caret);
        }
      };
      jMask.init(!el.is('input'));
    };
    $.maskWatchers = {};
    var HTMLAttributes = function () {
        var input = $(this),
          options = {},
          prefix = 'data-mask-',
          mask = input.attr('data-mask');
        if (input.attr(prefix + 'reverse')) {
          options.reverse = true;
        }
        if (input.attr(prefix + 'clearifnotmatch')) {
          options.clearIfNotMatch = true;
        }
        if (input.attr(prefix + 'selectonfocus') === 'true') {
          options.selectOnFocus = true;
        }
        if (notSameMaskObject(input, mask, options)) {
          return input.data('mask', new Mask(this, mask, options));
        }
      },
      notSameMaskObject = function (field, mask, options) {
        options = options || {};
        var maskObject = $(field).data('mask'),
          stringify = JSON.stringify,
          value = $(field).val() || $(field).text();
        try {
          if (typeof mask === 'function') {
            mask = mask(value);
          }
          return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
        } catch (e) {}
      },
      eventSupported = function (eventName) {
        var el = document.createElement('div'),
          isSupported;
        eventName = 'on' + eventName;
        isSupported = eventName in el;
        if (!isSupported) {
          el.setAttribute(eventName, 'return;');
          isSupported = typeof el[eventName] === 'function';
        }
        el = null;
        return isSupported;
      };
    $.fn.mask = function (mask, options) {
      options = options || {};
      var selector = this.selector,
        globals = $.jMaskGlobals,
        interval = globals.watchInterval,
        watchInputs = options.watchInputs || globals.watchInputs,
        maskFunction = function () {
          if (notSameMaskObject(this, mask, options)) {
            return $(this).data('mask', new Mask(this, mask, options));
          }
        };
      $(this).each(maskFunction);
      if (selector && selector !== '' && watchInputs) {
        clearInterval($.maskWatchers[selector]);
        $.maskWatchers[selector] = setInterval(function () {
          $(document).find(selector).each(maskFunction);
        }, interval);
      }
      return this;
    };
    $.fn.masked = function (val) {
      return this.data('mask').getMaskedVal(val);
    };
    $.fn.unmask = function () {
      clearInterval($.maskWatchers[this.selector]);
      delete $.maskWatchers[this.selector];
      return this.each(function () {
        var dataMask = $(this).data('mask');
        if (dataMask) {
          dataMask.remove().removeData('mask');
        }
      });
    };
    $.fn.cleanVal = function () {
      return this.data('mask').getCleanVal();
    };
    $.applyDataMask = function (selector) {
      selector = selector || $.jMaskGlobals.maskElements;
      var $selector = selector instanceof $ ? selector : $(selector);
      $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };
    var globals = {
      maskElements: 'input,td,span,div',
      dataMaskAttr: '*[data-mask]',
      dataMask: true,
      watchInterval: 300,
      watchInputs: true,
      keyStrokeCompensation: 10,
      // old versions of chrome dont work great with input event
      useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
      watchDataMask: false,
      byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
      translation: {
        '0': {
          pattern: /\d/
        },
        '9': {
          pattern: /\d/,
          optional: true
        },
        '#': {
          pattern: /\d/,
          recursive: true
        },
        'A': {
          pattern: /[a-zA-Z0-9]/
        },
        'S': {
          pattern: /[a-zA-Z]/
        }
      }
    };
    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) {
      $.applyDataMask();
    }
    setInterval(function () {
      if ($.jMaskGlobals.watchDataMask) {
        $.applyDataMask();
      }
    }, globals.watchInterval);
  }, window.jQuery, window.Zepto);

  coreuiForm.fields.mask = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'mask',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-control d-inline-block'
      },
      required: null,
      readonly: null,
      datalist: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
      this._hash = coreuiFormUtils.hashCode();
      var that = this;
      form.on('show', function () {
        if (!that._options.readonly) {
          that._initEvents();
        }
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
      if (!this._options.readonly) {
        this._initEvents();
      }
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      value = value.replace(/[^\d\w]/g, '');
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        $('.content-' + this._hash + ' input').val(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var input = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
      } else if (isValid) {
        input.removeClass('is-invalid');
        input.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        input.removeClass('is-valid');
        input.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      var input = $('.content-' + this._hash + ' input');
      if (input[0]) {
        return input.is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     *
     * @return {*}
     * @private
     */
    _renderContent: function _renderContent() {
      var attributes = [];
      var datalist = [];
      var options = this.getOptions();
      var datalistId = coreuiFormUtils.hashCode();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      options.attr.type = 'text';
      options.attr.value = this._value !== null ? this._value : '';
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      if (options.hasOwnProperty('datalist') && _typeof(options.datalist) === 'object' && Array.isArray(options.datalist)) {
        options.attr.list = datalistId;
        $.each(options.datalist, function (key, itemAttributes) {
          var datalistAttr = [];
          $.each(itemAttributes, function (name, value) {
            datalistAttr.push(name + '="' + value + '"');
          });
          datalist.push({
            attr: datalistAttr.length > 0 ? ' ' + datalistAttr.join(' ') : ''
          });
        });
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        datalistId: datalistId,
        value: this._value !== null ? this._value : '',
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          datalist: datalist
        }
      });
    },
    /**
     *
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var options = this.getOptions();
      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        value: this._value !== null ? this._value : ''
      });
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      $('#coreui-form-' + this._id + ' .content-' + this._hash + ' input').mask(this._options.mask, this._options.options);
    }
  };

  coreuiForm.fields.modal = {
    _id: '',
    _hash: '',
    _form: null,
    _value: '',
    _text: '',
    _options: {
      type: 'modal',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      fields: [],
      options: {
        title: '',
        size: 'lg',
        url: '',
        onHidden: null,
        onClear: null,
        onChange: null
      },
      required: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      var formRecord = form.getRecord();
      this._form = form;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
      this._hash = coreuiFormUtils.hashCode();
      if (typeof options.name === 'string' && formRecord.hasOwnProperty(options.name) && ['object'].indexOf(_typeof(formRecord[options.name])) >= 0) {
        var record = formRecord[options.name];
        this._value = record.hasOwnProperty('value') && ['number', 'string'].indexOf(_typeof(record.value)) >= 0 ? record.value : '';
        this._text = record.hasOwnProperty('text') && ['number', 'string'].indexOf(_typeof(record.text)) >= 0 ? record.text : '';
      }
      var that = this;
      form.on('show', function () {
        that._initEvents();
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
      if (!this._options.readonly) {
        this._initEvents();
      }
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input.coreui-form-modal-value').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     * @param {string} text
     */
    setValue: function setValue(value, text) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(text);
      } else {
        var elementValue = $('.content-' + this._hash + ' .coreui-form-modal-value');
        var elementText = $('.content-' + this._hash + ' .coreui-form-modal-text');
        var oldValue = elementValue.val();
        elementValue.val(value);
        elementText.val(text);
        if (oldValue != value) {
          var modal = this._options.hasOwnProperty('options') && _typeof(this._options.options) === 'object' ? this._options.options : {};
          if (modal.hasOwnProperty('onChange')) {
            if (typeof modal.onChange === 'function') {
              modal.onChange(this);
            } else if (typeof modal.onChange === 'string') {
              new Function('modal', modal.onChange)(this);
            }
          }
          coreuiFormPrivate.trigger(this._form, 'change-modal.coreui.form', [this], this);
        }
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      container.find('.text-success').remove();
      container.find('.text-danger').remove();
      if (isValid === null) {
        return;
      }
      if (isValid) {
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="ps-2 text-success">' + text + '</div>');
        }
      } else {
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="ps-2 text-danger">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      if (this._options.required && !this._options.readonly) {
        return !!this.getValue();
      }
      return true;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var fieldOptions = this.getOptions();
      var attributes = [];
      var textAttr = {
        type: 'text',
        readonly: 'readonly',
        "class": 'form-control coreui-form-modal-text',
        value: this._text !== null ? this._text : ''
      };
      if (fieldOptions.required) {
        textAttr.required = 'required';
      }
      if (fieldOptions.hasOwnProperty('attr') && _typeof(fieldOptions.attr) === 'object' && Array.isArray(fieldOptions.attr)) {
        textAttr = coreuiFormUtils.mergeAttr(textAttr, fieldOptions.attr);
      }
      $.each(textAttr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/modal.html'], {
        field: fieldOptions,
        value: this._value !== null ? this._value : '',
        text: this._text !== null ? this._text : '',
        lang: this._form.getLang(),
        render: {
          width: this._options.width,
          attr: attributes.length > 0 ? attributes.join(' ') : ''
        }
      });
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      var that = this;
      var modal = this._options.hasOwnProperty('options') && _typeof(this._options.options) === 'object' ? this._options.options : {};

      // Очистка
      $('.content-' + this._hash + ' .btn-modal-clear').click(function (e) {
        if (modal.hasOwnProperty('onClear')) {
          if (typeof modal.onClear === 'function') {
            modal.onClear(that);
          } else if (typeof modal.onClear === 'string') {
            new Function('field', modal.onClear)(that);
          }
        }
        coreuiFormPrivate.trigger(that._form, 'modal_clear', [that, e], that);
        that.setValue('', '');
      });

      // Выбор
      $('.content-' + this._hash + ' .btn-modal-select').click(function (e) {
        var title = modal.hasOwnProperty('title') && typeof modal.title === 'string' ? modal.title : '';
        var size = modal.hasOwnProperty('size') && typeof modal.size === 'string' ? modal.size : 'lg';
        var url = modal.hasOwnProperty('url') && typeof modal.url === 'string' ? modal.url : '';
        if (!url) {
          return;
        }
        var modalId = coreuiFormUtils.hashCode();
        var modalLoading = ejs.render(tpl$1['fields/modal-loading.html'], {
          lang: that._form.getLang()
        });
        if (CoreUI.hasOwnProperty('modal')) {
          var onShow = null;
          var onHidden = null;
          if (modal.hasOwnProperty('onHidden')) {
            if (typeof modal.onHidden === 'function') {
              onHidden = modal.onHidden;
            } else if (typeof modal.onHidden === 'string') {
              onHidden = new Function(modal.onHidden);
            }
          }
          if (modal.hasOwnProperty('onShow')) {
            if (typeof modal.onShow === 'function') {
              onShow = modal.onShow;
            } else if (typeof modal.onShow === 'string') {
              onShow = new Function(modal.onShow);
            }
          }
          CoreUI.modal.show(title, modalLoading, {
            id: modalId,
            size: size,
            onShow: onShow,
            onHidden: onHidden
          });
        }
        $.ajax({
          url: url,
          method: 'GET',
          beforeSend: function beforeSend(xhr) {
            coreuiFormPrivate.trigger(that._form, 'modal_load_before', [that, xhr], that);
          },
          success: function success(result) {
            $('#modal-' + modalId + ' .modal-body').html(result);
            coreuiFormPrivate.trigger(that._form, 'modal_load_success', [that, result], that);
          },
          error: function error(xhr, textStatus, errorThrown) {
            coreuiFormPrivate.trigger(that._form, 'modal_load_error', [that, xhr, textStatus, errorThrown], that);
          },
          complete: function complete(xhr, textStatus) {
            coreuiFormPrivate.trigger(that._form, 'modal_load_complete', [that, xhr, textStatus], that);
          }
        });
        coreuiFormPrivate.trigger(that._form, 'modal_select', [that, e], that);
      });
    }
  };

  coreuiForm.fields.number = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'number',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-control d-inline-block',
        step: 'any'
      },
      required: null,
      readonly: null,
      datalist: null,
      show: true,
      column: null,
      precision: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);

      // Установка точности
      if (this._options.precision === null) {
        var precision = 0;
        if (this._options.attr.hasOwnProperty('step') && this._options.attr.step !== 'any' && ['string', 'number'].indexOf(_typeof(this._options.attr.step)) >= 0) {
          var match = $.trim(this._options.attr.step.toString()).match(/\.(\d+)$/);
          if (match && match.hasOwnProperty(1)) {
            precision = match ? match[1].length : precision;
          }
        }
        this._options.precision = precision;
      }
      var that = this;
      form.on('show', function () {
        if (!that._options.readonly) {
          that._initEvents();
        }
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
      if (!this._options.readonly) {
        this._initEvents();
      }
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0 || !value.toString().match(/^\-?\d+\.?\d*$/)) {
        return;
      }
      if (this._options.precision >= 0) {
        value = coreuiFormUtils.round(value, this._options.precision);
      }
      if (this._options.attr.hasOwnProperty('min')) {
        value = value < Number(this._options.attr.min) ? Number(this._options.attr.min) : value;
      }
      if (this._options.attr.hasOwnProperty('max')) {
        value = value > Number(this._options.attr.max) ? Number(this._options.attr.max) : value;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        $('.content-' + this._hash + ' input').val(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var input = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
      } else if (isValid) {
        input.removeClass('is-invalid');
        input.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        input.removeClass('is-valid');
        input.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      var input = $('.content-' + this._hash + ' input');
      if (input[0]) {
        return input.is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = $.extend(true, {}, this._options);
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var attributes = [];
      var datalist = [];
      var options = this.getOptions();
      var datalistId = coreuiFormUtils.hashCode();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      options.attr.type = 'number';
      options.attr.value = this._value !== null ? this._value : '';
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      if (options.hasOwnProperty('datalist') && _typeof(options.datalist) === 'object' && Array.isArray(options.datalist)) {
        options.attr.list = datalistId;
        $.each(options.datalist, function (key, itemAttributes) {
          var datalistAttr = [];
          $.each(itemAttributes, function (name, value) {
            datalistAttr.push(name + '="' + value + '"');
          });
          datalist.push({
            attr: datalistAttr.length > 0 ? ' ' + datalistAttr.join(' ') : ''
          });
        });
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        datalistId: datalistId,
        value: this._value !== null ? this._value : '',
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          datalist: datalist
        }
      });
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      $('.content-' + this._hash + ' input').keydown(function (e) {
        var k = e.keyCode || e.which;
        var ok = k >= 35 && k <= 40 ||
        // arrows
        k >= 96 && k <= 105 ||
        // 0-9 numpad
        k === 189 || k === 109 ||
        // minus
        k === 110 || k === 190 ||
        // dot
        k === 9 ||
        //tab
        k === 46 ||
        //del
        k === 8 ||
        // backspaces
        !e.shiftKey && k >= 48 && k <= 57; // only 0-9 (ignore SHIFT options)

        if (!ok || e.ctrlKey && e.altKey) {
          e.preventDefault();
        }
      });
      var that = this;
      $('.content-' + this._hash + ' input').blur(function (e) {
        var value = $(this).val();
        if (that._options.precision >= 0) {
          value = coreuiFormUtils.round(value, that._options.precision);
        }
        if (that._options.attr.hasOwnProperty('min')) {
          value = value < Number(that._options.attr.min) ? Number(that._options.attr.min) : value;
        }
        if (that._options.attr.hasOwnProperty('max')) {
          value = value > Number(that._options.attr.max) ? Number(that._options.attr.max) : value;
        }
        $(this).val(value);
      });
    }
  };

  coreuiForm.fields.radio = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'radio',
      name: null,
      label: null,
      labelWidth: null,
      inline: false,
      outContent: null,
      description: null,
      errorText: null,
      options: [],
      fields: [],
      required: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input[type=radio]:checked').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      if (this._options.readonly) {
        var that = this;
        var fieldOptions = this.getOptions();
        if (fieldOptions.hasOwnProperty('options') && _typeof(fieldOptions.options) === 'object' && Array.isArray(fieldOptions.options)) {
          $.each(fieldOptions.options, function (key, option) {
            if (option.hasOwnProperty('value') && option.value == value) {
              var text = option.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(option.text)) >= 0 ? option.text : '';
              $('.content-' + that._hash).text(text);
              that._value = value;
              return false;
            }
          });
        }
      } else {
        var input = $('.content-' + this._hash + ' input[type=radio][value="' + value + '"]');
        if (input[0]) {
          input.prop('checked', true);
          this._value = value;
        }
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var lastInput = $('.form-check:last-child', container);
      var inputs = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        inputs.removeClass('is-invalid');
        inputs.removeClass('is-valid');
      } else if (isValid) {
        inputs.removeClass('is-invalid');
        inputs.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          lastInput.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        inputs.removeClass('is-valid');
        inputs.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          lastInput.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      if (this._options.required && !this._options.readonly) {
        var value = this.getValue();
        return typeof value === 'string' && value !== '';
      }
      return true;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: this._options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var that = this;
      var radioOptions = [];
      var fieldOptions = this.getOptions();
      var selectedItem = [];
      if (fieldOptions.hasOwnProperty('options') && _typeof(fieldOptions.options) === 'object' && Array.isArray(fieldOptions.options)) {
        $.each(fieldOptions.options, function (key, option) {
          var attributes = [];
          var itemAttr = {
            type: 'radio',
            "class": 'form-check-input'
          };
          var optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(option.text)) >= 0 ? option.text : '';
          if (fieldOptions.name) {
            itemAttr.name = that._options.name;
          }
          if (fieldOptions.required) {
            itemAttr.required = 'required';
          }
          $.each(option, function (name, value) {
            if (name !== 'text') {
              if (name === 'class') {
                itemAttr[name] = itemAttr[name] + ' ' + value;
              } else {
                itemAttr[name] = value;
              }
            }
          });
          itemAttr.id = coreuiFormUtils.hashCode();
          if (that._value == option.value) {
            if (option.hasOwnProperty('text') && option.text) {
              selectedItem.push(option.text);
            }
            itemAttr.checked = 'checked';
          }
          $.each(itemAttr, function (name, value) {
            attributes.push(name + '="' + value + '"');
          });
          radioOptions.push({
            id: itemAttr.id,
            text: optionText,
            attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
          });
        });
      }
      return ejs.render(tpl$1['fields/radio.html'], {
        field: fieldOptions,
        value: this._value,
        render: {
          options: radioOptions,
          selectedItem: selectedItem
        }
      });
    }
  };

  coreuiForm.fields.range = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'range',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-range d-inline-block pt-1'
      },
      required: null,
      readonly: null,
      datalist: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        $('.content-' + this._hash + ' input').val(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var input = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
      } else if (isValid) {
        input.removeClass('is-invalid');
        input.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        input.removeClass('is-valid');
        input.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      var input = $('.content-' + this._hash + ' input');
      if (input[0]) {
        return input.is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var attributes = [];
      var datalist = [];
      var options = this.getOptions();
      var datalistId = coreuiFormUtils.hashCode();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      options.attr.type = 'range';
      options.attr.value = this._value;
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      if (options.hasOwnProperty('datalist') && _typeof(options.datalist) === 'object' && Array.isArray(options.datalist)) {
        options.attr.list = datalistId;
        $.each(options.datalist, function (key, itemAttributes) {
          var datalistAttr = [];
          $.each(itemAttributes, function (name, value) {
            datalistAttr.push(name + '="' + value + '"');
          });
          datalist.push({
            attr: datalistAttr.length > 0 ? ' ' + datalistAttr.join(' ') : ''
          });
        });
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        datalistId: datalistId,
        value: this._value,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          datalist: datalist
        }
      });
    }
  };

  coreuiForm.fields.select = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: [],
    _options: {
      type: 'select',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-select d-inline-block'
      },
      required: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения из поля
     * @returns {array|string}
     */
    getValue: function getValue() {
      if (this._options.readonly) {
        return this._value;
      } else {
        if (this._options.hasOwnProperty('attr') && _typeof(this._options.attr) === 'object' && this._options.attr !== null && !Array.isArray(this._options.attr) && this._options.attr.hasOwnProperty('multiple')) {
          var values = [];
          $('.content-' + this._hash + ' select option:selected').each(function () {
            values.push($(this).val());
          });
          return values;
        } else {
          return $('.content-' + this._hash + ' select option:selected').val();
        }
      }
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number', 'object'].indexOf(_typeof(value)) < 0) {
        return;
      }
      if (_typeof(value) === 'object') {
        if (value !== null && !Array.isArray(value)) {
          return;
        }
      } else {
        value = [value];
      }
      var that = this;
      this._value = [];
      if (this._options.readonly) {
        $('.content-' + that._hash).empty();
        var fieldOptions = this.getOptions();
        if (fieldOptions.hasOwnProperty('options') && _typeof(fieldOptions.options) === 'object' && Array.isArray(fieldOptions.options) && Array.isArray(value)) {
          var selectedItems = [];
          $.each(fieldOptions.options, function (key, option) {
            if (option.hasOwnProperty('value')) {
              $.each(value, function (key, val) {
                if (option.value == val) {
                  if (option.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(option.text)) >= 0) {
                    selectedItems.push(option.text);
                  }
                  that._value.push(val);
                  return false;
                }
              });
            }
          });
          $('.content-' + that._hash).text(selectedItems.join(', '));
        }
      } else {
        $('.content-' + this._hash + ' select > option').prop('selected', false);
        if (Array.isArray(value)) {
          $('.content-' + this._hash + ' select > option').each(function (key, itemValue) {
            $.each(value, function (key, val) {
              if (val == $(itemValue).val()) {
                $(itemValue).prop('selected', true);
                that._value.push(val);
                return false;
              }
            });
          });
        }
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var select = $('select', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        select.removeClass('is-invalid');
        select.removeClass('is-valid');
      } else if (isValid) {
        select.removeClass('is-invalid');
        select.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        select.removeClass('is-valid');
        select.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function isValid() {
      var select = $('.content-' + this._hash + ' select');
      if (this._options.required && select.val() === '') {
        return false;
      }
      if (select[0]) {
        return select.is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     * Формирование контента
     * @return {*}
     * @private
     */
    _renderContent: function _renderContent() {
      var that = this;
      var options = this.getOptions();
      var attributes = [];
      var selectOptions = [];
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      if (options.hasOwnProperty('options') && _typeof(options.options) === 'object' && options.options !== null) {
        $.each(options.options, function (key, option) {
          if (typeof option === 'string' || typeof option === 'number') {
            selectOptions.push(that._renderOption({
              type: 'option',
              value: key,
              text: option
            }));
          } else if (_typeof(option) === 'object') {
            var type = option.hasOwnProperty('type') && typeof option.type === 'string' ? option.type : 'option';
            if (type === 'group') {
              var renderAttr = [];
              var groupAttr = {};
              var groupOptions = [];
              if (option.hasOwnProperty('attr') && _typeof(option.attr) === 'object' && option.attr !== null && !Array.isArray(option.attr)) {
                groupAttr = option.attr;
              }
              if (option.hasOwnProperty('label') && ['string', 'number'].indexOf(_typeof(option.label)) >= 0) {
                groupAttr.label = option.label;
              }
              $.each(groupAttr, function (name, value) {
                renderAttr.push(name + '="' + value + '"');
              });
              if (Array.isArray(option.options)) {
                $.each(option.options, function (key, groupOption) {
                  groupOptions.push(that._renderOption(groupOption));
                });
              }
              selectOptions.push({
                type: 'group',
                attr: renderAttr.length > 0 ? ' ' + renderAttr.join(' ') : '',
                options: groupOptions
              });
            } else {
              selectOptions.push(that._renderOption(option));
            }
          }
        });
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/select.html'], {
        field: options,
        value: this._value,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          options: selectOptions
        }
      });
    },
    /**
     *
     * @return {string}
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var that = this;
      var options = this.getOptions();
      var selectedOptions = [];
      if (options.hasOwnProperty('options') && _typeof(options.options) === 'object' && Array.isArray(options.options)) {
        $.each(options.options, function (key, option) {
          var type = option.hasOwnProperty('type') && typeof option.type === 'string' ? option.type : 'option';
          if (type === 'group') {
            if (Array.isArray(option.options)) {
              $.each(option.options, function (key, groupOption) {
                var optionText = groupOption.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(groupOption.text)) >= 0 ? groupOption.text : '';
                if (!optionText || optionText === '') {
                  return;
                }
                if (Array.isArray(that._value)) {
                  $.each(that._value, function (key, itemValue) {
                    if (itemValue == groupOption.value) {
                      selectedOptions.push(optionText);
                      return false;
                    }
                  });
                } else if (that._value == groupOption.value) {
                  selectedOptions.push(optionText);
                }
              });
            }
          } else {
            var optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(option.text)) >= 0 ? option.text : '';
            if (!optionText || optionText === '') {
              return;
            }
            if (Array.isArray(that._value)) {
              $.each(that._value, function (key, itemValue) {
                if (itemValue == option.value) {
                  selectedOptions.push(optionText);
                  return false;
                }
              });
            } else if (that._value == option.value) {
              selectedOptions.push(optionText);
            }
          }
        });
      }
      return ejs.render(tpl$1['fields/select.html'], {
        field: options,
        render: {
          selectedOptions: selectedOptions
        }
      });
    },
    /**
     * Сборка опции
     * @param option
     * @return {object}
     * @private
     */
    _renderOption: function _renderOption(option) {
      var optionAttr = [];
      var optionText = option.hasOwnProperty('text') && ['string', 'number'].indexOf(_typeof(option.text)) >= 0 ? option.text : '';
      $.each(option, function (name, value) {
        if (name !== 'text') {
          optionAttr.push(name + '="' + value + '"');
        }
      });
      if (Array.isArray(this._value)) {
        $.each(this._value, function (key, itemValue) {
          if (itemValue == option.value) {
            optionAttr.push('selected="selected"');
            return false;
          }
        });
      } else if (this._value == option.value) {
        optionAttr.push('selected="selected"');
      }
      return {
        type: 'option',
        text: optionText,
        attr: optionAttr.length > 0 ? ' ' + optionAttr.join(' ') : ''
      };
    }
  };

  coreuiForm.fields["switch"] = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'switch',
      name: null,
      label: null,
      labelWidth: null,
      outContent: null,
      description: null,
      errorText: null,
      valueY: 'Y',
      valueN: 'N',
      fields: [],
      required: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      var result;
      if (this._options.readonly) {
        result = this._value;
      } else {
        result = $('.content-' + this._hash + ' input').prop('checked') ? this._options.valueY : this._options.valueN;
      }
      return result;
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        $('.content-' + this._hash + ' input[type=checkbox]').prop('checked', value === this._options.valueY);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var switchContainer = $('.form-switch', container);
      var inputs = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        inputs.removeClass('is-invalid');
        inputs.removeClass('is-valid');
      } else if (isValid) {
        inputs.removeClass('is-invalid');
        inputs.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          switchContainer.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        inputs.removeClass('is-valid');
        inputs.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          switchContainer.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var attributes = [];
      var options = this.getOptions();
      var itemAttr = {
        type: 'checkbox',
        "class": 'form-check-input',
        value: options.valueY
      };
      if (options.name) {
        itemAttr.name = this._options.name;
      }
      if (options.required) {
        itemAttr.required = 'required';
      }
      if (options.hasOwnProperty('attr') && _typeof(options.attr) === 'object' && Array.isArray(options.attr)) {
        itemAttr = coreuiFormUtils.mergeAttr(itemAttr, options.attr);
      }
      if (this._value === options.valueY) {
        itemAttr.checked = 'checked';
      }
      $.each(itemAttr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/switch.html'], {
        field: options,
        value: this._value,
        lang: this._form.getLang(),
        render: {
          attr: attributes.length > 0 ? attributes.join(' ') : ''
        }
      });
    }
  };

  coreuiForm.fields.textarea = {
    _id: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'textarea',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-control d-inline-block'
      },
      required: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' textarea').val();
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        $('.content-' + this._hash + ' textarea').val(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var textarea = $('textarea', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        textarea.removeClass('is-invalid');
        textarea.removeClass('is-valid');
      } else if (isValid) {
        textarea.removeClass('is-invalid');
        textarea.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        textarea.removeClass('is-valid');
        textarea.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      var input = $('.content-' + this._hash + ' textarea');
      if (input[0]) {
        return input.is(':valid');
      }
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var attributes = [];
      var options = this.getOptions();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/textarea.html'], {
        field: options,
        value: this._value !== null ? this._value : '',
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
        }
      });
    }
  };

  coreuiForm.fields.wysiwyg = {
    _id: '',
    _hash: '',
    _form: null,
    _value: null,
    _editor: null,
    _editorHash: null,
    _options: {
      type: 'wysiwyg',
      label: null,
      labelWidth: null,
      width: null,
      minWidth: null,
      maxWidth: null,
      height: null,
      minHeight: null,
      maxHeight: null,
      options: {},
      outContent: null,
      description: null,
      required: null,
      readonly: false,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}               options
     * @param {int}                  index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._editorHash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
      var that = this;
      form.on('show', function () {
        if (!that._options.readonly) {
          that._initEvents();
        }
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
      if (!this._options.readonly) {
        this._initEvents();
      }
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения из поля
     * @return {string|null}
     */
    getValue: function getValue() {
      if (this._options.readonly) {
        return this._value;
      } else {
        return this._editor ? this._editor.getContent() : this._value;
      }
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value);
      } else {
        if (this._editor) {
          this._editor.setContent(value);
        }
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      container.find('.text-success').remove();
      container.find('.text-danger').remove();
      if (isValid === null) {
        return;
      }
      if (isValid) {
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="ps-2 text-success">' + text + '</div>');
        }
      } else {
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="ps-2 text-danger">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean}
     */
    isValid: function isValid() {
      if (this._options.required && !this._options.readonly) {
        return !!this.getValue();
      }
      return true;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      var options = this.getOptions();
      return ejs.render(tpl$1['fields/wysiwyg.html'], {
        field: options,
        value: this._value !== null ? this._value : '',
        editorHash: this._editorHash
      });
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      if (this._options.readonly) {
        return;
      }
      var tinyMceOptions = {};
      var than = this;
      var textareaId = 'editor-' + this._editorHash;
      if (_typeof(this._options.options) === 'object' && !Array.isArray(this._options.options) && Object.keys(this._options.options).length > 0) {
        tinyMceOptions = this._options.options;
      } else if (this._options.options === 'simple') {
        tinyMceOptions = {
          plugins: 'image lists anchor charmap',
          toolbar: 'blocks | bold italic underline | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'forecolor backcolor removeformat',
          menubar: false,
          branding: false
        };
      } else {
        tinyMceOptions = {
          promotion: false,
          branding: false,
          plugins: 'preview importcss searchreplace autolink autosave save directionality code ' + 'visualblocks visualchars fullscreen image link media template codesample table ' + 'charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
          menubar: 'file edit view insert format tools table help',
          toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | ' + 'alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | ' + 'forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen ' + 'preview save print | insertfile image media template link anchor codesample | ltr rtl'
        };
      }
      tinyMceOptions.selector = '#editor-' + this._editorHash;
      if (['string', 'number'].indexOf(_typeof(this._options.width)) >= 0) {
        tinyMceOptions.width = this._options.width;
      }
      if (['string', 'number'].indexOf(_typeof(this._options.minWidth)) >= 0) {
        tinyMceOptions.min_width = this._options.minWidth;
      }
      if (['string', 'number'].indexOf(_typeof(this._options.maxWidth)) >= 0) {
        tinyMceOptions.max_width = this._options.maxWidth;
      }
      if (['string', 'number'].indexOf(_typeof(this._options.height)) >= 0) {
        tinyMceOptions.height = this._options.height;
      }
      if (['string', 'number'].indexOf(_typeof(this._options.minHeight)) >= 0) {
        tinyMceOptions.min_height = this._options.minHeight;
      }
      if (['string', 'number'].indexOf(_typeof(this._options.maxHeight)) >= 0) {
        tinyMceOptions.max_height = this._options.maxHeight;
      }
      tinymce.init(tinyMceOptions).then(function () {
        than._editor = tinymce.get(textareaId);
      });
    }
  };

  coreuiForm.fields.passwordRepeat = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _isChangeState: true,
    _value: '',
    _options: {
      type: 'password_repeat',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        type: 'password',
        "class": 'form-control d-inline-block flex-shrink-0'
      },
      required: null,
      invalidText: null,
      validText: null,
      readonly: null,
      show: true,
      showBtn: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
      var that = this;
      form.on('show', function () {
        that._initEvents();
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
      if (!this._options.readonly) {
        this._initEvents();
      }
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {string}
     */
    getValue: function getValue() {
      var result;
      if (this._options.readonly) {
        result = this._value;
      } else {
        var pass = $('.content-' + this._hash + ' input[type="password"]').eq(0);
        if (typeof pass.attr('disabled') !== 'undefined' && pass.attr('disabled') !== false) {
          result = null;
        } else {
          result = pass.val();
        }
      }
      return result;
    },
    /**
     * Установка значения в поле
     * @param {string} value
     */
    setValue: function setValue(value) {
      if (['string', 'number'].indexOf(_typeof(value)) < 0) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text(value ? '******' : '');
      } else {
        $('.content-' + this._hash + ' input[type="password"]').val(value);
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var input = $('input[type="password"]', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
      } else if (isValid) {
        input.removeClass('is-invalid');
        input.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback d-block">' + text + '</div>');
        }
      } else {
        input.removeClass('is-valid');
        input.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback d-block">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function isValid() {
      if (!this._isChangeState || this._options.readonly) {
        return true;
      }
      var input = $('.content-' + this._hash + ' input[type="password"]');
      if (input.eq(0).val() !== input.eq(1).val()) {
        return false;
      }
      if (input[0]) {
        return input.eq(0).is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     *
     * @private
     */
    _renderContent: function _renderContent() {
      var attributes = [];
      var attributes2 = [];
      var options = this.getOptions();
      this._isChangeState = !options.showBtn ? true : !this._value;
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (!this._isChangeState) {
        options.attr.disabled = '';
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      options.attr.value = this._value ? '******' : '';
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      $.each(options.attr, function (name, value) {
        if (['name', 'value'].indexOf(name) < 0) {
          attributes2.push(name + '="' + value + '"');
        }
      });
      var lang = this._form.getLang();
      return ejs.render(tpl$1['fields/passwordRepeat.html'], {
        field: options,
        value: this._value !== null ? this._value : '',
        lang: lang,
        btn_text: this._isChangeState ? lang.cancel : lang.change,
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          attr2: attributes2.length > 0 ? ' ' + attributes2.join(' ') : ''
        }
      });
    },
    /**
     *
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var options = this.getOptions();
      return ejs.render(tpl$1['fields/passwordRepeat.html'], {
        field: options,
        value: this._value ? '******' : '',
        hash: this._hash
      });
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      var that = this;
      $('.content-' + this._hash + ' .btn-password-change').click(function (e) {
        var textChange = $(this).data('change');
        var textCancel = $(this).data('cancel');
        if (that._isChangeState) {
          $('.content-' + that._hash + ' [type="password"]').attr('disabled', 'disabled');
          $(this).text(textChange);
          that._isChangeState = false;
        } else {
          $('.content-' + that._hash + ' [type="password"]').removeAttr('disabled');
          $(this).text(textCancel);
          that._isChangeState = true;
        }
      });
    }
  };

  coreuiForm.fields.file = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: '',
    _options: {
      type: 'file',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      attr: {
        "class": 'form-control d-inline-block'
      },
      required: null,
      invalidText: null,
      validText: null,
      readonly: null,
      show: true,
      column: null
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {bool} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this.getValue();
      this._options.readonly = !!isReadonly;
      $('.content-' + this._hash).html(this.renderContent());
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения в поле
     * @returns {File[]}
     */
    getValue: function getValue() {
      return this._options.readonly ? this._value : $('.content-' + this._hash + ' input')[0].files;
    },
    /**
     * Установка значения в поле
     * @param {File|File[]} value
     */
    setValue: function setValue(value) {
      if (!(value instanceof File) && !(value instanceof FileList)) {
        return;
      }
      this._value = value;
      if (this._options.readonly) {
        $('.content-' + this._hash).text('');
      } else {
        var container = new DataTransfer();
        if (value instanceof File) {
          container.items.add(value);
        } else {
          $.each(value, function (key, file) {
            if (value instanceof File) {
              container.items.add(file);
            }
          });
        }
        $('.content-' + this._hash + ' input')[0].files = container.files;
      }
    },
    /**
     * Установка валидности поля
     * @param {bool|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      var input = $('input', container);
      container.find('.valid-feedback').remove();
      container.find('.invalid-feedback').remove();
      if (isValid === null) {
        input.removeClass('is-invalid');
        input.removeClass('is-valid');
      } else if (isValid) {
        input.removeClass('is-invalid');
        input.addClass('is-valid');
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="valid-feedback">' + text + '</div>');
        }
      } else {
        input.removeClass('is-valid');
        input.addClass('is-invalid');
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="invalid-feedback">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function isValid() {
      var input = $('.content-' + this._hash + ' input');
      if (input[0]) {
        return input.is(':valid');
      }
      return null;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     *
     * @private
     */
    _renderContent: function _renderContent() {
      var attributes = [];
      var options = this.getOptions();
      if (!options.hasOwnProperty('attr') || _typeof(options.attr) !== 'object' || options.attr === null || Array.isArray(options.attr)) {
        options.attr = {};
      }
      if (options.name) {
        options.attr.name = this._options.name;
      }
      options.attr.type = options.type;
      options.attr.value = this._value !== null ? this._value : '';
      if (options.width) {
        options.attr = coreuiFormUtils.mergeAttr({
          style: 'width:' + options.width
        }, options.attr);
      }
      if (options.required) {
        options.attr.required = 'required';
      }
      $.each(options.attr, function (name, value) {
        attributes.push(name + '="' + value + '"');
      });
      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        datalistId: '',
        value: this._value !== null ? this._value : '',
        render: {
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          datalist: []
        }
      });
    },
    /**
     *
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var options = this.getOptions();
      var type = 'text';
      var value = this._value;
      var lang = this._form.getLang();
      if (options.hasOwnProperty('type') && typeof options.type === 'string') {
        type = options.type;
      }
      try {
        switch (type) {
          case 'date':
            value = coreuiFormUtils.formatDate(value);
            break;
          case 'datetime-local':
            value = coreuiFormUtils.formatDateTime(value);
            break;
          case 'month':
            value = coreuiFormUtils.formatDateMonth(value, lang);
            break;
          case 'week':
            value = coreuiFormUtils.formatDateWeek(value, lang);
            break;
        }
      } catch (e) {
        console.error(e);
        // ignore
      }

      return ejs.render(tpl$1['fields/input.html'], {
        field: options,
        value: value,
        hash: this._hash
      });
    }
  };

  let fileUpUtils = {
    /**
     * Проверка на объект
     * @param value
     */
    isObject: function (value) {
      return typeof value === 'object' && !Array.isArray(value) && value !== null;
    },
    /**
     * Проверка на число
     * @param num
     * @returns {boolean}
     * @private
     */
    isNumeric: function (num) {
      return (typeof num === 'number' || typeof num === "string" && num.trim() !== '') && !isNaN(num);
    },
    /**
     * Получение размера файла в байтах
     * @param {File} file
     * @return {int|null}
     */
    getFileSize: function (file) {
      if (!(file instanceof File)) {
        return null;
      }
      return file.size || file.fileSize;
    },
    /**
     * Получение названия файла
     * @param {File} file
     * @return {string|null}
     */
    getFileName: function (file) {
      if (!(file instanceof File)) {
        return null;
      }
      return file.name || file.fileName;
    },
    /**
     * Formatting size
     * @param {int} size
     * @returns {string}
     */
    getSizeHuman: function (size) {
      if (!fileUpUtils.isNumeric(size)) {
        return '';
      }
      size = Number(size);
      let result = '';
      if (size >= 1073741824) {
        result = (size / 1073741824).toFixed(2) + ' Gb';
      } else if (size >= 1048576) {
        result = (size / 1048576).toFixed(2) + ' Mb';
      } else if (size >= 1024) {
        result = (size / 1024).toFixed(2) + ' Kb';
      } else if (size >= 0) {
        result = size + ' bytes';
      }
      return result;
    },
    /**
     * Создание уникальной строки хэша
     * @returns {string}
     * @private
     */
    hashCode: function () {
      return this.crc32((new Date().getTime() + Math.random()).toString()).toString(16);
    },
    /**
     * Hash crc32
     * @param str
     * @returns {number}
     * @private
     */
    crc32: function (str) {
      for (var a, o = [], c = 0; c < 256; c++) {
        a = c;
        for (var f = 0; f < 8; f++) {
          a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
        }
        o[c] = a;
      }
      for (var n = -1, t = 0; t < str.length; t++) {
        n = n >>> 8 ^ o[255 & (n ^ str.charCodeAt(t))];
      }
      return (-1 ^ n) >>> 0;
    }
  };

  let fileUpEvents = {
    /**
     * Событие начала загрузки
     * @param {object} file
     */
    onLoadStart: function (file) {
      let $file = file.getElement();
      if ($file) {
        $file.find('.fileup-upload').hide();
        $file.find('.fileup-abort').show();
        $file.find('.fileup-result').removeClass('fileup-error').removeClass('fileup-success').text('');
      }
    },
    /**
     * Событие начала изменения прогресса загрузки
     * @param {object}        file
     * @param {ProgressEvent} ProgressEvent
     */
    onLoadProgress: function (file, ProgressEvent) {
      if (ProgressEvent.lengthComputable) {
        let percent = Math.ceil(ProgressEvent.loaded / ProgressEvent.total * 100);
        let $file = file.getElement();
        if ($file) {
          $file.find('.fileup-progress-bar').css('width', percent + "%");
        }
      }
    },
    /**
     * Событие начала загрузки
     * @param {object} file
     */
    onLoadAbort: function (file) {
      let $file = file.getElement();
      if ($file) {
        $file.find('.fileup-abort').hide();
        $file.find('.fileup-upload').show();
        $file.find('.fileup-result').removeClass('fileup-error').removeClass('fileup-success').text('');
      }
    },
    /**
     * Событие успешной загрузки файла
     * @param {object} file
     */
    onSuccess: function (file) {
      let $file = file.getElement();
      if ($file) {
        let lang = this.getLang();
        $file.find('.fileup-abort').hide();
        $file.find('.fileup-upload').hide();
        $file.find('.fileup-result').removeClass('fileup-error').addClass('fileup-success').text(lang.complete);
      }
    },
    /**
     * Событие ошибки
     * @param {string} eventName
     * @param {object} options
     */
    onError: function (eventName, options) {
      let lang = this.getLang();
      switch (eventName) {
        case 'files_limit':
          alert(lang.errorFilesLimit.replace(/%filesLimit%/g, options.filesLimit));
          break;
        case 'size_limit':
          let size = fileUpUtils.getSizeHuman(options.sizeLimit);
          let message = lang.errorSizeLimit;
          message = message.replace(/%sizeLimit%/g, size);
          message = message.replace(/%fileName%/g, fileUpUtils.getFileName(options.fileData));
          alert(message);
          break;
        case 'file_type':
          alert(lang.errorFileType.replace(/%fileName%/g, fileUpUtils.getFileName(options.fileData)));
          break;
        case 'load_bad_status':
        case 'load_error':
        case 'load_timeout':
          let $file = options.file.getElement();
          if ($file) {
            let message = eventName === 'load_bad_status' ? lang.errorBadStatus : lang.errorLoad;
            $file.find('.fileup-abort').hide();
            $file.find('.fileup-upload').show();
            $file.find('.fileup-result').addClass('fileup-error').text(message);
          }
          break;
        case 'old_browser':
          alert(lang.errorOldBrowser);
          break;
      }
    },
    /**
     * Событие переноса файла через dropzone
     * @param {Event} event
     */
    onDragOver: function (event) {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      let dropzone = this.getDropzone();
      if (dropzone) {
        dropzone.addClass('over');
      }
    },
    /**
     * Событие завершения перетаскивания с отпускаем кнопки мыши
     * @param {Event} event
     */
    onDragLeave: function (event) {
      let dropzone = this.getDropzone();
      if (dropzone) {
        dropzone.removeClass('over');
      }
    },
    /**
     * Событие когда перетаскиваемый элемент или выделенный текст покидают допустимую цель перетаскивания
     * @param {Event} event
     */
    onDragEnd: function (event) {
      let dropzone = this.getDropzone();
      if (dropzone) {
        dropzone.removeClass('over');
      }
    },
    /**
     * Событие переноса файла в dropzone
     * @param {Event} event
     */
    onDragEnter: function (event) {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  let fileUpPrivate = {
    /**
     *
     * @param {object} fileUp
     */
    initInput: function (fileUp) {
      let input = null;
      if (fileUp._options.input instanceof HTMLElement || fileUp._options.input instanceof jQuery) {
        input = $(fileUp._options.input);
      } else if (typeof fileUp._options.input === 'string' && fileUp._options.input) {
        input = $('#' + fileUp._options.input);
      }
      if (!input || !$(input)[0] || $(input)[0].type !== 'file') {
        throw new Error('Not found input element');
      }
      fileUp._input = input;
    },
    /**
     *
     * @param {object} fileUp
     */
    initQueue: function (fileUp) {
      let queue = null;
      if (fileUp._options.queue instanceof HTMLElement || fileUp._options.queue instanceof jQuery) {
        queue = $(fileUp._options.queue);
      } else if (typeof fileUp._options.queue === 'string' && fileUp._options.queue) {
        queue = $('#' + fileUp._options.queue);
      }
      if (!queue || !$(queue)[0]) {
        throw new Error('Not found queue element');
      }
      fileUp._queue = queue;
    },
    /**
     *
     * @param {object} fileUp
     */
    initDropzone: function (fileUp) {
      let dropzone = null;
      if (fileUp._options.dropzone instanceof HTMLElement || fileUp._options.dropzone instanceof jQuery) {
        dropzone = $(fileUp._options.dropzone);
      } else if (typeof fileUp._options.dropzone === 'string' && fileUp._options.dropzone) {
        dropzone = $('#' + fileUp._options.dropzone);
      }
      if (dropzone) {
        fileUp._dropzone = dropzone;
        let that = this;
        dropzone.on('click', function () {
          fileUp.getInput().click();
        });
        dropzone[0].addEventListener('dragover', function (event) {
          that.trigger(fileUp, 'drag_over', [event]);
        });
        dropzone[0].addEventListener('dragleave', function (event) {
          that.trigger(fileUp, 'drag_leave', [event]);
        });
        dropzone[0].addEventListener('dragenter', function (event) {
          that.trigger(fileUp, 'drag_enter', [event]);
        });
        dropzone[0].addEventListener('dragend', function (event) {
          that.trigger(fileUp, 'drag_end', [event]);
        });
        dropzone[0].addEventListener('drop', function (event) {
          fileUp.getInput()[0].files = event.target.files || event.dataTransfer.files;
          that.appendFiles(fileUp, event);
        });
      }
    },
    /**
     * Инициализация событий
     * @param {object} fileUp
     */
    initEvents: function (fileUp) {
      /**
       * @param {string}          name
       * @param {function|string} func
       */
      function setEvent(name, func) {
        let event = null;
        if (typeof func === 'function') {
          event = func;
        } else if (typeof func === 'string') {
          event = new Function(func);
        }
        if (event) {
          fileUp.on(name, event);
        }
      }
      let options = fileUp.getOptions();
      let that = this;
      setEvent('load_start', fileUpEvents.onLoadStart);
      setEvent('load_progress', fileUpEvents.onLoadProgress);
      setEvent('load_abort', fileUpEvents.onLoadAbort);
      setEvent('load_success', fileUpEvents.onSuccess);
      setEvent('error', fileUpEvents.onError);
      setEvent('drag_over', fileUpEvents.onDragOver);
      setEvent('drag_leave', fileUpEvents.onDragEnter);
      setEvent('drag_end', fileUpEvents.onDragLeave);
      setEvent('drag_enter', fileUpEvents.onDragEnd);
      if (options.onSelect) {
        setEvent('select', options.onSelect);
      }
      if (options.onRemove) {
        setEvent('remove', options.onRemove);
      }
      if (options.onBeforeStart) {
        setEvent('load_before_start', options.onBeforeStart);
      }
      if (options.onStart) {
        setEvent('load_start', options.onStart);
      }
      if (options.onProgress) {
        setEvent('load_progress', options.onProgress);
      }
      if (options.onAbort) {
        setEvent('load_abort', options.onAbort);
      }
      if (options.onSuccess) {
        setEvent('load_success', options.onSuccess);
      }
      if (options.onFinish) {
        setEvent('load_finish', options.onFinish);
      }
      if (options.onError) {
        setEvent('error', options.onError);
      }
      if (options.onDragOver) {
        setEvent('drag_over', options.onDragOver);
      }
      if (options.onDragLeave) {
        setEvent('drag_leave', options.onDragLeave);
      }
      if (options.onDragEnd) {
        setEvent('drag_end', options.onDragEnd);
      }
      if (options.onDragEnter) {
        setEvent('drag_enter', options.onDragEnter);
      }
      fileUp.getInput().on('change', function (event) {
        that.appendFiles(fileUp, event);
      });
    },
    /**
     * Формирование списка ранее загруженных файлов
     * @param {object} fileUp
     */
    renderFiles: function (fileUp) {
      let options = fileUp.getOptions();
      if (Array.isArray(options.files) && options.files.length > 0) {
        for (var i = 0; i < options.files.length; i++) {
          if (!fileUpUtils.isObject(options.files[i])) {
            continue;
          }
          fileUp.appendFileByData(options.files[i]);
        }
      }
    },
    /**
     * @param fileUp
     * @param name
     * @param params
     * @return {object}
     * @private
     */
    trigger: function (fileUp, name, params) {
      params = params || [];
      let results = [];
      if (fileUp._events[name] instanceof Object && fileUp._events[name].length > 0) {
        for (var i = 0; i < fileUp._events[name].length; i++) {
          let callback = fileUp._events[name][i].callback;
          results.push(callback.apply(fileUp._events[name][i].context || fileUp, params));
          if (fileUp._events[name][i].singleExec) {
            fileUp._events[name].splice(i, 1);
            i--;
          }
        }
      }
      return results;
    },
    /**
     * Append files in queue
     * @param {object} fileUp
     * @param {Event}  event
     */
    appendFiles: function (fileUp, event) {
      event.preventDefault();
      event.stopPropagation();
      let options = fileUp.getOptions();
      let input = fileUp.getInput();
      let files = input[0].files;
      let multiple = input.is("[multiple]");
      if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          let file = files[i];
          if (options.sizeLimit > 0 && fileUpUtils.getFileSize(file) > options.sizeLimit) {
            this.trigger(fileUp, 'error', ['size_limit', {
              fileData: file,
              sizeLimit: options.sizeLimit
            }]);
            continue;
          }
          if (options.filesLimit > 0 && Object.keys(fileUp._files).length >= options.filesLimit) {
            this.trigger(fileUp, 'error', ['files_limit', {
              fileData: file,
              filesLimit: options.filesLimit
            }]);
            break;
          }
          if (typeof input[0].accept === 'string') {
            let accept = input[0].accept;
            if (accept && /[^\w]+/.test(accept)) {
              let isAccept = false;
              let types = accept.split(',');
              if (types.length > 0) {
                for (var t = 0; t < types.length; t++) {
                  types[t] = types[t].replace(/\s/g, '');
                  if (new RegExp(types[t].replace('*', '.*')).test(file.type) || new RegExp(types[t].replace('.', '.*/')).test(file.type)) {
                    isAccept = true;
                    break;
                  }
                }
              }
              if (!isAccept) {
                this.trigger(fileUp, 'error', ['file_type', {
                  fileData: file
                }]);
                continue;
              }
            }
          }
          let results = this.trigger(fileUp, 'select', [file]);
          if (results) {
            let isContinue = false;
            $.each(results, function (key, result) {
              if (result === false) {
                isContinue = true;
                return false;
              }
            });
            if (isContinue) {
              continue;
            }
          }
          if (!multiple) {
            fileUp.removeAll();
          }
          fileUp.appendFile(file);
          if (!multiple) {
            break;
          }
        }
        input.val('');
      }
      this.trigger(fileUp, 'dragEnd', [event]);
    }
  };

  let fileUpFile = {
    _options: {
      name: null,
      size: null,
      urlPreview: null,
      urlDownload: null
    },
    _id: '',
    _status: 'stand_by',
    _fileElement: null,
    _file: null,
    _fileUp: null,
    _xhr: null,
    /**
     * Инициализация
     * @param {object} fileUp
     * @param {int}    id
     * @param {object} options
     * @param {File}   file
     * @private
     */
    _init: function (fileUp, id, options, file) {
      if (!fileUpUtils.isObject(options)) {
        throw new Error('File incorrect options param');
      }
      if (typeof id !== 'number' || id < 0) {
        throw new Error('File dont set or incorrect id param');
      }
      if (typeof options.name !== 'string' || !options.name) {
        throw new Error('File dont set name param');
      }
      this._fileUp = fileUp;
      this._options = $.extend(true, {}, this._options, options);
      this._id = id;
      if (file instanceof File) {
        let xhr = null;
        if (window.XMLHttpRequest) {
          xhr = "onload" in new XMLHttpRequest() ? new XMLHttpRequest() : new XDomainRequest();
        } else if (window.ActiveXObject) {
          try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try {
              xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
              fileUpPrivate.trigger(fileUp, 'error', ['old_browser', {
                file: this
              }]);
            }
          }
        } else {
          fileUpPrivate.trigger(fileUp, 'error', ['old_browser', {
            file: this
          }]);
        }
        if (!xhr) {
          throw new Error('xhr dont created. Check your browser');
        }
        this._xhr = xhr;
        this._file = file;
      } else {
        this._status = 'finish';
      }
    },
    /**
     * Получение id файла
     * @return {null}
     */
    getId: function () {
      return this._id;
    },
    /**
     * Получение name
     * @return {string|null}
     */
    getName: function () {
      return this._file ? fileUpUtils.getFileName(this._file) : this._options.name;
    },
    /**
     * Получение элемента файла
     * @return {jQuery|null}
     */
    getElement: function () {
      return this._fileElement;
    },
    /**
     * Получение urlPreview
     * @return {string|null}
     */
    getUrlPreview: function () {
      return this._options.urlPreview;
    },
    /**
     * Получение urlDownload
     * @return {string|null}
     */
    getUrlDownload: function () {
      return this._options.urlDownload;
    },
    /**
     * Получение size
     * @return {int|null}
     */
    getSize: function () {
      return this._file ? fileUpUtils.getFileSize(this._file) : this._options.size;
    },
    /**
     * Formatting size
     * @returns {string}
     */
    getSizeHuman: function () {
      let size = this.getSize();
      return fileUpUtils.getSizeHuman(size);
    },
    /**
     * Получение xhr
     * @return {XMLHttpRequest|null}
     */
    getXhr: function () {
      return this._xhr;
    },
    /**
     * Получение файла
     * @return {File|null}
     */
    getFile: function () {
      if (!(this._file instanceof File)) {
        return null;
      }
      return this._file;
    },
    /**
     * Получение статуса
     * @return {string}
     */
    getStatus: function () {
      return this._status;
    },
    /**
     * Установка статуса
     * @param {string} status
     */
    setStatus: function (status) {
      if (typeof status !== 'string') {
        return;
      }
      this._status = status;
    },
    /**
     * Получение параметров
     *
     * @returns {object}
     */
    getOptions: function () {
      return this._options;
    },
    /**
     * Получение параметра
     * @param {string} name
     * @returns {*}
     */
    getOption: function (name) {
      if (typeof name !== 'string' || !this._options.hasOwnProperty(name)) {
        return null;
      }
      return this._options[name];
    },
    /**
     * Установка параметра
     * @param {string} name
     * @param {*}      value
     */
    setOption: function (name, value) {
      if (typeof name !== 'string') {
        return;
      }
      this._options[name] = value;
    },
    /**
     * Показ сообщения об ошибке
     * @param {string} message
     */
    showError: function (message) {
      if (typeof message !== 'string') {
        return;
      }
      let element = this.getElement();
      if (element) {
        element.find('.fileup-result').removeClass('fileup-success').addClass('fileup-error').text(message);
      }
    },
    /**
     * Показ сообщения об успехе
     * @param {string} message
     */
    showSuccess: function (message) {
      if (typeof message !== 'string') {
        return;
      }
      let element = this.getElement();
      if (element) {
        element.find('.fileup-result').removeClass('fileup-error').addClass('fileup-success').text(message);
      }
    },
    /**
     * Удаление файла на странице и из памяти
     */
    remove: function () {
      this.abort();
      if (this._fileElement) {
        this._fileElement.fadeOut('fast', function () {
          this.remove();
        });
      }
      let fileId = this.getId();
      if (this._fileUp._files.hasOwnProperty(fileId)) {
        delete this._fileUp._files[fileId];
      }
      fileUpPrivate.trigger(this._fileUp, 'remove', [this]);
    },
    /**
     * Загрузка файла
     * @return {boolean}
     */
    upload: function () {
      let file = this.getFile();
      let xhr = this.getXhr();
      if (!file || !xhr) {
        return false;
      }
      let options = this._fileUp.getOptions();
      let that = this;
      if (typeof options.timeout === 'number') {
        xhr.timeout = options.timeout;
      }

      // запрос начат
      xhr.onloadstart = function () {
        that.setStatus('load_start');
        fileUpPrivate.trigger(that._fileUp, 'load_start', [that]);
      };

      // браузер получил очередной пакет данных
      xhr.upload.onprogress = function (ProgressEvent) {
        fileUpPrivate.trigger(that._fileUp, 'load_progress', [that, ProgressEvent]);
      };

      // запрос был успешно (без ошибок) завершён
      xhr.onload = function () {
        that.setStatus('loaded');
        if (xhr.status === 200) {
          fileUpPrivate.trigger(that._fileUp, 'load_success', [that, xhr.responseText]);
        } else {
          fileUpPrivate.trigger(that._fileUp, 'error', ['load_bad_status', {
            file: that,
            fileData: file,
            response: xhr.responseText,
            xhr: xhr
          }]);
        }
      };

      // запрос был завершён (успешно или неуспешно)
      xhr.onloadend = function () {
        that.setStatus('finish');
        fileUpPrivate.trigger(that._fileUp, 'load_finish', [that]);
      };

      // запрос был отменён вызовом xhr.abort()
      xhr.onabort = function () {
        that.setStatus('stand_by');
        fileUpPrivate.trigger(that._fileUp, 'load_abort', [that]);
      };

      // запрос был прекращён по таймауту
      xhr.ontimeout = function () {
        that.setStatus('stand_by');
        fileUpPrivate.trigger(that._fileUp, 'error', ['load_timeout', {
          file: that,
          fileData: file
        }]);
      };

      // произошла ошибка
      xhr.onerror = function (event) {
        that.setStatus('stand_by');
        fileUpPrivate.trigger(that._fileUp, 'error', ['load_error', {
          file: that,
          fileData: file,
          event: event
        }]);
      };
      xhr.open(options.httpMethod || 'post', options.url, true);
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      fileUpPrivate.trigger(that._fileUp, 'load_before_start', [that, xhr]);
      if (window.FormData !== undefined) {
        let formData = new FormData();
        formData.append(options.fieldName, file);
        if (Object.keys(options.extraFields).length) {
          $.each(options.extraFields, function (name, value) {
            formData.append(name, value);
          });
        }
        return xhr.send(formData);
      } else {
        // IE 8,9
        return xhr.send(file);
      }
    },
    /**
     * Отмена загрузки
     */
    abort: function () {
      if (this._xhr) {
        this._xhr.abort();
      }
    },
    /**
     * Рендер элемента
     * @param {string} tpl
     * @return {string|null}
     */
    render: function (tpl) {
      if (!tpl || typeof tpl !== 'string') {
        return null;
      }
      let lang = this._fileUp.getLang();
      let options = this._fileUp.getOptions();
      let that = this;
      let isNoPreview = false;
      let mimeTypes = fileUpUtils.isObject(options.mimeTypes) ? options.mimeTypes : {};
      let iconDefault = typeof options.iconDefault === 'string' ? options.iconDefault : '';
      let showRemove = typeof options.showRemove === 'boolean' ? options.showRemove : true;
      let size = this.getSizeHuman();
      let icon = null;
      let fileType = null;
      let fileExt = null;
      tpl = tpl.replace(/\[NAME\]/g, this.getName());
      tpl = tpl.replace(/\[SIZE\]/g, size);
      tpl = tpl.replace(/\[UPLOAD\]/g, lang.upload);
      tpl = tpl.replace(/\[REMOVE\]/g, lang.remove);
      tpl = tpl.replace(/\[ABORT\]/g, lang.abort);
      if (this._file && this._file instanceof File) {
        if (this._file.type && typeof this._file.type === 'string' && this._file.type.match(/^image\/.*/)) {
          if (typeof FileReader !== 'undefined') {
            let reader = new FileReader();
            reader.onload = function (ProgressEvent) {
              if (that._fileElement) {
                let preview = that._fileElement.find('.fileup-preview');
                preview.removeClass('no-preview').find('img').attr('src', ProgressEvent.target.result);
              }
            };
            reader.readAsDataURL(this._file);
          }
          isNoPreview = true;
          tpl = tpl.replace(/\[PREVIEW_SRC\]/g, '');
          tpl = tpl.replace(/\[TYPE\]/g, 'fileup-image fileup-no-preview');
        } else {
          tpl = tpl.replace(/\[PREVIEW_SRC\]/g, '');
          tpl = tpl.replace(/\[TYPE\]/g, 'fileup-doc');
          fileType = this._file.type;
          fileExt = this.getName().split('.').pop();
        }
      } else {
        let urlPreview = this.getUrlPreview();
        tpl = tpl.replace(/\[PREVIEW_SRC\]/g, urlPreview ? urlPreview : '');
        tpl = tpl.replace(/\[TYPE\]/g, urlPreview ? 'fileup-image' : 'fileup-doc');
        fileExt = this.getName() ? this.getName().split('.').pop().toLowerCase() : '';
      }
      this._fileElement = $(tpl);
      if (isNoPreview) {
        this._fileElement.find('.fileup-preview').addClass('no-preview');
      }
      if (!size) {
        this._fileElement.find('.fileup-size').hide();
      }
      if (fileType || fileExt) {
        $.each(mimeTypes, function (name, type) {
          if (!fileUpUtils.isObject(type) || !type.hasOwnProperty('icon') || typeof type.icon !== 'string' || type.icon === '') {
            return;
          }
          if (fileType && type.hasOwnProperty('mime')) {
            if (typeof type.mime === 'string') {
              if (type.mime === fileType) {
                icon = type.icon;
                return false;
              }
            } else if (Array.isArray(type.mime)) {
              $.each(type.mime, function (key, mime) {
                if (typeof mime === 'string' && mime === fileType) {
                  icon = type.icon;
                  return false;
                }
              });
              if (icon) {
                return false;
              }
            } else if (type.mime instanceof RegExp) {
              if (type.mime.test(fileType)) {
                icon = type.icon;
                return false;
              }
            }
          }
          if (fileExt && type.hasOwnProperty('ext') && Array.isArray(type.ext)) {
            $.each(type.ext, function (key, ext) {
              if (typeof ext === 'string' && ext === fileExt) {
                icon = type.icon;
                return false;
              }
            });
            if (icon) {
              return false;
            }
          }
        });
      }
      if (!icon) {
        icon = iconDefault;
      }
      this._fileElement.find('.fileup-icon').addClass(icon);
      if (!showRemove) {
        this._fileElement.find('.fileup-remove').hide();
      }
      if (this.getUrlDownload()) {
        let $name = this._fileElement.find('.fileup-name');
        if ($name[0]) {
          $name.replaceWith('<a href="' + this.getUrlDownload() + '" class="fileup-name" download="' + this.getName() + '">' + this.getName() + '</a>');
        }
      }
      if (this._status === 'finish') {
        this._fileElement.find('.fileup-upload').hide();
        this._fileElement.find('.fileup-abort').hide();
        this._fileElement.find('.fileup-progress').hide();
      } else {
        this._fileElement.find('.fileup-upload').click(function () {
          that.upload();
        });
        this._fileElement.find('.fileup-abort').click(function () {
          that.abort();
        });
      }
      this._fileElement.find('.fileup-remove').click(function () {
        that.remove();
      });
      return this._fileElement;
    }
  };

  let tpl = Object.create(null);
  tpl['file.html'] = '<div class="fileup-file [TYPE] mb-2 p-1 d-flex flex-nowrap gap-2 bg-light border border-secondary-subtle rounded rounded-1"> <div class="fileup-preview"> <img src="[PREVIEW_SRC]" alt="[NAME]" class="border rounded"/> <i class="fileup-icon fs-4 text-secondary"></i> </div> <div class="flex-fill"> <div class="fileup-description"> <span class="fileup-name">[NAME]</span> <small class="fileup-size text-nowrap text-secondary">([SIZE])</small> </div> <div class="fileup-controls mt-1 d-flex gap-2"> <span class="fileup-remove" title="[REMOVE]">✕</span> <span class="fileup-upload link-primary">[UPLOAD]</span> <span class="fileup-abort link-primary" style="display:none">[ABORT]</span> </div> <div class="fileup-result"></div> <div class="fileup-progress progress mt-2 mb-1"> <div class="fileup-progress-bar progress-bar"></div> </div> </div> </div>';

  let fileUpInstance = {
    _options: {
      id: null,
      url: null,
      input: null,
      queue: null,
      dropzone: null,
      files: [],
      fieldName: 'file',
      extraFields: {},
      lang: 'en',
      langItems: null,
      sizeLimit: 0,
      filesLimit: 0,
      httpMethod: 'post',
      timeout: null,
      autostart: false,
      showRemove: true,
      templateFile: null,
      onSelect: null,
      onRemove: null,
      onBeforeStart: null,
      onStart: null,
      onProgress: null,
      onAbort: null,
      onSuccess: null,
      onFinish: null,
      onError: null,
      onDragOver: null,
      onDragLeave: null,
      onDragEnd: null,
      onDragEnter: null,
      iconDefault: 'bi bi-file-earmark-text',
      mimeTypes: {
        archive: {
          mime: ['application/zip', 'application/gzip', 'application/x-bzip', 'application/x-bzip2', 'application/x-7z-compressed'],
          ext: ['zip', '7z', 'bz', 'bz2', 'gz', 'jar', 'rar', 'tar'],
          icon: 'bi bi-file-earmark-zip'
        },
        word: {
          mime: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          ext: ['doc', 'docx'],
          icon: 'bi bi-file-earmark-word'
        },
        excel: {
          mime: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          ext: ['xls', 'xlsx'],
          icon: 'bi bi-file-earmark-excel'
        },
        image: {
          mime: /image\/.*/,
          ext: ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'raw', 'webp', 'heic', 'ico'],
          icon: 'bi bi-file-earmark-image'
        },
        video: {
          mime: /video\/.*/,
          ext: ['avi', 'mp4', 'mpeg', 'ogv', 'ts', 'webm', '3gp', '3g2', 'mkv'],
          icon: 'bi bi-file-earmark-play'
        },
        audio: {
          mime: /audio\/.*/,
          ext: ['avi', 'mp4', 'mpeg', 'ogv', 'ts', 'webm', '3gp', '3g2', 'mkv'],
          icon: 'bi bi-file-earmark-music'
        },
        pdf: {
          mime: ['application/pdf'],
          ext: ['pdf'],
          icon: 'bi bi-file-earmark-pdf'
        },
        binary: {
          mime: ['application\/octet-stream'],
          ext: ['bin', 'exe', 'dat', 'dll'],
          icon: 'bi bi-file-earmark-binary'
        }
      }
    },
    _id: null,
    _fileUp: null,
    _fileIndex: 0,
    _input: null,
    _queue: null,
    _dropzone: null,
    _files: {},
    _events: {},
    /**
     * Инициализация
     * @param {object} fileUp
     * @param {object} options
     * @private
     */
    _init: function (fileUp, options) {
      if (typeof options.url !== 'string' || !options.url) {
        throw new Error('Dont set url param');
      }
      this._fileUp = fileUp;
      this._options = $.extend(true, {}, this._options, options);
      this._id = typeof this._options.id === 'string' && this._options.id ? this._options.id : fileUpUtils.hashCode();
      if (!this._options.templateFile || typeof this._options.templateFile !== 'string') {
        this._options.templateFile = tpl['file.html'];
      }
      fileUpPrivate.initInput(this);
      fileUpPrivate.initQueue(this);
      fileUpPrivate.initDropzone(this);
      fileUpPrivate.initEvents(this);
      fileUpPrivate.renderFiles(this);
    },
    /**
     * Разрушение экземпляра
     */
    destruct: function () {
      let id = this.getId();
      if (!this._fileUp._instances.hasOwnProperty(id)) {
        return;
      }
      delete this._fileUp._instances[id];
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function () {
      return this._options;
    },
    /**
     * Получение id
     * @return {string|null}
     */
    getId: function () {
      return this._id;
    },
    /**
     * Получение input
     * @return {jQuery|null}
     */
    getInput: function () {
      return this._input;
    },
    /**
     * Получение queue
     * @return {jQuery|null}
     */
    getQueue: function () {
      return this._queue;
    },
    /**
     * Получение dropzone
     * @return {jQuery|null}
     */
    getDropzone: function () {
      return this._dropzone;
    },
    /**
     * Подписка на событие
     * @param {string}           eventName
     * @param {function|string}  callback
     * @param {object|undefined} context
     */
    on: function (eventName, callback, context) {
      if (typeof this._events[eventName] !== 'object') {
        this._events[eventName] = [];
      }
      this._events[eventName].push({
        context: context || this,
        callback: callback,
        singleExec: false
      });
    },
    /**
     * Подписка на событие таким образом, что выполнение произойдет лишь один раз
     * @param {string}           eventName
     * @param {function|string}  callback
     * @param {object|undefined} context
     */
    one: function (eventName, callback, context) {
      if (typeof this._events[eventName] !== 'object') {
        this._events[eventName] = [];
      }
      this._events[eventName].push({
        context: context || this,
        callback: callback,
        singleExec: true
      });
    },
    /**
     * Получение настроек языка
     */
    getLang: function () {
      return $.extend(true, {}, this._options.langItems);
    },
    /**
     * Получение всех файлов
     * @return {object}
     */
    getFiles: function () {
      return this._files;
    },
    /**
     * Получение файла по его id
     * @param {int} fileId
     * @return {object|null}
     */
    getFileById: function (fileId) {
      let result = null;
      $.each(this._files, function (key, file) {
        if (fileId === file.getId()) {
          result = file;
        }
      });
      return result;
    },
    /**
     * Удаление всех файлов
     */
    removeAll: function () {
      $.each(this._files, function (key, file) {
        file.remove();
      });
    },
    /**
     * Загрузка всех файлов
     */
    uploadAll: function () {
      $.each(this._files, function (key, file) {
        file.upload();
      });
    },
    /**
     * Отмена загрузки всех файлов
     */
    abortAll: function () {
      $.each(this._files, function (key, file) {
        file.abort();
      });
    },
    /**
     * Добавление файла в список из объекта File
     * @param {object} file
     * @result {boolean}
     */
    appendFile: function (file) {
      if (!(file instanceof File)) {
        return false;
      }
      let fileInstance = $.extend(true, {}, fileUpFile);
      let data = {
        name: fileUpUtils.getFileName(file),
        size: fileUpUtils.getFileSize(file),
        type: file.type
      };
      fileInstance._init(this, this._fileIndex, data, file);
      this._files[this._fileIndex] = fileInstance;
      let queue = this.getQueue();
      if (queue) {
        queue.append(fileInstance.render(this._options.templateFile));
      }
      this._fileIndex++;
      if (typeof this._options.autostart === 'boolean' && this._options.autostart) {
        fileInstance.upload();
      }
      return true;
    },
    /**
     * Добавление файла в список из данных
     * @param {object} data
     * @result {boolean}
     */
    appendFileByData: function (data) {
      if (!fileUpUtils.isObject(data)) {
        return false;
      }
      let fileInstance = $.extend(true, {}, fileUpFile);
      fileInstance._init(this, this._fileIndex, data);
      fileInstance.setStatus('finish');
      this._files[this._fileIndex] = fileInstance;
      let queue = this.getQueue();
      if (queue) {
        queue.append(fileInstance.render(this._options.templateFile));
      }
      this._fileIndex++;
      return true;
    }
  };

  let fileUp = {
    lang: {},
    _instances: {},
    /**
     * Создание экземпляра
     * @param {object} options
     * @returns {object}
     */
    create: function (options) {
      options = fileUpUtils.isObject(options) ? options : {};
      if (!options.hasOwnProperty('lang')) {
        options.lang = 'en';
      }
      let langList = this.lang.hasOwnProperty(options.lang) ? this.lang[options.lang] : {};
      options.langItems = options.hasOwnProperty('langItems') && fileUpUtils.isObject(options.langItems) ? $.extend(true, {}, langList, options.langItems) : langList;
      let instance = $.extend(true, {}, fileUpInstance);
      instance._init(this, options);
      let id = instance.getId();
      this._instances[id] = instance;
      return instance;
    },
    /**
     * Получение экземпляра по id
     * @param {string} id
     * @returns {object|null}
     */
    get: function (id) {
      if (!this._instances.hasOwnProperty(id)) {
        return null;
      }
      if (!$.contains(document, this._instances[id]._input[0])) {
        delete this._instances[id];
        return null;
      }
      return this._instances[id];
    }
  };

  fileUp.lang.en = {
    upload: 'Upload',
    abort: 'Abort',
    remove: 'Remove',
    complete: 'Complete',
    error: 'Error',
    errorLoad: 'Error uploading file',
    errorBadStatus: 'Error uploading file. Bad request.',
    errorFilesLimit: 'The number of selected files exceeds the limit (%filesLimit%)',
    errorSizeLimit: 'File "%fileName%" exceeds the size limit (%sizeLimit%)',
    errorFileType: 'File "%fileName%" is incorrect',
    errorOldBrowser: 'Your browser can not upload files. Update to the latest version'
  };

  fileUp.lang.ru = {
    upload: 'Загрузить',
    abort: 'Остановить',
    remove: 'Удалить',
    complete: 'Готово',
    error: 'Ошибка',
    errorLoad: 'Ошибка при загрузке файла',
    errorBadStatus: 'Ошибка при загрузке файла. Некорректный запрос.',
    errorFilesLimit: 'Количество выбранных файлов превышает лимит (%filesLimit%)',
    errorSizeLimit: 'Файл "%fileName%" превышает предельный размер (%sizeLimit%)',
    errorFileType: 'Файл "%fileName%" является некорректным',
    errorOldBrowser: 'Обновите ваш браузер до последней версии'
  };

  fileUp.lang.es = {
    upload: 'Subir',
    abort: 'Cancelar',
    remove: 'Eliminar',
    complete: 'Cargado',
    error: 'Error',
    errorLoad: 'Error al cargar el archivo',
    errorBadStatus: 'Error al cargar el archivo. Solicitud no válida.',
    errorFilesLimit: 'El número de archivo selecccionados excede el límite (%filesLimit%)',
    errorSizeLimit: 'El archivo "%fileName%" excede el limite de tamaño (%sizeLimit%)',
    errorFileType: 'El archivo "%fileName%" es inválido',
    errorOldBrowser: 'Tu navegador no puede subir archivos. Actualiza a la última versión'
  };

  fileUp.lang.pt = {
    upload: 'Enviar',
    abort: 'Cancelar',
    remove: 'Remover',
    complete: 'Enviado',
    error: 'Erro',
    errorLoad: 'Erro ao carregar o arquivo',
    errorBadStatus: 'Erro ao carregar o arquivo. Pedido inválido.',
    errorFilesLimit: 'O número de arquivos selecionados excede o limite (%filesLimit%)',
    errorSizeLimit: 'Arquivo "%fileName%" excede o limite (%sizeLimit%)',
    errorFileType: 'Arquivo "%fileName%" inválido',
    errorOldBrowser: 'Seu navegador não pode enviar os arquivos. Atualize para a versão mais recente'
  };

  coreuiForm.fields.fileUpload = {
    _id: '',
    _hash: '',
    _form: null,
    _index: 0,
    _value: null,
    _fileUp: null,
    _options: {
      type: 'fileUpload',
      name: null,
      label: null,
      labelWidth: null,
      width: null,
      outContent: null,
      description: null,
      errorText: null,
      attach: null,
      required: null,
      invalidText: null,
      validText: null,
      readonly: null,
      show: true,
      column: null,
      options: {
        url: '',
        httpMethod: 'post',
        fieldName: 'file',
        showButton: true,
        showDropzone: false,
        autostart: true,
        extraFields: true,
        accept: null,
        timeout: null,
        filesLimit: null,
        sizeLimit: null,
        templateFile: null
      }
    },
    /**
     * Инициализация
     * @param {coreuiFormInstance} form
     * @param {object}             options
     * @param {int}                index Порядковый номер на форме
     */
    init: function init(form, options, index) {
      this._form = form;
      this._index = index;
      this._id = form.getId() + "-field-" + (options.hasOwnProperty('name') ? options.name : index);
      this._hash = coreuiFormUtils.hashCode();
      this._value = coreuiFormUtils.getFieldValue(form, options);
      this._options = coreuiFormUtils.mergeFieldOptions(form, this._options, options);
      var that = this;
      form.on('show', function () {
        that._initEvents();
      });
    },
    /**
     * Получение параметров
     * @returns {object}
     */
    getOptions: function getOptions() {
      return $.extend(true, {}, this._options);
    },
    /**
     * Изменение режима поля только для чтения
     * @param {boolean} isReadonly
     */
    readonly: function readonly(isReadonly) {
      this._value = this._getFiles();
      this._options.readonly = !!isReadonly;
      if (this._fileUp) {
        this._fileUp.destruct();
      }
      $('.content-' + this._hash).html(this.renderContent());
      this._initEvents();
    },
    /**
     * Скрытие поля
     * @param {int} duration
     */
    hide: function hide(duration) {
      $('#coreui-form-' + this._id).animate({
        opacity: 0
      }, duration || 200, function () {
        $(this).removeClass('d-flex').addClass('d-none').css('opacity', '');
      });
    },
    /**
     * Показ поля
     * @param {int} duration
     */
    show: function show(duration) {
      $('#coreui-form-' + this._id).addClass('d-flex').removeClass('d-none').css('opacity', 0).animate({
        opacity: 1
      }, duration || 200, function () {
        $(this).css('opacity', '');
      });
    },
    /**
     * Получение значения из поля
     * @returns {Array}
     */
    getValue: function getValue() {
      var files = this._getFiles();
      $.each(files, function (key, file) {
        if (file.hasOwnProperty('urlPreview')) {
          delete file.urlPreview;
        }
        if (file.hasOwnProperty('urlDownload')) {
          delete file.urlDownload;
        }
      });
      return files;
    },
    /**
     * Установка значения в поле
     * @param {Array} value
     */
    setValue: function setValue(value) {
      if (!Array.isArray(value)) {
        return;
      }
      var that = this;
      this._fileUp.removeAll();
      $.each(value, function (key, item) {
        if (item instanceof File) {
          that._fileUp.appendFile(item);
        } else if (coreuiFormUtils.isObject(item)) {
          that._fileUp.appendFileByData(item);
        }
      });
    },
    /**
     * Установка валидности поля
     * @param {boolean|null} isValid
     * @param {text} text
     */
    validate: function validate(isValid, text) {
      if (this._options.readonly) {
        return;
      }
      var container = $('.content-' + this._hash);
      container.find('> .validate-content').remove();
      if (isValid) {
        if (typeof text === 'undefined' && typeof this._options.validText === 'string') {
          text = this._options.validText;
        }
        if (typeof text === 'string') {
          container.append('<div class="validate-content text-success">' + text + '</div>');
        }
      } else if (isValid === false) {
        if (typeof text === 'undefined') {
          if (typeof this._options.invalidText === 'string') {
            text = this._options.invalidText;
          } else if (!text && this._options.required) {
            text = this._form.getLang().required_field;
          }
        }
        if (typeof text === 'string') {
          container.append('<div class="validate-content text-danger">' + text + '</div>');
        }
      }
    },
    /**
     * Проверка валидности поля
     * @return {boolean|null}
     */
    isValid: function isValid() {
      if (this._options.required && this._fileUp) {
        return this._getFiles().length > 0;
      }
      return null;
    },
    /**
     * Получение экземпляра fileUp
     * @return {null}
     */
    getFileUp: function getFileUp() {
      return this._fileUp;
    },
    /**
     * Формирование поля
     * @returns {string}
     */
    render: function render() {
      var options = this.getOptions();
      var attachFields = coreuiFormUtils.getAttacheFields(this._form, options);
      return ejs.render(tpl$1['form-field-label.html'], {
        id: this._id,
        form: this._form,
        hash: this._hash,
        field: options,
        content: this.renderContent(),
        attachFields: attachFields
      });
    },
    /**
     * Формирование контента поля
     * @return {*}
     */
    renderContent: function renderContent() {
      return this._options.readonly ? this._renderContentReadonly() : this._renderContent();
    },
    /**
     * Сборка содержимого
     * @private
     */
    _renderContent: function _renderContent() {
      var lang = this._form.getLang();
      var fileUpOptions = coreuiFormUtils.isObject(this._options.options) ? this._options.options : {};
      var isMultiple = !(coreuiFormUtils.isNumeric(fileUpOptions.filesLimit) && Number(fileUpOptions.filesLimit) === 1);
      var accept = typeof fileUpOptions.accept === 'string' && fileUpOptions.accept ? fileUpOptions.accept : null;
      return ejs.render(tpl$1['fields/file-upload.html'], {
        id: this._hash,
        showButton: !!fileUpOptions.showButton,
        showDropzone: !!fileUpOptions.showDropzone,
        isMultiple: isMultiple,
        accept: accept,
        lang: lang
      });
    },
    /**
     * Сборка содержимого только для просмотра
     * @private
     */
    _renderContentReadonly: function _renderContentReadonly() {
      var lang = this._form.getLang();
      var fileUpOptions = coreuiFormUtils.isObject(this._options.options) ? this._options.options : {};
      var isMultiple = !(coreuiFormUtils.isNumeric(fileUpOptions.filesLimit) && Number(fileUpOptions.filesLimit) === 1);
      var accept = typeof fileUpOptions.accept === 'string' && fileUpOptions.accept ? fileUpOptions.accept : null;
      return ejs.render(tpl$1['fields/file-upload.html'], {
        id: this._hash,
        showButton: false,
        showDropzone: false,
        isMultiple: isMultiple,
        accept: accept,
        lang: lang
      });
    },
    /**
     * Инициализация событий
     * @private
     */
    _initEvents: function _initEvents() {
      var options = coreuiFormUtils.isObject(this._options.options) ? this._options.options : {};
      var formOptions = this._form.getOptions();
      var queue = $('#fileup-' + this._hash + '-queue');
      var createOptions = {
        url: typeof options.url === 'string' ? options.url : '',
        input: 'fileup-' + this._hash,
        queue: queue
      };
      if (formOptions.showDropzone) {
        createOptions.dropzone = 'fileup-' + this._hash + '-dropzone';
      }
      if (typeof formOptions.lang === 'string') {
        createOptions.lang = formOptions.lang;
      }
      if (typeof options.fieldName === 'string') {
        createOptions.fieldName = options.fieldName;
      }
      if (typeof options.httpMethod === 'string') {
        createOptions.httpMethod = options.httpMethod;
      }
      if (coreuiFormUtils.isObject(options.extraFields)) {
        createOptions.extraFields = options.extraFields;
      }
      if (coreuiFormUtils.isNumeric(options.sizeLimit)) {
        createOptions.sizeLimit = options.sizeLimit;
      }
      if (coreuiFormUtils.isNumeric(options.filesLimit)) {
        createOptions.filesLimit = options.filesLimit;
      }
      if (coreuiFormUtils.isNumeric(options.timeout)) {
        createOptions.timeout = options.timeout;
      }
      if (typeof options.autostart === 'boolean') {
        createOptions.autostart = options.autostart;
      }
      if (typeof options.templateFile === 'string') {
        createOptions.templateFile = options.templateFile;
      }
      if (this._options.readonly) {
        createOptions.showRemove = false;
      }
      if (Array.isArray(this._value)) {
        createOptions.files = this._value;
      }
      this._fileUp = fileUp.create(createOptions);
      if (Array.isArray(this._value) && this._value.length > 0) {
        queue.addClass('mt-2');
      }
      this._fileUp.on('select', function (file) {
        queue.addClass('mt-2');
      });
      this._fileUp.on('remove', function (file) {
        if (Object.keys(this.getFiles()).length === 0) {
          setTimeout(function () {
            queue.removeClass('mt-2');
          }, 150);
        }
      });
      this._fileUp.on('load_success', function (file, response) {
        var data = null;
        if (response) {
          try {
            data = JSON.parse(response);
          } catch (e) {
            file.showError('Incorrect response JSON format');
          }
        }
        if (data) {
          file.setOption('upload', data);
        }
      });
    },
    /**
     * Получение текущего списка файлов
     * @return {*[]}
     * @private
     */
    _getFiles: function _getFiles() {
      if (!this._fileUp) {
        return [];
      }
      var files = this._fileUp.getFiles();
      var results = [];
      if (Object.keys(files).length > 0) {
        $.each(files, function (key, file) {
          var fileBinary = file.getFile();
          var result = file.getOptions();
          result.name = file.getName();
          result.size = file.getSize();
          if (fileBinary && fileBinary instanceof File) {
            result.type = fileBinary.type;
          }
          results.push(result);
        });
      }
      return results;
    }
  };

  return coreuiForm;

}));
