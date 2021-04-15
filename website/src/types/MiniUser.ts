import Gender from './Gender';

interface MiniUser {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  verified?: boolean;
  username?: string;
  gender?: Gender;
}

export default MiniUser;
