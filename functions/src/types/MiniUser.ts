import Settings from './Settings';
import Gender from './Gender';

interface MiniUser {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
  verified: boolean;
  gender?: Gender;
  username?: string;
  settings: Settings;
}

export default MiniUser;
