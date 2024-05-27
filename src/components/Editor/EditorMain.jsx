import { useState, useEffect } from 'react'
import { Router, Routes, Route, useNavigate, useLocation  } from 'react-router-dom';
import EditorArrSection from './editorPaths/EditorArrSection';
import EditorStrSection from './editorPaths/EditorStrSection';
import EditorNewCV from './editorPaths/EditorNewCV';
import { useGlobalContext } from '../../utils/GlobalContext';

export default function Editor() {
  const { saveCV, userData, saveStagingCV, initializeStagingCV } = useGlobalContext();
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const navigate = useNavigate();

  // Defines an array of routes in the desired order
  const routes = [
    '/editor',
    'basic-info',
    'skills',
    'experience',
    'education',
    'other',
  ];

  // Function to calculate the next route
  const goToNextRoute = () => {
    const nextIndex = currentRouteIndex + 1;
    if (nextIndex < routes.length) {
      setCurrentRouteIndex(nextIndex);
      navigate(routes[nextIndex]);
    }
  };

  // Function to calculate the previous route
  const goToPreviousRoute = () => {
    const previousIndex = currentRouteIndex - 1;
    if (previousIndex >= 0) {
      setCurrentRouteIndex(previousIndex);
      navigate(routes[previousIndex]);
    }
  };

  const handleSaveCV = () => {
    saveCV();
    // setCurrentRouteIndex(0);
    navigate('/myCVs');
  }

  const handleSaveProgress = async () => {
    await saveStagingCV();
    // setCurrentRouteIndex(0);
    navigate('/myCVs');
  }

  const setInitialTemplate = async () => {
    await initializeStagingCV();
    setCurrentRouteIndex(0);
    navigate('/editor');
  }


  return (
    <div className="col editor-main">
        <Routes>
            <Route path="/" element={<EditorNewCV key="/editor" setIndex={() => setCurrentRouteIndex(0)} />} />
            <Route path="basic-info" element={<EditorStrSection key="basic-info" setIndex={() => setCurrentRouteIndex(1)} section="basic info" elements={["title", "summary"]} />} />
            <Route path="skills" element={<EditorArrSection key="skills" setIndex={() => setCurrentRouteIndex(2)} section={"skills"} />} />
            <Route path="experience" element={<EditorArrSection key="experience" setIndex={() => setCurrentRouteIndex(3)} section={"experience"} />} />
            <Route path="education" element={<EditorArrSection key="education" setIndex={() => setCurrentRouteIndex(4)} section={"education"} />} />
            <Route path="other" element={<EditorStrSection key="other" setIndex={() => setCurrentRouteIndex(5)} section="other" elements={["other"]} />} />
        </Routes>

        {(currentRouteIndex > 0) && (currentRouteIndex < 5) && (
          <div className='editor-secondary-btn-div d-md-none mt-5 text-center'>
            <button 
              name="savePr" 
              className="btn btn-secondary m-1"
              onClick={handleSaveProgress}
            >{"Save Progress"}
            </button>
            <button 
              name="init" 
              className="btn btn-secondary m-1"
              onClick={setInitialTemplate}
            >{"Restore Template"}
            </button>
          </div>
        )}


        {(currentRouteIndex > 0) && (currentRouteIndex < 5) && (
          <div className="editor-navBlock d-flex d-md-none justify-content-center">
            <button 
              name="previous" 
              className="btn btn-secondary previous"
              onClick={goToPreviousRoute}
            >{"<"}
            </button>
            <button 
              name="next" 
              className="btn btn-secondary next"
              onClick={goToNextRoute}
            >{">"}
            </button>
            {/*<button className="btn btn-primary save">SAVE</button>*/}
          </div>
        )}
        {(currentRouteIndex === 5) && (
          <div className="editor-navBlock d-flex d-md-none justify-content-center">
            <button 
              name="previous" 
              className="btn btn-secondary previous"
              onClick={goToPreviousRoute}
            >{"<"}
            </button>
            <button 
              name="next" 
              className="btn btn-secondary next"
              onClick={handleSaveCV}
            >{"SAVE"}
            </button>
            {/*<button className="btn btn-primary save">SAVE</button>*/}
          </div>
        )}
    </div>
  );
}
