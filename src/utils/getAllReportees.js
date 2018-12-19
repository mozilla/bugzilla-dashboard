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

const getOrgChart = async (secretsClient) => {
  const { secret } = await await secretsClient.get(config.taskclusterSecrets.orgData);
  return buildOrgChartData(secret.employees);
};

const findReportees = (completeOrg, email) => {
  let allReportees = {};
  allReportees[email] = completeOrg[email];
  const { reportees } = completeOrg[email];
  if (reportees.length !== 0) {
    reportees.forEach((reporteeEmail) => {
      const partialOrg = findReportees(completeOrg, reporteeEmail);
      allReportees = { ...allReportees, ...partialOrg };
    });
  }
  return allReportees;
};

const getAllReportees = async (secretsClient, ldapEmail) => {
  const completeOrg = await getOrgChart(secretsClient);
  return findReportees(completeOrg, ldapEmail);
};

export default getAllReportees;
