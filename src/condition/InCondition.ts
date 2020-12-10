

import {Condition, ConditionJson} from "./Condition";

export class InCondition extends Condition {
  toJsonObject(): ConditionJson {
    return new ConditionJson("in", this.values_, this.field);
  }

  constructor(field:string, values:Array<number>|Array<string>) {
    super(field);
    this.values_ = values;
  }

  private values_:Array<number>|Array<string>;
}


