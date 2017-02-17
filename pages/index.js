import '../lib/tap-event'
import Router from 'next/router'
import axios from 'axios'
import Person from '../components/Person'
import Nominations from '../components/Nominations'
import Evaluations from '../components/Evaluations'

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'

const baseUrl = 'http://localhost:8080/person/'

export default class EvaluationForm extends React.Component {
  state = {
    person: {},
    error: null,
    loading: true
  }

  componentDidMount(props) {
    axios.get(baseUrl + Router.router.query.id)
    .then(person => {
      if (person.data) {
        this.setState({
          person: person.data,
          loading: false
        })
      } else {
        this.setState({ error: 'There was an error loading that person' })
      }
    })
  }

  mutate = value => {
    Object.assign(this.state.person, value)
    this.forceUpdate()
  }

  render() {
    const { person, error, loading } = this.state
    return (
      <MuiThemeProvider>
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
                <Paper>
                  <Card>
                    <CardHeader
                      title={`${person.name} - ${person.district}`}
                      subtitle={`Status: ${person.nominationStatus}`}
                    />
                  </Card>
                  <br />
                  <Person {...person} mutate={this.mutate} />
                  <br />
                  <Nominations nomations={person.nominations} mutate={this.mutate} />
                  <br />
                  <Evaluations evaluations={person.evaluations} mutate={this.mutate} />
                </Paper>
              </div>
            )
        }
      </MuiThemeProvider>
    )
  }
}
