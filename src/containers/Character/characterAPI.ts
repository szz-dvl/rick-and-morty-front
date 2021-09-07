import { getData } from "../../common";
import { Character, Episode } from "../../types";
export { favorite, unfavorite } from "../List/listAPI";

export const fetchCharacter = async (id: number): Promise<{character: Character, isFav: boolean, status: number}> => {

    const { character, isFav } = await getData(`/character/${id}`);
    const { data, status } = character;

    return { character: data, isFav, status };
}

export const fetchEpisodes = async (episodes: number[]): Promise<Episode[]> => {

    const data = await Promise.all(episodes.map((id) => {
        return getData(`/character/episode/${id}`, { cache: 'force-cache' });
    }));

    return data.map(info => {
        const { characters, url, created, ...episode } = info.episode.data;
        return episode;
    });
}

