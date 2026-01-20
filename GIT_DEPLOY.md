# 🔄 Git e Deploy - Comandos Rápidos

## 📦 Preparar e Enviar para GitHub

### Opção 1: Script Automático (Recomendado)

**Windows:**
```bash
prepare-deploy.bat
```

**Linux/Mac:**
```bash
chmod +x prepare-deploy.sh
./prepare-deploy.sh
```

### Opção 2: Manual

```bash
# 1. Build
npx pnpm build

# 2. Adicionar arquivos
git add .

# 3. Commit
git commit -m "Deploy: Sistema VIP pronto para produção"

# 4. Adicionar remote (primeira vez)
git remote add origin https://github.com/elllllllbuilder/vip-miller.git

# 5. Push
git pus