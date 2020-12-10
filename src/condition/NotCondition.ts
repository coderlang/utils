

import {Condition, ConditionJson} from "./Condition";

export class NotCondition extends Condition {
  toJsonObject(): ConditionJson {
    return new ConditionJson("not", this.condition_.toJsonObject());
  }

  constructor(condition: Condition) {
    super();
    this.condition_ = condition;
  }

  private condition_: Condition;
}


