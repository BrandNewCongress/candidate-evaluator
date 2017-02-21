import React from 'react'
import toSpaceCase from 'to-space-case'
import Evaluation from './Evaluation'
import store from 'store'

import {Card, CardHeader, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader'

export default class Evaluations extends React.Component {
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

  done = () => this.setState({editing: null})

  setEdit = idx => ev => this.setState({editing: idx})

  newEval = ev => {
    this.state.editing = (this.props.evaluations || []).length
    this.props.mutate({evaluations: this.props.evaluations.concat([{
      evaluator: [store.get('evaluator').id],
      round: 'R1'
    }])})
  }

  render () {
    const evals = this.props.evaluations || []
    const editing = this.state.editing

    return (
      <Paper>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Subheader> Evaluations </Subheader>
          <RaisedButton primary={true} onClick={this.newEval} style={{
            marginRight: 10
          }}> New </RaisedButton>
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
            done={this.done}
          />
        }

      </Paper>
    )
  }
}
