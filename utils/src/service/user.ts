import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import {
  ResourceNotFoundError,
  UnauthorizedError,
  UserService,
  AuthUser,
  ListOptions,
  ListResult,
  User,
  PartialUser
} from "../api";
import { UploadService } from "../api";
import { Mongo } from "./mongo";

export const Secret = process.env.SECRET || "dsfsoiuoiiphf_è_izoookl !!:pibjaazzh";

export class UserServiceImpl implements UserService {

  constructor(private mongo: Mongo, private uploadService: UploadService) {
  }

  async login(email: string, inPassword: string): Promise<AuthUser> {
    const collection = await this.collection();
    const user = await collection.findOne({ email });
    if (user) {
      if (await bcrypt.compare(inPassword, user.password)) {
        const { password, ...partialUser } = user;
        const token = jwt.sign(partialUser, Secret, {
          expiresIn: "10h"
        });
        return { token, user: partialUser };
      }
      throw new UnauthorizedError();
    } else {
      throw new UnauthorizedError();
    }
  }

  async isValid(token?: string): Promise<AuthUser> {
    let t = token?.trim();
    if (t) {
      try {
        if (t.startsWith("Bearer")) {
          t = t.substring(6).trim();
        }
        const partialUser = jwt.verify(t, Secret) as PartialUser;
        const newToken = jwt.sign(
          { _id: partialUser._id, email: partialUser.email, name: partialUser.name, photo: partialUser.photo, role: partialUser.role },
          Secret,
          {
            expiresIn: "10h"
          }
        );
        return { token: newToken, user: partialUser };
      } catch (e) {
        console.warn("Unauthorized token", e);
        throw new UnauthorizedError();
      }
    } else {
      throw new UnauthorizedError();
    }
  }

  async list(listOptions: ListOptions<User> = {}): Promise<ListResult<User>> {
    return this.mongo.list("user", listOptions);
  }

  async get(id: string): Promise<User> {
    const collection = await this.collection();
    const item = await collection.findOne({ _id: id }, { projection: { password: 0 } });
    if (!item) {
      throw new ResourceNotFoundError(`User not found '${id}'`);
    }
    return item;
  }

  async add(user: User): Promise<User> {
    const collection = await this.collection();
    const id = new ObjectId().toString();
    const password = await bcrypt.hash(user.password, 5);
    const encoded = { ...user, password };
    await collection.insertOne({ ...encoded, _id: id });
    return this.get(id.toString());
  }

  async delete(id: string): Promise<void> {
    const collection = await this.collection();
    const user = await this.get(id);
    await collection.deleteOne({ _id: id });
    await this.uploadService.delete(`user-${user._id}`);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const collection = await this.collection();
    let encoded = { ...user };
    if (user.password) {
      const password = await bcrypt.hash(user.password, 5);
      encoded = { ...encoded, password };
    }
    await collection.updateOne(
      { _id: id },
      { $set: encoded },
      { upsert: true }
    );
    return this.get(id);
  }

  private async collection() {
    return this.mongo.collection<User>("user");
  }

}
