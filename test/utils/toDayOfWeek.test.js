import toDayOfWeek from '../../src/utils/toDayOfWeek';

it('Monday to Friday', () => {
  const newDate = toDayOfWeek('2018-12-31');
  expect(newDate).toBe('2019-01-04');
});

it('Friday to Friday', () => {
  const newDate = toDayOfWeek('2019-01-04');
  expect(newDate).toBe('2019-01-04');
});

it('Saturday to next week Friday', () => {
  const newDate = toDayOfWeek('2018-12-29');
  expect(newDate).toBe('2019-01-04');
});

it('Sunday to Friday', () => {
  const newDate = toDayOfWeek('2018-12-30');
  expect(newDate).toBe('2019-01-04');
});

it('Current - To Friday of current week', () => {
  const newDate = toDayOfWeek();
  const myTempDate = new Date();
  const distance = 5 - myTempDate.getDay(); // 5 represents Friday
  myTempDate.setDate(myTempDate.getDate() + distance);
  expect(newDate).toBe((myTempDate).toISOString().split('T')[0]);
});
