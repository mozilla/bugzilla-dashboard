import React, { Component } from 'react';
import { parse } from 'query-string';
import PropTypes from 'prop-types';
import BugzillaGraph from '../../containers/BugzillaGraph';
import { BZ_QUERIES } from '../../config';
// import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
// import ChartJsWrapper from '../../components/ChartJsWrapper';
// import generateChartJsData from '../../utils/bugzilla/generateChartJsData';

const constructQuery = (metrics, product, component) => (
  Object.values(metrics).map((metric) => {
    const { label, parameters } = metric;
    // We need all bugs regardless of their resolution in order to decrease/increase
    // the number of open bugs per date
    delete parameters.resolution;
    return {
      label,
      parameters: {
        product,
        component,
        ...parameters,
      },
    };
  })
);

class BugzillaDetails extends Component {
  constructor(props) {
    super(props);
    const { product, component, location } = props;
    const parameters = parse(location.search);
    this.state = {
      product: parameters.product || product,
      component: parameters.component || component,
    };
  }

  render() {
    const { product, component } = this.state;

    return (
      <div>
        {/* {bugzillaComponents
          .sort(sortByComponentName)
          .map(({
            label, component, product, metrics = {}, teamKey = null,
          }) => (
            <tr key={label}>
              {onComponentDetails && (
                <td>
                  <DrilldownIcon
                    name={label}
                    onChange={onComponentDetails}
                    properties={{
                      componentKey: `${product}::${component}`,
                      teamKey,
                    }}
                  />
                </td>
              )}
              <td>{label}</td>
              {Object.keys(BZ_QUERIES).map(metric => (
                metrics[metric] && (
                <td key={metric} className={classes.metric}>
<a href={metrics[metric].link} target="_blank" rel="noopener noreferrer">{metrics[metric].count}</a>
                </td>
                )
              ))}
            </tr>
          ))} */}
        {product && component && (
          <BugzillaGraph
            title={`${product}::${component}`}
            queries={constructQuery(BZ_QUERIES, product, component)}
          />
        )}
      </div>
    );
  }
}

BugzillaDetails.propTypes = {
  location: PropTypes.shape({}),
  product: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  component: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
};
BugzillaDetails.defaultProps = {
  location: undefined,
  product: undefined,
  component: undefined,
};
// BugzillaDetails.propTypes = {
//   queries: PropTypes.arrayOf(PropTypes.shape({
//     label: PropTypes.string.isRequired,
//     parameters: PropTypes.shape({
//       include_fields: PropTypes.string,
//       component: PropTypes.oneOfType([
//         PropTypes.arrayOf(PropTypes.string),
//         PropTypes.string,
//       ]),
//       resolution: PropTypes.string,
//       priority: PropTypes.string,
//     }),
//   })).isRequired,
//   chartType: PropTypes.oneOf(['scatter', 'line']),
//   startDate: PropTypes.string,
//   title: PropTypes.string,
// };

// BugzillaDetails.defaultProps = {
//   chartType: 'line',
//   startDate: null,
//   title: '',
// };

export default BugzillaDetails;
