# Softia — Gerador de Licenças (PWA)

Emite chaves de licença do **AquaGest** e do **GymGest** pelo celular, offline.
Substitui o `aquagest-mobile/gerador-licenca.html`, que dependia de abrir um
arquivo `file://` no Android — o que quase nunca funciona quando o arquivo chega
por WhatsApp.

## O que mudou em relação ao anterior

| Antes | Agora |
|---|---|
| Um arquivo HTML solto, aberto por `file://` | Página instalável (PWA), abre pelo ícone |
| Só AquaGest | AquaGest e GymGest, cada um com sua chave privada |
| Hardware ID digitado à mão | Lê o **QR Code** da tela de ativação pela câmera |
| Chave privada errada só falhava no cliente | Recusa na hora: "esta é a chave do AquaGest, não do GymGest" |
| ID com espaço/maiúscula gerava chave que não ativa | Normaliza sozinho antes de assinar |
| Sem registro do que foi emitido | Histórico das últimas 30 chaves, com reenvio por WhatsApp |

## Publicar (uma vez)

```bash
cd C:\Users\Adriano\softia-licencas
git init && git add . && git commit -m "Gerador de licencas Softia"
gh repo create softia-licencas --public --source=. --push
```

Depois, no GitHub: **Settings → Pages → Source: branch `main`, pasta `/ (root)`**.
Em 1–2 minutos a página fica em:

```
https://regimneves.github.io/softia-licencas/
```

Esse endereço já é o que os apps colocam no QR Code da tela de ativação
(`GERADOR_URL` em `electron/modules/licensing.js`). Se você publicar em outro
endereço, troque a constante nos dois apps.

> **Sobre publicar num repositório público:** a página não contém segredo nenhum.
> A chave privada é colada por você uma vez e fica só no `localStorage` do seu
> celular — ela nunca é enviada a lugar algum. O que fica público é só o
> formulário.

## Instalar no celular (uma vez)

1. Abra o endereço no **Chrome do Android**.
2. Menu ⋮ → **Instalar aplicativo** / *Adicionar à tela inicial*.
3. Abra pelo ícone, toque em 🔑 **Chave privada**, escolha a aba do produto e cole
   o conteúdo de `license-manager/private-key.pem` daquele produto. Toque em
   **Salvar neste aparelho**. Repita para o outro produto.

Feito isso, funciona **sem internet** — dá para emitir licença no meio da loja do
cliente, com o celular no modo avião.

## Usar no cliente

1. Na tela de ativação do app, aponte o celular para o **QR Code**.
2. O gerador abre com o produto certo e o Hardware ID já preenchido.
3. Escolha o plano → **Gerar chave** → **Enviar por WhatsApp** (ou Copiar).
4. Cole no campo "Chave de licença" do app e clique em Ativar.

Se a câmera não estiver disponível, peça o ID pelo WhatsApp (botão **Copiar** na
tela do app) e cole no campo — espaços e maiúsculas são corrigidos sozinhos.

## Segurança

- A chave privada **não** está embutida na página. Cada aparelho guarda a sua.
- Se perder o celular: gere um par novo de chaves e publique uma versão nova dos
  apps com a pública nova (as licenças já emitidas continuam valendo até lá).
- Para tirar a chave de um aparelho: 🔑 → **Apagar deste aparelho**.
