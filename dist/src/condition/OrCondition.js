import { LogicCondition } from "./LogicCondition";
export class OrCondition extends LogicCondition {
    getOp() {
        throw "or";
    }
    constructor(conditions) {
        super(conditions);
    }
    isOrCondition() {
        return true;
    }
}
