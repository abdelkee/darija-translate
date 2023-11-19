"use client";
import React, { useRef, useState } from "react";
import {
  HiMiniPaperAirplane,
  HiArrowsRightLeft,
  HiArrowPath,
} from "react-icons/hi2";
import { supabase } from "./utils/supabaseServer";
import copy from "clipboard-copy";
import toast, { Toaster } from "react-hot-toast";

export const revalidate = 0;

export type LanguageType = "Español" | "Darija";
type DarijaResultType = {
  darija_word: string;
};
type SpanishResultType = {
  spanish_word: string;
};
const laguages: [LanguageType, LanguageType] = ["Español", "Darija"];

function HomePage() {
  const [languageFrom, setLanguageFrom] = useState<LanguageType>(laguages[0]);
  const [languageTo, setLanguageTo] = useState<LanguageType>(laguages[1]);
  const [inputValue, setInputValue] = useState("");
  const [translatedWord, setTranslatedWord] = useState("");
  const inputRef = useRef(null);
  const [translating, setTranslating] = useState(false);

  const translateToDarija = async (formData: FormData) => {
    setTranslating(true);
    const wordToTranslate = formData.get("wordToTranslate")?.toString().trim();
    let { data, error } = await supabase
      .from("vocab")
      .select("darija_word")
      .eq("spanish_word", wordToTranslate?.toString().toLowerCase());

    setTimeout(() => {
      if (error) return console.log("Error getting the translation ", error);

      if (data === null || data.length === 0) {
        setTranslatedWord("No existe aun en base de datos");
        setTranslating(false);
      } else {
        const translationResult = data[0]?.darija_word as string;
        setTranslatedWord(translationResult);
        setTranslating(false);
      }
    }, 1000);
  };

  const translateToSpanish = async (formData: FormData) => {
    setTranslating(true);
    const wordToTranslate = formData.get("wordToTranslate")?.toString().trim();
    let { data, error } = await supabase
      .from("vocab")
      .select("spanish_word")
      .eq("darija_word", wordToTranslate?.toString().toLowerCase());
    setTimeout(() => {
      if (error) return console.log("Error getting the translation ", error);
      if (data === null || data.length === 0) {
        setTranslatedWord("No existe aun en base de datos");
        setTranslating(false);
      } else {
        const translationResult = data[0]?.spanish_word as string;
        setTranslatedWord(translationResult);
        setTranslating(false);
      }
    }, 1000);
  };

  const switchLanguages = () => {
    setLanguageFrom(languageTo);
    setLanguageTo(languageFrom);
  };

  const handleInputFocus = () => {
    // @ts-ignore
    inputRef.current.select();
  };

  const copyResult = async () => {
    await copy(translatedWord);
    toast.success("Copiado!");
  };
  return (
    <main className="pt-16 gap-5 flex flex-col">
      <Toaster />
      <section className="p-2 rounded-lg shadow-md border border-typography/30 bg-neutral flex flex-col gap-2 transform transition-transform">
        <form
          action={
            languageFrom === "Español" ? translateToDarija : translateToSpanish
          }
          className="p-6 w-full flex justify-between gap-4"
        >
          <input
            type="text"
            name="wordToTranslate"
            ref={inputRef}
            onFocus={handleInputFocus}
            placeholder={
              languageFrom === "Español" ? "Escribe aqui" : "Ketbi hna"
            }
            className="flex-1 focus:outline-none bg-transparent focus:bg-transparent"
            onChange={(e) => setInputValue(e.target.value)}
          />
          {!translating ? (
            <button
              type="submit"
              className="text-primary disabled:text-primary/20"
              disabled={!inputValue}
            >
              <HiMiniPaperAirplane size={24} />
            </button>
          ) : (
            <div>
              <HiArrowPath
                size={24}
                className="animate-spin text-typography/50"
              />
            </div>
          )}
        </form>
        <div className="w-3/4 self-center border-t border-secondary/30"></div>
        <div className="p-6 w-full">
          <span
            onClick={copyResult}
            className={` ${
              translatedWord === "No existe aun en base de datos"
                ? "text-red-400"
                : "text-primary font-semibold"
            }`}
          >
            {translatedWord}
          </span>
        </div>
      </section>
      <section className="p-2 flex justify-between gap-4">
        <p className="rounded-lg px-2 py-3 bg-neutral font-semibold flex-1 text-center order-1 transition-all">
          {languageFrom}
        </p>
        <button onClick={switchLanguages} className="order-2">
          <HiArrowsRightLeft size={24} />
        </button>
        <p
          className={`rounded-lg px-2 py-3 bg-neutral font-semibold flex-1 text-center order-3`}
        >
          {languageTo}
        </p>
      </section>
    </main>
  );
}

export default HomePage;
