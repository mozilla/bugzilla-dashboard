import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainView from '../../components/MainView';
import getAllReportees from '../../utils/getAllReportees';
import getBugzillaOwners from '../../utils/getBugzillaOwners';
import getBugsCountAndLink from '../../utils/bugzilla/getBugsCountAndLink';

class MainContainer extends Component {
    state = {
      ldapEmail: '',
      bugzillaComponents: undefined,
      partialOrg: undefined,
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
      this.state = { ldapEmail };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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
          const metric = 'untriaged';
          const { count, link } = await getBugsCountAndLink(product, component, metric);
          bugzillaComponents[`${product}::${component}`].metrics = {
            [metric]: {
              count,
              link,
            },
          };
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

    render() {
      const {
        ldapEmail, bugzillaComponents, partialOrg,
      } = this.state;

      return (
        <div>
          {partialOrg && (
            <MainView
              ldapEmail={ldapEmail}
              partialOrg={partialOrg}
              bugzillaComponents={bugzillaComponents}
            />
          )}
        </div>
      );
    }
}

export default MainContainer;
