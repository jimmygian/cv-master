import { useState, useEffect } from 'react'
import { Router, Routes, Route, useNavigate, useLocation  } from 'react-router-dom';
import EditorArrSection from './editorPaths/EditorArrSection';
import EditorStrSection from './editorPaths/EditorStrSection';
import EditorNewCV from './editorPaths/EditorNewCV';

export default function Editor() {
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   setCurrentRouteIndex(prev => prev)
  // })

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
          <div className="editor-navBlock d-flex justify-content-center">
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
          <div className="editor-navBlock d-flex justify-content-center">
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
            >{"SAVE"}
            </button>
            {/*<button className="btn btn-primary save">SAVE</button>*/}
          </div>
        )}
    </div>
  );
}
