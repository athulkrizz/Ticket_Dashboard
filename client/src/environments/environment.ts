export const environment = {
  production: false,
  // Use relative path in production (same origin) and localhost:3000 in dev
  apiUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000' : '',
  authEnabled: true,
};
