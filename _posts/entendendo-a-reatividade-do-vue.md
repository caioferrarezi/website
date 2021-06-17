---
title: 'Entendendo a reatividade do Vue com proxies'
date: '2021-06-18'
excerpt: 'Entendendo um pouco do framework por debaixo dos panos.'
cover: 'images/posts/entendendo-a-reatividade-do-vue'
---

Se você conhece Vue.js, então com certeza já se deparou com uma propriedade computada (ou *computed property*). São métodos que **declaramos** nos nossos componentes para abstrair expressões mais complexas e que o framework expõe para nós como uma propriedade que acessamos com o `this.`, como o exemplo dessa interpolação de string:

```javascript
export default {
  data() {
    return {
      nome: 'John',
      sobrenome: 'Doe'
    }
  },
  computed: {
    nomeCompleto() {
      return `${this.nome} ${this.sobrenome}`
    }
  }
}

// this.fullName -> John Doe
```

Essa propriedade é reativa, ou seja, se uma das duas **dependências** for alterada, o dado como um todo vai ser atualizado.

E é aqui que eu comecei a me perguntar: como é que Vue conhece as dependências desse método e como sabe quando tem que atualizar seu valor? A princípio, essa resposta é pouco intuitiva.

Meu objetivo é que você termine essa leitura entendendo como a reatividade funciona por debaixo dos panos com a implementação de um sistema de reatividade muito simples.

