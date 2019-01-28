import moment from 'moment';
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
  const myTempDate = moment().utc();
  const distance = 5 - myTempDate.day(); // 5 represents Friday
  myTempDate.date(myTempDate.date() + distance);
  expect(moment(myTempDate.format('YYYY-MM-DD')).isSame(newDate)).toBe(true);
});
