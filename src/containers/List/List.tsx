import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, usePrevious } from "../../app/hooks";
import CharacterCard, { CardModes } from "../../components/CharacterCard/CharacterCard";
import { ReactComponent as Grid } from '../../images/grid.svg';
import { fetch, init, fav, unfav, unmount, PAGE_SIZE, Modes, setCols, Direction } from "./listSlice";
import { Boundaries } from "../../types";
import { useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import "./List.css";

export default function List() {

    const [maxMode, setMaxMode] = useState(Modes.SM);
    const [scroll, setScroll] = useState(.5);
    const [ignore, setIgnore] = useState(0);

    const { index, characters, favorites, initialised, fetching, cols } = useAppSelector((state) => state.list);

    const listRef = useRef<HTMLDivElement>(null);
    const [listElement, listElemInview, listElemEnry] = useInView({ threshold: 1 });

    const prevState = usePrevious<{ scroll: number, maxMode: Modes }>({ scroll, maxMode });

    const { state } = useLocation<{ page: number, id: number }>();

    const handleResize = useCallback(
        e => {
            changeMaxMode(document.body.clientWidth);
        }, []
    );

    const handleScroll = useCallback(
        e => {

            setScroll(e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight));

        }, []
    );

    const dispatch = useAppDispatch();

    const getCardMode = () => {

        switch (maxMode) {
            case Modes.SM:
                return CardModes.T;
            case Modes.M:
                return cols < 2 ? CardModes.SM : CardModes.T;
            case Modes.L:
                switch (cols) {
                    case 1:
                        return CardModes.XL;
                    case 2:
                        return CardModes.L;
                    case 3:
                        return CardModes.SM;
                    default:
                        return CardModes.SM;
                }
            case Modes.XL:
                switch (cols) {
                    case 1:
                        return CardModes.XL;
                    case 2:
                        return CardModes.L;
                    case 3:
                        return CardModes.M;
                    case 4:
                        return CardModes.SM;
                    default:
                        return CardModes.SM;
                }
        }
    }

    const changeMaxMode = (width: number) => {

        if (width < Boundaries.M)
            setMaxMode(Modes.SM);
        else if (width >= Boundaries.M && width < Boundaries.L)
            setMaxMode(Modes.M);
        else if (width >= Boundaries.L && width < Boundaries.XL)
            setMaxMode(Modes.L);
        else
            setMaxMode(Modes.XL);
    }


    useEffect(() => {

        if (prevState && prevState.maxMode !== maxMode)
            dispatch(setCols({ cols: maxMode, user: false }));
        
    }, [maxMode, prevState, dispatch]);

    useEffect(() => {
        if (initialised)
            changeMaxMode(document.body.clientWidth);

    }, [initialised]);

    useEffect(() => {
        if (listElemEnry && ignore === 0) {
            setIgnore(1);
            listElemEnry.target.scrollIntoView({ block: "center", behavior: "smooth" });
        }

    }, [listElemEnry, ignore]);

    useEffect(() => {

        if (listElemInview) {
            setTimeout(() => {
                setIgnore(2);
            }, 120);
        }

    }, [listElemInview]);

    useEffect(() => {
        dispatch(init(state ? state.page || 1 : 1));

        window.addEventListener('resize', handleResize)

        return function cleanup() {
            dispatch(unmount());
            window.removeEventListener('resize', handleResize);
        }
    }, [dispatch, handleResize, state]);

    useLayoutEffect(() => {

        if (listRef.current) {
            listRef.current.addEventListener("scroll", handleScroll, { passive: true });
            const input = listRef.current;

            return function cleanup() {

                if (input)
                    input.removeEventListener("scroll", handleScroll);
            }
        }

    }, [handleScroll]);

    useEffect(() => {

        if (prevState && prevState.scroll !== scroll) {

            if (!fetching && ignore !== 1) {

                if (scroll > 0.90) {

                    dispatch(fetch(Direction.DOWN));

                } else if (scroll < 0.25) {

                    dispatch(fetch(Direction.UP));

                }
            }
        }

    }, [scroll, fetching, prevState, index, ignore, dispatch]);

    return (
        <div className="container">
            {
                maxMode > Modes.SM &&
                <div className="list-selector">
                    
                    <input 
                        type="range" 
                        min="1" 
                        max={maxMode} 
                        className="slider" 
                        value={cols} 
                        step="1" 
                        onInput={(ev: ChangeEvent<HTMLInputElement>) => dispatch(setCols({cols: parseInt(ev.target.value), user: true }))} 
                    />

                    <div className="list-sizes">
                        <div className="square" />
                        <div className="grid" >
                            <Grid />
                        </div>
                    </div>

                </div>
            }
            {
                favorites &&
                <div className="character-list" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} ref={listRef}>
                    {

                        characters.map((character, idx) => {
                            return (
                                <CharacterCard
                                    character={character}
                                    key={`character-${character.id}`}
                                    isFav={favorites.includes(character.id)}
                                    fav={(id) => dispatch(fav(id))}
                                    unfav={(id) => dispatch(unfav(id))}
                                    mode={getCardMode()}
                                    style={{ scrollSnapAlign: idx && !(idx % cols) && scroll < 0.10 && index[0] !== 1 ? "center" : "none" }}
                                    page={(index[Math.floor(idx / PAGE_SIZE)])}
                                    ref={state && state.id && state.id === character.id ? listElement : null}
                                />
                            );
                        })
                    }
                </div>
            }
        </div>
    );
}