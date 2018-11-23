const getBugzillaComponents = async () => {
  const { products } = await (await fetch('https://bugzilla.mozilla.org/rest/product'
        + '?type=accessible&include_fields=name&include_fields=components'
        + '&exclude_fields=components.flag_types&exclude_fields=components.description')).json();
  return products;
};

export default getBugzillaComponents;
