import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MUIDataTable from 'mui-datatables';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import _ from 'lodash';
import { BZ_QUERIES } from '../../config';
import sort from '../../utils/bugzilla/sort';
import generateComponentsTable from '../../utils/bugzilla/generateComponentsTableData';

const styles = ({
  header: {
    margin: '0.5rem 0 0 0',
  },
  metric: {
    textAlign: 'center',
  },
});

const sortByComponentName = (a, b) => a.label.localeCompare(b.label);

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

const getTableHeaders = (data, onComponentDetails) => {
  const firstHeader = {
    name: '',
    label: '',
    options: {
      filter: false,
      viewColumns: false,
      customBodyRender: value => (
        value
          ? (
            <p>
              {value.label}
            </p>
          )
          : null
      ),
    },
  };

  const getColor = (value, key) => (key === 'P1Defect' && (value && value.count) > 0 ? 'red' : 'blue');

  const Headers = Object.entries((data)).map(([key, { label, hidden: showColumn = false }]) => ({
    name: `${label}`,
    label,
    options: {
      filter: false,
      // If hidden is true for the column, show it in view column list
      viewColumns: showColumn,
      // If hidden is true, hide the column in the table by default
      display: !showColumn,
      customBodyRender: value => (
        <p
          style={{ color: getColor(value, key) }}
        >
          { value ? value.count : '' }
        </p>
      ),
    },
  }));
  if (onComponentDetails) {
    return [firstHeader].concat(Headers);
  }
  return Headers;
};

const options = {
  filter: false,
  selectableRows: 'none',
  sort: true,
  responsive: 'scroll',
  rowsPerPage: 25,
  download: false,
  print: false,
  viewColumns: true,
  customSort: (data, index, order) => data.sort((a, b) => sort(a.data, b.data, index, order)),
};

// mui-datatable options for components
const getOptions = (bugzillaComponents, onComponentDetails) => {
  let columnViewArray = [];
  return {
    filter: false,
    selectableRows: 'none',
    sort: true,
    responsive: 'scroll',
    rowsPerPage: 25,
    download: false,
    print: false,
    viewColumns: true,
    customSort: (data, index, order) => data.sort((a, b) => sort(a.data, b.data, index, order)),
    expandableRows: true,
    onColumnViewChange: (changedColumn, action) => {
      _.mapKeys(BZ_QUERIES, (value, key) => {
        if (value.label === changedColumn) {
          if (columnViewArray.length === 0 && action === 'add') {
            columnViewArray.push(key);
          } else if (action === 'add') {
            columnViewArray.push(key);
          } else {
            columnViewArray = columnViewArray.filter(val => val !== key);
          }
        }
      });
    },
    expandableRowsOnClick: false,
    renderExpandableRow: (rowData, rowMeta) => {
      const componentData = bugzillaComponents[rowMeta.rowIndex].components;
      return (
        <React.Fragment>
          {componentData.map(
            component => (
              <TableRow key={component.label}>
                <TableCell colSpan={1} />
                <TableCell
                  onClick={(e) => {
                    onComponentDetails(e, {
                      componentKey: `${component.label}`,
                      teamKey: null,
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

                {Object.entries((BZ_QUERIES)).map(
                  ([key, value]) => (
                    (!value.hidden || columnViewArray.includes(key)) && (
                      <TableCell colSpan={1} component="th" scope="row" key={key}>
                        {
                          Object.values(component.metrics)
                            .filter(metric => metric.label === value.label)
                            .map(metric => (
                              <Link
                                key={metric.label}
                                href={metric.link}
                                target="_blank"
                                style={{
                                  color: metric.count > 0 ? 'red' : 'blue',
                                }}
                                rel="noopener noreferrer"
                              >
                                {metric.count}
                              </Link>
                            ))
                        }
                      </TableCell>
                    )
                  ),
                )}
              </TableRow>
            ),
          )}
        </React.Fragment>
      );
    },
  };
};

/** ,
   * @description Add data according to the mui data-table
   * @param {BZ_QUERIES} query The Static object to map
   * @param {Array} metrics Object sent by the server for each row
   * sent from {Function} getBugzillaComponentsData
   * @returns Array<metric | null>
   */
const BZqueryToDataCount = (query, metrics) => (
  Object.keys(query).map(eachQuery => (metrics[eachQuery] ? metrics[eachQuery] : null))
);

/**
   * @description Add data according to the mui data-table
   * @param {Array} bugzillaComponents
   * @returns {Array}
   */
const getBugzillaComponentsData = bugzillaComponents => bugzillaComponents
  .sort(sortByComponentName)
  .map(({
    label, component, product, metrics = {}, teamKey = null,
  }) => (
    [
      {
        label,
        component,
        product,
        metrics,
        teamKey,
      },
    ].concat(BZqueryToDataCount(BZ_QUERIES, metrics))
  ));

const BugzillaComponents = ({
  title, bugzillaComponents, onComponentDetails, path,
}) => (
  bugzillaComponents.length > 0 && (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={title}
        data={path === '/components' ? getBugzillaComponentsData(generateComponentsTable(bugzillaComponents)) : getBugzillaComponentsData(bugzillaComponents)}
        columns={getTableHeaders(BZ_QUERIES, onComponentDetails)}
        options={path === '/components' ? getOptions(generateComponentsTable(bugzillaComponents), onComponentDetails) : options}
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
