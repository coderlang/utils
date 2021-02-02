export function random(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}

export function nullize<T extends Record<string, any> >(o: T) {
  for (const key in o) {
    // todo: o[key] as object 不做强转的类型报错 后续再思考怎么处理
    if (typeof o[key] === "object" && o[key] as object instanceof Array) {
      // todo: 类型不强转就报错的问题后续再处理
      (<any>o[key]) = [];
      continue;
    }

    if (typeof o[key] === "object") {
      nullize(o[key]);
      continue;
    }

    // todo: 类型不强转就报错的问题后续再处理
    (<any>o[key]) = null;
  }
}

export function equals(o1: object | null, o2: object | null): boolean;
export function equals(o1: string | null, o2: string | null): boolean;
export function equals(o1: number | null, o2: number | null): boolean;
export function equals(o1: boolean | null, o2: boolean | null): boolean;
export function equals(o1: Array<any> | null, o2: Array<any> | null): boolean;
export function equals(o1: any, o2: any): boolean {
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

