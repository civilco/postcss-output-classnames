import postcss from 'postcss';
import fs from 'fs';
import test from 'ava';

import plugin from './';

test('find any properties with a //', t => {
  let input = `
  .bob { // class: human_classname; padding: 10px; }
  .foo { width: 50; color: red; height: 10px; }
  .bar { flex: 1 }
  `;

  return postcss([ plugin({
    file: './test1.json',
  }) ])
  .process(input)
  .then( result => {
    let json = JSON.parse(fs.readFileSync('./test1.json'));

    t.deepEqual(json, [
      {
        selector: ".bob",
        name: "human_classname",
      }
    ]);
    t.deepEqual(result.warnings().length, 0);
  })
  .then(()=>new Promise((resolve, reject)=>fs.unlink('./test1.json', resolve)))
});
