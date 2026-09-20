-- Depois de criar seu usuário em Authentication > Users, substitua o e-mail abaixo.
-- Execute somente no SQL Editor. A senha nunca deve ser incluída aqui.
do $$
declare v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = lower('carolfernandda@hotmail.com');
  if v_id is null then
    raise exception 'Crie o usuário em Authentication > Users e preencha o e-mail neste SQL.';
  end if;
  insert into quiz_private.admins (user_id) values (v_id) on conflict do nothing;
end;
$$;
