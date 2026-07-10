require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const port = process.env.PROD_PORT || 8080;
process.env.PORT = String(port);

// Start the NestJS application
require('./dist/main');
