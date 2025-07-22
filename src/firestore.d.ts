import { FirebaseApp } from 'firebase/app'
import { 
  Firestore as FirestoreInstance,
  DocumentReference,
  CollectionReference,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
  AggregateSpec,
  AggregateQuerySnapshot
} from 'firebase/firestore'

export interface FirestoreConfig {
  localCache?: any
  [key: string]: any
}

export interface Doc {
  id?: string
  data: any
  path?: string
}

export class Firestore {
  app: FirebaseApp
  config: FirestoreConfig
  firestore?: FirestoreInstance
  isFull?: boolean
  isPersistant?: boolean

  constructor(app: FirebaseApp, config?: FirestoreConfig)

  loadSDK(loadFull?: boolean, persist?: boolean): Promise<void>
  
  getRef(path: string, id?: string): DocumentReference
  
  get(path: string, id: string): Promise<Doc>
  
  query(path: string, params?: any[], group?: boolean): CollectionReference | Query
  
  getDocs(path: string, params?: any[], group?: boolean): Promise<Doc[]>
  
  countDocs(path: string, params?: any[], group?: boolean): Promise<number>
  
  aggregate(data: AggregateSpec, path: string, params?: any[], group?: boolean): Promise<any>
  
  getItemRef(item: Doc, path?: string): DocumentReference
  
  set(item: Doc, path?: string): Promise<void>
  
  update(item: Doc, data: any, path?: string): Promise<void>
  
  del(item: Doc, path?: string): Promise<void>

  // Firebase Firestore methods (will be dynamically added)
  [key: string]: any
}
