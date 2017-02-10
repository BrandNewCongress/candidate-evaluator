import React from 'react'
import belle from 'belle'

export default class BNCSubmitButton extends React.Component {
  render() {
    return (
      <Button
        primary
        type='submit'
        value='submit'
        {...this.props}
      />
    )
  }
}