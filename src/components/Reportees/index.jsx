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


function propertyComparatorAscending(a, b, orderBy) {
  const valueA = a[orderBy];
  const valueB = b[orderBy];

  // Values can either be strings or objects with a "count" property.
  // Case 1: they're strings.
  if (typeof valueA === 'string') {
    return valueA.localeCompare(valueB);
  }

  // Case 2: they're objects with a count property.
  const countA = valueA ? valueA.count : 0;
  const countB = valueB ? valueB.count : 0;

  return countA - countB;
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
  return order === 'asc'
    ? (a, b) => propertyComparatorAscending(a, b, orderBy)
    : (a, b) => -propertyComparatorAscending(a, b, orderBy);
}

function TableHeadCell({
  metricUid, orderBy, order, label, onClick,
}) {
  return (
    <TableCell
      align="right"
      sortDirection={orderBy === metricUid ? order : false}
    >
      <Tooltip
        title="Click to sort the table by this column"
        placement="bottom-end"
      >
        <TableSortLabel
          active={orderBy === metricUid}
          direction={order}
          onClick={onClick}
        >
          {label}
        </TableSortLabel>
      </Tooltip>
    </TableCell>
  );
}

TableHeadCell.propTypes = {
  metricUid: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

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

    let newOrder;

    // If we click on the same column several times in a row, we simply switch
    // the prevous value.
    if (orderBy === property) {
      newOrder = order === 'asc' ? 'desc' : 'asc';
    } else if (property === 'cn') {
      // For most properties we want to order in the descending order first.
      // ... except when sorting by cn.
      newOrder = 'asc';
    } else {
      newOrder = 'desc';
    }

    this.setState({
      orderBy: property,
      order: newOrder,
    });
  };

  render() {
    const { classes } = this.props;

    const { order, orderBy } = this.state;
    const metricsAsArray = Object.entries(CONFIG.reporteesMetrics);

    return (
      <div className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell
                metricUid="cn"
                orderBy={orderBy}
                order={order}
                label="Full Name"
                onClick={this.createSortHandler('cn')}
              />
              {metricsAsArray.map(([metricUid, { label }]) => (
                <TableHeadCell
                  key={metricUid}
                  metricUid={metricUid}
                  orderBy={orderBy}
                  order={order}
                  label={label}
                  onClick={this.createSortHandler(metricUid)}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(
              this.getMergedProps(),
              getSorting(order, orderBy),
            )
              .map(({
                cn, mail, bugzillaEmail, ...metricsValues
              }) => (
                <TableRow key={mail}>
                  <TableCell key={mail}>{cn}</TableCell>
                  {metricsAsArray.map(([metricUid]) => {
                    const countLink = metricsValues[metricUid];
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
};

Reportees.defaultProps = {
  metrics: {},
};

export default withStyles(styles)(Reportees);
