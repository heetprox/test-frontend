'use client'

import Input from "@/components/Input";
import Image from "next/image";
import { useState } from "react";
import { Token } from "@/components/Input";

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | undefined>();

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
   <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
    <div className="flex flex-col w-full max-w-md">
      <div className="text-4xl text-white b-font text-center">Invest in Crypto with Just a UPI Payments{"."}</div>
      <Input 
        value={inputValue}
        onChange={handleInputChange}
        onTokenSelect={handleTokenSelect}
        selectedToken={selectedToken}
      />
    </div>
   </div>
  );
}
