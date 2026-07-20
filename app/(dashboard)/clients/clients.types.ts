// app/(dashboard)/clients/clients.types.ts

export interface NewClientForm {
  nom: string
  type: 'client' | 'fournisseur'
  email: string
  telephone: string
  ville: string
  pays: string
}

export const defaultForm: NewClientForm = {
  nom: '',
  type: 'client',
  email: '',
  telephone: '',
  ville: '',
  pays: 'Burkina Faso',
}

export const FORM_FIELDS: {
  name: keyof NewClientForm
  label: string
  placeholder: string
  required: boolean
  inputType?: string
}[] = [
  { name: 'nom',       label: 'Nom *',       placeholder: 'Ex: Boutique Aminata', required: true  },
  { name: 'email',     label: 'Email',        placeholder: 'contact@exemple.com',  required: false, inputType: 'email' },
  { name: 'telephone', label: 'Téléphone',    placeholder: '+226 70 12 34 56',     required: false },
  { name: 'ville',     label: 'Ville *',      placeholder: 'Ouagadougou',          required: true  },
  { name: 'pays',      label: 'Pays *',       placeholder: 'Burkina Faso',         required: true  },
]
