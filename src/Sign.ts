import {Md5} from "ts-md5";
import {random} from "./fun";

export function SignNonceStr(len: number = 20): string {
  let str: string = Md5.hashStr(random(1000, 9999) + "" + random(10000, 99999)).toString();
  let rep: number = Math.floor(len / 32);
  let sup: number = len % 32;
  let res: string = "";
  for (let i: number = 0; i < rep; ++i) {
    res += str;
  }
  res += str.substring(0, sup);
  return res;
}
