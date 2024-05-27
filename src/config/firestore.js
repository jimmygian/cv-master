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

const createUserDocument = async (user) => {
  if (!user) return;
  console.log("User Exists!");

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
    console.log(err.code)
    console.error("Error writing document: ", err);
  }
};


const getUserStagingCV = async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  const stagingCVCollectionRef = collection(userDocRef, 'stagingCV'); 

  const tasksQuerySnapshot = await getDocs(stagingCVCollectionRef);

  let stagingCV = [];

  tasksQuerySnapshot.forEach((doc) => {
  // console.log(doc.id, " => ", doc.data());
  stagingCV.push(doc.data())
});

return stagingCV;
}

const getUserCVs = async (userId) => {
  const cvsCollectionRef = collection(db, 'CVs');
  const q = query(cvsCollectionRef, where('userId', '==', userId));

  const querySnapshot = await getDocs(q);

  const userCVs = []; // Array to store CVs 
  querySnapshot.forEach((doc) => {
    userCVs.push({
      id: doc.id,
      ref: doc.ref, // Adds the document reference
      ...doc.data()
    }); 
  });

  return userCVs; 
};

const storeNewCV = async (data, userId) => {
  try {
    let CVcollection;
    let ref;

    CVcollection = collection(db, 'CVs');
    ref = await addDoc(CVcollection, data);
    return ref;
  } catch (err) {
    console.error(err)
  }
}

const storeStagingCV = async (data, userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const stagingCVCollectionRef = collection(userDocRef, 'stagingCV'); 
    
    // Get all documents in the subcollection (should be only one)
    const snapshot = await getDocs(stagingCVCollectionRef);

    if (snapshot.size === 0) {
      console.log("No documents found in subcollection");
      return; // Nothing to delete
    }

    // Since you know there's only one document, use the first doc
    const docToDelete = snapshot.docs[0];
    // await docToDelete.ref.delete();
    
    const updatedData = {
      ...data
    }

    await updateDoc(docToDelete.ref, updatedData);

    return;
  } catch (err) {
    console.error(err)
  }
}

const modifyCV = async (type="delete", ref, userId) => {

  // Store CV Data in "data" var.
  const data = await getCVData(ref);


  if (type === "delete") {
    await deleteDoc(ref);
    console.log("DELETED")
  } else if (type === "modify") {
    try {
      await storeStagingCV(data, userId);
    } catch (error) {
      console.error(error);
    }
    
    
  } else if (type === "duplicate") {
    if (data) {
      const collectionRef = collection(db, 'CVs');

      await addDoc(collectionRef, {
        ...data,
        CVTitle: `${data.CVTitle}_dup`
      })
    }
    console.log("DUPLICATED")
  }

  async function getCVData(docRef) {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        const data = docSnap.data(); // This holds the data to be duplicated
        return data;
      } else {
        console.log("Document not found");
        return null; // Handle case where document doesn't exist
      }
    } catch (err) {
      console.error("Error getting document:", err);
      return null; // Handle errors
    }
  }
};

export {
  createUserDocument,
  getUserCVs, 
  getUserStagingCV, 
  storeNewCV, 
  storeStagingCV,
  modifyCV,
};