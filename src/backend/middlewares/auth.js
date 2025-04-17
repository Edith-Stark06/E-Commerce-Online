const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const authMiddleware = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-8f4008hilw3qd6ul.us.auth0.com/.well-known/jwks.json`
    }),
    audience: '5MJhiaQrfGuFPoWKWzdamByF48q2JdpT',
    issuer: `https://dev-8f4008hilw3qd6ul.us.auth0.com/`,
    algorithms: ['RS256']
});

module.exports = authMiddleware; 