import { Handler } from "@netlify/functions";
import { htmxHeaders } from "../../../lib/netlify-function-utilities/src/headers"

export const handler: Handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: htmxHeaders,
        body: JSON.stringify({ message: context.clientContext?.user ? "yes" : "no" }),
    };
};
