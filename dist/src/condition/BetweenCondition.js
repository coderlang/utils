import { Condition, ConditionJson } from "./Condition";
export class BetweenCondition extends Condition {
    constructor(field, start, end) {
        super(field);
        this.values_ = [start, end];
    }
    toJsonObject() {
        return new ConditionJson("between", this.values_, this.field);
    }
}
