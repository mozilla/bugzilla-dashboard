const getBugzillaComponentLink = (product, component) => (
  'https://bugzilla.mozilla.org/buglist.cgi?f1=bug_severity&o1=notequals&v1=enhancement'
  + `&f2=keywords&o2=notsubstring&v2=meta&f3=product&o3=equals&v3=${product}&f4=component`
  + `&o4=equals&v4=${component}&f5=resolution&o5=isempty&limit=0`
);

export default getBugzillaComponentLink;
