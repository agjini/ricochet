import { AuthUser, ListOptions, ListResult, User, UserService } from "../api";
import { get, postAs, remove } from "./http";

export class UserServiceClient implements UserService {

  login(email: string, password: string): Promise<AuthUser> {
    return postAs("/api/login", { body: { email, password } });
  }

  // @ts-ignore
  isValid(token?: string): Promise<AuthUser> {
    return get("/api/me");
  }

  async get(id: string): Promise<User> {
    return get(`/api/user/${id}`);
  }

  list(listOptions: ListOptions<User> = {}): Promise<ListResult<User>> {
    return get("/api/user", { params: listOptions });
  }

  async delete(id: string): Promise<void> {
    await remove(`/api/user/${id}`);
  }

  add(user: User): Promise<User> {
    return postAs("/api/user/", { body: user });
  }

  update(id: string, user: Partial<User>): Promise<User> {
    return postAs(`/api/user/${id}`, { body: user });
  }

}
