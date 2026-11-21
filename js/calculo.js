/* ================= CÁLCULO COM VALORES REAIS (Etapa 3) =================
   Módulo separado do motor da bancada (js/motor.js), que continua qualitativo.
   Aqui ficam só contas com unidades reais, usadas pela Calculadora ("caderno do Mestre Chico").
   Cada função devolve o resultado e os passos da conta, para a tela mostrar como se chega nele.
   Ferramenta de estudo: não substitui projeto nem ART. */

/* Resistividade do cobre a 20 °C (Ω·mm²/m). Com o cabo aquecido em serviço ela aumenta,
   e a queda de tensão real fica um pouco maior: a tela avisa. */
const RHO_CU=0.0172;
/* Correntes nominais de disjuntor mais comuns no comércio (A). */
const DJ_PADRAO=[6,10,16,20,25,32,40,50,63];
/* Limite de queda de tensão nos circuitos terminais usado no jogo (NBR 5410, 6.2.7.2). */
const QUEDA_MAX=4;
/* Únicos valores de Iz trazidos para o jogo, conferidos na NBR 5410, tabela 36
   (método B1, 2 condutores carregados). Para outros casos o aluno consulta a tabela. */
const IZ_EXEMPLOS=[{s:1.5,iz:17.5},{s:2.5,iz:24}];

/* número em português: 25 → "25"; 2.58 → "2,58" */
const fmtN=(v,casas)=>Number(v).toLocaleString('pt-BR',{maximumFractionDigits:casas===undefined?2:casas});
const okNum=v=>typeof v==='number'&&isFinite(v);

const CALC={
  /* I = P ÷ U (monofásico, carga resistiva; fator de potência 1) */
  corrente(P,U){if(!okNum(P)||!okNum(U)||U<=0||P<0)return null;const I=P/U;
    return {I,passos:['I = P ÷ U','I = '+fmtN(P)+' W ÷ '+fmtN(U)+' V','I = '+fmtN(I)+' A']}},
  /* P = U × I */
  potencia(U,I){if(!okNum(U)||!okNum(I)||U<0||I<0)return null;const P=U*I;
    return {P,passos:['P = U × I','P = '+fmtN(U)+' V × '+fmtN(I)+' A','P = '+fmtN(P)+' W']}},
  /* R = U ÷ I */
  resistencia(U,I){if(!okNum(U)||!okNum(I)||I<=0||U<0)return null;const R=U/I;
    return {R,passos:['R = U ÷ I','R = '+fmtN(U)+' V ÷ '+fmtN(I)+' A','R = '+fmtN(R)+' Ω']}},
  /* consumo (kWh) = P (W) × horas por dia × dias ÷ 1000; custo = kWh × tarifa */
  consumo(P,horas,dias,tarifa){if(![P,horas,dias].every(okNum)||P<0||horas<0||horas>24||dias<0)return null;
    const kwh=P*horas*dias/1000,custo=okNum(tarifa)&&tarifa>=0?kwh*tarifa:null;
    const passos=['E = P × h × dias ÷ 1000','E = '+fmtN(P)+' W × '+fmtN(horas)+' h × '+fmtN(dias,0)+' ÷ 1000','E = '+fmtN(kwh)+' kWh'];
    if(custo!==null)passos.push('Custo = '+fmtN(kwh)+' kWh × R$ '+fmtN(tarifa,2)+' = R$ '+fmtN(custo,2));
    return {kwh,custo,passos}},
  /* queda de tensão em circuito monofásico (ida e volta): ΔU = 2 × ρ × L × I ÷ S */
  queda(I,L,S,U,rho){rho=rho||RHO_CU;if(![I,L,S,U].every(okNum)||I<0||L<0||S<=0||U<=0)return null;
    const dv=2*rho*L*I/S,pct=dv/U*100,ok=pct<=QUEDA_MAX;
    return {dv,pct,ok,passos:['ΔU = 2 × ρ × L × I ÷ S','ΔU = 2 × '+fmtN(rho,4)+' × '+fmtN(L)+' m × '+fmtN(I)+' A ÷ '+fmtN(S)+' mm²',
      'ΔU = '+fmtN(dv)+' V','ΔU% = '+fmtN(dv)+' ÷ '+fmtN(U)+' × 100 = '+fmtN(pct)+' %',
      ok?'Até '+QUEDA_MAX+' %: dentro do limite.':'Acima de '+QUEDA_MAX+' %: aumente a bitola ou encurte o circuito.']}},
  /* disjuntor: menor corrente nominal padronizada com In ≥ Ib, depois confere In ≤ Iz */
  disjuntor(Ib,Iz){if(!okNum(Ib)||Ib<=0)return null;const In=DJ_PADRAO.find(v=>v>=Ib)||null;const temIz=okNum(Iz)&&Iz>0;
    const ok=!!In&&(!temIz||In<=Iz);
    const passos=['Ib ≤ In ≤ Iz (NBR 5410, 5.3.4.1)','Ib = '+fmtN(Ib)+' A → menor disjuntor padronizado com In ≥ Ib: '+(In?In+' A':'nenhum até 63 A')];
    if(In&&temIz)passos.push(In<=Iz?'In = '+In+' A ≤ Iz = '+fmtN(Iz)+' A: o cabo aguenta o disjuntor.':'In = '+In+' A > Iz = '+fmtN(Iz)+' A: o disjuntor deixaria o cabo esquentar. Use um cabo de bitola maior.');
    return {In,ok,temIz,passos}}
};
