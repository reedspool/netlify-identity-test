import { Response } from "@netlify/functions/dist/function/response";
import { htmxHeaders } from "./";

// Note: Each of the below functions subvert type checking with `as` because
// otherwise TypeScript thinks this will not have the required "statusCode"
// since it could be undefined in Partial<Response>
export type MyOptionalResponseFunction = (response?: Partial<Response>) => Response;

const responseOkDefault: Response = {
    statusCode: 200,
    headers: htmxHeaders,
    body: ""
};

export const responseOk: MyOptionalResponseFunction = (response = responseOkDefault) => {
    if (response === responseOkDefault) return responseOkDefault;
    return { ...responseOkDefault, ...response } as Response;
}

const responseErrorDefault: Response = {
    ...responseOkDefault,
    statusCode: 500,
    body: "Something went wrong :("
}
export const responseError: MyOptionalResponseFunction = (response = responseErrorDefault) => {
    if (response === responseErrorDefault) return responseErrorDefault;
    return { ...responseErrorDefault, ...response } as Response;
}

const responseUnauthenticatedDefault: Response = {
    ...responseOkDefault,
    statusCode: 401,
    body: "Authorization required"
}
export const responseUnauthenticated: MyOptionalResponseFunction = (response = responseUnauthenticatedDefault) => {
    if (response === responseUnauthenticatedDefault) return responseUnauthenticatedDefault;
    return { ...responseUnauthenticatedDefault, ...response } as Response;
}
