import {useFrame} from "@react-three/fiber";
import {Canvas} from "@react-three/fiber";
import React, {useRef} from "react";
import {Point} from './Point'
import { softShadows, MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export const PointsCloudViewer = (props) => {

    let points = props.points
    let quality = props.quality

    return (
        // <Canvas camera={{position: [0, 0, 5]}}>
        <Canvas camera={{position: [0, 50, 170]}} className="canvas-box" style={{minHeight: 200}}>
            {/*<ambientLight intensity={0.7} />*/}
            {/*<directionalLight color="white" position={[50, 50, 70]} />*/}
            {/*<ambientLight intensity={0.2} />*/}
            {/*<directionalLight />*/}
            {points.map((point, index) => {
                // <Point position={[0, 0, 0]} />
                // let position = [point[1], point[2] * -1, point[0]]
                if (index % quality === 0) {
                    let position = [point[1], (point[2] * -1) - 50, point[0]]
                    return (
                        <Point position={position} />
                        // <Point position={point} />
                    )
                }

            })}
            <OrbitControls/>
        </Canvas>
        )

};
