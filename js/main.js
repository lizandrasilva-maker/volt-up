/* Início do jogo: carrega por último, depois de todos os módulos.
   A porta de entrada é o login. Sem login, só entra quem escolheu "Jogar o Capítulo 1 grátis"
   (convidado, vale enquanto a aba estiver aberta) ou quando o servidor está fora do ar. */
document.documentElement.style.setProperty('--art','url('+IMG.oficina+')');
(async function iniciar(){
  let convidado=false;
  try{if(new URLSearchParams(location.search).get('convidado')==='1')sessionStorage.setItem('volt-convidado','1');
    convidado=sessionStorage.getItem('volt-convidado')==='1'}catch(e){}
  const c=await nuvemConta();
  if(!c&&!convidado&&nuvem){location.replace('login.html');return}
  if(c&&!S.name&&c.apelido&&!VOLT_TESTE){S.name=c.apelido;save()}
  /* conta de validação: já entra com tudo liberado, num perfil de teste separado */
  if(c&&c.papel==='validador'){VOLT_TESTE_OK=true;if(!VOLT_TESTE){entrarTeste(abrirInicio);return}}
  abrirInicio();
})();
