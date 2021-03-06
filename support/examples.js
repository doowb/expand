var expand = require('../');

console.log(expand({a: '<%= b.c.d %>', b: {c: {d: 'eee'}}}))
//=> { a: 'eee', b: { c: { d: 'eee' } } }

/**
 * Examples
 */


//
expand({a: '<%= b %>', b: '<%= c %>', c: 'It worked!'});
//=> {a: 'It worked!', b: 'It worked!', c: 'It worked!'}

// process templates in objects
expand({a: {c: '<%= d %>'}, d: {f: 'g'}});
//=>  {a: {c: {f: 'g'}}, d: {f: 'g'}};

// process a template in an array
expand(['<%= a %>'], {a: 'b'});
//=> ['b']

// process templates in a string
expand('<%= a %>', {a: 'b'});
//=> 'b'

// process multiple templates in an array
expand(['<%= a %>', '<%= b %>'], {a: 'b', b: 'c'});
//=> ['b', 'c']

// expand nested templates in an object
var data = {a: {b: {c: 'd'}}};
expand({foo: '<%= a.b.c %>'}, data);
//=> {foo: 'd'}

// recursively expand templates
var data = {a: '<%= b %>', b: '<%= c %>', c: 'the end!'};
expand('<%= a %>', data);
//=> 'the end!'

// process multiple templates in the same string
var str = '<%= a %>/<%= b %>';
expand(str, {a: 'foo', b: 'bar'});
//=> 'foo/bar'

// process multiple templates in an object value
var data = {
  a: {
    c: '<%= d %>/<%= e %>'
  },
  d: 'ddd',
  e: 'eee'
};
expand(data).a.c;
//=> 'ddd/eee'

// recursively process templates in object values
var data = {
  a: '<%= b %>/<%= c %>',
  b: 'xxx',
  c: '<%= y %>',
  y: 'zzz'
};
expand('<%= a %>', data);
//=> 'xxx/zzz'

// call helpers in templates
var ctx = {
  foo: 'bar',
  c: {
    d: {
      e: function (str) {
        return str.toUpperCase();
      }
    }
  }
};
expand('abc <%= c.d.e(foo) %> xyz', ctx);
//=> 'abc BAR xyz'

// use custom regex
// Options may be passed as the third argument. Currently `options.regex` is the only option.

var data = {a: 'bbb', c: 'ddd', e: 'fff'};
expand({foo: ':c/:e'}, data, {regex: /:([(\w ),]+)/});
//=> {foo: 'ddd/fff'}

// call functions with custom regex.
var data = {
  a: {c: ':d/:e/:upper(f)'},
  d: 'ddd',
  e: 'eee',
  f: 'foo',
  upper: function (str) {
    return str.toUpperCase();
  }
};

var result = expand(data, data, {regex: /:([(\w ),]+)/});
console.log(result.a.c);
//=> 'ddd/eee/FOO'
