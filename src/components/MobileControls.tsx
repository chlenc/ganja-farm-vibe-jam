import styled from "@emotion/styled";
import { Joystick } from "react-joystick-component";
import type { Dispatch, SetStateAction } from "react";

import type { MobileControls } from "./Game";

interface MobileControlsProps {
  setMobileControlState: Dispatch<SetStateAction<MobileControls>>;
}

export default function MobileControlButtons({
  setMobileControlState,
}: MobileControlsProps) {
  const handleMove = (event: any) => {
    const { x, y } = event;
    if (x < -0.5) {
      setMobileControlState("left");
    } else if (x > 0.5) {
      setMobileControlState("right");
    } else if (y < -0.5) {
      setMobileControlState("down");
    } else if (y > 0.5) {
      setMobileControlState("up");
    } else {
      setMobileControlState("none");
    }
  };

  const handleStop = () => {
    setMobileControlState("none");
  };

  return (
    <Root>
      <Joystick
        size={100}
        baseColor="#ac7339"
        stickColor="#65401a"
        move={handleMove}
        stop={handleStop}
      />
    </Root>
  );
}

const Root = styled.div`
  position: fixed;
  bottom: 80px;
  right: 80px;
  height: 100px;
  opacity: 0.5;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
