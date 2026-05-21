# PWA do frontend

## Objetivo

Transformar o frontend em um PWA instalável, com o mesmo comportamento funcional do web quando houver conexão, sem navegação offline na V1 e com estrutura pronta para push notifications futuras.

## Escopo da V1

- instalação em navegadores compatíveis;
- manifesto e ícones dedicados;
- service worker para cache de assets estáticos;
- detecção de atualização disponível;
- atualização controlada pelo usuário;
- feedback global de conexão;
- tratamento explícito de indisponibilidade sem internet;
- preparação estrutural para push notifications.

## Fora de escopo da V1

- navegação offline entre rotas;
- leitura offline confiável de dados autenticados;
- fila de escrita offline;
- sincronização posterior;
- push notifications ativas.

## Estratégia de cache

- cachear assets do build, manifesto, ícones, fontes e imagens públicas;
- não cachear respostas autenticadas de API como contrato funcional;
- não configurar fallback SPA offline para rotas internas;
- manter atualização previsível do service worker.

## Instalação

- CTA discreto e contextual nas rotas públicas e de login;
- suporte a `beforeinstallprompt` quando disponível;
- orientação específica para iOS Safari quando necessário;
- dismiss persistido localmente para não insistir em excesso.

## Atualização

- detectar nova versão via service worker;
- mostrar ação explícita para atualizar;
- evitar refresh automático em fluxo de uso.

## Conectividade

- monitorar `navigator.onLine` e eventos `online`/`offline`;
- exibir feedback global em português;
- traduzir erros de rede para mensagens amigáveis.

## Push notifications futuras

### Estrutura preparada

- `src/app/pwa/push/push.types.ts`
- `src/app/pwa/push/pushSupport.ts`
- service worker com ponto de extensão documentado

### Evolução prevista

1. adicionar fluxo de permissão com `Notification.requestPermission()`;
2. implementar `PushManager.subscribe()` com chave pública VAPID;
3. enviar subscription para endpoint backend;
4. persistir subscription por usuário/dispositivo;
5. tratar `push` e `notificationclick` no service worker;
6. criar preferências de opt-in e opt-out na UI.

## Contrato esperado com backend no futuro

- endpoint para registrar subscription Web Push;
- endpoint para invalidar subscription;
- armazenamento de `endpoint`, `keys.p256dh`, `keys.auth`, usuário, tenant, dispositivo e status;
- suporte a chave pública VAPID no frontend e privada no backend.

## Critérios de aceite

- app instalável em navegadores compatíveis;
- abertura em modo standalone;
- comportamento online igual ao web atual;
- sem promessa de navegação offline;
- feedback claro quando a conexão cair;
- atualização controlada disponível;
- build com melhor distribuição de chunks.
