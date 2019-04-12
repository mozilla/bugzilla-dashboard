const generateLineChartStyle = color => ({
  backgroundColor: color,
  borderColor: color,
  fill: false,
  pointRadius: '0',
  pointHoverBackgroundColor: 'white',
  lineTension: '0',
});

const generateScatterChartStyle = color => ({
  backgroundColor: color,
});

const generateDatasetStyle = (type, color) => (
  type === 'scatter'
    ? generateScatterChartStyle(color)
    : generateLineChartStyle(color)
);

export default generateDatasetStyle;
