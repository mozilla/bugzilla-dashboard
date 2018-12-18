import React from 'react';
import MainContainer from '../../containers/MainContainer';

// eslint-disable-next-line react/prop-types
const Main = ({ location }) => (
  <MainContainer
     // XXX: Until we have SSO + real org access
    ldapEmail={new URLSearchParams(location.search).get('ldapEmail') || 'manager@mozilla.com'}
  />
);

export default Main;
