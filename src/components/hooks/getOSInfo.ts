import {UAParser} from "ua-parser-js";

export const getOSInfo = () => {
  const parser = new UAParser();
  const os = parser.getOS();
  // os.name = "Windows", os.version = "11.0"
  return `${os.name}`;
};