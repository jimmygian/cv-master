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
  import { getUserStagingCV } from '../config/firestore';
  

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


  // // SAVE TO LOCAL STORAGE FUNCTIONALITY

  // // Saves CV to userCV array in localStorage
  // function saveCV() {
  //   // Check if CV Title exists, prompt user if not
  //   const CVTitle = userData.stagingCVTitle || prompt("CV Title?")
  //   if (!CVTitle) {
  //     return;
  //   }

  //   // 1. Create new-CV Object
  //   const newCV = {
  //     title: [CVTitle],
  //     lastModified: new Date(),
  //     data: {
  //       ...userData.stagingCV
  //     }
  //   }

  //   // Update if CV Title exists - TBC

  //   // Update "local" userData
  //   const newUserData = {
  //     ...userData,
  //     userCVs: [
  //       ...userData.userCVs,
  //       newCV
  //     ],
  //     stagingCV: initialStaging,
  //     stagingCVTitle: ''
  //   }
  //   setUserData((prev) => newUserData);

  //   // Update localStorage
  //   updateCVMDatabase(newUserData)
  // }



  // // RUNS ON EVERY APP REFRESH + ON USER CHANGE
  // useEffect(() => {
  //   if (!authenticated) {
  //     console.log("GlobalContext APP REFRESH: Not authenticated. Returning...")
  //     return;
  //   } else {
  //     console.log("GlobalContext APP REFRESH: User authenticated.")
  //   }

  //   const currentUser = getCVMCurrentUser();
  //   let CVMDatabase = getCVMDatabase();

  //   // Create CVMDatabase if it doesn't exist
  //   if (!CVMDatabase) {
  //     console.log("NO DATABASE!, creating..")
  //     updateLocalStorage('CVMDatabase', []);
  //     CVMDatabase = getCVMDatabase();
  //   }

  //   // Check if current user is set
  //   if (!currentUser) {
  //     console.log('User not set. Prompting for login...');
  //     return;
  //   } else {
  //     // User is set, check if user exists in the database
  //     const userExists = CVMDatabase.some(obj => obj.userData.username === currentUser);

  //     if (userExists) {
  //       // User exists, retrieve user data from the database
  //       const userDataFromDB = CVMDatabase.find(obj => obj.userData.username === currentUser);

  //       // Update global state with user data
  //       setUserData(userDataFromDB);
  //     } else {
  //       // User is new, initiate a new stateful object
  //       setUserData({
  //         userData: {
  //           username: currentUser,
  //           signupDate: new Date(),
  //         },
  //         stagingCV: initialStaging,
  //         stagingCVTitle: '',
  //         userCVs: []
  //       });
  //     }
  //   }
  // }, [authenticated]);

  useEffect(() => {
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
        userData: currentUser,
        stagingCV: stagingCV[0],
        stagingCVTitle: '',
      });

    };
    initializeUser();
  }, [currentUser, currentUser?.uid, userLoggedIn])


  // function handleCV(index, type) {
  //   const newCVarr = userData.userCVs;
  //   if (!newCVarr || newCVarr.length <= 0 || index === null) {
  //     console.log("Did not handle CV operation.")
  //     return;
  //   }

  //   if (type === 'remove') {
  //     newCVarr.splice(index, 1);
  //   }

  //   if (type === 'duplicate') {
  //     console.log("It's duplicating CV!")
  //     newCVarr.push(newCVarr[index])
  //   }

  //   if (type === 'modify') {
  //     console.log("CV can be modified in editor!")
  //     setUserData((prev) => {
  //       return {
  //         ...prev,
  //         stagingCV: newCVarr[index].data
  //       }
  //     })
  //   }


  //   setUserData((prev) => {
  //     const newUserData = {
  //       ...prev,
  //       userCVs: newCVarr
  //     }

  //     if (newUserData) {
  //       // Update Local Storage
  //       updateCVMDatabase(newUserData);

  //       return newUserData
  //     } else {
  //       return prev;
  //     }
  //   })

  // }





  return (
    <GlobalContext.Provider value={{
      userData,
      setUserData,
      // getLocalStorage,
      // updateLocalStorage,
      setText,
      // getCVMCurrentUser,
      // getCVMDatabase,
      // updateCVMDatabase,
      // updateCVMCurrentUser,
      // authenticated,
      // setAuthenticated,
      capitalize,
      logout,
      // saveCV,
      hideEditorOptions,
      setHideEditorOptions,
      // handleCV,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
