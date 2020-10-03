interface Message<Time> {
  id?: string;
  to: string;
  from?: string;
  love: boolean;
  content: string;
  createdAt: Time;
}

export default Message;
