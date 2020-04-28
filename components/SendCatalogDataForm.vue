<template>
  <Card :title="$tr('layout.prepareCard')">
    <div class="columns is-centered">
      <div class="column is-center is-5">
        <form @submit.prevent="onSubmit">
          <b-field>
            <WithTooltip :text="$tr('layout.fontFamilyTooltip')">
              <b-select
                ref="font"
                v-model="catalogFont"
                placeholder="Font"
                aria-placeholder="Font"
                rounded
                expanded
              >
                <option value="times">Times New Roman</option>
                <option value="arial">Arial</option>
              </b-select>
            </WithTooltip>
          </b-field>
          <div style="display:flex;margin:.5em">
            <WithTooltip :text="$tr('layout.solveCaptcha')">
              <div style="margin:auto">
                <recaptcha
                  @success="onSuccess"
                  @error="onSomeError('error')"
                  @expired="onSomeError('exp')"
                />
              </div>
            </WithTooltip>
          </div>
          <b-field>
            <WithTooltip :text="$tr('layout.generateTooltip')">
              <b-button
                :disabled="disabled"
                class="is-success"
                rounded
                expanded
                native-type="submit"
              >
                {{ $tr('layout.generate') }}
              </b-button>
            </WithTooltip>
          </b-field>
        </form>
      </div>
    </div>
  </Card>
</template>

<script>
import Card from '~/components/Card'
import WithTooltip from '~/components/WithTooltip'
import helper from '~/mixins/helper'
import { recovery, replace } from '~/front/persistence'
import { maybe, romanize } from '~/shared/frontUtils'

export default {
  name: 'SendCatalogDataForm',
  components: {
    Card,
    WithTooltip
  },
  mixins: [helper],

  data() {
    const { catalogFont } = recovery('form')
    return {
      catalogFont,
      touchedCaptcha: false,
      captchaHasError: false,
      captchaHasExpired: false,
      initialRef: 'font'
    }
  },

  computed: {
    disabled() {
      return (
        !this.touchedCaptcha || this.captchaHasError || this.captchaHasExpired
      )
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
    onSomeError(type) {
      const data = type === 'exp' ? 'captchaHasExpired' : 'captchaHasError'
      this.$set(this.$data, data, true)
    },

    onSuccess() {
      this.touchedCaptcha = true
      this.captchaHasError = false
      this.captchaHasExpired = false
    },

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
          const location = response.headers['pdf-location']
          window.open(location, '_blank')
        })
        .catch()
        .finally(() => (this.loading = false))
    }
  }
}
</script>
