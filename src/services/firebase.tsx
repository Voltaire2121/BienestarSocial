// Import the functions you need from the SDKs you need
import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import {
  getDatabase,
  ref,
  onValue,
  set,
  DataSnapshot,
  remove,
  get,
  update,
} from 'firebase/database'
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth'
import Client from '../classes/Client'
import firebaseConfig from './firebase-config'
import { checkClientStatus } from '../utils/clients'

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [totalClients, setTotalClients] = useState(0)
  const [principalClients, setPrincipalClients] = useState(0)
  const [secondaryClients, setSecondaryClients] = useState(0)
  const [activeClients, setActiveClients] = useState(0)
  const [mainClientsIds, setMainClientsIds] = useState<string[]>([])

  useEffect(() => {
    if (clients.length === 0) return
    let totalTemp = 0
    let totalPrincipalTemp = 0
    let totalSecondaryTemp = 0
    let totalActiveTemp = 0
    clients.forEach((client) => {
      totalTemp++
      if (client.type === 'Principal') totalPrincipalTemp++
      if (client.type === 'Beneficiario') totalSecondaryTemp++
      if (checkClientStatus(client.last_payment).status === 'Activo')
        totalActiveTemp++
    })
    setTotalClients(totalTemp)
    setPrincipalClients(totalPrincipalTemp)
    setSecondaryClients(totalSecondaryTemp)
    setActiveClients(totalActiveTemp)
  }, [clients])

  useEffect(() => {
    const databaseRef = ref(database, 'Clients/')

    const handleValueChange = (snapshot: DataSnapshot) => {
      const clientsArray: Client[] = []
      const mainClientsIds: string[] = []
      snapshot.forEach((childSnapshot) => {
        const {
          name = '',
          creation_date = '',
          last_edit_date = '',
          type = '',
          address = '',
          city = '',
          region = '',
          email = '',
          telephone = '',
          birthdate = '',
          other_data = '',
          lastname = '',
          main_user_id = '',
          last_payment = '',
          beneficiaries = [],
          created_by = '',
          pets_number = '0',
          pets_names = '',
          id_type = '',
          notes = '',
        } = childSnapshot.val()

        clientsArray.push(
          new Client(
            childSnapshot.key,
            name,
            creation_date,
            last_edit_date,
            type,
            address,
            city,
            region,
            email,
            telephone,
            birthdate,
            other_data,
            lastname,
            main_user_id,
            last_payment,
            beneficiaries,
            created_by,
            pets_number,
            pets_names,
            id_type,
            notes,
          ),
        )
        if (type === 'Principal') {
          mainClientsIds.push(childSnapshot.key)
        }
      })
      setClients(clientsArray)
      setMainClientsIds(mainClientsIds)
    }

    const unsubscribe = onValue(databaseRef, handleValueChange)

    return () => unsubscribe()
  }, [])

  return {
    clients,
    mainClientsIds,
    totalClients,
    principalClients,
    secondaryClients,
    activeClients,
  }
}

export const uploadClient = async (client: Client) => {
  const database = getDatabase(app)
  const clientRef = ref(database, `Clients/${client.client_id}`)

  try {
    await set(clientRef, client)
  } catch (error) {
    throw error
  }
}

export const updateClientField = async (
  clientId: string,
  fieldName: keyof Client,
  fieldValue: any,
) => {
  const database = getDatabase(app)
  const clientFieldRef = ref(database, `Clients/${clientId}`)

  try {
    await update(clientFieldRef, { [fieldName]: fieldValue })
    console.log(
      `Client ${clientId}'s ${fieldName} has been updated to ${fieldValue}.`,
    )
  } catch (error) {
    console.error(`Error updating client ${clientId}'s ${fieldName}:`, error)
  }
}

export const deleteClient = async (clientId: string) => {
  const database = getDatabase(app)
  const clientRef = ref(database, `Clients/${clientId}`)

  try {
    await remove(clientRef)
    console.log(`Client with ID ${clientId} has been deleted successfully.`)
  } catch (error) {
    console.error('Error deleting client:', error)
  }
}

export const addBeneficiary = async (
  clientId: string,
  beneficiaryId: string,
) => {
  const database = getDatabase(app)
  const clientRef = ref(database, `Clients/${clientId}/beneficiaries`)

  try {
    const snapshot = await get(clientRef)

    let beneficiaries: string[] = []
    if (snapshot.exists()) {
      beneficiaries = snapshot.val()
    }
    if (!beneficiaries.includes(beneficiaryId)) {
      beneficiaries.push(beneficiaryId)
    }
    await set(clientRef, beneficiaries)
    console.log(
      `Beneficiary with ID ${beneficiaryId} added to client ${clientId} successfully.`,
    )
  } catch (error) {
    console.error('Error adding beneficiary:', error)
  }
}

interface FirebaseAuthError extends Error {
  code: string
}

export const userLogin = async (email: string, password: string) => {
  const auth = getAuth(app)
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )
    return userCredential.user
  } catch (error) {
    const firebaseError = error as FirebaseAuthError
    console.log(firebaseError)
    switch (firebaseError.code) {
      case 'auth/invalid-credential':
        alert('Correo electronico/Password incorrecto')
        break
      case 'auth/user-not-found':
        alert('User not found. Please check your email address.')
        break
      default:
        console.error('An unexpected error occurred:', error)
        break
    }
  }
}

export const userLogout = async () => {
  const auth = getAuth(app)
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

interface AuthState {
  isLoggedIn: boolean
  userEmail: string | null
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    userEmail: null,
  })
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setAuthState({ isLoggedIn: true, userEmail: user.email })
      } else {
        setAuthState({ isLoggedIn: false, userEmail: null })
      }
    })

    return unsubscribe
  }, [auth])

  return authState
}
