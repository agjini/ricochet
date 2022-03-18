import { Filter } from "mongodb";

export interface Entity {
    readonly _id?: string;
}

export declare type SortDirection = 1 | -1 | "asc" | "desc" | "ascending" | "descending" | {
    $meta: string;
};

export type SortOptions<T> = { [P in keyof T]?: SortDirection };

export type Reference<T extends Entity> = string | T;

export function getId<T extends Entity>(r: Reference<T>): string {
    if (typeof (r) === "object") {
        return r._id!.toString();
    }
    return r;
}

export interface ListOptions<T> {
    readonly filter?: Filter<T>;
    readonly skip?: number;
    readonly limit?: number;
    readonly search?: string;
    readonly sort?: SortOptions<T>;
}

export interface ListResult<T> {
    readonly results: T[];
    readonly total: number;
}

export function toSearchQuery<T>(search?: string, searchFields?: Array<keyof T>): Filter<T> {
    if (!search || !searchFields) {
        return {};
    }
    if (search === "") {
        return {};
    }
    const searchPattern = search.split(/\s+/)
        .map((t) => {
            const regExp = new RegExp(t, "gi");
            return ({
                $or: searchFields.map((s) => ({ [s]: regExp }))
            });
        });
    // @ts-ignore
    return { $and: searchPattern };
}
