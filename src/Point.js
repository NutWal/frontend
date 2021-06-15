import {useFrame} from "@react-three/fiber";
import React, {useRef} from "react";

export const Point = (props) => {
    const ref = useRef();

    // useFrame((state, delta) => (ref.current.rotation.x += 0.01));

    return (
        <mesh {...props} ref={ref}>
            {/*<directionalLight position={[10, 10, 10]} />*/}
            {/*<circleGeometry args={[1, 8, 6]} />*/}
            {/*<sphereGeometry args={[0.5, 8, 6]} />*/}
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            {/*<boxGeometry args={[1, 1, 1]} />*/}
            <meshBasicMaterial color="green" />
        </mesh>
    );
};
