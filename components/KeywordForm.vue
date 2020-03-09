<template>
  <card title="Keywords">
    <div class="columns is-centered">
      <div class="column is-half">
        <div
          v-for="(kw, i) in $v.keywords.$each.$iter"
          :key="i"
          class="field is-grouped is-grouped"
        >
          <input-validation
            v-model="kw.text.$model"
            :label="'Keyword ' + (+i + 1)"
            field-name="text"
            :validations="$options.validations.keywords.$each.text"
            :v="kw"
            tooltip-label="Type in a scientific work keyword"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <div class="btn-block">
            <WithTooltip text="Add keyword">
              <b-button
                icon-right="plus"
                class="is-success is-round is-outlined btn"
                :disabled="keywords.length > 4"
                @click="keywords.push({ text: '' })"
              >
              </b-button>
            </WithTooltip>
            <WithTooltip text="Remove keyword">
              <b-button
                v-if="i > 0"
                icon-right="minus"
                class="is-danger is-round btn-margin is-outlined btn"
                @click="keywords.splice(i, 1)"
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
        ;(!$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
      }
    }
  },

  mounted() {
    ;(!this.$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
  },

  beforeCreate() {
    if (!recovery('form').keywords)
      replace('form', {
        keywords: [{ text: '' }]
      })
  },

  methods: {
    onHover(evt, action) {
      const btn = evt.target
      console.log(btn.classList)
      btn.classList.add('tt-btn-visible')
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
