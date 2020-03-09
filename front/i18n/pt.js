export default {
  info: {},
  message: {},
  error: {
    errNotFound: 'Recurso não encontrado'
  },
  layout: {
    about: 'Sobre',
    talkToUs: 'Fale conosco',
    authorshipData: 'Dados do Autor',
    whosName: who => `Nome do ${who}`,
    writeName: who => `Escreva o nome do ${who} do trabalho`,
    writeSurname: who => `Escreva o sobrenome do ${who} do trabalho`,
    required: 'Campo obrigatório.',
    minLength: min => `Mínimo de ${min} caracteres.`
  }
}
