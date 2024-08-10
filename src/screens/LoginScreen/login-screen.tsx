import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import createTheme from '@mui/material/styles/createTheme'
import { CustomInput } from '../../components/CustomInput/custom-input'
import './login-screen.css'
import 'typeface-roboto'
import { CheckEmail } from '../../utils/strings'
import { Box } from '@mui/material'
import { userLogin } from '../../services/firebase'

const LoginScreen = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const handleEmailBlur = () => {
    setEmailError(!CheckEmail(userName))
  }
  const handlePasswordBlur = () => {
    setPasswordError(password.length < 6)
  }
  const handleLoginPress = () => {
    if (passwordError || emailError) return
    userLogin(userName, password).catch((error: Error) => {
      console.log('nada pa')
      console.log(error)
      //if (error.includes('invalid-credential')) alert('email malo')
    })
  }
  return (
    <div className="main-div-login">
      <div className="main-form">
        <div className="main-form-left">
          <div className="login-div">
            <h1>Acceso</h1>
            <img
              className="logo-small show-when-small"
              src="../src/assets/logo_bienestar.png"
            />
          </div>
          <p className="show-when-small">
            Sistema de gestión y automatización de procesos generales
          </p>
          <div className="email-password">
            <CustomInput
              inputPlaceholder="Correo Electronico"
              onChange={setUserName}
              largeInput
              onInputBlur={handleEmailBlur}
              showError={emailError}
              errorText="Por favor ingrese un correo válido"
            />
            <CustomInput
              inputPlaceholder="Password"
              onChange={setPassword}
              largeInput
              onInputBlur={handlePasswordBlur}
              showError={passwordError}
              errorText="El password debe tener al menos 6 letras"
              inputType="password"
            />
          </div>

          <button className="login-button" onClick={handleLoginPress}>
            ingresar
          </button>
        </div>
        <div className="main-form-right show-when-big">
          <h1>Bienvenido</h1>
          <h2>Bienestar Integral Vital</h2>
          <img className="logo" src="../src/assets/logo_bienestar.png" />
          <p>Sistema de gestión y automatización de procesos generales</p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
