import Form from '../components/forms/Form'
import yup from 'yup'
import Router from 'next/router'
import axios from 'axios'

class EvaluationForm extends React.Component {
  state = {
    person: null,
    error: null
  }
  async componentDidMount(props) {
    console.log('router', Router.router.query.id)
    const person = await axios.get(`http://localhost:8080/people/${Router.router.query.id}`)
    if (person.data) {
      this.setState({ person: person.data.fields })
    } else {
      this.setState({ error: 'There was an error loading that person' })
    }
  }

  formSchema = yup.object({
    email: yup.string().transform((value) => value.replace(/\s/g, ''))
      .required()
      .email(),
    phone: yup.string()
  })

  render() {
    if (this.state.loading) {
      return (
        <div>
          Loading...
        </div>
      )
    } else {
      return (
        <div>
          <Form
            schema={this.formSchema}
          >
            <Form.Field
              name='email'
              type='string'
              label='Email'
            />
            <Form.Field
              name='phone'
              type='tel'
              label='Phone'
            />
          </Form>
        </div>
      )
    }
  }
}

export default EvaluationForm