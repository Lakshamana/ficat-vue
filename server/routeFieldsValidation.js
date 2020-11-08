module.exports = {
  catalogFields: {
    authors: {
      mandatory: ['authorName', 'authorSurname'],
      optional: ['author2Name', 'author2Surname']
    },
    work: {
      mandatory: [
        'workTitle',
        'presentationYear',
        'workImagesType',
        'totalPages',
        'workType'
      ],
      optional: ['workSubtitle']
    },
    advisors: {
      mandatory: [
        'advisorName',
        'advisorSurname',
        'isFemaleAdvisor',
        'advisorTitle'
      ],
      optional: [
        'coadvisorName',
        'coadvisorSurname',
        'isFemaleCoadvisor',
        'coadvisorTitle'
      ]
    },
    academicDetails: ['acdUnityId', 'knAreaId', 'courseId'],
    fonts: ['times', 'arial']
  },
  queryFields: {
    mandatory: ['searchType', 'year'],
    optional: ['unityId', 'type', 'courseId', 'pdf']
  },
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
      mandatory: ['name', 'type', 'unityId'],
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
      optional: ['name', 'acronym']
    }
  },
  auth: {
    mandatory: ['username', 'password'],
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
      'authors',
      'academicDetails',
      'catalogFont'
    ]
  },
  email: {
    mandatory: ['name', 'email', 'fone', 'msg']
  }
}
