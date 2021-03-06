import './App.css';
import React, {Suspense, useMemo, useRef, useState} from 'react'
import Select from 'react-select'
import {bindActionCreators, createStore} from 'redux'
import {PointsCloudViewer} from './PointsCloudViewer'
import useWebSocket, {ReadyState} from 'react-use-websocket';
// import {useMessage} from "./hooks/message.hook";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Loader} from './Loader'


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


// this.connect = function () {
//     // const socket = new WebSocket('ws://192.168.0.105:3000/connect')
//     // const socket = new WebSocket('ws://172.20.10.6:3000/connect')
//     // const socket = new WebSocket('ws://192.168.43.237:3001/connect')
//     const socket = new WebSocket('ws://localhost:3000/connect')
//
//     let that = this
//
//     socket.onopen = () => {
//         console.log('connected')
//     }
// }

function App() {

    const [progress, setProgress] = useState(0);
    const [angle, setAngle] = useState(360);
    const [filename, setFilename] = useState(`Scan_${Date.now()}`);
    const [resolution, setResolution] = useState('Low');
    const [previewQualityLabel, setPreviewQualityLabel] = useState('Medium');
    const [previewQuality, setPreviewQuality] = useState(10);
    const [partialScan, setPartialScan] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanningEnded, setScanningEnded] = useState(false);
    const [scanningTime, setScanningTime] = useState('');
    const [scanningEndTime, setScanningEndTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [progressBar, setProgressBar] = useState({width: 0});
    const [loading, setLoading] = useState(false);
    const [ws, setWs] = useState(null)


    const message = () => toast('text');
    // function message(){
    //     toast('text');
    // }


    // useEffect(() => {
    //     window.M.updateTextFields()
    // })


    // const [socketUrl, setSocketUrl] = useState('ws://localhost:3000/connect');
    const [socketUrl, setSocketUrl] = useState('ws://localhost:3002');
    // const [socketUrl, setSocketUrl] = useState('ws://192.168.43.237:3002');
    // const [socketUrl, setSocketUrl] = useState('ws://192.168.43.131:3000/connect');
    const messageHistory = useRef([]);

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        onMessage: async (e) => {
            console.log(e)
            let msg = JSON.parse(e.data)
            console.log(msg)
            switch (msg.type) {
                case 'PROGRESS':
                    const isScanning = scanning

                    if (loading) {
                        setLoading(false)
                    }

                    if (!isScanning) {
                        setScanning(true)
                    }
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
                    setScanningTime(timeToString((Date.now() - startTime) / 1000))
                    setScanning(false)
                    setScanningEnded(true)
                    setLoading(false)
                    if (msg.message !== undefined) {
                        alert(msg.message)
                    }
                    // alert('???????????????????????? ??????????????????.')

                    break
                case 'DELETED':
                    if (loading) {
                        setLoading(false)
                    }
                    // message('?????????????????? ???????????????????????? ????????????')
                    // message()
                    alert('?????????????????? ???????????????????????? ????????????')
                    setScanningEnded(false)
                    // window.location.reload()
                    break
                case 'SAVED':
                    if (loading) {
                        setLoading(false)
                    }
                    alert('?????????????????? ???????????????????????? ????????????????')
                    setScanningEnded(false)
                    // window.location.reload()
                    break
                case 'SAVE_STATUS':
                    if (loading) {
                        setLoading(false)
                    }
                    alert(msg.message)
                    // setScanningEnded(false)
                    // window.location.reload()
                    break
            }
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,

        share: true
    });

    messageHistory.current = useMemo(() =>
        messageHistory.current.concat(lastMessage), [lastMessage]);

    // const handleClickSendMessage = useCallback(() =>
    //     sendMessage('Hello'), []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];


    // const socket = new WebSocket('ws://192.168.0.105:3000/connect')
    // const socket = new WebSocket('ws://172.20.10.6:3000/connect')
    // const socket = new WebSocket('ws://192.168.43.237:3001/connect')
    // const socket = new WebSocket('ws://localhost:3000/connect')

    // socket.onopen = () => {
    //     console.log('connected')
    // }

    // socket.onmessage = async (e) => {
    // onmessage = async (e) => {
    //     let msg = JSON.parse(e.data)
    //     console.log(msg)
    //     switch (msg.type) {
    //         case 'PROGRESS':
    //             setScanning(true)
    //             setProgress(msg.progress)
    //             const num = 500 / 100 * msg.progress
    //             setProgressBar({width: num})
    //             // setScanningTime(Date.now() - startTime)
    //             // setScanningTime(Date.now())
    //             let time = Date.now() - startTime
    //             setScanningTime(time)
    //
    //             // await addPoints(points, msg.points)
    //
    //             let old_points = store.getState().points
    //             //
    //             // console.log('points', points)
    //             console.log('old_points', old_points)
    //
    //             // let v = []
    //             //
    //             // msg.points.map((point, index) => {
    //             //     v.push(point[1])
    //             //     v.push((point[2] * -1)- 50)
    //             //     v.push(point[0])
    //             // })
    //
    //             //
    //             let new_points = old_points.concat(msg.points)
    //             //
    //             console.log('new_points.length', new_points.length)
    //
    //             await store.dispatch(changePoints(new_points))
    //             //
    //             // setPoints(new_points)
    //
    //             break
    //         case 'END':
    //             setScanning(false)
    //             setScanningEnded(true)
    //             // alert('???????????????????????? ??????????????????.')
    //             break
    //         case 'DELETED':
    //             alert('?????????????????? ???????????????????????? ????????????')
    //             setScanningEnded(false)
    //             window.location.reload()
    //             break
    //         case 'SAVED':
    //             alert('?????????????????? ???????????????????????? ????????????????')
    //             setScanningEnded(false)
    //             window.location.reload()
    //             break
    //     }
    // }

    // socket.onclose = function(event) {
    //     if (event.wasClean) {
    //         console.log(`[close] ???????????????????? ?????????????? ??????????, ??????=${event.code} ??????????????=${event.reason}`);
    //     } else {
    //         // ????????????????, ???????????? ???????? ?????????????? ?????? ???????? ????????????????????
    //         // ???????????? ?? ???????? ???????????? event.code 1006
    //         console.log('[close] ???????????????????? ????????????????');
    //     }
    // };

    // socket.onerror = function(error) {
    //     console.log(`[error] ${error.message}`);
    // };


    const startScanning = async () => {
        setProgress(0)
        setProgressBar({width: 0})
        setStartTime(Date.now())
        setLoading(true)

        await store.dispatch(changePoints([]))


        console.log('start button clicked!')


        try {
            // socket.send(JSON.stringify({
            sendMessage(JSON.stringify({
                type: 'START',
                resolution,
                angle,
            }))

        } catch (e) {
            alert(e.message)
        }
    }

    const stopScanning = () => {
        setLoading(true)
        try {
            // const fetched = await request('http://localhost:3000/stop', 'GET')

            // socket.send(JSON.stringify({
            sendMessage(JSON.stringify({
                type: 'STOP'
            }))
        } catch (e) {
            alert(e.message)
        }
    }

    const saveHandler = () => {
        setLoading(true)
        let fn = filename
        fn.trim();
        setFilename(fn);
        if (filename.length) {
            try {
                // socket.send(JSON.stringify({
                sendMessage(JSON.stringify({
                    type: 'SAVE',
                    filename: filename,
                }))
            } catch (e) {
                alert(e.message)
            }
        } else {
            setLoading(false)
            alert('?????????????? ?????? ??????????')
        }

    }

    const deleteHandler = () => {
        try {
            // socket.send(JSON.stringify({
            setLoading(true)
            sendMessage(JSON.stringify({
                type: 'DELETE',
            }))
        } catch (e) {
            alert(e.message)
        }
    }

    const resolutionOptions = [
        {value: '3', label: 'Low'},
        {value: '2', label: 'Medium'},
        {value: '1', label: 'High'}
    ]

    const previewQualityOptions = [
        {value: '1', label: 'Source'},
        {value: '10', label: 'High'},
        {value: '40', label: 'Medium'},
        {value: '50', label: 'Low'}
    ]

    const timeToString = (timeInSeconds) => {
        let minutes = timeInSeconds / 60
        let seconds = timeInSeconds % 60

        if (minutes >= 1) {
            return `${Math.floor(minutes)}?????? ${Math.floor(seconds)}??`
        } else {
            return `${Math.floor(seconds)}??`
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


    // ?????????? ?????? ??????????????
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

    if (loading) {
        return <Loader/>
    }

    return (
        <div className="app">
            <div className="container">
                <div className="row">
                    {/*<div className="col s12 m6 offset-l3">*/}
                    <div className="col s12 m10 offset-m1">
                        <div className="card white card-style">
                            {scanningEnded ? (
                                <div className="card-content teal-text">
                                    <span className="card-title"><h4>???????????????????????? ??????????????????</h4></span>

                                    <div className="points-cloud-viewer-box">
                                        <Suspense fallback={<div>Loading... </div>}>
                                            <PointsCloudViewer points={store.getState().points} quality={1}/>
                                            {/*<ThreeContainer/>*/}
                                        </Suspense>
                                    </div>

                                    <div className="status">
                                        <p>?????????? ????????????????: {store.getState().points.length}</p>
                                        {/*<p>?????????? ????????????????????: {Math.floor((store.getState().points.length) / previewQuality)}</p>*/}
                                        {/*<p>?????????? ????????????????????????: {timeToString((Date.now() - startTime) / 1000)}</p>*/}
                                        <p>?????????? ????????????????????????: {scanningTime}</p>
                                    </div>

                                    {/*<div className="form-field">*/}
                                    {/*    <label htmlFor="quality">???????????????? ??????????????????????????</label>*/}
                                    {/*    <Select*/}
                                    {/*        options={previewQualityOptions}*/}
                                    {/*        placeholder="???????????????? ???????????????? ??????????????????????????"*/}
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
                                            <label htmlFor="angle">?????? ??????????</label>
                                            <input
                                                placeholder="?????????????? ?????? ??????????"
                                                id="filename"
                                                type="text"
                                                value={filename}
                                                onChange={e => setFilename(e.target.value)}
                                            />
                                        </div>

                                    </div>

                                    {/*<div className="form-field">*/}
                                    {/*<a className="waves-effect waves-light btn-large">??????????????????????</a>*/}
                                    <div className="button-group">
                                        <button className="btn red darken-3 button-l" onClick={deleteHandler}>
                                            ??????????????
                                        </button>
                                        <button className="btn green darken-4 button-r" onClick={saveHandler}>
                                            ??????????????????
                                        </button>
                                    </div>

                                    {/*</div>*/}

                                </div>

                            ) : (
                                <div className="card-content teal-text">


                                    {scanning ? (
                                        <>
                                            <span className="card-title"><h4>????????????????????????</h4></span>
                                            <div className="points-cloud-viewer-box">
                                                <Suspense fallback={<div>Loading... </div>}>
                                                    <PointsCloudViewer points={store.getState().points}
                                                                       quality={previewQuality}/>
                                                    {/*<ThreeContainer/>*/}
                                                </Suspense>
                                            </div>

                                            {/*<div className="form-field">*/}
                                            {/*    <label htmlFor="quality">???????????????? ??????????????????????????</label>*/}
                                            {/*    <Select*/}
                                            {/*        options={previewQualityOptions}*/}
                                            {/*        placeholder="???????????????? ???????????????? ??????????????????????????"*/}
                                            {/*        id="quality"*/}
                                            {/*        // type="text"*/}
                                            {/*        // value={category}*/}
                                            {/*        value={previewQualityOptions.filter(option => option.label === previewQualityLabel)}*/}
                                            {/*        onChange={selectPreviewQualityHandler}*/}
                                            {/*        styles={customStyles}*/}
                                            {/*    />*/}

                                            {/*</div>*/}

                                            {/*<div className="progress">*/}
                                            {/*    <div className="determinate" style={progressBar}/>*/}
                                            {/*</div>*/}
                                            <div className="status">
                                                <p>?????????? ????????????????: {store.getState().points.length}</p>
                                                <p>??????????
                                                    ????????????????????: {Math.floor((store.getState().points.length) / previewQuality)}</p>
                                                <p>????????????????: {progress}%</p>
                                                <p>??????????
                                                    ????????????????????????: {timeToString((Date.now() - startTime) / 1000)}</p>
                                            </div>

                                            <div className="button-group">
                                                {/*<a className="waves-effect waves-light btn-large">??????????????????????</a>*/}
                                                <button className="btn red darken-3" onClick={stopScanning}
                                                        style={{marginRight: 10}}>????????????????
                                                </button>

                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="card-title"><h4 className="">??????????????????</h4></span>

                                            <div className="form-field">
                                                <label htmlFor="resolution">???????????????? ????????????????????????</label>
                                                <Select
                                                    options={resolutionOptions}
                                                    placeholder="???????????????? ???????????????? ????????????????????????"
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
                                                        <input type="checkbox" className="filled-in"
                                                               checked={partialScan}
                                                               onChange={e => setPartialScan(!partialScan)}/>
                                                        <span>?????????????????? ????????????????????????</span>
                                                    </label>
                                                </p>
                                            </div>

                                            {partialScan ? (
                                                <div className="form-field">
                                                    <label htmlFor="angle">???????? ???????????????????????? ?? ????????????????</label>
                                                    <input
                                                        placeholder="?????????????? ???????? ????????????????????????"
                                                        id="angle"
                                                        type="text"
                                                        value={angle}
                                                        onChange={e => setAngle(e.target.value)}
                                                    />
                                                </div>
                                            ) : null}

                                            <div className="button-group">
                                                {/*<a className="waves-effect waves-light btn-large">??????????????????????</a>*/}
                                                <button className="btn green darken-4" onClick={startScanning}
                                                        style={{marginRight: 10}}>??????????????????????
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
