import React from "react";
import { Character } from "../../types";
import "./CharacterCard.css"

interface CharacterCardProps {
    character: Character
}

export default function CharacterCard({ character }: CharacterCardProps) {

    return (
        <div className="character-card">
            <div className="character-card--image">
                <img src={character.image} width="300" height="300" alt=""/>
            </div>
            <div className="character-card--info">
                {character.name}
            </div>
        </div>
    )
}