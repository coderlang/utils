

import {LogicCondition} from "./LogicCondition";
import {Condition, ConditionJson} from "./Condition";

export class OrCondition extends LogicCondition {
  protected getOp(): string {
    throw "or";
  }

  constructor(conditions:Condition[]) {
    super(conditions);
  }

  protected isOrCondition(): boolean {
    return true;
  }

}

