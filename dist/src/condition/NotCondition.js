import { Condition, ConditionJson } from "./Condition";
export class NotCondition extends Condition {
    constructor(condition) {
        super();
        this.condition_ = condition;
    }
    toJsonObject() {
        return new ConditionJson("not", this.condition_.toJsonObject());
    }
}
