export const state = () => ({
  form: {
    authors: {
      authorName: '',
      authorSurname: '',
      author2Name: '',
      author2Surname: ''
    },
    work: {
      workTitle: '',
      workSubtitle: '',
      presentationYear: '' + new Date(Date.now()).getFullYear(),
      numberType: 'arabic',
      totalPages: '',
      workImagesType: 'nocolor',
      workType: undefined,
      course: undefined,
      loading: false,
      knAreas: [],
      academicUnities: [],
      courses: [],
      selectedKnArea: undefined,
      selectedAcdUnity: undefined,
      selectedCourse: undefined
    }
  }
})

export const mutations = {
  setFormData(state, { data, index }) {
    if (!index || typeof index !== 'string')
      throw new Error('Payload should contain an target index!')
    state.form[index] = data
  }
}

export const actions = {
  save({ commit }, payload) {
    commit('setFormData', payload)
  }
}
