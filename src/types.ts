
interface CharacterInfo {
    name: string;
    url: string;
}

export interface Character {

    id: number;
    name: string;
    status: 'Alive' | 'Dead' | 'unknown';
    species: string;
    type: string;
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
    origin: CharacterInfo;
    location: CharacterInfo;
    image: string;
    episode: string[];
    url: string;
    created: Date;
}

export enum Boundaries {
    M = 768,
    L = 1024,
    XL = 1920
}

export interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
}