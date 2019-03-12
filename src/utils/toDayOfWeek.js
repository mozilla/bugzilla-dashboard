import moment from 'moment';

// By default it changes the day to Friday
// We're interested to know the state of bucket by the end of the week
const toDayOfWeek = (dt = moment().utc(), dayOfWeek = 5) => {
  let increment = 0;
  // isoWeekDay represents Sunday as 7 instead of 0
  const day = moment(dt).isoWeekday();
  if (day > dayOfWeek) {
    increment = 7;
  }
  return moment(dt)
    .add(increment, 'days')
    .isoWeekday(dayOfWeek)
    .format('YYYY-MM-DD');
};

export default toDayOfWeek;
