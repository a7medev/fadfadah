interface Message<Time> {
  id?: string;
  to: string;
  from?: string | null;
  love: boolean;
  allowRead: boolean;
  content: string;
  createdAt: Time;
}

export default Message;
