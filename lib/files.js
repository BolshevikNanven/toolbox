const fs = require('fs')
const path=require('path')

const firstLoad = () => {
    const root = path.resolve('userdata');
    fs.access(root,(err,msg) => {
        if (err) {
            fs.mkdir(root, (err) => {
                return(err);
            })
        }
    })
}
const getCalendarData = (year) => {
    const root = path.resolve('userdata', 'calendar');
    fs.access(root, (err) => {
        if (err) {
            fs.mkdir(root, (err) => {
            return(err);
        })}
    })
    let eventResults=[];
    const calendarFilesList = fs.readdirSync(root);
    calendarFilesList.forEach((name) => {
        let filePath = path.join(root, name);
        const readResult = JSON.parse(fs.readFileSync(filePath,'utf-8'));
        eventResults.push(readResult);
    })
    return eventResults;
}
const editCalendarData = (mode, data) => {
    let doneMsg;
    const root = path.resolve('userdata', 'calendar', 'default.json');
    let defaultEvent = JSON.parse(fs.readFileSync(root, 'utf-8'));
    if (mode === 'add') {
        defaultEvent.events = [...defaultEvent.events, data];
    } else if (mode === 'edit') {
        let editedEvents = defaultEvent.events.map((obj) => {
            if (obj.id === data.id) {
                obj = {...obj,...data };
            }
            return obj;
        })
        defaultEvent.events = [...editedEvents];

    } else if (mode === 'remove') {
        let editedEvents = [];
        defaultEvent.events.forEach((obj) => {
            if (obj.id !== data.id) {
                editedEvents.push(obj);
            }
        })
        defaultEvent.events = [...editedEvents];
    }
    fs.writeFile(root, JSON.stringify(defaultEvent), (err) => {
        doneMsg = err||'success';
    })
    return doneMsg;
}

const getTodoData = (mode) => {
    if (mode === 'list') {
        const root = path.resolve('userdata', 'todo', 'list.json');
        const defaultData = JSON.parse(fs.readFileSync(root, 'utf-8'));
        return { lists: defaultData.lists, groups: defaultData.groups }
    }
    

}
const editTodoData = (mode, data) => {
    if (mode === 'list') {
        const root = path.resolve('userdata', 'todo', 'list.json');
        const defaultData = { name: 'listData', lists: data.lists, groups: data.groups };
        let doneMsg;
        fs.writeFile(root, JSON.stringify(defaultData), (err) => {
            doneMsg = err||'success';
        })
        return doneMsg;
    }
}

module.exports = {
    firstLoad,
    getCalendarData,
    editCalendarData,
    getTodoData,
    editTodoData
}