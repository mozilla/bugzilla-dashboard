export default queries =>
  queries.reduce(
    (advanced, query) => {
      const [field, operator, value] = query.split('::');

      return {
        fields: [...advanced.fields, field],
        operators: [...advanced.operators, operator],
        values: [...advanced.values, value],
      };
    },
    { fields: [], operators: [], values: [] }
  );
