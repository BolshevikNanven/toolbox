import React, { useState } from "react";
import './calendar.css';

import Header from '../../components/header';
import ComCalendar from "./ComCalendar";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Divider, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import { Calendar as FluentCalendar, defaultCalendarStrings, DayOfWeek } from '@fluentui/react';
import { Icon as FluentIcon } from '@fluentui/react/lib/Icon';

import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/zh-cn';
import { useEffect } from "react";

import { v4 as uuidv4 } from 'uuid';

dayjs.locale('zh-cn');
dayjs.extend(isSameOrBefore);


defaultCalendarStrings.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
defaultCalendarStrings.shortMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
defaultCalendarStrings.days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
defaultCalendarStrings.shortDays = ['日', '一', '二', '三', '四', '五', '六'];
defaultCalendarStrings.nextMonthAriaLabel = "下一个月"
defaultCalendarStrings.prevMonthAriaLabel = "上一个月"
defaultCalendarStrings.goToToday = "今天"

const theme = createTheme({
    palette: {
        maingrey: {
            main: '#212121',
            contrastText: '#212121',
        },
        mainblue: {
            main: '#1976d2',
            contrastText: '#1976d2',
        },
    },
});

function Calendar(props) {
    const { calendarData, updateCalendarData } = props;
    const [selectDate, ExselectDate] = useState({ start: new Date(), end: null });
    const [isSelect, ExisSelect] = useState(true); //刷新select渲染
    const [calendarEventsData, ExcalendarEventData] = useState([]);


    useEffect(() => {
        let events = [];
        calendarData.forEach((obj) => {
            events = [...events, { name: obj.name, defaultColor: obj.defaultColor, show: true, events: obj.events }];
        })
        ExcalendarEventData(events);
    }, [calendarData])

    const changeCalendarShow = (state, name) => {
        const result = calendarEventsData.map((obj) => {
            if (obj.name === name) {
                obj.show = state;
            }
            return obj;
        })
        ExcalendarEventData(result);
    }

    const ChangeselectDate = (e) => {
        ExselectDate({ start: e, end: null });
        ExisSelect(isSelect => !isSelect);
    }

    const GetcalendarEventData = (q) => {
        if (q.state === 'add') {
            let event = q.body;
            let _id = uuidv4();
            let newEvents = calendarEventsData.map((arr) => {
                if (arr.name === '默认日历') {
                    if (event.backgroundColor === '') event.backgroundColor = arr.defaultColor;
                    arr.events = [...arr.events, { ...event, id: _id }];
                }
                return arr;
            })
            updateCalendarData('add', { ...event, id: _id },newEvents);
        } else if (q.state === 'edit') {
            let id = q.body.id;
            let newEvents = calendarEventsData.map((arr) => {
                if (arr.name === '默认日历') {
                    arr.events = arr.events.map((item) => {
                        if (item.id === id) {
                            return { ...item, ...q.body, id: id };
                        } else return item;
                    });
                }
                return arr;
            })
            updateCalendarData('edit', { ...q.body, id: id },newEvents);
        } else if (q.state === 'remove') {
            let id = q.body.id;
            let newEvents = calendarEventsData.map((arr) => {
                if (arr.name === '默认日历') {
                    let a = [];
                    arr.events.forEach((item) => {
                        if (item.id !== id) {
                            a.push(item);
                        }
                    });
                    arr.events = [...a];
                }
                return arr;
            })
            updateCalendarData('remove', { id: id },newEvents);
        }
    }


    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Header title="日历">
                    <Button sx={{ marginLeft: '3px' }} color='maingrey' variant="text"><FluentIcon style={{ fontSize: '16px', fontWeight: '600', marginRight: '6px' }} iconName='Pinned' />固定至主页</Button>
                </Header>
                <div className="CalendarMain">
                    <div >
                        <FluentCalendar
                            showMonthPickerAsOverlay
                            highlightSelectedMonth
                            showGoToToday={false}
                            firstDayOfWeek={DayOfWeek.Monday}
                            onSelectDate={ChangeselectDate}
                            value={selectDate.start}
                            // Calendar uses English strings by default. For localized apps, you must override this prop.
                            strings={defaultCalendarStrings}
                        />
                        <Divider />
                        <FormGroup sx={{ padding: '8px 0 0 0' }}>
                            <FormControlLabel sx={{ marginLeft: 0, marginRight: 0, marginBottom: '2px', paddingLeft: '8px' }}
                                control={<FluentIcon style={{ fontSize: '15px', color: '#1976d2', fontWeight: '600', display: 'block', padding: "10px" }} iconName="Add" />}
                                label={<div style={{ fontSize: '13px', userSelect: 'none', color: '#1976d2' }} >添加日历</div>}
                            />
                            {calendarEventsData.map((obj, index) => {
                                return (
                                    <FormControlLabel checked={obj.show} onChange={(e) => changeCalendarShow(e.target.checked, obj.name)} key={index} sx={{ marginLeft: 0, marginRight: 0, paddingLeft: '8px' }}
                                        control={<Checkbox size="small" icon={<FluentIcon style={{ color: obj.defaultColor }} iconName='CircleRing' />} checkedIcon={<FluentIcon style={{ color: obj.defaultColor }} iconName='SkypeCircleCheck' />} />}
                                        label={<div style={{ fontSize: '13px', userSelect: 'none', color: '#212121' }}>{obj.name}</div>}
                                    />
                                )
                            })}
                        </FormGroup>

                    </div>
                    <ComCalendar
                        selectDate={selectDate} ExselectDate={ExselectDate}
                        isSelect={isSelect} ExisSelect={ExisSelect}
                        calendarEventsData={calendarEventsData} ExcalendarEventData={GetcalendarEventData}
                    />
                    <div style={{ display: 'none' }} className="CalendarEventBox">
                        <div className="CalendarEventContainer">
                            <div className="CalendarEventContainerHeader">
                                <p>{(selectDate.end !== null && dayjs(selectDate.start).format("M月 D日 ddd") !== dayjs(selectDate.end).subtract(1, 'day').format("M月 D日 ddd")) ? dayjs(selectDate.start).format("M月 D日 ddd") + ' - ' + dayjs(selectDate.end).subtract(1, 'day').format("M月 D日 ddd") : dayjs(selectDate.start).format("M月 D日 ddd")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}



export default Calendar;