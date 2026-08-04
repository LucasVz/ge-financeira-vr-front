/** @format */

import axios from "axios";

const URL = "http://localhost:3000";

async function getExpenses() {
	const promise = await axios.get(`${URL}/expenses`);
	return promise.data;
}

async function postExpense(dataForm: {
	description: string;
	amount: number;
	expenseType: string;
	registrationDate: string;
}) {
	const promise = await axios.post(`${URL}/expenses`, dataForm);
	return promise.data;
}

async function deleteExpense(id: number) {
	const promise = await axios.delete(`${URL}/expenses/${id}`);
	return promise.data;
}

const expensesService = {
	getExpenses,
	postExpense,
	deleteExpense,
};

export default expensesService;
