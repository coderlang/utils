

/**
 * Condition 的构建通过 condition/op 类进行。
 */

export abstract class Condition {
  protected field:string = "";

  protected constructor(field: string = "") {
    this.field = field;
  }

  protected isOrCondition():boolean {
    return false;
  }

  protected isAndCondition():boolean {
    return false;
  }

  public abstract toJsonObject():ConditionJson ;
}

type ConditionJsonValueType = 
  number|string|ConditionJson|Array<number>|Array<string>|Array<ConditionJson>;

export class ConditionJson {
  public key: string;
  public field: string|null;
  public value: any;

  constructor(key:string, value:ConditionJsonValueType, field:string|null = null) {
    this.key = key;
    this.field = field;
    this.value = value;
  }
}

