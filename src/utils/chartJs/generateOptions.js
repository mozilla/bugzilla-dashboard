const generateOptions = ({
  reverse = false, scaleLabel, title, tooltipFormat, tooltips, ticksCallback,
}) => {
  const chartJsOptions = {
    legend: {
      labels: {
        boxWidth: 10,
        fontSize: 10,
      },
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          displayFormats: { hour: 'MMM D' },
        },
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          reverse,
        },
      }],
    },
  };

  if (ticksCallback) {
    chartJsOptions.scales.yAxes[0].ticks.callback = ticksCallback;
  }

  if (title) {
    chartJsOptions.title = {
      display: true,
      text: title,
    };
  }

  if (tooltipFormat) {
    chartJsOptions.scales.xAxes[0].time.tooltipFormat = 'll';
  }

  if (tooltips) {
    chartJsOptions.tooltips = tooltips;
  }

  if (scaleLabel) {
    chartJsOptions.scales.yAxes[0].scaleLabel = {
      display: true,
      labelString: scaleLabel,
    };
  }
  return chartJsOptions;
};

export default generateOptions;
