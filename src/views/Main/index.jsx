import React from 'react';
import MainContainer from '../../containers/MainContainer';

// eslint-disable-next-line react/prop-types
const Main = ({ location }) => (
  <MainContainer
    ldapEmail={new URLSearchParams(location.search).get('ldapEmail') || ''}
  />
);

export default Main;
