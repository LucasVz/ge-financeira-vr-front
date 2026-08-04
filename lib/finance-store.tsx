/** @format */

"use client";

import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

/* ---------- Tipos (espelham a modelagem do banco) ---------- */

export type Categoria = {
	id: number;
	nome: string;
};

export type Servico = {
	id: number;
	nome: string;
	categoriaId: number;
};

export type FormaPagamento = {
	id: number;
	nome: string;
};

export type TipoAtendimento = "individual" | "pacote";

export type Entrada = {
	id: number;
	servicoId: number;
	formaPagamentoId: number;
	valorEntrada: number;
	parcelas: number;
	tipoAtendimento: TipoAtendimento;
	dataRegistro: string; // ISO yyyy-mm-dd
};

export type Saida = {
	id: number;
	descricao: string;
	valorSaida: number;
	tipoSaida: string;
	dataRegistro: string; // ISO yyyy-mm-dd
};

/* ---------- Dados iniciais (exemplo) ---------- */

const seedCategorias: Categoria[] = [
	{ id: 1, nome: "Estética Facial" },
	{ id: 2, nome: "Estética Corporal" },
	{ id: 3, nome: "Consultas" },
];

const seedServicos: Servico[] = [
	{ id: 1, nome: "Limpeza de Pele", categoriaId: 1 },
	{ id: 2, nome: "Peeling Químico", categoriaId: 1 },
	{ id: 3, nome: "Drenagem Linfática", categoriaId: 2 },
	{ id: 4, nome: "Massagem Modeladora", categoriaId: 2 },
	{ id: 5, nome: "Avaliação Inicial", categoriaId: 3 },
];

const seedFormas: FormaPagamento[] = [
	{ id: 1, nome: "Dinheiro" },
	{ id: 2, nome: "PIX" },
	{ id: 3, nome: "Cartão de Crédito" },
	{ id: 4, nome: "Cartão de Débito" },
];

const seedEntradas: Entrada[] = [
	{
		id: 1,
		servicoId: 1,
		formaPagamentoId: 2,
		valorEntrada: 180,
		parcelas: 1,
		tipoAtendimento: "individual",
		dataRegistro: "2026-03-02",
	},
	{
		id: 2,
		servicoId: 3,
		formaPagamentoId: 3,
		valorEntrada: 640,
		parcelas: 4,
		tipoAtendimento: "pacote",
		dataRegistro: "2026-03-05",
	},
	{
		id: 3,
		servicoId: 2,
		formaPagamentoId: 1,
		valorEntrada: 250,
		parcelas: 1,
		tipoAtendimento: "individual",
		dataRegistro: "2026-03-09",
	},
	{
		id: 4,
		servicoId: 4,
		formaPagamentoId: 3,
		valorEntrada: 900,
		parcelas: 6,
		tipoAtendimento: "pacote",
		dataRegistro: "2026-03-11",
	},
	{
		id: 5,
		servicoId: 5,
		formaPagamentoId: 4,
		valorEntrada: 120,
		parcelas: 1,
		tipoAtendimento: "individual",
		dataRegistro: "2026-03-12",
	},
];

const seedSaidas: Saida[] = [
	{
		id: 1,
		descricao: "Aluguel do espaço",
		valorSaida: 2200,
		tipoSaida: "Fixa",
		dataRegistro: "2026-03-01",
	},
	{
		id: 2,
		descricao: "Compra de insumos",
		valorSaida: 480,
		tipoSaida: "Variável",
		dataRegistro: "2026-03-04",
	},
	{
		id: 3,
		descricao: "Energia elétrica",
		valorSaida: 320,
		tipoSaida: "Fixa",
		dataRegistro: "2026-03-08",
	},
	{
		id: 4,
		descricao: "Marketing / anúncios",
		valorSaida: 300,
		tipoSaida: "Variável",
		dataRegistro: "2026-03-10",
	},
];

/* ---------- Contexto ---------- */

type FinanceContextValue = {
	categorias: Categoria[];
	servicos: Servico[];
	formasPagamento: FormaPagamento[];
	entradas: Entrada[];
	saidas: Saida[];
	addCategoria: (nome: string) => void;
	removeCategoria: (id: number) => void;
	addServico: (nome: string, categoriaId: number) => void;
	removeServico: (id: number) => void;
	addFormaPagamento: (nome: string) => void;
	removeFormaPagamento: (id: number) => void;
	addEntrada: (data: Omit<Entrada, "id">) => void;
	removeEntrada: (id: number) => void;
	addSaida: (data: Omit<Saida, "id">) => void;
	removeSaida: (id: number) => void;
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

const nextId = (list: { id: number }[]) =>
	list.reduce((max, item) => Math.max(max, item.id), 0) + 1;

export function FinanceProvider({ children }: { children: ReactNode }) {
	const [categorias, setCategorias] = useState<Categoria[]>(seedCategorias);
	const [servicos, setServicos] = useState<Servico[]>(seedServicos);
	const [formasPagamento, setFormasPagamento] =
		useState<FormaPagamento[]>(seedFormas);
	const [entradas, setEntradas] = useState<Entrada[]>(seedEntradas);
	const [saidas, setSaidas] = useState<Saida[]>(seedSaidas);

	const value = useMemo<FinanceContextValue>(
		() => ({
			categorias,
			servicos,
			formasPagamento,
			entradas,
			saidas,
			addCategoria: (nome) =>
				setCategorias((prev) => [...prev, { id: nextId(prev), nome }]),
			removeCategoria: (id) =>
				setCategorias((prev) => prev.filter((c) => c.id !== id)),
			addServico: (nome, categoriaId) =>
				setServicos((prev) => [
					...prev,
					{ id: nextId(prev), nome, categoriaId },
				]),
			removeServico: (id) =>
				setServicos((prev) => prev.filter((s) => s.id !== id)),
			addFormaPagamento: (nome) =>
				setFormasPagamento((prev) => [...prev, { id: nextId(prev), nome }]),
			removeFormaPagamento: (id) =>
				setFormasPagamento((prev) => prev.filter((f) => f.id !== id)),
			addEntrada: (data) =>
				setEntradas((prev) => [...prev, { id: nextId(prev), ...data }]),
			removeEntrada: (id) =>
				setEntradas((prev) => prev.filter((e) => e.id !== id)),
			addSaida: (data) =>
				setSaidas((prev) => [...prev, { id: nextId(prev), ...data }]),
			removeSaida: (id) => setSaidas((prev) => prev.filter((s) => s.id !== id)),
		}),
		[categorias, servicos, formasPagamento, entradas, saidas],
	);

	return (
		<FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
	);
}

export function useFinance() {
	const ctx = useContext(FinanceContext);
	if (!ctx)
		throw new Error("useFinance deve ser usado dentro de FinanceProvider");
	return ctx;
}

/* ---------- Utilidades ---------- */
export const formatBRL = (valor: number) => {
	return Number(valor).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
};

export const formatDate = (iso: string) => {
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return `${d}/${m}/${y}`;
};
