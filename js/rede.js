/* ================= REDE ELÉTRICA DO JOGADOR =================
   A pessoa escolhe nas Configurações a tensão da rede (fase-neutro) e a frequência.
   Todo texto do jogo que fala da rede usa marcadores que são trocados na hora de mostrar:
     {V}   tensão fase-neutro (127, 220 ou 110)      {FF}  tensão entre fases (220, 380 ou 190)
     {FF3} tensão de triângulo de motor ligado em {FF} (380, 660 ou 330)
     {2V}  o dobro de {V} (o erro de "somar" as fases) {Hz}  frequência (60 ou 50)
     {2Hz} quantas vezes por segundo a corrente troca de sentido
     {Uc11} {UcC} {UcB} {Up}  valores do DPS para essa rede (ver rede())
   Perguntas com contas que dependem da rede são funções marcadas com comRede(r=>({...})):
   a conta é refeita com a rede escolhida, inclusive as alternativas erradas. */
const REDES={127:{V:127,FF:220,FF3:380},220:{V:220,FF:380,FF3:660},110:{V:110,FF:190,FF3:330}};
function rede(){
  const r=(typeof S!=='undefined'&&S.rede)||{},V=REDES[r.V]?+r.V:220,Hz=+r.Hz===50?50:60;
  /* "outra" é a tensão que o aluno confunde com a dele: quem usa 220 confunde com 127, e vice-versa */
  return {V,FF:REDES[V].FF,FF3:REDES[V].FF3,Hz,troca:2*Hz,outra:V===220?127:220,
    /* DPS (NBR 5410, 6.3.5.2.4): Uc mínimo = 1,1 × U0 em TN-S; modelo comercial logo acima;
       um Uc "baixo demais" (≈ 0,8 × U0) para o distrator; Up máximo pela categoria II da tabela 31 */
    Uc11:Math.round(1.1*V),UcC:{220:275,127:175,110:150}[V],UcB:Math.round(V*0.8/5)*5,Up:V===220?'2,5':'1,5'};
}
/* número em pt-BR com casas fixas (vírgula decimal) */
const nBR=(x,d=0)=>Number(x).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
function rd(t){
  if(typeof t!=='string'||t.indexOf('{')<0)return t;
  const r=rede();
  return t.replace(/\{(V|FF3|FF|2V|Hz|2Hz|Uc11|UcC|UcB|Up)\}/g,(m,k)=>String({V:r.V,FF:r.FF,FF3:r.FF3,'2V':2*r.V,Hz:r.Hz,'2Hz':r.troca,Uc11:r.Uc11,UcC:r.UcC,UcB:r.UcB,Up:r.Up}[k]));
}
const comRede=f=>(f.comRede=1,f);
/* Aplica a rede em todo o conteúdo de uma fase: textos com marcadores e perguntas com conta.
   Funções comuns (verificação do circuito, cenários) ficam como estão. */
function comARede(x){
  if(typeof x==='string')return rd(x);
  if(typeof x==='function')return x.comRede?comARede(x(rede())):x;
  if(Array.isArray(x))return x.map(comARede);
  if(x&&typeof x==='object'&&Object.getPrototypeOf(x)===Object.prototype){const o={};for(const k in x)o[k]=comARede(x[k]);return o}
  return x;
}
const redeTxt=()=>{const r=rede();return r.V+' V · '+r.Hz+' Hz'};

/* Tela de configuração da rede */
function showRede(){
  setMode();const r=rede();
  const grupo=(nome,k,vals,fmt)=>'<div class="rede-grupo"><span class="eyebrow">'+nome+'</span><div class="seg rede-seg">'+
    vals.map(v=>'<button class="btn" data-'+k+'="'+v+'" aria-pressed="'+(r[k==='v'?'V':'Hz']===v)+'">'+fmt(v)+'</button>').join('')+'</div></div>';
  app.innerHTML=hud()+'<p class="big">Rede <em>elétrica</em></p>'+
  '<p class="muted">Escolha a rede da sua região. Todo o jogo passa a usar esses valores: as falas, as perguntas, as contas e a bancada.</p>'+
  grupo('Tensão entre fase e neutro','v',[127,220,110],v=>v+' V <small class="muted">· '+REDES[v].FF+' V entre fases</small>')+
  grupo('Frequência','hz',[60,50],v=>v+' Hz'+(v===60?' <small class="muted">· Brasil</small>':''))+
  '<div class="soonbox"><span class="eyebrow">Para saber</span><span>No Brasil a frequência é 60 Hz. As tensões mais comuns entre fase e neutro são 127 V e 220 V; muita gente ainda chama a de 127 V de "110".</span></div>'+
  '<button class="btn main" id="bk">Pronto</button>';
  bindHud();window.scrollTo(0,0);
  app.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{S.rede=Object.assign({},S.rede,{V:+b.dataset.v});save();showRede()});
  app.querySelectorAll('[data-hz]').forEach(b=>b.onclick=()=>{S.rede=Object.assign({},S.rede,{Hz:+b.dataset.hz});save();showRede()});
  document.getElementById('bk').onclick=showConfig;
}
