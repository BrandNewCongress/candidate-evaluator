import React from 'react'
import '../lib/tap-event'
import Router from 'next/router'
import axios from 'axios'
import store from 'store'
import URLSearchParams from 'url-search-params'
import Person from '../components/Person'
import Nominations from '../components/Nominations'
import Evaluations from '../components/Evaluations'
import muiTheme from '../bnc-theme'

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'

if (typeof window !== 'undefined') window.URLSearchParams = URLSearchParams

const baseUrl = () => window.location.href.includes('localhost')
  ? 'http://localhost:8080/person/'
  : 'https://api.brandnewcongress.org/person/'

export default class EvaluationForm extends React.Component {
  state = {
    homepage: true,
    evaluator: null,
    person: {},
    error: null,
    loading: true,
    submitting: false,
    settingEvaluator: null,
    noProfileError: false
  }

  changed = []

  getId = () => {
    return window && window.location.pathname ? window.location.pathname.split('/')[1] : null
  }

  backHome = () => {
    const base = window.location.href.split('/')
    const next = base.slice(0, base.length - 1)
    window.location.href = next.join('/')
  }

  componentWillMount () {
    this.state.evaluator = store.get('evaluator')
    this.state.settingEvaluator = this.state.evaluator == null
  }

  setError = error => this.setState({
    error: error.response
      ? error.response.data.message
      : JSON.stringify(error),
    submitting: false,
    loading: false
  })

  handlePerson = person => {
    console.log(person)
    if (person && person.data) {
      this.changed = []
      this.setState({
        person: person.data,
        loading: false,
        submitting: false,
        error: null
      })
    } else {
      this.setError('Could not load person')
    }
  }

  componentDidMount(props) {
    axios.get(baseUrl() + this.getId())
    .then(this.handlePerson)
    .catch(this.setError)
  }

  switchEvaluator = () => {
    store.clear()
    this.setState({
      evaluator: null,
      settingEvaluator: true
    })
  }

  reset = () => window.location.reload()

  submit = () => {
    const myId = store.get('evaluator').id

    const profileRequired = (
      this.state.person.evaluations.filter(ev =>
        ev.id == undefined
      ).length > 0
    )

    if (profileRequired && !this.changed.includes('profile'))
      return this.setState({noProfileError: true})

    this.setState({submitting: true})

    axios.put(baseUrl() + this.getId(), this.getUpdateObject())
    .then(person => {
      let history = store.get('history') || []

      history.unshift({
        id: this.getId(),
        name: this.state.person.name,
        dateCreated: Date.now()
      })

      store.set('history', history)

      if (profileRequired) {
        let queue = store.get('queue')
        let next
        if (queue) {
          queue = queue.filter(p => p.id != this.getId())
          next = queue[0]
        }

        if (next) {
          store.set('queue', queue)
          const split = window.location.href.split('/')
          const base = split.slice(2, 3)
          window.location.href = 'https://' + base + '/' + next.id
        } else {
          this.backHome()
        }
      } else {
        this.handlePerson(person)
      }
    })
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
    const {
      person, error, submitting, loading, evaluator, settingEvaluator,
      noProfileError
    } = this.state

    const alertButton = (
      <RaisedButton primary={true} onClick={() => this.setState({noProfileError: false})}>
        Ok
      </RaisedButton>
    )

    const alert1 = noProfileError && (
      <Dialog open={true} onRequestClose={() => this.setState({noProfileError: false})}
        actions={[alertButton]}
      >
        Please edit the nominee's profile with either a summary of their qualifications, or a note about the lack thereof
      </Dialog>
    )

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {loading
          ? (
              <div style={{
                height: '100%',
                width: '100%',
                transform: 'translate(50vw, 50vh)'
              }}>
                <CircularProgress />
              </div>
            )
          : (
              <div>
                {alert1}
                {!settingEvaluator
                  ? (
                      <Paper>
                        <Card expanded={true}>
                          <CardHeader
                            title={
                              <span>
                                {person.name}  – {person.addressPlainText ? person.addressPlainText.replace(/"/g, '') : ''}
                                <span>(
                                  <a href='https://airtable.com/shrTgt2cTXY8uPBhL' target='_blank'>
                                    {Array.isArray(person.district) && person.district[0]
                                      ? `${person.district[0].stateAbbreviation[0]} ${person.district[0].congressionalDistrictCode}`
                                      : `Unknown district`
                                    }
                                  </a>)
                                </span>
                              </span>
                            }
                            subtitle={(<span>Status: {person.nominationStatus}<br/>Source:{person.source}</span>)}
                          />
                          <CardActions>
                            <RaisedButton style={{width: '140px'}}
                              onClick={this.backHome}
                            >
                              Return to List
                            </RaisedButton>
                            <RaisedButton style={{width: '140px'}} onClick={this.switchEvaluator}> Switch Evaluator </RaisedButton>
                            <RaisedButton onClick={this.reset} secondary={true} >Reset All</RaisedButton>
                            <RaisedButton onClick={this.submit} primary={true} >Submit</RaisedButton>
                          </CardActions>
                          <CardText>
                            {`Currently evaluating as ${evaluator.name}`}
                            {submitting && <CircularProgress />}
                            {error
                              ? (<span style={{color: 'red'}}> <br/> {error} </span>)
                              : null
                            }
                          </CardText>
                        </Card>
                        <br />
                        <Person {...person} mutate={this.mutate} />
                        <br />
                        <Nominations nomations={person.nominations} mutate={this.mutate} />
                        <br />
                        <Evaluations evaluations={person.evaluations} mutate={this.mutate} />
                      </Paper>
                    )
                  : (
                      <Dialog open={true}
                        actions={[
                          <RaisedButton primary={true} label='Find Me' onClick={() => {
                            const params = new URLSearchParams()
                            params.append('name', this.refs.name.input.value)

                            axios.get(`${baseUrl()}byname?${params.toString()}`)
                            .then(found => {
                              if (found) {
                                store.set('evaluator', {id: found.data.id, name: found.data.name})
                                this.setState({
                                  evaluator: {id: found.data.id, name: found.data.name},
                                  settingEvaluator: false,
                                  error: null
                                })
                              }
                            })
                            .catch(err => {
                              this.setState({error: 'Not found - make sure you type your name exactly right'})
                            })
                          }}/>
                        ]}
                      >
                        Hey, who is evaluating right now? (Write your name)
                        <br />
                        <TextField id='name' ref='name' />
                        <span style={{color: 'red'}}>{error}</span>
                      </Dialog>
                    )
                }
              </div>
            )
        }
      </MuiThemeProvider>
    )
  }
}
