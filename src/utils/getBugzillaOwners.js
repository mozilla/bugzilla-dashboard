const getBugzillaOwners = async () => (await fetch('triageOwners.json')).json();
export default getBugzillaOwners;
