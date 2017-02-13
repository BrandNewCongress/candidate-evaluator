import React from 'react'
import Portal from 'react-portal'
import { TextInput, Card, Button } from 'belle'

export default class Evaluation extends React.Component {
  state = {
    value: {
      evaluator: null,
      round: null,
      score: null,
      districtScore: null,
      moveOn: null
    },
    editing: null
  }

  componentWillMount () {
    Object.assign(this.state, this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.state.editing = false
    Object.assign(this.state, nextProps)
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

  renderPreview = ({evaluator, round, score, districtScore, moveOn}) => (
    <Card onClick={() => this.setState({editing: true})}>
      {!round && !evaluator && !score
        ? 'Click to edit!'
        : `by ${evaluator} in ${round}: ${score}`
      }
    </Card>
  )

  renderEditing = ({evaluator, round, score, districtScore, moveOn}) => (
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
      <TextInput value={evaluator} placeholder='Evaluator' onUpdate={this.genOnUpdate('evaluator')} />

      {this.renderLabel('Round')}
      <select style={{width: '90%'}} value={round} onChange={this.selectChange('round')}>
        <option disabled selected value />
        {this.optify('R1')}
        {this.optify('R2')}
        {this.optify('R3')}
        {this.optify('R4')}
        {this.optify('R5')}
        {this.optify('R5')}
      </select>

      {this.renderLabel('Score')}
      <select style={{width: '90%'}} value={score} onChange={this.selectChange('score')}>
        <option disabled selected value />
        {this.optify('1')}
        {this.optify('2')}
        {this.optify('3')}
        {this.optify('4')}
        {this.optify('5')}
        {this.optify('6')}
        {this.optify('7')}
        {this.optify('8')}
        {this.optify('9')}
      </select>

      {this.renderLabel('District Score')}
      <select style={{width: '90%'}} value={districtScore} onChange={this.selectChange('districtScore')}>
        <option disabled selected value />
        {this.optify('1')}
        {this.optify('2')}
        {this.optify('3')}
        {this.optify('4')}
        {this.optify('no')}
      </select>

      {this.renderLabel('Move On To Next Round')}
      <select style={{width: '90%'}} value={moveOn} onChange={this.selectChange('moveOn')}>
        <option disabled selected value />
        {this.optify('Yes')}
        {this.optify('No')}
        {this.optify('Hold')}
        {this.optify('Reevaluate')}
        {this.optify('ni')}
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
