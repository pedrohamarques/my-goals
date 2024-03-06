import React from "react";
import { View } from "react-native";

import { Input } from "@/components/Input";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { BottomSheet } from "@/components/BottomSheet";
import { Goals } from "@/components/Goals";
import { Transactions } from "@/components/Transactions";

import { useHome } from "./home.hook";

export default function Home() {
  const {
    bottomSheetRef,
    goals,
    handleBottomSheetClose,
    handleBottomSheetOpen,
    handleCreate,
    handleDetails,
    transactions,
    setName,
    setTotal,
    total,
    name,
  } = useHome();

  return (
    <View className="flex-1 p-8">
      <Header
        title="Suas metas"
        subtitle="Poupe hoje para colher os frutos amanhã."
      />

      <Goals
        goals={goals}
        onAdd={handleBottomSheetOpen}
        onPress={handleDetails}
      />

      <Transactions transactions={transactions} />

      <BottomSheet
        ref={bottomSheetRef}
        title="Nova meta"
        snapPoints={[0.01, 284]}
        onClose={handleBottomSheetClose}
      >
        <Input placeholder="Nome da meta" onChangeText={setName} value={name} />

        <Input
          placeholder="Valor"
          keyboardType="numeric"
          onChangeText={setTotal}
          value={total}
        />

        <Button title="Criar" onPress={handleCreate} />
      </BottomSheet>
    </View>
  );
}
