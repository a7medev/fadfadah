import MiniUser from "./MiniUser";

interface Message<Time> {
  id?: string;
  to: string;
  from?: MiniUser;
  love: boolean;
  isAnonymous?: boolean;
  content: string;
  createdAt: Time;
}

export default Message;
