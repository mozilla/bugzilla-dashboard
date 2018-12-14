import React from 'react';
import PropTypes from 'prop-types';

const linkToQuery = (key, metrics, alt) => (
  <a href={metrics[key].link} alt={alt}>{metrics[key].count}</a>
);

const BugzillaComponent = ({ product, component, metrics }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ margin: '0 1rem 0 0' }}>{`${product}::${component}`}</span>
    {metrics.untriaged
      && linkToQuery('untriaged', metrics, 'Number of untriaged bugs')
    }
  </div>
);

BugzillaComponent.propTypes = {
  product: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  metrics: PropTypes.shape({}),
};

BugzillaComponent.defaultProps = {
  metrics: {},
};

export default BugzillaComponent;
