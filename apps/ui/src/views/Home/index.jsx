import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import BugRow from './BugRow';
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
  paper: {
    overflowX: 'auto',
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
            data && (
              <Paper className={classes.paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Untriaged</TableCell>
                      <TableCell align="right">Needinfos</TableCell>
                      <TableCell align="right">P1s</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.reports.map(user => (
                      <BugRow
                        key={`bug-row-${user.mail}`}
                        name={user.name}
                        search={{
                          assignedTos: [user.bugzillaEmail || user.mail],
                        }}
                      />
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )
          }
        </Query>

        <br />
        <br />
        <Divider />
        <br />

        <Typography gutterBottom variant="h4">
          Teams
        </Typography>
        <Paper className={classes.paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell align="right">Untriaged</TableCell>
                <TableCell align="right">Needinfos</TableCell>
                <TableCell align="right">P1s</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <BugRow name="DOM Core" search={domCore} />
              <BugRow name="DOM Fission" search={domFission} />
              <BugRow name="Worker and Storage" search={workerStorage} />
            </TableBody>
          </Table>
        </Paper>

        <br />
        <br />
        <Divider />
        <br />

        <Typography gutterBottom variant="h4">
          Components
        </Typography>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell align="right">Untriaged</TableCell>
                <TableCell align="right">Needinfos</TableCell>
                <TableCell align="right">P1s</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {domCore.components.map(component => (
                <BugRow
                  key={`bug-row-${component}`}
                  name={`Core :: ${component}`}
                  search={{ products: ['Core'], components: [component] }}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
        <br />
        <br />
        <Divider />
      </div>
    );
  }
}
