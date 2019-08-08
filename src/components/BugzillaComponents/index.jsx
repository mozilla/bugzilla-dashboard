import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MUIDataTable from 'mui-datatables';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { BZ_QUERIES } from '../../config';
import sort from '../../utils/bugzilla/sort';

const _ = require('lodash');

const styles = ({
  header: {
    margin: '0.5rem 0 0 0',
  },
  metric: {
    textAlign: 'center',
  },
});

// Custom styles to override default MUI theme
const getMuiTheme = () => createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiPaper: {
      root: {
        margin: '1.4rem 0',
      },
    },
    MuiLink: {
      root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        fontSize: 12,
      },
    },
    MuiTypography: {
      body2: {
        whiteSpace: 'pre',
        display: 'flex',
        justifyContent: 'flex-start',
      },
    },
    MuiTableCell: {
      head: {
        padding: 0,
        '&:nth-child(3)': {
          maxWidth: '8rem',
        },
      },
      body: {
        cursor: 'pointer',
      },
    },
    MUIDataTableHeadCell: {
      data: {
        padding: '0px 10px',
      },
      toolButton: {
        width: '100%',
        height: '100%',
      },
    },
  },
});

const getOrderedMetrices = (data) => {
  const ordered = {};
  _(data)
    .keys()
    .sort()
    .each((key) => {
      ordered[key] = data[key];
    });

  return ordered;
};
const getTableHeaders = (colData, onComponentDetails) => {
  const firstHeader = {
    name: 'label',
    label: ' ',
    options: {
      filter: false,
      viewColumns: false,
      display: true,
    },
  };

  const getColor = (value, key) => (key === 'P1Defect' && (value && value.count) > 0 ? 'red' : 'blue');
  const Headers = Object.entries(getOrderedMetrices(colData)).map(
    ([key, { label, hidden: showColumn = false }]) => ({
      name: `metrics.${key}`,
      label,
      options: {
        filter: false,
        sort: true,
        responsive: 'scroll',
        rowsPerPage: 25,
        download: false,
        print: false,
        selectableRows: false,
        customSort: (data, index, order) => data.sort((a, b) => sort(a.data, b.data, index, order)),
        // If hidden is true for the column, show it in view column list
        viewColumns: showColumn,
        // If hidden is true, hide the column in the table by default
        display: !showColumn,

        customBodyRender: value => (
          <Link
            href={value ? value.link : '#'}
            target="_blank"
            style={{ color: getColor(value, key) }}
            rel="noopener noreferrer"
          >
            {value ? value.count : ''}
          </Link>
        ),
      },
    }),
  );

  if (onComponentDetails) {
    return [firstHeader].concat(Headers);
  }
  return Headers;
};

// MUI Datatable Options for Teams dashboard
const options = {
  filter: false,
  sort: true,
  responsive: 'scroll',
  rowsPerPage: 25,
  download: false,
  print: false,
  viewColumns: true,
  selectableRows: false,
  customSort: (data, index, order) => data.sort((a, b) => sort(a.data, b.data, index, order)),
};

const getOptions = (bugzillaComponents, onComponentDetails) => {
  let columnViewArray = [];
  return {
    filter: false,
    sort: true,
    responsive: 'scroll',
    rowsPerPage: 25,
    download: false,
    print: false,
    viewColumns: true,
    selectableRows: false,
    customSort: (data, index, order) => data.sort((a, b) => sort(a.data, b.data, index, order)),
    expandableRows: true,
    onColumnViewChange: (changedColumn, action) => {
      if (columnViewArray.length === 0 && action === 'add') {
        columnViewArray.push(changedColumn.split('.')[1]);
      } else if (action === 'add') {
        columnViewArray.push(changedColumn.split('.')[1]);
      } else {
        columnViewArray = columnViewArray.filter(value => value !== changedColumn.split('.')[1]);
      }
    },
    expandableRowsOnClick: false,
    renderExpandableRow: (rowData, rowMeta) => (
      <React.Fragment>
        {bugzillaComponents[rowMeta.rowIndex].componentData.map(
          component => (
            <TableRow key={component.label}>
              <TableCell colSpan={1} />
              <TableCell
                onClick={(e) => {
                  onComponentDetails(e, {
                    componentKey: `${component.label}`,
                    teamKey: null,
                    // label: value.label
                  });
                }}
                colSpan={1}
              >
                <Typography style={{ color: '#3f51b5' }}>
                  <LinkIcon />
                      &nbsp;
                  {component.label}
                </Typography>
              </TableCell>

              {Object.entries(getOrderedMetrices(BZ_QUERIES)).map(
                ([key, value]) => (
                  (!value.hidden || columnViewArray.includes(key)) && (
                  <TableCell colSpan={1} component="th" scope="row" key={key}>
                    {
                      Object.values(component.metrics).forEach((metric) => {
                        if (metric.label === value.label) {
                          return (
                            <Link
                              key={metric.link}
                              href={metric.link}
                              target="_blank"
                              style={{
                                color: metric.count > 0 ? 'red' : 'blue',
                              }}
                              rel="noopener noreferrer"
                            >
                              {metric.count}
                            </Link>
                          );
                        }
                        return 0;
                      })
                    }
                  </TableCell>
                  )
                ),
              )}
            </TableRow>
          ),
        )}
      </React.Fragment>
    ),
  };
};
const BugzillaComponents = ({
  title, bugzillaComponents, onComponentDetails, path,
}) => (
  bugzillaComponents.length > 0 && (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={title}
        data={bugzillaComponents}
        columns={getTableHeaders(BZ_QUERIES, onComponentDetails)}
        options={path === '/components' ? getOptions(bugzillaComponents, onComponentDetails) : options}
      />
    </MuiThemeProvider>
  )
);

BugzillaComponents.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      product: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
      component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
      metrics: PropTypes.shape({}),
    }),
  ).isRequired,
  onComponentDetails: PropTypes.func,
};

BugzillaComponents.defaultProps = {
  onComponentDetails: undefined,
};

export default withStyles(styles)(BugzillaComponents);
