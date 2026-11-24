/* Início do jogo: carrega por último, depois de todos os módulos.
   A porta de entrada é o login. Sem login, só entra quem escolheu "Jogar o Capítulo 1 grátis"
   (convidado, vale enquanto a aba estiver aberta) ou quando o servidor está fora do ar. */
document.documentElement.style.setProperty('--art','url('+IMG.oficina+')');

/* Recarregar a página volta para a tela em que a pessoa estava (vale enquanto a aba estiver aberta).
   Cada tela principal anota seu nome ao abrir; uma fase anota o id (o índice muda quando entram fases novas). */
const TELA_KEY='volt-tela';
const guardaTela=t=>{try{sessionStorage.setItem(TELA_KEY,JSON.stringify(t))}catch(e){}};
const TELAS={menu:showHome,mapa:showMap,perfil:showFicha,conquistas:showConquistas,album:showAlbum,oficina:runSandbox,calc:showCalc,config:showConfig,plano:showPlano,rede:showRede};
Object.entries(TELAS).forEach(([k,f])=>{window[f.name]=function(a){guardaTela({t:k,a:typeof a==='string'?a:undefined});return f.apply(this,arguments)}});
const _playPhase=playPhase;
playPhase=function(i){if(PHASES[i])guardaTela({t:'fase',id:PHASES[i].id});return _playPhase.apply(this,arguments)};
/* na tela de "Fase concluída", recarregar leva ao mapa (não recomeça a fase) */
const _finish=finish;
finish=function(){guardaTela({t:'mapa'});return _finish.apply(this,arguments)};
function abrirOndeParou(){
  let t=null;try{t=JSON.parse(sessionStorage.getItem(TELA_KEY))}catch(e){}
  if(t&&S.mode&&S.char)try{
    if(t.t==='fase'){const i=PHASES.findIndex(p=>p.id===t.id);if(i>=0){playPhase(i);return}}
    else if(TELAS[t.t]){window[TELAS[t.t].name](t.a);return}
  }catch(e){}
  abrirInicio();
}

(async function iniciar(){
  let convidado=false;
  try{if(new URLSearchParams(location.search).get('convidado')==='1')sessionStorage.setItem('volt-convidado','1');
    convidado=sessionStorage.getItem('volt-convidado')==='1'}catch(e){}
  const c=await nuvemConta();
  if(!c&&!convidado&&nuvem){location.replace('login.html');return}
  if(c&&!S.name&&c.apelido&&!VOLT_TESTE){S.name=c.apelido;save()}
  /* conta de validação: já entra com tudo liberado, num perfil de teste separado */
  if(c&&c.papel==='validador'){VOLT_TESTE_OK=true;if(!VOLT_TESTE){entrarTeste(abrirOndeParou);return}}
  abrirOndeParou();
})();
