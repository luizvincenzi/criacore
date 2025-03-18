# Guia de Solução de Problemas: Next.js + Supabase no AWS Amplify

Este guia aborda problemas comuns que podem ocorrer durante o processo de implantação da aplicação Next.js com Supabase no AWS Amplify e como resolvê-los.

## Problemas de Build no Amplify

### Erro: Build falhou no Amplify

**Sintomas:**
- O processo de build falha no console do Amplify
- Mensagens de erro nos logs de build

**Possíveis causas e soluções:**

1. **Dependências faltando ou incompatíveis**
   - Verifique se todas as dependências estão listadas no `package.json`
   - Certifique-se de que as versões das dependências são compatíveis
   - Solução: Atualize o `package.json` e teste o build localmente antes de fazer push

2. **Variáveis de ambiente ausentes**
   - Verifique se todas as variáveis de ambiente necessárias estão configuradas no console do Amplify
   - Solução: Adicione as variáveis de ambiente faltantes em Environment variables no console do Amplify

3. **Configuração incorreta do Next.js**
   - Verifique se o arquivo `next.config.js` está configurado corretamente
   - Solução: Ajuste a configuração do Next.js e teste localmente

4. **Versão do Node.js incompatível**
   - Verifique se a versão do Node.js no Amplify é compatível com seu projeto
   - Solução: Especifique a versão do Node.js no arquivo `amplify.yml`:
     ```yaml
     frontend:
       phases:
         preBuild:
           commands:
             - nvm use 16
             - npm ci
     ```

5. **Erros de sintaxe ou lógica no código**
   - Verifique os logs de build para identificar erros específicos
   - Solução: Corrija os erros no código e teste localmente antes de fazer push

### Erro: Problemas com o arquivo amplify.yml

**Sintomas:**
- Erros relacionados à configuração do build
- Build não segue as etapas esperadas

**Solução:**
- Verifique se o arquivo `amplify.yml` está formatado corretamente
- Certifique-se de que os caminhos e comandos estão corretos
- Compare com o exemplo fornecido no guia de implantação

## Problemas de Integração com Supabase

### Erro: Falha na conexão com Supabase

**Sintomas:**
- A aplicação carrega, mas não consegue se conectar ao Supabase
- Erros de console como "Failed to connect to Supabase" ou "API key not valid"

**Possíveis causas e soluções:**

1. **Variáveis de ambiente do Supabase incorretas**
   - Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configurados corretamente
   - Solução: Corrija as variáveis de ambiente no console do Amplify

2. **Restrições de CORS no Supabase**
   - Verifique se o domínio do Amplify e seu domínio personalizado estão na lista de URLs permitidos no Supabase
   - Solução: Adicione os domínios na seção Authentication > URL Configuration do dashboard do Supabase

3. **Políticas de segurança do Supabase (RLS)**
   - Verifique se as políticas RLS estão configuradas corretamente
   - Solução: Ajuste as políticas RLS no dashboard do Supabase

## Problemas de Configuração de Domínio

### Erro: Domínio personalizado não funciona

**Sintomas:**
- O site não carrega ao acessar o domínio personalizado
- Erro "Site não encontrado" ou redirecionamentos incorretos

**Possíveis causas e soluções:**

1. **Configuração de DNS incorreta**
   - Verifique se os registros DNS no GoDaddy correspondem exatamente às instruções do Amplify
   - Solução: Corrija os registros DNS no painel de controle do GoDaddy

2. **Propagação de DNS pendente**
   - O DNS pode levar até 48 horas para propagar globalmente
   - Solução: Aguarde a propagação completa e verifique com ferramentas como [dnschecker.org](https://dnschecker.org)

3. **Verificação de domínio pendente no Amplify**
   - Verifique o status da verificação de domínio no console do Amplify
   - Solução: Siga as instruções de verificação fornecidas pelo Amplify

4. **Configuração de SSL/HTTPS**
   - Verifique se o certificado SSL foi provisionado corretamente
   - Solução: No console do Amplify, verifique o status do SSL em Domain Management

### Erro: Redirecionamento entre www e domínio raiz não funciona

**Sintomas:**
- O site carrega em `www.luizvincenzi.com` mas não em `luizvincenzi.com` (ou vice-versa)

**Solução:**
- Verifique se ambos os subdomínios estão configurados no Amplify
- Configure redirecionamentos no Amplify:
  1. No console do Amplify, vá para Domain Management
  2. Selecione seu domínio
  3. Configure o redirecionamento desejado (www para raiz ou raiz para www)

## Problemas de Performance

### Erro: Carregamento lento da aplicação

**Sintomas:**
- A aplicação leva muito tempo para carregar
- Recursos como imagens ou dados demoram para aparecer

**Possíveis causas e soluções:**

1. **Otimização de imagens**
   - Verifique se as imagens estão otimizadas
   - Solução: Use o componente `next/image` para otimização automática de imagens

2. **Carregamento de dados ineficiente**
   - Verifique como os dados estão sendo carregados do Supabase
   - Solução: Implemente estratégias como SSR, ISR ou SWR para otimizar o carregamento de dados

3. **Falta de CDN**
   - Para melhorar a performance global
   - Solução: Considere adicionar o AWS CloudFront como CDN

## Problemas de Custo

### Erro: Custos inesperadamente altos

**Sintomas:**
- Cobranças da AWS maiores que o esperado

**Possíveis causas e soluções:**

1. **Muitos builds**
   - Cada push para o repositório inicia um novo build
   - Solução: Limite os pushes para o branch de produção ou configure o Amplify para ignorar certos commits

2. **Tráfego alto**
   - Transferência de dados excedendo o nível gratuito
   - Solução: Monitore o uso e considere otimizações como caching e compressão de recursos

3. **Recursos não utilizados**
   - Aplicações de teste ou desenvolvimento que não são mais necessárias
   - Solução: Remova aplicações não utilizadas no console do Amplify

## Comandos Úteis para Diagnóstico

### Testar a conexão com Supabase localmente

```bash
curl -I https://seu-projeto.supabase.co/rest/v1/
```

### Verificar propagação de DNS

```bash
dig luizvincenzi.com
dig www.luizvincenzi.com
```

### Verificar configuração SSL

```bash
openssl s_client -connect luizvincenzi.com:443 -servername luizvincenzi.com
```

## Recursos de Suporte

- [Documentação do AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [Fórum de Suporte do AWS Amplify](https://forums.aws.amazon.com/)
- [Documentação do Supabase](https://supabase.io/docs)
- [GitHub do Supabase](https://github.com/supabase/supabase)
- [Suporte do GoDaddy](https://br.godaddy.com/help)

Se você encontrar problemas que não estão cobertos neste guia, considere:

1. Verificar os logs de build e deploy no console do Amplify
2. Consultar a documentação oficial do AWS Amplify, Next.js e Supabase
3. Buscar ajuda em fóruns como Stack Overflow ou Reddit
4. Entrar em contato com o suporte da AWS se for um problema relacionado ao Amplify
