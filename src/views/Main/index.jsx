import pako from 'pako';
import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PropsRoute from '../../components/PropsRoute';
import AuthContext from '../../components/auth/AuthContext';
import Header from '../../components/Header';
import getAllReportees from '../../utils/getAllReportees';
import getBugzillaOwners from '../../utils/getBugzillaOwners';
import getBugsCountAndLink from '../../utils/bugzilla/getBugsCountAndLink';
import CONFIG, { REPORTEES_CONFIG, TEAMS_CONFIG, PRODUCT_COMPONENT } from '../../config';
import loadArtifact from '../../utils/artifacts';

const BugzillaComponents = React.lazy(() => import('../../components/BugzillaComponents'));
const BugzillaComponentDetails = React.lazy(() => import('../../components/BugzillaComponentDetails'));
const Reportees = React.lazy(() => import('../../components/Reportees'));
const Teams = React.lazy(() => import('../Teams'));

const DEFAULT_STATE = {
  doneLoading: undefined,
  bugzillaComponents: {},
  partialOrg: undefined,
  teamComponents: {},
  selectedTabIndex: 0,
  reporteesMetrics: {},
  componentDetails: undefined,
  userId: '',
};

const PATHNAME_TO_TAB_INDEX = {
  '/reportees': 0,
  '/components': 1,
  '/teams': 2,
};

const styles = ({
  content: {
    padding: '1rem 2rem',
    margin: '0 auto',
  },
});

class MainContainer extends Component {
    static contextType = AuthContext;

    state = DEFAULT_STATE;

