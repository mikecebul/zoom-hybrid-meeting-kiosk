export function getISODate() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-").replace('T', '--').slice(0, 19); // Format: YYYY-MM-DD--HH-MM-SS
}