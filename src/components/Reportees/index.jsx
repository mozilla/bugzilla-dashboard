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

const sortByPersonName = (a, b) => a.cn.localeCompare(b.cn);

const styles = {
  root: {},
};


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
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
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  console.log('getsorting');
  console.log(orderBy);
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}


class Reportees extends React.Component {
  constructor() {
    super();
    this.createSortHandler = this.createSortHandler.bind(this);
    this.state = {
      orderBy: {},
      order: {},
    };
  }

    handleRequestSort = (event, property) => {
      console.log('dedans');
      console.log(event);
      console.log(property);
      const orderBy = property;
      let order = 'desc';

      if (this.state.orderBy === property && this.state.order === 'desc') {
        order = 'asc';
      }

      this.setState({ order, orderBy });
    };

    createSortHandler = property => (event) => {
      this.handleRequestSort(event, property);
    };

    render() {
      const {
        classes, ldapEmail, partialOrg, metrics, orderBy, order,
      } = this.props;
      return (
        <div className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                {Object.values(CONFIG.reporteesMetrics).map(({ label }) => (
                  <TableCell
                    key={label}
                    align="right"
                    sortDirection={orderBy === label ? order : false}
                  >
                    <Tooltip
                      title="Sort"
                      placement="bottom-end"
                    >
                      <TableSortLabel
                        active={orderBy === label}
                        direction={order}
                        onClick={
                          evt => this.createSortHandler(evt, label)
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
                  Object.values(partialOrg)
                      .filter(({ cn }) => cn !== ldapEmail),
                  getSorting(order, orderBy),
              )
                .map(({ cn, mail, bugzillaEmail }) => (
                  <TableRow key={mail}>
                    <TableCell key={mail}>{`${cn} `}</TableCell>
                    {Object.keys(CONFIG.reporteesMetrics).map((metricUid) => {
                      const countLink = ((metrics || {})[bugzillaEmail] || {})[metricUid];
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
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

Reportees.defaultProps = {
  metrics: {},
};

export default withStyles(styles)(Reportees);
