import React, { useEffect, useRef, useState } from 'react'
import './comcalendar.css';
import EventsModal from '../EventsModal';

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"
import locale from '@fullcalendar/core/locales/zh-cn';

import { Button, IconButton } from '@mui/material';
import { Icon as FluentIcon } from '@fluentui/react/lib/Icon';

import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
dayjs.extend(isSameOrBefore);


export default function ComCalendar(props) {
    const FullCalendarRef = useRef();
    const calendarApi = FullCalendarRef.current?.getApi();

    const { selectDate, ExselectDate } = props;
    const { isSelect, ExisSelect } = props; //刷新select渲染
    const { calendarEventsData, ExcalendarEventData } = props;
    

    const [nowSelectDate, ExnowSelectDate] = useState();
    const [callout, iscallout] = useState({ direction:true, dom: null,events: { id:undefined,title: '', start: '', end: '', allDay: true, repeat: false, location: '', description: ''} });


    const loadCalendarEvents = async (start, end) => {
        let calendarList = [];
        let events = [];
        calendarEventsData.forEach((obj) => {
            if (obj.show) calendarList.push(...obj.events);
        })
        calendarList.forEach((obj) => {
            if (dayjs(start).isSameOrBefore(obj.start)&&dayjs(end).isBefore!==true || dayjs(start).isSameOrBefore(obj.end)&&dayjs(end).isAfter(obj.end)) {
                events.push(obj);
            }
        })
        return events;
    }


    useEffect(() => {
        const calendarApi = FullCalendarRef.current?.getApi();
        calendarApi.gotoDate(selectDate.start);
        calendarApi.select(selectDate.start, (selectDate.end == null ? dayjs(selectDate.start).add(1, 'day') : selectDate.end));
    }, [isSelect])


    const handleCalendarEvent = (arg, callback) => {
        loadCalendarEvents(arg.start, arg.end).then(callback);
        
    }


    const calendarMouthPrev = () => { calendarApi.prev(); ExselectDate({ start: calendarApi.view.currentStart, end: null }); ExisSelect(!isSelect) }
    const calendarMouthNext = () => { calendarApi.next(); ExselectDate({ start: calendarApi.view.currentStart, end: null }); ExisSelect(!isSelect) }
    const calendarGoToday = () => { calendarApi.gotoDate(new Date()); ExselectDate({ start: new Date(), end: null }); ExisSelect(!isSelect) }
    const calendarSelect = (e) => { ExselectDate({ start: e.start, end: e.end }) }
    const calendarClick = (e) => {
        if (dayjs(e.date).isSame(nowSelectDate)) {
            iscallout({ clickdate: e.date, state: true, direction: true, dom: e.dayEl, events: {} });
        } else {
            ExnowSelectDate(e.date);
            iscallout({ state: false });;
        }
    }
    const handleEventsClick = (e) => {
        iscallout({direction:true,state:true, dom: e.jsEvent,events: { id:e.event.id,title: e.event.title,start:e.event.start,end:e.event.end,allDay:e.event.allDay,editable:e.event.startEditable}, });
    }
    const handleEventEdit = (e) => {
        let result = { id: e.event.id, start: e.event.startStr, end: e.event.endStr };
        ExcalendarEventData({ state: 'edit', body: result });
    }
    const handleCalloutDismiss = (e) => {
        if (e.state === 'miss') {
            setTimeout(() => {
                iscallout({ state: false });
            },500)
        } else{
            ExcalendarEventData({ state: e.state, body: e.body });
        }
        
    }

    return (
        <div className='ComCalendarBox'>
            
            <div className='FullCalendarToolBar'>
                <Button onClick={calendarGoToday} variant="outlined" size='small' color='maingrey'>今天</Button>
                <div style={{ flex: '1' }}></div>
                <IconButton onClick={calendarMouthPrev} aria-label="delete" size='small' color="maingrey"><FluentIcon iconName='ChevronLeftMed'/> </IconButton>
                <div className='ComCalendarTitle'>{dayjs(selectDate.start).format("YYYY年M月")}</div>
                <IconButton onClick={calendarMouthNext} aria-label="delete" size='small' color="maingrey"><FluentIcon iconName='ChevronRightMed'/> </IconButton>
            </div>
            <div className='ComCalendar'>
                <div  className='positionBox'></div>
                <FullCalendar
                    ref={FullCalendarRef}
                    contentHeight={'100%'}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    headerToolbar={{ left: "", center: "", right: "" }}
                    initialView="dayGridMonth"
                    editable={true}
                    unselectAuto={false}
                    eventResizableFromStart={true}
                    selectable={true}
                    selectMirror={true}
                    select={calendarSelect}
                    dateClick={calendarClick}
                    eventClick={handleEventsClick}
                    eventDrop={handleEventEdit}
                    eventResize={handleEventEdit}
                    dayMaxEvents={true}
                    locale={locale}
                    events={handleCalendarEvent}
                />
            </div>
            {callout.state?<EventsModal callout={callout} onDismiss={handleCalloutDismiss} />:null}
        </div>
    )
}

