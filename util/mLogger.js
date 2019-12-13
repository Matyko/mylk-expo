const config = {
  isVerbose: true,
};

export default function Logger(message) {
  const caller = Logger.caller;
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const time =
    date.toDateString() +
    ' ' +
    (hours < 10 ? '0' + hours : hours) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ':' +
    (seconds < 10 ? '0' + seconds : seconds);
  console.log(
    `\x1b[0m\x1b[36m${time}  \x1b[37m| \x1b[33mfunction: ${caller.name}  ${
      config.isVerbose ? '\x1b[37m| \x1b[35mmessage:' + message + '\x1b[0m' : ''
    }`
  );
}

Logger.setConfig = function(configMod) {
  for (const key of Object.keys(configMod)) {
    config[key] = configMod[key];
  }
};
