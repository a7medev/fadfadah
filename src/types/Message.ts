interface Message<Time> {
  id?: string;
  to: string;
  from?: string;
  love: boolean;
  isAnonymous?: boolean;
  content: string;
  createdAt: Time;
}

export default Message;
