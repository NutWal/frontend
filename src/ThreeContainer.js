import {memo, useRef, useEffect, useState} from "react";
import {Slider, Checkbox} from "antd";
import {
    DEFAULT_COLOR,
    ROTATION_START_COLOR,
    ROTATION_CHANGE_COLOR,
    ROTATION_END_COLOR,
} from "./constants";

import Three from "./Three";

const NativeRenderer = () => {
    const threeRef = useRef(); //Используется для обращения к контейнеру для canvas
    const three = useRef(); //Служит для определения, создан ли объект, чтобы не создавать повторный

    const [meshColor, meshColorChange] = useState(DEFAULT_COLOR);
    const [autoRotate, autoRotateChange] = useState(false);
    const [enableDamping, enableDampingChange] = useState(false);
    const [autoRotateSpeed, autoRotateSpeedChange] = useState(2);

    // Создание объекта класса Three, предназначенного для работы с three.js
    useEffect(() => {
        if (!three.current) {
            three.current = new Three({
                canvasContainer: threeRef.current,
                meshColorChange,
                meshColor,
                autoRotate,
            });
        }
    }, [meshColor, autoRotate]);

    useEffect(() => {
        if (three.current) {
            three.current.meshColorChange(meshColor);
        }
    }, [meshColor]);

    useEffect(() => {
        if (three.current) {
            three.current.autoRotateChange(autoRotate);
        }
    }, [autoRotate]);

    useEffect(() => {
        if (three.current) {
            three.current.autoRotateSpeedChange(autoRotateSpeed);
        }
    }, [autoRotateSpeed]);

    useEffect(() => {
        if (three.current) {
            three.current.enableDampingChange(enableDamping);
        }
    }, [enableDamping]);

    return (
        <div>
            <div className="canvas_" ref={threeRef} />
            {/*<div className="toolbar">*/}
            {/*    <div>*/}
            {/*        <span>legend</span>*/}
            {/*        <div className="legend">*/}
            {/*            <div>*/}
            {/*  <span*/}
            {/*      className="legend-rect"*/}
            {/*      style={{backgroundColor: DEFAULT_COLOR}}*/}
            {/*  />*/}
            {/*                <span>dafault</span>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*  <span*/}
            {/*      className="legend-rect"*/}
            {/*      style={{backgroundColor: ROTATION_START_COLOR}}*/}
            {/*  />*/}
            {/*                <span>rotation start</span>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*  <span*/}
            {/*      className="legend-rect"*/}
            {/*      style={{backgroundColor: ROTATION_CHANGE_COLOR}}*/}
            {/*  />*/}
            {/*                <span>rotation change</span>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*  <span*/}
            {/*      className="legend-rect"*/}
            {/*      style={{backgroundColor: ROTATION_END_COLOR}}*/}
            {/*  />*/}
            {/*                <span>rotation end</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <span>auto rotate</span>*/}
            {/*        <div className="legend-checkbox">*/}
            {/*            <Checkbox*/}
            {/*                checked={autoRotate}*/}
            {/*                onChange={(prev) => autoRotateChange(prev.target.checked)}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <span>enable damping</span>*/}
            {/*        <div className="legend-checkbox">*/}
            {/*            <Checkbox*/}
            {/*                checked={enableDamping}*/}
            {/*                onChange={(prev) => enableDampingChange(prev.target.checked)}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <span>auto rotate speed</span>*/}
            {/*        <Slider*/}
            {/*            value={autoRotateSpeed}*/}
            {/*            min={0}*/}
            {/*            max={100}*/}
            {/*            onChange={(value) => autoRotateSpeedChange(value)}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default memo(NativeRenderer);
