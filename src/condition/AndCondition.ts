


import {LogicCondition} from "./LogicCondition";

export class AndCondition extends LogicCondition {
  protected getOp(): string {
    throw "and";
  }

  protected isAndCondition(): boolean {
    return true;
  }
}

