import queryBugzilla from './queryBugzilla';
import generateDatasetStyle from '../chartJs/generateDatasetStyle';
import toDayOfWeek from '../toDayOfWeek';
import COLORS from '../chartJs/colors';

/* eslint-disable camelcase */
// Count bugs created/closed each week
// startDate allow us to group bugs older than such date
const bugsGroupedByWeek = (bugs, startDate) => (
  bugs.reduce((result, { creation_time, cf_last_resolved }) => {
    const newResult = Object.assign({}, result);
    const createdDate = toDayOfWeek(creation_time, startDate);
    if (!newResult[createdDate]) {
      newResult[createdDate] = 0;
    }
    newResult[createdDate] += 1;

    if (cf_last_resolved) {
      const resolvedDate = toDayOfWeek(cf_last_resolved, startDate);
      if (!newResult[resolvedDate]) {
        newResult[resolvedDate] = 0;
      }
      newResult[resolvedDate] -= 1;
    }

    return newResult;
  }, {})
);
/* eslint-enable camelcase */

const sortDates = (a, b) => new Date(a) - new Date(b);

const bugsByCreationDate = (bugs, startDate) => {
  // Count bugs created on each week
  const byCreationDate = bugsGroupedByWeek(bugs, startDate);

  let count = 0;
  let lastDataPoint;
  const accumulatedCount = Object.keys(byCreationDate)
    .sort(sortDates).reduce((result, date) => {
      count += byCreationDate[date];
      // Read more here http://momentjs.com/guides/#/warnings/js-date/
      lastDataPoint = { x: new Date(date), y: count };
      result.push(lastDataPoint);
      return result;
    }, []);

  // This guarantees that the line goes all the way to the end of the graph
  const today = toDayOfWeek();
  if (lastDataPoint.x !== today) {
    accumulatedCount.push({ x: new Date(today), y: count });
  }

  return accumulatedCount;
};

const dataFormatter = (bugSeries, chartType, startDate) => {
  const newData = { data: { datasets: [] } };

  bugSeries.forEach(({ bugs, label }, index) => {
    const bugCountPerDay = bugsByCreationDate(bugs, startDate);
    newData.data.datasets.push({
      ...generateDatasetStyle(chartType, COLORS[index]),
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
