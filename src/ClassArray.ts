


import {DefaultConstructor} from "./DefaultConstructor";

export class ClassArray<T> extends Array<T> {

  constructor(clazz:DefaultConstructor<T>) {
    super();
    // tsbug: 编译为es5后，内建类型继承的原型链会发生错误改变。
    Object.setPrototypeOf(this, ClassArray.prototype);
    this.elemProto = clazz;
    Object.defineProperty(this, "elemProto", {enumerable: false});
  }

  // public add(o: object):void {
  //   // o = new this.proto.constructor();
  //   // o = Object.setPrototypeOf(o, <any>this.proto);
  //   this.push(<T><any>o);
  // }
  public newItem():T {
    return new this.elemProto();
  }

  public addAItem():T {
    let i:T = new this.elemProto();
    this.push(i);
    return i;
  }

  private readonly elemProto:DefaultConstructor<T>;
}

export class PrimitiveArray<T> extends Array<T> {}

