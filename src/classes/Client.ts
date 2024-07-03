export default class Client {
  client_id: string
  name: string
  lastname: string
  creation_date: string
  last_edit_date: string
  type: string
  address: string
  city: string
  region: string
  email: string
  telephone: string
  birthdate: string
  other_data: string
  main_user_id: string
  last_payment: string
  beneficiaries: string[]
  created_by: string
  pets_number: string
  pets_names: string
  id_type: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, complexity
  constructor(
    client_id: string,
    name: string,
    creation_date: string,
    last_edit_date: string,
    type: string,
    address: string,
    city: string,
    region: string,
    email?: string,
    telephone?: string,
    birthdate?: string,
    other_data?: string,
    lastname?: string,
    main_user_id?: string,
    last_payment?: string,
    beneficiaries?: string[],
    created_by?: string,
    pets_number?: string,
    pets_names?: string,
    id_type?: string,
  ) {
    this.client_id = client_id
    this.name = name
    this.lastname = lastname || ''
    this.creation_date = creation_date
    this.last_edit_date = last_edit_date
    this.type = type
    this.address = address
    this.city = city
    this.region = region
    this.email = email || ''
    this.telephone = telephone || ''
    this.birthdate = birthdate || ''
    this.other_data = other_data || ''
    this.main_user_id = main_user_id || ''
    this.last_payment = last_payment || 'Sin pago'
    this.beneficiaries = beneficiaries || []
    this.created_by = created_by || ''
    this.pets_number = pets_number || '0'
    this.pets_names = pets_names || ''
    this.id_type = id_type || ''
  }
}
