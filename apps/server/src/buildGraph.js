import Graph from 'graph.js/dist/graph.full';

export default (phonebook, root) =>
  phonebook.reduce((graph, employee) => {
    if (employee.dn.includes('o=com')) {
      graph.addVertex(employee.dn, employee);

      if (employee.dn !== root && employee.manager) {
        try {
          graph.createNewEdge(employee.manager.dn, employee.dn);
        } catch (err) {
          graph.addNewEdge(employee.manager.dn, employee.dn);
        }
      }
    }

    return graph;
  }, new Graph());
