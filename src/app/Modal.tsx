"use client";
import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { supabase } from "./utils/supabaseServer";
import { useRouter } from "next/navigation";

const categories = [
  "General",
  "Vehiculos",
  "Cuerpo",
  "Comida",
  "Colores",
  "Electronicos",
  "Ferreteria",
  "Animales",
  "Cocina",
  "Fashion",
  "Muebles",
];

type Props = {
  value: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  langFrom: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setTranslatedWord: React.Dispatch<React.SetStateAction<string>>;
};

function Modal({
  value,
  setIsModalOpen,
  langFrom,
  setInputValue,
  setTranslatedWord,
}: Props) {
  //   const [fromWord, setFromWord] = useState(value);
  //   const [toWord, setToWord] = useState("");
  const [singPlur, setSingPlur] = useState("singular");
  const [hasL, setHasL] = useState(true);
  const [gender, setGender] = useState("m");
  const [submitting, setSubmitting] = useState(false);

  const addWordToVocab = async (formData: FormData) => {
    setSubmitting(true);
    const fromWord = formData.get("from");
    const toWord = formData.get("to");
    const category = formData.get("category");
    if (!fromWord || !toWord || !category || !singPlur || !gender) return;

    const { data, error } = await supabase.from("vocab").insert([
      {
        spanish_word:
          langFrom === "Español"
            ? fromWord.toString().toLowerCase()
            : toWord.toString().toLowerCase(),
        darija_word:
          langFrom === "Darija"
            ? fromWord.toString().toLowerCase()
            : toWord.toString().toLowerCase(),
        category: category.toString().toLowerCase(),
        gender: gender,
        with_l: hasL,
        singular_or_plural: singPlur,
      },
    ]);
    if (error && !data)
      return console.log(
        "Error inserting the word to database ",
        error.message
      );
    setSubmitting(false);
    setInputValue("");
    setTranslatedWord("");
    setIsModalOpen(false);
  };

  return (
    <main className="fixed top-0 left-0 w-full h-full bg-black/60">
      <form
        action={addWordToVocab}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral rounded p-4 shadow-lg flex flex-col gap-4 w-full max-w-xl"
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="place-self-end"
        >
          <HiXMark size={24} />
        </button>
        <section className="flex flex-col gap-2">
          <input
            type="text"
            name="from"
            readOnly
            value={value}
            className="rounded w-full px-5 py-4 border border-gray-300 focus:outline-none read-only:bg-gray-100"
          />
          <input
            type="text"
            name="to"
            required
            className="rounded w-full px-5 py-4 border border-gray-300 focus:outline-none focus:ring focus:ring-highlight"
          />
        </section>
        <section className="flex justify-between gap-2">
          <select className="flex-1 focus:outline-none p-4" name="category">
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </section>
        <RadioInput
          name="sing_plur"
          state={singPlur}
          setState={setSingPlur}
          value1="singular"
          value2="plural"
        />
        <RadioInput
          name="withL"
          state={hasL}
          setState={setHasL}
          value1={true}
          value2={false}
        />
        <RadioInput
          name="gender"
          state={gender}
          setState={setGender}
          value1="m"
          value2="f"
        />
        <button
          disabled={submitting}
          className="p-2 bg-typography rounded text-neutral mt-8 disabled:bg-gray-200"
        >
          {submitting ? "Añadiendo..." : "Añade"}
        </button>
      </form>
    </main>
  );
}

export default Modal;

type RadioProps = {
  name: string;
  state: string | boolean;
  setState:
    | React.Dispatch<React.SetStateAction<string>>
    | React.Dispatch<React.SetStateAction<boolean>>;
  value1: any;
  value2: any;
};
function RadioInput({ name, state, setState, value1, value2 }: RadioProps) {
  return (
    <section className="flex justify-between gap-2">
      <label
        className={`rounded border border-gray-100 p-4 flex-1 text-center cursor-pointer ${
          state === value1 && "bg-highlight text-neutral"
        }`}
      >
        <span>{value1 === true ? "Con L" : value1}</span>
        <input
          type="radio"
          name={name}
          checked={state === value1}
          onChange={() => setState(value1)}
          className="hidden"
        />
      </label>
      <label
        className={`rounded border border-gray-100 p-4 flex-1 text-center cursor-pointer ${
          state === value2 && "bg-highlight text-neutral"
        }`}
      >
        <span>{value2 === false ? "Sin L" : value2}</span>
        <input
          type="radio"
          name={name}
          checked={state === value2}
          onChange={() => setState(value2)}
          className="hidden"
        />
      </label>
    </section>
  );
}
