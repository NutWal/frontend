import {Canvas, useLoader} from "@react-three/fiber";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
import React, {Suspense, useState} from "react";
import {OrbitControls} from "@react-three/drei";
import { DDSLoader } from "three-stdlib";
import * as THREE from "three";
import {PointsMaterial} from "three";

export const PointsCloudViewer = (props) => {

    THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());


    let points = props.points
    let quality = props.quality

    const SIZE = 0.5
    const NORMAL_OFFSET = 0.1 * 1

    let v = [];
    // let n = [];

    points.map((point, index) => {

        if (index % quality == 0) {
            const sourcePointX = point[1]
            const sourcePointY = (point[2] * -1)
            const sourcePointZ = point[0]

            // передняя стенка
            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            // // передняя нормаль
            // for (let i = 0; i < 6; i++) {
            //     n.push((sourcePointX + sourcePointX + SIZE) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointY + sourcePointY + SIZE) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointZ + sourcePointZ) / 2 + NORMAL_OFFSET)
            // }

            // правая стенка
            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            // // правая нормаль
            // for (let i = 0; i < 6; i++) {
            //     n.push((sourcePointX + SIZE + sourcePointX + SIZE) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointY + sourcePointY + SIZE) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointZ + sourcePointZ + SIZE) / 2 + NORMAL_OFFSET)
            // }

            // левая стенка
            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            // // левая нормаль
            // for (let i = 0; i < 6; i++) {
            //     n.push((sourcePointX + sourcePointX) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointY + sourcePointY + SIZE) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointZ + sourcePointZ + SIZE) / 2 + NORMAL_OFFSET)
            // }

            // задняя стенка
            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            // // задняя нормаль
            // for (let i = 0; i < 6; i++) {
            //     n.push((sourcePointX + SIZE + sourcePointX) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointY + sourcePointY + SIZE) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointZ + SIZE + sourcePointZ + SIZE) / 2 + NORMAL_OFFSET)
            // }

            // верхняя стенка
            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY)
            v.push(sourcePointZ + SIZE)

            // // верхняя нормаль
            // for (let i = 0; i < 6; i++) {
            //     n.push((sourcePointX + SIZE + sourcePointX) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointY + sourcePointY) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointZ + sourcePointZ + SIZE) / 2 + NORMAL_OFFSET)
            // }

            // нижняя стенка
            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX + SIZE)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ)

            v.push(sourcePointX)
            v.push(sourcePointY + SIZE)
            v.push(sourcePointZ + SIZE)

            // // нижняя нормаль
            // for (let i = 0; i < 6; i++) {
            //     n.push((sourcePointX + SIZE + sourcePointX) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointY + SIZE + sourcePointY + SIZE) / 2 + NORMAL_OFFSET)
            //     n.push((sourcePointZ + sourcePointZ + SIZE) / 2 + NORMAL_OFFSET)
            // }
        }

    })

    // const [obj, setObj] = useState(useLoader(OBJLoader, './Elka.obj'))
    // let obj = useLoader(OBJLoader, '/Elka.obj')
    // let obj = useLoader(OBJLoader, 'Apple.obj')
    //
    // console.log('obj', obj)

    const buffergeometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( v );
    // const normals = new Float32Array( n );


    console.log('vertices',vertices)
    // console.log('v',v)

// itemSize = 3 because there are 3 values (components) per vertex
    buffergeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices,3 ) );
    buffergeometry.setAttribute( 'normal', new THREE.BufferAttribute( normals,3 ) );


    // const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const material = new PointsMaterial( { size: 1, sizeAttenuation: true, color: 0xff0000 } );

    const mesh = new THREE.Mesh( buffergeometry, material );


    return (
        // <Canvas camera={{position: [0, 0, 5]}}>
        <Canvas mode="concurrent" camera={{position: [0, 50, 170]}} className="canvas-box" style={{minHeight: 200}}>
            {/*<Suspense fallback={<div>Loading... </div>}>*/}
                {/*<Scene/>*/}
                {/*<primitive object={useLoader(OBJLoader, './Elka.obj')}/>*/}
                <primitive object={mesh}/>


                {/*{points.map((point, index) => {*/}
                {/*    // <Point position={[0, 0, 0]} />*/}
                {/*    // let position = [point[1], point[2] * -1, point[0]]*/}
                {/*    if (index % quality === 0) {*/}
                {/*        let position = [point[1], (point[2] * -1) - 50, point[0]]*/}
                {/*        return (*/}
                {/*            <Point position={position} />*/}
                {/*            // <Point position={point} />*/}
                {/*        )*/}
                {/*    }*/}

                {/*})}*/}
                <OrbitControls/>
            {/*</Suspense>*/}

        </Canvas>
    )

};
