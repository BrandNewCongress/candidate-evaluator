import React from 'react'
import { TextInput } from 'belle'
import FormField from './FormField'

export default class PhoneField extends FormField {
  format = number => `(${this.props.value.substring(0, 3)}) ${this.props.value.substring(3, 6)}-${this.props.value.substring(6, 10)}`

  render() {
    let formattedPhone = this.props.value ? this.format(this.props.value) : this.props.value

    return (
      <div>
        {this.fixedLabel()}
        <TextInput
          value={formattedPhone}
          placeholder={this.props.label}
          {...this.props}
          onChange={(event) => {
            let val = event.value.replace(/\D/g, '')
            if (val.length > 10)
              val = val.substring(0, 10)
            this.props.onChange(this.format(val))
          }}
        />
      </div>
    )
  }
}
