import FormField from './FormField'
import { Card, TextInput } from 'belle'

export default class Multi extends FormField {
  state = {}

  componentWillMount() {
    this.state.name = this.props.name
    this.state.values = this.props.values || ['']
  }

  componentWillReceiveProps(nextProps) {
    this.state.values = this.props.values || ['']
    this.forceUpdate()
  }

  handleKey = idx => ({which}) => {
    if ((which == 8 || which == 46) && this.state.values[idx] == '') {
      if (idx > 0) {
        this.state.values.splice(idx, 1)
        this.forceUpdate()
        setTimeout(() =>
          document.querySelector(`#${this.state.name}-${idx - 1}`).focus()
        , 0)
      }
    }

    if (which == 13) {
      this.state.values.push('')
      this.forceUpdate()
      setTimeout(() =>
        document.querySelector(`#${this.state.name}-${idx + 1}`).focus()
      , 0)
    }
  }

  generateSetter = idx => ({value}) => {
    this.state.values[idx] = value
    this.forceUpdate()
  }

  report = () => [
    this.state.name,
    Object.assign({}, this.state),
    this.props.schema.isValid(this.state.values)
  ]


  render() {
    const {name, values} = this.state

    return (
      <Card id={name}>
        {this.fixedLabel()}
        {values.map((v, idx) => (
          <TextInput
            id={`${name}-${idx}`}
            key={`${name}-${idx}`}
            value={v}
            onUpdate={this.generateSetter(idx)}
            onKeyDown={this.handleKey(idx)}
          />
        ))}
      </Card>
    )
  }
}
