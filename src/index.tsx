import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import * as serviceWorker from './serviceWorker';
// import AuthContextProvider from './contexts/AuthContext';
import './assets/scss/main.scss';
// import 'moment/locale/ar';

ReactDOM.render(
  <div
    className="bg-primary text-white d-flex justify-content-center align-items-center flex-column p-5"
    style={{
      height: '100vh',
      width: '100%'
    }}
  >
    <h1>سنعود قريبًا.</h1>
    <p className="lead">
      نأسف على إخباركم أن فضفضة توقف عن العمل لفترة قصيرة، وسنعلمكم عندما نعود.
    </p>
    <p className="text-left w-100" style={{ opacity: 0.8 }}>
      {' '}
      - مع تحيات فريق فضفضه
    </p>
    {/* <AuthContextProvider>
    <App />
  </AuthContextProvider> */}
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
