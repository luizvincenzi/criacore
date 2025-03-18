# Arquitetura de Implantação: Next.js + Supabase no AWS Amplify

Este documento apresenta diagramas visuais da arquitetura de implantação para ajudar a entender como os diferentes componentes se integram.

## Visão Geral da Arquitetura

```mermaid
graph TD
    subgraph "Desenvolvimento Local"
        A[Código Next.js] --> B[Git Repository]
    end
    
    subgraph "AWS Cloud"
        B --> C[AWS Amplify]
        C --> D[Build & Deploy]
        D --> E[Aplicação Hospedada]
    end
    
    subgraph "Supabase Cloud"
        F[Supabase Project] --> G[PostgreSQL Database]
        F --> H[Authentication]
        F --> I[Storage]
        F --> J[Edge Functions]
    end
    
    E <--> F
    
    subgraph "DNS"
        K[GoDaddy DNS] --> L[luizvincenzi.com]
        L --> E
    end
    
    M[Usuários] --> L
```

## Fluxo de Implantação

```mermaid
sequenceDiagram
    participant Dev as Desenvolvedor
    participant Git as Repositório Git
    participant Amplify as AWS Amplify
    participant Supabase as Supabase
    participant GoDaddy as GoDaddy DNS
    participant User as Usuário Final
    
    Dev->>Git: Push de código
    Git->>Amplify: Webhook trigger
    Amplify->>Amplify: Build & Deploy
    Amplify->>Supabase: Conecta usando variáveis de ambiente
    Dev->>GoDaddy: Configura registros DNS
    GoDaddy->>Amplify: Aponta domínio para aplicação
    User->>GoDaddy: Acessa luizvincenzi.com
    GoDaddy->>Amplify: Resolve para aplicação Amplify
    Amplify->>User: Serve aplicação Next.js
    User->>Supabase: Interações com banco de dados/auth
```

## Estrutura de Componentes

```mermaid
graph TD
    subgraph "Frontend (Next.js)"
        A[Pages] --> B[Components]
        A --> C[API Routes]
        B --> D[Supabase Client]
        C --> D
    end
    
    subgraph "Backend (Supabase)"
        D --> E[Authentication]
        D --> F[Database]
        D --> G[Storage]
        D --> H[Edge Functions]
    end
    
    subgraph "Infraestrutura (AWS)"
        I[AWS Amplify] --> J[Hosting]
        I --> K[CI/CD Pipeline]
        I --> L[Domain Management]
        I --> M[SSL/TLS]
    end
    
    subgraph "DNS (GoDaddy)"
        N[DNS Management] --> O[A Records]
        N --> P[CNAME Records]
    end
    
    O --> I
    P --> I
```

## Fluxo de Dados

```mermaid
graph LR
    A[Cliente/Browser] --> B[luizvincenzi.com]
    B --> C[AWS Amplify]
    C --> D[Next.js App]
    D --> E[Supabase Client]
    E --> F[Supabase API]
    F --> G[PostgreSQL Database]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
    style G fill:#bfb,stroke:#333,stroke-width:2px
```

## Escalabilidade Futura

```mermaid
graph TD
    subgraph "Configuração Inicial"
        A[AWS Amplify Básico]
        B[Supabase Free Tier]
    end
    
    subgraph "Escalabilidade Média"
        C[AWS Amplify + Cache]
        D[Supabase Pro Plan]
        E[AWS CloudFront CDN]
    end
    
    subgraph "Escalabilidade Avançada"
        F[AWS ECS/EKS]
        G[RDS PostgreSQL]
        H[AWS Lambda]
        I[CloudFront + S3]
    end
    
    A --> C
    B --> D
    C --> F
    D --> G
    E --> I
    
    style A fill:#bbf,stroke:#333,stroke-width:2px
    style F fill:#fbb,stroke:#333,stroke-width:2px
```

Estes diagramas fornecem uma visão visual da arquitetura de implantação, ajudando a entender como os diferentes componentes se integram e como o fluxo de dados ocorre no sistema.
