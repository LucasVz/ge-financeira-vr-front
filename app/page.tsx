/** @format */

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import {
	TrendingUp,
	TrendingDown,
	Wallet,
	ArrowUpRight,
	ArrowDownRight,
	Plus,
} from "lucide-react";

import incomesService from "@/services/incomesService";
import expensesService from "@/services/expensesService";
import servicesService from "@/services/servicesService";
import { formatBRL } from "@/lib/finance-store";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
	const { data: services = [], isLoading: isLoadingServices } = useQuery(
		["services"],
		servicesService.getServices,
		{ refetchOnWindowFocus: false },
	);

	const { data: incomes = [], isLoading: isLoadingIncomes } = useQuery(
		["incomes"],
		incomesService.getIncomes,
		{ refetchOnWindowFocus: false },
	);

	const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery(
		["expenses"],
		expensesService.getExpenses,
		{ refetchOnWindowFocus: false },
	);

	const isLoading = isLoadingServices || isLoadingIncomes || isLoadingExpenses;

	const formatIsoDate = (isoDate: string) => {
		if (!isoDate) return "—";
		const [year, month, day] = isoDate.split("T")[0].split("-");
		return `${day}/${month}/${year}`;
	};

	const totalIncome = useMemo(
		() => incomes.reduce((sum: number, e: any) => sum + Number(e.amount), 0),
		[incomes],
	);

	const totalExpenses = useMemo(
		() => expenses.reduce((sum: number, s: any) => sum + Number(s.amount), 0),
		[expenses],
	);

	const balance = totalIncome - totalExpenses;

	const getServiceName = (id: number) =>
		services.find((s: any) => s.id === id)?.name ?? "Serviço";

	const activities = useMemo(() => {
		const incomeItems = incomes.map((e: any) => ({
			id: `e-${e.id}`,
			type: "income" as const,
			label: getServiceName(e.serviceId),
			amount: Number(e.amount),
			date: e.registrationDate,
		}));

		const expenseItems = expenses.map((s: any) => ({
			id: `s-${s.id}`,
			type: "expense" as const,
			label: s.description,
			amount: Number(s.amount),
			date: s.registrationDate,
		}));

		return [...incomeItems, ...expenseItems]
			.sort((a, b) =>
				new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1,
			)
			.slice(0, 6);
	}, [incomes, expenses, services]);

	const stats = [
		{
			label: "Total de Entradas",
			value: totalIncome,
			icon: TrendingUp,
			accent: "text-success",
			bg: "bg-success/10",
		},
		{
			label: "Total de Saídas",
			value: totalExpenses,
			icon: TrendingDown,
			accent: "text-destructive",
			bg: "bg-destructive/10",
		},
		{
			label: "Saldo Atual",
			value: balance,
			icon: Wallet,
			accent: balance >= 0 ? "text-primary" : "text-destructive",
			bg: "bg-primary/10",
		},
	];

	return (
		<div className="mx-auto max-w-5xl">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<PageHeader
					title="Bem-vindo ao painel financeiro"
					description="Acompanhe suas receitas e despesas em tempo real"
				/>
				<Button render={<Link href="/entradas" />}>
					<Plus data-icon="inline-start" />
					Nova Entrada
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{stats.map((s) => (
					<Card key={s.label}>
						<CardContent className="flex items-center justify-between gap-4 pt-6">
							<div className="flex flex-col gap-1">
								<span className="text-sm text-muted-foreground">{s.label}</span>
								<span className={`text-2xl font-semibold ${s.accent}`}>
									{isLoading ? "R$ --,--" : formatBRL(s.value)}
								</span>
							</div>
							<div
								className={`flex size-11 items-center justify-center rounded-xl ${s.bg} ${s.accent}`}
							>
								<s.icon className="size-5" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Movimentações recentes</CardTitle>
					<CardDescription>
						Últimos lançamentos de entradas e saídas
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-1">
					{isLoading ? (
						<p className="py-8 text-center text-sm text-muted-foreground">
							Carregando movimentações...
						</p>
					) : activities.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted-foreground">
							Nenhuma movimentação registrada ainda.
						</p>
					) : (
						activities.map((a, i) => (
							<div key={a.id}>
								{i > 0 && <Separator />}
								<div className="flex items-center justify-between gap-3 py-3">
									<div className="flex items-center gap-3">
										<div
											className={`flex size-9 items-center justify-center rounded-full ${
												a.type === "income"
													? "bg-success/10 text-success"
													: "bg-destructive/10 text-destructive"
											}`}
										>
											{a.type === "income" ? (
												<ArrowUpRight className="size-4" />
											) : (
												<ArrowDownRight className="size-4" />
											)}
										</div>
										<div className="flex flex-col leading-tight">
											<span className="text-sm font-medium">{a.label}</span>
											<span className="text-xs text-muted-foreground">
												{formatIsoDate(a.date)}
											</span>
										</div>
									</div>
									<span
										className={`text-sm font-semibold ${
											a.type === "income" ? "text-success" : "text-destructive"
										}`}
									>
										{a.type === "income" ? "+" : "-"}
										{formatBRL(a.amount)}
									</span>
								</div>
							</div>
						))
					)}
					<div className="mt-2">
						<Button
							variant="outline"
							size="sm"
							render={<Link href="/relatorios" />}
						>
							Ver relatórios completos
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
