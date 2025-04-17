const { auth } = require('express-oauth2-jwt-bearer');

const authMiddleware = auth({
    audience: '5MJhiaQrfGuFPoWKWzdamByF48q2JdpT',
    issuerBaseURL: 'https://dev-8f4008hilw3qd6ul.us.auth0.com',
    tokenSigningAlg: 'RS256'
});

module.exports = authMiddleware; 