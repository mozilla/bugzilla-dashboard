import getOrgChart from './getOrgChart';

const findReportees = (completeOrg, email) => {
  let allReportees = {};
  const allEmails = Object.keys(completeOrg);
  const fakeEmail = (email in completeOrg) ? email : allEmails[allEmails.length - 1];

  allReportees[email] = completeOrg[fakeEmail];
  const { reportees } = completeOrg[fakeEmail];


  if (reportees.length !== 0) {
    reportees.forEach((reporteeEmail) => {
      const partialOrg = findReportees(completeOrg, reporteeEmail);
      allReportees = { ...allReportees, ...partialOrg };
    });
  }

  return allReportees;
};

const getAllFakeReportees = async (email) => {
  const completeOrg = await getOrgChart();
  return findReportees(completeOrg, email);
};

export default getAllFakeReportees;
