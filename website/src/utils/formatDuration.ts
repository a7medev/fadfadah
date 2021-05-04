const formatDuration = (seconds: number) => {
  var hrs = ~~(seconds / 3600);
  var mins = ~~((seconds % 3600) / 60);
  var secs = ~~seconds % 60;

  var ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + String(mins).padStart(2, '0') + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;

  return ret;
};

export default formatDuration;
