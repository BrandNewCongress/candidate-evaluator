import '../lib/tap-event'
import React from 'react'
import Router from 'next/router'
import axios from 'axios'
import muiTheme from '../bnc-theme'

import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'

const baseUrl = () => window.location.href.includes('localhost')
  ? 'http://localhost:8080/person/'
  : 'https://api.brandnewcongress.org/person/'

export default class EvaluationForm extends React.Component {
  state = {
    byName: true,
    error: null,
    loading: false
  }

  changed = []

  getId = () => {
    return (Router.router && Router.router.query) ? Router.router.query.id : null
  }

  setError = error => this.setState({
    error: error.response.data.message,
    loading: false
  })

  submit = () => {
    this.setState({submitting: true})

    axios.put(baseUrl() + this.getId(), this.getUpdateObject())
    .then(this.handlePerson)
    .catch(this.setError)
  }

  mutate = value => {
    this.changed = this.changed.concat(Object.keys(value))
    Object.assign(this.state.person, value)
    this.forceUpdate()
  }

  getUpdateObject = () => {
    const result = {}
    this.changed.forEach(field => result[field] = this.state.person[field])
    return result
  }

  render() {
    const { byName, loading, error } = this.state

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Dialog open={true}
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
                  : axios.get(`${baseUrl()}/${this.refs.id.input.value}`))

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
        </Dialog>
      </MuiThemeProvider>
    )
  }
}
