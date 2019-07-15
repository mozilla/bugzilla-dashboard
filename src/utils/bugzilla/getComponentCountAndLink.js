/* eslint-disable camelcase */
const getComponentCountAndLink = async (metric) => {
  const { count = 0, link = '#' } = metric;
  return { link, count };
};

export default getComponentCountAndLink;
