import faunadb from "faunadb";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
if (!IS_DEVELOPMENT) throw new Error("Do not run this script in a non-development environment");
export const createLocalFaunaClient = () => new faunadb.Client({
  // Secret must match ./faunadb-local-config.yml "auth_root_key" value
  secret: 'secret',
  domain: 'localhost',
  port: 8543,
  scheme: 'http',
  // Docs say this is not needed for javascript driver https://docs.fauna.com/fauna/current/integrations/dev
  // endpoint: "http://localhost:8443"
})


const faunaClient = createLocalFaunaClient();

const {
  Collection, CreateCollection, CreateIndex, Exists, If,
  Index
} = faunadb.query;

const CreateCollectionIfNotExists = ({ name }) =>
  If(
    Exists(Collection(name)),
    true,
    CreateCollection({ name }));

const CreateIndexIfNotExists = ({ name, ...rest }) =>
  If(
    Exists(Index(name)),
    true,
    CreateIndex({ name, ...rest }));


const queries = [
  // Create all collections before creating indexes which apply to them
  CreateCollectionIfNotExists({ name: "user" }),

  // Create indexes
  CreateIndexIfNotExists({
    name: "user_identity_unique",
    source: { collection: Collection("user") },
    unique: true,
    serialized: true,
    terms: [{ field: ["identity"] }],
    values: [{ field: ["identity"] }]
  }),
]

// Process each query in sequence, awaiting each one
const processNext = async () => {
  if (queries.length === 0) return;

  const next = queries.shift();

  await faunaClient.query(next)

  processNext();
}

// Actually run all of the queries above
processNext()
// Can test query connection with this. Should print "true"
// faunaClient.query(true).then(console.log)
