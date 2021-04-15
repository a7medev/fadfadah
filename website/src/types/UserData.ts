import MiniUser from './MiniUser';
import Settings from './Settings';

interface UserData extends MiniUser {
  settings?: Settings;
}

export default UserData;
