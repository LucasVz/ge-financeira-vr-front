/** @format */

import axios from "axios";

const URL = "http://localhost:3000";

async function getIncomes() {
	const promise = await axios.get(`${URL}/incomes`);
	return promise.data;
}

async function postIncome(dataForm: {
	serviceId: number;
	paymentMethodId: number;
	amount: number;
	installments: number;
	attendanceType: string;
	registrationDate: string;
}) {
	const promise = await axios.post(`${URL}/incomes`, dataForm);
	return promise.data;
}

async function deleteIncome(id: number) {
	const promise = await axios.delete(`${URL}/incomes/${id}`);
	return promise.data;
}

const incomesService = {
	getIncomes,
	postIncome,
	deleteIncome,
};

export default incomesService;
