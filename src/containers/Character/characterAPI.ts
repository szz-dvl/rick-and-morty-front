import { getData } from "../../common";
import { Character } from "../../types";
export { favorite, unfavorite } from "../List/listAPI";

export const fetchCharacter = async (id: number): Promise<{character: Character, isFav: boolean}> => {

    const { character, isFav } = await getData(`/character/${id}`);
    return { character: character.data, isFav };

} 