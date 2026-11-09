# Integração regional com OpenPage / Openheimer

Branch de implementação: `feat/openpage-regional-sites`. Não foi publicada no Worker de produção. O banco, autenticação e RPCs atuais do Supabase não foram modificados.

O site continua sendo export estático. O novo Worker atende somente `/__openpage/region`, consultando o endpoint público do OpenPage no servidor, sem encaminhar cookies ou credenciais de visitante. O React atualiza textos, datas, dinheiro, atributo lang e paleta automaticamente ao abrir, ganhar foco e a cada minuto. Não existe seletor de idioma ou serviço externo de tradução.

Configurar no Worker de **teste**, preservando os outros bindings e variáveis:

| Variável | Uso |
|---|---|
| `OPENPAGE_API_URL` | Origem HTTPS do OpenPage; padrão `https://openheimer.vercel.app`. Para preview privado, exigir mecanismo de acesso servidor-servidor compatível; não desativar a proteção global. |
| `OPENPAGE_TENANT_SLUG` | Slug público do negócio; vazio mantém o template independente e a rota retorna 204. |
| `OPENPAGE_SITE_ORIGIN` | Origem HTTPS exata do site consumidor. O perfil do OpenPage precisa corresponder a esse domínio. |
| `OPENPAGE_CATALOG_CURRENCY` | Unidade real dos preços do backend. Padrão BRL. Não basta trocar o símbolo: revisar os preços antes de usar USD/EUR/CAD. |
| `OPENPAGE_BOOKING_TIMEZONE` | Fuso real do backend de disponibilidade. Padrão America/Sao_Paulo. |

O OpenPage só retorna perfil para negócio ativo, cliente habilitado e projeto do mesmo cliente com website HTTPS e status publicado. Não vincular um cliente real a um tenant de teste. A integração recusa moeda/fuso/origem divergentes, redirecionamento, respostas maiores que 16 KiB e falha do serviço. O navegador não recebe chaves do portal ou chave privilegiada do Supabase.

Opcionalmente, as mesmas variáveis mais `NEXT_PUBLIC_SITE_URL` podem ser definidas no build para pré-renderizar a região inicial. O Worker mantém a atualização sem rebuild. Sem integração configurada, preserva o português e o comportamento original. Textos operacionais e de navegação usam dicionário pt-br/en/es/fr-ca; nomes, descrições do catálogo e depoimentos fornecidos pelo negócio não passam por tradução automática.

## Verificações

- `npm run typecheck`, `npm run lint` e `npm run build`: passaram.
- `wrangler deploy --dry-run`: passou; não publica.
- `node scripts/regional/worker-test.cjs`: passou no Miniflare, incluindo origem incorreta, moeda divergente, método inválido, integração desativada, nenhuma credencial encaminhada e assets preservados. Descobriu incompatibilidade de `redirect:error` no runtime; corrigida para `manual`, com recusa de 3xx.
- `node scripts/regional/browser-test.cjs`: passou no export estático real para quatro idiomas e larguras 390/1440. Perfil regional simulado, sem envio de reserva, pagamento ou alteração em backend real.

O teste de navegador abre um servidor local temporário e encerra ao terminar; `TEST_BASE_URL` permite usar outro servidor. Capturas são geradas em `/tmp/openpage-regional-screens`. A branch não usa variáveis secretas novas nem altera preços no backend.

Ainda é necessário configurar um domínio **de teste** e validar o caminho real Worker → preview privado OpenPage → branch Neon de teste. Não foi provisionado bypass permanente, não foi implantado este Worker e não se declarou validado o fluxo de agendamento real em outro idioma.

Documentação de referência: https://developers.cloudflare.com/workers/static-assets/routing/worker-script/ e https://developers.cloudflare.com/workers/static-assets/binding/ . Tipos de bindings foram gerados com a versão instalada do Wrangler, sem atualizar pacotes do projeto.
