import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export const register = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const logout = async () => await signOut(auth);

export const resetPassword = async (email: string) =>
  await sendPasswordResetEmail(auth, email);

export const updateDisplayName = async (displayName: string) => {
  if (!auth.currentUser) throw new Error('No authenticated user');
  await updateProfile(auth.currentUser, { displayName });
};

export const loginWithGoogle = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
};

