import React from 'react';
import PropTypes from 'prop-types';
import DetailView from '../DetailView';
import BugzillaComponents from '../BugzillaComponents';

class PersonDetails extends React.Component {
  render() {
    const { person, bugzillaComponents, onGoBack } = this.props;

    // Filter out components not associated to this person
    const components = bugzillaComponents
      .reduce((result, bzComponent) => {
        const { bugzillaEmail } = bzComponent;
        if (bugzillaEmail === person.bugzillaEmail) {
          // eslint-disable-next-line no-param-reassign
          result.push(bzComponent);
        }
        return result;
      }, []);

    return (
      <DetailView title={person.cn} onGoBack={onGoBack}>
        <BugzillaComponents
          title="Components"
          bugzillaComponents={components}
        />
      </DetailView>
    );
  }
}

PersonDetails.propTypes = {
  person: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default PersonDetails;
