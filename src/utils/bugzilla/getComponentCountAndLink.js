/* eslint-disable camelcase */
const getComponentCountAndLink = async (metric) => {
  const count = metric === undefined ? 0 : metric.count;
  const link = metric === undefined ? 0 : metric.link;
  return { link, count };
};

export default getComponentCountAndLink;
