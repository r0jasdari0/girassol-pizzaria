# Girassol Pizzaria & Açaí — pedidos interativos pelo WhatsApp

**Site publicado:** https://r0jasdari0.github.io/girassol-pizzaria/

Cada `git push` na branch `main` publica automaticamente (GitHub Actions → GitHub Pages).
Repositório: https://github.com/r0jasdari0/girassol-pizzaria

Experiência de pedido mobile-first para a região de fronteira Argentina–Brasil.
O cliente **monta** a pizza e o açaí visualmente, revisa o carrinho e envia o pedido
pronto para o WhatsApp da Girassol. Não há backend: o WhatsApp é o canal de conversão.

## Rodar

```bash
npm install
npm run dev
```

Build de produção em `dist/`:

```bash
npm run build
```

## Publicar mudanças

```bash
git add -A
git commit -m "descrição da mudança"
git push
```

Em 1–2 minutos o site atualiza. Para usar um domínio próprio (ex.: girassol.com.ar), configure o
domínio em *Settings → Pages* no GitHub e troque a `base` em `vite.config.ts` para `"/"`.

Stack: Vite + React 18 + TypeScript + Framer Motion. Sem Tailwind: os tokens do design
system vivem em [src/styles.css](src/styles.css) (`:root`).

## O que a Girassol controla (sem tocar em componentes)

| Onde                                                   | O quê                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| [src/config/business.ts](src/config/business.ts)       | WhatsApp (`5493741415697`), endereço, horário, taxa de entrega (R$ 12 / $ 3.500), moeda e idioma padrão |
| [src/data/products/pizzas.ts](src/data/products/pizzas.ts) | 5 tamanhos (25–45 cm, máx. de sabores), 45 sabores numerados, 4 bordas         |
| [src/data/products/acai.ts](src/data/products/acai.ts)     | Bases (Açaí / Cupuaçu), tamanhos, 26 acompanhamentos, 6 receitas, cota grátis (3) |
| [src/data/products/simple.ts](src/data/products/simple.ts) | Porções, carnes, combos, bebidas                                               |
| [src/i18n/pt.ts](src/i18n/pt.ts) · [es.ts](src/i18n/es.ts) | Textos da interface em português e espanhol                                    |

Todo produto tem `available` (para tirar do ar sem apagar) e preço nas duas moedas
(`price: { brl, ars }`). A interface mostra **uma moeda por vez**; o cliente troca no topo.

### Dados conferidos com o cardápio impresso (2026-09-04)

Pizzas, bordas, os 45 sabores com descrições, açaí em copo (extras com preço real) e barcas
P/M/G (adicionais com preço próprio), porções, carnes e combos.
Os sabores **VIP** e **Doces VIP** aparecem como "Consultar valor", igual ao cardápio: entram no
pedido sem acréscimo e a mensagem avisa a Girassol para confirmar.

Bebidas conforme o banner enviado pela Girassol. Ainda provisórios: Fini e pasta de amendoim no
copo (valores assumidos) e o endereço da loja. O cardápio também traz um WhatsApp brasileiro
(49 9 9978-6851); o site envia tudo para o argentino configurado.

## Regras de preço

- **Pizza** = tamanho + maior acréscimo entre os sabores + borda.
- **Açaí** = tamanho + acompanhamentos a partir do 4º (cada um pelo próprio preço).
- **Entrega** soma a taxa fixa; retirada não.
- Os totais em reais e em pesos são calculados separadamente a partir dos preços
  cadastrados em cada moeda (não há conversão por cotação).

## Fluxo

1. Home → **Montar meu pedido** ou toque em tamanho / sabor / receita no cardápio.
2. Builder de pizza: tamanho → sabores (slots "Sabor 1…4", busca por nome ou número) → borda.
   O desenho divide a pizza em metades, terços ou quartos e pinta a borda.
3. Builder de açaí: base → tamanho → receita da casa (editável) → acompanhamentos,
   com contador de grátis restantes. O copo se enche conforme a escolha.
4. Carrinho: editar, duplicar, remover, quantidade.
5. Checkout em 3 etapas: nome + entrega/retirada → pagamento + moeda → revisão.
   Não pede telefone (o número aparece no WhatsApp) nem endereço: na entrega, o cliente
   manda a localização na própria conversa depois de enviar o pedido.
   Pagamento em reais: Dinheiro ou PIX. Em pesos: Efectivo ou Transferencia.
6. **Enviar pedido pelo WhatsApp** abre `wa.me/<número>?text=<pedido>`; a tela seguinte
   oferece reabrir o WhatsApp e copiar o texto.

## Carrossel de destaques (home, abaixo do logo)

Seis slides gerados por IA (Higgsfield, modelo nano_banana_pro), só com a foto de fundo em
`public/banners/`: `pizza.jpg`, `combos.jpg`, `acai.jpg`, `picadas.jpg`, `carnes.jpg`, `bebidas.jpg`.
Título, texto, preços e botão são desenhados pelo site por cima, no idioma e moeda ativos —
tudo em [src/data/banners.ts](src/data/banners.ts). Os slides "pizza" e "açaí" abrem o builder
direto; os outros rolam até a seção.

Para trocar uma arte: salve a nova foto em `banners-src/` com o mesmo nome e rode
`python scripts/prepare-banners.py banners-src/ public/banners/` (JPG, 1600 px). Deixe a área
esquerda da foto mais limpa: é onde o texto entra.

## Pizza com fotos reais no builder (por fatias)

O desenho da pizza aceita uma foto por sabor (`photo` em `pizzas.ts`, via `withPhoto`). Cada
sabor escolhido aparece recortado na própria fatia, com as divisões reais; sabores sem foto
usam a ilustração. Para o efeito ficar perfeito, todas as fotos precisam ser **iguais no
enquadramento**: pizza inteira, vista de cima, centrada, mesma bandeja e luz.

1. Fotografe cada sabor (celular fixo sobre a mesa) e salve como `entrada/<id-do-sabor>.jpg`.
2. Rode `python scripts/normalize-pizza-photos.py entrada/ public/images/pizzas/` — o script
   encontra a pizza, recorta um quadrado centrado e gera 1000×1000.
3. Em `pizzas.ts`, envolva o sabor com `withPhoto(..., "pizzas/<id>")`.

Os 45 sabores já têm foto cenital gerada por IA (Higgsfield, nano_banana_pro) em
`public/images/pizzas/<id>.jpg`, alinhadas pelo script. Para substituir por fotos reais da
Girassol, basta gerar o JPG com o mesmo nome pelo mesmo script.

## Fotografia de produto

As fotos ficam em `public/images/` (JPG, máx. 1600 px) e são ligadas aos produtos pelo campo
`image` nos arquivos de dados. Já existem fotos para hero, seções de pizza e açaí, todas as
porções e carnes, 3 combos e as bebidas. Faltam: sabores individuais (só Portuguesa,
Frango com Catupiry e M&M), receitas de açaí (só Salada e Paçoca) e os combos Mixta, Picanha,
Filé e Da Casa.

Os prompts prontos para gerar as que faltam, no mesmo estilo, estão em
[PROMPTS-IMAGENES.md](PROMPTS-IMAGENES.md). Os builders continuam usando ilustração vetorial
interativa, porque ela reage às escolhas do cliente.
