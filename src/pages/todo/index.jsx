import { TextField, InputAdornment, Checkbox } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Icon as FluentIcon } from '@fluentui/react/lib/Icon';

import { Callout, Calendar, defaultCalendarStrings, DatePicker } from '@fluentui/react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useEffect, useRef, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import './todo.css'

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
})


function Todo(props) {

    const { todoData, ExtodoData } = props;

    const [callout, iscallout] = useState(null);
    const [selectedList, ExselectedList] = useState({ list: { id: 'initial' } });
    const [renameList, ExrenameList] = useState(null);

    const listref = useRef([]);
    let listNum = 0;

    const calloutEvents = {
        listCallout: [
            {
                iconName: 'Rename',
                title: '重命名',
                color: '#212121',
                func: (e) => {
                    ExrenameList(e.dataset.listid);
                    iscallout(null);
                }
            },
            {
                iconName: 'Delete',
                title: '删除列表',
                color: 'rgb(220,40,43)',
                func: (e) => {
                    const groupid = e.dataset.groupid === undefined ? null : e.dataset.groupid;
                    deleteData({ group: groupid, list: e.dataset.listid });
                    iscallout(null);
                    if (selectedList.list.id === e.dataset.listid) {
                        ExselectedList({ list: { id: 'initial' } });
                    }
                }
            }
        ],
        groupCallout: [
            {
                iconName: 'Rename',
                title: '重命名',
                color: '#212121',
                func: (e) => {
                    ExrenameList(e.dataset.groupid);
                    iscallout(null);
                }
            },
            {
                iconName: 'Delete',
                title: '解散组',
                color: 'rgb(220,40,43)',
                func: (e) => {
                    deleteData({ group: e.dataset.groupid, list: null });
                    iscallout(null);
                }
            }
        ]
    }

    const handleListMove = (obj) => {
        const TmptodoData = todoData;
        const fromGroup = obj.source.droppableId;
        const toGroup = obj.destination.droppableId;
        const targetId = obj.draggableId;
        const fromIndex = obj.source.index;
        const toIndex = obj.destination.index;

        let targetObj;
        if (fromGroup === "todolist") {
            TmptodoData.lists.forEach((obj) => {
                if (obj.id === targetId) targetObj = obj;
            })
        } else {
            TmptodoData.groups.forEach((obj) => {
                if (obj.id === fromGroup) {
                    obj.lists.forEach((obj) => {
                        if (obj.id === targetId) targetObj = obj;
                    })
                }
            });
        }

        if (toGroup === "todolist") {
            //删除数组元素
            if (fromGroup === "todolist") {
                TmptodoData.lists.splice(fromIndex, 1);
            } else {
                TmptodoData.groups.forEach((obj) => {
                    if (obj.id === fromGroup) {
                        obj.lists.splice(fromIndex, 1);
                    }
                })
            }
            //插入数组元素
            TmptodoData.lists.splice(toIndex, 0, targetObj);
        } else {
            if (fromGroup === "todolist") {
                TmptodoData.lists.splice(fromIndex, 1);
            } else {
                TmptodoData.groups.forEach((obj) => {
                    if (obj.id === fromGroup) {
                        obj.lists.splice(fromIndex, 1);
                    }
                })
            }
            TmptodoData.groups.forEach((obj) => {
                if (obj.id === toGroup) {
                    obj.lists.splice(toIndex, 0, targetObj);
                }
            })

        }
        ExtodoData(TmptodoData);
    }
    const handleSelectList = (obj) => {
        let groupId, listObj;
        if (obj.group === 'todolist') {
            todoData.lists.forEach((e) => {
                if (e.id === obj.id) {
                    listObj = e;
                    return
                }
            })
            groupId = 'todolist';
        } else {
            todoData.groups.forEach((gfobj) => {
                if (gfobj.id === obj.group) {
                    groupId = gfobj.id;
                    gfobj.lists.forEach((lfobj) => {
                        if (lfobj.id === obj.id) {
                            listObj = lfobj;
                            return
                        }
                    })

                }
            })
        }
        ExselectedList({ group: groupId, list: listObj });
    }
    const SetSelectedList = (e) => {
        if (e.group === 'todolist') {
            const tmptodoData = todoData.lists.map((obj) => {
                if (obj.id === e.list.id) {
                    return e.list;
                } else return obj;
            });
            ExtodoData({ groups: [...todoData.groups], lists: [...tmptodoData] })
            ExselectedList(e);
        } else {
            let tmpGroup;
            todoData.groups.forEach((obj) => {
                if (obj.id === e.group) {
                    tmpGroup = obj;
                    return
                }
            })
            tmpGroup.lists = tmpGroup.lists.map((obj) => {
                if (obj.id === e.list.id) {
                    return e.list;
                } else return obj;
            })

            const todoGroups = todoData.groups.map((obj) => {
                if (obj.id === tmpGroup.id) {
                    return tmpGroup;
                } else return obj;
            })
            ExtodoData({ groups: [...todoGroups], lists: [...todoData.lists] })
            ExselectedList(e);
        }
    }
    const handleRenameList = (e) => {
        const listid = e.target.dataset.listid;
        const groupid = e.target.dataset.groupid;
        const newName = e.target.innerText;

        if (groupid === undefined) {
            const lists = todoData.lists.map((obj) => {
                if (obj.id === listid) {
                    return { ...obj, name: newName };
                } else return obj;
            })

            ExtodoData({ groups: [...todoData.groups], lists: [...lists] });
        } else {
            const groups = todoData.groups.map((gobj) => {
                if (gobj.id === groupid) {
                    const tmplist = gobj.lists.map((obj) => {
                        if (obj.id === listid) {
                            return { ...obj, name: newName };
                        } else return obj;
                    })
                    return { ...gobj, lists: tmplist };
                } else return gobj;
            })

            ExtodoData({ groups: [...groups], lists: [...todoData.lists] });
        }

        ExrenameList(null);
        ExselectedList({ list: { id: 'initial' } });
    }
    //some bugs
    const copyList = ({ groupid, listid }) => {
        ExselectedList({ list: { id: 'initial' } });
        if (groupid === undefined) {
            let lists = todoData.lists;
            for (let i = 0; i < lists.length; i++) {
                if (lists[i].id === listid) {
                    lists.splice(i, 0, { ...lists[i], id: uuidv4() });
                    break;
                }
            }

            ExtodoData({ groups: [...todoData.groups], lists: lists });

        } else {

        }
    }
    const handleNewList = () => {
        const id = uuidv4();
        let data = todoData;
        data.lists.unshift({
            id: id,
            name: "新列表",
            events: []
        })
        ExtodoData(data);
        ExrenameList(id);
    }
    const handleNewGroup = () => {
        let cpyData = todoData;
        const id = uuidv4();
        cpyData.groups.push({
            id: id,
            name: "新组",
            lists: []
        })
        ExtodoData(cpyData);
        ExrenameList(id);
    }
    const deleteData = (value) => {
        let cpyData = todoData;
        if (value.group === null) { //删除列表
            let tmpData = [];
            todoData.lists.forEach((obj) => {
                if (obj.id !== value.list) tmpData.push(obj);
            });
            cpyData.lists = tmpData;
            ExtodoData(cpyData);
        } else if (value.list !== null) { //删除组内列表
            const tmpGroups = cpyData.groups.map((gobj) => {
                if (gobj.id === value.group) {
                    let tmpLists = [];
                    gobj.lists.forEach((obj) => {
                        if (obj.id !== value.list) tmpLists.push(obj);
                    });
                    return { ...gobj, lists: [...tmpLists] };
                } else return gobj;
            })
            ExtodoData({ groups: [...tmpGroups], lists: [...cpyData.lists] });
        } else { //解散组
            let freeLists = [];
            let tmpGroups = [];
            cpyData.groups.forEach((gobj) => {
                if (gobj.id === value.group) {
                    freeLists = gobj.lists;
                }
            })
            cpyData.groups.forEach((gobj) => {
                if (gobj.id !== value.group) tmpGroups.push(gobj);
            })
            ExtodoData({ groups: [...tmpGroups], lists: [...cpyData.lists, ...freeLists] });
        }
    }


    useEffect(() => {
        if (listref.current.length !== 0) {
            listref.current.forEach((obj) => {
                if (obj === null) return;
                if (obj.contentEditable === 'true') {
                    obj.focus();

                    //全选文本
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(obj);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            });
        }
    }, [renameList])

    if (todoData !== null) {
        return (
            <ThemeProvider theme={theme}>
                <div className='todoBase'>

                    <div className='todoListColumn'>
                        <p className='todoTitle'>待办清单</p>
                        <TextField className='searchInput' hiddenLabel type="search"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FluentIcon className='searchIcon' iconName='Search' />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="搜索" variant='filled' size='small' />
                        <div className='todoListBox'>
                            <DragDropContext onDragEnd={(obj) => handleListMove(obj)}>
                                <Droppable droppableId="todolist" direction='vertical'>
                                    {(provided) => (
                                        <div className="todoListDetailBox" ref={provided.innerRef} {...provided.droppableProps}>
                                            {todoData.lists.map((obj, index) => (
                                                <Draggable draggableId={obj.id} index={index} key={obj.id}>
                                                    {(provided) => (
                                                        <div className={`todoListItem ${selectedList.list.id === obj.id ? 'active' : ''} `} data-listid={obj.id}
                                                            onClick={(e) => handleSelectList({ group: 'todolist', id: e.target.dataset.listid })}
                                                            onMouseUp={(e) => e.button === 2 ? iscallout({ dom: e, events: calloutEvents.listCallout }) : null}
                                                            suppressContentEditableWarning={true}
                                                            key={obj.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <FluentIcon data-listid={obj.id} className='FluentIcon' iconName='List' />
                                                            <p
                                                                ref={e => listref.current[listNum++] = e}
                                                                className={`editableText ${renameList === obj.id ? 'editing' : ''}`}
                                                                data-listid={obj.id}
                                                                onBlur={(e) => renameList === obj.id ? handleRenameList(e) : null}
                                                                onKeyDown={(e) => e.key === 'Enter' ? handleRenameList(e) : null}
                                                                contentEditable={renameList === obj.id ? true : false}
                                                                suppressContentEditableWarning={true}
                                                            >
                                                                {obj.name}
                                                            </p>
                                                        </div>

                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                {todoData.groups.map((gobj, index) => (
                                    <Droppable droppableId={gobj.id} direction='vertical' key={gobj.id}>
                                        {(provided) => (
                                            <details className='todoListDetailsDom' ref={provided.innerRef} {...provided.droppableProps}>
                                                <summary
                                                    data-groupid={gobj.id}
                                                    className='todoListItem'
                                                    onMouseUp={(e) => e.button === 2 ? iscallout({ dom: e, events: calloutEvents.groupCallout }) : null}>
                                                    <FluentIcon className='FluentIcon Group' iconName='ViewListGroup' />
                                                    <FluentIcon className='FluentIcon-folder' iconName='ChevronDownMed' />
                                                    <p
                                                        className={`editableText ${renameList === gobj.id ? 'editing' : ''}`}
                                                        data-groupid={gobj.id}
                                                        onBlur={(e) => renameList === gobj.id ? handleRenameList(e) : null}
                                                        onKeyDown={(e) => e.key === 'Enter' ? handleRenameList(e) : null}
                                                        ref={e => listref.current[listNum++] = e}
                                                        contentEditable={renameList === gobj.id ? true : false}
                                                        suppressContentEditableWarning={true}
                                                    >
                                                        {gobj.name}
                                                    </p>
                                                </summary>
                                                {gobj.lists.map((obj, index) => (
                                                    <Draggable draggableId={obj.id} index={index} key={obj.id}>
                                                        {(provided) => (
                                                            <div key={index} className={`todoListItem ${selectedList.list.id === obj.id ? 'active' : ''} `}
                                                                data-groupid={gobj.id} data-listid={obj.id}
                                                                onClick={(e) => handleSelectList({ group: gobj.id, id: e.target.dataset.listid })}
                                                                onMouseUp={(e) => e.button === 2 ? iscallout({ dom: e, events: calloutEvents.listCallout }) : null}
                                                                ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                            >
                                                                <FluentIcon data-groupid={gobj.id} data-listid={obj.id} className='FluentIcon' iconName='List' />
                                                                <p
                                                                    ref={e => listref.current[listNum++] = e}
                                                                    className={`editableText ${renameList === obj.id ? 'editing' : ''}`}
                                                                    data-listid={obj.id} data-groupid={gobj.id}
                                                                    onBlur={(e) => renameList === obj.id ? handleRenameList(e) : null}
                                                                    onKeyDown={(e) => e.key === 'Enter' ? handleRenameList(e) : null}
                                                                    contentEditable={renameList === obj.id ? true : false}
                                                                    suppressContentEditableWarning={true}>
                                                                    {obj.name}
                                                                </p>
                                                            </div>

                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </details>
                                        )}
                                    </Droppable>
                                ))}
                            </DragDropContext>
                        </div>

                        <div className="todoListColumnBottom">
                            <button onClick={handleNewList}><FluentIcon className='FluentIcon' iconName='CalculatorAddition' />新建列表</button>
                            <button onClick={handleNewGroup}><FluentIcon className='FluentIcon' iconName='FabricNewFolder' /></button>
                        </div>
                    </div>
                    <TodoMain selectedList={selectedList} SETselectedList={SetSelectedList} />

                </div>
                {callout !== null ?
                    <Callout
                        className='TodoCallout'
                        role="dialog"
                        target={callout.dom}
                        onDismiss={() => iscallout(null)}
                        gapSpace={5}
                        beakWidth={0}
                        directionalHint={4}
                        setInitialFocus
                    >
                        <div style={{ minWidth: '168px' }} className='TodoCalloutBox'>
                            {callout.events.map((obj, index) => (
                                <div key={index} className='TodoCalloutList' onClick={() => obj.func(callout.dom.target)} style={{ color: obj.color }}>
                                    <FluentIcon iconName={obj.iconName} />
                                    <p className='title'>{obj.title}</p>
                                </div>
                            ))}
                        </div>
                    </Callout>
                    : null}
            </ThemeProvider>
        )
    }

}

function TodoMain(props) {

    const { selectedList, SETselectedList } = props;

    const [renameState, SetrenameState] = useState(false);
    const [callout, iscallout] = useState(null);
    const [datePickerCallout, ExdatePickerCallout] = useState(null);
    const [eventEdit, SeteventEdit] = useState(null);
    const [colorEdit, SetcolorEdit] = useState(null);

    const titleRef = useRef(null);
    const inputRef = useRef(null);
    const inputToolRef = useRef(null);

    const calloutEvents = {
        listCalout: [
            {
                iconName: 'Rename',
                title: '重命名列表',
                color: '#212121',
                func: (e) => {
                    SetrenameState(true);
                    iscallout(null);
                }
            },
            {
                iconName: 'Color',
                title: '更改主题',
                color: '#212121',
                func: (e) => {

                }
            },
            {
                iconName: 'Delete',
                title: '删除列表',
                color: 'rgb(220,40,43)',
                func: (e) => {

                }
            },
        ],
        deadLineCallout: [
            {
                iconName: '',
                title: '明天',
                subTitle: dayjs().add(1, 'day').format('周dd'),
                color: '#212121',
                func: () => {
                    handleDeadline(dayjs().add(1, 'day'));
                    iscallout(null);
                }
            },
            {
                iconName: '',
                title: '后天',
                subTitle: dayjs().add(2, 'day').format('周dd'),
                color: '#212121',
                func: () => {
                    handleDeadline(dayjs().add(2, 'day'));
                    iscallout(null);
                }
            },
            {
                iconName: '',
                title: '下周',
                subTitle: '周一',
                color: '#212121',
                func: () => {
                    const futureDay = dayjs().day() === 6 ? dayjs().add(6, 'day') : dayjs().add(7, 'day');
                    handleDeadline(dayjs(futureDay).startOf('week'));
                    iscallout(null);
                }
            },
            {
                iconName: 'Calendar',
                title: '选择日期',
                color: '#212121',
                func: (e) => {
                    ExdatePickerCallout(e);
                }
            },
            {
                iconName: 'Delete',
                title: '无截止日期',
                color: 'rgb(220,40,43)',
                func: () => {
                    handleDeadline(null);
                    iscallout(null);
                }
            }
        ],
    }

    const handleCheckEvent = (e) => {
        const id = e.target.parentNode.dataset.eventid;
        const checked = e.target.checked;
        let events = selectedList.list.events;
        events.forEach((event, index) => {
            if (event.id === id) {
                events.splice(index, 1);
                !checked ? events.unshift({ ...event, done: checked }) : events.push({ ...event, done: checked });
            }
        })

        SeteventEdit(null);
        SETselectedList({ group: selectedList.group, list: { ...selectedList.list, events: [...events] } });

    }
    const handleListRename = () => {
        const newName = titleRef.current.innerText;
        if (newName !== selectedList.list.name) {
            SETselectedList({ group: selectedList.group, list: { ...selectedList.list, name: newName } });
        }
        SetrenameState(false);
    }
    const handleNewEvent = () => {
        const eventName = inputRef.current.value;
        if (eventName !== '') {
            let ddldom;
            inputToolRef.current.childNodes.forEach((node) => {
                if (node.dataset.name === 'deadline') {
                    ddldom = node.childNodes[1];
                }
            })

            const deadline = ddldom.dataset.date;
            let updateList = selectedList.list;

            updateList.events.unshift({
                id: uuidv4(),
                title: eventName,
                description: '',
                deadline: deadline,
                done: false
            })
            inputRef.current.value = '';
            handleDeadline(null);
            SETselectedList({ group: selectedList.group, list: updateList });

        }
    }
    const handleOnInput = () => {
        if (inputRef.current.value !== '' && inputToolRef.current.style.display !== 'flex') {
            inputToolRef.current.style.display = 'flex';
        } else if (inputRef.current.value === '' && inputToolRef.current.style.display === 'flex') {
            inputToolRef.current.style.display = 'none';
        }
    }
    const handleDeadline = (date) => {
        let dom;
        inputToolRef.current.childNodes.forEach((node) => {
            if (node.dataset.name === 'deadline') {
                dom = node.childNodes[1];
            }
        })
        if (date !== null) {
            date = dayjs(date).format('YYYY-MM-DD');
            dom.dataset.date = date;
            const diff = dayjs(date).diff(dayjs().format('YYYY-MM-DD'), 'day');
            if (diff === 1) {
                dom.innerText = '明天';
            } else if (diff === 2) {
                dom.innerText = '后天';
            } else {
                dom.innerText = dayjs(date).format('M月D日, 周dd');
            }
        } else {
            dom.dataset.date = '';
            dom.innerText = '';
        }
        inputRef.current.focus();

    }
    const handleEventEdit = (dom) => {
        if (dom.type !== 'checkbox') {
            while (dom.dataset.eventbox !== 'true') {
                dom = dom.parentNode;
            }
            let eventObj;
            selectedList.list.events.forEach((obj) => {
                if (obj.id === dom.dataset.eventid) {
                    eventObj = obj;
                }
            })

            SeteventEdit({ target: dom, event: eventObj });
        }

    }
    const eventEdited = (event) => {
        let newEventsList = selectedList.list.events;
        if (event !== null) {
            newEventsList = newEventsList.map((obj) => {
                if (obj.id === eventEdit.event.id) {
                    return eventEdit.event;
                } else return obj;
            })

        } else {
            for (let i = 0; i < newEventsList.length; i++) {
                if (newEventsList[i].id === eventEdit.event.id) {
                    newEventsList.splice(i--, 1);
                }
            }
        }
        SETselectedList({ group: selectedList.group, list: { ...selectedList.list, events: newEventsList } });
        SeteventEdit(null);
    }
    const onFormatDate = (date) => {
        if (date !== '') return dayjs(date).format("M月D日, 周dd");
    }

    useEffect(() => { //聚焦更改标题
        if (titleRef.current !== null && renameState) {
            titleRef.current.focus();
            //全选文本
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(titleRef.current);
            selection.removeAllRanges();
            selection.addRange(range);
        }

    }, [renameState])

    useEffect(() => { //聚焦新建事件
        if (selectedList.list.id !== 'initial') inputRef.current.focus();

    }, [selectedList.list.id])


    if (selectedList.list.id !== 'initial') {
        return (
            <div style={{ background: selectedList.list.background }} className="toDoPreBox">
                <div className='toDoPreBoxHeader'>
                    <h1
                        ref={titleRef}
                        className={`toDoPreBoxHeaderTitle ${renameState ? 'editing' : null}`}
                        contentEditable={renameState}
                        suppressContentEditableWarning={true}
                        onClick={renameState ? null : () => SetrenameState(true)}
                        onBlur={handleListRename}
                        onKeyDown={(e) => e.key === 'Enter' ? handleListRename() : null}

                    >{selectedList.list.name}</h1>
                    <div>
                        <button onClick={(e) => iscallout({ dom: e.target, events: calloutEvents.listCalout })} className='toDoBtnOutline'><FluentIcon className='FluentIcon' iconName='More' /></button>
                    </div>
                </div>
                <div className='toDoPreBoxBody'>
                    {selectedList.list.events.map((obj, index) => (
                        <div key={index} data-eventbox='true' data-eventid={obj.id} className={`toDoPreEventBox ${obj.done ? 'done' : null}`} onMouseUp={(e) => handleEventEdit(e.target)}>
                            <div className='toDoPreEventBoxCheck'>
                                <Checkbox size='small'
                                    data-eventid={obj.id}
                                    checked={obj.done === true ? true : false}
                                    icon={<FluentIcon style={{ color: '#3c3c3c', fontWeight: '600' }} iconName='CircleRing' />}
                                    checkedIcon={<FluentIcon style={{ color: selectedList.list.color }} iconName='SkypeCircleCheck' />}
                                    onChange={(e) => handleCheckEvent(e)}
                                />
                            </div>
                            <div className='toDoPreEventBoxTitleBox'>
                                <p className='toDoPreEventBoxTitle'>{obj.title}</p>
                                <p className='toDoPreEventBoxDeadline'>{`${obj.deadline !== '' ? dayjs(obj.deadline).format('M月D日') : ''} ${obj.deadline !== '' && !obj.done ? (dayjs(obj.deadline).diff(dayjs().format('YYYY-MM-DD'), 'day') > 0 ? dayjs(obj.deadline).diff(dayjs(dayjs().format('YYYY-MM-DD')), 'day') + '天' : "") : ''}`}</p>
                            </div>
                            {obj.description !== '' ? <p className='toDoPreEventBoxDescription'>{obj.description}</p> : null}
                        </div>
                    ))}
                </div>
                <div className="toDoPreBoxFooter">
                    <div className='toDoPreEventAddBox'>
                        <div onClick={() => handleNewEvent()} className='toDoPreEventBoxAdd'><FluentIcon iconName='AddEvent' /></div>
                        <input ref={inputRef}
                            onKeyDown={(e) => e.key === 'Enter' ? handleNewEvent() : null}
                            onInput={() => handleOnInput()}
                            className='toDoPreAddEvent' type='text' placeholder='添加任务'
                        />
                        <div ref={inputToolRef} className='toDoPreAddToolBox'>
                            <div data-name='deadline' onClick={(e) => iscallout({ dom: e.target, events: calloutEvents.deadLineCallout })} className='toDoPreEventBoxToolBtn'>
                                <FluentIcon iconName='DateTime' />
                                <p data-date=''></p>
                            </div>
                        </div>
                    </div>
                </div>
                {callout !== null ?
                    <Callout
                        className='TodoCallout'
                        role="dialog"
                        target={callout.dom}
                        onDismiss={() => iscallout(null)}
                        gapSpace={8}
                        beakWidth={0}
                        directionalHint={5}
                        setInitialFocus
                    >
                        <div style={{ minWidth: "248px" }} className='TodoCalloutBox'>
                            {callout.events.map((obj, index) => (
                                <div key={index} className='TodoCalloutListM' onClick={() => obj.func(callout.dom)} style={{ color: obj.color }}>
                                    <FluentIcon iconName={obj.iconName} />
                                    <p className='title'>{obj.title}</p>
                                    <p className='subTitle'>{obj.subTitle}</p>
                                </div>
                            ))}
                        </div>
                    </Callout>
                    : null}
                {datePickerCallout !== null ?
                    <Callout
                        target={datePickerCallout}
                        onDismiss={() => ExdatePickerCallout(null)}
                        role='datePicker'
                        gapSpace={0}
                        beakWidth={0}
                        setInitialFocus
                    >
                        <Calendar
                            showSixWeeksByDefault
                            showMonthPickerAsOverlay
                            highlightSelectedMonth
                            showGoToToday={false}
                            onSelectDate={(date) => handleDeadline(date)}
                            minDate={new Date()}
                            strings={defaultCalendarStrings}
                        />
                    </Callout>
                    : null}
                {eventEdit !== null ?
                    <Callout
                        className='eventEditCallout'
                        target={eventEdit.target}
                        onDismiss={() => eventEdited(eventEdit.event)}
                        role='eventEdit'
                        gapSpace={0}
                        beakWidth={0}
                    >
                        <div key={eventEdit.event.id} className='eventEditCalloutBox'>
                            <div className='eventEditCalloutList'>
                                <FluentIcon iconName='Rename' />
                                <input type='text' defaultValue={eventEdit.event.title} placeholder='事件名称' onBlur={(e) => SeteventEdit({ target: eventEdit.target, event: { ...eventEdit.event, title: e.target.value } })} />
                            </div>
                            <div className='eventEditCalloutList'>
                                <FluentIcon iconName='Calendar' />
                                <DatePicker
                                    className='TextDatePicker'
                                    // DatePicker uses English strings by default. For localized apps, you must override this prop.
                                    strings={defaultCalendarStrings}
                                    showMonthPickerAsOverlay={true}
                                    showGoToToday={false}
                                    minDate={new Date()}
                                    value={eventEdit.event.deadline !== '' ? dayjs(eventEdit.event.deadline).toDate() : ''}
                                    onSelectDate={(date) => SeteventEdit({ target: eventEdit.target, event: { ...eventEdit.event, deadline: dayjs(date).format('YYYY-MM-DD') } })}
                                    formatDate={onFormatDate}
                                    placeholder="添加截止时间"
                                    borderless
                                    ariaLabel="Select a date"
                                />
                            </div>
                            <div className='eventEditCalloutList'>
                                <FluentIcon iconName='AddNotes' />
                                <textarea placeholder='添加备注' defaultValue={eventEdit.event.description} onBlur={(e) => SeteventEdit({ target: eventEdit.target, event: { ...eventEdit.event, description: e.target.value } })} />
                            </div>
                            {eventEdit.event.done ?
                                <div className='eventEditCalloutDone'><FluentIcon iconName='SkypeCheck' />已完成</div> :
                                <div className='eventEditCalloutDone'><FluentIcon iconName='SkypeMinus' />未完成</div>
                            }

                            <div className='eventEditCalloutListDelete' onClick={() => eventEdited(null)}>
                                <FluentIcon iconName='Delete' />
                                <p>删除此事件</p>
                            </div>
                        </div>
                    </Callout>
                    : null}
                {colorEdit !== null ?
                    <Callout
                        className='colorEditCallout'
                        role='colorEdit'
                        gapSpace={0}
                        beakWidth={0}
                    >
                        <div className='colorEditCallout'>
                            
                        </div>
                    </Callout>
                    : null}
            </div>
        )
    } else {
        return (
            <div className="toDoPreBox">

            </div>
        )
    }

}

export default Todo;