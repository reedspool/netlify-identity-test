
import { Handler } from "@netlify/functions";
import { disallowUnauthenticated, getUniqueIdentity, responseOk } from "lib/netlify-function-utilities/src"
import { queryUserByIdentity } from "lib/model/src";

export const handler: Handler = async (event, context) => {
    disallowUnauthenticated(event, context);

    const identity = getUniqueIdentity(context);

    try {
        const queryResults = await queryUserByIdentity(identity);

        return responseOk({
            body: JSON.stringify({ message: `See query results`, data: queryResults.data.name })
        })
    } catch (error) {
        console.error(error);
        // TODO is just rethrowing this unsafe or just useless?
        throw error;
    }
};
