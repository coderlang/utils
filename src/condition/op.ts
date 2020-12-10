
import {Condition} from "./Condition";
import {OrCondition} from "./OrCondition";
import {AndCondition} from "./AndCondition";
import {CompareCondition} from "./CompareCondition";
import {InCondition} from "./InCondition";
import {NotCondition} from "./NotCondition";
import { BetweenCondition } from "./BetweenCondition";

export class op {
  public static or(conditions: Condition[]):Condition {
    return new OrCondition(conditions);
  }

  public static and(conditions: Condition[]):Condition {
    return new AndCondition(conditions);
  }

  public static gte(field:string, value:number|string):Condition {
    return new CompareCondition(field, CompareCondition.GTE, value);
  }

  public static gt(field:string, value:number|string):Condition {
    return new CompareCondition(field, CompareCondition.GT, value);
  }

  public static lt(field:string, value:number|string):Condition {
    return new CompareCondition(field, CompareCondition.LT, value);
  }

  public static lte(field:string, value:number|string):Condition {
    return new CompareCondition(field, CompareCondition.LTE, value);
  }

  public static eq(field:string, value:number|string):Condition {
    return new CompareCondition(field, CompareCondition.EQ, value);
  }

  public static neq(field:string, value:number|string):Condition {
    return new CompareCondition(field, CompareCondition.NEQ, value);
  }

  public static in_(field:string, value:number[]|string[]):Condition {
    return new InCondition(field, value);
  }

  public static not(value:Condition):Condition {
    return new NotCondition(value);
  }

  public static btw(field:string, start:string, end:string):Condition;
  public static btw(field:string, start:number, end:number):Condition;
  public static btw(field:any, start:any, end:any):Condition {
    return new BetweenCondition(field, start, end);
  }

}


