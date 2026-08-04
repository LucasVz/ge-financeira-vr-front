/** @format */

"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
	PlusCircle,
	Check,
	User,
	Package,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";

import incomesService from "@/services/incomesService";
import servicesService from "@/services/servicesService";
import paymentMethodsService from "@/services/paymentMethodsService";

import {
	formatBRL,
	type TipoAtendimento as AttendanceType,
} from "@/lib/finance-store";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

const installmentOptions = [1, 2, 3, 4, 5, 6, 10, 12];
const today = new Date().toISOString().slice(0, 10);

export default function IncomesPage() {
	const queryClient = useQueryClient();

	const [serviceId, setServiceId] = useState("");
	const [paymentMethodId, setPaymentMethodId] = useState("");
	const [amount, setAmount] = useState("");
	const [installments, setInstallments] = useState("1");
	const [type, setType] = useState<AttendanceType>("individual");
	const [date, setDate] = useState(today);

	const { data: services = [], isLoading: isLoadingServices } = useQuery(
		["services"],
		servicesService.getServices,
		{ refetchOnWindowFocus: false },
	);

	const { data: paymentMethods = [], isLoading: isLoadingPaymentMethods } =
		useQuery(["paymentMethods"], paymentMethodsService.getPaymentMethods, {
			refetchOnWindowFocus: false,
		});

	const { data: incomes = [], isLoading: isLoadingIncomes } = useQuery(
		["incomes"],
		incomesService.getIncomes,
		{ refetchOnWindowFocus: false },
	);

	const createMutation = useMutation(incomesService.postIncome, {
		onSuccess: () => {
			toast.success("Entrada registrada com sucesso!");
			resetForm();
			queryClient.invalidateQueries("incomes");
		},
		onError: () => {
			toast.error("Erro ao registrar a entrada.");
		},
	});

	const deleteMutation = useMutation(incomesService.deleteIncome, {
		onSuccess: () => {
			toast.success("Entrada removida.");
			queryClient.invalidateQueries("incomes");
		},
		onError: () => {
			toast.error("Erro ao remover a entrada.");
		},
	});

	const resetForm = () => {
		setServiceId("");
		setPaymentMethodId("");
		setAmount("");
		setInstallments("1");
		setType("individual");
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

		if (!serviceId || !paymentMethodId || !amountNum) {
			toast.error("Preencha serviço, forma de pagamento e valor.");
			return;
		}

		createMutation.mutate({
			serviceId: Number(serviceId),
			paymentMethodId: Number(paymentMethodId),
			amount: amountNum,
			installments: Number(installments),
			attendanceType: type,
			registrationDate: new Date(`${date}T12:00:00`).toISOString(),
		});
	};

	const formatIsoDate = (isoDate: string) => {
		if (!isoDate) return "—";
		const [year, month, day] = isoDate.split("T")[0].split("-");
		return `${day}/${month}/${year}`;
	};

	const getServiceName = (id: number) =>
		services.find((s: any) => s.id === id)?.name ?? "—";
	const getPaymentMethodName = (id: number) =>
		paymentMethods.find((f: any) => f.id === id)?.name ?? "—";

	const serviceItems = services.map((s: any) => ({
		value: String(s.id),
		label: s.name,
	}));
	const paymentMethodItems = paymentMethods.map((f: any) => ({
		value: String(f.id),
		label: f.name,
	}));
	const installmentItems = installmentOptions.map((p) => ({
		value: String(p),
		label: p === 1 ? "À Vista (1x)" : `${p}x`,
	}));

	const isFormLoading =
		isLoadingServices || isLoadingPaymentMethods || createMutation.isLoading;

	return (
		<div className="mx-auto max-w-5xl">
			<PageHeader
				title="Bem-vindo ao painel financeiro"
				description="Acompanhe suas receitas e despesas em tempo real"
			/>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
							<PlusCircle className="size-5" />
						</div>
						<div>
							<CardTitle>Registrar Entrada de Receita</CardTitle>
							<CardDescription>
								Preencha os dados do novo atendimento
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<div className="grid gap-5 md:grid-cols-2">
								<Field>
									<FieldLabel htmlFor="servico">Serviço</FieldLabel>
									<Select
										items={serviceItems}
										value={serviceId}
										onValueChange={(value) => setServiceId(value || "")}
										disabled={isFormLoading}
									>
										<SelectTrigger id="servico" className="w-full">
											<SelectValue placeholder="Selecione o serviço" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{services.map((s: any) => (
													<SelectItem key={s.id} value={String(s.id)}>
														{s.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>

								<Field>
									<FieldLabel htmlFor="forma">Forma de Pagamento</FieldLabel>
									<Select
										items={paymentMethodItems}
										value={paymentMethodId}
										onValueChange={(value) => setPaymentMethodId(value || "")}
										disabled={isFormLoading}
									>
										<SelectTrigger id="forma" className="w-full">
											<SelectValue placeholder="Selecione a forma" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{paymentMethods.map((f: any) => (
													<SelectItem key={f.id} value={String(f.id)}>
														{f.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>

								<Field>
									<FieldLabel htmlFor="valor">Valor de Entrada</FieldLabel>
									<Input
										id="valor"
										type="text"
										inputMode="numeric"
										placeholder="R$ 0,00"
										value={amount}
										onChange={handleAmountChange}
										disabled={createMutation.isLoading}
									/>
								</Field>

								<Field>
									<FieldLabel htmlFor="parcelas">
										Quantidade de Parcelas
									</FieldLabel>
									<Select
										items={installmentItems}
										value={installments}
										onValueChange={(value) => setInstallments(value || "")}
										disabled={createMutation.isLoading}
									>
										<SelectTrigger id="parcelas" className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{installmentOptions.map((p) => (
													<SelectItem key={p} value={String(p)}>
														{p === 1 ? "À Vista (1x)" : `${p}x`}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>

								<Field>
									<FieldLabel>Tipo de Serviço</FieldLabel>
									<ToggleGroup
										variant="outline"
										spacing={2}
										value={[type]}
										onValueChange={(v: string[]) => {
											if (v.length) setType(v[v.length - 1] as AttendanceType);
										}}
										className="w-full"
										disabled={createMutation.isLoading}
									>
										<ToggleGroupItem
											value="individual"
											className="h-16 flex-1 flex-col gap-1"
										>
											<User />
											<span>Individual</span>
										</ToggleGroupItem>
										<ToggleGroupItem
											value="pacote"
											className="h-16 flex-1 flex-col gap-1"
										>
											<Package />
											<span>Pacote</span>
										</ToggleGroupItem>
									</ToggleGroup>
								</Field>

								<Field>
									<FieldLabel htmlFor="data">Data</FieldLabel>
									<Input
										id="data"
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
									disabled={isFormLoading || !serviceId || !paymentMethodId}
								>
									<Check data-icon="inline-start" />
									{createMutation.isLoading
										? "Registrando..."
										: "Registrar Entrada"}
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
					<CardTitle>Entradas registradas</CardTitle>
					<CardDescription>
						{isLoadingIncomes
							? "Carregando histórico..."
							: "Histórico das receitas lançadas"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoadingIncomes ? (
						<div className="flex justify-center p-4">
							Buscando lançamentos...
						</div>
					) : incomes.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<TrendingUp />
								</EmptyMedia>
								<EmptyTitle>Nenhuma entrada registrada</EmptyTitle>
								<EmptyDescription>
									As receitas lançadas aparecerão aqui.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Data</TableHead>
										<TableHead>Serviço</TableHead>
										<TableHead>Pagamento</TableHead>
										<TableHead>Tipo</TableHead>
										<TableHead className="text-right">Parcelas</TableHead>
										<TableHead className="text-right">Valor</TableHead>
										<TableHead className="w-10" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{[...incomes].reverse().map((e: any) => (
										<TableRow key={e.id}>
											<TableCell>{formatIsoDate(e.registrationDate)}</TableCell>
											<TableCell className="font-medium">
												{getServiceName(e.serviceId)}
											</TableCell>
											<TableCell>
												{getPaymentMethodName(e.paymentMethodId)}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														e.attendanceType === "pacote"
															? "secondary"
															: "outline"
													}
												>
													{e.attendanceType === "pacote"
														? "Pacote"
														: "Individual"}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												{e.installments}x
											</TableCell>
											<TableCell className="text-right font-medium text-success">
												{formatBRL(e.amount)}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													aria-label="Remover entrada"
													onClick={() => deleteMutation.mutate(e.id)}
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
