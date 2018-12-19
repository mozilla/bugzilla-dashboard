import queryBugzilla from './queryBugzilla';
import generateLineChartStyles from '../chartJs/generateLineChartStyles';
import COLORS from '../chartJs/colors';

const newDate = (datetime, startDate) => {
  const onlyDate = datetime.substring(0, 10);
  return startDate && (onlyDate < startDate) ? startDate : onlyDate;
};

/* eslint-disable camelcase */
// Count bugs created on each day
// startDate allow us to group bugs older than such date
const bugsPerDay = (bugs, startDate) => (
  bugs.reduce((result, { creation_time, cf_last_resolved }) => {
    const newResult = Object.assign({}, result);
    const createdDate = newDate(creation_time, startDate);
    if (!newResult[createdDate]) {
      newResult[createdDate] = 0;
    }
    newResult[createdDate] += 1;

    if (cf_last_resolved) {
      const resolvedDate = newDate(cf_last_resolved, startDate);
      if (!newResult[resolvedDate]) {
        newResult[resolvedDate] = 0;
      }
      newResult[resolvedDate] -= 1;
    }

    return newResult;
  }, {})
);
/* eslint-enable camelcase */

const bugsByCreationDate = (bugs, startDate) => {
  // Count bugs created on each day
  const byCreationDate = bugsPerDay(bugs, startDate);

  let count = 0;
  let lastDataPoint;
  const accumulatedCount = Object.keys(byCreationDate)
    .sort().reduce((result, date) => {
      count += byCreationDate[date];
      lastDataPoint = { x: date, y: count };
      result.push(lastDataPoint);
      return result;
    }, []);

  // This guarantees that the line goes all the way to the end of the graph
  const today = new Date();
  const todaysDate = `${today.getUTCFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  if (lastDataPoint.x !== todaysDate) {
    accumulatedCount.push({ x: todaysDate, y: count });
  }

  return accumulatedCount;
};

const dataFormatter = (bugSeries, startDate) => {
  const newData = { data: { datasets: [] } };

  bugSeries.forEach(({ bugs, label }, index) => {
    const bugCountPerDay = bugsByCreationDate(bugs, startDate);
    newData.data.datasets.push({
      ...generateLineChartStyles(COLORS[index]),
      data: bugCountPerDay,
      label,
    });
  });

  return newData;
};


// It formats the data and options to meet chartJs' data structures
// startDate enables counting into a starting date all previous data points
const generateChartJsData = async (queries = [], startDate) => {
  const data = await Promise.all(
    queries.map(async ({ label, parameters }) => ({
      label,
      ...(await queryBugzilla(parameters)),
    })),
  );
  return dataFormatter(data, startDate);
};

export default generateChartJsData;
