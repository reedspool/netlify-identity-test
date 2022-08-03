import { Handler } from "@netlify/functions";
import { parseJsonBody, htmxHeaders, assertSchema } from "lib/netlify-function-utilities/src"
import { client as faunaClient, timestampNow, q } from "lib/fauna/src";

export const handler: Handler = async (event) => {
    const data = parseJsonBody(event);

    assertSchema(data, { name: "string" });

    // assertSchema does not ensure there are no extra properties (it could), so
    // we must unpack and repack to save, lest we allow bad actors to push
    // whatever they like
    const { name } = data;

    try {
        const expr = q.Create(q.Collection("user"), {
            data: {
                ...{ name },
                created_ts: timestampNow()
            }
        });
        const queryResults = faunaClient.query(expr);

        return {
            statusCode: 200,
            headers: htmxHeaders,
            body: JSON.stringify({ message: `Got name ${name}`, queryResults }),
        };
    } catch (error) {
        // TODO is just rethrowing this unsafe or just useless?
        throw error;
    }
};