import { LogicCondition } from "./LogicCondition";
export class AndCondition extends LogicCondition {
    getOp() {
        throw "and";
    }
    isAndCondition() {
        return true;
    }
}
