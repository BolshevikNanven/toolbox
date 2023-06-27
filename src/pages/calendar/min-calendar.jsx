import './min-calendar.css'
import { useContext, useEffect, useState } from 'react'
import { Icon as FluentIcon } from '@fluentui/react/lib/Icon'
import { ReactSVG } from 'react-svg'

import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import { homeContext } from '../Home'
import { Link } from 'react-router-dom'
dayjs.locale('zh-cn')
dayjs.extend(isSameOrBefore)

export default function MinCalendar() {

    const [weekList, SETweekList] = useState('');
    const [selectedDay, SETselectedDay] = useState(dayjs().format('YYYY-MM-DD'));

    const contextValue = useContext(homeContext);
    const calendarEvents = contextValue.calendar;

    const loadWeek = () => {
        let week = [dayjs().startOf('week').format('YYYY-MM-DD')];
        for (let i = 1; i < 7; i++) {
            week.push(dayjs(week[i - 1]).add(1, 'day').format('YYYY-MM-DD'));
        }
        SETweekList(week);

    }

    const handleSelectDay = (day) => {
        SETselectedDay(day);
    }

    useEffect(() => {
        loadWeek();
    }, [])


    return (
        <div className='mincardBase'>
            <div className="mincardHeader">
                <p>日历</p>
                <button><FluentIcon iconName='Unpin' /></button>
            </div>
            <div className="mincardBody">
                <div className='mincardDatePickerHandle'>{dayjs(selectedDay).format('YYYY年M月')}</div>
                <div className="mincardWeekBox">
                    <div className="mincardWeekTitle">
                        <div className="mincardWeekTitleItem">一</div>
                        <div className="mincardWeekTitleItem">二</div>
                        <div className="mincardWeekTitleItem">三</div>
                        <div className="mincardWeekTitleItem">四</div>
                        <div className="mincardWeekTitleItem">五</div>
                        <div className="mincardWeekTitleItem">六</div>
                        <div className="mincardWeekTitleItem">日</div>
                    </div>
                    <div className="mincardWeekDay">
                        {weekList !== '' ? weekList.map((value) => {
                            return (<button key={value} data-date={value} onClick={(e) => { handleSelectDay(e.target.dataset.date) }} className={`mincardWeekDayItem ${dayjs().isSame(value, 'day') ? 'today' : ''} ${selectedDay === value ? 'select' : ''}`}>{dayjs(value).format('DD')}</button>)
                        }) : <button className="mincardWeekDayItem"></button>}
                    </div>
                </div>
            </div>
            <div className="mincardEventBox">
                <LoadTodayEvents calendarEvents={calendarEvents} selectedDay={selectedDay} />
            </div>
        </div>
    )
}
function LoadTodayEvents(props) {

    const { calendarEvents, selectedDay } = props;

    let todayEvents = [];
    calendarEvents.forEach((e) => {
        e.events.forEach((obj) => {
            if ( (dayjs(obj.start).isSameOrBefore(selectedDay) && dayjs(dayjs(selectedDay).add(1, 'day')).isSameOrBefore(obj.end)) || (dayjs(obj.start).isAfter(selectedDay) && dayjs(obj.end).isSameOrBefore(dayjs(selectedDay).add(1, 'day')))) {
                todayEvents.push(obj);
            }
        })
    })

    if (todayEvents.length !== 0) {
        return (
            todayEvents.map((e) => (
                <Link to='/calendar' key={e.title} className="mincardEventPreBox">
                    <div className='mincardEventPreBlank' style={{ backgroundColor: e.color }}></div>
                    <p className='mincardEventPreState'>{e.allDay ? '全天' : dayjs(e.start).format('H:mm')}</p>
                    <p className='mincardEventPreTitle'>{e.title}</p>
                </Link>
            ))
        )
    } else {
        return (
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px 16px' }}>
                <ReactSVG src='./noevents.svg' />
                <p style={{ color: '#2a2a2a', fontSize: '14px', margin: '0', paddingTop: '4px' }}>今天无任务</p>
                <Link className='mincardEventPreAddBtn' to='/calendar'>创建事件</Link>
            </div>
        )
    }



}