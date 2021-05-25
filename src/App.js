import './App.css';
import React, {useEffect, useState} from 'react'
import {useHttp} from './hooks/http.hook'
import Select from 'react-select'


function App() {
    const [progress, setProgress] = useState(0);
    const [angle, setAngle] = useState(360);
    const [filename, setFilename] = useState(`Scan_${Date.now()}`);
    const [resolution, setResolution] = useState('High');
    const [partialScan, setPartialScan] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanningEnded, setScanningEnded] = useState(false);
    const [scanningTime, setScanningTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [progressBar, setProgressBar] = useState({width: 0});
    // const [socket, setSocket] = useState();

    const {loading, request} = useHttp()


    const socket = new WebSocket('ws://localhost:3000/connect')

    socket.onopen = () => {
        console.log('connected')
    }

    socket.onmessage = (e) => {
        let msg = JSON.parse(e.data)
        console.log(msg)
        switch (msg.type) {
            case 'PROGRESS':
                setScanning(true)
                setProgress(msg.progress)
                const num = 500 / 100 * msg.progress
                setProgressBar({width: num})
                // setScanningTime(Date.now() - startTime)
                // setScanningTime(Date.now())
                let time = Date.now() - startTime
                setScanningTime(time)
                break
            case 'END':
                setScanning(false)
                setScanningEnded(true)
                // alert('Сканирование завершено.')
                break
            case 'DELETED':
                alert('Результат сканирования удален')
                setScanningEnded(false)
                break
            case 'SAVED':
                alert('Результат сканирования сохранен')
                setScanningEnded(false)
                break
        }
    }

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
            // например, сервер убил процесс или сеть недоступна
            // обычно в этом случае event.code 1006
            console.log('[close] Соединение прервано');
        }
    };

    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };



    const startScanning = () => {
        setProgress(0)
        setProgressBar({width: 0})
        setStartTime(Date.now())


        try {
            socket.send(JSON.stringify({
                type: 'START',
                resolution,
                angle,
            }))

        } catch (e) {
            alert(e.message)
        }
    }

    const stopScanning = () => {
        try {
            // const fetched = await request('http://localhost:3000/stop', 'GET')

            socket.send(JSON.stringify({
                type: 'STOP'
            }))
        } catch (e) {
            alert(e.message)
        }
    }

    const saveHandler = () => {
        let fn = filename
        fn.trim();
        setFilename(fn);
        if (filename.length) {
            try {
                socket.send(JSON.stringify({
                    type: 'SAVE',
                    filename: filename,
                }))
            } catch (e) {
                alert(e.message)
            }
        } else {
            alert('Введите имя файла')
        }

    }

    const deleteHandler = () => {
        try {
            socket.send(JSON.stringify({
                type: 'DELETE',
            }))
        } catch (e) {
            alert(e.message)
        }
    }

    const resolutionOptions = [
        {value: '1', label: 'High'},
        {value: '2', label: 'Medium'},
        {value: '3', label: 'Low'}
    ]

    function selectHandler(value) {
        setResolution(value.label)
    }

    useEffect(() => {
        // window.M.updateTextFields()

    }, [])

    // стили для селекта
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: '#9e9e9e',
            minHeight: '40px',
            height: '40px',
            boxShadow: state.isFocused ? null : null,
        }),

        valueContainer: (provided, state) => ({
            ...provided,
            height: '40px',
            padding: '0 6px'
        }),

        input: (provided, state) => ({
            ...provided,
            margin: '0px',
        }),
        indicatorSeparator: state => ({
            display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '40px',
        }),
    };


    return (
        <div className="app">
            <div className="container">
                <div className="row">
                    <div className="col s12 m6  offset-l3">
                        <div className="card teal lighten-5">
                            {scanningEnded ? (
                                <div className="card-content teal-text">
                                    <span className="card-title"><h4>Сканирование завершено</h4></span>

                                    <div className="form-field">
                                        <div className="form-field">
                                            <label htmlFor="angle">Имя файла</label>
                                            <input
                                                placeholder="Введите имя файла"
                                                id="filename"
                                                type="text"
                                                value={filename}
                                                onChange={e => setFilename(e.target.value)}
                                            />
                                        </div>

                                    </div>

                                    {/*<div className="form-field">*/}
                                        {/*<a className="waves-effect waves-light btn-large">Сканировать</a>*/}
                                        <button className="btn teal" onClick={saveHandler}
                                                style={{marginRight: 10}}>СОХРАНИТЬ
                                        </button>
                                        <button className="btn red darken-3" onClick={deleteHandler}
                                                style={{marginRight: 10}}>УДАЛИТЬ
                                        </button>

                                    {/*</div>*/}

                                </div>

                            ) : (
                                <div className="card-content teal-text">
                                    <span className="card-title"><h4>Настройки</h4></span>

                                    <div className="form-field">
                                        <label htmlFor="resolution">Качество сканирования</label>
                                        <Select
                                            options={resolutionOptions}
                                            placeholder="Выберите качество сканирования"
                                            id="resolution"
                                            // type="text"
                                            // value={category}
                                            value={resolutionOptions.filter(option => option.label === resolution)}
                                            onChange={selectHandler}
                                            styles={customStyles}
                                        />

                                    </div>

                                    <div className="form-field">
                                        <p>
                                            <label>
                                                <input type="checkbox" className="filled-in" checked={partialScan}
                                                       onChange={e => setPartialScan(!partialScan)}/>
                                                <span>Частичное сканирование</span>
                                            </label>
                                        </p>
                                    </div>

                                    {partialScan ? (
                                        <div className="form-field">
                                            <label htmlFor="angle">Угол сканирования в градусах</label>
                                            <input
                                                placeholder="Введите угол сканирования"
                                                id="angle"
                                                type="text"
                                                value={angle}
                                                onChange={e => setAngle(e.target.value)}
                                            />
                                        </div>
                                    ) : null}


                                    {scanning ? (
                                        <>
                                            <div className="form-field">
                                                {/*<a className="waves-effect waves-light btn-large">Сканировать</a>*/}
                                                <button className="btn red darken-3" onClick={stopScanning}
                                                        style={{marginRight: 10}}>ПРЕРВАТЬ
                                                </button>

                                            </div>

                                            <div className="progress">
                                                <div className="determinate" style={progressBar}/>
                                            </div>
                                            <div className="status">
                                                <p>Прогресс: {progress}%</p>
                                                <p>Время сканирования: {(Date.now() - startTime) / 1000}с.</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-field">
                                            {/*<a className="waves-effect waves-light btn-large">Сканировать</a>*/}
                                            <button className="btn teal" onClick={startScanning}
                                                    style={{marginRight: 10}}>СКАНИРОВАТЬ
                                            </button>

                                        </div>
                                    )}


                                </div>

                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
