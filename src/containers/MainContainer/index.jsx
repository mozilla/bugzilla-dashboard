import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainView from '../../components/MainView';
import BugzillaComponentDetails from '../../components/BugzillaComponentDetails';
import PersonDetails from '../../components/PersonDetails';
import getAllReportees from '../../utils/getAllReportees';
import getBugzillaOwners from '../../utils/getBugzillaOwners';
import getBugsCountAndLink from '../../utils/bugzilla/getBugsCountAndLink';
import METRICS from '../../utils/bugzilla/metrics';

class MainContainer extends Component {
    state = {
      ldapEmail: '',
      bugzillaComponents: {},
      partialOrg: undefined,
      showComponent: undefined,
      showPerson: undefined,
    };

    static propTypes = {
      ldapEmail: PropTypes.string,
    };

    static defaultProps = {
      ldapEmail: '',
    };

    constructor(props) {
      super(props);
      const { ldapEmail } = this.props;
      this.state.ldapEmail = ldapEmail;
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleShowComponentDetails = this.handleShowComponentDetails.bind(this);
      this.handleShowPersonDetails = this.handleShowPersonDetails.bind(this);
      this.handleComponentBackToMenu = this.handleComponentBackToMenu.bind(this);
    }

    async componentDidMount() {
      const { ldapEmail } = this.state;
      if (ldapEmail !== '') {
        this.retrieveData(ldapEmail);
      }
    }

    async getReportees(ldapEmail) {
      const partialOrg = await getAllReportees(ldapEmail);
      this.setState({ partialOrg });
      return partialOrg;
    }

    async bugzillaComponents(bzOwners, partialOrg) {
      // bzOwners uses the bugzilla email address as the key
      // while partialOrg uses the LDAP email address
      /* eslint-disable no-param-reassign */
      const bugzillaComponents = Object.values(partialOrg)
        .reduce((result, { bugzillaEmail, mail }) => {
          const componentsOwned = bzOwners[bugzillaEmail] || bzOwners[mail];
          if (componentsOwned) {
            componentsOwned.forEach(({ product, component }) => {
              if (!result[`${product}::${component}`]) {
                result[`${product}::${component}`] = {};
              }
              result[`${product}::${component}`] = {
                bugzillaEmail: bugzillaEmail || mail,
                product,
                component,
                metrics: {},
              };
            });
          }
          return result;
        }, {});
      /* eslint-enable no-param-reassign */
      // This will list the components but will not show metrics
      this.setState({ bugzillaComponents });

      // Let's fetch the metrics for each component
      Object.values(bugzillaComponents)
        .map(async ({ product, component }) => {
          const { metrics } = bugzillaComponents[`${product}::${component}`];
          await Promise.all(Object.keys(METRICS).map(async (metric) => {
            metrics[metric] = await getBugsCountAndLink(product, component, metric);
          }));
          this.setState({ bugzillaComponents });
        });
    }

    async retrieveData(ldapEmail) {
      const [bzOwners, partialOrg] = await Promise.all([
        getBugzillaOwners(),
        this.getReportees(ldapEmail),
      ]);
      this.bugzillaComponents(bzOwners, partialOrg);
    }

    handleChange(event) {
      this.setState({
        ldapEmail: event.target.value,
        bugzillaComponents: undefined,
        partialOrg: undefined,
      });
    }

    async handleSubmit(event) {
      event.preventDefault();
      const { ldapEmail } = this.state;
      this.retrieveData(ldapEmail);
    }

    handleShowComponentDetails(event) {
      event.preventDefault();
      const product = event.target.parentElement.getAttribute('product');
      const component = event.target.parentElement.getAttribute('component');
      this.setState(prevState => ({
        showComponent: prevState.bugzillaComponents[`${product}::${component}`],
      }));
    }

    handleShowPersonDetails(event) {
      event.preventDefault();
      const ldapEmail = event.target.parentElement.getAttribute('value');
      const { bugzillaComponents, partialOrg } = this.state;
      const person = partialOrg[ldapEmail];
      const components = Object.values(bugzillaComponents)
        .filter(comp => comp.bugzillaEmail === person.bugzillaEmail);
      this.setState({
        showPerson: {
          person,
          components,
        },
      });
    }

    handleComponentBackToMenu(event) {
      event.preventDefault();
      this.setState({
        showComponent: undefined,
        showPerson: undefined,
      });
    }

    render() {
      const {
        ldapEmail, showComponent, showPerson, bugzillaComponents, partialOrg,
      } = this.state;

      return (
        <div>
          {showComponent && (
            <BugzillaComponentDetails
              {...showComponent}
              onGoBack={this.handleComponentBackToMenu}
            />
          )}
          {showPerson && (
            <PersonDetails
              {...showPerson}
              onGoBack={this.handleComponentBackToMenu}
            />
          )}
          {!showComponent && !showPerson && partialOrg && (
            <MainView
              ldapEmail={ldapEmail}
              partialOrg={partialOrg}
              bugzillaComponents={bugzillaComponents}
              onComponentDetails={this.handleShowComponentDetails}
              onPersonDetails={this.handleShowPersonDetails}
            />
          )}
        </div>
      );
    }
}

export default MainContainer;
