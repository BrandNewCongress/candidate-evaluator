import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  labelStyle: {
    paddingBottom: 5,
    fontWeight: 500,
    fontSize: 16
  }
})

export default class FormField extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props.value === nextProps.value && this.props.errorText === nextProps.errorText)
  }

  fixedLabel() {
    if (this.props.fixedLabel) {
      return (
        <div className={css(styles.labelStyle)}>
          {this.props.fixedLabel}
        </div>
      )
    }
    return ''
  }
}