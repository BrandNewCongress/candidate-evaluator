import React from 'react'
import ChipInput from 'material-ui-chip-input'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import LinkIcon from 'material-ui/svg-icons/content/link'

export default class Person extends React.Component {
  raceOptions = [
    'Black', 'White - Caucasian', 'Latino', 'East Asian', 'South Asian',
    'Other', 'White - Jewish', 'American Indian/ Native American',
    'Asian Pacific Islander', 'Hispanic', 'Eastern European', 'Middle Eastern'
  ].sort()

  occupationOptions = [
    'Military', 'Education', 'Healthcare', 'Finance', 'Media/ Communications',
    'Energy', 'Engineer', 'Agriculture', 'Business Owner', 'Manufacturing',
    'Law', 'Politics', 'Social Work', 'Technology', 'Pastor', 'Architecture',
    'Food Services', 'Academia/ Research', 'Systematics',
    'Marketing and Advertising', 'Nonprofit Management', 'Banking',
    'Human Resources', 'Environmental', 'Sports', 'Tourism',
    'Sociology', 'Social service / Law enforcement (police, firefighter, etc.)',
    'Stay at Home Parent', 'Musician', 'Artist', 'Other', 'Student',
    'Missionary', 'Sales', 'Government'
  ].sort()

  potentialVolunteerOptions = [
    'Connector', 'Candidate Research', 'District Specialist', 'Candidate Caller',
    'Outreach', 'Tech'
  ].sort()

  onChange = name => (ev, idx, value) =>
    this.props.mutate({[name]: value !== undefined ? value : ev.target.value})

  render () {
    const {
      profile, facebook, linkedIn, twitter, gender, race, politicalParty,
      religion, occupations, potentialVolunteer, otherLinks
    } = this.props

    const fieldStyle = {margin: 10}

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
          <Link href={facebook} target='_blank' />
        </div>

        <div style={fieldStyle}>
          <TextField
            id='linkedIn'
            floatingLabelText='LinkedIn'
            value={linkedIn}
            onChange={this.onChange('linkedIn')}
          />
          <Link href={linkedIn} target='_blank' />
        </div>

        <div style={fieldStyle}>
          <TextField
            id='twitter'
            floatingLabelText='Twitter'
            value={twitter}
            onChange={this.onChange('twitter')}
          />
          <Link href={twitter} target='_blank' />
        </div>

        <div style={{width: '100%', ...fieldStyle}}>
          <TextField
            id='otherLinks'
            floatingLabelText='Other Links'
            value={otherLinks}
            style={{width: '100%'}}
            multiLine={true}
            onChange={this.onChange('otherLinks')}
          />
        </div>

        <div style={fieldStyle}>
          <SelectField
            value={gender}
            onChange={this.onChange('gender')}
            floatingLabelText='Gender'
          >
            <MenuItem value='' primaryText='' />
            {['Male', 'Female', 'Other'].map(v => (
              <MenuItem value={v} primaryText={v} key={v} />
            ))}
          </SelectField>
        </div>

        <div style={fieldStyle}>
          <SelectField
            value={politicalParty}
            onChange={this.onChange('politicalParty')}
            floatingLabelText='Political Party'
          >
            <MenuItem value='' primaryText='' />
            {['Democrat', 'Republican', 'Green', 'Independent', 'Unknown'].map(v => (
              <MenuItem value={v} primaryText={v} key={v} />
            ))}
          </SelectField>
        </div>

        <div style={fieldStyle}>
          <SelectField
            value={religion}
            onChange={this.onChange('religion')}
            floatingLabelText='Religion'
          >
            <MenuItem value='' primaryText='' />
            {[ 'Evangelical', 'Hindu', 'Muslim', 'Buddhist', 'Jewish', 'Other',
              'Mormon', 'Baptist', 'Christian - Other', 'Catholic',
              'Christian - AME', 'Atheist', 'Agnostic'].sort().map(v => (
                <MenuItem value={v} primaryText={v} key={v} />
            ))}
          </SelectField>
        </div>

        <div style={fieldStyle}>
          <ChipInput
            id='race'
            value={race || []}
            dataSource={this.raceOptions}
            floatingLabelText='Race'
            openOnFocus={true}
            menuProps={{maxHeight: 300}}
            onRequestAdd={val =>
              this.onChange('race')(undefined, undefined,
                (race || []).concat(
                  Array.isArray(val)
                    ? val.filter(v => this.raceOptions.includes(val))
                    : this.raceOptions.includes(val)
                      ? [val]
                      : []
                )
              )
            }
            onRequestDelete={([val, idx]) => {
              const copy = race.slice()
              copy.splice(idx, 1)
              this.onChange('race')(undefined, undefined, copy)
            }}
          >
          </ChipInput>
        </div>

        <div style={fieldStyle}>
          <ChipInput
            id='occupations'
            value={occupations || []}
            dataSource={this.occupationOptions}
            floatingLabelText='Occupation'
            openOnFocus={true}
            menuProps={{maxHeight: 300}}
            onRequestAdd={val =>
              this.onChange('occupations')(undefined, undefined,
                (occupations || []).concat(
                  Array.isArray(val)
                    ? val.filter(v => this.occupationOptions.includes(val))
                    : this.occupationOptions.includes(val)
                      ? [val]
                      : []
                )
              )
            }
            onRequestDelete={([val, idx]) => {
              const copy = occupations.slice()
              copy.splice(idx, 1)
              this.onChange('occupations')(undefined, undefined, copy)
            }}
          >
          </ChipInput>
        </div>

        <div style={{...fieldStyle,
          display: 'flex', alignItems: 'flex-end', paddingBottom: 10,
          width: 246, paddingRight: 10
        }}>
          <ChipInput
            id='potentialVolunteer'
            floatingLabelText='Potential Volunteer'
            value={potentialVolunteer || []}
            dataSource={this.potentialVolunteerOptions}
            menuProps={{maxHeight: 300}}
            onRequestAdd={val =>
              this.onChange('potentialVolunteer')(undefined, undefined,
                (potentialVolunteer || []).concat(
                  Array.isArray(val)
                    ? val.filter(v => this.potentialVolunteerOptions.includes(val))
                    : this.potentialVolunteerOptions.includes(val)
                      ? [val]
                      : []
                )
              )
            }
            onRequestDelete={([val, idx]) => {
              const copy = potentialVolunteer.slice()
              copy.splice(idx, 1)
              this.onChange('potentialVolunteer')(undefined, undefined, copy)
            }}
          />
        </div>
      </Paper>
    )
  }
}

class Link extends React.Component {
  linkify = href => href.startsWith('https://') || href.startsWith('http://')
    ? href
    : 'https://' + href


  render () {
    return this.props.href
      ? (
          <a href={this.linkify(this.props.href)} target='_blank'>
            <LinkIcon />
          </a>
        )
      : (<div />)
  }
}
