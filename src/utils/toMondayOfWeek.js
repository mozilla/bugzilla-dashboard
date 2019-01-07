import moment from 'moment';

const toMondayOfWeek = (dt = new Date()) => moment(dt).isoWeekday(1).format('YYYY-MM-DD');

export default toMondayOfWeek;
