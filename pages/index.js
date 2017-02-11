import yup from 'yup'
import Router from 'next/router'
import axios from 'axios'
import { StyleSheet, css } from 'aphrodite'
import {Button, Card} from 'belle'
import bootstrapify from '../lib/bootstrapify'
import Multi from '../components/Multi'
import TextField from '../components/TextField'
import transform from '../lib/transform'

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
  fields = [
    {
      name: 'emailAddresses',
      multi: true,
      label: 'Email Addresses',
      schema: yup.array().of(yup.string().transform((value) => value.replace(/\s/g, ''))
        .email())
    },
    {
      name: 'phoneNumbers',
      label: 'Phone Numbers',
      multi: true,
      schema: yup.array().of(yup.string())
    },
    {
      name: 'facebook',
      label: 'Facebook',
      schema: yup.string().url()
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      schema: yup.string().url()
    },
    {
      name: 'profile',
      label: 'Profile',
      allowNewLine: true,
      schema: yup.string()
    },
    {
      name: 'otherLinks',
      label: 'Other Links',
      multi: true,
      schema: yup.array().of(yup.string().url())
    },
    {
      name: 'addresses',
      label: 'Addresses',
      multi: true,
      schema: yup.array().of(yup.string())
    },
    {
      name: 'gender',
      label: 'Gender',
      schema: yup.string()
    },
    {
      name: 'race',
      label: 'Race',
      schema: yup.string()
    },
    {
      name: 'politicalParty',
      label: 'Political Party',
      schema: yup.string()
    },
    {
      name: 'religion',
      label: 'Religion',
      schema: yup.string()
    },
    {
      name: 'nominations',
      label: 'Nominations',
      schema: yup.array().of(yup.string())
    },
    {
      name: 'occupations',
      label: 'Occupations',
      schema: yup.string()
    },
    {
      name: 'potentialVolunteer',
      label: 'Potential Volunteer',
      schema: yup.boolean()
    },
    {
      name: 'evaluations',
      label: 'Evaluations',
      multi: true,
      schema: yup.array().of(yup.string())
    }
  ]

  state = {
    person: {},
    error: null,
    loading: true
  }

  componentDidMount(props) {
    axios.get(baseUrl + Router.router.query.id)
    .then(person => {
      if (person.data) {
        const t = transform.in(person.data.fields)
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
      fields.push(fieldName)
      datas.push(data)
      validations.push(validationPromise)
    }

    Promise.all(validations)
    .then(valids => {
      if (valids.every(v => v)) {
        const update = transform.out(datas.reduce((acc, data, idx) =>
          Object.assign({[fields[idx]]: data.value || data.values}, acc)
        , {}))

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
            <Button primary onClick={this.submit}>
              Submit Evaluation
            </Button>
          </Card>

          <div className={css(styles.form)}>
            <div className={css(styles.column, styles.left)}>
              {this.fields.slice(0, 5).map(this.renderField)}
            </div>

            <div className={css(styles.column, styles.right)}>
              {this.fields.slice(5).map(this.renderField)}
            </div>

          </div>
        </div>
      )
    }
  }

  renderField = (config) => config.multi
    ? ( <Multi {...config}
        key={config.name}
        values={this.state.person[config.name]}
        ref={config.name} /> )
    : ( <TextField {...config}
        key={config.name}
        value={this.state.person[config.name]}
        ref={config.name} /> )
}
