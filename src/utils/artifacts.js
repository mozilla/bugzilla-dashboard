/* Load a private artifact from Taskcluster, using a signed url and a direct download

You can use it with a signed it Taskcluster user session:

import loadArtifact from '../../utils/artifacts';
const data = await loadArtifact(
  userSession,
  'project.relman.production.bugzilla-dashboard.latest',
  'private/bugzilla-dashboard/XXXX.json'
);
*/

async function loadArtifact(userSession, route, artifactName) {
  const index = userSession.getTaskClusterIndexClient();

  const url = await index.buildSignedUrl(
    index.findArtifactFromTask,
    route,
    artifactName,
  );
  const resp = await fetch(url);

  return resp.arrayBuffer();
}

export default loadArtifact;
