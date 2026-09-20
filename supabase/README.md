# Ativar o desafio no Supabase

Projeto: https://dcflskexuzjsnlebfnab.supabase.co

1. Abra o SQL Editor do projeto e execute todo o conteúdo de `001_desafio.sql`. Ele cria o banco privado, as cinco perguntas, as quatro alternativas incorretas por pergunta, a correção e as funções públicas. Nenhuma participação é apagada se o script for executado novamente.
2. Em Authentication > Users, crie o usuário da organização com e-mail e senha. Não é necessário cadastrar visitantes. Se a criação exigir confirmação de e-mail, conclua a confirmação antes do login.
3. Preencha seu e-mail em `002_autorizar_admin.sql` e execute esse arquivo no SQL Editor. Só estar cadastrado no Auth não concede acesso ao ranking.
4. Abra `/desafio/admin` e entre com esse usuário. Abra `/desafio` em uma sessão separada para conferir o fluxo público.
5. Antes do evento, confira o gabarito e substitua eventuais alternativas fictícias no SQL Editor. Não altere o gabarito durante a disputa: as notas já registradas não são recalculadas automaticamente.

A URL e a chave pública estão em `.env.local` (ignorado pelo Git). Ao hospedar, configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ambiente de build. Nunca use uma chave secreta/service_role em variáveis VITE_.

## Regras implementadas

- Nome e sobrenome liberam as cinco perguntas. Nenhum cadastro prévio, senha ou código para visitantes.
- O envio final recebe ID identity e horário timestamptz do PostgreSQL. Não usamos horário do aparelho, pontuação enviada pelo visitante nem velocidade de preenchimento.
- O painel protegido lista até cinco envios, ordenados por score decrescente, submitted_at crescente e ID crescente. O botão Atualizar sempre consulta o banco. Horários são exibidos em America/Sao_Paulo.
- Um UUID local evita duplicar a mesma requisição em retries/double-clicks. O comprovante persiste neste navegador; isso não identifica uma pessoa nem impede nova participação por outro navegador ou após limpar o armazenamento. IDs são crescentes, mas podem ter lacunas como qualquer sequência PostgreSQL.
- Não há deduplicação por nome. Homônimos e tentativas com outro nome devem ser conferidos pela organização antes da premiação.
- Gabarito, pontuações e nomes não são acessíveis publicamente. Somente funções específicas possuem permissão para ler/gravar tabelas privadas.
- A terceira pergunta aceita a alternativa única “Retrato Imaginado de Newton ou Retrato Imaginado de Vanda”.
- O site não exibe o gabarito ou a pontuação após o envio; mostra apenas nome, número e horário.
- O desafio fica disponível assim que o SQL é instalado. Nesta versão não há horário global de abertura/encerramento nem verificação de presença física.

## Validação local

`npm run test:quiz` executa PostgreSQL isolado via PGlite, incluindo permissões de anon/authenticated, acertos/erros, nomes inválidos, reenvios idempotentes e ranking. Não grava dados no projeto real.

Os dados ficam nas tabelas quiz_private.questions, quiz_private.submissions e quiz_private.admins, acessíveis ao proprietário via SQL Editor. Preserve as participações reais; se fizer testes no projeto real, planeje a limpeza antes da exposição.

Atualização do desafio: execute `supabase/003_ranking_e_alternativas.sql` em bancos já configurados. A atualização troca uma alternativa incorreta de cada pergunta por uma opção semelhante à correta e classifica todas as pontuações. Ela preserva IDs, respostas, notas e horários existentes. Quem já estiver com perguntas abertas conserva as alternativas carregadas; novas participações recebem as atualizadas.
