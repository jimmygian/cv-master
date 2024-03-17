import {
  getDocs,
  getDoc,
  collection,
  setDoc,
  addDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { initialStaging } from "../utils/defaultValues";

export const createUserDocument = async (user) => {
  if (!user) return;

  try {
    const userDocRef = doc(db, "users", `${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log("User already exists. Not creating doc.");
    } else {
      const userData = {
        username: user.displayName,
        signupDate: new Date(),
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        name: "",
        surname: "",
        dob: "",
      };

      await setDoc(userDocRef, userData);
      console.log("New User doc successfully created!");

      // Add the sub-collection
      const stagingCVCollectionRef = collection(userDocRef, 'stagingCV');
      await addDoc(stagingCVCollectionRef, initialStaging); 
      console.log('New User "stagingCV" sub-collection added!');

    }
  } catch (err) {
    console.error("Error writing document: ", err);
  }
};


export const getUserStagingCV = async (userId) => {
  const projectDocRef = doc(db, 'users', userId);
  const stagingCVCollectionRef = collection(projectDocRef, 'stagingCV'); 

  const tasksQuerySnapshot = await getDocs(stagingCVCollectionRef);

  let stagingCV = [];

  tasksQuerySnapshot.forEach((doc) => {
  // console.log(doc.id, " => ", doc.data());
  stagingCV.push(doc.data())
});

return stagingCV;
}

export const getUserCVs = async (userId) => {
  const cvsCollectionRef = collection(db, 'CVs');
  const q = query(cvsCollectionRef, where('userId', '==', userId));

  const querySnapshot = await getDocs(q);

  const userCVs = []; // Array to store CVs 
  querySnapshot.forEach((doc) => {
    userCVs.push({
      id: doc.id,
      ...doc.data()
    }); 
  });

  return userCVs; 
};

export const addToDB = async (path, data, type="add") => {
  try {
    let refDoc;
    let ref;
    if (type === 'add') {
      refDoc = collection(db, 'CVs');
      ref = await addDoc(refDoc, data);
    } else {
      refDoc = doc(db, ...path);
      ref = await setDoc(refDoc, data);
    }
    return ref;
  } catch (err) {
    console.error(err)
  }
}