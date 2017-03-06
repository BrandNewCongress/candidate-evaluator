import '../lib/tap-event'
import LogIn from '../components/LogIn'
import React from 'react'
import Router from 'next/router'
import axios from 'axios'
import muiTheme from '../bnc-theme'
import store from 'store'

import CircularProgress from 'material-ui/CircularProgress'
import Create from 'material-ui/svg-icons/content/create'
import IconButton from 'material-ui/IconButton'
import { List, ListItem } from 'material-ui/List'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
// import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader'

const coreUrl = () => window.location.href.includes('localhost')
  ? 'http://localhost:8080/'
  : 'https://api.brandnewcongress.org/'

const baseUrl = () => `${coreUrl()}person/`

export default class EvaluationForm extends React.Component {
  state = {
    byName: true,
    error: null,
    loading: false,
    settingEvaluator: true,
    todo: [],
    done: []
  }

  componentWillMount () {
    const evaluator = store.get('evaluator')
    if (evaluator) {
      this.state.settingEvaluator = false
      this.getAssignments()
    }
  }

  getAssignments = () => {
    this.setState({loading: true})

    const params = new URLSearchParams()
    params.append('name', store.get('evaluator').name)

    Promise.all([
      axios.get(`${coreUrl()}assignments/todo?${params.toString()}`),
      axios.get(`${coreUrl()}assignments/done?${params.toString()}`)
    ])
    .then(([todo, done]) => {
      const update = {loading: false}

      if (done.data)
        update.done = done.data
      else
        update.error = 'Could not load completed assignments'

      if (todo.data) {
        update.todo = todo.data
        store.set('queue', todo.data)
      } else
        update.error = 'Could not load assignments that need to be completed'

      this.setState(update)
    })
    .catch(error => this.setState({error}))
  }

  render() {
    const {
      byName, loading, error, settingEvaluator, todo, done
    } = this.state

    const myId = (me => me ? me.id : null)(store.get('evaluator'))

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {settingEvaluator
          ? (
              <LogIn close={() => {
                this.getAssignments()
                this.setState({settingEvaluator: false})
              }} />
            )
          : (
              <Paper style={{
                height: '100%', width: '100%', display: 'flex',
                flexDirection: 'column', padding: 10
              }}>
                <Subheader>{`Hey ${store.get('evaluator').name}!`}</Subheader>
                <RaisedButton
                  label={`Not ${store.get('evaluator').name}?`}
                  style={{display: 'inline-block'}}
                  secondary={true}
                  onClick={() => this.setState({settingEvaluator: true})}
                />
                {loading && <CircularProgress />}
                <Subheader>Evaluations you've been assigned</Subheader>
                <List>
                  {todo
                    .sort((a,b) => new Date(a.dateCreated) - new Date(b.dateCreated))
                    .map(a => (
                      <ListItem
                        primaryText={a.name}
                        onClick={() => window.location.pathname = `/${a.id}`}
                        rightIcon={<Create />}
                      />
                  ))}
                </List>
                <Subheader> Evaluations you've already completed</Subheader>
                <List>
                  {done
                    .sort((a,b) => new Date(b.dateCreated) - new Date(a.dateCreated))
                    .map(a => (
                      <ListItem
                        primaryText={a.name}
                        onClick={() => window.location.pathname = `/${a.id}`}
                        rightIcon={<Create />}
                      />
                  ))}
                </List>
              </Paper>
            )
        }
      </MuiThemeProvider>
    )
  }
}
