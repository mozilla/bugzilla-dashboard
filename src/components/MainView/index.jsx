import React from 'react';
import PropTypes from 'prop-types';
import BugzillaComponents from '../BugzillaComponents';
import Reportees from '../Reportees';

class MainView extends React.Component {
  renderTabContents() {
    const {
      ldapEmail, partialOrg, onPersonDetails, teamComponents,
      bugzillaComponents, onComponentDetails, selectedTabIndex,
    } = this.props;
    switch (selectedTabIndex) {
      case 0: {
        return (
          <Reportees
            ldapEmail={ldapEmail}
            partialOrg={partialOrg}
            onPersonDetails={onPersonDetails}
          />
        );
      }
      case 1: {
        return (
          <BugzillaComponents
            bugzillaComponents={teamComponents}
            onComponentDetails={onComponentDetails}
          />
        );
      }
      case 2: {
        return (
          <BugzillaComponents
            bugzillaComponents={bugzillaComponents}
            onComponentDetails={onComponentDetails}
          />
        );
      }
      default: {
        return null;
      }
    }
  }

  render() {
    return this.renderTabContents();
  }
}

MainView.propTypes = {
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.arrayOf(PropTypes.shape({})),
  teamComponents: PropTypes.arrayOf(PropTypes.shape({})),
  onComponentDetails: PropTypes.func.isRequired,
  onPersonDetails: PropTypes.func.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
};

MainView.defaultProps = {
  bugzillaComponents: [],
  teamComponents: [],
};

export default MainView;
