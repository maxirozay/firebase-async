import { connectFunctionsEmulator } from 'firebase/functions'

export function start (functions) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
}
