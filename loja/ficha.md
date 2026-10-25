# Soneca — ficha para addons.mozilla.org

- Nome: **Soneca** (livre na AMO)
- Resumo (≤ 250): Coloca para dormir as abas que você não usa há alguns minutos. Descarrega da memória as abas inativas (5 minutos por padrão) e marca com 💤; ao clicar, a aba volta. Abas fixadas e com som ficam de fora.
- Categorias: Abas · Produtividade
- Tags: abas, memória, descartar, desempenho
- Licença: Mozilla Public License 2.0
- Site: https://github.com/carcaralivre/soneca · Suporte: (seu e-mail)
- Ícone: `icone-128.png`
- Capturas: 1) barra com abas 💤 · 2) menu de contexto do ícone com os tempos (você tira)

## Descrição

Extensão para Firefox que coloca para dormir as abas que você não usa há alguns minutos.

- Descarta (descarrega da memória) abas inativas após o tempo escolhido, 5 minutos por padrão.
- Abas fixadas e abas tocando som nunca são descartadas automaticamente.
- A aba descartada mantém o ícone e ganha 💤 antes do título. Ao clicar nela, ela recarrega normalmente.
- Usa o descarte nativo do Firefox, o mesmo de "Descarregar aba".

Uso:
- Clique no ícone da barra: descarta a aba atual ou as outras abas da janela, conforme escolhido no menu.
- Clique direito no ícone: escolhe o que o clique faz e o tempo de inatividade (1, 5, 10, 15, 30 ou 60 minutos).
- Um tempo personalizado pode ser definido em about:addons → Soneca → Opções.

Nenhum dado sai do navegador.

## Notas ao revisor (English)

Discards inactive tabs with `tabs.discard` on a 30-second alarm. `host_permissions: <all_urls>` and `scripting` are used for one thing: before discarding, `scripting.executeScript` prefixes the page's `document.title` with "💤 " so the discarded tab keeps a visible marker (Firefox keeps the last title of a discarded tab); it fails silently on privileged pages. `storage` holds two settings (minutes, click action); `menus` builds the toolbar button's context menu. No network requests. No build step.
