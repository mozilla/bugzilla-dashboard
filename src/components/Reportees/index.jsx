import React from 'react';
import PropTypes from 'prop-types';

const sortByPersonName = (a, b) => (a.cn <= b.cn ? -1 : 1);

const Reportees = ({ ldapEmail, partialOrg }) => (
  <div style={{ margin: '0 1rem 0 0' }}>
    <h4>Reportees</h4>
    {Object.values(partialOrg)
      .filter(({ cn }) => cn !== ldapEmail)
      .sort(sortByPersonName)
      .map(({ cn, mail }) => (
        <div key={mail}>
          <span>{`${cn} `}</span>
        </div>
      ))}
  </div>
);

Reportees.propTypes = {
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
};

export default Reportees;
