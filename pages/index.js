import '../lib/tap-event'
import Router from 'next/router'
import axios from 'axios'
import store from 'store'
import Person from '../components/Person'
import Nominations from '../components/Nominations'
import Evaluations from '../components/Evaluations'

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'

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
    settingEvaluator: null
  }

  changed = []

  getId = () => {
    return (Router.router && Router.router.query) ? Router.router.query.id : null
  }

  componentWillMount () {
    this.state.homepage = this.getId() == null
    this.state.evaluator = store.get('evaluator')
    this.state.settingEvaluator = this.state.evaluator == null
  }

  setError = error => this.setState({
    error: error.response.data.message,
    submitting: false,
    loading: false
  })

  handlePerson = person => {
    if (person.data) {
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
    const { person, error, submitting, homepage, loading, evaluator, settingEvaluator } = this.state

    return (
      <MuiThemeProvider>
        {loading || homepage
          ? homepage
            ? (
                <div style={{
                  height: '100%',
                  width: '100%',
                  transform: 'translate(50vw, 50vh)'
                }}>
                  You're at the homepage!
                </div>
              )
            : (
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
                {!settingEvaluator
                  ? (
                      <Paper>
                        <Card expanded={true}>
                          <CardHeader
                            title={`${person.name} - ${person.district}`}
                            subtitle={`Status: ${person.nominationStatus}`}
                          />
                          <CardActions>
                            <RaisedButton style={{width: '140px'}} onClick={this.switchEvaluator}> Switch Evaluator </RaisedButton>
                            <RaisedButton onClick={this.reset} secondary={true} >Reset All</RaisedButton>
                            <RaisedButton onClick={this.submit} primary={true} >Submit</RaisedButton>
                          </CardActions>
                          <CardText>
                            {`Currently evaluating as ${evaluator.name}`}
                            {submitting && <CircularProgress />}
                            <span style={{color: 'red'}}>
                              {error}
                            </span>
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
