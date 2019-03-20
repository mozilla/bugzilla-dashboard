import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import BugzillaComponents from '../BugzillaComponents';
import Reportees from '../Reportees';

const TabContainer = (props) => {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
};

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

    handleChange = (event, selectedTabIndex) => {
      this.setState({ value: selectedTabIndex });
    };

    renderTabContents(tabIndex) {
      const {
        ldapEmail, partialOrg, onPersonDetails, teamComponents,
        bugzillaComponents, onComponentDetails,
      } = this.props;
      switch (tabIndex) {
        case 0:
          return (
            <Reportees
              ldapEmail={ldapEmail}
              partialOrg={partialOrg}
              onPersonDetails={onPersonDetails}
            />
          );
        case 1:
          return (
            <BugzillaComponents
              bugzillaComponents={teamComponents}
              onComponentDetails={onComponentDetails}
            />
          );
        case 2:
          return (
            <BugzillaComponents
              bugzillaComponents={bugzillaComponents}
              onComponentDetails={onComponentDetails}
            />
          );
        default:
          return null;
      }
    }

    render() {
      const { classes, partialOrg, ldapEmail } = this.props;
      const { value } = this.state;

      return (
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Reportees" />
              <Tab label="Teams" />
              <Tab label="Components" />
            </Tabs>
          </AppBar>
          <h2 className={classes.header}>{partialOrg[ldapEmail].cn}</h2>
          <TabContainer>
            {this.renderTabContents(value)}
          </TabContainer>


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
