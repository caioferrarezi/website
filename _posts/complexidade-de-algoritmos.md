---
title: 'Complexidade de algoritmos'
date: '2021-05-10'
excerpt: 'Um pouco sobre análise de algoritmos e a notação Big-O no tempo e no espaço.'
---

## O que é um algoritmo?

Um **Algoritmo** é conjunto de instruções passo a passo com a finalidade de se resolver um determinado problema.

O exemplo mais famoso na vida cotidiana são as receitas. Elas nos dão as instruções necessárias para transformar certos ingredientes em uma comida ou um bolo, por exemplo.

Os humanos têm a capacidade de entender esses processos de maneira mais subjetiva, normalmente temos uma visão geral do problema e isso pode fazer com a gente não siga necessariamente todos os passos de forma exata.

Na computação, o conceito é o mesmo a medida que temos que processar uma entrada para gerar uma saída e resolver um problema, porém as máquinas faze, **exatamente** o que pedimos a elas e para evitar ambiguidade em nosso código, devemos ser mais precisos em nossas instruções.

## Como buscar uma palavra em um dicionário?

Há varias formas de realizar essa busca:

- Buscando a palavra por cada página do dicionário, o que chamamos de **busca linear**;

- Dividir o dicionário ao meio e verificar se a palavra está ali; se não estiver, usamos a **ordenação** alfabética a nosso favor para nos direcionar para a metade em que ela está contida; repetir o mesmo processo até acharmos a palavra;

Essas diferenças nas formas de busca nos ajuda a entender que dependendo da nossa escolha, o **tempo** que levamos para achar uma palavra será diferente.

## Complexidade de Tempo

Computadores possuem capacidades diferentes e podem levar tempos diferentes para processar um mesmo número de instruções. Para medir o tempo de execução de algoritmos, devemos nos livrar dessas interferências e, portanto, o tempo absoluto (hora, minutos, segundos e etc) se torna desinteressante para nos dar essa informação.

Para entender a complexidade de um algoritmo no tempo olhamos, então, para o número de instruções (atribuições, comparações, acessos, operações e etc) relevantes que ele processa.

Vamos a um exemplo:

```javascript
const numeros = [1, 2, 3, 4, 5];

let i = 0; // 1 instrução
let n = numeros.length; // 2 instruções

while(i < n) { // 1 instrução
  numeros[i] *= 2; // 3 instruções

  i++; // 2 instruções
}

console.log(numeros); // [2, 4, 6, 8, 10]
```

O código acima dobra o valor de cada item do vetor, para esse algoritmo temos a seguinte função:

> f(n) = 4 + 6n

Onde 4 instruções (as duas primeiras atribuições, o acesso à propriedade `length` e a primeira condição do loop) são processadas antes da entrada na repetição e outras 6 (o corpo do laço) serão processadas ***n*** vezes de acordo com o tamanho do vetor de números.

No entanto, os números constantes dentro da função são irrelevantes para a análise, o que nos interessa é a taxa de **crescimento** do algoritmo em seu **pior caso** (ou no limite), conhecido também como **comportamento assintótico**, ou seja, o termo crescimento ***n*** que tende ao infinito.

Portanto, podemos simplificar a função anterior:

> f(n) = n

Em um outro exemplo podemos considerar que:

> f(n) = n² + 3n = n²

Ficamos somente com a termo quadrático (n²) porque é a **maior taxa de crescimento** do algoritmo. Para representar esse comportamento do algoritmo em seu pior caso, utilizamos uma notação especial chamada **Big-O**.

## Notação Big-O

A notação Big-O é a representação matemática da complexidade de um algoritmo em seu **pior caso**. Os valores mais comuns são:

- Complexidade constante O(1);
- Complexidade linear O(n);
- Complexidade logarítmica O(log(n));
- Complexidade quadrática O(n²)

## Complexidade de Espaço

Além do tempo, podemos medir a complexidade dos algoritmos com base no espaço. A notação Big-O aqui refere-se à quantidade de memória que um algoritmo aloca para resolver determinado problema.

Um algoritmo com a complexidade constante **O(1)**, aloca sempre uma mesma quantidade de memória independente do tamanho da entrada de dados. Já a complexidade de espaço **O(n)**, por exemplo, cresce linearmente em função do tamanho da entrada. Exemplos:

- Complexidade constante O(1):
  ```javascript
  const numeros = [1, 2, 3, 4, 5];

  let i = 0; // 1 alocação
  let n = numeros.length; // 1 alocação

  let sum = 0; // 1 alocação

  while(i < n) {
    sum += numeros[i];

    i++;
  }

  console.log(sum); // 15
  ```

- Complexidade linear O(n):
  ```javascript
  const numeros = [1, 2, 3, 4, 5];

  let i = 0; // 1 alocação
  let n = numeros.length; // 1 alocação

  let aux = []; // 1 alocação

  while(i < n) {
    aux[i] = numeros[i]; // n alocações

    i++;
  }

  console.log(aux); // [1, 2, 3, 4, 5]
  ```

## Eficiência

Para projetar algoritmos eficientes, devemos sempre pensar nesses aspectos de tempo e espaço apresentados, sendo ideal que o nosso código tenha o menor número de instruções e alocações possíveis.

Entretanto, na vida real tudo vai depender do tamanho do problema que temos em mãos e qual o ambiente que nosso código irá ser executado para ter ideia de quais aspectos vamos priorizar mais.

## Referências

- Video-aula: [CS50 Week 3, Algorithms](https://cs50.harvard.edu/x/2021/weeks/3/)
- Livro: Estrutura de Dados e Algoritmos com JavaScript - Loiane Groner

