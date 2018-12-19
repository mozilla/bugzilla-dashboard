import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChartJsWrapper from '../../components/ChartJsWrapper';
import generateChartJsData from '../../utils/bugzilla/generateChartJsData';

class BugzillaGraph extends Component {
    state = {
      data: null,
    };

    async componentDidMount() {
      this.fetchData();
    }

    async fetchData() {
      const { queries, startDate } = this.props;
      this.setState(await generateChartJsData(queries, startDate));
    }

    render() {
      const { data } = this.state;
      const { title } = this.props;

      return data ? (
        <ChartJsWrapper
          data={data}
          options={{ scaleLabel: 'Number of bugs' }}
          title={title}
        />
      ) : <div />;
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
  startDate: PropTypes.string,
  title: PropTypes.string,
};

BugzillaGraph.defaultProps = {
  startDate: null,
  title: '',
};

export default BugzillaGraph;
