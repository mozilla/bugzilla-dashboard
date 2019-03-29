import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MainTabs from '../MainTabs';

const styles = ({
  content: {
    display: 'flex',
  },
  header: {
    margin: '0.5rem 0 0 0',
  },
});

const MainView = ({
  ldapEmail, partialOrg, bugzillaComponents, teamComponents,
  onComponentDetails, onPersonDetails,
}) => (
  <div>
    <MainTabs
      ldapEmail={ldapEmail}
      partialOrg={partialOrg}
      onPersonDetails={onPersonDetails}
      teamComponents={teamComponents}
      onComponentDetails={onComponentDetails}
      bugzillaComponents={bugzillaComponents}
    />
  </div>
);

MainView.propTypes = {
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.arrayOf(PropTypes.shape({})),
  teamComponents: PropTypes.arrayOf(PropTypes.shape({})),
  onComponentDetails: PropTypes.func.isRequired,
  onPersonDetails: PropTypes.func.isRequired,
};

MainView.defaultProps = {
  bugzillaComponents: [],
  teamComponents: [],
};

export default withStyles(styles)(MainView);
