import { MessageService, Message, ListOptions, ListResult } from "../api";
import { get, postAs, remove } from "./http";

export class MessageServiceClient implements MessageService {

  send(message: Message): Promise<Message> {
    return postAs("/api/message", { body: message });
  }

  async delete(id?: string): Promise<void> {
    if (id) {
      await remove(`/api/message/${id}`);
    } else {
      await remove("/api/message");
    }
  }

  list(listOptions: ListOptions<Message> = {}): Promise<ListResult<Message>> {
    return get("/api/message", { params: listOptions });
  }

}
