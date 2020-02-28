<template>
  <section class="section center">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <card title="Sobre FICAT">
          <div class="columns is-left">
            <div class="column">
              <div class="has-text-justified">
                <p>
                  O Módulo de Geração de Ficha Automática (FICAT 2.0) possui a
                  finalidade de gerar fichas catalográficas de forma ágil e
                  eficiente. Em meio à realidade virtual, coexiste a necessidade
                  de compreender a dinâmica e contexto do usuário. Assim, poupar
                  o tempo do usuário é um dos maiores preceitos desse novo
                  sistema.
                </p>
                <p>
                  Além de agilizar a elaboração das fichas catalográficas, o
                  sistema foi desenvolvido para manter o padrão de elaboração,
                  conforme as regras do Código Anglo Americano de Catalogação
                  (AACR2) e da Descrição Bibliográfica Internacional Normalizada
                  (ISBD). Critérios como segurança, precisão, agilidade,
                  confiabilidade e usabilidade foram estudados e incorporados ao
                  conceito de desenvolvimento do FICAT 2.0.
                </p>
                <p>
                  Estudos de viabilidade foram realizados e também foram feitas
                  avaliações de outros sistemas semelhantes em Universidades
                  parceiras. Constatou-se que muitos aspectos poderiam ser
                  melhorados e implementados na versão do FICAT 2.0,
                  contemplando assim os critérios supracitados.
                </p>
                <p>
                  O FICAT 2.0 surge com a proposta de implementar as correções e
                  diagnósticos dos problemas de sistemas anteriores e,
                  paralelamente, incrementar a praticidade e agilidade do
                  processo de elaboração de fichas catalográficas. Além disso, o
                  novo sistema também abarcará novas comunidades, pois não
                  ficará restrito à elaboração de fichas dos programas de
                  pós-graduação stricto sensu. A partir da implementação do
                  FICAT 2.0, as fichas dos Trabalhos de Conclusão de Curso
                  (TCC´s), Trabalhos de Conclusão de Curso das Especializações
                  (TCCE´s), Teses e Dissertações estarão contempladas na
                  funcionalidade.
                </p>
                <p>
                  Dessa forma, o FICAT 2.0 se configura como um módulo de
                  elaboração de ficha catalográfica automático e instantâneo. Ou
                  seja, a partir do preenchimento dos dados obrigatórios e
                  opcionais, a ferramenta será capaz de gerar em PDF a ficha
                  pronta para inserção nos trabalhos. Com isso, também será
                  disponibilizado tutoriais de como inserir o PDF no trabalho ou
                  converter o PDF para documento de texto sem perder as
                  configurações originais.
                </p>
              </div>
              <div class="has-text-centered">
                Desenvolvido e mantido por SEDEPTI.
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import Card from '@/components/Card'

export default {
  name: 'About',

  components: {
    Card
  },

  computed: {
    ...mapState({
      lang: state => state.lang.langTag
    })
  }
}
</script>
