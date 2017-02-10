import React from 'react'
import ReactFormal from 'react-formal'
import SubmitButton from './SubmitButton'
import theme from '../../styles/theme'
import { StyleSheet, css } from 'aphrodite'
import log from '../../lib/log'
import TextField from './TextField'
import PhoneField from './PhoneField'

ReactFormal.addInputTypes({
  email: TextField,
  text: TextField,
  string: TextField,
  tel: PhoneField
})


const styles = StyleSheet.create({
  errorMessage: {
    color: theme.colors.red,
    marginRight: 'auto',
    marginLeft: 'auto',
    textAlign: 'center'
  }
})

export default class Form extends React.Component {
  static propTypes = {
    value: React.PropTypes.object,
    defaultValue: React.PropTypes.object,
    onChange: React.PropTypes.func,
    children: React.PropTypes.array
  }

  state = {
    formErrors: null,
    isSubmitting: false,
    model: null,
    globalErrorMessage: null
  }

  handleFormError(err) {
    log.error(err)
    this.setState({ globalErrorMessage: 'Oops! Your form submission did not work. E-mail help@gearshift.co to let us know.' })
  }

  renderGlobalErrorMessage() {
    if (!this.state.globalErrorMessage) {
      return ''
    }

    return (
      <div className={css(styles.errorMessage)}>
        {this.state.globalErrorMessage}
      </div>
    )
  }

  renderChildren(children) {
    return React.Children.map(children, (child) => {
      if (child === null) {
        return child
      } else if (child.type === Form.Field) {
        const name = child.props.name
        let error = this.state.formErrors ? this.state.formErrors[name] : null
        let clonedElement = child
        if (error) {
          error = error[0] ? error[0].message.replace(name, child.props.label) : null
          clonedElement = React.cloneElement(child, {
            errorText: error
          })
        }
        return React.cloneElement(clonedElement, {
          events: ['onBlur']
        })
      } else if (child.type === Form.Button) {
        return React.cloneElement(child, {
          component: SubmitButton,
          isSubmitting: this.state.isSubmitting
        })
      } else if (child.props && child.props.children) {
        return React.cloneElement(child, {
          children: this.renderChildren(child.props.children)
        })
      }
      return child
    })
  }

  submit =() => {
    this.refs.form.submit()
  }
  render() {
    return (
      <ReactFormal
        ref='form'
        value={this.props.value || this.state.model || this.props.defaultValue}
        onChange={model => {
          this.setState({ model })
          if (this.props.onChange) {
            this.props.onChange(model)
          }
        }}
        onError={(errors) => {
          this.setState({ formErrors: errors })
        }}
        {...this.props}
        onSubmit={async (formValues) => {
          this.setState({
            isSubmitting: true,
            globalErrorMessage: null
          })
          if (this.props.onSubmit) {
            try {
              await this.props.onSubmit(formValues)
            } catch (ex) {
              this.handleFormError(ex)
            }
          }
          this.setState({ isSubmitting: false })
        }}
      >
        {this.renderGlobalErrorMessage()}
        {this.renderChildren(this.props.children)}
      </ReactFormal>
    )
  }
}

Form.Field = ReactFormal.Field
Form.propTypes = {
  onSubmit: React.PropTypes.func
}