> Esse texto é baseado na documentação do Vue 3 e especialmente no texto [Reactivity in Depth](https://v3.vuejs.org/guide/reactivity.html), que recomendo fortemente a sua leitura.

## O que é a reatividade?

A reatividade é um paradigma de programação **declarativo** que faz ser possível **reagir** a mudanças de valores. Isso quer dizer que se o valor `nomeCompleto` for a concatenação de `nome` e `sobrenome`, o seu resultado deve ser atualizado sempre que um desses dois valores mudar.

Entretanto, no Javascript a gente não tem essa funcionalidade por padrão:

```javascript
let nome = 'John'
let sobrenome = 'Doe'

let nomeCompleto = nome + ' ' + sobrenome

console.log(nomeCompleto) // -> John Doe

nome = 'Caio'
sobrenome = 'Ferrarezi'

console.log(nomeCompleto) // -> John Doe
```

O valor final da variável `nomeCompleto` não é atualizado porque não dissemos ao Javascript para fazê-lo. Isso é o que é chamado de programação **imperativa**, devemos dar as instruções precisas para a máquina fazer o que a gente quer.

## Como fazer reatividade no Javascript?

Para isso, nós temos que cumprir três etapas:

1. Rastrear quando um valor lido (em uma função por exemplo);
2. Detectar quando esse valor for alterado; e
3. Executar novamente o código que lê esse valor.

Antes de começar, vale a pena explicar que não conseguimos gerar reatividade com variáveis que guardam valores primitivos (`string`, `number`, `boolean` e etc), devemos usar estruturas como os objetos.

Isso acontece porque quando os valores do tipo `Object` são passados a frente, são suas **referências** que são mandadas e não suas cópias, ou seja, se alterarmos seus valores, isso acontecerá diretamente no espaço de memória onde estão alocados.

## Rastreando um valor

O Vue usa uma API do Javascript chamada [Proxy](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Proxy) que foi trazida com a versão do ES6 (ou ES2015). Essa funcionalidade permite que a gente defina comportamentos customizados para operações de leitura, escrita e etc de um objeto.

Vamos começar criando um `estado` para o nosso sistema, bastando instanciar um novo objeto *proxy*:

```javascript
const estado = new Proxy({
  nome: 'John',
  sobrenome: 'Doe'
})
```

Para poder interceptar as operações do nosso objeto, criamos então os **manipuladores** (ou *handlers*) que contêm os métodos que fornecem acesso às propriedades:

```javascript
const manipuladores = {
  get(objeto, chave) {
    return objeto[chave]
  },
  set(objeto, chave, valor) {
    objeto[chave] = valor
  }
}
```

E então podemos passar os manipuladores para o construtor da *proxy*:

```javascript
const estado = new Proxy({
  nome: 'John',
  sobrenome: 'Doe'
}, manipuladores)
```

Até aqui nada demais. Se tentarmos acessar e modificar as propriedades do nosso `estado`, essas operações serão feitas normalmente:

```javascript
console.log(estado.nome) // -> John

estado.nome = 'Caio'

console.log(estado.nome) // -> Caio
```

Para poder rastrear uma propriedade lida do `estado`, vamos criar a função `rastreia` que vai guardar dentro de um `WeakMap` a referência ao objeto original que passamos na *proxy* e, futuramente, suas dependências. A implementação é bem simples, começando com a instância de uma nova estrutura de dados.

```javascript
const mapaDeObjetos = new WeakMap()
```

Você deve estar se perguntando o porque de usar o `WeakMap`. Essa estrutura de dados (que também foi introduzida com o ES6) permite que guardemos um par chave-valor com diferencial de que essa chave pode ser um objeto (no nosso caso o objeto original do `estado`), função ou outra estrutura mais complexa.

Continuando, precisamos implementar a função `rastreia`. Inicialmente, vamos procurar pelo valor referente ao objeto no `mapaDeObjetos` e se ele não existir, criá-lo:

```javascript
function rastreia(objeto, chave) {
  let mapaDeDependencias = mapaDeObjetos.get(objeto)

  if (!mapaDeDependencias) {
    mapaDeDependencias = new Map()

    mapaDeObjetos.set(objeto, mapaDeDependencias)
  }
}
```

O `mapaDeDependencia` que foi criado, é onde vamos guardar futuramente as dependências das propriedades do `estado`, mas falaremos delas mais profundamente daqui a pouco. O que precisamos saber agora é que esse mapa vai guardar uma **coleção** de dados que não podem ser iguais entre si, por isso vamos usar a estrutura de dados `Set`:

```javascript
function rastreia(objeto, chave) {
  // ...

  let dependencias = mapaDeDependencias.get(chave)

  if (!dependencias) {
    dependencias = new Set()

    mapaDeDependencias.set(chave, dependencias)
  }
}
```

Agora temos o caminho para poder ler e guardar as dependências de uma propriedade.

### Como detectar um valor lido em uma função?

Para detectar quando um valor é lido em uma função e torná-la uma dependência de uma propriedade, precisamos sincronizar o exato momento em que esse código estiver rodando com a leitura da propriedade do `estado`.

Vamos criar uma função que terá a responsabilidade de expor uma outra função (que chamaremos de `efeito`) que lê valores da *proxy*.

Começamos criando uma variável que vai expor o `efeito` globalmente:

```javascript
let efeitoAtivo = null
```

A função `criaEfeito` é quem vai manipular a variável que acabamos de criar. Ela vai receber um efeito, expor e executar esse código:

```javascript
function criaEfeito(efeito) {
  efeitoAtivo = efeito

  efeito()

  efeitoAtivo = null
}
```

A ideia de executar o efeito assim que é exposto é para que as propriedades que ele lê saibam da sua existência, criando o momento de sincronia entre efeito ativo e leitura das propriedades que falamos acima.

Para deixar a ideia mais clara, vamos então criar um efeito que vai sempre *logar* a concatenação entre `estado.nome` e `estado.sobrenome`:

```javascript
criaEfeito(() => console.log(`${estado.nome} ${estado.sobrenome}`))
```

Mas se você estiver atento, vai notar que a ainda falta adicionar esse efeito à nossa coleção de dependências das propriedades. Isso é bem simples, basta alterar a função `rastreia` para que ao fim ela adicione o efeito ativo ao `Set` de dependências:

```javascript
function rastreia(objeto, chave) {
  // ...

  if (efeitoAtivo) {
    dependencias.add(efeitoAtivo)
  }
}
```

Por fim, alteramos o manipulador `get` para chamar a função `rastreia`:

```javascript
const manipuladores = {
  get(objeto, chave) {
    rastreia(objeto, chave)

    return objeto[chave]
  },
  // ...
}
```

Vamos resumir o que fizemos até esse momento do código:

- Criamos um `estado` (*proxy*) com as propriedades `nome` e `sobrenome`;
- Criamos um efeito que *loga* a concatenação entre essas duas propriedades;
- Quando o efeito é criado, ele é exposto globalmente;
- Quando o efeito é executado, ele lê `estado.nome` e `estado.sobrenome`;
- O acesso a essas propriedades chama o manipulador `get` de cada uma; e
- O `get` chama a função `rastreia` que guarda o efeito ativo em uma coleção atrelada à propriedade lida.

Sabendo as dependências de cada propriedade, agora é possível executá-las toda vez que um valor for alterado.

## Detectando uma alteração

Detectar uma alteração em uma das propriedade do `estado` é muito fácil, na verdade, já estamos fazendo isso. Essa responsabilidade está com o manipulador `set` da *proxy*. Toda vez que alteramos o valor tanto de `estado.nome`, quanto de `estado.sobrenome`, esse manipulador é chamado e a propriedade é atualizada.

Agora que já sabemos que o objeto *proxy* já está cuidando das alterações, falta apenas um item da lista para ter o nosso sistema de reatividade funcionado: executar novamente as dependências.

## Executando as dependências

Para chamar as dependências da propriedade que está sendo alterada, vamos alterar o modificador `set` para chamar a função `executa` logo depois de atribuir uma novo valor:

```javascript
const manipuladores = {
  // ...
  set(objeto, chave, valor) {
    objeto[chave] = valor

    executa(objeto, chave)
  }
}
```

A implementação dessa função é bem tranquila também, ela vai buscar o mapa de dependências que relacionado ao objeto original que usamos para criar a *proxy*. Se ele existir, será feita uma busca pela coleção de dependências da propriedade alterada e cada efeito ali presente será executado:

```javascript
function executa(objeto, chave) {
  const mapaDeDependencias = mapaDeObjetos.get(objeto)

  if (mapaDeDependencias) {
    const dependencias = mapaDeDependencias.get(chave)

    dependencias.forEach(efeito => efeito())
  }
}
```

Antes de terminar, podemos fazer uma pequena otimização na chamada da função `executa`. É possível verificar se o valor antigo e o valor atual da propriedade são iguais e então ignorar a execução das dependências, já que na prática, ainda que o manipulador tenha sido chamado, os valores não foram alterados:

```javascript
const manipuladores = {
  // ...
  set(objeto, chave, valor) {
    const valorAntigo = objeto[chave]

    objeto[chave] = valor

    if (valorAntigo !== valor) {
      executa(objeto, chave)
    }
  }
}
```

Com essa implementação simples de um paradigma reativo, se `estado.nome` ou `estado.sobrenome` forem alterados, o *log* da concatenação desses valores será executado automagicamente:

```javascript
estado.nome = "Caio" // -> Caio Doe
estado.sobrenome = "Ferrarezi" // -> Caio Ferrarezi

estado.nome = "Caio" // Não executa a dependência!
```

## Código Final

É claro que o Vue é muito mais robusto do que o vimos aqui. Inclusive, encorajo muito um passeio pelo [código fonte](https://github.com/vuejs/vue-next/tree/master/packages/reactivity) da biblioteca (especialmente a API de reatividade) para tentar visualizar o conceitos que abordamos de forma mais simple aqui.

Por fim, o código que geramos está na íntegra aqui:

```javascript
let efeitoAtivo = null

const mapaDeObjetos = new WeakMap()

function criaEfeito(efeito) {
  efeitoAtivo = efeito

  efeito()

  efeitoAtivo = null
}

function rastreia(objeto, chave) {
  let mapaDeDependencias = mapaDeObjetos.get(objeto)

  if (!mapaDeDependencias) {
    mapaDeDependencias = new Map()

    mapaDeObjetos.set(objeto, mapaDeDependencias)
  }

  let dependencias = mapaDeDependencias.get(chave)

  if (!dependencias) {
    dependencias = new Set()

    mapaDeDependencias.set(chave, dependencias)
  }

  if (efeitoAtivo) {
    dependencias.add(efeitoAtivo)
  }
}

function executa(objeto, chave) {
  const mapaDeDependencias = mapaDeObjetos.get(objeto)

  if (mapaDeDependencias) {
    const dependencias = mapaDeDependencias.get(chave)

    dependencias.forEach(efeito => efeito())
  }
}

const manipuladores = {
  get(objeto, chave) {
    rastreia(objeto, chave)

    return objeto[chave]
  },
  set(objeto, chave, valor) {
    const valorAntigo = objeto[chave]

    objeto[chave] = valor

    if (valorAntigo !== valor) {
      executa(objeto, chave)
    }
  }
}

const estado = new Proxy({
  nome: 'John',
  sobrenome: 'Doe'
}, manipuladores)

criaEfeito(() => console.log(`${estado.nome} ${estado.sobrenome}`))

estado.nome = "Caio"
estado.sobrenome = "Ferrarezi"

estado.nome = "Caio"
```

## Referências

- [Palestra] [Unlocking the Power of Reactivity with Vue 3 - Oscar Spencer](https://www.youtube.com/watch?v=5HxOx_uyV3A)
- [Documentação] [Reactivity in Depth](https://v3.vuejs.org/guide/reactivity.html)
- [Código Fonte] [Vue Reactivity API](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)
