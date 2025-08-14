"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AdminTransaction = {
	id?: string;
	signature?: string;
	hash?: string;
	amount?: number;
	feeAmount?: number;
	timestamp?: string;
	createdAt?: string;
	from?: string;
	to?: string;
};

type TransactionsResponse = {
	success: boolean;
	data: AdminTransaction[];
	error?: string;
};

type AmountResponse = {
	success: boolean;
	data?: { amount?: number } | number;
	amount?: number;
	error?: string;
};

export default function FeeDistributionTable() {
	const [unharvested, setUnharvested] = useState<AdminTransaction[]>([]);
	const [undistributed, setUndistributed] = useState<AdminTransaction[]>([]);

	const [isLoading, setIsLoading] = useState({
		unharvested: false,
		undistributed: false,
		actions: false,
		amount: false,
	});
	const [errors, setErrors] = useState<{ unharvested?: string | null; undistributed?: string | null; actions?: string | null; amount?: string | null }>({});
	const [unharvestedAmount, setUnharvestedAmount] = useState<number | null>(null);

	const formatNumber = (value?: number) => {
		if (value === undefined || value === null || Number.isNaN(value)) return "0";
		return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
	};

	const signatureOf = (tx: AdminTransaction) => tx.signature || tx.hash || tx.id || "";
	const timestampOf = (tx: AdminTransaction) => tx.timestamp || tx.createdAt || "";

	const loadUnharvested = useCallback(async () => {
		setIsLoading((s) => ({ ...s, unharvested: true }));
		setErrors((e) => ({ ...e, unharvested: null }));
		try {
			const res = await fetch(`/api/admin/fees/unharvested-transactions`);
			const json: TransactionsResponse = await res.json().catch(() => ({ success: false, data: [], error: "Invalid JSON" }));
			if (!res.ok || !json?.success) {
				throw new Error(json?.error || `HTTP ${res.status}`);
			}
			setUnharvested(Array.isArray(json.data) ? json.data : []);
		} catch (err) {
			console.error("Failed to load unharvested transactions", err);
			setUnharvested([]);
			setErrors((e) => ({ ...e, unharvested: "Failed to load unharvested transactions" }));
		} finally {
			setIsLoading((s) => ({ ...s, unharvested: false }));
		}
	}, []);

	const loadUndistributed = useCallback(async () => {
		setIsLoading((s) => ({ ...s, undistributed: true }));
		setErrors((e) => ({ ...e, undistributed: null }));
		try {
			const res = await fetch(`/api/admin/fees/undistributed-transactions`);
			const json: TransactionsResponse = await res.json().catch(() => ({ success: false, data: [], error: "Invalid JSON" }));
			if (!res.ok || !json?.success) {
				throw new Error(json?.error || `HTTP ${res.status}`);
			}
			setUndistributed(Array.isArray(json.data) ? json.data : []);
		} catch (err) {
			console.error("Failed to load undistributed transactions", err);
			setUndistributed([]);
			setErrors((e) => ({ ...e, undistributed: "Failed to load undistributed transactions" }));
		} finally {
			setIsLoading((s) => ({ ...s, undistributed: false }));
		}
	}, []);

	const refreshAll = useCallback(async () => {
		await Promise.allSettled([loadUnharvested(), loadUndistributed()]);
	}, [loadUnharvested, loadUndistributed]);

	useEffect(() => {
		refreshAll();
	}, [refreshAll]);

	const handleHarvest = useCallback(async () => {
		setIsLoading((s) => ({ ...s, actions: true }));
		setErrors((e) => ({ ...e, actions: null }));
		try {
			const res = await fetch(`/api/admin/fees/harvest`, { method: "POST" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			await refreshAll();
		} catch (err) {
			console.error("Harvest action failed", err);
			setErrors((e) => ({ ...e, actions: "Harvest failed" }));
		} finally {
			setIsLoading((s) => ({ ...s, actions: false }));
		}
	}, [refreshAll]);

	const handleDistribute = useCallback(async () => {
		setIsLoading((s) => ({ ...s, actions: true }));
		setErrors((e) => ({ ...e, actions: null }));
		try {
			const res = await fetch(`/api/admin/fees/distribute`, { method: "POST" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			await refreshAll();
		} catch (err) {
			console.error("Distribute action failed", err);
			setErrors((e) => ({ ...e, actions: "Distribution failed" }));
		} finally {
			setIsLoading((s) => ({ ...s, actions: false }));
		}
	}, [refreshAll]);

	const handleProcessAll = useCallback(async () => {
		setIsLoading((s) => ({ ...s, actions: true }));
		setErrors((e) => ({ ...e, actions: null }));
		try {
			const res = await fetch(`/api/admin/fees/process-all`, { method: "POST" });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			await refreshAll();
		} catch (err) {
			console.error("Process-all action failed", err);
			setErrors((e) => ({ ...e, actions: "Process pending fees failed" }));
		} finally {
			setIsLoading((s) => ({ ...s, actions: false }));
		}
	}, [refreshAll]);

	const handleGetUnharvestedAmount = useCallback(async () => {
		setIsLoading((s) => ({ ...s, amount: true }));
		setErrors((e) => ({ ...e, amount: null }));
		try {
			const res = await fetch(`/api/admin/fees/unharvested-amount`);
			const json: AmountResponse = await res.json().catch(() => ({ success: false, error: "Invalid JSON" }));
			if (!res.ok || json?.success === false) throw new Error(json?.error || `HTTP ${res.status}`);

			const amt = typeof json === "number"
				? json
				: typeof json?.data === "number"
					? json.data
					: typeof (json?.data as any)?.amount === "number"
						? (json.data as any).amount
						: typeof json?.amount === "number"
							? json.amount
							: null;
			setUnharvestedAmount(amt);
		} catch (err) {
			console.error("Failed to get unharvested amount", err);
			setUnharvestedAmount(null);
			setErrors((e) => ({ ...e, amount: "Failed to fetch amount" }));
		} finally {
			setIsLoading((s) => ({ ...s, amount: false }));
		}
	}, []);

	const unharvestedCount = unharvested.length;
	const undistributedCount = undistributed.length;

	const actionsDisabled = useMemo(() => isLoading.actions || isLoading.unharvested || isLoading.undistributed, [isLoading]);

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<button onClick={handleHarvest} disabled={actionsDisabled} className="cursor-pointer px-3 py-2 bg-[#15C0B9] hover:bg-[#15C0B9]/90 disabled:opacity-60 text-white font-medium rounded-md transition-colors duration-200">
						Harvest fees
					</button>
					<button onClick={handleDistribute} disabled={actionsDisabled} className="cursor-pointer px-3 py-2 bg-[#15C0B9] hover:bg-[#15C0B9]/90 disabled:opacity-60 text-white font-medium rounded-md transition-colors duration-200">
						Distribute fees
					</button>
					<button onClick={handleProcessAll} disabled={actionsDisabled} className="cursor-pointer px-3 py-2 bg-[#15C0B9] hover:bg-[#15C0B9]/90 disabled:opacity-60 text-white font-medium rounded-md transition-colors duration-200">
						Harvest & Distribute
					</button>
					<button onClick={handleGetUnharvestedAmount} disabled={isLoading.amount} className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-60 text-white font-medium rounded-md transition-colors duration-200">
						Request unharvested amount
					</button>
				</div>
				{errors.actions ? (
					<div className="text-red-400 text-sm">{errors.actions}</div>
				) : null}
			</div>

			{unharvestedAmount !== null ? (
				<div className="rounded-md bg-white/5 border border-white/10 px-4 py-3 text-white/90">
					Unharvested amount: <span className="font-semibold">{formatNumber(unharvestedAmount)}</span>
				</div>
			) : errors.amount ? (
				<div className="rounded-md bg-red-900/30 border border-red-600/40 px-4 py-3 text-red-300">
					{errors.amount}
				</div>
			) : null}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-white">Unharvested fees</h3>
						<span className="text-white/70 text-sm">Count: {unharvestedCount}</span>
					</div>
					<div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 overflow-scroll max-h-[400px] scrollbar-custom">
						<table className="min-w-full table-fixed text-left text-sm text-white/90">
							<thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
								<tr>
									<th className="px-4 py-2">Signature</th>
									<th className="px-4 py-2">Amount</th>
									<th className="px-4 py-2">Fee</th>
									<th className="px-4 py-2">Time</th>
								</tr>
							</thead>
							<tbody>
								{isLoading.unharvested ? (
									<tr>
										<td colSpan={4} className="px-4 py-3 text-center text-white/60">Loading…</td>
									</tr>
								) : unharvested.length > 0 ? (
									unharvested.map((tx) => {
										const sig = signatureOf(tx);
										return (
											<tr key={`${sig}-${timestampOf(tx)}`} className="odd:bg-white/0 even:bg-white/[0.03]">
												<td className="px-4 py-3 font-mono">
													{sig ? (
														<Link href={`https://solscan.io/tx/${sig}`} target="_blank" className="text-blue-500 hover:text-blue-600">
															{sig}
														</Link>
													) : (
														<span className="text-white/60">N/A</span>
													)}
												</td>
												<td className="px-4 py-3">{formatNumber(tx.amount)}</td>
												<td className="px-4 py-3">{formatNumber(tx.feeAmount)}</td>
												<td className="px-4 py-3 whitespace-nowrap">{timestampOf(tx) || <span className="text-white/60">N/A</span>}</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={4} className="px-4 py-3 text-center text-white/60">No unharvested transactions</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{errors.unharvested ? (
						<div className="text-red-400 text-sm">{errors.unharvested}</div>
					) : null}
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-white">Undistributed fees</h3>
						<span className="text-white/70 text-sm">Count: {undistributedCount}</span>
					</div>
					<div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 overflow-scroll max-h-[400px] scrollbar-custom">
						<table className="min-w-full table-fixed text-left text-sm text-white/90">
							<thead className="sticky top-0 z-20 bg-[#2a413e] text-white">
								<tr>
									<th className="px-4 py-2">Signature</th>
									<th className="px-4 py-2">Amount</th>
									<th className="px-4 py-2">Fee</th>
									<th className="px-4 py-2">Time</th>
								</tr>
							</thead>
							<tbody>
								{isLoading.undistributed ? (
									<tr>
										<td colSpan={4} className="px-4 py-3 text-center text-white/60">Loading…</td>
									</tr>
								) : undistributed.length > 0 ? (
									undistributed.map((tx) => {
										const sig = signatureOf(tx);
										return (
											<tr key={`${sig}-${timestampOf(tx)}`} className="odd:bg-white/0 even:bg-white/[0.03]">
												<td className="px-4 py-3 font-mono">
													{sig ? (
														<Link href={`https://solscan.io/tx/${sig}`} target="_blank" className="text-blue-500 hover:text-blue-600">
															{sig}
														</Link>
													) : (
														<span className="text-white/60">N/A</span>
													)}
												</td>
												<td className="px-4 py-3">{formatNumber(tx.amount)}</td>
												<td className="px-4 py-3">{formatNumber(tx.feeAmount)}</td>
												<td className="px-4 py-3 whitespace-nowrap">{timestampOf(tx) || <span className="text-white/60">N/A</span>}</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={4} className="px-4 py-3 text-center text-white/60">No undistributed transactions</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					{errors.undistributed ? (
						<div className="text-red-400 text-sm">{errors.undistributed}</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
