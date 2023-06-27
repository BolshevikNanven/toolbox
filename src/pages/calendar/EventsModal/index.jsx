import React, { useRef, useState } from 'react';
import './EventsModal.css';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, IconButton, FormControlLabel, Checkbox } from '@mui/material';

import { Callout, DatePicker, MessageBar, MessageBarType, ComboBox, defaultCalendarStrings, Dropdown } from '@fluentui/react';
import { Icon as FluentIcon } from '@fluentui/react/lib/Icon';

import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';

const theme = createTheme({
    palette: {
        maingrey: {
            main: 'rgb(95,99,104)',
            contrastText: 'rgb(95,99,104)',
        },
    },
});
const selectTimeOptionsA = initialTime();
function initialTime(start) {
    let H = 0, M = 0;
    let flag = false;
    let results = [];
    while (H < 24) {
        M += 15;
        if (M >= 60) {
            H++;
            M -= 60;
        }
        let h = H.toString(), m = M.toString().padStart(2, '0');
        let key = h.padStart(2, '0') + ':' + m;
        if ((key === start || start === undefined) && flag === false) flag = true;
        if (flag) {
            let text;
            if (H <= 12) {
                text = `上午${h}:${m}`;
            } else if (H <= 18) {
                text = `下午${H - 12}:${m}`;
            } else {
                text = `晚上${H - 12}:${m}`;
            }
            results.push({ key: key, text: text });
        }
        if (H === 24) break;
    }
    return results;
}

