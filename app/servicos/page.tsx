/** @format */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import categoriesService from "@/services/categoriesService";
import servicesService from "@/services/servicesService";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export default function ServicesPage() {
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const [categoryId, setCategoryId] = useState("");

	const { data: categories = [], isLoading: isLoadingCategories } = useQuery(
		["categories"],
		categoriesService.getCategories,
		{ refetchOnWindowFocus: false },
	);

	const { data: services = [], isLoading: isLoadingServices } = useQuery(
		["services"],
		servicesService.getServices,
		{ refetchOnWindowFocus: false },
	);

	const createMutation = useMutation(servicesService.postService, {
		onSuccess: () => {
			toast.success("Serviço cadastrado com sucesso!");
			setName("");
			setCategoryId("");
			queryClient.invalidateQueries("services");
		},
		onError: () => {
			toast.error("Erro ao cadastrar o serviço.");
		},
	});

	const deleteMutation = useMutation(servicesService.deleteService, {
		onSuccess: () => {
			toast.success("Serviço removido.");
			queryClient.invalidateQueries("services");
		},
		onError: () => {
			toast.error("Erro ao remover o serviço.");
		},
	});

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (!name.trim() || !categoryId) {
			toast.error("Informe o nome e a categoria do serviço.");
			return;
		}

		createMutation.mutate({
			name: name.trim(),
			categoryId: Number(categoryId),
		});
	};

	const categoryItems = categories.map((category: any) => ({
		value: String(category.id),
		label: category.name,
	}));

	const getCategoryName = (service: any) =>
		service.category?.name ??
		categories.find((category: any) => category.id === service.categoryId)
			?.name ??
		"—";

	const isFormLoading = isLoadingCategories || createMutation.isLoading;

	return (
		<div className="mx-auto max-w-4xl">
			<PageHeader
				title="Serviços"
				description="Cadastre os serviços oferecidos pela clínica"
			/>

			<Card>
				<CardHeader>
					<CardTitle>Novo Serviço</CardTitle>
					<CardDescription>
						Informe o nome do serviço e a categoria correspondente
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
								<Field>
									<FieldLabel htmlFor="nome-servico">Nome do Serviço</FieldLabel>
									<Input
										id="nome-servico"
										placeholder="Ex: Limpeza de pele"
										value={name}
										onChange={(event) => setName(event.target.value)}
										disabled={createMutation.isLoading}
									/>
								</Field>

								<Field>
									<FieldLabel htmlFor="categoria-servico">Categoria</FieldLabel>
									<Select
										items={categoryItems}
										value={categoryId}
										onValueChange={(value) => setCategoryId(value || "")}
										disabled={isFormLoading || categories.length === 0}
									>
										<SelectTrigger id="categoria-servico" className="w-full">
											<SelectValue
												placeholder={
													categories.length === 0
														? "Cadastre uma categoria primeiro"
														: "Selecione a categoria"
												}
											/>
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{categories.map((category: any) => (
													<SelectItem key={category.id} value={String(category.id)}>
														{category.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>

								<Button
									type="submit"
									disabled={isFormLoading || categories.length === 0}
								>
									<Plus data-icon="inline-start" />
									{createMutation.isLoading ? "Cadastrando..." : "Cadastrar"}
								</Button>
							</div>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Serviços cadastrados</CardTitle>
					<CardDescription>
						{isLoadingServices ? "Carregando..." : `${services.length} serviço(s)`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingServices ? (
						<div className="flex justify-center p-4">Carregando serviços...</div>
					) : services.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<ClipboardList />
								</EmptyMedia>
								<EmptyTitle>Nenhum serviço</EmptyTitle>
								<EmptyDescription>
									Cadastre o primeiro serviço acima.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Serviço</TableHead>
									<TableHead>Categoria</TableHead>
									<TableHead className="w-10" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{services.map((service: any) => (
									<TableRow key={service.id}>
										<TableCell className="font-medium">{service.name}</TableCell>
										<TableCell>
											<Badge variant="secondary">{getCategoryName(service)}</Badge>
										</TableCell>
										<TableCell>
											<Button
												variant="ghost"
												size="icon"
												aria-label="Remover serviço"
												onClick={() => deleteMutation.mutate(service.id)}
												disabled={deleteMutation.isLoading}
											>
												<Trash2 />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
