import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {fade, lighten} from 'material-ui/utils/colorManipulator'

export default getMuiTheme({
  palette: {
    primary1Color: lighten('#7932AC', .3),
    primary2Color: lighten('#7932AC', .3),
    primary3Color: lighten('#7932AC', .3),
    accent1Color: lighten('#598089', .3),
    accent2Color: lighten('#598089', .3),
    accent3Color: lighten('#598089', .3)
  }
})
