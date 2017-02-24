import React from 'react'
import toSpaceCase from 'to-space-case'
import store from 'store'

import Dialog from 'material-ui/Dialog'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'

export default class Evaluation extends React.Component {
  state = {
    error: null
  }

  componentWillMount () {
    this.initialState = this.props
  }

  onChange = name => (ev, idx, value) => {
    this.props.mutateMe({[name]: value || ev.target.value})
  }

  checkDone = () => {
    const { score, moveToNextRound } = this.props.evaluation
    return (score && moveToNextRound)
      ? this.props.done()
      : this.setState({error: 'Please fill in all of the required fields'})
  }

  cancel = () => this.props.cancelAndRestore(this.initialState)

  render () {
    const {
      round, score, districtScore, moveToNextRound, evaluator, evaluatorName
    } = this.props.evaluation

    const actions = [
      <RaisedButton style={{margin: 10}}
        key='cancel' onClick={this.cancel} secondary={true} label="Cancel"/>,
      <RaisedButton style={{margin: 10}}
        key='done' onClick={this.checkDone} primary={true} label="Done"/>
    ]

    const cannotEdit = evaluator && evaluator[0] !== store.get('evaluator').id

    return (
      <Dialog title='Add Evaluation' open={true} modal={true}
        actions={actions}
      >
        {this.state.error &&
          <span style={{color: 'red'}}>{this.state.error}</span>
        }

        <br/>
        <br/>

        {`Evaluation performed by ${
          (evaluator && evaluatorName)
            ? evaluatorName
            : 'you'
        }`}

        <br/>
        <br/>

        {cannotEdit && `Only ${evaluatorName} can edit this evalution`}

        <div>
          <SelectField
            value={round}
            onChange={this.onChange('round')}
            floatingLabelText='Round'
            disabled={cannotEdit}
          >
            {['R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map(opt => (
              <MenuItem value={opt} primaryText={opt} key={opt} />
            ))}
          </SelectField>
        </div>

        <div>
          <SelectField
            value={(score || '').toString()}
            onChange={this.onChange('score')}
            floatingLabelText='Score'
            disabled={cannotEdit}
          >
            {'12345'.split('').map(opt => (
              <MenuItem value={opt} primaryText={opt} key={opt} />
            ))}
          </SelectField>
        </div>

        <div>
          <SelectField
            value={districtScore}
            onChange={this.onChange('districtScore')}
            floatingLabelText='District Score'
            disabled={cannotEdit}
          >
            {'1234'.split('').map(opt => (
              <MenuItem value={opt} primaryText={opt} key={opt} />
            ))}
          </SelectField>
        </div>

        <div>
          <SelectField
            value={moveToNextRound}
            onChange={this.onChange('moveToNextRound')}
            floatingLabelText='Move To Next Round'
            disabled={cannotEdit}
          >
            {'Yes No Hold'.split(' ').map(opt => (
              <MenuItem value={opt} primaryText={opt} key={opt} />
            ))}
          </SelectField>
        </div>

      </Dialog>
    )
  }
}
