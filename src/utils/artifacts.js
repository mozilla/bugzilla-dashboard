async function loadArtifact(userSession, route, artifactName) {
  const index = userSession.getTaskClusterIndexClient();

  const url = await index.buildSignedUrl(
    index.findArtifactFromTask,
    route,
    artifactName,
  );
  const resp = await fetch(url);

  return resp.text();
}

export default loadArtifact;
