const DATABASE_URL = process.env.MONGO_URL ||"mongodb://localhost:27017/db"
const SERVER_PORT = process.env.PORT || 3000
const JWTSECRET = process.env.JWTSECRET || 'TestJWTsecret'


module.exports = { DATABASE_URL, SERVER_PORT, JWTSECRET }