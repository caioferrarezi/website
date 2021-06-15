---
title: 'Reatividade com proxies no Vue'
date: '2021-06-14'
excerpt: 'Entendendo um pouco do framework por debaixo dos panos.'
cover: 'images/posts/v-model-customizado'
---

Se você conhece Vue.js, então com certeza já se deparou com uma propriedade computada (ou *computed property*). São métodos que **declaramos** nos nossos componentes para abstrair expressões mais complexas e que o framework expõe para gente como uma propriedade que acessamos com o `this.`, como por exemplo essa interpolação de string:

```javascript
export default {
  data() {
    return {
      name: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName() {
      return `${this.name} ${this.lastName}`
    }
  }
}

// this.fullName -> John Doe
```

Essa propriedade também é reativa, ou seja, se uma das duas **dependências** for alterada, o dado como um todo vai ser atualizado.

E é aqui que eu comecei a perguntar: como é que Vue conhece as dependências desse método e como sabe quando tem que atualizar seu valor? A princípio essa resposta é pouco intuitiva.

Meu objetivo é que você termine essa leitura entendendo como a reatividade funciona por debaixo dos panos com a implementação de um sistema de reatividade muito simples.

> Esse texto é baseado na documentação do Vue 3 e especialmente no texto [Reactivity in Depth](https://v3.vuejs.org/guide/reactivity.html) que recomendo fortemente a sua leitura.

## O que é a reatividade?

A reatividade é um paradigma de programação **declarativo** que faz ser possível **reagir** a mudanças de valores. Isso quer dizer que se o valor `fullName` for a concatenação de `name` e `lastName`, o resultado deve ser atualizado sempre que um desses dois valores também mudar.

Entretanto, no Javascript a gente não tem essa funcionalidade por padrão:

```javascript
let name = 'John'
let lastName = 'Doe'

let fullName = name + ' ' + lastName

console.log(fullName) // -> John Doe

name = 'Caio'
lastName = 'Ferrarezi'

console.log(fullName) // -> John Doe
```

O valor final da variável `fullName` não é atualizado porque não dissemos ao Javascript para fazer. Isso é o que chamamos de programação **imperativa**, devemos dar as instuções corretas para a máquina fazer o que a gente quer.

## Como fazer o Javascript ser reativo?

Para isso, a gente deve ser capaz de cumprir três etapas:

1. Rastrear um valor lido;
2. Detectar quando esse valor é alterado; e
3. Rodar novamente o código que lê esse valor.

Antes de começar, vale a pena explicar que no Javascript não conseguimos gerar reatividade com variáveis que guardam valores primitivos (`string`, `number`, `boolean` e etc), devemos usar estruturas como os objetos.

Isso acontece porque os valores do tipo `Object` tem sua **referência** passada a frente e não sua cópia, ou seja, se a gente alterar ele, será diretamente no espaço de memória onde está alocado.

### Rastrear um valor

O Vue usa usa uma API do Javascript chamada [Proxy](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Proxy) que foi trazida com a versão do ES6 (ou ES2015). Essa funcionalidade permite que a gente defina comportamentos customizados para operações de leitura, escrita e etc de um objeto. Exemplo:

```javascript
const proxy = new Proxy({ value: 0 }, {
  get(target, key) {
    console.log(target[key])

    return target[key]
  },
  set(target, key, value) {
    console.log(`New value: ${value}`)

    return target[key] = value
  }
})

proxy.value // -> 0
proxy.value = 2 // -> New value = 2
```
