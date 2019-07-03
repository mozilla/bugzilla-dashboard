import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import CONFIG from '../../config';
import './index.css';
import sortFunc from '../../utils/bugzilla/sort';

const styles = {
  root: {},
};

class Reportees extends React.PureComponent {
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
    // Sort dataset in ascending order and return
    return reporteesWithMetrics.sort((a, b) => a.cn.localeCompare(b.cn));
  }

  // Custom styles to override default MUI theme
  getMuiTheme = () => createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          textAlign: 'center',
        },
      },
    },
  });

  render() {
    const { classes } = this.props;

    /**
     * @description Reversing the order according to first parameter.
     * @param {String} order asc or dsc
     * @returns {Number} 1 || -1
     */
    const ascDescSortFunc = order => (order === 'desc' ? 1 : -1);

    // MUI table options
    const options = {
      filter: true,
      selectableRows: false,
      sort: true,
      responsive: 'stacked',
      rowsPerPage: 10,
      download: false,
      print: false,
      viewColumns: false,
      customSort: (data, colIndex, order) => data.sort((a, b) => {
        // Get Sort Value
        const sortValue = sortFunc(a.data, b.data, colIndex);
        // Get Asc or Desc
        const ascDescValue = ascDescSortFunc(order);
        // multiply Sort and AscDesc Value
        return sortValue * ascDescValue;
      }),
    };

    const metricsAsArray = Object.entries(CONFIG.reporteesMetrics);

    const tableHeader = [];

    // Form Table column headers using metricsArray
    // Add Full name directly into columns Heading array
    const firstColumn = {
      name: 'cn',
      label: 'Full Name',
    };

    tableHeader.push(firstColumn);

    // push other columns from metricsAsArray in the config.js file to tableHeader array
    metricsAsArray.forEach(([metricUid, { label, maxCount }]) => {
      const column = {
        name: `${metricUid}`,
        label,
        options: {
          filter: false,
          customBodyRender: value => (
            <a
              href={value !== undefined ? value.link : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={
                (value !== undefined && ((metricUid === 'assigned_defect' && value.count > maxCount) || (metricUid === 'needinfo' && value.count > maxCount)) ? 'highlight' : '')
              }
            >
              { value !== undefined ? value.count : '' }
            </a>
          ),
        },
      };
      tableHeader.push(column);
    });

    return (
      <div className={classes.root}>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title="Reportees"
            data={this.getMergedProps()}
            columns={tableHeader}
            options={options}
            className="reportees-table"
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
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
