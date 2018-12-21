import React from 'react';
import PropTypes from 'prop-types';
import DetailView from '../DetailView';

const PersonDetails = ({ person, components, onGoBack }) => (
  <DetailView title={person.cn} onGoBack={onGoBack}>
    <div>
      <h3>Components owned</h3>
      {components.map(({ product, component }) => (
        <div key={`${product}::${component}`}>
          <span>{`${product}::${component}`}</span>
        </div>
      ))}
    </div>
  </DetailView>
);

PersonDetails.propTypes = {
  person: PropTypes.shape({}).isRequired,
  components: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default PersonDetails;
