import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { router } from "expo-router";
import Bottom from "@gorhom/bottom-sheet";
import dayjs from "dayjs";

import type { GoalsProps } from "@/components/Goals";
import type { TransactionsProps } from "@/components/Transactions";

import { mocks } from "@/utils/mocks";

export function useHome() {
  const [transactions, setTransactions] = useState<TransactionsProps>([]);
  const [goals, setGoals] = useState<GoalsProps>([]);

  // FORM
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");

  // BOTTOM SHEET
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

      console.log({ name, total: totalAsNumber });

      Keyboard.dismiss();
      handleBottomSheetClose();
      Alert.alert("Sucesso", "Meta cadastrada!");

      setName("");
      setTotal("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
      console.log(error);
    }
  }

  async function fetchGoals() {
    try {
      const response = mocks.goals;
      setGoals(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTransactions() {
    try {
      const response = mocks.transactions;

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
