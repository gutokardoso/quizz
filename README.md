# Quiz Challenge Premium

Game de quiz premium para evento, com 10 perguntas, 3 alternativas por pergunta, feedback visual e tela de pontuação final.

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois abra o endereço exibido no terminal, geralmente:

```bash
http://localhost:5173
```

## Como gerar versão final

```bash
npm run build
```

A pasta final será criada em:

```bash
dist/
```

## Como subir no GitHub

1. Crie um repositório novo no GitHub.
2. Envie todos os arquivos desta pasta.
3. Para publicar em hospedagens como Vercel/Netlify, use:
   - Build command: `npm run build`
   - Output directory: `dist`
