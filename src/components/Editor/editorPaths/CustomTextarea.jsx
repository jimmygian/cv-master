import React, { useId, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';


function CustomTextarea(props) {
  const id = useId();
  const textAreaRef = useRef(null)

  function handleChange(event) {
    const text = textAreaRef.current.value;
    props.updateValue(event)
  }


  return (
      <div>
        <TextareaAutosize
          ref={textAreaRef}
          id={`${id}-${props.id ? props.id : ""}`}
          onChange={(event) => handleChange(event)}
          placeholder={props.placeholder || "## Enter markdown text.."}
          className={`editor-textArea ${props.arrBlock && 'editor-textAreaArr'}`}
          value={props.value ? props.value : ""}
          name={props.name}
          draggable={props.draggable || false}
          onDragStart={props.onDragStart}
        />
      </div>

  );
}

export default CustomTextarea;
