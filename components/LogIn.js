import React from 'react'
import axios from 'axios'
import store from 'store'
import CircularProgress from 'material-ui/CircularProgress'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

const coreUrl = () => window.location.href.includes('localhost')
  ? 'http://localhost:8080/'
  : 'https://api.brandnewcongress.org/'

const baseUrl = () => `${coreUrl()}person/`

export default class Login extends React.Component {
  state = {
    loading: false,
    error: null
  }

  render () {
    const { error, loading } = this.state

    return (
      <Dialog open={true}
        actions={[
          <RaisedButton primary={true} label='Find Me' onClick={() => {
            this.setState({loading: true})

            const params = new URLSearchParams()
            params.append('name', this.refs.name.input.value)

            axios.get(`${baseUrl()}byname?${params.toString()}`)
            .then(found => {
              if (found) {
                store.set('evaluator', {id: found.data.id, name: found.data.name})
                this.props.close()
              }
            })
            .catch(err => {
              this.setState({
                error: 'Not found - make sure you type your name exactly right',
                loading: false
              })
            })
          }}/>
        ]}
      >
        Hey, who is evaluating right now? (Write your name)
        <br />
        <TextField id='name' ref='name' />
        {loading && <CircularProgress />}
        <span style={{color: 'red'}}>{error}</span>
      </Dialog>
    )
  }
}
