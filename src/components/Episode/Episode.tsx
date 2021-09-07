import React from "react";
import { Episode as EpisodeType } from "../../types";
import "./Episode.css";

interface EpisodeCardProps {
    episode: EpisodeType
}

export default function Episode({ episode }: EpisodeCardProps) {

    return (
        <div className="episode-container">
            <h4> {episode.name} </h4>
            <ul>
                <li className="episode-field">
                    <span className="field-title">
                        Air date:
                    </span>
                    <span className="field-data">
                        {episode.air_date}
                    </span>
                </li>
                <li className="episode-field">
                    <span className="field-title">
                        Code:
                    </span>
                    <span className="field-data">
                        {episode.episode}
                    </span>
                </li>
            </ul>
        </div>
    );
}