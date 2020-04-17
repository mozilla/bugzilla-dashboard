import mitt from 'mitt';
import UserSession from './UserSession';

import { userSessionFromCode } from './oauth2';

const STORAGE_KEY = 'taskcluster_user_session';

/**
 * Controller for authentication-related pieces of the site.
 *
 * This encompasses knowledge of which authentication mechanisms are enabled, including
 * credentials menu items, ongoing expiration monitoring, and any additional required UI.
 * It also handles synchronizing sign-in status across tabs.
 */
export default class AuthController {
  constructor() {
    const events = mitt();

    this.on = events.on;
    this.off = events.off;
    this.emit = events.emit;

    this.renewalTimer = null;

    window.addEventListener('storage', ({ storageArea, key }) => {
      if (storageArea === localStorage && key === STORAGE_KEY) {
        this.loadUserSession();
      }
    });
  }

  /**
   * Reset the renewal timer based on the given user session.
   */
  resetRenewalTimer(userSession) {
    if (this.renewalTimer) {
      window.clearTimeout(this.renewalTimer);
      this.renewalTimer = null;
    }

    if (userSession && userSession.renewAfter) {
      let timeout = Math.max(0, new Date(userSession.renewAfter) - new Date());

      // if the timeout is in the future, apply up to a few minutes to it
      // randomly.  This avoids multiple tabs all trying to renew at the
      // same time.
      if (timeout > 0) {
        timeout += Math.random() * 5 * 60 * 1000;
      }

      this.renewalTimer = window.setTimeout(() => {
        this.renewalTimer = null;
        this.renew(userSession);
      }, timeout);
    }
  }

  /**
   * Exchange Oauth Code received in URL callback
   * and build a User Session from Taskcluster credentials
   */
  async exchangeCode(url) {
    this.setUserSession(await userSessionFromCode(url));
  }

  /**
   * Load the current user session (from localStorage).
   *
   * This will emit the user-session-changed event, but does not
   * return the user session.
   */
  loadUserSession() {
    const storedUserSession = localStorage.getItem(STORAGE_KEY);
    const userSession = storedUserSession
      ? UserSession.deserialize(storedUserSession)
      : null;

    this.userSession = userSession;
    this.resetRenewalTimer(userSession);
    this.emit('user-session-changed', userSession);
  }

  /**
   * Get the current userSession instance
   */
  getUserSession() {
    return this.userSession;
  }

  /**
   * Set the current user session, or (if null) delete the current user session.
   *
   * This will change the user session in all open windows/tabs, eventually triggering
   * a call to any onSessionChanged callbacks.
   */
  setUserSession = (userSession) => {
    if (!userSession) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, userSession.serialize());
    }

    // localStorage updates do not trigger event listeners on the current window/tab,
    // so invoke it directly
    this.loadUserSession();
  };

  /**
   * Renew the user session.
   * This is not currently supported by the Taskcluster OAuth, so we just clean the session
   */
  async renew() {
    this.setUserSession(null);
  }
}
