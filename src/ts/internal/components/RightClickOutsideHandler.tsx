import React from "react";
import { rightClickProps } from "../../types/types";

export function RightClickOutsideHandler({
  contextItems,
  mouseEvent,
  time,
  groupId,
  onClickEvent,
}: rightClickProps): React.JSX.Element {
  return (
    <div
      style={{
        position: "absolute",
        top: mouseEvent.clientY,
        left: mouseEvent.clientX,
        backgroundColor: "white",
        border: "1px solid black",
        zIndex: 1000,
      }}
      className="dash-rct-right-click-menu"
    >
      {contextItems.map((item, index) => (
        <div
          key={index}
          onClick={() => onClickEvent(item)}
          className="dash-rct-right-click-menu-option"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
