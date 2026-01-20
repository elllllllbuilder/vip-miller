# Quick Start - Resolver Erros de TypeScript

## O erro vermelho no `env.ts` é normal!

Os erros aparecem porque as dependências ainda não foram instaladas. Siga estes passos:

## 1. Instalar Dependências

```bash
pnpm install
```

Isso vai instalar todas as dependências de todos os apps e packages.

## 2. Gerar Prisma Client

```bash
cd apps/api
pnpm prisma generate
cd ../..
```

## 3. Verificar se os erros sumiram

Após instalar as dependências, os erros de "Cannot find module" devem desaparecer.

## Se ainda houver erros

### Recarregar a janela do VS Code
- Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
- Digite "Reload Window"
- Pressione Enter

### Verificar TypeScript
```bash
# Na raiz do projeto
pnpm --filter api exec tsc --noEmit
pnpm --filter bot exec tsc --noEmit
pnpm --filter worker exec tsc --noEmit
```

## Ordem correta de setup

1. ✅ `pnpm install` - Instalar dependências
2. ✅ Configurar `.env` - Já está criado
3. ✅ `docker-compose up -d` - Iniciar PostgreSQL e Redis
4. ✅ `cd apps/api && pnpm prisma generate` - Gerar Prisma Client
5. ✅ `pnpm prisma migrate dev` - Rodar migrations
6. ✅ `cd ../.. && pnpm dev` - Iniciar aplicações

## Nota importante

Os erros de TypeScript são **esperados** antes de instalar as dependências. Isso é normal em qualquer projeto Node.js/TypeScript.

Após `pnpm install`, tudo deve funcionar perfeitamente! 🚀
