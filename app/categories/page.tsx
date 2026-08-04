/** @format */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Tags } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { useFinance } from "@/lib/finance-store";
import categoriesService from "@/services/categoriesService";
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

export default function CategoriesPage() {
	const { servicos: services } = useFinance();
	const [name, setName] = useState("");

	const queryClient = useQueryClient();

	const { data: categories = [], isLoading } = useQuery(
		["categories"],
		categoriesService.getCategories,
		{ refetchOnWindowFocus: false },
	);

	const createMutation = useMutation(categoriesService.postCategory, {
		onSuccess: () => {
			toast.success("Categoria cadastrada com sucesso!");
			setName("");
			queryClient.invalidateQueries("categories");
		},
		onError: () => {
			toast.error("Erro ao cadastrar a categoria.");
		},
	});

	const deleteMutation = useMutation(categoriesService.deleteCategory, {
		onSuccess: () => {
			toast.success("Categoria removida.");
			queryClient.invalidateQueries("categories");
		},
		onError: () => {
			toast.error("Erro ao remover a categoria.");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Informe o nome da categoria.");
			return;
		}

		createMutation.mutate({ name: name.trim() });
	};

	const countServices = (categoryId: number) =>
		services.filter((s: any) => s.categoriaId === categoryId).length;

	return (
		<div className="mx-auto max-w-4xl">
			<PageHeader
				title="Categorias"
				description="Organize seus serviços por categoria"
			/>

			<Card>
				<CardHeader>
					<CardTitle>Nova Categoria</CardTitle>
					<CardDescription>Cadastre uma categoria de serviço</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
								<Field className="flex-1">
									<FieldLabel htmlFor="nome-categoria">
										Nome da Categoria
									</FieldLabel>
									<Input
										id="nome-categoria"
										placeholder="Ex: Estética Facial"
										value={name}
										onChange={(e) => setName(e.target.value)}
										disabled={createMutation.isLoading}
									/>
								</Field>
								<Button type="submit" disabled={createMutation.isLoading}>
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
					<CardTitle>Categorias cadastradas</CardTitle>
					<CardDescription>
						{isLoading ? "Carregando..." : `${categories.length} categoria(s)`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center p-4">
							Carregando categorias...
						</div>
					) : categories.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Tags />
								</EmptyMedia>
								<EmptyTitle>Nenhuma categoria</EmptyTitle>
								<EmptyDescription>
									Cadastre a primeira categoria acima.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Categoria</TableHead>
									<TableHead className="text-right">Serviços</TableHead>
									<TableHead className="w-10" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{categories.map((c: any) => (
									<TableRow key={c.id}>
										<TableCell className="font-medium">{c.name}</TableCell>
										<TableCell className="text-right">
											<Badge variant="secondary">{countServices(c.id)}</Badge>
										</TableCell>
										<TableCell>
											<Button
												variant="ghost"
												size="icon"
												aria-label="Remover categoria"
												onClick={() => deleteMutation.mutate(c.id)}
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
