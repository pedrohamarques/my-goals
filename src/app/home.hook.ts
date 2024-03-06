import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { router } from "expo-router";
import Bottom from "@gorhom/bottom-sheet";
import dayjs from "dayjs";

import type { GoalsProps } from "@/components/Goals/Goals";
import type { TransactionsProps } from "@/components/Transactions/Transactions";

import { useGoalRepository } from "@/database/useGoalRepository";
import { useTransactionRepository } from "@/database/useTransactionRepository";

export function useHome() {
  const [transactions, setTransactions] = useState<TransactionsProps>([]);
  const [goals, setGoals] = useState<GoalsProps>([]);

  const [name, setName] = useState("");
  const [total, setTotal] = useState("");

  const { create, all } = useGoalRepository();
  const { findLatest } = useTransactionRepository();

  const bottomSheetRef = useRef<Bottom>(null);
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand();
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0);

  function handleDetails(id: string) {
    router.navigate("/details/" + id);
  }

  async function handleCreate() {
    try {
      const totalAsNumber = Number(total.toString().replace(",", "."));

      if (isNaN(totalAsNumber)) {
        return Alert.alert("Erro", "Valor inválido.");
      }

      create({ name, total: totalAsNumber });

      Keyboard.dismiss();
      handleBottomSheetClose();
      Alert.alert("Sucesso", "Meta cadastrada!");

      setName("");
      setTotal("");

      fetchGoals();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
      console.log(error);
    }
  }

  async function fetchGoals() {
    try {
      const response = all();
      setGoals(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTransactions() {
    try {
      const response = findLatest();

      setTransactions(
        response.map((item) => ({
          ...item,
          date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGoals();
    fetchTransactions();
  }, []);

  return {
    transactions,
    goals,
    bottomSheetRef,
    total,
    name,
    handleBottomSheetClose,
    handleBottomSheetOpen,
    handleCreate,
    handleDetails,
    setName,
    setTotal,
  };
}
