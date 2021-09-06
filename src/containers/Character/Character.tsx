import React from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clean, fetch } from "./characterSlice";
import "./Character.css";

export default function Character() {

    const character = useAppSelector((state) => state.character.character);
    const in_progress = useAppSelector((state) => state.character.in_progress);
    const dispatch = useAppDispatch();

    const { id } = useParams<{ id: string }>();
    const { state } = useLocation<{character_name: string}>();

    useEffect(() => {
        dispatch(fetch(parseInt(id)));

        return function cleanup() {
            dispatch(clean());
        }
    }, [dispatch, id]);

    return (
        <div className="character-container">
            {
                character &&
                <div className="character-info">
                    <h1> {character.name} </h1>
                </div>
            }
            {
                in_progress && state && state.character_name &&
                <div className="character--in-progress">
                    <p> We are looking for { state.character_name } ... </p>       
                </div>
            }
        </div>
    );
}