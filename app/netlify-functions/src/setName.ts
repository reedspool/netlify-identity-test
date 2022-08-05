import { Handler } from "@netlify/functions";
import { parseJsonBody, assertSchema, disallowUnauthenticated, getUniqueIdentity, responseOk, responseError, responseUserError } from "lib/netlify-function-utilities/src"
import { client as faunaClient, timestampNow, q } from "lib/fauna/src";
import { createOrUpdateUser } from "lib/model/src";

const { Create, Collection } = q;

export const handler: Handler = async (event, context) => {
    disallowUnauthenticated(event, context);

    const data = parseJsonBody(event);

    assertSchema(data, { name: "string" });

    const identity = getUniqueIdentity(context);

    // assertSchema does not ensure there are no extra properties (it could), so
    // we must unpack and repack to save, lest we allow bad actors to push
    // whatever they like
    const { name } = data;

    try {
        const queryResults = await faunaClient.query(
            createOrUpdateUser({
                name,
                identity,
                created_ts: timestampNow()
            }));

        return responseOk({ body: JSON.stringify({ message: `Got name ${name}`, queryResults }) })
    } catch (error) {
        if (!(error instanceof Error)) throw error;
        const myError = error as unknown as { description: string };
        console.error(error);


        // TODO is just rethrowing this unsafe or just useless?
        throw error;
    }
};
