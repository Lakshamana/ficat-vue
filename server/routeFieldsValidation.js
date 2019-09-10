module.exports = {
  users: {
    create: {
      mandatory: ['username', 'password', 'active']
    },
    update: {
      mandatory: ['active']
    }
  },
  knowledgeAreas: {
    create: {
      mandatory: ['code', 'description']
    },
    update: {
      mandatory: ['description']
    }
  },
  courses: {
    create: {
      mandatory: ['name', 'program', 'type', 'unityId'],
      optional: ['program']
    },
    update: {
      mandatory: ['description']
    }
  },
  academicUnities: {
    create: {
      mandatory: ['name', 'acronym']
    },
    update: {
      mandatory: ['name', 'acronym'],
      optional: ['name', 'acronym']
    }
  },
  auth: {
    mandatory: ['username', 'password', 'rememberMe'],
    optional: ['rememberMe']
  },
  authz: {
    mandatory: ['accessToken']
  },
  catalogCard: {
    mandatory: [
      'keywords',
      'work',
      'advisors',
      'academicDetails',
      'catalogFont'
    ]
  }
}
