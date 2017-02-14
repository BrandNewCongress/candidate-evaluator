import React from 'react'
import { Button, Card, TextInput } from 'belle'
import Address from './Address'
import FormField from './FormField'

const fromProps = values => values && values.length > 0
  ? values
  : []

export default class Addresses extends FormField {
  state = {}

  componentWillMount() {
    this.state.name = this.props.name
    this.state.values = fromProps(this.props.values)
  }

  componentWillReceiveProps(nextProps) {
    this.state.values = fromProps(this.props.values)
    this.forceUpdate()
  }

  valIfChanged = () => {
    const values = this.state.values.map((v, idx) => this.refs[idx.toString()].getVal())
    if (JSON.stringify(this.props.values) == JSON.stringify(values))
      return undefined
    else
      return {values}
  }

  report = () => [
    this.state.name,
    this.valIfChanged(),
    this.props.schema.isValid(this.state.values)
  ]

  addOne = () => this.setState({
    values: this.state.values.concat([{}])
  })

  delete = idx => {
    this.state.values = this.state.values.length == 1
      ? [{}]
      : this.state.values.slice(0, idx).concat(this.state.values.slice(idx + 1))

    this.forceUpdate()
  }

  render() {
    const {name, values} = this.state
    return (
      <Card id={name}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 5}}>
          {this.fixedLabel()}
          <Button onClick={this.addOne}> + </Button>
        </div>
        {values.map((v, idx) => (
          <Address
            idx={idx}
            delete={this.delete}
            ref={idx.toString()}
            key={`${name}-${idx}`}
            value={v}
          />
        ))}
      </Card>
    )
  }
}
