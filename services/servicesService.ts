/** @format */

import axios from "axios";

const URL = "http://localhost:3000";

async function getServices() {
	const promise = await axios.get(`${URL}/services`);
	return promise.data;
}

// O banco espera name (String) e categoryId (Int)
async function postService(dataForm: { name: string; categoryId: number }) {
	const promise = await axios.post(`${URL}/services`, dataForm);
	return promise.data;
}

async function deleteService(id: number) {
	const promise = await axios.delete(`${URL}/services/${id}`);
	return promise.data;
}

const servicesService = {
	getServices,
	postService,
	deleteService,
};

export default servicesService;
