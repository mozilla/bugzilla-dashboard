import toMondayOfWeek from '../../src/utils/toMondayOfWeek';

it('2018 - Sunday to Monday', () => {
  const newDate = toMondayOfWeek('2018-12-30');
  expect(newDate).toBe('2018-12-24');
});

it('2019 - First week: Wednesday to Monday', () => {
  const newDate = toMondayOfWeek('2019-01-02');
  expect(newDate).toBe('2018-12-31');
});

it('2019 - This week: Monday to Monday', () => {
  const newDate = toMondayOfWeek('2019-01-09');
  expect(newDate).toBe('2019-01-07');
});

it('2019 - This week: Wednesday to Monday', () => {
  const newDate = toMondayOfWeek('2019-01-09');
  expect(newDate).toBe('2019-01-07');
});

it('2019 - Next week: Wednesday to Monday', () => {
  const newDate = toMondayOfWeek('2019-01-16');
  expect(newDate).toBe('2019-01-14');
});

it('Current - To Monday of current week', () => {
  const newDate = toMondayOfWeek();
  expect(newDate).toBe((new Date()).toISOString().split('T')[0]);
});