const EventsModal = (props) => {
    const { callout, onDismiss } = props;
    const ref = useRef();
    const [error, Exerror] = useState({ state: false, text: '' });
    const [updateEvents, ExupdateEvents] = useState({
        id: callout.events.id !== undefined ? callout.events.id : '',
        title: callout.events.title !== undefined ? callout.events.title : '',
        start: callout.events.start !== undefined || null ? dayjs(callout.events.start).toDate() : callout.clickdate,
        end: callout.events.start !== undefined || null ? dayjs(callout.events.end).subtract(1, 'day').toDate() : callout.clickdate,
        allDay: callout.events.allDay === undefined ? true : callout.events.allDay,
        repeat: callout.events.repeat,
        description: callout.events.description === undefined ? '' : callout.events.description,
        location: callout.events.location === undefined ? '' : callout.events.location,
        editable: callout.events.editable !== false ? true : false,
        backgroundColor: callout.events.backgroundColor === undefined ? '' : callout.events.backgroundColor,
    });
    const [selectedTime, ExselectedTime] = useState({ start: updateEvents.allDay ? '' : dayjs(callout.events.start).format('HH:mm'), end: updateEvents.allDay ? '' : dayjs(callout.events.end).format('HH:mm') });
    const [callbackState] = useState(callout.events.id === undefined ? 'add' : 'edit');
    const repeatOptions = [{ key: 1, text: '不重复' }, { key: 2, text: '每周' }, { key: 3, text: '每日' }];
    const selectTimeOptionsB = initialTime(selectedTime.start);


    const handleSelectTimepickedA = (index) => {
        ExselectedTime({ ...selectedTime, start: selectTimeOptionsA[index].key });
    }
    const handleSelectTimepickedB = (index) => {
        ExselectedTime({ ...selectedTime, end: selectTimeOptionsB[index].key });
    }
    const handleSaveClick = () => {
        if (updateEvents.title === '') {
            Exerror({ state: true, text: '标题不能为空!' })
        } else if (updateEvents.allDay === false && (selectedTime.start === '' || selectedTime.end === '')) {
            Exerror({ state: true, text: '时间不能为空!' })
        } else {
            if (updateEvents.allDay === false) {
                let startTime = dayjs(updateEvents.start).format('YYYY-MM-DD') + ' ' + selectedTime.start;
                let endTime = dayjs(updateEvents.start).format('YYYY-MM-DD') + ' ' + selectedTime.end;
                onDisMissing({ state: callbackState, body: { ...updateEvents, start: startTime, end: endTime } });
            } else {
                onDisMissing({ state: callbackState, body: { ...updateEvents, start: dayjs(updateEvents.start).format(), end: dayjs(updateEvents.end).add(1, 'day').format() } })
            }
        }
    }
    const handleDeleteClick = () => {
        onDisMissing({ state: 'remove', body: { id: updateEvents.id } });
    }
    const onFormatDate = (e) => {
        return dayjs(e).format("M月D日 dddd")
    }
    const onDisMissing = (msg) => {
        ref.current.style.display = 'none';
        onDismiss(msg);
    }

    return (
        <ThemeProvider theme={theme}>
            <Callout
                ref={ref}
                className='CalendarCallout'
                role="CalendarCallout"
                target={callout.dom}
                onDismiss={() => onDisMissing({ state: 'miss' })}
                gapSpace={4}
                beakWidth={0}
                directionalHint={callout.direction ? 12 : 5}
                setInitialFocus
                onKeyUp={(e) => e.key === 'Enter' ? handleSaveClick() : null}
            >
                <div className='EventsModalBox'>
                    <div className='PreEventsModalBody'>
                        <div className='inputUnderline'><input tabIndex='0' className='PreEventsModalTitle' type='text' disabled={updateEvents.editable ? false : true} onBlur={(e) => ExupdateEvents({ ...updateEvents, title: e.target.value })} onKeyUp={(e) => { ExupdateEvents({ ...updateEvents, title: e.target.value }); if (error.state) Exerror({ state: false }) }} placeholder='添加标题' defaultValue={updateEvents.title} /></div>
                        <div className='PreEventsModalBodyin'>
                            <div className='PreEventsModalBodyIconBox'>
                                <div className='PreEventsModalBodyIcon' style={{ top: '-2px' }}><FluentIcon iconName='Clock' /></div>
                                {updateEvents.allDay ?
                                    <div className='PreEventsModalBodyRowBox'>
                                        <div className='inputUnderline inputUnderlineBGK '><DatePicker
                                            className='TextDatePicker'
                                            // DatePicker uses English strings by default. For localized apps, you must override this prop.
                                            strings={defaultCalendarStrings}
                                            showMonthPickerAsOverlay={true}
                                            formatDate={onFormatDate}
                                            onSelectDate={(date) => { ExupdateEvents({ ...updateEvents, start: date }) }}
                                            placeholder="起始时间"
                                            value={updateEvents.start}
                                            borderless
                                            ariaLabel="Select a date"
                                        /></div>
                                        <span className='dateDivider'></span>
                                        <div className='inputUnderline inputUnderlineBGK'><DatePicker
                                            className='TextDatePicker'
                                            // DatePicker uses English strings by default. For localized apps, you must override this prop.
                                            strings={defaultCalendarStrings}
                                            showMonthPickerAsOverlay={true}
                                            formatDate={onFormatDate}
                                            onSelectDate={(date) => { ExupdateEvents({ ...updateEvents, end: date }) }}
                                            placeholder="起始时间"
                                            value={updateEvents.end}
                                            borderless
                                            ariaLabel="Select a date"
                                        /></div>
                                    </div> :
                                    <div className='PreEventsModalBodyRowBox'>
                                        <div className='inputUnderline inputUnderlineBGK '><DatePicker
                                            className='TextDatePicker'
                                            // DatePicker uses English strings by default. For localized apps, you must override this prop.
                                            strings={defaultCalendarStrings}
                                            showMonthPickerAsOverlay={true}
                                            formatDate={onFormatDate}
                                            placeholder="起始时间"
                                            value={updateEvents.start}
                                            borderless
                                            ariaLabel="Select a date"
                                        /></div>
                                        <div className='inputUnderline inputUnderlineBGK '><ComboBox
                                            placeholder='开始'
                                            options={selectTimeOptionsA}
                                            selectedKey={selectedTime.start}
                                            autoComplete="on"
                                            allowFreeform={false}
                                            onChange={(event, options, index, value) => handleSelectTimepickedA(index)}
                                        /></div>
                                        <span className='dateDivider'></span>
                                        <div className='inputUnderline inputUnderlineBGK '><ComboBox
                                            placeholder='结束'
                                            options={selectTimeOptionsB}
                                            selectedKey={selectedTime.end}
                                            autoComplete="on"
                                            allowFreeform={false}
                                            onChange={(event, options, index, value) => handleSelectTimepickedB(index)}
                                        /></div>
                                    </div>
                                }

                                <div className='PreEventsModalBodyRowBox' style={{ paddingLeft: '8px' }}>
                                    <FormControlLabel disabled={updateEvents.editable ? false : true} fontSize='10px' control={<Checkbox checked={updateEvents.allDay} onChange={(e) => ExupdateEvents({ ...updateEvents, allDay: e.target.checked })} />} label="全天" />
                                </div>
                                <div className='PreEventsModalBodyRowBox ' >
                                    <Dropdown
                                        disabled={updateEvents.editable ? false : true}
                                        className='inputUnderline inputUnderlineBGK PreEMBbtn'
                                        options={repeatOptions}
                                        defaultSelectedKey={1}
                                    ></Dropdown>
                                </div>
                            </div>
                            <div className='PreEMBdivider'></div>
                            <div className='PreEventsModalBodyIconBox'>
                                <div className='PreEventsModalBodyIcon'><FluentIcon iconName='Location' /></div>
                                <div className='inputUnderline inputUnderlineBGK PreEventsModalBodyRowBox'>
                                    <input type="text" className='PreEMBtext' onBlur={(e) => ExupdateEvents({ ...updateEvents, location: e.target.value })} placeholder='添加地点' />
                                </div>
                            </div>
                            <div className='PreEventsModalBodyIconBox'>
                                <div className='PreEventsModalBodyIcon'><FluentIcon iconName='AddNotes' /></div>
                                <div className='inputUnderline inputUnderlineBGK PreEventsModalBodyRowBox'>
                                    <input type="text" className='PreEMBtext' onBlur={(e) => ExupdateEvents({ ...updateEvents, description: e.target.value })} placeholder='添加说明' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='PreEventsModalTop'>
                        <div></div>
                        <IconButton size='small' onClick={() => onDisMissing({ state: 'miss' })} color="maingrey"><FluentIcon style={{ fontSize: '13px', fontWeight: '600' }} iconName='ChromeClose' /> </IconButton>
                    </div>
                    {error.state ? <div style={{ marginBottom: '8px' }}><MessageBar
                        delayedRender={false}
                        messageBarType={MessageBarType.error}
                    >
                        {error.text}
                    </MessageBar></div> : null}
                    <div className='PreEventsModalButtom'>
                        <div></div>
                        <div>
                            <Button onClick={handleDeleteClick} disabled={updateEvents.id === '' || updateEvents.editable === false ? true : false} sx={{ padding: '6px 24px' }} variant="text">移除</Button>
                            <Button onClick={handleSaveClick} disabled={updateEvents.editable ? false : true} sx={{ padding: '6px 24px' }} variant="contained">保存</Button>
                        </div>

                    </div>
                </div>
            </Callout>
        </ThemeProvider>

    )
}

export default EventsModal;