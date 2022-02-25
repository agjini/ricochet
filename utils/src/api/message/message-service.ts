import { Message } from ".";
import { ListOptions, ListResult } from "../entity";

export interface MessageService {

  list(listOptions?: ListOptions<Message>): Promise<ListResult<Message>>;

  send(message: Message): Promise<Message>;

  delete(id?: string): Promise<void>;

}
