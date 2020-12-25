import { Md5 } from "ts-md5";
import { random } from "./fun";
export function SignNonceStr(len = 20) {
    let str = Md5.hashStr(random(1000, 9999) + "" + random(10000, 99999)).toString();
    let rep = Math.floor(len / 32);
    let sup = len % 32;
    let res = "";
    for (let i = 0; i < rep; ++i) {
        res += str;
    }
    res += str.substring(0, sup);
    return res;
}
