import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialStaging } from './defaultValues';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import { useAuth } from './contexts/authContext';



import {
    getLocalStorage,
    updateLocalStorage,
    // getCVMCurrentUser,
    // getCVMDatabase,
    // updateCVMCurrentUser,
  } from './helperLocalStorage';
  import { signOut } from 'firebase/auth';
  import { auth } from '../config/firebase';
  import { getUserStagingCV, storeNewCV, storeStagingCV, modifyCV } from '../config/firestore';
import { getDoc } from 'firebase/firestore';
  

// We are creating / initializing the Context first
const GlobalContext = createContext();


// Provider component
/*
The EditorProvider component is a "provider" for the GlobalContext. 
It provides ALL functions, properties etc.. we want to access on the
wrapped component and its children.
(The children prop is rendered within this provider, 
allowing any components wrapped with EditorProvider 
to access the provided context).
*/
export const GlobalContextProvider = ({ children }) => {
  const { userLoggedIn, currentUser } = useAuth();

  // // Global States
  const [userData, setUserData] = useState(null);
  const [hideEditorOptions, setHideEditorOptions] = useState(false)



  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('CVMCurrentUser');
      cookies.remove("auth-token")
    } catch (err) {
      console.error(err);
    }
  }


  // // Function to update CV-Master DB in localStorage
  // const updateCVMDatabase = (data) => {
  //   if (typeof data !== 'object' || data === null) {
  //     console.Error("Error updating new Data to local Storage. Data should be type: 'object");
  //     return;
  //   }
  //   // Get current Database
  //   let CVMDatabase = getCVMDatabase();

  //   // If Database doesn't exist, create one and push the data in
  //   if (!CVMDatabase) {
  //     CVMDatabase = [data];
  //     localStorage.setItem('CVMDatabase', JSON.stringify(CVMDatabase));
  //     return;
  //   }
  //   // Get current username
  //   const username = getCVMCurrentUser();
  //   if (!username) {
  //     setAuthenticated(false);
  //   }
  //   // Check if username exists in current database
  //   const existingIndex = CVMDatabase.findIndex(obj => obj.userData.username === username);

  //   // If it does, only update that object
  //   if (existingIndex !== -1) {
  //     CVMDatabase[existingIndex] = {
  //       ...CVMDatabase[existingIndex],
  //       ...data
  //     };
  //   } else {
  //     // If no matching username is found, add a new object to the array
  //     CVMDatabase.push(data);
  //   }
  //   localStorage.setItem('CVMDatabase', JSON.stringify(CVMDatabase));
  //   return;
  // };



  // State updaters

  // Sets [name]: value to stateful object
  const setText = ({ event, setState, index }) => {

    const { id, name, value } = event.target;
    const nameArr = name.split('-');

    setState((prev) => {
      if (nameArr.length === 1) {

        // Check if name is 'CVTitle' and handle
        if (nameArr[0] === 'CVTitle') {
          return {
            ...prev,
            stagingCVTitle: value
          }
        }

        return {
          ...prev,
          stagingCV: {
            ...prev.stagingCV,
            [name]: value,
          },
        };
      }

      if (nameArr[1] === "header") {
        return {
          ...prev,
          stagingCV: {
            ...prev.stagingCV,
            [nameArr[0]]: {
              ...prev.stagingCV[nameArr[0]],
              [nameArr[1]]: value,
            },
          },
        };
      }

      if (nameArr[1] === 'item') {
        const updatedArr = [...prev.stagingCV[nameArr[0]][nameArr[0]]];
        updatedArr[index] = value; // Update specific textarea value
        return {
          ...prev,
          stagingCV: {
            ...prev.stagingCV,
            [nameArr[0]]: {
              ...prev.stagingCV[nameArr[0]],
              [nameArr[0]]: updatedArr,
            },
          },
        };
      }
      // Return the previous state if none of the conditions match
      return prev;
    });
  };



  // Helper functions

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  async function saveCV() {
    // Check if CV Title exists, prompt user if not
    const CVTitle = userData.stagingCVTitle || prompt("CV Title?")
    if (!CVTitle) {
      return;
    }

    console.log("CV Saved: ", CVTitle)
    
    const newCVData = {
      ...userData.stagingCV,
      userId: userData.user.uid,
      CVTitle: userData.stagingCVTitle,
    }

    await storeNewCV(newCVData, userData.user.uid);
  }


  function saveStagingCV() {
    storeStagingCV(userData.stagingCV, userData.user.uid);
  }

  function initializeStagingCV() {
    storeStagingCV(initialStaging, userData.user.uid);
    setUserData({
      user: currentUser,
      stagingCV: initialStaging,
      stagingCVTitle: '',
    });
  }



  // DUPLICATE / MODIFY / REMOVE CV function
  async function handleCV(index, type, ref) {
    // Get info
    const userId = userData.user.uid;
    const CV = await getDoc(ref);
    const CVData = CV.data();
    console.log("CV DATA!!: ", CVData);

    // Do operation
    if (type === 'remove') {
      if (window.confirm(`Are you sure you want to delete CV '${CVData.CVTitle}'?`)) {
        await modifyCV("delete", ref, userId);
      }
    }
    
    if (type === 'duplicate') {
      await modifyCV("duplicate", ref, userId);
    }
    
    if (type === 'modify') {
      // await modifyCV("modify", ref, userId); 
      setUserData((prev) => {
        return {
          ...prev,
          stagingCV: CVData,
          stagingCVTitle: CVData.CVTitle,
        }
      });
    }
  }




  // ** ON APP REFRESH ** //
  // ==================== //

  useEffect(() => {
    // Create async function
    const initializeUser = async () => {
      // Check if user is logged in, return if not
      if (!userLoggedIn) {
        console.log("\n\nNO USER LOGGED IN!!");
        console.log("GlobalContext APP REFRESH: Not authenticated. Returning...\n\n\n\n");
      }

      // Console log that user is logged in
      console.log("\n\nUSER IS LOGGED IN");
      console.log("GlobalContext APP REFRESH: User authenticated.\n\n\n\n");


      // Initiate a new stateful object
      const stagingCV = await getUserStagingCV(currentUser.uid);

      setUserData({
        user: currentUser,
        stagingCV: stagingCV[0],
        stagingCVTitle: '',
      });

    };
    // Call async function
    initializeUser();
  }, [currentUser, currentUser?.uid, userLoggedIn])

  // ==================== //



  return (
    <GlobalContext.Provider value={{
      userData,
      setUserData,
      setText,
      capitalize,
      logout,
      saveCV,
      hideEditorOptions,
      setHideEditorOptions,
      saveStagingCV,
      initializeStagingCV,
      handleCV,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
