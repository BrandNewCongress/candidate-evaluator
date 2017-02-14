import React from 'react'
import Portal from 'react-portal'
import { TextInput, Card, Button } from 'belle'
import states from '../lib/states'

export default class Address extends React.Component {
  state = {
    value: {
      city: 'Hanover',
      state: 'NH'
    }
  }

  statify = props => {
    const copy = Object.assign({}, props)

    for (let key in props.value) {
      const newKey = {
        City: 'city',
        State: 'state'
      }[key]

      if (newKey)
        this.state.value[newKey] = props.value[key]
    }

    delete copy.value
    Object.assign(this.state, copy)
  }

  componentWillMount () {
    this.statify(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.state.editing = false
    this.statify(nextProps)
  }

  getVal = () => Object.assign({}, this.state.value)

  genOnUpdate = field => ({value}) => {
    this.state.value[field] = value
    this.forceUpdate()
  }

  selectChange = field => ({target}) => {
    this.state.value[field] = target.value
    this.forceUpdate()
  }

  optify = val => {
    return (<option value={val}> {val} </option>)
  }

  render () {
    return this.state.editing ? this.renderEditing(this.state.value) : this.renderPreview(this.state.value)
  }

  renderPreview = ({state, city}) => (
    <Card onClick={() => this.setState({editing: true})}>
      {!state && !city
        ? 'Click to edit!'
        : `${city}, ${state}`
      }
    </Card>
  )

  renderEditing = ({state, city}) => (
      <div id='evaluation-modal' style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: '500px',
        height: '350px',
        marginLeft: '-250px',
        marginTop: '-150px',
        borderRadius: '3px',
        backgroundColor: 'white',
        border: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center',
        padding: '10px'
      }}
    >
      <TextInput value={city} placeholder='City/Town' onUpdate={this.genOnUpdate('city')} />

      {this.renderLabel('State')}
      <select style={{width: '90%'}} value={state} onChange={this.selectChange('state')}>
        <option disabled selected value />
        {states.map(this.optify)}
      </select>
      <div>
        <Button style={{width: '100px', marginTop: 20, display: 'inline-block'}} primary
          onClick={_ => this.setState({editing: false})}>
          Done
        </Button>

        <Button style={{width: '150px', float: 'right', marginTop: 20, display: 'inline-block'}}
          onClick={_ => this.props.delete(this.props.idx)}>
          Delete Forever
        </Button>
      </div>
    </div>
  )

  renderLabel = label => (
    <div style={{
      margin: 5,
      paddingBottom: 5,
      fontWeight: 500,
      fontSize: 16,
      fontFamily: 'system-ui'
    }}>
      {label}
    </div>
  )
}
