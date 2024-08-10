export type ClientStatus = {
  status: string
  color: string
}

export const checkClientStatus = (lastPayment: string): ClientStatus => {
  if (lastPayment === 'Sin pago') return { status: 'Inactivo', color: 'red' }
  const today = new Date()
  const lastPaymentDate = new Date(
    parseInt(lastPayment.substring(0, 4)),
    parseInt(lastPayment.substring(5, 7)) - 1,
    parseInt(lastPayment.substring(8)),
  )
  const timeDifference = Math.abs(today.getTime() - lastPaymentDate.getTime())

  // Convert time difference from milliseconds to days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  if (daysDifference > 45) return { status: 'Inactivo', color: 'red' }
  if (daysDifference > 30) return { status: 'Mora', color: '#db9a08' }
  return { status: 'Activo', color: 'darkblue' }
}
