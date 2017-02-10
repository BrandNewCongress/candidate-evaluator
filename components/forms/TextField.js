import React from 'react'
import { TextInput } from 'belle'
import FormField from './FormField'

export default class TextField extends FormField {
  render() {
    console.log(this.props.value)
    return (
      <div>
        {this.fixedLabel()}
        <TextInput
          placeholder={this.props.label}        
          {...this.props}
          onChange={(event) => {
            this.props.onChange(event.value)
          }}
        />
      </div>
    )
  }
}