import {SimpleComps} from '../src/simple-components.js';

let passes = 0;

window.onload = function() {
  const simpleComp = new SimpleComps('comps/');

  simpleComp.render('testComp').then(() => {
    if (document.getElementById('input1') != null) {
      console.error('Test Failed: Second IF statement failed');
    } else {
      passes++;
    }

    if (document.getElementById('input0') == null) {
      console.error('Test Failed: Comps were not rendered');
    } else {
      passes++;
      if (
        document.getElementById('input0').getAttribute('placeholder') !=
        'Placeholder test'
      ) {
        console.error('Test Failed: Comp data parsing failed');
      } else {
        passes++;
      }
    }

    console.warn(`Test Complete: ${passes}/3 passed. ${3 - passes} failed.`);
  });
};
