import { Condition, ConditionJson } from "./Condition";
export class CompareCondition extends Condition {
    constructor(field, expression, value) {
        super(field);
        this.expression_ = expression;
        this.value_ = value;
    }
    toJsonObject() {
        return new ConditionJson(this.expression_, this.value_, this.field);
    }
}
CompareCondition.GT = ">";
CompareCondition.LT = "<";
CompareCondition.EQ = "=";
CompareCondition.NEQ = "!=";
CompareCondition.GTE = ">=";
CompareCondition.LTE = "<=";
