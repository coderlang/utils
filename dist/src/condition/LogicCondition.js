import { Condition, ConditionJson } from "./Condition";
export class LogicCondition extends Condition {
    constructor(conditions) {
        super("");
        this.conditions_ = conditions;
    }
    toJsonObject() {
        let values = new Array();
        for (let con of this.conditions_) {
            values.push(con.toJsonObject());
        }
        return new ConditionJson(this.getOp(), values);
    }
}
