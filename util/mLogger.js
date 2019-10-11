export default function Logger(message) {
  const caller = Logger.caller;
  console.log(
    `\x1b[0m\x1b[36m${new Date().toDateString()}  \x1b[37m| \x1b[33mfunction: ${
      caller.name
    }  \x1b[37m| \x1b[35mmessage: ${message}\x1b[0m`
  );
}
