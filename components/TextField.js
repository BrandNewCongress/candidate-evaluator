import React from 'react'
import { TextInput } from 'belle'
import FormField from './FormField'

export default class TextField extends FormField {
  state = {}

  componentWillMount () {
    Object.assign(this.state, this.props)
  }

  report = () => [
    this.state.name,
    Object.assign({}, this.state),
    this.props.schema.isValid(this.state.value)
  ]

  onUpdate = change => this.setState(change)

  render() {
    const style = {marginBottom: '5px'}
    return (
      <div>
        {this.fixedLabel()}
        <TextInput
          placeholder={this.props.label}
          {...this.props}
          onUpdate={this.onUpdate}
          value={this.state.value}
          style={style}
        />
      </div>
    )
  }
}
