import React from 'react'
import toSpaceCase from 'to-space-case'
import Evaluation from './Evaluation'

import {Card, CardHeader, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader'

export default class Nomations extends React.Component {
  state = {
    editing: null
  }

  mutateChild = idx => change => {
    const copy = this.props.evaluations.slice().map(o => Object.assign({}, o))
    Object.assign(copy[idx], change)
    this.props.mutate({evaluations: copy})
  }

  cancel = idx => initialValue => {
    const copy = this.props.evaluations.slice().map(o => Object.assign({}, o))
    Object.assign(copy[idx], initialValue)
    this.state.editing = null
    this.props.mutate({evaluations: copy})
  }

  setEdit = idx => ev => this.setState({editing: this.props.evaluations[idx]})

  newEval = ev => {
    this.state.editing = this.props.evaluations.length
    this.props.mutate({evaluations: this.props.evaluations.concat([{}])})
  }

  render () {
    const evals = this.props.evaluations || []
    const editing = this.state.editing

    return (
      <Paper>
        <div style={{display: 'flex'}}>
          <Subheader> Evaluations </Subheader>
          <RaisedButton primary={true} onClick={this.newEval}> New </RaisedButton>
        </div>

        {evals.map((ev, idx) => (
          <Card>
            <CardHeader
              title={`Recieved a ${ev.score} in ${ev.round}`}
              subtitle={`Move To Next Round: ${ev.moveToNextRound}`}
              onClick={this.setEdit(idx)}
            />
          </Card>
        ))}

        {editing != null &&
          <Evaluation
            evaluation={this.props.evaluations[editing]}
            mutateMe={this.mutateChild(editing)}
            cancelAndRestore={this.cancel(editing)}
          />
        }

      </Paper>
    )
  }
}
