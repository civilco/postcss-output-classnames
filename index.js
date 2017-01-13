var postcss = require('postcss');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var isVariableDeclaration = /^\/\/.*/;

module.exports = postcss.plugin('postcss-output-classnames', (opts) => {
  opts = opts || {};
  return (css, result) => {
    var output = [];

    css.walkDecls(declaration => {
      if (isVariableDeclaration.test(declaration.prop)) {
        output.push({
          selector: _.get(declaration, 'parent.selector'),
          name: declaration.value.replace('class:', '').trim(),
        });
        declaration.remove();
      }
    });

    // console.log('output', output);

    if (output.length && _.isString(opts.file)) {
      mkdirp.sync(path.dirname(opts.file));
      var json = [];

      try {
        json = JSON.parse(fs.readFileSync(opts.file) || '[]');
      } catch (e) {}

      output = [].concat(json, output);
      fs.writeFileSync(opts.file, JSON.stringify(output, null, 2));
    }
  };
});
