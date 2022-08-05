import faunadb from "faunadb";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
if (!IS_DEVELOPMENT) throw new Error("Do not run this script in a non-development environment");
export const createLocalFaunaClient = () => new faunadb.Client({
  // Secret must match ./faunadb-local-config.yml "auth_root_key" value
  secret: "secret",
  domain: "localhost",
  port: 8543,
  scheme: "http",
  // Docs say this is not needed for javascript driver https://docs.fauna.com/fauna/current/integrations/dev
  // endpoint: "http://localhost:8443"
})


const faunaClient = createLocalFaunaClient();

const {
  Collection, CreateCollection, CreateIndex, Exists, If,
  Index, Delete
} = faunadb.query;

////////////////////////////////////////////////////////////////////////////////
//
// NOTE: The below queries are written such that they can be copied & pasted
//       as valid FQL. You can then run them in the Fauna web portal's Shell
//       or using the fauna-shell CLI. To maintain this desirable quality,
//       follow the rules stated below.
//
//       JS comments will be invalid FQL. Don't copy them.
//
//       Always destructure methods off `fauna.query`, so you can use them
//       without prefix.
//
//       Always use double quote marks ("). Though single quotes ('),
//       are valid JS, they aren't in FQL.
//
//       The abnormal comma placement helps avoid them when copying.
//
////////////////////////////////////////////////////////////////////////////////
const createQueries = [
  If(
    Exists(Collection("user")),
    true,
    CreateCollection({ name: "user" }))
  ,

  If(
    Exists(Index("user_identity_unique")),
    true,
    CreateIndex({
      name: "user_identity_unique",
      source: { collection: Collection("user") },
      unique: true,
      serialized: true,
      terms: [{ field: ["data", "identity"] }],
      values: [{ field: ["data", "identity"] }]
    }))
  ,

  If(
    Exists(Index("user_search_by_identity")),
    true,
    CreateIndex({
      name: "user_search_by_identity",
      source: { collection: Collection("user") },
      unique: false,
      serialized: true,
      terms: [{ field: ["data", "identity"] }],
      values: [{ field: ["data", "identity"] }, { field: ["ref"] }]
    }))
]

const deleteQueries = [
  // Delete if exists
  // NOTE: Deleting a collection will also, I believe, delete all associated
  //
  // If(
  //   Exists(Collection("user")),
  //   Delete(Collection("user")),
  //   false
  // )
  // ,

  // Delete if exists
  If(
    Exists(Index("user_identity_unique")),
    Delete(Index("user_identity_unique")),
    false
  )
  ,


  // Delete if exists
  // DELETE - remove
  If(
    Exists(Index("user_sorted_by_identity")),
    Delete(Index("user_sorted_by_identity")),
    false
  )
  ,


  // Delete if exists
  If(
    Exists(Index("user_search_by_identity")),
    Delete(Index("user_search_by_identity")),
    false
  )
  ,
]

// Process each query in sequence, awaiting each one
let index = 0;
const processNext = async (queries) => {
  if (index === queries.length) return;

  const next = queries[index];

  try {
    const results = await faunaClient.query(next)
    console.log(`Ran query #${index}:`)
    console.log(JSON.stringify(next))
    console.log("Results:")
    console.log(results);
  } catch (error) {
    console.error(`Fauna encountered an error running query #${index} (base 0):`);
    console.error(JSON.stringify(next, null, 2));
    console.error(JSON.stringify(JSON.parse(error.requestResult.responseRaw), null, 2))
    throw error;
  }

  index++;
  processNext(queries);
}

// Actually run all of the queries above
// NOTE: Fauna caches values for up to a minute, so wait to re-create after deleting for a minute
//       i.e. DON'T RUN BOTH OF THESE AT THE SAME TIME
// index = 0; processNext(deleteQueries)
index = 0; processNext(createQueries)

// Can test query connection with this. Should print "true"
// faunaClient.query(true).then(console.log)

// Promise wrapper for setTimeout
function wait(millis) {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  })
}
