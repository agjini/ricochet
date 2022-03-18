import {Entity, ListOptions, ListResult, toSearchQuery} from "../api";
import {Collection, Db, MongoClient} from "mongodb";
import {Document} from "bson";

const host = process.env.NODE_ENV === "production" ? "mongo" : "localhost";
const user = encodeURIComponent(process.env.NODE_ENV === "production" ? process.env.MONGO_USER! : "mongoadmin");
const password = encodeURIComponent(process.env.NODE_ENV === "production" ? process.env.MONGO_PASSWORD! : "secret");

function getDatabase(): string {
  if (!process.env.MONGO_DB) {
    throw new Error("process.env.MONGO_DB must be defined to use mongo");
  }
  return process.env.MONGO_DB;
}

export const Url = `mongodb://${user}:${password}@${host}:27017`;

interface Sequence extends Entity {
  value: number;
}

export class Mongo {

  private db: Db | null = null;

  private async initMongo(): Promise<void> {
    if (!this.db) {
      try {
        const mongo = await MongoClient.connect(Url);

        this.db = mongo.db(getDatabase());
      } catch (err) {
        console.error(`Mongo Db connection failed: ${err}`);
      }
    }
  }

  async collection<T>(collection: string): Promise<Collection<T>> {
    const db = await this.getDb();
    return db.collection(collection);
  }

  async list<T extends Document = Document>(collection: string, { limit, skip, filter, sort, search }: ListOptions<T> = {}, searchFields?: Array<keyof T>): Promise<ListResult<T>> {
    const c = await this.collection<T>(collection);
    const mongoSearch = searchFields && toSearchQuery(search, searchFields);
    const productCursor = c.find({ ...filter, ...mongoSearch }, { skip, limit })
      .sort({ ...sort, _id: -1 });
    const total = productCursor.bufferedCount();
    const results = await productCursor.toArray();
    return { results: results as T[], total };
  }

  private async getDb(): Promise<Db> {
    await this.initMongo();
    if (!this.db) {
      throw new Error("No mongo connection available");
    }
    return this.db;
  }

  async getNextSequence(sequenceName: string): Promise<number> {
    const collection = await this.collection<Sequence>("sequence");
    const sequence = await collection.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: "after" }
    );
    return sequence.value!.value;
  }

}
