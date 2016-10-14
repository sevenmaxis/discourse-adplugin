/*jshint esversion: 6 */

// This is a mechanism for quickly rendering templates which is Ember aware
// templates are highly compatible with Ember so you don't need to worry about calling "get"
// and computed properties function, additionally it uses stringParams like Ember does

// compat with ie8 in case this gets picked up elsewhere
const objectCreate = Object.create || function(parent) {
  function F() {}
  F.prototype = parent;
  return new F();
};

const RawHandlebars = Handlebars.create();

RawHandlebars.helper = function() {};
RawHandlebars.helpers = objectCreate(Handlebars.helpers);

RawHandlebars.helpers.get = function(context, options) {
  var firstContext =  options.contexts[0];
  var val = firstContext[context];

  if (val && val.isDescriptor) { return Em.get(firstContext, context); }
  val = val === undefined ? Em.get(firstContext, context): val;
  return val;
};

// adds compatability so this works with stringParams
function stringCompatHelper(fn) {
  const old = RawHandlebars.helpers[fn];
  RawHandlebars.helpers[fn] = function(context,options) {
    return old.apply(this, [
        RawHandlebars.helpers.get(context,options),
        options
    ]);
  };
}

function buildPath(blk, args) {
  var result = { type: "PathExpression",
    data: false,
    depth: blk.path.depth,
    loc: blk.path.loc };

  // Server side precompile doesn't have jquery.extend
  Object.keys(args).forEach(function (a) {
    result[a] = args[a];
  });

  return result;
}

function replaceGet(ast) {
  var visitor = new Handlebars.Visitor();
  visitor.mutating = true;

  visitor.MustacheStatement = function(mustache) {
    if (!(mustache.params.length || mustache.hash)) {
      mustache.params[0] = mustache.path;
      mustache.path = buildPath(mustache, { parts: ['get'], original: 'get', strict: true, falsy: true });
    }
    return Handlebars.Visitor.prototype.MustacheStatement.call(this, mustache);
  };

  // rewrite `each x as |y|` as each y in x`
  // This allows us to use the same syntax in all templates
  visitor.BlockStatement = function(block) {
    if (block.path.original === 'each' && block.params.length === 1) {
      var paramName = block.program.blockParams[0];
      block.params = [ buildPath(block, { original: paramName }),
      { type: "CommentStatement", value: "in" },
      block.params[0] ];
      delete block.program.blockParams;
    }

    return Handlebars.Visitor.prototype.BlockStatement.call(this, block);
  };

  visitor.accept(ast);
}

if (Handlebars.Compiler) {
  RawHandlebars.Compiler = function() {};
  RawHandlebars.Compiler.prototype = objectCreate(Handlebars.Compiler.prototype);
  RawHandlebars.Compiler.prototype.compiler = RawHandlebars.Compiler;

  RawHandlebars.JavaScriptCompiler = function() {};

  RawHandlebars.JavaScriptCompiler.prototype = objectCreate(Handlebars.JavaScriptCompiler.prototype);
  RawHandlebars.JavaScriptCompiler.prototype.compiler = RawHandlebars.JavaScriptCompiler;
  RawHandlebars.JavaScriptCompiler.prototype.namespace = "RawHandlebars";

  RawHandlebars.precompile = function(value, asObject) {
    var ast = Handlebars.parse(value);
    replaceGet(ast);

    var options = {
      knownHelpers: {
        get: true
      },
      data: true,
      stringParams: true
    };

    asObject = asObject === undefined ? true : asObject;

    var environment = new RawHandlebars.Compiler().compile(ast, options);
    return new RawHandlebars.JavaScriptCompiler().compile(environment, options, undefined, asObject);
  };

  RawHandlebars.compile = function(string) {
    var ast = Handlebars.parse(string);
    replaceGet(ast);

    // this forces us to rewrite helpers
    var options = {  data: true, stringParams: true };
    var environment = new RawHandlebars.Compiler().compile(ast, options);
    var templateSpec = new RawHandlebars.JavaScriptCompiler().compile(environment, options, undefined, true);

    var t = RawHandlebars.template(templateSpec);
    t.isMethod = false;

    return t;
  };
}


RawHandlebars.get = function(ctx, property, options) {
  if (options.types && options.data.view) {
    var view = options.data.view;
    return view.getStream ? view.getStream(property).value() : view.getAttr(property);
  } else {
    return Ember.get(ctx, property);
  }
};

export function template() {
  return RawHandlebars.template.apply(this, arguments);
}

export function precompile() {
  return RawHandlebars.precompile.apply(this, arguments);
}

export function compile() {
  return RawHandlebars.compile.apply(this, arguments);
}

export function get() {
  return RawHandlebars.get.apply(this, arguments);
}

// `Ember.Helper` is only available in versions after 1.12
export function htmlHelper(fn) {
  if (Ember.Helper) {
    return Ember.Helper.helper(function() {
      return new Handlebars.SafeString(fn.apply(this, Array.prototype.slice.call(arguments)) || '');
    });
  } else {
    return Ember.Handlebars.makeBoundHelper(function() {
      return new Handlebars.SafeString(fn.apply(this, Array.prototype.slice.call(arguments)) || '');
    });
  }
}

export function registerHelper(name, fn) {
  Ember.HTMLBars._registerHelper(name, fn);
}

function resolveParams(ctx, options) {
  let params = {};
  const hash = options.hash;

  if (hash) {
    if (options.hashTypes) {
      Object.keys(hash).forEach(function(k) {
        const type = options.hashTypes[k];
        if (type === "STRING" || type === "StringLiteral") {
          params[k] = hash[k];
        } else if (type === "ID" || type === "PathExpression") {
          params[k] = get(ctx, hash[k], options);
        }
      });
    } else {
      params = hash;
    }
  }
  return params;
}

export function registerUnbound(name, fn) {
  const func = function(property, options) {
    if (options.types && (options.types[0] === "ID" || options.types[0] === "PathExpression")) {
      property = get(this, property, options);
    }

    return fn.call(this, property, resolveParams(this, options));
  };

  Handlebars.registerHelper(name, func);
  Ember.Handlebars.registerHelper(name, func);
}
