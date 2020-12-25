var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Millisecond } from "./duration";
export function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
}
export function sleep(d) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, d / Millisecond);
        });
    });
}
export function getProperty(o, name) {
    return o[name]; // o[name] is of type T[K]
}
export function nullize(o) {
    for (const key in o) {
        // todo: o[key] as object 不做强转的类型报错 后续再思考怎么处理
        if (typeof o[key] === "object" && o[key] instanceof Array) {
            // todo: 类型不强转就报错的问题后续再处理
            o[key] = [];
            continue;
        }
        if (typeof o[key] === "object") {
            nullize(o[key]);
            continue;
        }
        // todo: 类型不强转就报错的问题后续再处理
        o[key] = null;
    }
}
export function equals(o1, o2) {
    if (typeof o1 !== typeof o2) {
        return false;
    }
    if (typeof o1 == "string" || typeof o1 == "number" || o1 === null || typeof o1 == "boolean") {
        return o1 === o2;
    }
    if (typeof o1 == "object" && !(o1 instanceof Array)) {
        for (let key in o1) {
            if (o2[key] === undefined) {
                return false;
            }
            if (!equals(o1[key], o2[key])) {
                return false;
            }
        }
        return true;
    }
    // array
    if (o1 instanceof Array && o2 instanceof Array) {
        if (o1.length != o2.length) {
            return false;
        }
        for (let i = 0; i < o1.length; ++i) {
            if (!equals(o1[i], o2[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}
