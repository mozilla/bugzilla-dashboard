/**
  * @description Reversing the order according to first parameter.
  * @param {String} order asc or dsc
  * @returns {Number} 1 || -1
  */
const ascDescSortFunc = (order) => (order === 'desc' ? 1 : -1);

/**
 * @description checks falsy values and sorts each item from array accordingly
 * @param {*} a First Sort Object from Array.sort function
 * @param {*} b Second Sort Object
 * @param {*} index ColumnIndex for the sorted table
 * @param {*} oder order for sorting a table(ascending / descending order)
 * @returns {Number} -1 || 0 || 1
 */
const sort = (a, b, index, order) => {
  // add position of index to Objects
  const objectA = a[index];
  const objectB = b[index];

  // Null check of Objects
  const countNonCheckedA = objectA ? (objectA.count || objectA.length) : 0;
  const countNonCheckedB = objectB ? (objectB.count || objectB.length) : 0;

  // Null check of count
  const countA = countNonCheckedA || 0;
  const countB = countNonCheckedB || 0;

  // Get Asc or Desc
  const orderVal = ascDescSortFunc(order);

  // multiply Sortvalue and order value and return
  if (countB < countA) {
    return -1 * orderVal;
  }
  if (countB > countA) {
    return 1 * orderVal;
  }
  return 0 * orderVal;
};

export default sort;
