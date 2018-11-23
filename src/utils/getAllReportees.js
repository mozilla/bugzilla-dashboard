import getOrgChart from './getOrgChart';

const findReportees = (completeOrg, ldapEmail) => {
  let allReportees = {};
  allReportees[ldapEmail] = completeOrg[ldapEmail];
  const { reportees } = completeOrg[ldapEmail];
  if (reportees.length !== 0) {
    reportees.forEach((reporteeEmail) => {
      const partialOrg = findReportees(completeOrg, reporteeEmail);
      allReportees = { ...allReportees, ...partialOrg };
    });
  }
  return allReportees;
};

const getAllReportees = async (ldapEmail) => {
  const completeOrg = await getOrgChart();
  return findReportees(completeOrg, ldapEmail);
};

export default getAllReportees;
