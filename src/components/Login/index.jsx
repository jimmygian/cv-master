import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../utils/GlobalContext';
import { useNavigate } from 'react-router-dom';
import './logingood.css'
import Auth from '../Auth';
import { db } from '../../config/firebase';
import { getDocs, collection } from 'firebase/firestore';

export default function Login(props) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(null)
  const { logout, isAuth, setIsAuth, authenticated, updateCVMCurrentUser,  getCVMCurrentUser, capitalize, getCVMDatabase} = useGlobalContext();
  const [defaultSt, setDefaultSt] = useState([]);
  const collectionRef = collection(db, "editorDefault");

  useEffect(() => {
    const getCollectionDocsData = async () => {
      try {
        const data = await getDocs(collectionRef);
        const filteredData = data.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        console.log(filteredData)
      } catch (err) {
        console.error(err)
      }
    };
    getCollectionDocsData();
  }, []);

  const welcomeMessage = "Welcome to CV Master";

  // Get CV Count (if CVs are present in user's DB)
  const currentUser = getCVMCurrentUser() || '';
  const CVMDatabase = getCVMDatabase() || [];
  const userDB = CVMDatabase.filter(DB => DB.userData.username === currentUser);
  const userCVs = userDB.length > 0 ? userDB[0].userCVs : [];
  const userCVsLength = userCVs.length;


  // Ensure URL is correct
  useEffect(() => {
    navigate('./')
  }, [])

  // LOGIC for submit
  function submitUser(e) {
    e.preventDefault()

    if (!inputValue.trim()) {
      return;
    }

    updateCVMCurrentUser(inputValue);
    props.allowUserIn(true);
  }

  function handleChange(e) {
    const { value } = e.target;
    setInputValue(value);
  }


  // NAVIGATION
  function goToCVs() {
    navigate('./myCVs')
  }
  function goToSearch() {
    navigate('./searchJobs')
  }
  function goToEditor() {
    navigate('./editor')
  }





  return (
    <div className='loginCompWrapper'>
      {!authenticated ? (
        <div className='loginWrapper'>
          <h1 className='login-header'>{welcomeMessage}</h1>
          <form className='login-form' onSubmit={(e) => submitUser(e)}>
            <label className='login-label' htmlFor="username">Type your user name:</label>
            <div className='login-inputNbtnContainer'>
              <button className='login-submitBtn' type="submit">Log in</button>
              <input 
                className='login-input' 
                onChange={(e) => handleChange(e)} 
                id="username" 
                type="text" 
                placeholder='Enter username'
              />
            </div>
          </form>
          <Auth />
        </div>
      ) : (
        <>
          { userCVsLength > 0 ? <div className='welcomeWrapper'>
            <h1 className='login-header'>{`Hey, ${capitalize(currentUser)}!`}</h1>

            <h3 className="CVcound">You have created <a className='goToCVsLink'  tabIndex="0" onClick={goToCVs}>{`${userCVsLength} CVs`}</a></h3>

            <div className="container-fluid actionContainer">
              <button onClick={goToEditor} className=" btn welcomeBtn">Create CV</button>
              <button onClick={goToSearch} className=" btn welcomeBtn">Search Jobs</button>
              <button onClick={logout} className=" btn welcomeBtn">Log out?</button>
            </div>
          </div>
          :
          <>
            <h1>{`Welcome, ${capitalize(currentUser)}!`}</h1>
            <h3 className="CVcound">Let's create your first CV!</h3>
            <div className="container-fluid actionContainer">
              <button onClick={goToEditor} className=" btn welcomeBtn">Create CV</button>
              <button onClick={logout} className=" btn welcomeBtn">Log out?</button>
            </div>
          </>
          }
        </>

      )}
    </div>
  )
}