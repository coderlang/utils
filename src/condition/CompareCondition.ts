

import {Condition, ConditionJson} from "./Condition";

export class CompareCondition extends Condition {

  public static readonly GT:string = ">";
  public static readonly LT:string = "<";
  public static readonly EQ:string = "=";
  public static readonly NEQ:string = "!=";
  public static readonly GTE:string = ">=";
  public static readonly LTE:string = "<=";

  toJsonObject(): ConditionJson {
    return new ConditionJson(this.expression_, this.value_, this.field);
  }

  constructor(field:string, expression:string, value:number|string) {
    super(field);
    this.expression_ = expression;
    this.value_ = value;
  }

  private expression_:string;
  private value_:number|string;
}


