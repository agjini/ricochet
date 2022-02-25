import * as nodemailer from "nodemailer";
import { ObjectId } from "bson";
import { MessageService, Message , ListOptions, ListResult ,ResourceNotFoundError } from "../api";
import { Mongo } from "./mongo";

const SMTP_TO = process.env.SMTP_TO as string;
const SMTP_HOST = process.env.SMTP_HOST as string;
const SMTP_PORT = (process.env.SMTP_PORT || 587) as number;
const SMTP_SECURE = (process.env.SMTP_SECURE || false) as boolean;
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;

export class MessageServiceImpl implements MessageService {

  private transport: any;

  constructor(private mongo: Mongo) {
    this.transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      }
    });
  }

  async list(listOptions: ListOptions<Message> = {}): Promise<ListResult<Message>> {
    return this.mongo.list("message", listOptions);
  }

  async send(message: Message): Promise<Message> {
    const mail = {
      from: message.from,
      to: SMTP_TO,
      subject: `Message envoyé depuis le site par ${message.name} : ${message.subject}`,
      html: "<html lang=\"fr\">"
        + "<body>"
        + `<strong>Envoyé par : </strong>${message.name}<br>`
        + `<strong>Sujet : </strong>${message.subject}<br>`
        + `<strong>Message : </strong><br>${message.message}<br>`
        + "</body>"
        + "</html>"
    };

    const info = await this.transport.sendMail(mail);
    console.info("Mail sent ", info);

    const collection = await this.collection();

    const id = message._id || new ObjectId().toString();
    await collection.insertOne({ ...message, _id: id, sentAt: new Date() });

    return this.get(id);
  }

  async delete(id?: string): Promise<void> {
    const collection = await this.collection();
    if (id) {
      if ((await collection.deleteOne({ _id: id })).deletedCount === 0) {
        throw new ResourceNotFoundError(`Message not found '${id}'`);
      }
    } else {
      await collection.deleteMany({});
    }
  }

  private async get(id: string): Promise<Message> {
    const collection = await this.collection();
    const item = await collection.findOne({ _id: id });
    if (!item) {
      throw new ResourceNotFoundError(`Message not found '${id}'`);
    }
    return item;
  }

  private async collection() {
    return this.mongo.collection<Message>("message");
  }

}
