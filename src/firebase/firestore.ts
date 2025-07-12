import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  onSnapshot,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore'
import { app } from './config'

export const db = getFirestore(app)

const isEmulatorMode = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'

if (isEmulatorMode && !db._delegate._databaseId.projectId.includes('demo-')) {
  connectFirestoreEmulator(db, 'localhost', 8080)
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  FILES: 'files',
  SESSIONS: 'sessions',
  AI_CONTEXTS: 'ai_contexts',
  TEAMS: 'teams',
  WORKSPACES: 'workspaces',
} as const

// User operations
export const createUserDocument = async (uid: string, userData: any) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid)
  return setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getUser = async (uid: string) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const updateUser = async (uid: string, data: Partial<DocumentData>) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid)
  return updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Project operations
export const createProject = async (projectData: any) => {
  const projectsRef = collection(db, COLLECTIONS.PROJECTS)
  return addDoc(projectsRef, {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getUserProjects = async (userId: string) => {
  const projectsRef = collection(db, COLLECTIONS.PROJECTS)
  const q = query(
    projectsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateProject = async (
  projectId: string,
  data: Partial<DocumentData>
) => {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)
  return updateDoc(projectRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteProject = async (projectId: string) => {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)
  return deleteDoc(projectRef)
}

// Real-time subscriptions
export const subscribeToProject = (
  projectId: string,
  callback: (data: any) => void
) => {
  const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId)
  return onSnapshot(projectRef, doc => {
    callback(doc.exists() ? { id: doc.id, ...doc.data() } : null)
  })
}

export const subscribeToUserProjects = (
  userId: string,
  callback: (projects: any[]) => void
) => {
  const projectsRef = collection(db, COLLECTIONS.PROJECTS)
  const q = query(
    projectsRef,
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )
  return onSnapshot(q, querySnapshot => {
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(projects)
  })
}

// AI Context operations
export const saveAIContext = async (sessionId: string, context: any) => {
  const contextRef = doc(db, COLLECTIONS.AI_CONTEXTS, sessionId)
  return setDoc(
    contextRef,
    {
      ...context,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export const getAIContext = async (sessionId: string) => {
  const contextRef = doc(db, COLLECTIONS.AI_CONTEXTS, sessionId)
  const contextSnap = await getDoc(contextRef)
  return contextSnap.exists() ? contextSnap.data() : null
}

// Generic query helper
export const queryCollection = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const collectionRef = collection(db, collectionName)
  const q = query(collectionRef, ...constraints)
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp,
}
