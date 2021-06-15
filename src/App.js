import './App.css';
import React, {useEffect, useState, useCallback, Suspense} from 'react'
import {useHttp} from './hooks/http.hook'
import Select from 'react-select'
import {bindActionCreators, createStore} from 'redux'
import {connect, Provider} from 'react-redux'
import {PointsCloudViewer} from './PointsCloudViewer'
import ThreeContainer from "./ThreeContainer";



const initialState = {
    points: []
}

const rootReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'ACTION_CHANGE_POINTS':
            return {...state, points: action.payload}
    }

    return state
}

const store = createStore(rootReducer)

// console.log('store.getState()', store.getState())

const putStateToProps = (state) => {
    console.log(state)
    return {
        points: state.points
    }
}

const putActionToProps = (dispatch) => {
    return {
        changePoints: bindActionCreators(changePoints, dispatch)
    }
}

const changePoints = (newPoints) => {
    return {
        type: 'ACTION_CHANGE_POINTS',
        payload: newPoints
    }
}




function App() {
    const [progress, setProgress] = useState(0);
    const [angle, setAngle] = useState(360);
    const [filename, setFilename] = useState(`Scan_${Date.now()}`);
    const [resolution, setResolution] = useState('High');
    const [previewQualityLabel, setPreviewQualityLabel] = useState('Medium');
    const [previewQuality, setPreviewQuality] = useState(10);
    const [partialScan, setPartialScan] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanningEnded, setScanningEnded] = useState(false);
    const [scanningTime, setScanningTime] = useState(0);
    const [scanningEndTime, setScanningEndTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [progressBar, setProgressBar] = useState({width: 0});


    const {loading, request} = useHttp()


    // const socket = new WebSocket('ws://192.168.0.105:3000/connect')
    // const socket = new WebSocket('ws://172.20.10.6:3000/connect')
    // const socket = new WebSocket('ws://192.168.43.237:3001/connect')
    const socket = new WebSocket('ws://localhost:3000/connect')

    socket.onopen = () => {
        console.log('connected')
    }

    socket.onmessage = async (e) => {
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

                // await addPoints(points, msg.points)

                let old_points = store.getState().points
                //
                // console.log('points', points)
                console.log('old_points', old_points)

                // let v = []
                //
                // msg.points.map((point, index) => {
                //     v.push(point[1])
                //     v.push((point[2] * -1)- 50)
                //     v.push(point[0])
                // })

                //
                let new_points = old_points.concat(msg.points)
                //
                console.log('new_points.length', new_points.length)

                await store.dispatch(changePoints(new_points))
                //
                // setPoints(new_points)

                break
            case 'END':
                setScanning(false)
                setScanningEnded(true)
                // alert('Сканирование завершено.')
                break
            case 'DELETED':
                alert('Результат сканирования удален')
                setScanningEnded(false)
                window.location.reload()
                break
            case 'SAVED':
                alert('Результат сканирования сохранен')
                setScanningEnded(false)
                window.location.reload()
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

    // const getPoints = async () => {
    //     return points
    // }

    // async function getPoints() {
    //     return points
    // }


    // const addPoints = useCallback(async (op, np) => {
    //     let old_points = points
    //     // let old_points = await getPoints()
    //
    //     // console.log('points', points)
    //     // console.log('old_points', old_points)
    //
    //     let new_points = old_points.concat(np)
    //
    //     console.log('new_points.length', new_points.length)
    //
    //     setPoints(new_points)
    // }, [])



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

    const previewQualityOptions = [
        {value: '1', label: 'Source'},
        {value: '10', label: 'High'},
        {value: '30', label: 'Medium'},
        {value: '50', label: 'Low'}
    ]

    const timeToString = (timeInSeconds) => {
        let minutes = timeInSeconds / 60
        let seconds = timeInSeconds % 60

        if (minutes >= 1) {
            return `${Math.floor(minutes)}мин ${Math.floor(seconds)}с`
        } else {
            return `${Math.floor(seconds)}с`
        }

    }

    function selectHandler(value) {
        setResolution(value.label)
    }

    function selectPreviewQualityHandler(value) {
        setPreviewQualityLabel(value.label)
        setPreviewQuality(value.value)
        // console.log(value.value)
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
                    {/*<div className="col s12 m6 offset-l3">*/}
                    <div className="col s12 m10 offset-m1">
                        <div className="card teal lighten-5">
                            {scanningEnded ? (
                                <div className="card-content teal-text">
                                    <span className="card-title"><h4>Сканирование завершено</h4></span>

                                    <div className="points-cloud-viewer-box">
                                        <Suspense fallback={<div>Loading... </div>}>
                                            <PointsCloudViewer points={store.getState().points} quality={1}/>
                                            {/*<ThreeContainer/>*/}
                                        </Suspense>
                                    </div>

                                    <div className="status">
                                        <p>Точек получено: {store.getState().points.length}</p>
                                        <p>Точек отрисовано: {Math.floor(store.getState().points.length / previewQuality)}</p>
                                        <p>Время сканирования: {timeToString((Date.now() - startTime) / 1000)}</p>
                                    </div>

                                    {/*<div className="form-field">*/}
                                    {/*    <label htmlFor="quality">Качество предпросмотра</label>*/}
                                    {/*    <Select*/}
                                    {/*        options={previewQualityOptions}*/}
                                    {/*        placeholder="Выберите качество предпросмотра"*/}
                                    {/*        id="quality"*/}
                                    {/*        // type="text"*/}
                                    {/*        // value={category}*/}
                                    {/*        value={previewQualityOptions.filter(option => option.label === previewQualityLabel)}*/}
                                    {/*        onChange={selectPreviewQualityHandler}*/}
                                    {/*        styles={customStyles}*/}
                                    {/*    />*/}

                                    {/*</div>*/}

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



                                    {scanning ? (
                                        <>
                                            <span className="card-title"><h4>Сканирование</h4></span>
                                            <div className="points-cloud-viewer-box">
                                                <Suspense fallback={<div>Loading... </div>}>
                                                <PointsCloudViewer points={store.getState().points} quality={previewQuality}/>
                                                {/*<ThreeContainer/>*/}
                                                </Suspense>
                                            </div>

                                            <div className="form-field">
                                                <label htmlFor="quality">Качество предпросмотра</label>
                                                <Select
                                                    options={previewQualityOptions}
                                                    placeholder="Выберите качество предпросмотра"
                                                    id="quality"
                                                    // type="text"
                                                    // value={category}
                                                    value={previewQualityOptions.filter(option => option.label === previewQualityLabel)}
                                                    onChange={selectPreviewQualityHandler}
                                                    styles={customStyles}
                                                />

                                            </div>

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
                                                <p>Точек получено: {store.getState().points.length / 3}</p>
                                                <p>Точек отрисовано: {Math.floor(store.getState().points.length / previewQuality)}</p>
                                                <p>Прогресс: {progress}%</p>
                                                <p>Время сканирования: {timeToString((Date.now() - startTime) / 1000)}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
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

                                        <div className="form-field">
                                            {/*<a className="waves-effect waves-light btn-large">Сканировать</a>*/}
                                            <button className="btn teal" onClick={startScanning}
                                                    style={{marginRight: 10}}>СКАНИРОВАТЬ
                                            </button>

                                        </div>
                                        </>
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
