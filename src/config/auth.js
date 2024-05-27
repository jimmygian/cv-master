import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, updatePassword, sendEmailVerification, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "./firebase";


export const doCreateUserWithEmailAndPassword = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with additional information
        await updateProfile(user, {
        displayName: `${displayName}`, // Combine first and last name
        // You can add other relevant profile fields here (optional)
        });
        return userCredential;
    } catch (err) {
        console.error(err)
    }

    // return createUserWithEmailAndPassword(auth, email, password);
    
};
export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Save user's info in firestore
    // result.user

    return result;
};

export const doSignOut = async () => {
    return auth.signOut();
};


// //////

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// };

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// };

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/myCVs`
    });
};