import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CONFIG from '../../config';

const sortByPersonName = (a, b) => a.cn.localeCompare(b.cn);

const styles = {
  root: {},
};

const Reportees = ({
  classes, ldapEmail, partialOrg, metrics,
}) => (
  <div className={classes.root}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell />
          {Object.values(CONFIG.reporteesMetrics).map(({ label }) => (
            <TableCell key={label} align="right">{label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.values(partialOrg)
          .filter(({ cn }) => cn !== ldapEmail)
          .sort(sortByPersonName)
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

Reportees.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  ldapEmail: PropTypes.string,
  partialOrg: PropTypes.shape({}).isRequired,
  metrics: PropTypes.shape({}),
};

Reportees.defaultProps = {
  metrics: {},
  ldapEmail: '',
};

export default withStyles(styles)(Reportees);
