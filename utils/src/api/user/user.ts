import {Entity} from "../entity"

export interface User extends Entity {
    readonly email: string;
    readonly name: string;
    readonly photo?: string;
    readonly role: string;
    readonly password: string;
}

export type PartialUser = Omit<User, "password">;

export interface AuthUser {
    readonly token: string;
    readonly user: PartialUser;
}
