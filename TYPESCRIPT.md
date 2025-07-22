# TypeScript Usage Examples

Here are some examples of how to use firebase-async with TypeScript:

## Basic Setup

```typescript
import { loadConfig, getDB, getAuth, getStorage } from 'firebase-async'
import type { Config } from 'firebase-async'

const config: Config = {
  '[DEFAULT]': {
    app: {
      apiKey: "your-api-key",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      // ... other Firebase config
    },
    firestore: {
      // Firestore specific config
    }
  }
}

loadConfig(config)
```

## Using Firestore with Types

```typescript
import { getDB } from 'firebase-async'
import type { Doc } from 'firebase-async/firestore'

interface User {
  name: string
  email: string
  age: number
}

async function getUserData(): Promise<Doc[]> {
  const db = await getDB(true, true) // full SDK with persistence
  const users = await db.getDocs('users')
  return users
}

async function createUser(userData: User): Promise<void> {
  const db = await getDB()
  await db.set({ data: userData }, 'users')
}
```

## Using Auth

```typescript
import { getAuth } from 'firebase-async'
import type { User } from 'firebase/auth'

async function setupAuth() {
  const auth = await getAuth()
  
  const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
    if (user) {
      console.log('User signed in:', user.uid)
    } else {
      console.log('User signed out')
    }
  })
  
  return unsubscribe
}
```

## Using Storage

```typescript
import { getStorage } from 'firebase-async'

async function uploadImage(file: File): Promise<string> {
  const storage = await getStorage()
  
  const snapshot = await storage.uploadImage(
    file,
    'images/profile',
    300, // height
    300, // width
    0.8, // quality
    'webp' // format
  )
  
  return storage.getDownloadURL(snapshot.ref.fullPath)
}
```

## Type Definitions

The library provides comprehensive TypeScript definitions for all classes and methods:

- `Config` - Configuration interface for Firebase apps
- `Firestore` - Firestore wrapper class with all Firebase methods
- `Storage` - Storage wrapper with image processing capabilities  
- `Auth` - Authentication wrapper
- `Functions` - Cloud Functions wrapper
- `Analytics` - Analytics wrapper

All Firebase SDK types are re-exported for convenience.
