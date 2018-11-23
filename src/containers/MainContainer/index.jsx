import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getAllReportees from '../../utils/getAllReportees';
import getBugzillaOwners from '../../utils/getBugzillaOwners';

const sortByPersonName = (a, b) => (a.cn <= b.cn ? -1 : 1);

const sortByComponentName = (a, b) => {
  let result = (a.product <= b.product);
  if (a.product === b.product) {
    result = a.component <= b.component;
  }
  return result ? -1 : 1;
};

class MainContainer extends Component {
    state = {
      ldapEmail: '',
      reporteesComponents: undefined,
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

    async reporteeComponents(bzOwners, partialOrg) {
      // bzOwners uses the bugzilla email address as the key
      // while partialOrg uses the LDAP email address
      const reporteesComponents = Object.values(partialOrg)
        .reduce((result, { bugzillaEmail, mail }) => {
          const componentsOwned = bzOwners[bugzillaEmail] || bzOwners[mail];
          if (componentsOwned) {
            componentsOwned.forEach(({ product, component }) => {
              result.push({
                bugzillaEmail: bugzillaEmail || mail,
                product,
                component,
              });
            });
          }
          return result;
        }, []);
      this.setState({ reporteesComponents });
    }

    async retrieveData(ldapEmail) {
      const [bzOwners, partialOrg] = await Promise.all([
        getBugzillaOwners(),
        this.getReportees(ldapEmail),
      ]);
      this.reporteeComponents(bzOwners, partialOrg);
    }

    handleChange(event) {
      this.setState({
        ldapEmail: event.target.value,
        reporteesComponents: undefined,
        partialOrg: undefined,
      });
    }

    async handleSubmit(event) {
      event.preventDefault();
      const { ldapEmail } = this.state;
      this.retrieveData(ldapEmail);
    }

    render() {
      const { ldapEmail, reporteesComponents, partialOrg } = this.state;

      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="ldapEmail">
                LDAP email address:
              <input id="ldapEmail" type="text" value={ldapEmail} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          {partialOrg && (
            <div key={ldapEmail}>
              <h3>{partialOrg[ldapEmail].cn}</h3>
              <div style={{ display: 'flex' }}>
                {partialOrg && (
                  <div style={{ margin: '0 1rem 0 0' }}>
                    <h4>Reportees</h4>
                      {Object.values(partialOrg)
                        .filter(({ cn }) => cn !== ldapEmail)
                        .sort(sortByPersonName)
                        .map(({ cn, mail }) => (
                          <div key={mail}>
                            <span>{`${cn} `}</span>
                          </div>
                        ))}
                  </div>
                )}
                {reporteesComponents && reporteesComponents.length > 0 && (
                <div>
                  <h4>Components</h4>
                  {reporteesComponents
                    .sort(sortByComponentName)
                    .map(({ product, component }) => (
                      <div key={component}>{`${product}::${component}`}</div>
                    ))}
                </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
}

export default MainContainer;
