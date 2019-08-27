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
      mandatory: ['name', 'program', 'type', 'unity_id'],
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
    create: {
      mandatory: ['username', 'password']
    }
  }
}
