const uuidv1 = require('uuid/v1');

export const SpendingModel = class Spending {
    constructor(amount, type, month) {
        this.id = uuidv1();
        this.amount = amount;
        this.type = type;
        this.month = month;
    }
}