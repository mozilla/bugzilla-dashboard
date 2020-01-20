import pako from 'pako';
import config from '../config';
import loadArtifact from './artifacts';

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
  const peopleGZ = await loadArtifact(userSession, config.artifactRoute, config.peopleTree);
  const people = JSON.parse(pako.inflate(peopleGZ, { to: 'string' }));

  console.log(people);

  const completeOrg = await buildOrgChartData(people);
  return findReportees(completeOrg, ldapEmail);
};

export default getAllReportees;
