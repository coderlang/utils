


import {Condition, ConditionJson} from "./Condition";

export class BetweenCondition extends Condition {
  toJsonObject(): ConditionJson {
    return new ConditionJson("between", this.values_, this.field);
  }

  constructor(field:string, start:number, end:number);
  constructor(field:string, start:string, end:string);
  constructor(field:any, start:any, end:any) {
    super(field);
    this.values_ = [start, end];
  }

  private values_:number[]|string[];
}

