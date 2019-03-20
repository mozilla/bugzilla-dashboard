import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import BugzillaComponents from '../BugzillaComponents';
import Reportees from '../Reportees';

function TabContainer(props) {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class MainTabs extends React.Component {
    state = {
      value: 0,
    };

    handleChange = (event, value) => {
      this.setState({ value });
    };

    render() {
      const {
        classes, ldapEmail, partialOrg, onPersonDetails, teamComponents,
        bugzillaComponents, onComponentDetails,
      } = this.props;
      const { value } = this.state;

      return (
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="People" />
              <Tab label="Teams" />
              <Tab label="Components" />
            </Tabs>
          </AppBar>
          {value === 0 && (
            <TabContainer>
              <Reportees
                ldapEmail={ldapEmail}
                partialOrg={partialOrg}
                onPersonDetails={onPersonDetails}
              />
            </TabContainer>
          )}

          {value === 1 && (
            <TabContainer>
              <BugzillaComponents
                title="Teams"
                bugzillaComponents={teamComponents}
                onComponentDetails={onComponentDetails}
              />
            </TabContainer>
          )}

          {value === 2 && (
            <TabContainer>
              <BugzillaComponents
                title="Components"
                bugzillaComponents={bugzillaComponents}
                onComponentDetails={onComponentDetails}
              />
            </TabContainer>
          )}
        </div>
      );
    }
}

MainTabs.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.arrayOf(PropTypes.shape({})),
  teamComponents: PropTypes.arrayOf(PropTypes.shape({})),
  onComponentDetails: PropTypes.func.isRequired,
  onPersonDetails: PropTypes.func.isRequired,
};

MainTabs.defaultProps = {
  bugzillaComponents: [],
  teamComponents: [],
};

export default withStyles(styles)(MainTabs);
