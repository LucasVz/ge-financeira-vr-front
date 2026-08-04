/** @format */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MinusCircle, Check, Trash2, TrendingDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";

import expensesService from "@/services/expensesService";
import { formatBRL } from "@/lib/finance-store";
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

const expenseTypes = ["Fixa", "Variável", "Investimento", "Imposto", "Outros"];
const today = new Date().toISOString().slice(0, 10);

export default function ExpensesPage() {
	const queryClient = useQueryClient();

	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [type, setType] = useState("");
	const [date, setDate] = useState(today);

	const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery(
		["expenses"],
		expensesService.getExpenses,
		{ refetchOnWindowFocus: false },
	);

	const createMutation = useMutation(expensesService.postExpense, {
		onSuccess: () => {
			toast.success("Saída registrada com sucesso!");
			resetForm();
			queryClient.invalidateQueries("expenses");
		},
		onError: () => {
			toast.error("Erro ao registrar a saída.");
		},
	});

	const deleteMutation = useMutation(expensesService.deleteExpense, {
		onSuccess: () => {
			toast.success("Saída removida.");
			queryClient.invalidateQueries("expenses");
		},
		onError: () => {
			toast.error("Erro ao remover a saída.");
		},
	});

	const resetForm = () => {
		setDescription("");
		setAmount("");
		setType("");
		setDate(today);
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/\D/g, "");
		if (!rawValue) {
			setAmount("");
			return;
		}
		const numberValue = Number(rawValue) / 100;
		setAmount(
			numberValue.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			}),
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const amountNum = Number(amount.replace(/\D/g, "")) / 100;

		if (!description.trim() || !amountNum || !type) {
			toast.error("Preencha descrição, valor e tipo da saída.");
			return;
		}

		createMutation.mutate({
			description: description.trim(),
			amount: amountNum,
			expenseType: type,
			registrationDate: new Date(`${date}T12:00:00`).toISOString(),
		});
	};

	const formatIsoDate = (isoDate: string) => {
		if (!isoDate) return "—";
		const [year, month, day] = isoDate.split("T")[0].split("-");
		return `${day}/${month}/${year}`;
	};

	return (
		<div className="mx-auto max-w-5xl">
			<PageHeader
				title="Registrar Saída"
				description="Controle as despesas e custos da clínica"
			/>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
							<MinusCircle className="size-5" />
						</div>
						<div>
							<CardTitle>Registrar Saída de Despesa</CardTitle>
							<CardDescription>
								Preencha os dados da nova despesa
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="grid gap-5 md:grid-cols-2">
								<Field className="md:col-span-2">
									<FieldLabel htmlFor="descricao">Descrição</FieldLabel>
									<Input
										id="descricao"
										placeholder="Ex: Aluguel, insumos, energia..."
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										disabled={createMutation.isLoading}
									/>
								</Field>

								<Field>
									<FieldLabel htmlFor="valor-saida">Valor da Saída</FieldLabel>
									<Input
										id="valor-saida"
										type="text"
										inputMode="numeric"
										placeholder="R$ 0,00"
										value={amount}
										onChange={handleAmountChange}
										disabled={createMutation.isLoading}
									/>
								</Field>

								<Field>
									<FieldLabel htmlFor="tipo-saida">Tipo de Saída</FieldLabel>
									<Select
										value={type}
										onValueChange={(value) => setType(value || "")}
										disabled={createMutation.isLoading}
									>
										<SelectTrigger id="tipo-saida" className="w-full">
											<SelectValue placeholder="Selecione o tipo" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{expenseTypes.map((t) => (
													<SelectItem key={t} value={t}>
														{t}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>

								<Field>
									<FieldLabel htmlFor="data-saida">Data</FieldLabel>
									<Input
										id="data-saida"
										type="date"
										value={date}
										onChange={(e) => setDate(e.target.value)}
										disabled={createMutation.isLoading}
									/>
								</Field>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row">
								<Button
									type="submit"
									className="flex-1"
									disabled={createMutation.isLoading}
								>
									<Check data-icon="inline-start" />
									{createMutation.isLoading
										? "Registrando..."
										: "Registrar Saída"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={resetForm}
									disabled={createMutation.isLoading}
								>
									Limpar
								</Button>
							</div>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Saídas registradas</CardTitle>
					<CardDescription>
						{isLoadingExpenses
							? "Carregando histórico..."
							: "Histórico das despesas lançadas"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingExpenses ? (
						<div className="flex justify-center p-4">
							Buscando lançamentos...
						</div>
					) : expenses.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<TrendingDown />
								</EmptyMedia>
								<EmptyTitle>Nenhuma saída registrada</EmptyTitle>
								<EmptyDescription>
									As despesas lançadas aparecerão aqui.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Data</TableHead>
										<TableHead>Descrição</TableHead>
										<TableHead>Tipo</TableHead>
										<TableHead className="text-right">Valor</TableHead>
										<TableHead className="w-10" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{[...expenses].reverse().map((s: any) => (
										<TableRow key={s.id}>
											<TableCell>{formatIsoDate(s.registrationDate)}</TableCell>
											<TableCell className="font-medium">
												{s.description}
											</TableCell>
											<TableCell>
												<Badge variant="secondary">{s.expenseType}</Badge>
											</TableCell>
											<TableCell className="text-right font-medium text-destructive">
												{formatBRL(s.amount)}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													aria-label="Remover saída"
													onClick={() => deleteMutation.mutate(s.id)}
													disabled={deleteMutation.isLoading}
												>
													<Trash2 />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
