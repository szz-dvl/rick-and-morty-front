import React from "react";
import { Link } from "react-router-dom";
import { Character } from "../../types";
import { ReactComponent as Star } from '../../images/star.svg';
import { ReactComponent as Skull } from '../../images/skull.svg';
import { ReactComponent as Smiley } from '../../images/smiley.svg';
import { ReactComponent as Unknown } from '../../images/question_mark.svg';
import { ReactComponent as Genderless } from '../../images/circle.svg';
import { ReactComponent as Female } from '../../images/female.svg';
import { ReactComponent as Male } from '../../images/male.svg';
import "./CharacterCard.css"

export enum CardModes {
    T,
    SM,
    M,
    L,
    XL
}

interface CharacterCardProps {
    character: Character;
    isFav: boolean;
    fav: (id: number) => void;
    unfav: (id: number) => void;
    mode: CardModes,
    style: any
}

const CharacterCard = ({ character, isFav, unfav, fav, mode, style }: CharacterCardProps) => {

    const getImageSize = () => {
        if (mode <= CardModes.SM) 
            return 140;
        else if (mode <= CardModes.M)
            return 220
        else
            return 260;
    }

    return (
        <div className="character-card" style={style}>
            <div className="character-card--links">
                <div className="character-card--name">
                    <Link
                        to={{
                            pathname: "/character/" + character.id,
                            state: { character_name: character.name }
                        }}
                    >
                        {character.name}
                    </Link>
                </div>
                <div className={`character-card--fav ${isFav ? 'fav' : 'no-fav'} ${mode <= CardModes.SM ? "small" : ""}`} onClick={() => isFav ? unfav(character.id) : fav(character.id)}>
                    <Star />
                </div>
            </div>
            {
                mode > CardModes.T &&
                <div className="character-card--data">
                    <div className="character-card--image">
                        <Link
                            to={{
                                pathname: "/character/" + character.id,
                                state: { character_name: character.name }
                            }}
                        >
                            <img src={character.image} width={getImageSize()} height={getImageSize()} alt="" />
                        </Link>
                    </div>
                    <div className="character-card--info">
                        <span>
                            {character.species} {character.type && `/ ${character.type}`}
                        </span>
                        <span className={`character-card--labeled ${mode <= CardModes.SM ? "small" : ""}`}>
                            <label>
                                First Seen:
                            </label>
                            <span> {character.origin.name} </span>
                        </span>
                        <span className={`character-card--labeled ${mode <= CardModes.SM ? "small" : ""}`}>
                            <label>
                                Last location:
                            </label>
                            <span> {character.location.name} </span>
                        </span>
                    </div>
                </div>
            }
            {
                mode === CardModes.T &&
                <div className="character-card--data tiny">
                    <div className="character-card--image tiny">
                        <Link
                            to={{
                                pathname: "/character/" + character.id,
                                state: { character_name: character.name }
                            }}
                        >
                            <img src={character.image} width="220" height="220" alt="" />
                        </Link>
                    </div>
                    <span>
                        {character.species}
                    </span>
                </div>
            }
            <ul className="character-card--status">
                <li>
                    <span>
                        Gender:
                    </span>
                    <span>

                        {
                            {
                                Male: <Male title="Male" />,
                                Female: <Female title="Female" />,
                                Genderless: <Genderless title="Genderless" className="gender--genderless"/>,
                                unknown: <Unknown title="Unknown" className="status--unknown" />
                            }[character.gender]
                        }
                    </span>
                </li>
                <li>
                    <span>
                        Status:
                    </span>
                    <span>
                        {
                            {
                                Alive: <Smiley className="status--alive" title="Alive" />,
                                Dead: <Skull className="status--dead" title="Dead" />,
                                unknown: <Unknown title="Unknown" className="status--unknown" />
                            }[character.status]
                        }
                    </span>
                </li>
            </ul>
        </div>
    )
};

export default CharacterCard;