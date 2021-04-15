import './global.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <main dir="rtl">
      <Component {...pageProps} />
    </main>
  );
};

export default MyApp;
