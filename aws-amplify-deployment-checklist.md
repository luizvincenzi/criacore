# Checklist de Implantação AWS Amplify

Use esta checklist para acompanhar seu progresso na implantação da aplicação Next.js + Supabase no AWS Amplify com o domínio GoDaddy.

## Preparação Local

- [ ] Verificar se todas as funcionalidades da aplicação estão funcionando localmente
- [ ] Garantir que todas as alterações importantes estão commitadas no repositório Git
- [ ] Executar o script de preparação para deploy: `bash scripts/prepare-amplify-deploy.sh`
- [ ] Verificar se o build local foi bem-sucedido
- [ ] Confirmar que o arquivo `.env.production.local` contém as variáveis corretas do Supabase
- [ ] Verificar se o arquivo `amplify.yml` foi criado corretamente

## Configuração da AWS

- [ ] Criar uma conta AWS (ou usar uma existente)
- [ ] Acessar o console do AWS Amplify
- [ ] Criar um novo aplicativo no Amplify ("Host web app")
- [ ] Conectar ao repositório Git (GitHub, GitLab, Bitbucket)
- [ ] Selecionar o branch para deploy (geralmente `main` ou `master`)
- [ ] Revisar e confirmar as configurações de build
- [ ] Adicionar as variáveis de ambiente no console do Amplify:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Outras variáveis de ambiente necessárias
- [ ] Iniciar o primeiro deploy

## Configuração do Supabase

- [ ] Acessar o dashboard do Supabase
- [ ] Adicionar o domínio do Amplify à lista de URLs permitidos
- [ ] Adicionar o domínio personalizado à lista de URLs permitidos
- [ ] Revisar as políticas de segurança (RLS)
- [ ] Verificar configurações de autenticação

## Configuração do Domínio

- [ ] Obter o domínio de aplicação do Amplify após o deploy inicial
- [ ] No console do Amplify, adicionar o domínio personalizado
- [ ] Anotar os registros DNS fornecidos pelo Amplify
- [ ] Acessar o painel de controle do GoDaddy
- [ ] Configurar os registros DNS no GoDaddy:
  - [ ] Registro CNAME para o subdomínio www
  - [ ] Registros A para o domínio raiz
- [ ] Aguardar a propagação do DNS (pode levar até 48 horas)
- [ ] Verificar o status da verificação de domínio no Amplify

## Teste e Validação

- [ ] Testar o acesso à aplicação pelo domínio do Amplify
- [ ] Testar o acesso à aplicação pelo domínio personalizado
- [ ] Verificar se o HTTPS está funcionando corretamente
- [ ] Testar a integração com Supabase (login, dados, etc.)
- [ ] Verificar se todas as funcionalidades da aplicação estão operando corretamente
- [ ] Testar em diferentes dispositivos e navegadores

## Monitoramento e Manutenção

- [ ] Configurar notificações para falhas de build ou deploy
- [ ] Verificar os logs de build e deploy
- [ ] Monitorar os custos no AWS Billing Dashboard
- [ ] Documentar o processo de deploy para a equipe

## Notas e Problemas Encontrados

Use esta seção para anotar quaisquer problemas encontrados durante o processo de deploy e suas soluções:

1. 
2. 
3. 

---

Data de início do deploy: ___/___/______

Data de conclusão do deploy: ___/___/______
