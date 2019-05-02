import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import CONFIG from '../../config';

const styles = {
  root: {},
};


function desc(a, b, orderBy) {
  if (b[orderBy].count < a[orderBy].count) {
    return -1;
  }
  if (b[orderBy].count > a[orderBy].count) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  const result = stabilizedThis.map(el => el[0]);
  return result;
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}


class Reportees extends React.PureComponent {
  state = {
    orderBy: 'cn',
    order: 'asc',
  };

  getMergedProps() {
    const { metrics, partialOrg, ldapEmail } = this.props;

    // filter out the manager
    const reportees = Object.values(partialOrg)
      .filter(({ mail }) => mail !== ldapEmail);

    // add metrics
    const reporteesWithMetrics = reportees.map(reportee => ({
      ...reportee,
      ...metrics[reportee.bugzillaEmail],
    }));

    return reporteesWithMetrics;
  }

  createSortHandler = property => (event) => {
    this.handleRequestSort(event, property);
  };

  handleRequestSort = (event, property) => {
    const { order, orderBy } = this.state;

    let newOrder = 'desc';
    if (orderBy === property && order === 'desc') {
      newOrder = 'asc';
    }

    this.setState({
      orderBy: property,
      order: newOrder,
    });
  };

  render() {
    const { classes } = this.props;

    const { order, orderBy } = this.state;

    return (
      <div className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {Object.entries(CONFIG.reporteesMetrics).map(([metricUid, { label }]) => (
                <TableCell
                  key={metricUid}
                  align="right"
                  sortDirection={orderBy === metricUid ? order : false}
                >
                  <Tooltip
                    title="Sort"
                    placement="bottom-end"
                  >
                    <TableSortLabel
                      active={orderBy === metricUid}
                      direction={order}
                      onClick={
                          this.createSortHandler(metricUid)
                        }
                    >
                      {label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(
              this.getMergedProps(),
              getSorting(order, orderBy),
            )
              .map(({
                cn, mail, bugzillaEmail, ...metrics
              }) => (
                <TableRow key={mail}>
                  <TableCell key={mail}>{`${cn} `}</TableCell>
                  {Object.keys(CONFIG.reporteesMetrics).map((metricUid) => {
                    const countLink = metrics[metricUid];
                    return (
                      <TableCell align="right" key={metricUid}>
                        {countLink && (
                        <a
                          key={countLink.link}
                          href={countLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {countLink.count}
                        </a>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
Reportees.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
  metrics: PropTypes.shape({}),
  //  onRequestSort: PropTypes.func.isRequired,
};

Reportees.defaultProps = {
  metrics: {},
};

export default withStyles(styles)(Reportees);
