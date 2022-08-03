// Note this client is created once at runtime, then exported for shared use
import faunadb from "faunadb";

const SECRET = process.env.FAUNADB_SECRET;
if (!SECRET) throw new Error(
    `Missing required environment variable FAUNADB_SECRET, current value is "${SECRET}"`)

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export const createLocalFaunaClient = () => new faunadb.Client({
    secret: 'secret', // From faunadb-local-config.yml, "auth_root_key" value
    domain: 'localhost',
    port: 8543,
    scheme: 'http',
    // Docs say this is not needed for javascript driver https://docs.fauna.com/fauna/current/integrations/dev
    // endpoint: "http://localhost:8443"
})

export const createRemoteFaunaClient = () => new faunadb.Client({
    secret: SECRET,
})

export const client = IS_DEVELOPMENT ? createLocalFaunaClient() : createRemoteFaunaClient();
