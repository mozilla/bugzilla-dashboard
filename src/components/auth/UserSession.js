import { Index } from 'taskcluster-client-web';
import { TASKCLUSTER_ROOT_URL } from '../../config';

const USER_ID_REGEX = /mozilla-auth0\/([\w-|]+)\/bugzilla-dashboard-([\w-]+)/;

/**
 * An object representing a user session.  Tools supports a variety of login methods,
 * so this combines them all in a single representation.
 *
 * UserSessions are immutable -- when anything about the session changes, a new instance
 * replaces the old.  The `userChanged` method is useful to distinguish changes to the
 * user identity from mere token renewals.
 *
 * Common properties are:
 *
 * - type - 'oidc' or 'credentials'
 * - name - user name
 * - clientArgs - arguments to pass to taskcluster-client-web Client constructors
 * - renewAfter - date (Date or string) after which this session should be renewed,
 *                if applicable
 *
 * When the type is 'credentials':
 *
 * - credentials -- the Taskcluster credentials (with or without a certificate)
 *
 * To fetch Taskcluster credentials for the user regardless of type, use the getCredentials
 * method.
 */
export default class UserSession {
  constructor(options) {
    Object.assign(this, options);
  }

  static fromCredentials(credentials) {
    return new UserSession({ type: 'credentials', email: 'nobody@mozilla.org', credentials });
  }

  // determine whether the user changed from old to new; this is used by other components
  // to determine when to update in response to a sign-in/sign-out event
  static userChanged(oldUser, newUser) {
    if (!oldUser && !newUser) {
      return false;
    }

    if (!oldUser || !newUser) {
      return true;
    }

    return oldUser.type !== newUser.type || oldUser.name !== newUser.name;
  }

  // get the user's name
  get name() {
    return (
      this.fullName
      || (this.credentials && this.credentials.clientId)
      || 'unknown'
    );
  }

  get userId() {
    // Find the user ID in Taskcluster credentials
    const match = USER_ID_REGEX.exec(this.credentials.clientId);
    if (match === null) {
      return this.credentials.clientId;
    }

    return match[1];
  }

  // get the args used to create a new client object
  get clientArgs() {
    return { credentials: this.credentials };
  }

  // load Taskcluster credentials for this user
  getCredentials() {
    return this.credentials
      ? Promise.resolve(this.credentials)
      : this.credentialAgent.getCredentials({});
  }

  static deserialize(value) {
    return new UserSession(JSON.parse(value));
  }

  serialize() {
    return JSON.stringify({ ...this, credentialAgent: undefined });
  }

  getTaskClusterIndexClient = () => new Index({
    ...this.clientArgs,
    rootUrl: TASKCLUSTER_ROOT_URL,
  });
}
