import { getDocs, getDoc, collection, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const collectionRef = collection(db, "user");

export const getCollectionDocsData = async () => {
  try {
    const data = await getDocs(collectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log("FILTERED DATA", filteredData);
  } catch (err) {
    console.error(err);
  }
};

export const createUserDocument = async (user) => {
    if (!user) return;

    try {
        const userDocRef = doc(db, 'users', `${user.uid}`)
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            console.log('User doc already exists');
        } else {
            const userData = {
                name: user.displayName,
                email: user.email,
                emailVerified: user.emailVerified,
                photoURL: user.photoURL
            };
        
            await setDoc(userDocRef, userData);
            console.log('Document successfully written!')
        }
    } catch (err) {
        console.error('Error writing document: ', err);
    }
}