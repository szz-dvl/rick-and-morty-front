import React, { useState } from "react";
import { useEffect } from "react";
import { Link, Redirect, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clean, fetch, fav, unfav } from "./characterSlice";
import { ReactComponent as Back } from '../../images/left_arrow.svg';
import { Boundaries } from "../../types";
import Episode from "../../components/Episode/Episode";
import { ReactComponent as Star } from '../../images/star.svg';
import { ReactComponent as Skull } from '../../images/skull.svg';
import { ReactComponent as Smiley } from '../../images/smiley.svg';
import { ReactComponent as Unknown } from '../../images/question_mark.svg';
import { ReactComponent as Genderless } from '../../images/circle.svg';
import { ReactComponent as Female } from '../../images/female.svg';
import { ReactComponent as Male } from '../../images/male.svg';
import "./Character.css";


interface StringTuple {
    title: string;
    data: string;
}

export default function Character() {

    const { character, in_progress, episodes, isFav, error } = useAppSelector((state) => state.character);

    const dispatch = useAppDispatch();

    const [data, setData] = useState<StringTuple[]>([])

    const { id } = useParams<{ id: string }>();
    const { state } = useLocation<{ character_name: string }>();

    useEffect(() => {
        dispatch(fetch(parseInt(id)));

        return function cleanup() {
            dispatch(clean());
        }
    }, [dispatch, id]);

    const getImageSize = () => {
        if (document.body.clientWidth <= Boundaries.M)
            return 140;
        else if (document.body.clientWidth > Boundaries.M && document.body.clientWidth <= Boundaries.L)
            return 220
        else
            return 260;
    }

    useEffect(() => {

        if (character) {
            setData([
                {
                    title: "First seen",
                    data: character.origin.name
                },
                {
                    title: "Last location",
                    data: character.location.name
                },
                {
                    title: "Specie",
                    data: character.species
                },
                {
                    title: "Type",
                    data: character.type
                }
            ]);
        }
    }, [character]);

    return (
        <div className="character-container">
            <div className="character-header">
                {!error &&
                    <div className="back-container">
                        <span>
                            <Link
                                to={{
                                    pathname: "/list"
                                }}
                            >
                                <Back />
                            </Link>
                        </span>
                    </div>
                }
                {
                    character &&
                    <div className="fav-container">
                        <span>
                            <Star
                                className={`${isFav ? 'fav' : 'no-fav'}`}
                                onClick={() => isFav ? dispatch(unfav(character.id)) : dispatch(fav(character.id))}
                            />
                        </span>
                    </div>
                }
            </div>
            {
                (character && data.length > 0 && episodes) &&
                <div className="character-info">
                    <h1>
                        <span>
                            {character.name}
                        </span>
                    </h1>
                    <div className="character-data">

                        <div className="character-image">
                            <img src={character.image} width={getImageSize()} height={getImageSize()} alt="" />
                        </div>

                        <div className="character-fields">
                            {
                                data.map((info) => {
                                    return (
                                        info.data ?
                                            <div className="character-field">
                                                <span className="field-title">
                                                    {info.title}:
                                                </span>
                                                <span className="field-data">
                                                    {info.data}
                                                </span>
                                            </div> :
                                            null
                                    );
                                })
                            }
                        </div>

                        <div className="character-status">
                            <div className="character-field">
                                <span className="field-title">
                                    Status:
                                </span>
                                <span className="field-data">
                                    {
                                        {
                                            Alive: <Smiley className="status--alive" title="Alive" />,
                                            Dead: <Skull className="status--dead" title="Dead" />,
                                            unknown: <Unknown title="Unknown" className="status--unknown" />
                                        }[character.status]
                                    }
                                </span>
                            </div>
                            <div className="character-field">
                                <span className="field-title">
                                    Gender:
                                </span>
                                <span className="field-data">
                                    {
                                        {
                                            Male: <Male title="Male" />,
                                            Female: <Female title="Female" />,
                                            Genderless: <Genderless title="Genderless" className="gender--genderless" />,
                                            unknown: <Unknown title="Unknown" className="status--unknown" />
                                        }[character.gender]
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="character-episodes">
                        <div className="character-field">
                            <span className="field-title">
                                Episodes:
                            </span>
                        </div>
                        <div className="episodes-list">
                            {
                                episodes.map((episode) => {
                                    return (
                                        <div>
                                            <Episode episode={episode} />
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            {
                in_progress && state && state.character_name &&
                <div className="character--in-progress">
                    <p> We are looking for {state.character_name} ... </p>
                </div>
            }
            {
                error &&
                <Redirect
                    to={{
                        pathname: "/error",
                        state: { error }
                    }}
                />

            }
        </div>
    );
}