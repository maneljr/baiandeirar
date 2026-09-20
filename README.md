# Baiandeirar

Landing page da exposição Baiandeirar, convertida do design exportado para React, TypeScript e Vite.

## Desenvolvimento

- Instalar dependências: `npm install`
- Iniciar: `npm run dev`
- Validar tipos e compilar: `npm run build`
- Verificar código: `npm run lint`
- Conferir build local: `npm run preview`

## Conteúdo

- `src/App.tsx`: seções e filtro das obras.
- `src/data/works.ts`: textos, categorias e enquadramento das oito imagens.
- `src/components/WorkImage.tsx`: imagens com recortes preservados do design.
- `public/images/`: faixas decorativas e fotos extraídas do arquivo de estado.
- `src/App.css` e `src/index.css`: estilos e adaptação para telas menores.

As fontes Playfair Display e Space Mono são carregadas pelo Google Fonts, como no original. A página usa React diretamente e dispensa os scripts de edição support.js e image-slot.js. Os PDFs de referência e a miniatura do editor não são necessários em produção.

O calendário permanece desabilitado enquanto data e horário estiverem a confirmar. Atualize a seção de visita e implemente o evento quando essas informações estiverem disponíveis.

## Páginas individuais

| Obra | Endereço | Áudio |
| --- | --- | --- |
| O Trem que Leva Minas | `/o-trem-que-leva-minas` | Disponível |
| Bustos em Papietagem / Musa | `/bustos-em-papietagem` | Disponível |
| Serpenteando | `/serpenteando` | Disponível |
| Rabiolas | `/rabiolas` | Disponível |
| Pinguelas | `/pinguelas` | Disponível |
| Dó da Mula | `/do-da-mula` | Disponível |
| Cabô Cauê | `/cabo-caue` | Pendente |
| Cara a Cara com o Gol | `/cara-a-cara-com-o-gol` | Disponível |

### Enviar imagens

1. Execute `npm run dev` e abra pelo endereço local (`localhost` ou `127.0.0.1`).
2. Na página de uma obra, clique em **Adicionar imagem da obra** e escolha um JPG, PNG ou WebP de até 10 MB. Depois, use **Trocar imagem da obra** para substituí-la.
3. A foto é salva em `public/images/pages/` e associada à página em `src/data/page-images.json`. Recarregar a página não perde o envio.
4. Gere um novo build e publique para disponibilizar a imagem aos visitantes. Versione o arquivo de imagem e o JSON.

O upload existe apenas na edição local; não há serviço de envio ou painel administrativo remoto no build publicado. A home e as páginas individuais usam as mesmas imagens de src/data/page-images.json. Trocar uma imagem na edição local atualiza os dois lugares na próxima publicação.

### Textos e gravações

`src/data/work-pages.json` contém slugs estáveis, textos completos, formato (versos ou prosa) e caminhos dos áudios. Os textos foram transcritos de **Atividades para exposição 2026**, incluindo as continuações entre páginas. A letra de O Trem que Leva Minas foi fornecida diretamente pelo responsável pela exposição e está preservada como enviada. A obra substitui Bailarinas de Papel Machê; Espaços de Convivência foi removida.

As seis gravações MP4 foram convertidas em MP3 mono a 128 kbps em `public/audio/`, preservando a duração e os arquivos originais. Para adicionar uma gravação, copie o arquivo e preencha `audio` na obra correspondente. A reprodução começa com o toque do visitante, pois celulares podem bloquear áudio automático. O player permite pausar e avançar e permanece acessível durante a leitura.

### Publicação e QR Codes

O build gera `dist/index.html`, uma pasta com `index.html` para cada slug e `404.html`. Hospede `dist` na raiz de um domínio HTTPS. O provedor deve servir o `index.html` de cada pasta ou configurar fallback de SPA. Teste os endereços sem barra final no provedor escolhido antes de imprimir QR Codes. O domínio definitivo ainda não foi configurado.

Os QR Codes devem apontar para as páginas, nunca diretamente para os MP3. Mantenha os slugs depois da impressão. As mídias e os textos podem ser atualizados sem alterar os códigos.

A obra 01 usa a mesma imagem na home e na página individual. Seu áudio foi convertido de M4A para MP3 a 192 kbps, preservando os canais e o arquivo original.


A seção Sobre o Artista apresenta Newton Baiandeira. A biografia foi baseada na reportagem [Newton Baiandeira, 70 anos](https://atilalemos.com.br/2022/01/06/newton-baiandeira-70-anos-pesquisa-aprofunda-a-vida-do-artista/), com informações da Prefeitura de Itabira/FCCDA. O destaque visual usa versos de Rabiolas presentes no PDF fornecido. Os contatos de Caroline Vaz ficam em Curadoria e realização.

## Desafio da exposição

- `/desafio`: nome completo, cinco perguntas com cinco opções, envio e comprovante.
- `/desafio/admin`: login da organização e consulta dos cinco melhores envios por pontuação e horário; botão Atualizar consulta o banco novamente.
- Ativação: siga `supabase/README.md`, execute `supabase/001_desafio.sql` e autorize o usuário da organização com `supabase/002_autorizar_admin.sql`.
- Testes de banco sem tocar no Supabase real: `npm run test:quiz`.
- O app usa a URL e a chave pública de `.env.local`. Configure as mesmas variáveis no ambiente de build da hospedagem.

A chave pública não cria tabelas ou usuários. Enquanto o SQL não for executado, a página de entrada funciona, mas as perguntas e o registro ficam indisponíveis. O nome identifica a participação; não comprova identidade nem impede tentativas em outros dispositivos. A organização deve conferir os premiados.

Atualização do desafio: execute `supabase/003_ranking_e_alternativas.sql` em bancos já configurados. A atualização troca uma alternativa incorreta de cada pergunta por uma opção semelhante à correta e classifica todas as pontuações. Ela preserva IDs, respostas, notas e horários existentes. Quem já estiver com perguntas abertas conserva as alternativas carregadas; novas participações recebem as atualizadas.
