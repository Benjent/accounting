<template>
  <div>
    <div id="table">
      <div class="month" v-for="(month, index) in MONTHS" :key="month">
        <h2>{{ month }}</h2>
				<div class="spendingsPerMonth" :class="{ budgetExceeded: isBudgetExceededPerMonth(index) === true }">
					Total {{ spendingsPerMonth(index) }}
				</div>
				<div class="spendings">
					<div v-for="spending in spendingList[index]">{{ spending.amount }} {{ spending.type }}</div>
				</div>
				<div class="spendingsPerMonthPerType">
					<div v-for="type in SPENDING_TYPES" v-if="spendingsPerMonthPerType(index, type) > 0" :class="{ budgetExceeded: isBudgetExceeded(index, type) }">
						Total {{ type }}: {{ spendingsPerMonthPerType(index, type) }}
					</div>
				</div>
      </div>
			<div id="stats">
				<div class="spendingsPerYear">
					Per year: {{ spendingsPerYear }}
				</div>
				<div class="spendingsPerYear">
					Monthly budget: {{ monthlyBudget }}
				</div>
				<div class="spendingsPerYear">
					Per Month (mean): {{ spendingsPerMonthMean }}
				</div>
			</div>
    </div>
  </div>

</template>

<script>
  import { MONTH } from "./enums/months-enum";
  import { SPENDING_TYPE } from "./enums/spending-types-enum";
  import { BUDGET } from "./enums/budgets-enum";
  import { SpendingModel } from "./models/spending-model";

  export default {
    data() {
			const dataFromJsonFile = require('./spendings.json');

			const wage = 2093;

			const wageTax = 190;
			const rent = 600;
			const charges = 50;
			const houseGaz = 45;
			const electricity = 38;
			const water = 15;
			const internet = 19.99;
			const phone = 19.99;
			const housingTax = 50;
			const insurance = 63.55; // Car + House

			const misHappenings = 250; // Because we never know what happens...

			const monthlyBudget = wage - rent - charges - houseGaz - electricity - water - internet - phone - housingTax - insurance - misHappenings;

      return {
				monthlyBudget: monthlyBudget,
        spendingList: dataFromJsonFile,
				type: null,
				amount: 0,
				month: new Date().getMonth(),
				errors: []
      }
    },
		computed: {
			spendingsPerMonthMean() {
				return parseFloat((this.spendingsPerYear / 12, 5).toFixed(2));
			},
			spendingsPerYear() {
				let amount = 0;
				for (let month = 0; month < this.spendingList.length; month++) {
					amount += this.spendingsPerMonth(month);
				}
				return amount;
			},
		},
    created() {
      this.MONTHS = MONTH;
      this.SPENDING_TYPES = SPENDING_TYPE;
      this.BUDGETS = BUDGET;

    },
    methods: {
			spendingsPerMonth(month) {
				let amount = 0;
				for (let i = 0; i < this.spendingList[month].length; i++) {
					amount += this.spendingList[month][i].amount;
				}
				return parseFloat(amount.toFixed(2));
			},
			spendingsPerMonthPerType(month, type) {
				let spending = null;
				let amount = 0;
				if (!this.spendingList[month]) {
					return amount;
				}
				for (let i = 0; i < this.spendingList[month].length; i++) {
					spending = this.spendingList[month][i];
					if (spending.type === type) {
						amount += this.spendingList[month][i].amount;
					}
				}
				return amount;
			},
			isBudgetExceeded(month, type) {
				const budget = this.BUDGETS[type];
				const amount = this.spendingsPerMonthPerType(month, type);
				return amount > budget;
			},
			isBudgetExceededPerMonth(month) {
				const amount = this.spendingsPerMonth(month);
				return amount > this.monthlyBudget;
			},
    }
  }

</script>

<style lang="css">
  @import 'style/style.css';
</style>
