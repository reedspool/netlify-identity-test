import { Handler } from "@netlify/functions";

export const basicHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
}

export const htmxHeaders = {
    ...basicHeaders,
    "Access-Control-Allow-Headers": [
        "Content-Type",
        "HX-Current-URL",
        "HX-Request",
        "HX-Boosted",
        "HX-Current-URL",
        "HX-History-Restore-Request",
        "HX-Prompt",
        "HX-Request",
        "HX-Target",
        "HX-Trigger-Name",
        "HX-Trigger"
    ].join(", "),
    "Access-Control-Expose-Headers": [
        "HX-Push",
        "HX-Redirect",
        "HX-Refresh",
        "HX-Retarget",
        "HX-Trigger",
        "HX-Trigger-After-Settle",
        "HX-Trigger-After-Swap"
    ].join(", "),
};

export const handler: Handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: htmxHeaders,
        body: JSON.stringify({ message: context.clientContext?.user ? "yes" : "no" }),
    };
};
