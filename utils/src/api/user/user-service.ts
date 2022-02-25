import { ListOptions, ListResult } from "../entity";
import { AuthUser,  User } from "./user";

export interface UserService {

  login(email: string, password: string): Promise<AuthUser>;

  isValid(token?: string): Promise<AuthUser>;

  get(id: string): Promise<User>;

  list(listOptions?: ListOptions<User>): Promise<ListResult<User>>;

  delete(id: string): Promise<void>;

  add(article: User): Promise<User>;

  update(id: string, article: Partial<User>): Promise<User>;
}
