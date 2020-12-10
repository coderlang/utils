

import {Condition, ConditionJson} from "./Condition";

export abstract class LogicCondition extends Condition {
  constructor(conditions: Condition[]) {
    super("");
    this.conditions_ = conditions;
  }

  toJsonObject(): ConditionJson {
    let values:ConditionJson[] = new Array<ConditionJson>();
    for(let con of this.conditions_) {
      values.push(con.toJsonObject());
    }

    return new ConditionJson(this.getOp(), values);
  }

  protected abstract getOp():string ;

  protected conditions_:Condition[];

}


