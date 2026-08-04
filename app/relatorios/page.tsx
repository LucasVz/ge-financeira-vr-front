/** @format */

"use client";

import { useMemo } from "react";
import { useQuery } from "react-query";
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Pie,
	PieChart,
	Cell,
} from "recharts";

import incomesService from "@/services/incomesService";
import expensesService from "@/services/expensesService";
import servicesService from "@/services/servicesService";
import { formatBRL } from "@/lib/finance-store";
import { PageHeader } from "@/components/page-header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
	type ChartConfig,
} from "@/components/ui/chart";

const MONTHS = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez",
];

const flowConfig = {
	incomes: { label: "Entradas", color: "var(--chart-2)" },
	expenses: { label: "Saídas", color: "var(--chart-3)" },
} satisfies ChartConfig;

const pieColors = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

export default function ReportsPage() {
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

	const monthlyFlow = useMemo(() => {
		const base = MONTHS.map((month) => ({ month, incomes: 0, expenses: 0 }));

		for (const i of incomes) {
			if (!i.registrationDate) continue;
			const dataParts = i.registrationDate.split("T")[0].split("-");
			if (dataParts.length >= 2) {
				const m = Number(dataParts[1]) - 1;
				if (base[m]) base[m].incomes += Number(i.amount);
			}
		}

		for (const e of expenses) {
			if (!e.registrationDate) continue;
			const dataParts = e.registrationDate.split("T")[0].split("-");
			if (dataParts.length >= 2) {
				const m = Number(dataParts[1]) - 1;
				if (base[m]) base[m].expenses += Number(e.amount);
			}
		}

		return base.filter((row) => row.incomes > 0 || row.expenses > 0);
	}, [incomes, expenses]);

	const revenueByService = useMemo(() => {
		const map = new Map<number, number>();
		for (const i of incomes) {
			map.set(i.serviceId, (map.get(i.serviceId) ?? 0) + Number(i.amount));
		}
		return Array.from(map.entries())
			.map(([serviceId, total]) => ({
				name: services.find((s: any) => s.id === serviceId)?.name ?? "Serviço",
				total,
			}))
			.sort((a, b) => b.total - a.total);
	}, [incomes, services]);

	const serviceConfig = useMemo<ChartConfig>(() => {
		const cfg: ChartConfig = {};
		revenueByService.forEach((item, i) => {
			cfg[item.name] = {
				label: item.name,
				color: pieColors[i % pieColors.length],
			};
		});
		return cfg;
	}, [revenueByService]);

	const totalIncomes = incomes.reduce(
		(s: number, e: any) => s + Number(e.amount),
		0,
	);

	const totalExpenses = expenses.reduce(
		(s: number, e: any) => s + Number(e.amount),
		0,
	);

	return (
		<div className="mx-auto max-w-5xl">
			<PageHeader
				title="Relatórios Visuais"
				description="Análise gráfica do desempenho financeiro da clínica"
			/>

			<div className="grid gap-6 lg:grid-cols-5">
				<Card className="lg:col-span-3">
					<CardHeader>
						<CardTitle>Fluxo de Caixa Mensal</CardTitle>
						<CardDescription>
							Comparativo de entradas e saídas por mês
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<p className="py-12 text-center text-sm text-muted-foreground">
								Processando dados financeiros...
							</p>
						) : monthlyFlow.length === 0 ? (
							<p className="py-12 text-center text-sm text-muted-foreground">
								Sem dados para exibir.
							</p>
						) : (
							<ChartContainer config={flowConfig} className="h-72 w-full">
								<BarChart data={monthlyFlow} accessibilityLayer>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey="month"
										tickLine={false}
										axisLine={false}
										tickMargin={8}
									/>
									<YAxis
										tickLine={false}
										axisLine={false}
										width={70}
										tickFormatter={(v) => formatBRL(Number(v))}
									/>
									<ChartTooltip
										content={
											<ChartTooltipContent
												formatter={(v) => formatBRL(Number(v))}
											/>
										}
									/>
									<ChartLegend content={<ChartLegendContent />} />
									<Bar
										dataKey="incomes"
										fill="var(--color-incomes)"
										radius={[6, 6, 0, 0]}
									/>
									<Bar
										dataKey="expenses"
										fill="var(--color-expenses)"
										radius={[6, 6, 0, 0]}
									/>
								</BarChart>
							</ChartContainer>
						)}
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Receita por Serviço</CardTitle>
						<CardDescription>Distribuição das entradas</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<p className="py-12 text-center text-sm text-muted-foreground">
								Renderizando gráfico...
							</p>
						) : revenueByService.length === 0 ? (
							<p className="py-12 text-center text-sm text-muted-foreground">
								Sem dados para exibir.
							</p>
						) : (
							<ChartContainer
								config={serviceConfig}
								className="mx-auto aspect-square max-h-72"
							>
								<PieChart>
									<ChartTooltip
										content={
											<ChartTooltipContent
												nameKey="name"
												formatter={(v) => formatBRL(Number(v))}
											/>
										}
									/>
									<Pie
										data={revenueByService}
										dataKey="total"
										nameKey="name"
										innerRadius={55}
									>
										{revenueByService.map((_, i) => (
											<Cell key={i} fill={pieColors[i % pieColors.length]} />
										))}
									</Pie>
									<ChartLegend
										content={<ChartLegendContent nameKey="name" />}
									/>
								</PieChart>
							</ChartContainer>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<p className="text-sm text-muted-foreground">Total de Entradas</p>
						<p className="mt-1 text-2xl font-semibold text-success">
							{isLoading ? "Calculando..." : formatBRL(totalIncomes)}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<p className="text-sm text-muted-foreground">Total de Saídas</p>
						<p className="mt-1 text-2xl font-semibold text-destructive">
							{isLoading ? "Calculando..." : formatBRL(totalExpenses)}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<p className="text-sm text-muted-foreground">Saldo</p>
						<p className="mt-1 text-2xl font-semibold text-primary">
							{isLoading
								? "Calculando..."
								: formatBRL(totalIncomes - totalExpenses)}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
