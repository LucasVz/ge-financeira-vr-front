/** @format */

import axios from "axios";

const URL = "http://localhost:3000";

async function getPaymentMethods() {
	const promise = await axios.get(`${URL}/payment-methods`);
	return promise.data;
}

async function postPaymentMethod(dataForm: { name: string }) {
	const promise = await axios.post(`${URL}/payment-methods`, dataForm);
	return promise.data;
}

async function deletePaymentMethod(id: number) {
	const promise = await axios.delete(`${URL}/payment-methods/${id}`);
	return promise.data;
}

const paymentMethodsService = {
	getPaymentMethods,
	postPaymentMethod,
	deletePaymentMethod,
};

export default paymentMethodsService;
