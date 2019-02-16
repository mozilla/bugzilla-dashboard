import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import BugPanel from './BugPanel';
import userReports from '../../reports.graphql';
import domCore from '../../queries/domCore';
import domFission from '../../queries/domFission';
import workerStorage from '../../queries/workerStorage';

export default
@hot(module)
@withStyles(theme => ({
  root: {
    margin: theme.spacing.unit * 3,
  },
}))
class Home extends Component {
  render() {
    const storedCredentials = localStorage.getItem('credentials');

    if (!storedCredentials) {
      return <Redirect to="/login" />;
    }

    const { classes } = this.props;
    const credentials = JSON.parse(storedCredentials);

    return (
      <div className={classes.root}>
        <Typography gutterBottom variant="h4">
          Reports
        </Typography>
        <Query
          query={userReports}
          variables={{ user: credentials.idTokenPayload.email }}>
          {({ loading, error, data }) =>
            !loading &&
            !error &&
            data &&
            data.reports.map(user => (
              <BugPanel
                key={`bug-row-${user.mail}`}
                name={user.name}
                search={{
                  assignedTos: [user.bugzillaEmail || user.mail],
                }}
              />
            ))
          }
        </Query>

        <br />
        <br />
        <Divider />
        <br />

        <Typography gutterBottom variant="h4">
          Teams
        </Typography>
        <BugPanel name="DOM Core" search={domCore} />
        <BugPanel name="DOM Fission" search={domFission} />
        <BugPanel name="Worker & Storage" search={workerStorage} />

        <br />
        <br />
        <Divider />
        <br />

        <Typography gutterBottom variant="h4">
          Components: Core
        </Typography>
        {domCore.components.map(component => (
          <BugPanel
            key={`bug-row-${component}`}
            name={component}
            search={{ products: ['Core'], components: [component] }}
          />
        ))}

        <br />
        <br />
        <Divider />
      </div>
    );
  }
}