    constructor(props) {
      super(props);
      const { location } = this.props;
      // This guarantees that we load the right tab based on the URL's pathname
      this.state.selectedTabIndex = PATHNAME_TO_TAB_INDEX[location.pathname] || 0;
      this.handleShowComponentDetails = this.handleShowComponentDetails.bind(this);
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

    async getReportees(userSession, userId) {
      const partialOrg = await getAllReportees(userSession, userId);
      this.setState({ partialOrg });
      return partialOrg;
    }

    handleUserSessionChanged = () => {
      this.fetchData();
    };

    handleNavigateAndClear = (_, selectedTabIndex) => {
      this.setState({
        componentDetails: undefined,
        selectedTabIndex,
      });
    };

    fetchData() {
      const { context } = this;
      const userSession = context && context.getUserSession();
      if (userSession) {
        // We show the spinner after having signed in
        this.setState({ doneLoading: false });
        const { location } = this.props;
        const userId = new URLSearchParams(location.search).get('userId') || userSession.userId;
        this.setState({ userId });
        this.retrieveData(userSession, userId);
      } else {
        this.setState(DEFAULT_STATE);
      }
    }

    async bugzillaComponents(userSession, bzOwners, partialOrg) {
      // bzOwners uses the bugzilla email address as the key
      // while partialOrg uses the LDAP email address
      /* eslint-disable no-param-reassign */
      const bugzillaComponents = Object.values(partialOrg)
        .reduce((result, { bugzillaEmail, mail }) => {
          const componentsOwned = bzOwners[bugzillaEmail] || bzOwners[mail];
          if (componentsOwned) {
            componentsOwned.forEach(({ product, component }) => {
              const prodComp = `${product}::${component}`;
              result[prodComp] = {
                label: prodComp,
                bugzillaEmail: bugzillaEmail || mail,
                // product/component are still used in BugzillaComponentDetails
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

      loadArtifact(
        userSession,
        CONFIG.artifactRoute,
        CONFIG.productComponentMetrics,
      ).then(
        (jsonGz) => {
          const json = pako.inflate(jsonGz, { to: 'string' });
          return JSON.parse(json);
        },
      ).then(
        (data) => {
          Object.entries(bugzillaComponents)
            .forEach(([prodComp, { metrics }]) => {
              const stats = data[prodComp] || { prodComp: {} };
              const metricz = metrics;
              Object.keys(PRODUCT_COMPONENT).forEach((metric) => {
                metricz[metric] = stats[metric] || { count: 0, link: '' };
              });
            });
          this.setState({ bugzillaComponents });
        },
      );
    }

    async reporteesMetrics(userSession, partialOrg) {
      loadArtifact(
        userSession,
        CONFIG.artifactRoute,
        CONFIG.reporteesMetrics,
      ).then(
        (jsonGz) => {
          const json = pako.inflate(jsonGz, { to: 'string' });
          return JSON.parse(json);
        },
      ).then(
        (data) => {
          const reporteesMetrics = {};
          Object.values(partialOrg)
            .forEach(({ bugzillaEmail }) => {
              const stats = data[bugzillaEmail] || {};
              Object.keys(REPORTEES_CONFIG).forEach((name) => {
                if (!Object.prototype.hasOwnProperty.call(stats, name)) {
                  stats[name] = { count: 0, link: '' };
                }
              });
              reporteesMetrics[bugzillaEmail] = stats;
            });
          this.setState({ reporteesMetrics });
        },
      );
    }

    async retrieveData(userSession, userId) {
      const [bzOwners, partialOrg] = await Promise.all([
        getBugzillaOwners(),
        this.getReportees(userSession, userId),
      ]);
      // Fetch this data first since it's the landing tab
      await this.reporteesMetrics(userSession, partialOrg);
      this.teamsData(userSession, partialOrg);
      this.bugzillaComponents(userSession, bzOwners, partialOrg);
      this.setState({ doneLoading: true });
    }

    async teamsData(userSession, partialOrg) {
      let teamComponents = {};
      if (userSession.oidcProvider === 'mozilla-auth0') {
        // if non-LDAP user, get fake data
        teamComponents = TEAMS_CONFIG;
      } else {
        // LDAP user, get the actual data
        Object.entries(TEAMS_CONFIG).map(async ([teamKey, teamInfo]) => {
          if (partialOrg[teamInfo.owner]) {
            const team = {
              teamKey,
              ...teamInfo,
              metrics: {},
            };
            const { product, component } = teamInfo;
            await Promise.all(Object.keys(PRODUCT_COMPONENT).map(async (metric) => {
              const parameters = { product, component, ...PRODUCT_COMPONENT[metric].parameters };
              team.metrics[metric] = await getBugsCountAndLink(parameters);
            }));
            teamComponents[teamKey] = team;
          }
        });
      }
      this.setState({ teamComponents });
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

    handleComponentBackToMenu(event) {
      event.preventDefault();
      this.setState({
        componentDetails: undefined,
      });
    }

    render() {
      const {
        doneLoading,
        componentDetails,
        bugzillaComponents,
        userId,
        partialOrg,
        teamComponents,
        selectedTabIndex,
        reporteesMetrics,
      } = this.state;
      const { classes } = this.props;
      const { context } = this;
      const userSession = context.getUserSession();

      return (
        <div>
          <Header
            userId={userId}
            selectedTabIndex={selectedTabIndex}
            handleTabChange={this.handleNavigateAndClear}
          />
          <div className={classes.content}>
            {!userSession && <h3>Please sign in</h3>}
            {componentDetails && (
              <Suspense fallback={<div>Loading...</div>}>
                <BugzillaComponentDetails
                  {...componentDetails}
                  onGoBack={this.handleComponentBackToMenu}
                />
              </Suspense>
            )}
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                {partialOrg && (
                  <PropsRoute
                    path="/reportees"
                    component={Reportees}
                    userId={userId}
                    partialOrg={partialOrg}
                    metrics={reporteesMetrics}
                  />
                )}
                {partialOrg && (
                  <PropsRoute
                    path="/components"
                    component={BugzillaComponents}
                    bugzillaComponents={Object.values(bugzillaComponents)}
                    onComponentDetails={this.handleShowComponentDetails}
                  />
                )}
                <PropsRoute
                  path="/teams"
                  component={Teams}
                  bugzillaComponents={Object.values(teamComponents)}
                  onComponentDetails={this.handleShowComponentDetails}
                />
              </Switch>
            </Suspense>
            {doneLoading === false && <Spinner loading /> }
          </div>
          <BottomNavigation
            showLabels
          >
            <BottomNavigationAction label="Sources" href="https://github.com/mozilla/bugzilla-dashboard/" />
            <BottomNavigationAction label="New issue?" href="https://github.com/mozilla/bugzilla-dashboard/issues/new" />
          </BottomNavigation>
        </div>
      );
    }
}

MainContainer.propTypes = {
  classes: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
};

export default withStyles(styles)(MainContainer);
