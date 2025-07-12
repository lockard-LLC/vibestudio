import {
  getDatabase,
  connectDatabaseEmulator,
  ref,
  set,
  get,
  update,
  remove,
  push,
  onValue,
  off,
  serverTimestamp,
  type DataSnapshot,
} from 'firebase/database'
import { app } from './config'

export const realtimeDb = getDatabase(app)

const isEmulatorMode = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'

if (isEmulatorMode) {
  connectDatabaseEmulator(realtimeDb, 'localhost', 9000)
}

// Realtime Database paths
export const DB_PATHS = {
  SESSIONS: 'sessions',
  COLLABORATIONS: 'collaborations',
  CURSORS: 'cursors',
  PRESENCE: 'presence',
  CHAT: 'chat',
  NOTIFICATIONS: 'notifications',
} as const

// Session management
export const createSession = async (sessionId: string, sessionData: any) => {
  const sessionRef = ref(realtimeDb, `${DB_PATHS.SESSIONS}/${sessionId}`)
  return set(sessionRef, {
    ...sessionData,
    createdAt: serverTimestamp(),
    lastActivity: serverTimestamp(),
  })
}

export const updateSession = async (sessionId: string, updates: any) => {
  const sessionRef = ref(realtimeDb, `${DB_PATHS.SESSIONS}/${sessionId}`)
  return update(sessionRef, {
    ...updates,
    lastActivity: serverTimestamp(),
  })
}

export const endSession = async (sessionId: string) => {
  const sessionRef = ref(realtimeDb, `${DB_PATHS.SESSIONS}/${sessionId}`)
  return remove(sessionRef)
}

// Collaboration features
export const joinCollaboration = async (
  projectId: string,
  userId: string,
  userInfo: any
) => {
  const collaborationRef = ref(
    realtimeDb,
    `${DB_PATHS.COLLABORATIONS}/${projectId}/participants/${userId}`
  )
  return set(collaborationRef, {
    ...userInfo,
    joinedAt: serverTimestamp(),
    lastSeen: serverTimestamp(),
  })
}

export const leaveCollaboration = async (projectId: string, userId: string) => {
  const collaborationRef = ref(
    realtimeDb,
    `${DB_PATHS.COLLABORATIONS}/${projectId}/participants/${userId}`
  )
  return remove(collaborationRef)
}

export const updateCursor = async (
  projectId: string,
  userId: string,
  cursorData: any
) => {
  const cursorRef = ref(
    realtimeDb,
    `${DB_PATHS.CURSORS}/${projectId}/${userId}`
  )
  return set(cursorRef, {
    ...cursorData,
    timestamp: serverTimestamp(),
  })
}

export const updatePresence = async (
  userId: string,
  presence: 'online' | 'away' | 'offline'
) => {
  const presenceRef = ref(realtimeDb, `${DB_PATHS.PRESENCE}/${userId}`)
  return set(presenceRef, {
    status: presence,
    lastSeen: serverTimestamp(),
  })
}

// Real-time code synchronization
export const syncCodeChange = async (
  projectId: string,
  fileId: string,
  change: any
) => {
  const changesRef = ref(
    realtimeDb,
    `${DB_PATHS.COLLABORATIONS}/${projectId}/files/${fileId}/changes`
  )
  return push(changesRef, {
    ...change,
    timestamp: serverTimestamp(),
  })
}

export const syncFileContent = async (
  projectId: string,
  fileId: string,
  content: string,
  userId: string
) => {
  const fileRef = ref(
    realtimeDb,
    `${DB_PATHS.COLLABORATIONS}/${projectId}/files/${fileId}`
  )
  return update(fileRef, {
    content,
    lastModifiedBy: userId,
    lastModified: serverTimestamp(),
  })
}

// Chat functionality
export const sendMessage = async (projectId: string, message: any) => {
  const chatRef = ref(realtimeDb, `${DB_PATHS.CHAT}/${projectId}/messages`)
  return push(chatRef, {
    ...message,
    timestamp: serverTimestamp(),
  })
}

// Notifications
export const sendNotification = async (userId: string, notification: any) => {
  const notificationRef = ref(realtimeDb, `${DB_PATHS.NOTIFICATIONS}/${userId}`)
  return push(notificationRef, {
    ...notification,
    timestamp: serverTimestamp(),
    read: false,
  })
}

export const markNotificationRead = async (
  userId: string,
  notificationId: string
) => {
  const notificationRef = ref(
    realtimeDb,
    `${DB_PATHS.NOTIFICATIONS}/${userId}/${notificationId}`
  )
  return update(notificationRef, { read: true })
}

// Subscription helpers
export const subscribeToSession = (
  sessionId: string,
  callback: (data: any) => void
) => {
  const sessionRef = ref(realtimeDb, `${DB_PATHS.SESSIONS}/${sessionId}`)
  const unsubscribe = onValue(sessionRef, snapshot => {
    callback(snapshot.val())
  })
  return unsubscribe
}

export const subscribeToCollaboration = (
  projectId: string,
  callback: (data: any) => void
) => {
  const collaborationRef = ref(
    realtimeDb,
    `${DB_PATHS.COLLABORATIONS}/${projectId}`
  )
  const unsubscribe = onValue(collaborationRef, snapshot => {
    callback(snapshot.val())
  })
  return unsubscribe
}

export const subscribeToCursors = (
  projectId: string,
  callback: (cursors: any) => void
) => {
  const cursorsRef = ref(realtimeDb, `${DB_PATHS.CURSORS}/${projectId}`)
  const unsubscribe = onValue(cursorsRef, snapshot => {
    callback(snapshot.val() || {})
  })
  return unsubscribe
}

export const subscribeToPresence = (callback: (presence: any) => void) => {
  const presenceRef = ref(realtimeDb, DB_PATHS.PRESENCE)
  const unsubscribe = onValue(presenceRef, snapshot => {
    callback(snapshot.val() || {})
  })
  return unsubscribe
}

export const subscribeToChat = (
  projectId: string,
  callback: (messages: any[]) => void
) => {
  const chatRef = ref(realtimeDb, `${DB_PATHS.CHAT}/${projectId}/messages`)
  const unsubscribe = onValue(chatRef, snapshot => {
    const messages = snapshot.val()
    callback(
      messages
        ? Object.entries(messages).map(([id, data]) => ({ id, ...data }))
        : []
    )
  })
  return unsubscribe
}

export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: any[]) => void
) => {
  const notificationsRef = ref(
    realtimeDb,
    `${DB_PATHS.NOTIFICATIONS}/${userId}`
  )
  const unsubscribe = onValue(notificationsRef, snapshot => {
    const notifications = snapshot.val()
    callback(
      notifications
        ? Object.entries(notifications).map(([id, data]) => ({ id, ...data }))
        : []
    )
  })
  return unsubscribe
}

// Generic helpers
export const createRef = (path: string) => ref(realtimeDb, path)
export const setValue = (path: string, value: any) =>
  set(ref(realtimeDb, path), value)
export const getValue = async (path: string) => {
  const snapshot = await get(ref(realtimeDb, path))
  return snapshot.val()
}

export type { DataSnapshot }
