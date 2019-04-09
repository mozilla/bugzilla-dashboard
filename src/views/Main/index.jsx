import React, { Component, Suspense } from 'react';
import AuthContext from '../../components/auth/AuthContext';
import Header from '../../components/Header';
import getAllReportees from '../../utils/getAllReportees';
import getBugzillaOwners from '../../utils/getBugzillaOwners';
import getBugsCountAndLink from '../../utils/bugzilla/getBugsCountAndLink';
import METRICS from '../../utils/bugzilla/metrics';
import TEAMS_CONFIG from '../../teamsConfig';

const BugzillaComponents = React.lazy(() => import('../../components/BugzillaComponents'));
const BugzillaComponentDetails = React.lazy(() => import('../../components/BugzillaComponentDetails'));
const PersonDetails = React.lazy(() => import('../../components/PersonDetails'));
const Reportees = React.lazy(() => import('../../components/Reportees'));

const DEFAULT_STATE = {
  bugzillaComponents: {},
  partialOrg: undefined,
  teamComponents: {},
  componentDetails: undefined,
  personDetails: undefined,
};

const VIEW_TO_TAB_INDEX = {
  reportees: 0,
  teams: 1,
  components: 2,
};

class MainContainer extends Component {
    static contextType = AuthContext;

    state = DEFAULT_STATE;

    constructor(props) {
      super(props);
      this.handleShowComponentDetails = this.handleShowComponentDetails.bind(this);
      this.handleShowPersonDetails = this.handleShowPersonDetails.bind(this);
      this.handleComponentBackToMenu = this.handleComponentBackToMenu.bind(this);
    }

    componentDidMount() {
      const { context } = this;
      if (context) {
        context.on(
          'user-session-changed',
          this.handleUserSessionChanged,
        );
        this.fetchData();
      }
    }

    componentWillUnmount() {
      const { context } = this.context;
      if (context) {
        context.off(
          'user-session-changed',
          this.handleUserSessionChanged,
        );
      }
    }

    async getReportees(userSession, ldapEmail) {
      const secretsClient = userSession.getTaskClusterSecretsClient();
      const partialOrg = await getAllReportees(secretsClient, ldapEmail);
      this.setState({ partialOrg });
      return partialOrg;
    }

    handleUserSessionChanged = () => {
      this.fetchData();
    };

    handleNavigateAndClear = () => {
      this.setState({
        componentDetails: undefined,
        personDetails: undefined,
      });
    };

    fetchData() {
      const { context } = this;
      const userSession = context && context.getUserSession();
      if (userSession) {
        const { location } = this.props;
        const ldapEmail = new URLSearchParams(location.search).get('ldapEmail') || (userSession && userSession.email);
        this.setState({ ldapEmail });
        this.retrieveData(userSession, ldapEmail);
      } else {
        this.setState(DEFAULT_STATE);
      }
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
          componentDetails: {
            title: prevState.teamComponents[teamKey].label,
            ...prevState.teamComponents[teamKey],
          },
        }));
      } else {
        this.setState(prevState => ({
          componentDetails: {
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
        personDetails: partialOrg[properties.ldapEmail],
      });
    }

    handleComponentBackToMenu(event) {
      event.preventDefault();
      this.setState({
        componentDetails: undefined,
        personDetails: undefined,
      });
    }

    render() {
      const {
        componentDetails,
        personDetails,
        bugzillaComponents,
        ldapEmail,
        partialOrg,
        teamComponents,
      } = this.state;
      const { context } = this;
      const userSession = context.getUserSession();
      const { match } = this.props;
      const view = match.params.view || 'reportees';

      return (
        <div>
          <Header
            selectedTabIndex={VIEW_TO_TAB_INDEX[view]}
            handleTabChange={this.handleNavigateAndClear}
          />
          {!userSession && <h3>Please sign in</h3>}
          {componentDetails && (
            <Suspense fallback={<div>Loading...</div>}>
              <BugzillaComponentDetails
                {...componentDetails}
                onGoBack={this.handleComponentBackToMenu}
              />
            </Suspense>
          )}
          {personDetails && (
            <Suspense fallback={<div>Loading...</div>}>
              <PersonDetails
                person={personDetails}
                bugzillaComponents={Object.values(bugzillaComponents)}
                onGoBack={this.handleComponentBackToMenu}
              />
            </Suspense>
          )}
          {view === 'reportees' && partialOrg && (
            <Suspense fallback={<div>Loading...</div>}>
              <Reportees
                ldapEmail={ldapEmail}
                partialOrg={partialOrg}
                onPersonDetails={this.handleShowPersonDetails}
              />
            </Suspense>
          )}
          {view === 'teams' && (
            <Suspense fallback={<div>Loading...</div>}>
              <BugzillaComponents
                bugzillaComponents={Object.values(teamComponents)}
                onComponentDetails={this.handleShowComponentDetails}
              />
            </Suspense>
          )}
          {view === 'components' && partialOrg && (
            <Suspense fallback={<div>Loading...</div>}>
              <BugzillaComponents
                bugzillaComponents={Object.values(bugzillaComponents)}
                onComponentDetails={this.handleShowComponentDetails}
              />
            </Suspense>
          )}
        </div>
      );
    }
}

export default MainContainer;
