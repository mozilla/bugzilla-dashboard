import getBugzillaComponents from './getBugzillaComponents';

const getBugzillaOwners = async () => {
  const bzComponents = await getBugzillaComponents();
  /* eslint-disable camelcase */
  /* eslint-disable no-param-reassign */
  const owners = bzComponents.reduce((result, product) => {
    product.components.forEach(({ name, triage_owner }) => {
      if (triage_owner && triage_owner !== '') {
        if (!result[triage_owner]) {
          result[triage_owner] = [];
        }
        result[triage_owner].push({ product: product.name, component: name });
      }
    });
    return result;
  }, {});
  /* eslint-enable camelcase */
  /* eslint-enable no-param-reassign */
  return owners;
};
export default getBugzillaOwners;
