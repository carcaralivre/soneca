# Soneca

Extensão para Firefox que coloca para dormir as abas que você não usa há alguns minutos.

- Descarta (descarrega da memória) abas inativas após o tempo escolhido — 5 minutos por padrão.
- Abas fixadas e abas tocando som nunca são descartadas automaticamente.
- A aba descartada mantém o ícone e ganha 💤 antes do título. Ao clicar nela, ela recarrega normalmente.
- Usa o descarte nativo do Firefox (`tabs.discard`), o mesmo do "Descarregar aba".

## Uso

- **Clique** no ícone da barra: descarta a aba atual ou as outras abas da janela, conforme escolhido no menu.
- **Clique direito** no ícone: escolhe o que o clique faz e o tempo de inatividade (1, 5, 10, 15, 30 ou 60 minutos).
- Um tempo personalizado pode ser definido em `about:addons` → Soneca → Opções.

## Instalação para desenvolvimento

Em `about:debugging#/runtime/this-firefox`, clique em **Carregar extensão temporária…** e escolha o `manifest.json`.

```sh
npx web-ext lint    # valida
npx web-ext build   # gera o .zip
npx web-ext sign --channel=unlisted --api-key=… --api-secret=…   # assina para instalar de vez
```

## Licença

[MPL 2.0](LICENSE)
