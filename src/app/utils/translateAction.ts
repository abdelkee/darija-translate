"use server";

import { LanguageType } from "../page";
import { supabase } from "./supabaseServer";

export const translateAction = async (formData: FormData, languageFrom: LanguageType) => {

    const wordToTranslate = formData.get("wordToTranslate");
    const columnToFilter = languageFrom === 'Español' ? 'spanish_word' : 'darija_word'
    const columnToSelect = languageFrom === 'Español' ? 'darija_word' : 'spanish_word'

    let { data: wordTranslated, error } = await supabase
        .from('vocab')
        .select(columnToSelect)
        .eq(columnToFilter, wordToTranslate)
    console.log(wordTranslated);


    // console.log(wordToTranslate);
    // console.log(languageFrom);

}