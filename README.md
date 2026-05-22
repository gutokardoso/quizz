# Quiz Challenge Premium

Game de quiz premium para eventos, pronto para GitHub e Vercel.

## Novidades desta versão

- Cronômetro real de 20 segundos por pergunta
- Barra visual de tempo
- Trilha premium em loop gerada via Web Audio API
- Efeitos sonoros de clique, acerto, erro, tempo esgotado e resultado final
- Botão de ativar/desativar som
- 10 perguntas, 3 alternativas e pontuação final

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar na Vercel

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Personalização

As perguntas ficam no array `questions` em `src/main.jsx`.
O tempo por pergunta fica em `QUESTION_TIME`.
