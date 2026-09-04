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

### Valores provisórios que precisam de confirmação

Marcados com `TODO` nos arquivos de dados:

- Acréscimo dos sabores **VIP** (R$ 10 / $ 3.000) e **Doces VIP** (R$ 5 / $ 1.500).
- Preço dos **extras do açaí** além dos 3 grátis (comum R$ 3 / $ 1.000, premium R$ 5 / $ 1.500).
- **Bebidas** (lista e preços não constavam no cardápio recebido).
- Descrições dos sabores VIP e doces (vieram só com o nome).
- Endereço da loja.

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
5. Checkout: dados → entrega/retirada (endereço, número, bairro, referência) →
   pagamento (Dinheiro, PIX, Mercado Pago, Cartão na entrega) + moeda → revisão.
6. **Enviar pedido pelo WhatsApp** abre `wa.me/<número>?text=<pedido>`; a tela seguinte
   oferece reabrir o WhatsApp e copiar o texto.

## Fotografia de produto

As fotos ficam em `public/images/` (JPG, máx. 1600 px) e são ligadas aos produtos pelo campo
`image` nos arquivos de dados. Já existem fotos para hero, seções de pizza e açaí, todas as
porções e carnes, 3 combos e as bebidas. Faltam: sabores individuais (só Portuguesa,
Frango com Catupiry e M&M), receitas de açaí (só Salada e Paçoca) e os combos Mixta, Picanha,
Filé e Da Casa.

Os prompts prontos para gerar as que faltam, no mesmo estilo, estão em
[PROMPTS-IMAGENES.md](PROMPTS-IMAGENES.md). Os builders continuam usando ilustração vetorial
interativa, porque ela reage às escolhas do cliente.
