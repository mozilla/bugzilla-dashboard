/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
import React from 'react';
import { object } from 'prop-types';
import { Button } from 'react-bootstrap';

export default class SecretsTest extends React.Component {
  static contextTypes = {
    authController: object.isRequired,
  };


  doEet = async () => {
    const { userSession } = this.context.authController;
    if (!userSession) {
      console.log('login required');
      // this.setState({ errorMsg: 'Login required!' });
      return;
    }
    const secretsClient = userSession.getTaskClusterSecretsClient();
    const secret = await secretsClient.get('garbage/rail/test');
    console.log('secret', secret);
  };

  render() {
    return (
      <div className="container">
        <Button onClick={this.doEet}>do eet and watch the console</Button>
      </div>
    );
  }
}
