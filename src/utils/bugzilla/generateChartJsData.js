import queryBugzilla from './queryBugzilla';
import generateDatasetStyle from '../chartJs/generateDatasetStyle';
import toDayOfWeek from '../toDayOfWeek';
import COLORS from '../chartJs/colors';

/* eslint-disable camelcase */
// Count bugs created/closed each week
// startDate allow us to group bugs older than such date
const bugsGroupedByWeek = bugs => (
  bugs.reduce((result, { creation_time, cf_last_resolved }) => {
    const newResult = Object.assign({}, result);
    const createdDate = toDayOfWeek(creation_time);
    if (!newResult[createdDate]) {
      newResult[createdDate] = 0;
    }
    newResult[createdDate] += 1;

    if (cf_last_resolved) {
      const resolvedDate = toDayOfWeek(cf_last_resolved);
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

const bugsByCreationDate = (bugs) => {
  // Count bugs created on each week
  const byCreationDate = bugsGroupedByWeek(bugs);

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

  return accumulatedCount;
};

// It formats the data and options to meet chartJs' data structures
// startDate enables counting into a starting date all previous data points
const generateChartJsData = async (queries = [], chartType, startDate) => {
  const datasets = [];
  await Promise.all(
    queries.map(async ({ label, parameters }, index) => {
      const { bugs } = await queryBugzilla(parameters);
      if (bugs.length > 0) {
        datasets.push({
          ...generateDatasetStyle(chartType, COLORS[index]),
          data: bugsByCreationDate(bugs, startDate),
          label,
        });
      }
    }),
  );
  return datasets;
};

export default generateChartJsData;
