import {
  getStorage,
  connectStorageEmulator,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  type UploadResult,
  type UploadTask,
  type UploadMetadata,
} from 'firebase/storage'
import { app } from './config'

export const storage = getStorage(app)

const isEmulatorMode = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'

if (isEmulatorMode) {
  connectStorageEmulator(storage, 'localhost', 9199)
}

// Storage paths
export const STORAGE_PATHS = {
  USER_AVATARS: 'avatars',
  PROJECT_FILES: 'projects',
  AI_GENERATED: 'ai-generated',
  ASSETS: 'assets',
  UPLOADS: 'uploads',
} as const

// File upload operations
export const uploadFile = async (
  path: string,
  file: File | Blob,
  metadata?: UploadMetadata
): Promise<UploadResult> => {
  const storageRef = ref(storage, path)
  return uploadBytes(storageRef, file, metadata)
}

export const uploadFileWithProgress = (
  path: string,
  file: File | Blob,
  metadata?: UploadMetadata
): UploadTask => {
  const storageRef = ref(storage, path)
  return uploadBytesResumable(storageRef, file, metadata)
}

export const uploadUserAvatar = async (userId: string, file: File) => {
  const path = `${STORAGE_PATHS.USER_AVATARS}/${userId}`
  return uploadFile(path, file, {
    contentType: file.type,
    customMetadata: {
      userId,
      uploadedAt: new Date().toISOString(),
    },
  })
}

export const uploadProjectFile = async (
  projectId: string,
  fileName: string,
  file: File | Blob,
  userId: string
) => {
  const path = `${STORAGE_PATHS.PROJECT_FILES}/${projectId}/${fileName}`
  return uploadFile(path, file, {
    contentType: file.type || 'application/octet-stream',
    customMetadata: {
      projectId,
      userId,
      uploadedAt: new Date().toISOString(),
    },
  })
}

export const uploadAsset = async (
  fileName: string,
  file: File | Blob,
  userId: string
) => {
  const path = `${STORAGE_PATHS.ASSETS}/${userId}/${fileName}`
  return uploadFile(path, file, {
    contentType: file.type || 'application/octet-stream',
    customMetadata: {
      userId,
      uploadedAt: new Date().toISOString(),
    },
  })
}

// Download operations
export const getFileDownloadURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

export const getUserAvatarURL = async (userId: string): Promise<string> => {
  const path = `${STORAGE_PATHS.USER_AVATARS}/${userId}`
  return getFileDownloadURL(path)
}

// File management
export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path)
  return deleteObject(storageRef)
}

export const listFiles = async (path: string) => {
  const storageRef = ref(storage, path)
  const result = await listAll(storageRef)
  return result.items
}

export const getFileMetadata = async (path: string) => {
  const storageRef = ref(storage, path)
  return getMetadata(storageRef)
}

export const updateFileMetadata = async (
  path: string,
  metadata: UploadMetadata
) => {
  const storageRef = ref(storage, path)
  return updateMetadata(storageRef, metadata)
}

// Project file operations
export const listProjectFiles = async (projectId: string) => {
  const path = `${STORAGE_PATHS.PROJECT_FILES}/${projectId}`
  return listFiles(path)
}

export const deleteProjectFile = async (
  projectId: string,
  fileName: string
) => {
  const path = `${STORAGE_PATHS.PROJECT_FILES}/${projectId}/${fileName}`
  return deleteFile(path)
}

export const getProjectFileURL = async (
  projectId: string,
  fileName: string
) => {
  const path = `${STORAGE_PATHS.PROJECT_FILES}/${projectId}/${fileName}`
  return getFileDownloadURL(path)
}

// Utility functions
export const createStorageRef = (path: string) => ref(storage, path)

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = new Date().getTime()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const nameWithoutExtension = originalName.replace(`.${extension}`, '')
  return `${nameWithoutExtension}_${timestamp}_${randomSuffix}.${extension}`
}

export type { UploadResult, UploadTask, UploadMetadata }
