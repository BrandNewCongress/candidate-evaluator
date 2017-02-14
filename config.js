const yup = require('yup')

export default [
  {
    name: 'emailAddresses',
    multi: true,
    label: 'Email Addresses',
    schema: yup.array().of(yup.string().transform((value) => value.replace(/\s/g, ''))
      .email())
  },
  {
    name: 'phoneNumbers',
    label: 'Phone Numbers',
    multi: true,
    schema: yup.array().of(yup.string())
  },
  {
    name: 'facebook',
    label: 'Facebook',
    schema: yup.string().url()
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    schema: yup.string().url()
  },
  {
    name: 'profile',
    label: 'Profile',
    allowNewLine: true,
    schema: yup.string()
  },
  {
    name: 'otherLinks',
    label: 'Other Links',
    multi: true,
    schema: yup.array().of(yup.string().url())
  },
  {
    name: 'addresses',
    label: 'Addresses',
    multi: true,
    schema: yup.array().of(yup.string())
  },
  {
    name: 'gender',
    label: 'Gender',
    schema: yup.string()
  },
  {
    name: 'race',
    label: 'Race',
    schema: yup.string()
  },
  {
    name: 'politicalParty',
    label: 'Political Party',
    schema: yup.string()
  },
  {
    name: 'religion',
    label: 'Religion',
    schema: yup.string()
  },
  {
    name: 'nominations',
    label: 'Nominations',
    schema: yup.array().of(yup.string())
  },
  {
    name: 'occupations',
    label: 'Occupations',
    schema: yup.string()
  },
  {
    name: 'potentialVolunteer',
    label: 'Potential Volunteer',
    schema: yup.boolean()
  },
  {
    name: 'evaluations',
    label: 'Evaluations',
    multi: true,
    schema: yup.array().of(yup.string()) // TODO
  }
]
