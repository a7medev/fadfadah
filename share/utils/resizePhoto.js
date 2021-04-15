const resizePhoto = (photoURL, size = 64) => {
  if (!photoURL) {
    return null;
  }

  // Google sign in profile photo
  if (photoURL.includes('googleusercontent')) {
    const resizeString = `-g=s${size}-c`;
    const resizeRegEx = /-g=s[0-9]+(-c)?$/;

    if (resizeRegEx.test(photoURL)) {
      return photoURL.replace(resizeRegEx, resizeString);
    }

    return photoURL + resizeString;
  }

  if (photoURL.includes('facebook')) {
    return photoURL + `?height=${size}`;
  }

  return photoURL;
};

export default resizePhoto;
