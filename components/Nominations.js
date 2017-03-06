import React from 'react'
import toSpaceCase from 'to-space-case'

import {Card, CardHeader, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

const evenIfNull = ['facebook', 'linkedIn', 'twitter', 'otherLinks']

export default class Nomations extends React.Component {
  render () {
    const noms = this.props.nomations || []

    return (
      <Paper>
        <Subheader> Nomations </Subheader>

        {noms.map((nom, idx) => (
          <Card key={idx} >
            <CardHeader
              title={`by ${nom.nominatorName} (${nom.nominatorEmail})`}
              subtitle={`submitted ${nom.dateSubmitted}`}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              {['source', 'profile', 'otherLinks', 'facebook', 'linkedIn', 'twitter',
                'relationshipToNominator', 'leadership', 'workHistory',
                'politicalViews', 'publicSpeaking'].map(attr => (nom[attr] || evenIfNull.includes(attr))
                  ? (
                      <div>
                        <Subheader key={attr} style={{textTransform: 'capitalize'}}> {toSpaceCase(attr)} </Subheader>
                        {nom[attr]}
                      </div>
                    )
                  : null
              )}
            </CardText>
          </Card>
        ))}

      </Paper>
    )
  }
}
