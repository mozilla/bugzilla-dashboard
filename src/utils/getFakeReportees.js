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

const findFakeReportees = (completeOrg, email) => {
  let allReportees = {};

  // if non-LDAP user, replace user email by the last email in list
  const allEmails = Object.keys(completeOrg);
  const checkedEmail = (email in completeOrg) ? email : allEmails[allEmails.length - 1];

  allReportees[email] = completeOrg[checkedEmail];
  const { reportees } = completeOrg[checkedEmail];


  if (reportees.length !== 0) {
    reportees.forEach((reporteeEmail) => {
      const partialOrg = findFakeReportees(completeOrg, reporteeEmail);
      allReportees = { ...allReportees, ...partialOrg };
    });
  }
  return allReportees;
};

const getFakeReportees = async (ldapEmail) => {
  const people = await (await fetch('people.json')).json();
  const completeOrg = await buildOrgChartData(people);
  return findFakeReportees(completeOrg, ldapEmail);
};

export default getFakeReportees;
