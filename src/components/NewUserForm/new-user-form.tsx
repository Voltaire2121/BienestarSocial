import { Box, FormControl, TextField } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import './new-user.css'
import { theme } from '../../theme'
import { useEffect, useState } from 'react'
import { CustomInput } from '../CustomInput/custom-input'
import Client from '../../classes/Client'
import { getActualFormattedDate } from '../../utils/dates'
import { addBeneficiary, uploadClient } from '../../services/firebase'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { useClients } from '../../services/firebase'
import { useAuth } from '../../services/firebase'
import { normalizeString, toProperCase } from '../../utils/strings'

type props = {
  isShown: boolean
  closePressed: () => void
  hidePressed: () => void
  selectedClient?: Client
}

const NewUserForm: React.FC<props> = ({
  isShown,
  closePressed,
  hidePressed,
  selectedClient,
}) => {
  const [isPrimary, setIsPrimary] = useState(true)
  const innerDivClicked = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
  }
  const [name, setName] = useState(selectedClient?.name || '')
  const [nameError, setNameError] = useState(false)

  const [lastName, setLastName] = useState('')
  const [lastNameError, setLastNameError] = useState(false)
  const [clientId, setClientId] = useState('')
  const [clientIdError, setClientIdError] = useState(false)
  const [idType, setIdType] = useState('')

  const [telephone, setTelephone] = useState('')
  const [telephoneError, setTelephoneError] = useState(false)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)

  const [address, setAddress] = useState('')
  const [addressError, setAddressError] = useState(false)

  const [birthdate, setBirthdate] = useState('')
  const [birthdateError, setBirthdateError] = useState(false)

  const [mainUserId, setMainUserId] = useState('')
  const [mainUserIdError, setMainUserIdError] = useState(false)

  const [petNames, setPetNames] = useState('')
  const [petNumber, setPetnumber] = useState('0')

  const [lastPayment, setLastPayment] = useState('')

  const idTypes = [
    'Cédula de Ciudadanía',
    'Cédula de Extranjería',
    'Tarjeta de Identidad',
    'Registro Civil',
    'Pasaporte',
    'Permiso de Estadía',
  ]

  const MySwal = withReactContent(Swal)

  const mainClientsIds = useClients().mainClientsIds

  const actualUser = useAuth().userEmail

  const checkValues = () => {
    setNameError((name?.length > 0 && name.length < 3) || /\d/.test(name))
    setLastNameError(
      (lastName?.length > 0 && lastName.length < 3) || /\d/.test(lastName),
    )
    setClientIdError(clientId?.length > 0 && clientId.length < 6)
    setTelephoneError(telephone?.length > 0 && telephone.length < 6)
    setAddressError(address?.length > 0 && address.length < 6)
    setEmailError(email.length > 0 && email.length < 10)
    setBirthdateError(birthdate.length > 0 && birthdate.length < 3)
    console.log(mainClientsIds.includes(mainUserId))
    setMainUserIdError(
      !isPrimary &&
        ((mainUserId.length > 0 && mainUserId.length < 6) ||
          (mainUserId.length > 0 && !mainClientsIds.includes(mainUserId))),
    )
  }

  const saveValues = () => {
    if (
      nameError ||
      lastNameError ||
      clientIdError ||
      telephoneError ||
      addressError ||
      emailError ||
      birthdateError ||
      mainUserIdError
    )
      return
    if (name.length === 0) {
      setNameError(true)
      return
    }
    if (lastName.length === 0) {
      setLastNameError(true)
      return
    }
    if (clientId.length === 0) {
      setClientIdError(true)
      return
    }
    if (telephone.length === 0) {
      setTelephoneError(true)
      return
    }
    if (address.length === 0) {
      setAddressError(true)
      return
    }
    if (!isPrimary && mainUserId.length === 0) {
      setMainUserIdError(true)
      return
    }
    if (!idType) {
      alert('Por favior seleccione el tipo de identificación')
      return
    }
    const date = getActualFormattedDate()
    const clientType = isPrimary ? 'Principal' : 'Beneficiario'
    const mainUserIdFinal = isPrimary ? '' : mainUserId
    const clientTemp = new Client(
      clientId,
      toProperCase(normalizeString(name)),
      date,
      date,
      clientType,
      address.trim(),
      'Barranquilla',
      'Atlántico',
      email.trim() || 'No definido',
      telephone,
      birthdate || 'No definido',
      '',
      toProperCase(normalizeString(lastName)),
      mainUserIdFinal,
      lastPayment,
      [],
      actualUser || undefined,
      petNumber || '0',
      petNames,
      idType,
    )
    uploadClient(clientTemp)
      .then(() => {
        if (!isPrimary) addBeneficiary(mainUserId, clientId)
        const action = selectedClient ? 'actualizado' : 'creado'
        resetForm()
        MySwal.fire(
          'Listo!',
          `El usuario ${name} ${lastName} ha sido ${action} correctamente`,
          'success',
        )
      })
      .catch(() => alert('Hubo un error creando al cliente'))
  }

  useEffect(() => {
    if (selectedClient) {
      setName(selectedClient.name)
      setLastName(selectedClient.lastname)
      setClientId(selectedClient.client_id)
      setTelephone(selectedClient.telephone)
      setEmail(selectedClient.email)
      setAddress(selectedClient.address)
      setBirthdate(selectedClient.birthdate)
      setIdType(selectedClient.id_type)
      setPetnumber(selectedClient.pets_number)
      setPetNames(selectedClient.pets_names)
      setLastPayment(selectedClient.last_payment)
      return
    }
    resetForm()
  }, [selectedClient])

  const resetForm = () => {
    setName('')
    setNameError(false)
    setLastName('')
    setLastNameError(false)
    setClientId('')
    setClientIdError(false)
    setTelephone('')
    setTelephoneError(false)
    setEmail('')
    setEmailError(false)
    setAddress('')
    setAddressError(false)
    setBirthdate('')
    setBirthdateError(false)
    setMainUserId('')
    setMainUserIdError(false)
    setIdType('')
    setPetNames('')
    setPetnumber('0')
    setLastPayment('')
  }

  return (
    <div
      className="general-opacity"
      onClick={() => {
        closePressed()
        hidePressed()
      }}
      style={{ display: isShown ? 'flex' : 'none' }}
    >
      <div className="parent-div" onClick={innerDivClicked}>
        <div className="top-line">
          <p className="title" style={{ color: theme.colors.primary }}>
            {selectedClient ? 'Editar Usuario' : 'Registrar Usuario'}
          </p>
          <div className="top-line-buttons">
            <div
              className="top-button"
              onClick={() => setIsPrimary(true)}
              style={{
                backgroundColor: isPrimary ? theme.colors.primary : 'white',
              }}
            >
              <PersonIcon
                style={{ color: isPrimary ? 'white' : 'lightgray' }}
                className="button-icon"
              />
              <p
                style={{
                  fontWeight: isPrimary ? 'bolder' : 'normal',
                  color: isPrimary ? 'white' : 'gray',
                }}
              >
                Titular
              </p>
            </div>
            <div
              className="top-button"
              onClick={() => setIsPrimary(false)}
              style={{
                backgroundColor: isPrimary ? 'white' : theme.colors.primary,
              }}
            >
              <FamilyRestroomIcon
                className="button-icon"
                style={{ color: isPrimary ? 'lightgray' : 'white' }}
              />
              <p
                style={{
                  fontWeight: isPrimary ? 'lighter' : 'bolder',
                  color: isPrimary ? 'gray' : 'white',
                }}
              >
                Beneficiario
              </p>
            </div>
          </div>
        </div>
        <Box
          style={{ marginLeft: -10 }}
          component="form"
          sx={{
            '& > :not(style)': { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <CustomInput
            inputPlaceholder="Nombres*"
            showError={nameError}
            onChange={setName}
            onInputBlur={checkValues}
            errorText="El nombre debe tener al menos tres letras"
            value={name}
          />
          <CustomInput
            inputPlaceholder="Apellidos*"
            showError={lastNameError}
            onChange={setLastName}
            onInputBlur={checkValues}
            errorText="El apellido debe tener al menos tres letras"
            value={lastName}
          />
          <CustomInput
            inputPlaceholder="Tipo de identificación*"
            showError={clientIdError}
            onChange={setIdType}
            value={idType}
            listOptions={idTypes}
          />
          <CustomInput
            inputPlaceholder="Numero de Identificación*"
            showError={clientIdError}
            onChange={setClientId}
            onInputBlur={checkValues}
            errorText="La cédula debe tener al menos 6 numeros"
            value={clientId}
          />
          <CustomInput
            inputPlaceholder="Teléfono*"
            showError={telephoneError}
            onChange={setTelephone}
            onInputBlur={checkValues}
            errorText="El telefono debe tener al menos 6 numeros"
            value={telephone}
          />
          <CustomInput
            inputPlaceholder="Dirección*"
            showError={addressError}
            onChange={setAddress}
            onInputBlur={checkValues}
            errorText="La direccion debe contener al menos 6 letras"
            value={address}
          />
          <CustomInput
            inputPlaceholder="Email"
            showError={emailError}
            onChange={setEmail}
            onInputBlur={checkValues}
            errorText="el Email debe tener al menos 10 letras"
            value={email}
          />
          <FormControl className={'input-small'}>
            <TextField
              error={birthdateError}
              label={'Fecha de nacimiento'}
              helperText={birthdateError ? 'Seleccione una fecha' : ''}
              onChange={(event) => setBirthdate(event?.target.value)}
              type={'date'}
              focused
              color={birthdateError ? 'error' : 'success'}
              onBlur={checkValues}
              value={birthdate}
            />
          </FormControl>
          {!isPrimary && (
            <CustomInput
              inputPlaceholder="Cédula titular*"
              showError={mainUserIdError}
              onChange={setMainUserId}
              errorText={
                mainUserId.length < 6
                  ? 'La cédula del titular debe tener al menos 6 numeros'
                  : 'Cédula del titular no encontrada'
              }
              onInputBlur={checkValues}
              largeInput
              value={mainUserId}
            />
          )}
          {isPrimary && (
            <>
              <CustomInput
                inputPlaceholder="Número de Mascotas"
                inputType="number"
                onChange={setPetnumber}
                value={petNumber}
              />
              <CustomInput
                inputPlaceholder="Nombre Mascotas"
                onChange={setPetNames}
                value={petNames}
              />
            </>
          )}
        </Box>
        <button
          className="submit"
          style={{ background: theme.colors.primary }}
          onClick={saveValues}
        >
          {selectedClient ? 'Editar' : 'Crear'}
        </button>
        <button
          className="submit-secondary"
          onClick={() => {
            closePressed()
            resetForm()
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default NewUserForm
