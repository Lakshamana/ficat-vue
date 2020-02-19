<template>
  <Card title="Prepare Card">
    <div class="columns is-centered">
      <div class="column is-4">
        <form @submit.prevent="onSubmit">
          <b-field>
            <b-select
              v-model="catalogFont"
              placeholder="Font"
              aria-placeholder="Font"
              rounded
              expanded
            >
              <option value="times">Times New Roman</option>
              <option value="arial">Arial</option>
            </b-select>
          </b-field>
          <div style="border:1px solid black;margin: 3em auto">
            recaptcha
          </div>
          <b-field>
            <b-button class="is-success" rounded native-type="submit">
              Generate
            </b-button>
          </b-field>
        </form>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from '~/components/Card'
import { recovery, replace } from '~/front/persistence'
import { maybe, romanize } from '~/shared/frontUtils'

export default {
  name: 'SendCatalogDataForm',
  components: {
    Card
  },

  data() {
    const { catalogFont } = recovery('form')
    return {
      catalogFont
    }
  },

  watch: {
    catalogFont() {
      replace('form', { catalogFont: this.catalogFont })
    }
  },

  beforeCreate() {
    if (!recovery('form').catalogFont)
      replace('form', {
        catalogFont: this.catalogFont || 'times'
      })
  },

  methods: {
    onSubmit() {
      const form = recovery('form')
      const { authors, work, advisors, keywords, catalogFont } = form
      const totalPages =
        work.numberType === 'roman'
          ? romanize(+work.totalPages)
          : work.totalPages
      this.$axios
        .post('/api/catalogCards', {
          keywords: keywords.map(k => k.text),
          authors: {
            authorName: authors.authorName,
            authorSurname: authors.authorSurname,
            ...maybe('author2Name', authors.author2Name),
            ...maybe('author2Surname', authors.author2Surname)
          },
          work: {
            workTitle: work.workTitle,
            ...maybe('workSubtitle', work.workSubtitle),
            presentationYear: work.presentationYear,
            workImagesType: work.workImagesType,
            totalPages,
            workType: work.workType
          },
          advisors: {
            advisorName: advisors.advisorName,
            advisorSurname: advisors.advisorSurname,
            isFemaleAdvisor: advisors.isFemaleAdvisor,
            advisorTitle: advisors.advisorTitle,
            ...maybe('coadvisorName', advisors.coadvisorName),
            ...maybe('coadvisorSurname', advisors.coadvisorSurname),
            ...maybe('isFemaleCoadvisor', advisors.isFemaleCoadvisor),
            ...maybe('coadvisorTitle', advisors.coadvisorTitle)
          },
          academicDetails: {
            acdUnityId: work.selectedAcdUnity.id,
            knAreaId: work.selectedKnArea.id,
            courseId: work.course
          },
          catalogFont
        })
        .then(response => {
          const location = response.headers.location
          const id = location.substr(location.lastIndexOf('/') + 1)
          this.getPdfResult(id)
        })
        .catch()
        .finally(() => (this.loading = false))
    },

    getPdfResult(id) {
      window.open(`/api/catalogCards/get/${id}`, '_blank')
    }
  }
}
</script>
