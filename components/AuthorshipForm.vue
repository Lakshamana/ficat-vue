<template>
  <Card :title="$tr('layout.authorshipData')">
    <div class="columns">
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.authorName.$model"
            :label="$tr('layout.whosName', ['author'])"
            field-name="authorName"
            :validations="$options.validations.authorName"
            :v="$v"
            :tooltip-label="
              $tr('layout.nameTooltip', [{ pt: 'author', en: 'lowAuthor' }])
            "
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <input-validation
            v-model="$v.authorSurname.$model"
            :label="$tr('layout.whosSurname', ['author'])"
            field-name="authorSurname"
            :validations="$options.validations.authorSurname"
            :tooltip-label="
              $tr('layout.surnameTooltip', [{ pt: 'author', en: 'lowAuthor' }])
            "
            :v="$v"
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
            v-model="$v.author2Name.$model"
            :label="$tr('layout.whosName', ['secondaryAuthor'])"
            field-name="author2Name"
            :validations="$options.validations.author2Name"
            :tooltip-label="
              $tr('layout.nameTooltip', [
                { pt: 'secondaryAuthor', en: 'lowSecondaryAuthor' }
              ])
            "
            :v="$v"
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
            v-model="$v.author2Surname.$model"
            :label="$tr('layout.whosSurname', ['secondaryAuthor'])"
            field-name="author2Surname"
            :validations="$options.validations.author2Surname"
            :tooltip-label="
              $tr('layout.surnameTooltip', [
                { pt: 'secondaryAuthor', en: 'lowSecondaryAuthor' }
              ])
            "
            :v="$v"
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
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation },
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
        replace('form', { authors: { ...this.$data } })
        ;(!$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
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

  mounted() {
    ;(!this.$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
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
