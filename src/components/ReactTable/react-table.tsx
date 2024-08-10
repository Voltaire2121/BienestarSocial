import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table'
import {
  useSort,
  HeaderCellSort,
} from '@table-library/react-table-library/sort'
import { useTheme } from '@table-library/react-table-library/theme'
import { getTheme } from '@table-library/react-table-library/baseline'
import { useState } from 'react'
import Client from '../../classes/Client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPenToSquare,
  faTrash,
  faMessage,
} from '@fortawesome/free-solid-svg-icons'
import {
  deleteClient,
  updateClientField,
  uploadClient,
} from '../../services/firebase'
import withReactContent from 'sweetalert2-react-content'
import Swal, { SweetAlertResult } from 'sweetalert2'
import './react-table.css'
import { normalizeString } from '../../utils/strings'
import { checkClientStatus } from '../../utils/clients'

type props = {
  renderDataTemp: Client[]
  editClientPressed?: (client_id: string) => void
}

const ReactTable: React.FC<props> = ({ renderDataTemp, editClientPressed }) => {
  const theme = useTheme([
    getTheme(),
    {
      HeaderRow: `
        background-color: #35a836; color: #ffffff;
      `,
      Row: `
        &:nth-of-type(odd) {
          background-color: #35a83620; cursor: pointer;
        }

        &:nth-of-type(even) {
          background-color: #35a83605; cursor: pointer;
        }
      `,
    },
  ])

  const renderData = renderDataTemp.map((clientTemp: Client) => {
    console.log(clientTemp)
    return { ...clientTemp, id: clientTemp.client_id }
  })

  const [search, setSearch] = useState('')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const MySwal = withReactContent(Swal)

  const showDeleteConfirmation = (userId: string, userName: string) => {
    MySwal.fire({
      title: 'Seguro que desea eliminar al usuario:\n' + userName + '?',
      text: 'Esta acción no podrá ser revertida',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      focusConfirm: false,
      cancelButtonColor: '#35a836',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Atrás',
      reverseButtons: true,
    }).then((result: SweetAlertResult<any>) => {
      if (result.isConfirmed) {
        deleteClient(userId)
          .then(() =>
            MySwal.fire(
              'Eliminado!',
              `El usuario ${userName} ha sido eliminado correctamente`,
              'success',
            ),
          )
          .catch(() =>
            MySwal.fire(
              'Error',
              `Hubo un problema eliminando al usuario ${userName}`,
              'error',
            ),
          )
      }
    })
  }

  const showMessagePrompt = async (client: Client) => {
    const result = await MySwal.fire({
      title: 'Agregar comentario',
      text: client.name + ' ' + client.lastname,
      input: 'text',
      inputValue: client.notes,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: 'Borrar',
      cancelButtonText: 'Atrás',
    })
    if (result.isConfirmed) {
      uploadClient({ ...client, notes: result.value })
        .then(() =>
          MySwal.fire(
            'Comentario actualizado!',
            `Se ha actualizado el comentario para el cliente ${client.name} ${client.lastname}`,
            'success',
          ),
        )
        .catch((error) => {
          console.log(error)
        })
      return
    }
    if (result.isDenied) {
      const deletConfirmation = await MySwal.fire({
        title: 'Está seguro de borrar el comentario?',
        text: `Esta accion no podrá ser revertida para el cliente ${client.name} ${client.lastname}`,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: 'red',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Atrás',
      })
      if (deletConfirmation.isConfirmed) {
        uploadClient({ ...client, notes: '' })
          .then(() =>
            MySwal.fire(
              'Comentario eliminado!',
              `Se ha eliminado el comentario del cliente ${client.name} ${client.lastname}`,
              'error',
            ),
          )
          .catch((error) => {
            console.log(error)
          })
        return
      }
    }
  }

  const showDatePicker = async (client: Client) => {
    const result = await MySwal.fire({
      title: 'Actualizar último pago',
      text: client.name + ' ' + client.lastname,
      input: 'date',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      denyButtonText: 'Marcar no pagado',
      preConfirm: (selectedDate_1) => {
        if (!selectedDate_1) {
          MySwal.showValidationMessage('Por favor, selecciona una fecha.')
          return false
        }
        return selectedDate_1
      },
    })
    if (result.isConfirmed) {
      const selectedDate = result.value
      uploadClient({ ...client, last_payment: selectedDate })
        .then(() =>
          MySwal.fire(
            'Último pago actualizado!',
            `El usuario ${client.name} ${client.lastname} ha sido actualizado correctamente`,
            'success',
          ),
        )
        .catch((error) => {
          console.log(error)
        })
      if (client.type === 'Principal') {
        client.beneficiaries.map((beneficiary) =>
          updateClientField(beneficiary, 'last_payment', selectedDate),
        )
      }
    }
    if (result.isDenied) {
      uploadClient({ ...client, last_payment: '' })
        .then(() =>
          MySwal.fire(
            'Marcado como no pagado!',
            `El usuario ${client.name} ${client.lastname} ha sido actualizado correctamente`,
            'success',
          ),
        )
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const showBeneficiaryAlert = () => {
    MySwal.fire(
      'Advertencia!',
      `Los pagos solo pueden ser actualizados desde el cliente principal`,
      'warning',
    )
  }

  const nodes = renderData?.filter(
    (item: Client) =>
      normalizeString(item.name).includes(normalizeString(search)) ||
      normalizeString(item.lastname).includes(normalizeString(search)) ||
      item.client_id.toLowerCase().includes(search.toLowerCase()) ||
      item.telephone.toString().includes(search.toLowerCase()) ||
      normalizeString(item.address).includes(normalizeString(search)) ||
      normalizeString(item.last_payment).includes(normalizeString(search)),
  )

  const data = { nodes }

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        ID: (array) =>
          array.sort((a, b) => a.client_id.localeCompare(b.client_id)),
        NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        TELEPHONE: (array) =>
          array.sort((a, b) => a.telephone.localeCompare(b.telephone)),
        ADDRESS: (array) =>
          array.sort((a, b) => a.address.localeCompare(b.address)),
        TYPE: (array) =>
          array.sort((a, b) => {
            const aPrimaryClientId =
              a.type === 'Principal' ? a.client_id : a.main_user_id
            const bPrimaryClientId =
              b.type === 'Principal' ? b.client_id : b.main_user_id
            if (aPrimaryClientId === bPrimaryClientId) {
              if (a.type === 'Principal') return -1
              if (b.type === 'Principal') return 1
              return 0
            }
            return aPrimaryClientId.localeCompare(bPrimaryClientId)
          }),
        PAYMENT: (array) =>
          array.sort((a, b) => a.last_payment.localeCompare(b.last_payment)),
      },
    },
  )

  function onSortChange() {
    console.log('sorted')
  }

  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const handleExpandRow = (rowId: number) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(rowId)
        ? prevExpandedRows.filter((id) => id !== rowId)
        : [...prevExpandedRows, rowId],
    )
  }

  return (
    <>
      <div className="search-div">
        <label className="search-label">Buscar </label>
        <input className="search-input" onChange={handleSearch} />
      </div>
      <div>
        <Table
          className="table"
          data={data}
          theme={theme}
          sort={sort}
          layout={{ horizontalScroll: true }}
        >
          {(tableList: Client[]) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSort sortKey="ID" resize>
                    Cédula
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="NAME" resize>
                    Nombre
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="TELEPHONE" resize>
                    Teléfono
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="ADDRESS" resize>
                    Dirección
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="TYPE" resize>
                    Tipo usuario
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="PAYMENT" resize>
                    Último pago
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="PAYMENT" resize>
                    Estado
                  </HeaderCellSort>
                  <HeaderCell> </HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => {
                  const { status, color } = checkClientStatus(item.last_payment)
                  const isExpanded = expandedRows.includes(
                    parseInt(item.client_id),
                  )

                  return (
                    <>
                      <Row
                        key={item.client_id}
                        item={{ ...item, id: item.client_id }}
                        onClick={() =>
                          handleExpandRow(parseInt(item.client_id))
                        }
                      >
                        <Cell
                          style={{
                            fontWeight: expandedRows.includes(
                              parseInt(item.client_id),
                            )
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {item.client_id}
                        </Cell>
                        <Cell
                          style={{
                            fontWeight: expandedRows.includes(
                              parseInt(item.client_id),
                            )
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {item.name + ' ' + item.lastname}
                        </Cell>
                        <Cell
                          style={{
                            fontWeight: expandedRows.includes(
                              parseInt(item.client_id),
                            )
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {item.telephone}
                        </Cell>
                        <Cell
                          style={{
                            fontWeight: expandedRows.includes(
                              parseInt(item.client_id),
                            )
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {item.address}
                        </Cell>
                        <Cell
                          style={{
                            fontWeight: expandedRows.includes(
                              parseInt(item.client_id),
                            )
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          {item.type === 'Principal' && <p>{item.type}</p>}
                          {item.type === 'Beneficiario' && (
                            <div className="beneficiary_div">
                              <p>{item.type}</p>
                              <p>{`(${item.main_user_id})`}</p>
                            </div>
                          )}
                        </Cell>
                        <Cell
                          style={{
                            fontWeight: expandedRows.includes(
                              parseInt(item.client_id),
                            )
                              ? 'bold'
                              : 'normal',
                          }}
                          onClick={() =>
                            item.type === 'Principal'
                              ? showDatePicker(item)
                              : showBeneficiaryAlert()
                          }
                        >
                          <p
                            style={{
                              color:
                                item.last_payment === 'Sin pago' ? 'red' : '',
                            }}
                          >
                            {' '}
                            {item.last_payment}
                          </p>
                        </Cell>
                        <Cell
                          style={{
                            fontWeight: expandedRows.includes(
                              parseInt(item.client_id),
                            )
                              ? 'bold'
                              : 'normal',
                          }}
                        >
                          <p style={{ color: color }}>{status}</p>
                        </Cell>
                        <Cell>
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            style={{ marginRight: '10px' }}
                            onClick={() =>
                              editClientPressed
                                ? editClientPressed(item.client_id)
                                : null
                            }
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ marginRight: '10px' }}
                            onClick={() =>
                              showDeleteConfirmation(
                                item.client_id,
                                item.name + ' ' + item.lastname,
                              )
                            }
                          />
                          <FontAwesomeIcon
                            color={item.notes ? 'green' : 'gray'}
                            icon={faMessage}
                            onClick={() => showMessagePrompt(item)}
                          />
                        </Cell>
                      </Row>
                      {isExpanded && (
                        <>
                          <Row item={{ ...item, id: item.client_id }}>
                            <div className=" first-info-div extra-info-div "></div>
                            <div className=" first-info-div extra-info-div extra-info-title">
                              Fecha Creación:
                            </div>
                            <div className="extra-info-div first-info-div">
                              {item.creation_date}
                            </div>
                            <div className="extra-info-div extra-info-title first-info-div">
                              Creado por:
                            </div>
                            <div className="extra-info-div first-info-div">
                              {item.created_by}
                            </div>
                            <div className="extra-info-div"></div>
                            <div className="extra-info-div"></div>
                            <div className="extra-info-div"></div>
                          </Row>
                          <Row item={{ ...item, id: item.client_id }}>
                            <div className="extra-info-div "></div>
                            <div className="extra-info-div extra-info-title">
                              Fecha nacimiento:
                            </div>
                            <div className="extra-info-div">
                              {item.birthdate}
                            </div>
                            <div className="extra-info-div extra-info-title">
                              Email:
                            </div>
                            <div className="extra-info-div">{item.email}</div>
                            <div className="extra-info-div"></div>
                            <div className="extra-info-div"></div>
                            <div className="extra-info-div"></div>
                          </Row>
                          <Row item={{ ...item, id: item.client_id }}>
                            <div className="extra-info-div "></div>
                            <div className="extra-info-div extra-info-title">
                              Tipo documento:
                            </div>
                            <div className="extra-info-div last-info-div">
                              {item.id_type || 'No definido'}
                            </div>
                            <div className="extra-info-div extra-info-title">
                              Mascotas:
                            </div>
                            <div className="extra-info-div">
                              {item.type === 'Principal'
                                ? item.pets_number +
                                  ' ' +
                                  (item.pets_names
                                    ? `(${item.pets_names})`
                                    : '')
                                : '(Ver usuario principal)'}
                            </div>
                            <div className="extra-info-div"></div>
                            <div className="extra-info-div"></div>
                            <div className="extra-info-div"></div>
                          </Row>
                        </>
                      )}
                    </>
                  )
                })}
              </Body>
            </>
          )}
        </Table>
      </div>
    </>
  )
}

export default ReactTable
