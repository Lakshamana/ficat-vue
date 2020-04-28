<template>
  <card :title="$tr('layout.keywords')">
    <div class="columns is-centered">
      <div class="column is-half">
        <div
          v-for="(kw, i) in $v.keywords.$each.$iter"
          :key="i"
          class="field is-grouped is-grouped"
        >
          <input-validation
            ref="keywords"
            v-model="kw.text.$model"
            :label="$tr('layout.keyword') + (+i + 1)"
            :validations="$options.validations.keywords.$each.text"
            :v="kw"
            :tooltip-label="$tr('layout.keywordTooltip')"
            field-name="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <div class="btn-block">
            <WithTooltip :text="$tr('layout.addKeyword')">
              <b-button
                :disabled="keywords.length > 4"
                @click="keywords.push({ text: '' })"
                icon-right="plus"
                class="is-success is-round is-outlined btn"
              >
              </b-button>
            </WithTooltip>
            <WithTooltip :text="$tr('layout.removeKeyword')">
              <b-button
                v-if="i > 0"
                @click="keywords.splice(i, 1)"
                icon-right="minus"
                class="is-danger is-round btn-margin is-outlined btn"
              ></b-button>
            </WithTooltip>
          </div>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import { recovery, replace } from '~/front/persistence'
import InputValidation from '~/components/InputValidation.js'
import WithTooltip from '~/components/WithTooltip'

export default {
  name: 'KeywordForm',
  components: { Card, InputValidation, WithTooltip },
  data() {
    const { keywords } = recovery('form')
    return {
      keywords
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { keywords: this.keywords })
      }
    }
  },

  beforeCreate() {
    if (!recovery('form').keywords)
      replace('form', {
        keywords: [{ text: '' }]
      })
  },

  mounted() {
    this.$refs.keywords[0].focus()
  },

  methods: {
    onHover(evt, action) {
      const btn = evt.target
      console.log(btn.classList)
      btn.classList.add('tt-btn-visible')
    },

    checkNext() {
      const { keywords } = this.$refs
      this.$v.$touch()
      for (const i in keywords) {
        console.log(i, this.$refs.keywords[i])
        if (this.$v.keywords.$each[i].$invalid) {
          this.$refs.keywords[i].focus()
          return false
        }
      }
      return true
    }
  },

  validations: {
    keywords: {
      required,
      minLength: minLength(1),
      $each: {
        text: {
          required,
          minLength: minLength(5)
        }
      }
    }
  }
}
</script>

<style>
.btn-block {
  display: flex;
  margin-left: 1em;
  justify-content: space-between;
}

.btn {
  flex: 0 1 auto;
  margin: 0 0.3em;
  border-radius: 50%;
}
/*
.tooltip.tt-btn,
.tooltip.tt-btn:hover {
  visibility: hidden !important;
  opacity: 0 !important;
}

.with-tooltip .tooltip::after {
  left: 30%;
}

.tt-btn-visible .tooltip {
  opacity: 1;
  visibility: visible;
} */
</style>
