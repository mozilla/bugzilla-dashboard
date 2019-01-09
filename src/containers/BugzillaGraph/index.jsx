import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import generateChartJsData from '../../utils/bugzilla/generateChartJsData';

class BugzillaGraph extends Component {
    state = {
      data: null,
      error: '',
    };

    async componentDidMount() {
      this.fetchData();
    }

    async fetchData() {
      const { queries, chartType, startDate } = this.props;
      try {
        this.setState(await generateChartJsData(queries, chartType, startDate));
      } catch (error) {
        this.setState({ error: error.message });
      }
    }

    render() {
      const { data, error } = this.state;
      const { chartType, title } = this.props;

      return (
        error ? <ErrorPanel error={error} /> : (
          <ChartJsWrapper
            type={chartType}
            data={data}
            options={{ scaleLabel: '# of bugs' }}
            title={title}
          />
        )
      );
    }
}

BugzillaGraph.propTypes = {
  queries: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    parameters: PropTypes.shape({
      include_fields: PropTypes.string,
      component: PropTypes.string,
      resolution: PropTypes.string,
      priority: PropTypes.string,
    }),
  })).isRequired,
  chartType: PropTypes.oneOf(['scatter', 'line']),
  startDate: PropTypes.string,
  title: PropTypes.string,
};

BugzillaGraph.defaultProps = {
  chartType: 'line',
  startDate: null,
  title: '',
};

export default BugzillaGraph;
