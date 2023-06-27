import Menu from './components/menu';

import Calendar from './pages/calendar';
import Todo from './pages/todo';
import Home from './pages/Home';

import { Routes, Route } from "react-router-dom";
import './app.css';

import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { useEffect, useState } from 'react';
initializeIcons();

const GAODE_LOCATION_URL = 'https://restapi.amap.com/v3/ip?key=e7d6d72cb6ae0dd1abc3e6bdf14ca274';
const GAODE_WEATHER_URL = 'https://restapi.amap.com/v3/weather/weatherInfo?key=e7d6d72cb6ae0dd1abc3e6bdf14ca274&city=';

async function requestCalendarData(year) {
  let results;
  await window.eleApi.getCalendarEvents(year).then((result) => {
    results = result;
  })
  return results;
}
async function requestTodoData(mode) {
  return await window.eleApi.getTodoData(mode).then((result) => {
    return result
  })
}
async function getWeather() {
  const adcode = await fetch(GAODE_LOCATION_URL, { method: 'GET' })
    .then((data) => data.json())
    .then((data) => {
      return data.adcode;
    })
    .catch((err) => {
      console.log(err);
    })
  const result = await fetch(GAODE_WEATHER_URL + adcode, { method: 'GET' })
    .catch(() => {
      return null;
    })
    .then((data) => data.json())
    .then((data) => {
      return data.lives[0];
    })
    
  return result;
}


function App() {
  const [calendarData, ExcalendarData] = useState([]);
  const [todoData, ExtodoData] = useState(null);
  const [weather, SETweather] = useState(null);

  useEffect(() => {
    getWeather().then((r) => { SETweather(r) });
    requestCalendarData('2023').then((r) => ExcalendarData(r));
    requestTodoData('list').then((r) => ExtodoData(r));
  }, [])

  const updateCalendarData = (mode, data, newEvents) => {
    ExcalendarData(newEvents);
    window.eleApi.editCalendarData(mode, data);
  }
  const updateTodoData = (data) => {
    ExtodoData(data);
    window.eleApi.editTodoData('list', data);
  }

  return (
    <div className='base'>
      <div className='baseF'>
        <Menu></Menu>
        <main className='mainbox'>
          <Routes>
            <Route path="" element={<Home weather={weather} mainData={{ calendar: calendarData }} />}></Route>
            <Route path="calendar" element={<Calendar calendarData={calendarData} updateCalendarData={updateCalendarData} />}></Route>
            <Route path="todo" element={<Todo todoData={todoData} ExtodoData={updateTodoData} />}></Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
