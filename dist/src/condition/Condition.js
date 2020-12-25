/**
 * Condition 的构建通过 condition/op 类进行。
 */
export class Condition {
    constructor(field = "") {
        this.field = "";
        this.field = field;
    }
    isOrCondition() {
        return false;
    }
    isAndCondition() {
        return false;
    }
}
export class ConditionJson {
    constructor(key, value, field = null) {
        this.key = key;
        this.field = field;
        this.value = value;
    }
}
