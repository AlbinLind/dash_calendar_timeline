import React, { useState } from "react";

import { SelectedItemInfoProps } from "types/types";

export function SelectedItemInfo({
  item,
  setProps,
  selectedItemProps,
  onDelete,
}: SelectedItemInfoProps) {
  if (item == null) {
    return <></>;
  }
  let x = item.mousePosition.x + 5;
  let y = item.mousePosition.y + 5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
      }}
      className="selected-item-info"
    >
      <b>{item.title}</b>
      <button type="button" onClick={() => onDelete(item.id)}>
        🗑
      </button>
      <br />
      Start: {new Date(item.start_time).toLocaleString()}
      <br />
      End: {new Date(item.end_time).toLocaleString()}
      <br />
      Line: {item.group}
      <br />
      {item.hoverInfo && <div dangerouslySetInnerHTML={{ __html: item.hoverInfo }}></div>}
      {/*Dynamically add inputs and update props*/}
      {item.inputs &&
        Object.entries(item.inputs).map(([key, input], index) => {
          return (
            <div key={index}>
              <label htmlFor={input.id}>{key}</label>
              <input
                {...input}
                onChange={(e) => {
                  if (input.onChange) {
                    input.onChange(e);
                  }
                  const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
                  setProps({
                    selectedItemInput: {
                      ...selectedItemProps,
                      [key]: value,
                    },
                  });
                }}
              />
            </div>
          );
        })}
    </div>
  );
}
