import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CharacterCard from "../../components/CharacterCard/CharacterCard";
import { ReactComponent as Grid } from '../../images/grid.svg';
import "./List.css";
import { fetch } from "./listSlice";


export default function List() {

    const [slider, setSlider] = useState(5);
    const dispatch = useAppDispatch();
    const page = useAppSelector((state) => state.list.page);
    const characters = useAppSelector((state) => state.list.characters);

    useEffect(() => {
        dispatch(fetch(page));
    }, [dispatch, page])

    return (
        <div className="list-container">
            <div className="list-selector">
                <input type="range" min="1" max="100" className="slider" value={slider} onChange={(ev) => setSlider(parseInt(ev.target.value))}/>
                <div className="list-sizes">
                    <div className="square" />
                    <div className="grid" >
                        <Grid />
                    </div>
                </div>
            </div>
            <div className="character-list">
                {
                    characters.map(character => {
                        return(<CharacterCard character={character} key={character.id} />);
                    })
                }
            </div>
        </div>
    );
}