# Duo Enigma Class

> (Interface atual da ferramenta no Desktop.)
<img width="1920" height="1080" alt="PagSprint3" src="https://github.com/user-attachments/assets/afbbb596-6c0d-4a55-ad61-b8b54fd58197" />

## 🤖 Gerador de Enigmas Cooperativos

🎯 1. A Ideia (O Conceito Abstrato)

Este projeto é uma ferramenta para professores (no contexto do "Projeto Educação 4.0") destinada a gamificar o aprendizado com atividades do tipo "Quebra-Cabeças Cooperativo". A proposta se inspira em jogos cooperativos como "Keep Talking and Nobody Explodes" ou mecânicas semelhantes a "Batalha Naval" em que a cooperação e a comunicação são essenciais.

Dinâmica resumida:

- Um aluno (Aluno A) recebe uma folha com enigmas gerados pela IA.
- O outro aluno (Aluno B) possui o livro-base (ou material de referência).
- O Aluno A não pode ver o livro; o Aluno B não pode ver os enigmas.
- Eles precisam usar comunicação verbal precisa para que o Aluno A oriente o Aluno B na busca e interpretação de pistas até a resposta correta.

Essa dinâmica visa treinar habilidades de comunicação, leitura atenta, raciocínio lógico e trabalho em equipe.

🛠️ 2. Arquitetura da Implementação (A Solução Técnica)

O projeto é propositalmente dividido em duas partes: Frontend e Backend. Essa separação existe por um motivo técnico crucial: contornar restrições de segurança do navegador (CORS) e proteger a chave de API.

O Problema: Erro de CORS

Browsers bloqueiam páginas carregadas via file:/// de fazer requisições diretas a APIs remotas por regras de segurança. Se abrirmos um arquivo HTML local e ele tentar chamar a API do Google (ou outra API externa), o navegador recusa por CORS e por exposição da chave.

A Solução: Servidor Local como Proxy

Para resolver isso, a arquitetura usa um servidor Node.js (arquivo `servidor_local.js`) que atua como uma "ponte" segura entre o frontend e a API do Google. Assim:

- Frontend (arquivo `gerador_enigmas.html`)
	- Interface do professor (o "salão do restaurante").
	- Usa Tailwind CSS via CDN para estilização rápida.
	- Usa jsPDF via CDN para gerar o PDF final para imprimir/baixar.
	- Não faz chamadas diretas ao Google — em vez disso, envia requisições para o nosso backend local em `http://localhost:3000/generate-enigmas`.

- Backend (arquivo `servidor_local.js`)
	- Servidor local (a "cozinha").
	- Implementado com Express; expõe a rota `/generate-enigmas`.
	- Usa `dotenv` para carregar a `GOOGLE_API_KEY` de um arquivo `.env` (que deve ficar no `.gitignore` e nunca ser comitado).
	- Usa `cors` para permitir que o frontend (rodando no navegador) fale com ele.
	- Ao receber um pedido do frontend, o backend injeta a chave segura da variável de ambiente e faz a chamada à API do Google (ou outro serviço multimodal), retornando o resultado ao frontend.

Essa abordagem protege a chave e evita erros de CORS ao mesmo tempo em que mantém a UX simples para o professor (apenas abrir `http://localhost:3000` ou o HTML servido pelo servidor).

🚀 3. Funcionalidades Complexas (O "Nível Gênio")

O projeto vai além de um gerador de imagem-para-enigma simples. Há várias lógicas pensadas para robustez e uso em sala de aula:

- Lógica de Lotes (Batching)
	- Em vez de enviar dezenas de requisições pequenas uma-a-uma, o frontend agrupa imagens em "lotes" (por exemplo, 10 imagens por lote).
	- Para cada lote, o frontend envia um pedido para o backend. O backend processa cada lote de forma independente, permitindo paralelismo e maior tolerância a falhas.
	- Isso facilita reenvios parciais, monitoramento e escalabilidade em cenários maiores.

- Geração de "Tipos de Prova"
	- Para evitar colas e promover avaliações justas, o PDF final não contém apenas uma versão da prova.
	- O sistema gera 5 Tipos de Prova diferentes: cada tipo seleciona, de cada lote de imagens, uma posição distinta (por exemplo: Tipo 1 usa o 1º enigma de cada lote, Tipo 2 usa o 2º, etc.).
	- O PDF final contém as 5 variações e, ao final, um Gabarito Mestre para o professor.

- Engenharia de Prompt
	- As requisições ao serviço de IA são multimodais (incluem imagens) e usam um prompt "few-shot": enviamos exemplos de como queremos os enigmas (enigmas metafóricos, complexos e bem formatados) para orientar a geração.
	- O servidor monta esse prompt de forma controlada e consistente, garantindo qualidade e coerência nas saídas.

🏃‍♀️ 4. Como Rodar (Guia Rápido para Devs)

Passos mínimos para rodar localmente:

1. Clone o repositório

2. Instale dependências (uma vez):

```bash
npm install
```

3. Crie sua Chave de API

 - Acesse Google AI Studio (ou o painel de APIs que você utiliza) e gere uma nova chave.

4. Configure o ambiente

 - Crie um arquivo `.env` na raiz do projeto com o conteúdo:

```env
GOOGLE_API_KEY="COLE_SUA_CHAVE_API_AQUI"
```

 (O `.env` já está listado no `.gitignore` por segurança — mantenha sua chave privada.)

5. Rode o servidor local

```bash
node servidor_local.js
```

6. Acesse a ferramenta

 - Abra no navegador: http://localhost:3000

Observações práticas:

- Se preferir desenvolver apenas no frontend sem rodar o servidor local, você ainda enfrentará erros de CORS ao tentar usar a API do Google diretamente do navegador. Portanto, execute o servidor para desenvolvimento correto.
- Ajuste o tamanho dos lotes no `gerador_enigmas.html` conforme seu caso de uso (mais imagens por lote = menos requisições, mas mais trabalho por requisição).

---

## Arquivos principais

- `gerador_enigmas.html` — Interface do professor. Reúne as opções de geração, coleta imagens, configura o tamanho dos lotes e envia os pedidos para o endpoint `/generate-enigmas`. Usa Tailwind (CDN) para a UI e jsPDF (CDN) para construir o PDF final.
- `servidor_local.js` — Servidor Node.js (Express) que expõe a rota `/generate-enigmas`, carrega a `GOOGLE_API_KEY` via `dotenv` e atua como proxy seguro entre o frontend e a API multimodal do Google. Habilita CORS para permitir chamadas do navegador.
- `package.json` — Declara dependências (por exemplo: `express`, `cors`, `dotenv`) e scripts úteis. Execute `npm install` para preparar o ambiente.
- `.env` (local, não versionado) — Arquivo onde você define `GOOGLE_API_KEY="SUA_CHAVE_AQUI"`. Nunca comite este arquivo.
- `README.md` — Este guia, contendo a visão geral do projeto, arquitetura, funcionalidades e instruções de execução local.
