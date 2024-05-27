import React, { useState, useEffect, useRef } from 'react';
import '../editor.css';
import CustomTextarea from './CustomTextarea';
import { useGlobalContext } from '../../../utils/GlobalContext';

export default function EditorArrSection(props) {

  // Importing hooks and props
  const { setIndex, section } = props
  const { setText, userData, setUserData, capitalize, setHideEditorOptions } = useGlobalContext();

  const [focusedTextarea, setFocusedTextarea] = useState(null); // State for tracking focused textarea
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  
   // Hide editor Selections
   useEffect(()=> {
    setIndex();
    setHideEditorOptions(false)
  }, [setIndex, setHideEditorOptions])

  // Create section Elements
  const sectionArr = userData.stagingCV[section] ? userData.stagingCV[section][section] : [];
  const sectionEl = sectionArr.map((sectionItem, index) => (
    <div
      key={`${section}-${index}`}
      draggable={true}
      onDragStart={(e) => dragItem.current = index}
      onDragEnter={(e) => dragOverItem.current = index}
      onDragEnd={handleOnDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onFocus={() => setFocusedTextarea(index)}
      className='textAreaArrElWrapper'
    >
        <CustomTextarea
          name={`${section}-item`}
          id={`${section}-item-${index}`}
          value={sectionItem}
          updateValue={(event) => setText({ event, setState: setUserData, index })}
          placeholder={`-**New ${section} Item**`}
          arrBlock={true}
        />
        {focusedTextarea === index && ( // Render Remove button only when the corresponding textarea is focused
          <button onClick={() => removeTextarea(index)} className='editor-removeTextAreaBtn'>
            remove
          </button>
        )}

    </div>
  ))
  
  
  // Drag n Drop functionality
  function handleOnDragEnd(e) {
    handleSort();
  }

  const handleSort = () => {
    let updatedSection = [...sectionArr];
    const draggedItemContent = updatedSection.splice(dragItem.current, 1)[0];
    updatedSection.splice(dragOverItem.current, 0, draggedItemContent);
    setUserData((prev) => {

      return {
        ...prev,
        stagingCV: {
          ...prev.stagingCV,
          [section]: {
            ...prev.stagingCV[section],
            [section]: updatedSection,
          },
        },
      };
    });
  };


  // Textarea functionality
  function addTextarea() {
    setUserData((prev) => {
      const arr = prev.stagingCV[section][section];
      return {
        ...prev,
        stagingCV: {
          ...prev.stagingCV,
          [section]: {
            ...prev.stagingCV[section],
            [section]: [...arr, ['']],
          },
        },
      };
    });
  }

  function removeTextarea(index) {
    const updatedSection = sectionArr.filter((_, i) => i !== index);

    setUserData((prev) => ({
      ...prev,
      stagingCV: {
        ...prev.stagingCV,
        [section]: {
          ...prev.stagingCV[section],
          [section]: updatedSection,
        },
      },
    }));
  }

  // Returns 
  const header = userData.stagingCV[section] ? userData.stagingCV[section].header : `## ${capitalize(section)}`;

  return (
    <div className={`d-block Editor-${section}`}>
      <h3 className='editor-section-title'>{capitalize(section)}</h3>
      <h5 className="textArea-label">header</h5>
      <CustomTextarea 
        key={`${section}-header`}
        name={`${section}-header`} 
        id={`${section}-header`} 
        value={header} 
        updateValue={(event) => setText({ event, setState: setUserData })} />
      <h5 className="textArea-label">{`${section} list`}</h5>
      <div draggable="true" className='draggableArea'>
        {sectionEl}
      </div>
      <button onClick={() => addTextarea()} className={`add${capitalize(section)} editor-addTextAreaBtn`}>
        ADD
      </button>
    </div>
  );
}