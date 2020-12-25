import { Condition, ConditionJson } from "./Condition";
export class InCondition extends Condition {
    constructor(field, values) {
        super(field);
        this.values_ = values;
    }
    toJsonObject() {
        return new ConditionJson("in", this.values_, this.field);
    }
}
