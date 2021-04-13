import Settings from './Settings';
import Gender from './Gender';

interface MiniUser {
  uid: string;
  displayName?: string;
  photoURL?: string;
  verified: boolean;
  gender?: Gender;
  username?: string;
  settings: Settings;
}

export default MiniUser;
