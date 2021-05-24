---
title: 'Como adicionar o v-model em um componente Vue'
date: '2021-05-24'
excerpt: 'Aprenda a dar suporte à diretiva v-model em seus componentes.'
---

O `v-model` é uma diretiva do Vue que permite criar uma comunicação de mão dupla (*two-way binding*) automática entre componentes.

Se um valor for passado de um componente pai para um filho com suporte à diretiva, o Vue vai atualizá-lo por debaixo dos panos:

```html
<input type="text" v-model="framework" placeholder="com qual framework você trabalha?">

<p>você trabalha com: {{ framework }}</p>
```

O código acima é um **açúcar sintático**, ou seja, é o mesmo que passar para o elemento a propriedade `value` e atualizar o dado no evento `input`:

```html
<input type="text" :value="framework" @input="framework = $event">
```

## Adicionando o v-model em um componente

Para dar suporte à diretiva, o componente customizado só precisa ter a prop `value` declarada e deve emitir um evento `input` quando o valor for alterado.

A partir da versão 3 do Vue, a prop padrão do `v-model` passou a ser o `modelValue` e o evento `update:modelValue`, mas vamos ver como alterar esse comportamento.

Imagina que você queira componentizar o seu próprio input, como fazer então para que o `v-model` funcione?

```html
<template>
  <input
    type="text"
    class="custom-input"
    :value="text"
    @input="handleInput"
  >
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    value: String // declaração da prop value
  },
  data() {
    return {
      text: this.value // adição do valor inicial da prop na variável text
    }
  },
  watch: {
    value() { // observando para que a atualização da prop reflita no componente
      this.text = this.value
    }
  },
  methods() {
    handleInput(event) {
      const { value } = event.target

      this.$emit('input', value) // emitindo o valor do input alterado
    }
  }
}
</script>
```

Dessa maneira, o seu componente já poderia ser chamado com a diretiva:

```html
<CustomInput v-model="framework" />
```

Mas o Vue também oferece a opção de configurar uma propriedade e um evento para que o `v-model` funcione de forma customizada, é só alterar o objeto `model` da instância do componente:

```javascript
export default {
  name: 'CustomInput',
  model: { // configuração do v-model
    prop: 'modelValue',
    event: 'change'
  }
  props: {
    modelValue: String // nova propriedade
  },
  data() {
    return {
      text: this.modelValue
    }
  },
  watch: {
    modelValue() { // novo observador da propriedade
      this.text = this.modelValue
    }
  },
  methods() {
    handleInput(event) {
      const { value } = event.target

      this.$emit('change', value) // emitindo novo evento
    }
  }
}
```

Pronto! O `input` customizado agora tem suporte a diretiva `v-model` com propriedade e evento customizados.

Como só foi alterado o comportamento interno do componente, a sua chamada (que vimos acima) não será afetada.
