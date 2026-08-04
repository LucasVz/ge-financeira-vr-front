/** @format */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";

import paymentMethodsService from "@/services/paymentMethodsService";
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
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export default function PaymentMethodsPage() {
	const [name, setName] = useState("");
	const queryClient = useQueryClient();

	const { data: paymentMethods = [], isLoading } = useQuery(
		["paymentMethods"],
		paymentMethodsService.getPaymentMethods,
		{ refetchOnWindowFocus: false },
	);

	const createMutation = useMutation(paymentMethodsService.postPaymentMethod, {
		onSuccess: () => {
			toast.success("Forma de pagamento cadastrada com sucesso!");
			setName("");
			queryClient.invalidateQueries("paymentMethods");
		},
		onError: () => {
			toast.error("Erro ao cadastrar a forma de pagamento.");
		},
	});

	const deleteMutation = useMutation(
		paymentMethodsService.deletePaymentMethod,
		{
			onSuccess: () => {
				toast.success("Forma de pagamento removida.");
				queryClient.invalidateQueries("paymentMethods");
			},
			onError: () => {
				toast.error("Erro ao remover a forma de pagamento.");
			},
		},
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Informe o nome da forma de pagamento.");
			return;
		}

		createMutation.mutate({ name: name.trim() });
	};

	return (
		<div className="mx-auto max-w-4xl">
			<PageHeader
				title="Formas de Pagamento"
				description="Cadastre as formas de pagamento aceitas"
			/>

			<Card>
				<CardHeader>
					<CardTitle>Nova Forma de Pagamento</CardTitle>
					<CardDescription>
						Ex: PIX, Dinheiro, Cartão de Crédito
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
								<Field className="flex-1">
									<FieldLabel htmlFor="nome-forma">Nome</FieldLabel>
									<Input
										id="nome-forma"
										placeholder="Ex: PIX"
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
					<CardTitle>Formas cadastradas</CardTitle>
					<CardDescription>
						{isLoading
							? "Carregando..."
							: `${paymentMethods.length} forma(s) de pagamento`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center p-4">
							Carregando formas de pagamento...
						</div>
					) : paymentMethods.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<CreditCard />
								</EmptyMedia>
								<EmptyTitle>Nenhuma forma de pagamento</EmptyTitle>
								<EmptyDescription>
									Cadastre a primeira forma acima.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Forma de Pagamento</TableHead>
									<TableHead className="w-10" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{paymentMethods.map((f: any) => (
									<TableRow key={f.id}>
										<TableCell className="font-medium">{f.name}</TableCell>
										<TableCell>
											<Button
												variant="ghost"
												size="icon"
												aria-label="Remover forma de pagamento"
												onClick={() => deleteMutation.mutate(f.id)}
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
