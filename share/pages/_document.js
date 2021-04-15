import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar">
        <Head>
          <meta
            name="description"
            content="فضفضة يسمح لك بالإفصاح عما بداخلك للآخرين."
          />
          <meta
            name="keywords"
            content="فضفضة,فضفضه,fadfadah,fadfada,fdfda,fdfdah,sarahah,saraha,sarahaa,صراحة,صراحه"
          />
          <meta name="author" content="https://fadfadah.me/" />

          <meta
            property="og:image"
            content="/images/card-image.png"
          />
          <meta property="og:title" content="" />
          <meta property="og:description" content="" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" />
          <meta name="twitter:description" />
          <meta name="twitter:domain" content="https://fadfadah.me/" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
