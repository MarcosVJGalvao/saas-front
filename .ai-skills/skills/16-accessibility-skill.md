# 16 — Accessibility Skill

## Objetivo

Garantir acessibilidade nos componentes, formulários, modais, feedbacks e páginas.

## Regras

- Botões devem ter texto visível ou `aria-label`.
- Inputs devem ter label.
- Mensagens de erro devem estar associadas ao campo.
- Modais devem controlar foco.
- Modais devem permitir fechamento por teclado quando aplicável.
- Componentes devem funcionar por teclado.
- Feedbacks importantes devem ser acessíveis.
- Cores devem respeitar contraste.
- Ícones sozinhos precisam de descrição.
- Loading deve informar estado quando necessário.
- Componentes interativos devem usar elementos semânticos.

## Proibido

- Botão apenas com ícone sem `aria-label`.
- Input sem label.
- Modal sem controle de foco.
- Elemento clicável que não seja botão ou link.
- Usar cor como única forma de comunicar estado.
- Placeholder como substituto de label.

## Formulários

- Cada campo deve ter label.
- Erros devem ser anunciáveis.
- Campos obrigatórios devem ser indicados.
- Máscaras não devem impedir navegação por teclado.
- Formulários em step devem indicar etapa atual.

## Feedback

- Snackbar importante deve usar região apropriada.
- Loading longo deve ser compreensível.
- Estados vazios devem ter texto claro.
