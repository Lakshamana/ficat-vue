<template>
  <Card :title="$tr('layout.authorshipData')">
    <div class="columns">
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            ref="authorName"
            v-model="$v.authorName.$model"
            :label="$tr('layout.whosName', ['author'])"
            :validations="$options.validations.authorName"
            :v="$v"
            :tooltip-label="
              $tr('layout.nameTooltip', [{ pt: 'author', en: 'lowAuthor' }])
            "
            field-name="authorName"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <input-validation
            ref="authorSurname"
            v-model="$v.authorSurname.$model"
            :label="$tr('layout.whosSurname', ['author'])"
            :validations="$options.validations.authorSurname"
            :tooltip-label="
              $tr('layout.surnameTooltip', [{ pt: 'author', en: 'lowAuthor' }])
            "
            :v="$v"
            field-name="authorSurname"
            type="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
        </div>
      </div>
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            ref="author2Name"
            v-model="$v.author2Name.$model"
            :label="$tr('layout.whosName', ['secondaryAuthor'])"
            :validations="$options.validations.author2Name"
            :tooltip-label="
              $tr('layout.nameTooltip', [
                { pt: 'secondaryAuthor', en: 'lowSecondaryAuthor' }
              ])
            "
            :v="$v"
            field-name="author2Name"
            type="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <input-validation
            ref="author2Surname"
            v-model="$v.author2Surname.$model"
            :label="$tr('layout.whosSurname', ['secondaryAuthor'])"
            :validations="$options.validations.author2Surname"
            :tooltip-label="
              $tr('layout.surnameTooltip', [
                { pt: 'secondaryAuthor', en: 'lowSecondaryAuthor' }
              ])
            "
            :v="$v"
            field-name="author2Surname"
            type="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import helper from '~/mixins/helper'
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation },
  mixins: [helper],
  data() {
    const { authors } = recovery('form')
    return {
      authorName: authors.authorName,
      authorSurname: authors.authorSurname,
      author2Name: authors.author2Name,
      author2Surname: authors.author2Surname
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { authors: this.$data })
      }
    }
  },

  beforeCreate() {
    if (!recovery('form').authors)
      replace('form', {
        authors: {
          authorName: '',
          authorSurname: '',
          author2Name: '',
          author2Surname: ''
        }
      })
  },

  methods: {
    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    }
  },

  validations: {
    authorName: {
      required,
      minLength: minLength(3)
    },
    authorSurname: {
      required,
      minLength: minLength(5)
    },
    author2Name: {
      minLength: minLength(3)
    },
    author2Surname: {
      minLength: minLength(5)
    }
  }
}
</script>

<style scoped>
.input-float {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
