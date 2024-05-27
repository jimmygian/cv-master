import { useEffect, useId } from 'react';
import '../editor.css';
import CustomTextarea from './CustomTextarea';
import { useGlobalContext } from '../../../utils/GlobalContext'


export default function EditorStrSection(props) {
    const id = useId();
    const { setText, userData, setUserData, capitalize, setHideEditorOptions } = useGlobalContext();
    const { section, elements, setIndex } = props;
    
   // Hide editor Selections
   useEffect(()=> {
    setIndex();
    setHideEditorOptions(false)
  }, [setHideEditorOptions, setIndex])

    // Create elements from prop's arr
    const render = elements.map((el, index) => {
        const value = userData.stagingCV[el];
        return (
            <div key={`${id}-${index}`}>
            <h5 className="textArea-label">{el}</h5>
            <CustomTextarea   
                name={`${el}`} 
                value={value} 
                id={`${section}-${el}`} 
                updateValue={(event) => setText({event, setState: setUserData})} 
            />
            </div>
        )
    } )

    return (
        <div key={`${id}-${section}`} className="d-block Editor-basicInfo">
            <h3 className='editor-section-title'>{capitalize(section)}</h3>
            {render}
        </div>
    )
}


