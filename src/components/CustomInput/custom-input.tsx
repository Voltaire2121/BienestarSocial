import { FormControl, TextField } from '@mui/material'
import './custom-input.css'

type props = {
  inputPlaceholder: string
  showError?: boolean
  onChange: (value: string) => void
  onInputBlur?: () => void
  largeInput?: boolean
  errorText?: string
  inputType?: InputTypes
  value?: string
  listOptions?: string[]
}

type InputTypes = 'text' | 'number' | 'password'

export const CustomInput = ({
  inputPlaceholder,
  showError,
  onChange,
  onInputBlur,
  largeInput,
  errorText,
  inputType,
  value,
  listOptions,
}: props) => {
  const renderList = () => {
    return (
      <datalist id="renderlist">
        {listOptions?.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
    )
  }
  return (
    <FormControl className={largeInput ? 'input-big' : 'input-small'}>
      {!listOptions && (
        <TextField
          error={showError}
          label={inputPlaceholder}
          helperText={showError ? errorText || 'Valor errado!' : ''}
          onChange={(event) => onChange(event.target.value.toString())}
          onBlur={onInputBlur}
          type={inputType || 'text'}
          color="success"
          value={value}
        />
      )}
      {listOptions && (
        <>
          <input
            list="renderlist"
            placeholder={inputPlaceholder}
            onChange={(event) => onChange(event.target.value.toString())}
            onBlur={onInputBlur}
            type={inputType || 'text'}
            value={value}
            className={
              largeInput ? 'input-big input-list' : 'input-small input-list'
            }
          />
          {renderList()}
        </>
      )}
    </FormControl>
  )
}
