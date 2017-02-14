import Router from 'next/router'
import axios from 'axios'
import { StyleSheet, css } from 'aphrodite'
import {Button, Card} from 'belle'
import bootstrapify from '../lib/bootstrapify'
import transform from '../lib/transform'
import Multi from '../components/Multi'
import Evaluations from '../components/Evaluations'
import Addresses from '../components/Addresses'
import fields from '../config'
import TextField from '../components/TextField'

bootstrapify()

const baseUrl = 'http://localhost:8080/person/'

const styles = StyleSheet.create({
  column: {
    display: 'inline-block',
    padding: '10px',
    verticalAlign: 'top'
  },
  left: {
    width: '55%'
  },
  right: {
    width: '35%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

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
        const t = transform.in(person.data)
        this.setState({
          person: t,
          loading: false
        })
      } else {
        this.setState({ error: 'There was an error loading that person' })
      }
    })
  }

  submit = data => {
    const fields = []
    const datas = []
    const validations = []

    for (let r in this.refs) {
      const [fieldName, data, validationPromise] = this.refs[r].report()
      if (data && (data.value || data.values)) {
        fields.push(fieldName)
        datas.push(data)
        validations.push(validationPromise)
      }
    }

    Promise.all(validations)
    .then(valids => {
      if (valids.every(v => v)) {
        const update = transform.out(datas.reduce((acc, data, idx) =>
          Object.assign({[fields[idx]]: data.value || data.values}, acc)
        , {}))

        console.log(update)
        axios.put(baseUrl + Router.router.query.id, update)
        .then(ok => this.setState({saved: true}))
        .catch(err => this.setState({error: err}))
      }
    })
    .catch(err => {
      this.setState({error: err})
    })
  }

  render() {
    const { person, error, loading } = this.state

    if (loading) {
      return (
        <div>
          Loading...
        </div>
      )
    } else {
      return (
        <div>
          <Card className={css(styles.header)}>
            <div>
              {`${person.name} - ${person.district}`}
              <br/>
              {`Status: ${person.nominationStatus}`}
            </div>
            <div>
              <Button style={{marginRight: 10}} primary onClick={this.submit}>
                Submit Evaluation
              </Button>
              <Button onClick={() => window.location.reload()}>
                Reset All
              </Button>
            </div>
          </Card>

          <div className={css(styles.form)}>
            <div className={css(styles.column, styles.left)}>
              {fields.slice(0, 5).map(this.renderField)}
            </div>

            <div className={css(styles.column, styles.right)}>
              {fields.slice(5).map(this.renderField)}
            </div>

          </div>
        </div>
      )
    }
  }

  renderField = (config) => ['evaluations', 'addresses'].includes(config.name)
    ? this.renderSpecial(config)
    : config.multi
      ? ( <Multi {...config}
          key={config.name}
          values={this.state.person[config.name]}
          ref={config.name} /> )
      : ( <TextField {...config}
          key={config.name}
          value={this.state.person[config.name]}
          ref={config.name} /> )

  renderSpecial = (config) => {
    const Field = {
      evaluations: Evaluations,
      addresses: Addresses
    }[config.name]

    return (
      <Field {...config} key={config.name}
        values={this.state.person[config.name]}
        ref={config.name}
       />
    )
  }
}
