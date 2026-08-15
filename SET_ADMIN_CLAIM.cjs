const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

initializeApp({ credential: applicationDefault() });

const projectId = 'elhawary-careers-2026';
const uid = 'TcufKTgsWPbydBw2moPxdQcvfDE2';

(async () => {
  const auth = getAuth();
  const user = await auth.getUser(uid);

  if (user.email !== 'ahmed.sheta89@gmail.com') {
    throw new Error(`UID does not belong to the expected email: ${user.email}`);
  }

  const currentClaims = user.customClaims || {};
  await auth.setCustomUserClaims(uid, {
    ...currentClaims,
    admin: true,
  });

  const updated = await auth.getUser(uid);
  console.log(JSON.stringify({
    projectId,
    uid: updated.uid,
    email: updated.email,
    customClaims: updated.customClaims,
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
