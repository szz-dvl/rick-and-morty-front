
interface CharacterInfo {
    name: string;
    url: string;
}

export interface Character {

    id: number;
    name: string;
    status: "Alive" | 'Dead' | 'unknown';
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