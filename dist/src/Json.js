import { ClassArray } from "./ClassArray";
const jsonMapProperty = Symbol("json->property");
const propertyMapJson = Symbol("property->json");
const jsonDes = Symbol("jsonDes");
export class Json {
    toJson(o) {
        let to = {};
        this.class2json(to, o);
        return JSON.stringify(to);
    }
    class2json(to, from) {
        let property2jsonMap = from[propertyMapJson] || new Map();
        for (let key in from) {
            let toKey = property2jsonMap.get(key) || key;
            if (typeof from[key] === "undefined"
                || from[key] === null) {
                continue;
            }
            if (typeof from[key] === "object" && from[key] !== null
                && !(from[key] instanceof Array)) {
                to[toKey] = {};
                this.class2json(to[toKey], from[key]);
                continue;
            }
            // 循环复制数组
            if (from[key] instanceof Array) {
                to[toKey] = [];
                from[key].forEach((value) => {
                    if (typeof value === "object" && value !== null) {
                        let item = {};
                        to[toKey].push(item);
                        this.class2json(item, value);
                    }
                    else {
                        to[toKey].push(value);
                    }
                });
                continue;
            }
            // 基本变量赋值
            to[toKey] = from[key];
        }
    }
    fromJson(json, Ret) {
        let ret = new Ret();
        let err = null;
        if (typeof json == "string") {
            err = this.parseJsonObjectToClass(ret, JSON.parse(json), Ret.name);
        }
        else if (typeof json == "object") {
            err = this.parseJsonObjectToClass(ret, json, Ret.name);
        }
        return [ret, err];
    }
    parseJsonObjectToClass(to, jsonObject, name) {
        name = name || "";
        return this.classFromJson(to, jsonObject, name);
    }
    classFromJson(to, from, className) {
        let json2PropertyMap = to[jsonMapProperty] || new Map();
        // 清空原来的非对象(数组)值
        // TODO: for in 目前查找的资料只是会遍历出可枚举的，同时查得对象的方法是不可枚举的，但是
        // 这里出现了 for in 遍历出了对象的方法。（es5的浏览器环境出现此现象，其他编译方式与运行环境未验证）
        // 所以这里加了“冗余”的条件判断
        for (let key in to) {
            if (typeof to[key] !== "object"
                && typeof to[key] !== "function"
                && to.propertyIsEnumerable(key)) {
                to[key] = null;
            }
        }
        for (let key in from) {
            let toKey = json2PropertyMap.get(key) || key;
            // json值就为空，直接跳过
            if (!to.hasOwnProperty(toKey) || typeof from[key] === "undefined"
                || from[key] === null) {
                continue;
            }
            // class对象没有这项值，就跳过
            if (typeof to[toKey] === "undefined") {
                continue;
            }
            // 除基本类型外，类型必须一样
            if (typeof to[toKey] !== typeof from[key]
                && typeof from[key] === "object") {
                return Error(`type is not same for ${className}[${toKey}]`);
            }
            // class对象的初始值不能为null，否则原型链会丢失
            if (typeof from[key] === "object" && from[key] !== null
                && typeof to[toKey] === "object" && to[toKey] === null) {
                return Error(className + "[" + toKey + `] --- json is object, but the dest class is 'null'
        . class type must be initialized by new() `);
            }
            // class 对象就递归复制
            if (typeof to[toKey] === "object" && to[toKey] !== null
                && !(to[toKey] instanceof Array)
                && typeof from[key] === "object"
                && !(from[key] instanceof Array)) {
                // 优先使用自定义的解码器
                if (to[toKey][jsonDes]) {
                    to[toKey]
                        = (to[toKey][jsonDes]).deserialize(from[key]);
                }
                else {
                    let err = this.classFromJson(to[toKey], from[key], to[toKey].name);
                    if (err) {
                        return err;
                    }
                }
                continue;
            }
            // 如果json是对象数组，class对象必须是ClassArray<>的数组
            if ((from[key] instanceof Array)
                && (from[key].length !== 0)
                && !(to[toKey] instanceof ClassArray)
                && typeof from[key][0] === "object") {
                return Error(`Type of ${className}[${toKey}] is 
          not ClassArray. Please use ClassArray<>`);
            }
            // 循环复制数组
            if (from[key] instanceof Array) {
                let arr = (to[toKey]);
                arr.splice(0, arr.length);
                for (let value of from[key]) {
                    if (typeof value === "object" && value !== null) {
                        let item = (to[toKey]).addAItem();
                        let err = this.classFromJson(item, value, item.name);
                        if (err) {
                            return err;
                        }
                    }
                    else {
                        to[toKey].push(value);
                    }
                }
                continue;
            }
            // 基本变量赋值
            to[toKey] = from[key];
        }
        return null;
    }
}
export function SerializedName(key, ...keys) {
    return function decorator(prototype, name) {
        if (!prototype[jsonMapProperty]) {
            prototype[jsonMapProperty] = new Map();
        }
        if (!prototype[propertyMapJson]) {
            prototype[propertyMapJson] = new Map();
        }
        prototype[jsonMapProperty].set(key, name);
        prototype[propertyMapJson].set(name, key);
        for (let str of keys) {
            prototype[jsonMapProperty].set(str, name);
        }
    };
}
export class JsonBuilder {
    registerTypeAdapter(clazz, josndes) {
        clazz.prototype[jsonDes] = josndes;
        return this;
    }
    build() {
        return new Json();
    }
}
