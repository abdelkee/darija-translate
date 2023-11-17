"use client";
import React, { useRef, useState } from "react";
import { HiMiniPaperAirplane, HiArrowsRightLeft } from "react-icons/hi2";
import { translateAction } from "./utils/translateAction";
import { supabase } from "./utils/supabaseServer";

export type LanguageType = "Español" | "Darija";

const laguages: [LanguageType, LanguageType] = ["Español", "Darija"];

function HomePage() {
  const [languageFrom, setLanguageFrom] = useState<LanguageType>(laguages[0]);
  const [languageTo, setLanguageTo] = useState<LanguageType>(laguages[1]);
  const [inputValue, setInputValue] = useState("");
  const [translatedWord, setTranslatedWord] = useState<string>("");
  const inputRef = useRef(null);
  const [translating, setTranslating] = useState(false);
  const translate = async (formData: FormData) => {
    setTranslating(true);
    const wordToTranslate = formData.get("wordToTranslate");
    const columnToFilter =
      languageFrom === "Español" ? "spanish_word" : "darija_word";
    const columnToSelect =
      languageFrom === "Español" ? "darija_word" : "spanish_word";

    let { data, error } = await supabase
      .from("vocab")
      .select(columnToSelect)
      .eq(columnToFilter, wordToTranslate);

    if (error) return console.log("Error getting the translation ", error);
    const wordTranslated = data;
    if (wordTranslated === null) {
      setTranslatedWord("oops");
    } else {
      const result = wordTranslated[0];
      setTranslatedWord(
        // @ts-ignore
        languageFrom === "Español" ? result.darija_word : result.spanish_word
      );
    }
  };

  const switchLanguages = () => {
    setLanguageFrom(languageTo);
    setLanguageTo(languageFrom);
  };

  const handleInputFocus = () => {
    // @ts-ignore
    inputRef.current.select();
  };
  return (
    <main className="pt-16 gap-5 flex flex-col">
      <section className="p-2 rounded-lg shadow-md border border-typography/30 bg-neutral flex flex-col gap-2">
        <form
          action={translate}
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
          <button
            type="submit"
            className="text-primary disabled:text-primary/20"
            disabled={!inputValue}
          >
            <HiMiniPaperAirplane size={24} />
          </button>
        </form>
        <div className="w-3/4 self-center border-t border-gray-300"></div>
        <div className="p-6 w-full">
          <p className="text-primary font-semibold ">{translatedWord}</p>
        </div>
      </section>
      <section className="p-2 flex justify-between gap-4">
        <p className="rounded-lg px-2 py-3 bg-neutral font-semibold flex-1 text-center">
          {languageFrom}
        </p>
        <button onClick={switchLanguages}>
          <HiArrowsRightLeft size={24} />
        </button>
        <p className="rounded-lg px-2 py-3 bg-neutral font-semibold flex-1 text-center">
          {languageTo}
        </p>
      </section>
    </main>
  );
}

export default HomePage;
