import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import AuthProvider from './contexts/AuthContext';
import './assets/scss/main.scss';
import 'moment/locale/ar';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
