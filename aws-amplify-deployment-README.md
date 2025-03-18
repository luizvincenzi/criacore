# Guia de Implantação: Next.js + Supabase no AWS Amplify

Este repositório contém documentação completa para implantar sua aplicação Next.js com Supabase no AWS Amplify e configurar seu domínio GoDaddy (luizvincenzi.com).

## Índice de Documentação

| Documento | Descrição |
|-----------|-----------|
| [Guia de Implantação](aws-amplify-deployment-guide.md) | Instruções passo a passo detalhadas para todo o processo de implantação |
| [Checklist de Implantação](aws-amplify-deployment-checklist.md) | Lista de verificação para acompanhar seu progresso durante a implantação |
| [Arquitetura](aws-amplify-architecture.md) | Diagramas visuais da arquitetura de implantação |
| [Solução de Problemas](aws-amplify-troubleshooting.md) | Guia para resolver problemas comuns durante a implantação |

## Scripts Úteis

| Script | Descrição |
|--------|-----------|
| [prepare-amplify-deploy.sh](scripts/prepare-amplify-deploy.sh) | Script para preparar o ambiente local para deploy no AWS Amplify |

## Visão Geral do Processo

O processo de implantação consiste em quatro etapas principais:

1. **Preparação do Projeto Next.js**
   - Configurar variáveis de ambiente
   - Verificar configurações do Next.js
   - Testar o build localmente

2. **Configuração do AWS Amplify**
   - Criar conta AWS (se necessário)
   - Configurar o AWS Amplify
   - Conectar ao repositório Git
   - Configurar o build e variáveis de ambiente

3. **Integração com Supabase**
   - Configurar o projeto Supabase para produção
   - Adicionar domínios permitidos no Supabase

4. **Configuração do Domínio GoDaddy**
   - Configurar domínio personalizado no Amplify
   - Configurar registros DNS no GoDaddy
   - Verificar a configuração de DNS

## Começando

Para iniciar o processo de implantação, recomendamos seguir estas etapas:

1. Leia o [Guia de Implantação](aws-amplify-deployment-guide.md) para entender todo o processo
2. Examine os [diagramas de arquitetura](aws-amplify-architecture.md) para visualizar a solução
3. Execute o script de preparação:
   ```bash
   chmod +x scripts/prepare-amplify-deploy.sh
   ./scripts/prepare-amplify-deploy.sh
   ```
4. Use a [Checklist de Implantação](aws-amplify-deployment-checklist.md) para acompanhar seu progresso
5. Consulte o [Guia de Solução de Problemas](aws-amplify-troubleshooting.md) se encontrar dificuldades

## Requisitos

- Conta AWS (gratuita ou existente)
- Domínio registrado no GoDaddy (luizvincenzi.com)
- Projeto Next.js com Supabase
- Repositório Git (GitHub, GitLab, Bitbucket, etc.)
- Node.js e npm instalados localmente

## Considerações de Custo

- **AWS Amplify**: Nível gratuito inclui 1.000 minutos de build por mês, 5GB de armazenamento e 15GB de transferência de dados
- **Supabase**: Plano gratuito inclui banco de dados PostgreSQL de 500MB, 50MB de armazenamento e 2GB de transferência

## Recursos Adicionais

- [Documentação do AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.io/docs)
- [Gerenciamento de DNS do GoDaddy](https://br.godaddy.com/help/gerenciar-registros-dns-680)
