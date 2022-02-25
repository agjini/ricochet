import { Entity } from "../entity";

export interface Message extends Entity {
    readonly from: string;
    readonly name?: string;
    readonly subject: string;
    readonly message: string;
    readonly createdAt: Date;
    readonly sentAt?: Date;
}
