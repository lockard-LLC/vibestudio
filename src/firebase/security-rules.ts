// Firebase Security Rules for production deployment
// These rules should be deployed to Firebase console

export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects can be read/written by their owner and collaborators
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid in resource.data.collaborators);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Files belong to projects and follow project permissions
    match /files/{fileId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/projects/$(resource.data.projectId)) &&
        (request.auth.uid == get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.userId ||
         request.auth.uid in get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.collaborators);
    }
    
    // AI contexts are private to the user
    match /ai_contexts/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Sessions are private to the user
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Teams can be read by members, written by admins
    match /teams/{teamId} {
      allow read: if request.auth != null && request.auth.uid in resource.data.members;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.owner || 
         request.auth.uid in resource.data.admins);
    }
    
    // Workspaces follow team permissions
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/teams/$(resource.data.teamId)) &&
        request.auth.uid in get(/databases/$(database)/documents/teams/$(resource.data.teamId)).data.members;
    }
  }
}
`

export const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User avatars - users can only upload their own avatar
    match /avatars/{userId} {
      allow read: if true; // Avatars are publicly readable
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Project files - accessible by project owner and collaborators
    match /projects/{projectId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/(default)/documents/projects/$(projectId)) &&
        (request.auth.uid == firestore.get(/databases/(default)/documents/projects/$(projectId)).data.userId ||
         request.auth.uid in firestore.get(/databases/(default)/documents/projects/$(projectId)).data.collaborators);
    }
    
    // User assets - private to the user
    match /assets/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // AI generated content - accessible by the user who generated it
    match /ai-generated/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // General uploads - private to the user
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`

export const realtimeDatabaseRules = `
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": "auth != null && auth.uid == data.child('userId').val()",
        ".write": "auth != null && auth.uid == data.child('userId').val()"
      }
    },
    "collaborations": {
      "$projectId": {
        ".read": "auth != null && (auth.uid == data.child('owner').val() || data.child('participants').child(auth.uid).exists())",
        ".write": "auth != null && (auth.uid == data.child('owner').val() || data.child('participants').child(auth.uid).exists())"
      }
    },
    "cursors": {
      "$projectId": {
        ".read": "auth != null",
        "$userId": {
          ".write": "auth != null && auth.uid == $userId"
        }
      }
    },
    "presence": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $userId"
      }
    },
    "chat": {
      "$projectId": {
        ".read": "auth != null",
        "messages": {
          ".write": "auth != null"
        }
      }
    },
    "notifications": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    }
  }
}
`

export const deploySecurityRules = () => {
  console.log('Firestore Security Rules:')
  console.log(firestoreRules)
  console.log('\n\nStorage Security Rules:')
  console.log(storageRules)
  console.log('\n\nRealtime Database Security Rules:')
  console.log(realtimeDatabaseRules)
  console.log('\n\nDeploy these rules using Firebase CLI:')
  console.log('firebase deploy --only firestore:rules')
  console.log('firebase deploy --only storage')
  console.log('firebase deploy --only database')
}
