import React from 'react';
import PropTypes from 'prop-types';
import DetailView from '../DetailView';
import BugzillaComponents from '../BugzillaComponents';

class PersonDetails extends React.Component {
  render() {
    const { person, bugzillaComponents, onGoBack } = this.props;

    const components = Object.values(bugzillaComponents)
      .reduce((result, bzComponent) => {
        const { bugzillaEmail, product, component } = bzComponent;
        if (bugzillaEmail === person.bugzillaEmail) {
          // eslint-disable-next-line no-param-reassign
          result[`${product}::${component}`] = bzComponent;
        }
        return result;
      }, {});

    return (
      <DetailView title={person.cn} onGoBack={onGoBack}>
        <BugzillaComponents
          bugzillaComponents={components}
        />
      </DetailView>
    );
  }
}

PersonDetails.propTypes = {
  person: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.shape({}).isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default PersonDetails;
