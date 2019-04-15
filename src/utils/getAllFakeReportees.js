import getOrgChart from './getOrgChart';

const findReportees = (completeOrg, ldapEmail) => {
  let allReportees = {};
  const allEmails = Object.keys(completeOrg);
  const fakeEmail = (ldapEmail in completeOrg) ? ldapEmail : allEmails[0];

  allReportees[ldapEmail] = completeOrg[fakeEmail];
  const { reportees } = completeOrg[fakeEmail];


  if (reportees.length !== 0) {
    reportees.forEach((reporteeEmail) => {
      const partialOrg = findReportees(completeOrg, reporteeEmail);
      allReportees = { ...allReportees, ...partialOrg };
    });
  }
  return allReportees;
};

const getAllFakeReportees = async (ldapEmail) => {
  const completeOrg = await getOrgChart();
  return findReportees(completeOrg, ldapEmail);
};

export default getAllFakeReportees;
