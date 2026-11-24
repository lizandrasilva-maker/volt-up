/* ================= CALCULADORA: "caderno de contas do Mestre Chico" =================
   Usa js/calculo.js (valores reais). A conta aparece passo a passo, para o aluno aprender o caminho.
   Os valores digitados ficam guardados enquanto o jogo está aberto. */
const CALC_ABAS=[
  {id:'corrente',nome:'Corrente',dica:'Toda conta de instalação começa aqui: quanta corrente a carga puxa da rede.'},
  {id:'consumo',nome:'Consumo',dica:'É essa conta que explica a conta de luz da Dona Fátima.'},
  {id:'queda',nome:'Queda de tensão',dica:'Fio comprido e fino perde tensão no caminho. A norma limita essa perda.'},
  {id:'disjuntor',nome:'Disjuntor',dica:'O disjuntor protege o cabo: aguenta a carga e desarma antes de o cabo esquentar.'}
];
const CALC_VAL={P:5500,U:null,horas:0.5,dias:30,tarifa:0.85,I:10,L:30,S:4,Uq:null,Ib:18,Iz:24};

function showCalc(aba){
  setMode();aba=aba||'corrente';if(CALC_VAL.U==null)CALC_VAL.U=rede().V;if(CALC_VAL.Uq==null)CALC_VAL.Uq=rede().V;const a=CALC_ABAS.find(x=>x.id===aba)||CALC_ABAS[0];
  S.flags.calc=1;save();
  const chico=typeof IMG!=='undefined'&&IMG.chico?picSVG(IMG.chico):NPC.chico.svg;
  const campo=(k,rot,un,ex)=>'<label class="cfield"><span>'+rot+'</span><span class="cin"><input type="number" inputmode="decimal" step="any" min="0" data-k="'+k+'" value="'+CALC_VAL[k]+'"'+(ex||'')+'><b>'+un+'</b></span></label>';
  const opcoes=(k,rot,un,vals)=>'<label class="cfield"><span>'+rot+'</span><span class="cin"><select data-k="'+k+'">'+vals.map(v=>'<option value="'+v+'"'+(+CALC_VAL[k]===v?' selected':'')+'>'+fmtN(v)+'</option>').join('')+'</select><b>'+un+'</b></span></label>';
  const form={
    corrente:campo('P','Potência da carga','W')+opcoes('U','Tensão','V',[110,127,220]),
    consumo:campo('P','Potência','W')+campo('horas','Uso por dia','h',' max="24"')+campo('dias','Dias no mês','dias')+campo('tarifa','Tarifa (veja na sua conta)','R$/kWh'),
    queda:campo('I','Corrente do circuito','A')+campo('L','Comprimento (da origem até a carga)','m')+opcoes('S','Seção do cabo','mm²',[1.5,2.5,4,6,10,16])+opcoes('Uq','Tensão','V',[110,127,220]),
    disjuntor:campo('Ib','Corrente de projeto (Ib)','A')+campo('Iz','Capacidade do cabo (Iz)','A')+
      '<p class="cdica">Iz vem da tabela 36 da NBR 5410. Exemplos (método B1, 2 condutores carregados): '+IZ_EXEMPLOS.map(e=>fmtN(e.s)+' mm² → '+fmtN(e.iz)+' A').join('; ')+'.</p>'
  }[a.id];
  app.innerHTML=hud()+
  '<section class="caderno-top">'+chico+'<div><span class="eyebrow">Calculadora</span><h2>Caderno de contas <span class="bolt">do Mestre Chico</span></h2></div></section>'+
  '<div class="seg calc-abas" role="tablist">'+CALC_ABAS.map(x=>'<button class="btn" role="tab" data-aba="'+x.id+'" aria-selected="'+(x.id===a.id)+'">'+x.nome+'</button>').join('')+'</div>'+
  '<div class="caderno"><p class="cfala">'+a.dica+'</p><div class="cform">'+form+'</div><div id="conta" class="conta" aria-live="polite"></div></div>'+
  '<p class="caviso">Ferramenta de estudo: não substitui projeto nem ART.</p>'+
  '<button class="btn main" id="bk">Voltar ao menu</button>';
  bindHud();window.scrollTo(0,0);
  document.getElementById('bk').onclick=showHome;
  app.querySelectorAll('[data-aba]').forEach(b=>b.onclick=()=>showCalc(b.dataset.aba));
  app.querySelectorAll('[data-k]').forEach(el=>el.addEventListener('input',()=>{const v=parseFloat(el.value);CALC_VAL[el.dataset.k]=isFinite(v)?v:NaN;contaCalc(a.id)}));
  contaCalc(a.id);
}
/* Mostra a conta da aba com os valores atuais (sem redesenhar os campos: o teclado não fecha). */
function contaCalc(aba){
  const v=CALC_VAL,el=document.getElementById('conta');if(!el)return;
  const bloco=(r,dest)=>r?'<ol class="passos">'+r.passos.map(p=>'<li>'+p+'</li>').join('')+'</ol>'+(dest||''):'<p class="cerro">Preencha os campos com números válidos.</p>';
  let h='';
  if(aba==='corrente'){const r=CALC.corrente(v.P,v.U);
    h=bloco(r,r?'<div class="cres"><span>Corrente</span><b>'+fmtN(r.I)+' A</b></div>':'');
    if(r&&r.I>0){const rr=CALC.resistencia(v.U,r.I);h+='<details class="cmais"><summary>E a resistência da carga?</summary>'+bloco(rr)+'</details>'}}
  if(aba==='consumo'){const r=CALC.consumo(v.P,v.horas,v.dias,v.tarifa);
    h=bloco(r,r?'<div class="cres"><span>Consumo no mês</span><b>'+fmtN(r.kwh)+' kWh</b></div>'+(r.custo!==null?'<div class="cres"><span>Custo no mês</span><b>R$ '+fmtN(r.custo,2)+'</b></div>':''):'')}
  if(aba==='queda'){const r=CALC.queda(v.I,v.L,v.S,v.Uq);
    h=bloco(r,r?'<div class="cres '+(r.ok?'ok':'no')+'"><span>Queda de tensão</span><b>'+fmtN(r.dv)+' V · '+fmtN(r.pct)+' %</b></div>'+
      '<p class="cdica">ρ = 0,0172 Ω·mm²/m (cobre a 20 °C). Com o cabo quente em serviço, a queda real fica um pouco maior.</p>':'')}
  if(aba==='disjuntor'){const r=CALC.disjuntor(v.Ib,v.Iz);
    h=bloco(r,r?'<div class="cres '+(r.ok?'ok':'no')+'"><span>Disjuntor</span><b>'+(r.In?r.In+' A':'acima de 63 A')+(r.temIz?(r.ok?' · atende':' · não atende'):'')+'</b></div>'+
      (r.ok&&r.temIz?'<p class="cdica">Com disjuntor da NBR NM 60898, a atuação garantida em 1,45 In também atende I2 ≤ 1,45 Iz.</p>':''):'')}
  el.innerHTML=h;
}
