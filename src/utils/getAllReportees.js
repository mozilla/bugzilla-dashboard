import config from '../config';

const buildOrgChartData = (people) => {
  const org = {};
  people.forEach((person) => {
    const { mail } = person;
    if (!org[mail]) {
      org[mail] = person;
      org[mail].reportees = [];
    } else {
      org[mail] = {
        ...person,
        reportees: org[mail].reportees,
      };
    }
    const { manager } = person;
    if (manager) {
      const managerLDAPemail = manager.dn.split('mail=')[1].split(',o=')[0];
      if (org[managerLDAPemail]) {
        org[managerLDAPemail].reportees.push(mail);
      } else {
        org[managerLDAPemail] = {
          reportees: [mail],
        };
      }
    }
    if (!org[mail].bugzillaEmail) {
      org[mail].bugzillaEmail = mail;
    }
  });
  return org;
};

const findReportees = (completeOrg, email) => {
  let allReportees = {};
  // if non-LDAP user, replace user email by the last email in list. Last email
  /* in the fakeOrg.json file is the email Id of the manager. For a non LDAP
   * login we replace top level manager's email ID with logged in user's email Id.
   * And the reportees will be listed only if the manager's email Id is matching.
   */
  const allEmails = Object.keys(completeOrg);
  const checkedEmail = (email in completeOrg) ? email : allEmails[allEmails.length - 1];

  allReportees[email] = completeOrg[checkedEmail];
  const { reportees } = completeOrg[checkedEmail];


  if (reportees.length !== 0) {
    reportees.forEach((reporteeEmail) => {
      const partialOrg = findReportees(completeOrg, reporteeEmail);
      allReportees = { ...allReportees, ...partialOrg };
    });
  }
  return allReportees;
};

const getAllReportees = async (userSession, ldapEmail) => {
  let people;
  if (userSession.oidcProvider === 'mozilla-auth0') {
    // if non-LDAP user, get fake data
    people = await (await fetch('people.json')).json();
  } else {
    const secretsClient = userSession.getTaskClusterSecretsClient();
    const { secret } = await await secretsClient.get(config.taskclusterSecrets.orgData);
    people = secret.employees;
  }
  const completeOrg = await buildOrgChartData(people);
  return findReportees(completeOrg, ldapEmail);
};

export default getAllReportees;
