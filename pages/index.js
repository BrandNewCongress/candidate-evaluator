import Form from '../components/forms/Form'
import yup from 'yup'
import Router from 'next/router'
import axios from 'axios'
import { StyleSheet, css } from 'aphrodite'
import {Button, Card} from 'belle'
import bootstrapify from '../lib/bootstrapify'

bootstrapify()

const baseUrl = 'http://localhost:8080/people/'

const styles = StyleSheet.create({
  column: {
    display: 'inline-block',
    padding: '10px'
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

class EvaluationForm extends React.Component {
  state = {
    person: null,
    error: null,
    loading: null
  }

  async componentDidMount(props) {
    console.log('router', Router.router.query.id)
    const person = await axios.get(baseUrl + Router.router.query.id)
    if (person.data) {
      this.setState({ person: person.data.fields })
    } else {
      this.setState({ error: 'There was an error loading that person' })
    }
  }

  fields = [
    {
      name: 'email',
      type: 'string',
      label: 'Email',
      schema: yup.string().transform((value) => value.replace(/\s/g, ''))
        .required()
        .email()
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone',
      schema: yup.string()
    },
    {
      name: 'facebook',
      type: 'string',
      label: 'Facebook',
      schema: yup.string()
    },
    {
      name: 'linkedin',
      type: 'string',
      label: 'LinkedIn',
      schema: yup.string()
    },
    {
      name: 'profile',
      type: 'string',
      label: 'Profile',
      schema: yup.string()
    },
    {
      name: 'gender',
      type: 'string',
      label: 'Gender',
      schema: yup.string()
    },
    {
      name: 'race',
      type: 'string',
      label: 'Race',
      schema: yup.string()
    },
    {
      name: 'politicalParty',
      type: 'string',
      label: 'Political Party',
      schema: yup.string()
    }
  ]

  formSchema = yup.object(this.fields.reduce((acc, field) =>
    Object.assign({[field.name]: field.schema}, acc)
  , {}))

  onSubmit = data => axios.put(baseUrl + Router.router.query.id, data)

  render() {
    let { person, error, loading } = this.state

    // TODO remove dummy data
    if (!person) {
      person = {
        name: 'Saikat Chakrabarti',
        district: 'NY-10',
        status: 'Round 1 - To Be Evaluated'
      }
    }

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
              {`Status: ${person.status}`}
            </div>
            <Button primary >
              Submit Evaluation
            </Button>
          </Card>

          <Form
            schema={this.formSchema}
          >
            <div className={css(styles.column, styles.left)}>
              {this.fields.slice(0, 5).map(this.renderField)}
            </div>

            <div className={css(styles.column, styles.right)}>
              {this.fields.slice(5).map(this.renderField)}
            </div>

          </Form>
        </div>
      )
    }
  }

  renderField (config) {
    return (
      <Form.Field {...config} />
    )
  }
}

export default EvaluationForm
