import Gender from './Gender';
import Settings from './Settings';

interface UserData {
  id?: string;
  gender?: Gender;
  settings?: Settings;
}

export default UserData;
