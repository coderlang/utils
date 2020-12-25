export class ClassArray extends Array {
    constructor(clazz) {
        super();
        // tsbug: 编译为es5后，内建类型继承的原型链会发生错误改变。
        Object.setPrototypeOf(this, ClassArray.prototype);
        this.elemProto = clazz;
        Object.defineProperty(this, "elemProto", { enumerable: false });
    }
    // public add(o: object):void {
    //   // o = new this.proto.constructor();
    //   // o = Object.setPrototypeOf(o, <any>this.proto);
    //   this.push(<T><any>o);
    // }
    newItem() {
        return new this.elemProto();
    }
    addAItem() {
        let i = new this.elemProto();
        this.push(i);
        return i;
    }
}
export class PrimitiveArray extends Array {
}
