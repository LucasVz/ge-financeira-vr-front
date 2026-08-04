/** @format */

import axios from "axios";

const URL = "http://localhost:3000";

async function getCategories() {
	const promise = await axios.get(`${URL}/categories`);
	return promise.data;
}

async function postCategory(dataForm: { name: string }) {
	const promise = await axios.post(`${URL}/categories`, dataForm);
	return promise.data;
}

async function deleteCategory(id: number) {
	const promise = await axios.delete(`${URL}/categories/${id}`);
	return promise.data;
}

const categoriesService = {
	getCategories,
	postCategory,
	deleteCategory,
};

export default categoriesService;
