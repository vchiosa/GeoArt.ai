// src/context/SelectionContext.tsx
"use client";

import React, { createContext, useState, ReactNode } from "react";

interface SelectionContextProps {
  productCategory: string;
  setProductCategory: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  styles: string[];
  setStyles: (value: string[]) => void;
}

const defaultContext: SelectionContextProps = {
  productCategory: "",
  setProductCategory: () => {},
  country: "",
  setCountry: () => {},
  city: "",
  setCity: () => {},
  styles: [],
  setStyles: () => {},
};

export const SelectionContext =
  createContext<SelectionContextProps>(defaultContext);

interface SelectionProviderProps {
  children: ReactNode;
}

export function SelectionProvider({ children }: SelectionProviderProps) {
  const [productCategory, setProductCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [styles, setStyles] = useState<string[]>([]);

  return (
    <SelectionContext.Provider
      value={{
        productCategory,
        setProductCategory,
        country,
        setCountry,
        city,
        setCity,
        styles,
        setStyles,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}
