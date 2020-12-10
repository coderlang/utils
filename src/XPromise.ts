

export class XPromiseError extends Error {
  public code:number;

  constructor(message: string, code:number=-1) {
    super(message);
    // tsbug: 编译为es5后，内建类型继承的原型链会发生错误改变。
    Object.setPrototypeOf(this, XPromiseError.prototype);

    // console.error(message);
    this.code = code;
  }
}

/**
 * XPromise 与 Promise 的相互转换不能出错
 * Promise 对于所有返回的非Promise类都会认为是 resolve 的值，会再次封装成为Promise,
 * 此时，如果返回的是 XPromise 也会被再次封装，而XPromise已经内含一个Promise 会出现
 * 两个Promise 同时执行的情况，并且会出现后续then运行异常，执行混乱
 *
 * 所以在 XPromise 与 Promise 的混合使用实现新旧兼容时，尤其要注意 转换关系
 */


export class XPromise<Value> {
  private readonly promise_:Promise<Value>;

  /**
   * @deprecated
   */
  constructor (promise: Promise<Value>);
  constructor (pendTask:(resolve:(v:Value)=>void, reject:(e:XPromiseError|string)=>void)=>void);
  constructor (arg:any) {
    if (typeof arg == 'function') {
      arg = new Promise<Value>((resolve, reject)=>{
        arg(resolve, (e:XPromiseError|string)=>{
          if (typeof e == 'string') {
            e = new XPromiseError(e);
          }
          reject(e);
        });
      });
    }

    this.promise_ = arg;
  }

  /**
   * @deprecated
   */
  public getRawPromise():Promise<Value> {
    return this.promise_;
  }

  public then<Next>(task:(v:Value)=>XPromise<Next>):XPromise<Next> {
    return new XPromise<Next>(this.promise_.then((v:Value)=>{
      try {
        return task(v).promise_;
      }catch (e) {
        // 异常时，必须捕获并转换为GrPromiseError
        return Promise.reject(new XPromiseError(e.toString()));
      }
    }));
  }

  public catch(task:(v:XPromiseError)=>XPromise<Value>):XPromise<Value> {
    return new XPromise<Value>(this.promise_.catch((v:XPromiseError)=>{
      return task(v).promise_;
    }));
  }

  public always(task:()=>void):XPromise<Value> {
    let pro:Promise<Value> = this.promise_.then(value => {
      task();
      return value;
    }, error => {
      task();
      throw error;
    });

    return new XPromise<Value>(pro);
  }

  public static resolve():XPromise<void>;
  public static resolve<Value>(v:Value):XPromise<Value>;
  public static resolve(v?:any):XPromise<any> {
    return new XPromise<any>(Promise.resolve(v));
  }

  public static reject<Value>(str:string):XPromise<Value>;
  public static reject<Value>(error:XPromiseError):XPromise<Value>;
  public static reject<Value>(error:any):XPromise<Value> {
    if (typeof error == 'string') {
      error = new XPromiseError(error);
    }
    return new XPromise<Value>(Promise.reject(error));
  }

  public static all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>, XPromise<T4>
      , XPromise<T5>, XPromise<T6>, XPromise<T7>
      , XPromise<T8>, XPromise<T9>, XPromise<T10>])
    : XPromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
  public static all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>, XPromise<T4>
      , XPromise<T5>, XPromise<T6>, XPromise<T7>
      , XPromise<T8>, XPromise<T9>])
    : XPromise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
  public static all<T1, T2, T3, T4, T5, T6, T7, T8>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>, XPromise<T4>
      , XPromise<T5>, XPromise<T6>, XPromise<T7>
      , XPromise<T8>])
    : XPromise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
  public static all<T1, T2, T3, T4, T5, T6, T7>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>, XPromise<T4>
      , XPromise<T5>, XPromise<T6>, XPromise<T7>])
    : XPromise<[T1, T2, T3, T4, T5, T6, T7]>;
  public static all<T1, T2, T3, T4, T5, T6>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>, XPromise<T4>
      , XPromise<T5>, XPromise<T6>])
    : XPromise<[T1, T2, T3, T4, T5, T6]>;
  public static all<T1, T2, T3, T4, T5>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>, XPromise<T4>
      , XPromise<T5>])
    : XPromise<[T1, T2, T3, T4, T5]>;
  public static all<T1, T2, T3, T4>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>, XPromise<T4>])
    : XPromise<[T1, T2, T3, T4]>;
  public static all<T1, T2, T3>(
    values: [XPromise<T1>, XPromise<T2>, XPromise<T3>])
    : XPromise<[T1, T2, T3]>;
  public static all<T1, T2>(
    values: [XPromise<T1>, XPromise<T2>])
    : XPromise<[T1, T2]>;
  public static all<Value>(promises: XPromise<Value>[]):XPromise<Value[]>;

  public static all(
    promises: XPromise<any>[])
    : XPromise<any[]> {

    let pros:Promise<any>[] = [];
    for (let pro of promises) {
      pros.push(pro.promise_);
    }

    return new XPromise<any[]>(Promise.all(pros));
  }

  public static race<Value>(promises: XPromise<Value>[]):XPromise<Value>{
    let pros:Promise<Value>[] = [];
    for (let pro of promises) {
      pros.push(pro.promise_);
    }

    return new XPromise<Value>(Promise.race(pros));
  }

  public static over<Value>():XPromise<Value> {
    return new XPromise<Value>(
      (resolve:(v:Value)=>void, reject:(e:XPromiseError)=>void)=>{});
  }
}