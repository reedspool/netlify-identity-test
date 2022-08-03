import { HandlerEvent } from "@netlify/functions";

export const parseJsonBody: (event: HandlerEvent) => any = (event) => {
    if (!event.body) return null;

    try {
        return JSON.parse(event.body);
    } catch (error: any) {
        throw {
            name: "JSON Parse Error",
            message: error.toString(),
            description: "There was a problem decoding the JSON request body"
        }
    }
}
