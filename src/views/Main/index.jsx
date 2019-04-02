import React, { Component } from 'react';
import AuthContext from '../../components/auth/AuthContext';
import Header from '../../components/Header';
import MainView from '../../components/MainView';
import BugzillaComponentDetails from '../../components/BugzillaComponentDetails';
import PersonDetails from '../../components/PersonDetails';
import getAllReportees from '../../utils/getAllReportees';
import getBugzillaOwners from '../../utils/getBugzillaOwners';
import getBugsCountAndLink from '../../utils/bugzilla/getBugsCountAndLink';
import METRICS from '../../utils/bugzilla/metrics';
import TEAMS_CONFIG from '../../teamsConfig';

class MainContainer extends Component {
    static contextType = AuthContext;

    state = {
      bugzillaComponents: {},
      partialOrg: undefined,
      teamComponents: {},
      selectedTabIndex: 0,
      showComponent: undefined,
      showPerson: undefined,
    };

    constructor(props) {
      super(props);
      this.handleShowComponentDetails = this.handleShowComponentDetails.bind(this);
      this.handleShowPersonDetails = this.handleShowPersonDetails.bind(this);
      this.handleComponentBackToMenu = this.handleComponentBackToMenu.bind(this);
      this.handleChangeSelectedTab = this.handleChangeSelectedTab.bind(this);
    }

    async componentDidMount() {
      const { context } = this;
      const userSession = context.getUserSession();
      if (userSession) {
        this.retrieveData(userSession, userSession.email);
      }
    }

    async getReportees(userSession, ldapEmail) {
      const secretsClient = userSession.getTaskClusterSecretsClient();
      const partialOrg = await getAllReportees(secretsClient, ldapEmail);
      this.setState({ partialOrg });
      return partialOrg;
    }

    handleChangeSelectedTab = (event, selectedTabIndex) => {
      this.setState({ selectedTabIndex });
    };

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

    async retrieveData(userSession, ldapEmail) {
      const [bzOwners, partialOrg] = await Promise.all([
        getBugzillaOwners(),
        this.getReportees(userSession, ldapEmail),
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

    handleShowComponentDetails(event, properties) {
      event.preventDefault();
      const { componentKey, teamKey } = properties;
      // IDEA: In the future we could unify bugzilla components and teams into
      // the same data structure and make this logic simpler. We could use a
      // property 'team' to distinguish a component from a set of components
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
            title: componentKey,
            ...prevState.bugzillaComponents[componentKey],
          },
        }));
      }
    }

    handleShowPersonDetails(event, properties) {
      event.preventDefault();
      const { partialOrg } = this.state;
      this.setState({
        showPerson: partialOrg[properties.ldapEmail],
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
        showComponent,
        showPerson,
        bugzillaComponents,
        partialOrg,
        teamComponents,
        selectedTabIndex,
      } = this.state;
      const { context } = this;
      const userSession = context.getUserSession();

      return (
        <div>
          <Header
            selectedTabIndex={selectedTabIndex}
            handleTabChange={this.handleChangeSelectedTab}
          />
          {!userSession && <h3>Please sign in</h3>}
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
          {!showComponent && !showPerson && partialOrg && userSession && (
            <MainView
              ldapEmail={userSession.email}
              partialOrg={partialOrg}
              bugzillaComponents={Object.values(bugzillaComponents)}
              teamComponents={Object.values(teamComponents)}
              onComponentDetails={this.handleShowComponentDetails}
              onPersonDetails={this.handleShowPersonDetails}
              selectedTabIndex={selectedTabIndex}
            />
          )}
        </div>
      );
    }
}

export default MainContainer;
