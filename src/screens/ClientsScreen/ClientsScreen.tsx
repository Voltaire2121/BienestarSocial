import { useEffect, useState } from 'react'
import { useClients } from '../../services/firebase'
import './ClientScreen.css'
import ReactTable from '../../components/ReactTable/react-table'
import HoverButton from '../../components/HoverButton/hover-button'
import NewUserForm from '../../components/NewUserForm/new-user-form'
import Client from '../../classes/Client'
import { useAuth } from '../../services/firebase'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import { FaUsers } from 'react-icons/fa'
import { FaUserCheck } from 'react-icons/fa'
import { FaDollarSign } from 'react-icons/fa'

const ClientScreen = () => {
  const [showUserForm, setShowUserForm] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<Client | undefined>(
    undefined,
  )
  const [showStatistics, setShowStatistics] = useState(false)

  const clientList = useClients().clients

  const { totalClients, principalClients, secondaryClients, activeClients } =
    useClients()
  const clientType = useAuth().userEmail?.includes('ventas')
    ? 'salesman'
    : 'admin'

  useEffect(() => {
    if (clientType === 'salesman') setShowUserForm(true)
  }, [clientType])

  useEffect(() => {
    if (clientList.length === 0) return
  }, [clientList])

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
    <div className="main-div-users">
      {clientType === 'admin' && (
        <>
          <h1 className="title">Usuarios</h1>
          <p
            className="stats-text"
            onClick={() => setShowStatistics(!showStatistics)}
          >
            {showStatistics ? 'Esconder estadísticas' : 'Mostrar estadísticas'}
          </p>
        </>
      )}
      {clientType === 'admin' && showStatistics && (
        <div className="statistics">
          <div className="inner-stats">
            <FaUsers className="icon" />
            <span className="quantity">{totalClients}</span>
            <span className="stats-text">Usuarios</span>
          </div>
          <div className="inner-stats">
            <FaUserCheck className="icon" />
            <span className="quantity">{principalClients}</span>
            <span className="stats-text">Principales</span>
          </div>
          <div className="inner-stats">
            <FamilyRestroomIcon className="icon" />
            <span className="quantity">{secondaryClients}</span>
            <span className="stats-text">Beneficiarios</span>
          </div>
          <div className="inner-stats">
            <FaDollarSign className="icon" />
            <span className="quantity">{activeClients}</span>
            <span className="stats-text">Activos</span>
          </div>
        </div>
      )}

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
        closePressed={() => {
          setShowUserForm(false)
          setClientToEdit(undefined)
        }}
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
