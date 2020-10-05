import MiniUser from './MiniUser';

interface WhoRequest {
  id?: string;
  from: MiniUser;
  message: {
    id: string;
    content: string;
  };
  sentAt: string;
}

export default WhoRequest;
