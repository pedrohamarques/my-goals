import React from "react";
import { View } from "react-native";

import { Input } from "@/components/Input";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { Progress } from "@/components/Progress";
import { BackButton } from "@/components/BackButton";
import { BottomSheet } from "@/components/BottomSheet";
import { Transactions } from "@/components/Transactions";
import { TransactionTypeSelect } from "@/components/TransactionTypeSelect";

import { useDetails } from "./details.hook";

export default function Details() {
  const {
    goal,
    handleBottomSheetClose,
    handleBottomSheetOpen,
    handleNewTransaction,
    isLoading,
    type,
    setType,
    bottomSheetRef,
    amount,
    setAmount,
  } = useDetails();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 p-8 pt-12">
      <BackButton />

      <Header title={goal.name} subtitle={`${goal.current} de ${goal.total}`} />

      <Progress percentage={goal.percentage} />

      <Transactions transactions={goal.transactions} />

      <Button title="Nova transação" onPress={handleBottomSheetOpen} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova transação"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <TransactionTypeSelect onChange={setType} selected={type} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setAmount}
          value={amount}
        />

        <Button title="Confirmar" onPress={handleNewTransaction} />
      </BottomSheet>
    </View>
  );
}
