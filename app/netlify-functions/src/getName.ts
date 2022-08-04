
import { Handler } from "@netlify/functions";
import { disallowUnauthenticated, getUniqueIdentity, responseOk } from "lib/netlify-function-utilities/src"
import { client as faunaClient, q } from "lib/fauna/src";

const { Match, Index, Lambda, Get, Var, Paginate, Map } = q;

export const handler: Handler = async (event, context) => {
    disallowUnauthenticated(event, context);

    const identity = getUniqueIdentity(context);

    try {
        const queryResults = await faunaClient.query(
            Map(
                Paginate(
                    Match(
                        Index("user_search_by_identity"),
                        identity),
                    { size: 10000 }),
                Lambda("user", Get(Var("user"))))
        );

        return responseOk({
            body: JSON.stringify({ message: `See query results`, queryResults })
        })
    } catch (error) {
        // TODO is just rethrowing this unsafe or just useless?
        throw error;
    }
};
