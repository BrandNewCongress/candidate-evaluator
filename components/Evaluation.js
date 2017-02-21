import React from 'react'
import toSpaceCase from 'to-space-case'

import Dialog from 'material-ui/Dialog'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'

export default class Evaluation extends React.Component {
  componentWillMount () {
    this.initialState = this.props
  }

  onChange = name => (ev, idx, value) => {
    this.props.mutateMe({[name]: value || ev.target.value})
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
        key='done' onClick={this.props.done} primary={true} label="Done"/>
    ]

    return (
      <Dialog title='Add Evaluation' open={true} modal={true}
        actions={actions}
      >

        {`Evaluation performed by ${
          (evaluator && evaluatorName)
            ? evaluatorName
            : 'you'
        }`}

        <div>
          <SelectField
            value={round}
            onChange={this.onChange('round')}
            floatingLabelText='Round'
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
          >
            {'123456789'.split('').map(opt => (
              <MenuItem value={opt} primaryText={opt} key={opt} />
            ))}
          </SelectField>
        </div>

        <div>
          <SelectField
            value={districtScore}
            onChange={this.onChange('districtScore')}
            floatingLabelText='District Score'
          >
            {'123456789'.split('').map(opt => (
              <MenuItem value={opt} primaryText={opt} key={opt} />
            ))}
          </SelectField>
        </div>

        <div>
          <SelectField
            value={moveToNextRound}
            onChange={this.onChange('moveToNextRound')}
            floatingLabelText='Move To Next Round'
          >
            {'Yes No Hold Reevaluate'.split(' ').map(opt => (
              <MenuItem value={opt} primaryText={opt} key={opt} />
            ))}
          </SelectField>
        </div>

      </Dialog>
    )
  }
}
