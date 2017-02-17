import React from 'react'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'

export default class Person extends React.Component {
  onChange = name => (ev, idx, value) => this.props.mutate({[name]: value || ev.target.value})

  render () {
    const {
      profile, facebook, linkedin, twitter, gender, race, politicalParty,
      religion
    } = this.props

    const fieldStyle = {margin: 5}

    return (
      <Paper style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: 10
        }}
      >
        <div style={{...fieldStyle, width: '100%'}}>
          <TextField
            id='profile'
            style={{width: '100%'}}
            floatingLabelText='Profile'
            value={profile}
            multiLine={true}
            onChange={this.onChange('profile')}
          />
        </div>

        <div style={fieldStyle}>
          <TextField
            id='facebook'
            floatingLabelText='Facebook'
            value={facebook}
            onChange={this.onChange('facebook')}
          />
        </div>

        <div style={fieldStyle}>
          <TextField
            id='linkedin'
            floatingLabelText='LinkedIn'
            value={linkedin}
            onChange={this.onChange('linkedin')}
          />
        </div>

        <div style={fieldStyle}>
          <TextField
            id='twitter'
            floatingLabelText='Twitter'
            value={twitter}
            onChange={this.onChange('twitter')}
          />
        </div>

        <div style={fieldStyle}>
          <SelectField
            value={gender}
            onChange={this.onChange('gender')}
            floatingLabelText='Gender'
          >
            {['Male', 'Female', 'Other'].map(v => (
              <MenuItem value={v.toLowerCase()} primaryText={v} key={v} />
            ))}
          </SelectField>
        </div>

        <div style={fieldStyle}>
          <SelectField
            value={race}
            onChange={this.onChange('race')}
            floatingLabelText='Race'
          >
            {['Race Option 1', 'Race Option 2', 'Race Option 3'].map(v => (
              <MenuItem value={v.toLowerCase()} primaryText={v} key={v} />
            ))}
          </SelectField>
        </div>

        <div style={fieldStyle}>
          <SelectField
            value={politicalParty}
            onChange={this.onChange('politicalParty')}
            floatingLabelText='Political Party'
          >
            {['Political Party 1', 'Political Party 2', 'Political Party 3'].map(v => (
              <MenuItem value={v.toLowerCase()} primaryText={v} key={v} />
            ))}
          </SelectField>
        </div>
      </Paper>
    )
  }
}
