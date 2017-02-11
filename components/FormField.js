import React from 'react'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  labelStyle: {
    paddingBottom: 5,
    fontWeight: 500,
    fontSize: 16,
    fontFamily: 'system-ui'
  }
})

export default class FormField extends React.Component {
  fixedLabel() {
    if (this.props.label) {
      return (
        <div className={css(styles.labelStyle)}>
          {this.props.label}
        </div>
      )
    }
    return ''
  }
}
