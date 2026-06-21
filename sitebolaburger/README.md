# BolaBurger

Projeto TanStack Start configurado para deploy no Netlify, sem dependência de banco de dados.

## Desenvolvimento

```sh
npm install
npm run dev
```

## Deploy no Netlify

As configurações principais já estão em `netlify.toml`:

- build command: `npm run build`
- publish directory: `dist/client`
- Node: `22.x`

Configure somente a URL pública do site, se quiser metatags com URL absoluta:

```sh
VITE_SITE_URL="https://seu-dominio.com.br"
```

Depois de publicar, adicione o domínio customizado no Netlify e copie os registros DNS que ele mostrar para o painel do Registro.br.
