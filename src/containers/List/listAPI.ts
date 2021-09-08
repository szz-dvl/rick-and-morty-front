import { getData, postData, deleteData } from "../../common";
import { Character } from "../../types";

export const fetchPage = async (page: number): Promise<{characters: Character[], maxPages: number}> => {

    const { characters } = await getData(`/character/list?page=${page}`);

    return { characters: characters.data.results, maxPages: characters.data.info.pages };
}

export const fetchFavorites = async (): Promise<{favorites: number[]}> => {

    return await getData(`/user/favorites`);

}

export const favorite = async (id: number): Promise<{favorites: number[]}> => {

    return await postData(`/user/favorite`, { id });

}

export const unfavorite = async (id: number): Promise<{favorites: number[]}> => {

    return  await deleteData(`/user/favorite/${id}`);

}