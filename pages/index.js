import '../lib/tap-event'
import LogIn from '../components/LogIn'
import React from 'react'
import Router from 'next/router'
import axios from 'axios'
import muiTheme from '../bnc-theme'
import store from 'store'

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
    assignments: []
  }

  componentWillMount () {
    const evaluator = store.get('evaluator')
    if (evaluator) {
      this.state.settingEvaluator = false
      this.getAssignments()
    }
  }

  getAssignments = () => {
    const params = new URLSearchParams()
    params.append('name', store.get('evaluator').name)

    axios.get(`${coreUrl()}assignments?${params.toString()}`)
    .then(assignments => assignments.data
      ? this.setState({assignments: assignments.data})
      : this.setState({error: 'Could not load assignments'})
    )
    .catch(error => this.setState({error}))
  }

  render() {
    const {
      byName, loading, error, settingEvaluator, assignments
    } = this.state

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
                  style={{width: 200}}
                  onClick={() => this.setState({settingEvaluator: true})}
                />
                <Subheader>Here's the evaluations you've been assigned</Subheader>
                <List>
                  {assignments
                    .sort((a,b) => new Date(a.dateCreated) - new Date(b.dateCreated))
                    .map(a => (
                    <ListItem
                      primaryText={a.name}
                      onClick={() => window.location.pathname = `/${a.id}`}
                      secondaryText={`by ${a.nominator}`}
                      rightIcon={<Create />}
                    />
                  ))}
                </List>
              </Paper>
            )
        }

        {/* <Dialog open={true}
          actions={[
            <RaisedButton primary={true} label='Find Nominee' onClick={async () => {
              const params = new URLSearchParams()
              params.append('name', byName
                ? this.refs.name.input.value
                : this.refs.id.input.value
              )

              try {
                const found = await (byName
                  ? axios.get(`${baseUrl()}byname?${params.toString()}`)
                  : axios.get(`${baseUrl()}${this.refs.id.input.value}`))

                if (found) {
                  const id = found.data.id
                  window.location.pathname = `/${id}`
                }
              } catch (ex) {
                this.setState({error:
                  `Not found - make sure you type the ${byName ? 'name': 'id'} exactly right`})
              }
            }}/>
          ]}
        >
          Hello!
          <br/>
          <br/>
          Please either the exact name OR Airtable ID of the person you would like to evaluate
          <br />
          <br />

          <RadioButtonGroup name='find-method' onChange={(_, value) => this.setState({byName: value == 'byname'})} defaultSelected='byname'>
            <RadioButton
              value='byname'
              label='By Name'
            />
            <RadioButton
              value='byid'
              label='By Airtable ID'
            />
          </RadioButtonGroup>

          {byName
            ? <TextField id='name' ref='name' floatingLabelText={'Enter the Nominee\'s Name'}/>
            : <TextField id='id' ref='id' floatingLabelText={'Enter the Nominee\'s Airtable ID'}/>
          }
          <span style={{color: 'red'}}>{error}</span>
        </Dialog> */}
      </MuiThemeProvider>
    )
  }
}
