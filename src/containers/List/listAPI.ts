import { getData } from "../../common";
import { Character } from "../../types";

export const fetchPage = async (page: number): Promise<Character[]> => {

    const { characters } = await getData(`/character/list?page=${page}`);

    return characters.data.results;

}