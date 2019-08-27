module.exports = {
  users: {
    post: {
      mandatory: ['username', 'password', 'active']
    },
    put: {
      mandatory: ['active']
    }
  },
  knowledgeAreas: {
    post: {
      mandatory: ['code', 'description']
    },
    put: {
      mandatory: ['description']
    }
  },
  courses: {
    post: {
      mandatory: ['name', 'program', 'type', 'unity_id'],
      optional: ['program']
    },
    put: {
      mandatory: ['description']
    }
  },
  academicUnities: {
    post: {
      mandatory: ['name', 'acronym']
    },
    put: {
      mandatory: ['name', 'acronym'],
      optional: ['name', 'acronym']
    }
  },
  auth: {
    post: {
      mandatory: ['username', 'password']
    }
  }
}
