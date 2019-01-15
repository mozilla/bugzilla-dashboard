import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainView from '../../components/MainView';
import BugzillaComponentDetails from '../../components/BugzillaComponentDetails';
import PersonDetails from '../../components/PersonDetails';
import getAllReportees from '../../utils/getAllReportees';
import getBugzillaOwners from '../../utils/getBugzillaOwners';
import getBugsCountAndLink from '../../utils/bugzilla/getBugsCountAndLink';
import METRICS from '../../utils/bugzilla/metrics';
import TEAMS_CONFIG from '../../teamsConfig';

class MainContainer extends Component {
    state = {
      ldapEmail: '',
      bugzillaComponents: {},
      partialOrg: undefined,
      teamComponents: {},
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
                label: `${product}::${component}`,
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
            metrics[metric].label = METRICS[metric].label;
          }));
          this.setState({ bugzillaComponents });
        });
    }

    async retrieveData(ldapEmail) {
      const [bzOwners, partialOrg] = await Promise.all([
        getBugzillaOwners(),
        this.getReportees(ldapEmail),
      ]);
      this.teamsData();
      this.bugzillaComponents(bzOwners, partialOrg);
    }

    async teamsData() {
      const teamComponents = Object.assign({}, TEAMS_CONFIG);
      // This will cause the teams to be displayed before having any metrics
      this.setState({ teamComponents });
      Object.entries(teamComponents).map(async ([teamKey, teamInfo]) => {
        const team = {
          teamKey,
          ...teamInfo,
          metrics: {},
        };
        const { product, component } = teamInfo;
        await Promise.all(Object.keys(METRICS).map(async (metric) => {
          team.metrics[metric] = await getBugsCountAndLink(product, component, metric);
        }));
        teamComponents[teamKey] = team;
        this.setState({ teamComponents });
      });
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
      const element = event.target.tagName === 'DIV' ? event.target : event.target.parentElement;
      // IDEA: In the future we could unify bugzilla components and teams into
      // the same data structure and make this logic simpler. We could use a
      // property 'team' to distinguish a component from a set of components
      const bzComponentKey = element.getAttribute('bzcomponentkey');
      const teamKey = element.getAttribute('teamkey');
      if (teamKey) {
        this.setState(prevState => ({
          showComponent: {
            title: prevState.teamComponents[teamKey].label,
            ...prevState.teamComponents[teamKey],
          },
        }));
      } else {
        this.setState(prevState => ({
          showComponent: {
            title: bzComponentKey,
            ...prevState.bugzillaComponents[bzComponentKey],
          },
        }));
      }
    }

    handleShowPersonDetails(event) {
      event.preventDefault();
      const element = event.target.tagName === 'DIV' ? event.target : event.target.parentElement;
      const ldapEmail = element.getAttribute('value');
      const { partialOrg } = this.state;
      this.setState({
        showPerson: partialOrg[ldapEmail],
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
        ldapEmail, showComponent, showPerson, bugzillaComponents, partialOrg, teamComponents,
      } = this.state;

      return (
        <div>
          {showComponent && (
            <BugzillaComponentDetails
              {...showComponent}
              title={showComponent.title}
              onGoBack={this.handleComponentBackToMenu}
            />
          )}
          {showPerson && (
            <PersonDetails
              person={showPerson}
              bugzillaComponents={Object.values(bugzillaComponents)}
              onGoBack={this.handleComponentBackToMenu}
            />
          )}
          {!showComponent && !showPerson && partialOrg && (
            <MainView
              ldapEmail={ldapEmail}
              partialOrg={partialOrg}
              bugzillaComponents={Object.values(bugzillaComponents)}
              teamComponents={Object.values(teamComponents)}
              onComponentDetails={this.handleShowComponentDetails}
              onPersonDetails={this.handleShowPersonDetails}
            />
          )}
        </div>
      );
    }
}

export default MainContainer;
