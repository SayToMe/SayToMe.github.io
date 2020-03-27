import * as _ from 'lodash';

export function randomColorGenerator(opacity = 0.5) {
  const r = Math.random() * 256;
  const g = Math.random() * 256;
  const b = Math.random() * 256;
  return 'rgba(' + [r.toFixed(), g.toFixed(), b.toFixed(), opacity].join(',') + ')';
}

export function prettify(val: string | number, digitsAfterDot = 2) {
  if (_.isNil(val)) {
    return val;
  } else if (_.isNumber(val)) {
    return val.toFixed(digitsAfterDot);
  } else {
    const dotIndex = val.indexOf('.');
    return dotIndex === -1
      ? val
      : val.slice(0, dotIndex + 3);
  }
}
