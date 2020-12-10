

import { ClassArray } from "./ClassArray";
import { DefaultConstructor } from "./DefaultConstructor";
import { Class } from "./Class";

const jsonMapProperty:symbol = Symbol("json->property");
const propertyMapJson:symbol = Symbol("property->json");
const jsonDes:symbol = Symbol("jsonDes");


export interface JsonDeserializer {
  deserialize(jsonObject: object): any;
}

export class Json {

  public toJson(o: any): string {
    let to = {};

    this.class2json(to, o);

    return JSON.stringify(to);
  }

  private class2json(to:object, from:object):void {
    let property2jsonMap:Map<string, string> = (<any>from)[propertyMapJson] || new Map();

    for (let key in from) {
      let toKey = property2jsonMap.get(key) || key;

      if (typeof (<any>from)[key] === "undefined"
        || (<any>from)[key] === null) {
          continue;
        }

      if (typeof (<any>from)[key] === "object" && (<any>from)[key] !== null
        && !((<any>from)[key] instanceof Array)) {
        (<any>to)[toKey] = {};
        this.class2json((<any>to)[toKey], (<any>from)[key]);
        continue;
      }

      // 循环复制数组
      if ((<any>from)[key] instanceof Array) {
        (<any>to)[toKey] = [];

        (<any>from)[key].forEach((value:any)=>{
          if (typeof value === "object" && value !== null) {
            let item:any = {};
            (<any>to)[toKey].push(item);
            this.class2json(item, value);
          } else {
            (<any>to)[toKey].push(value);
          }
        });
        continue;
      }

      // 基本变量赋值
      (<any>to)[toKey] = (<any>from)[key];
    }
  }

  public fromJson<T extends object>(json: object|string, Ret:DefaultConstructor<T>):[T, Error|null] {
    let ret: T = new Ret();
    let err: Error|null = null

    if (typeof json == "string") {
      err = this.parseJsonObjectToClass(ret, JSON.parse(json), Ret.name);
    } else if (typeof json == "object") {
      err = this.parseJsonObjectToClass(ret, json, Ret.name);
    }

    return [ret, err];
  }

  public parseJsonObjectToClass<T extends object>(to: T
    , jsonObject: object, name?: string):Error|null {
    name = name || "";
    return this.classFromJson(<any>to, jsonObject, name);
  }

  private classFromJson(to:object, from:object, className:string):Error|null {
    let json2PropertyMap:Map<string, string> = (<any>to)[jsonMapProperty] || new Map();

    // 清空原来的非对象(数组)值
    // TODO: for in 目前查找的资料只是会遍历出可枚举的，同时查得对象的方法是不可枚举的，但是
    // 这里出现了 for in 遍历出了对象的方法。（es5的浏览器环境出现此现象，其他编译方式与运行环境未验证）
    // 所以这里加了“冗余”的条件判断
    for (let key in to) {
      if (typeof (<any>to)[key] !== "object"
        && typeof (<any>to)[key] !== "function"
        && to.propertyIsEnumerable(key)) {
        (<any>to)[key] = null;
      }
    }

    for (let key in from) {
      let toKey = json2PropertyMap.get(key) || key;
      // json值就为空，直接跳过
      if (!to.hasOwnProperty(toKey) || typeof (<any>from)[key] === "undefined"
        || (<any>from)[key] === null) {
        continue;
      }

      // class对象没有这项值，就跳过
      if (typeof (<any>to)[toKey] === "undefined") {
        continue;
      }

      // 除基本类型外，类型必须一样
      if (typeof (<any>to)[toKey] !== typeof (<any>from)[key] 
        && typeof (<any>from)[key] === "object") {
        return Error(`type is not same for ${className}[${toKey}]`);
      }

      // class对象的初始值不能为null，否则原型链会丢失
      if (typeof (<any>from)[key] === "object" && (<any>from)[key] !== null
        && typeof (<any>to)[toKey] === "object" && (<any>to)[toKey] === null) {
        return Error(className + "[" + toKey + `] --- json is object, but the dest class is 'null'
        . class type must be initialized by new() `);
      }

      // class 对象就递归复制
      if (typeof (<any>to)[toKey] === "object" && (<any>to)[toKey] !== null
        && !((<any>to)[toKey] instanceof Array)
        && typeof (<any>from)[key] === "object"
        && !((<any>from)[key] instanceof Array)) {

          // 优先使用自定义的解码器
        if ((<any>to)[toKey][jsonDes]) {
          (<any>to)[toKey] 
            = (<JsonDeserializer>((<any>to)[toKey][jsonDes])).deserialize((<any>from)[key]);
        } else {
          let err = this.classFromJson((<any>to)[toKey], (<any>from)[key], (<any>to)[toKey].name);
          if (err) {
            return err
          }
        }
      
        continue;
      }

      // 如果json是对象数组，class对象必须是ClassArray<>的数组
      if (((<any>from)[key] instanceof Array) 
        && ((<any>from)[key].length !== 0) 
        && !((<any>to)[toKey] instanceof ClassArray)
        && typeof (<any>from)[key][0] === "object") {
        return Error(`Type of ${className}[${toKey}] is 
          not ClassArray. Please use ClassArray<>`);
      }

      // 循环复制数组
      if ((<any>from)[key] instanceof Array) {
        let arr:Array<any> = <Array<any>>((<any>to)[toKey]);
        arr.splice(0, arr.length);
        for (let value of (<any>from)[key]) {
          if (typeof value === "object" && value !== null) {
            let item:any = <ClassArray<any>>((<any>to)[toKey]).addAItem();
            let err = this.classFromJson(item, value, item.name);
            if (err) {
              return err
            }
          } else {
            (<any>to)[toKey].push(value);
          }
        }
        continue;
      }

      // 基本变量赋值
      (<any>to)[toKey] = (<any>from)[key];
    }

    return null
  }
}

export function SerializedName(key:string, ...keys:string[]) {
  return function decorator(prototype: object, name: string) {
    if (!(<any>prototype)[jsonMapProperty]) {
      (<any>prototype)[jsonMapProperty] = new Map<string, string>();
    }
    if (!(<any>prototype)[propertyMapJson]) {
      (<any>prototype)[propertyMapJson] = new Map<string, string>();
    }
    
    (<Map<string, string>>(<any>prototype)[jsonMapProperty]).set(key, name);
    (<Map<string, string>>(<any>prototype)[propertyMapJson]).set(name, key);

    for (let str of keys) {
      (<Map<string, string>>(<any>prototype)[jsonMapProperty]).set(str, name);
    }
  }
}


export class JsonBuilder {

  public registerTypeAdapter<T>(clazz: Class<T>, josndes: JsonDeserializer):this {
    (<any>clazz.prototype)[jsonDes] = josndes;
    return this;
  }

  public build():Json {
    return new Json();
  }
}

