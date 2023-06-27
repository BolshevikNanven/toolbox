import "./home.css"
import dayjs from "dayjs"
import { createContext, useEffect, useState } from "react";

import MinCalendar from "../calendar/min-calendar";

const weatherIcon = {
    晴: (dayjs().hour() > 3 && dayjs().hour() < 19) ? 'icon_qingtian.png' : 'icon_yejianqingtian.png',
    阴: 'icon_yintian.png',
    多云: 'icon_duoyun.png',
    小雨: 'icon_xiaoyu.png',
    中雨: 'icon_zhongyu.png',
}
export const homeContext = createContext();

function Home(props) {
    const { weather, mainData } = props;


    const getDayTime = () => {
        const hour = dayjs().hour();
        if (hour >= 4 && hour <= 8) {
            return '早上'
        } else if (hour < 12) {
            return '上午'
        } else if (hour <= 14) {
            return '中午'
        } else if (hour < 19) {
            return '下午'
        } else return '晚上';
    }



    return (
        <homeContext.Provider value={mainData}>
            <div className="homeBase">
                <div className="homeTitleBox">
                    <h2>{`${getDayTime()}好，`}</h2>
                    {weather !== null ?
                        <div><img src={`./weatherIcon/${weatherIcon[weather.weather]}`} />
                            <p>{`${weather.weather} ${weather.temperature}℃`}</p>
                        </div>
                    : null}
                </div>
                <div className="homeBodyBox">
                    <MinCalendar />
                </div>
            </div>
        </homeContext.Provider>

    )
}

export default Home;