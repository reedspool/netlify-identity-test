import { HandlerEvent, HandlerContext } from "@netlify/functions";
import { htmxHeaders, responseUnauthenticated } from "./";

export const disallowUnauthenticated = (event: HandlerEvent, context: HandlerContext) => {
    if (context.clientContext?.user) return;

    console.warn(`Unauthenticated request to '${event.rawUrl}'`)

    return responseUnauthenticated();
}

export const getUniqueIdentity = (context: HandlerContext) => {
    const identity = context.clientContext?.user?.sub;

    if (typeof identity !== "string")
        throw new Error(`Case of mistaken identity: '${identity}'`)

    return identity;
}
