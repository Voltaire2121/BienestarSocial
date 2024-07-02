import { useEffect, useState } from 'react'
import { useClients } from '../../services/firebase'
import './ClientScreen.css'
import ReactTable from '../../components/ReactTable/react-table'
import HoverButton from '../../components/HoverButton/hover-button'
import NewUserForm from '../../components/NewUserForm/new-user-form'
import Client from '../../classes/Client'
import { useAuth } from '../../services/firebase'

const ClientScreen = () => {
  const [showUserForm, setShowUserForm] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<Client | undefined>(
    undefined,
  )

  const clientList = useClients().clients
  const clientType = useAuth().userEmail?.includes('ventas')
    ? 'salesman'
    : 'admin'

  useEffect(() => {
    if (clientType === 'salesman') setShowUserForm(true)
  }, [clientType])

  const mangeEditPressed = (clientId: string) => {
    for (const client of clientList) {
      if (client.client_id === clientId) {
        setClientToEdit(client)
        setShowUserForm(true)
        break
      }
    }
  }

  return (
    <div className="main-div">
      {clientType === 'admin' && <h1 className="title">Usuarios</h1>}
      {clientList.length > 0 && clientType === 'admin' && (
        <div className="table-div">
          <div className="inner-table">
            <ReactTable
              renderDataTemp={clientList}
              editClientPressed={mangeEditPressed}
            />
          </div>
        </div>
      )}
      {clientType === 'salesman' && (
        <div className="salesman_div">
          <img
            src="../src/assets/logo_bienestar.png"
            className="salesman_image"
          />
          <h1 className="salesman_h1">ingresar nuevo usuario</h1>
        </div>
      )}
      <div
        style={{
          position: clientType === 'admin' ? 'absolute' : 'unset',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          right: clientType === 'admin' ? 34 : '40%',
          bottom: clientType === 'admin' ? 34 : '45%',
        }}
      >
        <HoverButton
          text="Crear"
          size={clientType === 'salesman' ? 85 : 45}
          onClick={() => setShowUserForm(true)}
        />
      </div>
      <NewUserForm
        isShown={showUserForm}
        closePressed={() => setShowUserForm(false)}
        hidePressed={() => {
          setClientToEdit(undefined)
          setShowUserForm(false)
        }}
        selectedClient={clientToEdit}
      />
    </div>
  )
}

export default ClientScreen
