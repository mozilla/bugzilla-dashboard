/**
 * @description checks falsy values and sorts each item from array accordingly
 * @param {*} a First Sort Object from Array.sort function
 * @param {*} b Second Sort Object
 * @param {*} index ColumnIndex for the sorted table
 * @returns {Number} -1 || 0 || 1
 */
const sortFunc = (a, b, index) => {
  // add position of index to Objects
  const objectA = a[index];
  const objectB = b[index];

  // Null check of Objects
  const countNonCheckedA = objectA ? (objectA.count || objectA.length) : 0;
  const countNonCheckedB = objectB ? (objectB.count || objectB.length) : 0;

  // Null check of count
  const countA = countNonCheckedA || 0;
  const countB = countNonCheckedB || 0;

  if (countB < countA) {
    return -1;
  }
  if (countB > countA) {
    return 1;
  }
  return 0;
};

export default sortFunc;
