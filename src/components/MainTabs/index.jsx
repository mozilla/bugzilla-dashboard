import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import BugzillaComponents from '../BugzillaComponents';
import Reportees from '../Reportees';
import CredentialsMenu from '../../views/CredentialsMenu';

const TabContainer = (props) => {
  const { children } = props;
  return (
    <Typography component="div" style={{ padding: 4 }}>
      {children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  grow: {
    flexGrow: 1,
  },
  styledToolbar: {
    'min-height': 48,
  },
});

class MainTabs extends React.Component {
    state = {
      selectedTabIndex: 0,
    };

    handleChange = (event, selectedTabIndex) => {
      this.setState({ selectedTabIndex });
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
      const { classes } = this.props;
      const { selectedTabIndex } = this.state;

      return (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar className={classes.styledToolbar}>
              <Tabs value={selectedTabIndex} onChange={this.handleChange}>
                <Tab label="Reportees" />
                <Tab label="Teams" />
                <Tab label="Components" />
              </Tabs>
              <div className={classes.grow} />
              <CredentialsMenu />
            </Toolbar>
          </AppBar>
          <TabContainer>
            {this.renderTabContents(selectedTabIndex)}
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
