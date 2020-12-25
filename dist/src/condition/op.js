import { OrCondition } from "./OrCondition";
import { AndCondition } from "./AndCondition";
import { CompareCondition } from "./CompareCondition";
import { InCondition } from "./InCondition";
import { NotCondition } from "./NotCondition";
import { BetweenCondition } from "./BetweenCondition";
export class op {
    static or(conditions) {
        return new OrCondition(conditions);
    }
    static and(conditions) {
        return new AndCondition(conditions);
    }
    static gte(field, value) {
        return new CompareCondition(field, CompareCondition.GTE, value);
    }
    static gt(field, value) {
        return new CompareCondition(field, CompareCondition.GT, value);
    }
    static lt(field, value) {
        return new CompareCondition(field, CompareCondition.LT, value);
    }
    static lte(field, value) {
        return new CompareCondition(field, CompareCondition.LTE, value);
    }
    static eq(field, value) {
        return new CompareCondition(field, CompareCondition.EQ, value);
    }
    static neq(field, value) {
        return new CompareCondition(field, CompareCondition.NEQ, value);
    }
    static in_(field, value) {
        return new InCondition(field, value);
    }
    static not(value) {
        return new NotCondition(value);
    }
    static btw(field, start, end) {
        return new BetweenCondition(field, start, end);
    }
}
