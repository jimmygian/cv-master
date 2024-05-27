import { useEffect, useRef } from 'react';
import '../editor.css';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../../utils/GlobalContext';


export default function EditorNewCV() {
  // const { userLoggedIn, currentUser } = useAuth();
  // const { setText, userData, setUserData, hideEditorOptions, setHideEditorOptions } = useGlobalContext();
  const { setText, userData, setUserData, setHideEditorOptions } = useGlobalContext();
  const value = userData.stagingCVTitle;

  const navigate = useNavigate();
  const inputRef = useRef(null); // Create a ref for the input element

  // Hide editor Selections
  useEffect(()=> {
    // props.setIndex();
    setHideEditorOptions(true);
  }, [setHideEditorOptions])

  useEffect(() => {
    console.log(userData)
  }, [userData])

  // LOGIC for submit
  function handleGetStarted(e) {
    e.preventDefault();
    if (value) {
      console.log('Title value inserted:', value);
      navigate('basic-info');
    } else {
      console.log('No Title value inserted!');
    }
  }


  return (
    <form onSubmit={(e) => handleGetStarted(e)} className="d-flex flex-column editor-NewCV text-center justify-content-center align-items-center">
      <h3 className='m-5'> Lets create your new CV!</h3>
      <div className='container-fluid input-div mb-3 p-0 d-flex '>
        <label className='col-3 col-sm-2' htmlFor="CVTitle">Title :</label>
        <input
          ref={inputRef} // Assign the ref to the input element
          name='CVTitle'
          className='col'
          value={value}
          onChange={(event) => setText({ event, setState: setUserData })}
          id="username"
          type="text"
        />
      </div>
      <button className='btn btn-get-started' type="submit">GET STARTED</button>
    </form>
    // <h1>EditorNewCV</h1>
  );
}
