import pako from 'pako';
import config from '../config';
import loadArtifact from './artifacts';

const findReportees = (org, parentId) => {
  // Find all direct reportees of specified manager
  const managerFilter = (acc, key) => {
    if (org[key].manager !== parentId) {
      return acc;
    }
    return { ...acc, [key]: org[key] };
  };
  let reportees = Object.keys(org).reduce(managerFilter, {});

  // Add subordinates reportees too
  if (reportees.length !== 0) {
    Object.keys(reportees).forEach((rId) => {
      const subordinates = findReportees(org, rId);
      reportees = { ...reportees, ...subordinates };
    });
  }
  return reportees;
};

const getAllReportees = async (userSession, userId) => {
  const peopleGZ = await loadArtifact(userSession, config.artifactRoute, config.peopleTree);
  const people = JSON.parse(pako.inflate(peopleGZ, { to: 'string' }));
  return findReportees(people, userId || userSession.userId);
};

export default getAllReportees;
