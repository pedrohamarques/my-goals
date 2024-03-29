import { useEffect, useRef, useState } from "react";
import { Alert, Keyboard } from "react-native";
import Bottom from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";

import type { TransactionProps } from "@/components/Transactions/components/Transaction";

import { currencyFormat } from "@/utils/currencyFormat";
import { useGoalRepository } from "@/database/useGoalRepository";
import { useTransactionRepository } from "@/database/useTransactionRepository";

type Details = {
  name: string;
  total: string;
  current: string;
  percentage: number;
  transactions: TransactionProps[];
};

export function useDetails() {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [type, setType] = useState<"up" | "down">("up");
  const [goal, setGoal] = useState<Details>({} as Details);

  const { show } = useGoalRepository();
  const { create, findByGoal } = useTransactionRepository();

  const routeParams = useLocalSearchParams();
  const goalId = Number(routeParams.id);

  const bottomSheetRef = useRef<Bottom>(null);
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand();
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0);

  function fetchDetails() {
    try {
      if (goalId) {
        const goal = show(goalId);
        const transactions = findByGoal(goalId);

        if (!goal || !transactions) {
          return router.back();
        }

        setGoal({
          name: goal.name,
          current: currencyFormat(goal.current),
          total: currencyFormat(goal.total),
          percentage: (goal.current / goal.total) * 100,
          transactions: transactions.map((item) => ({
            ...item,
            date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
          })),
        });

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleNewTransaction() {
    try {
      let amountAsNumber = Number(amount.replace(",", "."));

      if (isNaN(amountAsNumber)) {
        return Alert.alert("Erro", "Valor inválido.");
      }

      if (type === "down") {
        amountAsNumber = amountAsNumber * -1;
      }

      create({ goalId, amount: amountAsNumber });

      Alert.alert("Sucesso", "Transação registrada!");

      handleBottomSheetClose();
      Keyboard.dismiss();

      setAmount("");
      setType("up");

      fetchDetails();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  return {
    isLoading,
    goal,
    type,
    bottomSheetRef,
    amount,
    setAmount,
    setType,
    handleNewTransaction,
    handleBottomSheetClose,
    handleBottomSheetOpen,
  };
}
