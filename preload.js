const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('eleApi', {
    getCalendarEvents: async (dateLimit) => {
        let result;
        await ipcRenderer.invoke('getCalendarEvents',dateLimit).then((rs) => {
            result = rs;
        })
        return result;
    },
    editCalendarData: async (mode,data) => {
        await ipcRenderer.invoke('editCalendarData', mode,data).then((rs) => {

        })
    },
    getTodoData: async (mode) => {
        let result;
        await ipcRenderer.invoke('getTodoData',mode).then((rs) => {
            result = rs;
        })
        return result;
    },
    editTodoData: async (mode,data) => {
        await ipcRenderer.invoke('editTodoData',mode,data).then((rs) => {
            
        })
    },
})