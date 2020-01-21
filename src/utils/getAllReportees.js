import pako from 'pako';
import config from '../config';
import loadArtifact from './artifacts';

const findReportees = (org, userId) => {
  console.log('Find all reportees of', userId);
  const managerFilter = (acc, key) => {
    if (org[key].manager !== userId) {
      return acc;
    }
    return { ...acc, [key]: org[key] };
  };
  return Object.keys(org).reduce(managerFilter, {});
/*
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
*/
};

const getAllReportees = async (userSession, userId) => {
  const peopleGZ = await loadArtifact(userSession, config.artifactRoute, config.peopleTree);
  const people = JSON.parse(pako.inflate(peopleGZ, { to: 'string' }));

  return findReportees(people, userId || userSession.userId);
};

export default getAllReportees;
