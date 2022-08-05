import { client, q, values } from "lib/fauna/src";

const { Match, Get, Index, If, Exists, Update, Select, Create, Collection } = q;

export type User = {
    identity: string,
    name?: string,
    created_ts: number
}

export const userCollection = () => Collection("user")

export const matchUserByIdentity = (identity: User["identity"]) =>
    Match(
        Index("user_search_by_identity"),
        identity)

export const getUserByIdentity = (identity: User["identity"]) =>
    Get(
        Match(
            Index("user_search_by_identity"),
            identity))

export const createOrUpdateUser = (user: User) =>
    If(
        Exists(
            Match(
                Index("user_search_by_identity"),
                user.identity)),
        Update(
            Select(
                ["ref"],
                Get(
                    Match(
                        Index("user_search_by_identity"),
                        user.identity))),
            { data: user }
        ),
        Create(
            Collection("user"),
            { data: user }
        ))

export const queryUserByIdentity = async (identity: User["identity"]) =>
    client.query<values.Document<User>>(getUserByIdentity(identity));
