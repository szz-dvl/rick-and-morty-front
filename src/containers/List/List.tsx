import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector, usePrevious } from "../../app/hooks";
import CharacterCard, { CardModes } from "../../components/CharacterCard/CharacterCard";
import { ReactComponent as Grid } from '../../images/grid.svg';
import { fetch, init, fav, unfav, unmount } from "./listSlice";
import "./List.css";

enum Boundaries {
    M = 768,
    L = 1024,
    XL = 1920
}

enum Modes {
    SM = 1,
    M,
    L,
    XL
}

export default function List() {

    const [maxMode, setMaxMode] = useState(Modes.SM);
    const [cols, setCols] = useState(Modes.XL);
    const [scroll, setScroll] = useState(.5);
    
    const index = useAppSelector((state) => state.list.index);
    const characters = useAppSelector((state) => state.list.characters);
    const favorites = useAppSelector((state) => state.list.favorites);
    const initialised = useAppSelector((state) => state.list.initialised);
    const fetching = useAppSelector((state) => state.list.fetching);

    const listRef = useRef<HTMLDivElement>(null);

    const prevState = usePrevious<{ scroll: number, maxMode: Modes, fetching: number }>({ scroll, maxMode, fetching });

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

        if (prevState && prevState.maxMode !== maxMode) {

            if (cols > maxMode)
                setCols(maxMode);
        }

    }, [maxMode, cols, prevState]);

    useEffect(() => {
        if (initialised) {
            changeMaxMode(document.body.clientWidth);
        }
    }, [initialised]);

    useEffect(() => {
        dispatch(init());

        window.addEventListener('resize', handleResize)

        return function cleanup() {
            //dispatch(unmount());
            window.removeEventListener('resize', handleResize);
        }
    }, [dispatch, handleResize]);

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

            if (!fetching) {

                if (scroll > 0.80) {

                    dispatch(fetch(index[index.length - 1] + 1));

                } else if (index[0] > 1 && scroll < 0.15) {

                    dispatch(fetch(index[0] - 1));

                }
            } 
        }

    }, [scroll, fetching, prevState, index, dispatch]);

    return (
        <div className="list-container">
            {
                maxMode > Modes.SM &&
                <div className="list-selector">
                    {/* Really weird behavior here is using onChange ==> comment! */}
                    <input type="range" min="1" max={maxMode.toString()} className="slider" value={cols} onInput={(ev: ChangeEvent<HTMLInputElement>) => setCols(parseInt(ev.target.value))} />
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
                                    style={{ scrollSnapAlign: idx && !(idx % cols) && scroll < 0.15 && index[0] !== 1 ? "center" : "none" }}
                                />
                            );
                        })
                    }
                </div>
            }
        </div>
    );
}