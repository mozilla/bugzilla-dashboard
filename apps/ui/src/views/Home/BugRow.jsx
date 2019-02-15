import React, { Component } from 'react';
import { string } from 'prop-types';
import { compose, graphql } from 'react-apollo';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import bugSearch from '../../bugSearch.graphql';
import needinfoBugs from '../../queries/needinfoBugs';
import p1Bugs from '../../queries/p1Bugs';
import untriagedBugs from '../../queries/untriagedBugs';

const query = (name, search) =>
  graphql(bugSearch, {
    props: ({ data }) => ({
      [`loading${name[0].toUpperCase()}${name.slice(1)}`]: data.loading,
      [name]: data.bugs,
    }),
    options: props => ({
      variables: { search: { ...search, ...props.search } },
    }),
  });

export default
@compose(
  query('untriaged', untriagedBugs),
  query('needinfo', needinfoBugs),
  query('p1', p1Bugs)
)
class BugRow extends Component {
  static propTypes = {
    name: string.isRequired,
  };

  render() {
    const {
      name,
      untriagedLoading,
      needinfoLoading,
      p1Loading,
      untriaged,
      needinfo,
      p1,
    } = this.props;

    return (
      <TableRow>
        <TableCell component="th" scope="row">
          <strong>{name}</strong>
        </TableCell>
        <TableCell align="right">
          {untriagedLoading || !untriaged ? '•' : untriaged.edges.length}
        </TableCell>
        <TableCell align="right">
          {needinfoLoading || !needinfo ? '•' : needinfo.edges.length}
        </TableCell>
        <TableCell align="right">
          {p1Loading || !p1 ? '•' : p1.edges.length}
        </TableCell>
      </TableRow>
    );
  }
}
