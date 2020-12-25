export class XPromiseError extends Error {
    constructor(message, code = -1) {
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
export class XPromise {
    constructor(arg) {
        if (typeof arg == 'function') {
            arg = new Promise((resolve, reject) => {
                arg(resolve, (e) => {
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
    getRawPromise() {
        return this.promise_;
    }
    then(task) {
        return new XPromise(this.promise_.then((v) => {
            try {
                return task(v).promise_;
            }
            catch (e) {
                // 异常时，必须捕获并转换为GrPromiseError
                return Promise.reject(new XPromiseError(e.toString()));
            }
        }));
    }
    catch(task) {
        return new XPromise(this.promise_.catch((v) => {
            return task(v).promise_;
        }));
    }
    always(task) {
        let pro = this.promise_.then(value => {
            task();
            return value;
        }, error => {
            task();
            throw error;
        });
        return new XPromise(pro);
    }
    static resolve(v) {
        return new XPromise(Promise.resolve(v));
    }
    static reject(error) {
        if (typeof error == 'string') {
            error = new XPromiseError(error);
        }
        return new XPromise(Promise.reject(error));
    }
    static all(promises) {
        let pros = [];
        for (let pro of promises) {
            pros.push(pro.promise_);
        }
        return new XPromise(Promise.all(pros));
    }
    static race(promises) {
        let pros = [];
        for (let pro of promises) {
            pros.push(pro.promise_);
        }
        return new XPromise(Promise.race(pros));
    }
    static over() {
        return new XPromise((resolve, reject) => { });
    }
}
