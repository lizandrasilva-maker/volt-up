/* ================= SIMULADOR DE CORRENTE CONTÍNUA (bancada CC) =================
   Só física: monta os nós, resolve as tensões e diz o que aconteceu (eventos). Não tem texto de missão
   (isso fica em js/lanterna.js) nem desenho (o desenho usa o resultado adaptado por paraBancada()).

   Premissas do modelo (aparecem no aviso da bancada):
   - Pilha = fonte de 1,5 V com resistência interna de 0,2 Ω (equivalente de Norton: corrente V/r em paralelo com 1/r).
   - Lâmpada = resistor fixo R = Vn ÷ In (lanterna: 3 V e 0,3 A → 10 Ω). No filamento real, R cresce com a temperatura.
   - Lâmpada com mais de 1,35 × Vn queima (o filamento rompe e o circuito abre).
   - Curto = pilha entregando mais de 2 A (com 0,2 Ω de resistência interna, um fio direto dá cerca de 7,5 A).
   - Interruptor e fio: resistência zero. Regime permanente (sem transitórios). */
const CC={R_INTERNA:0.2,VN:3,IN:0.3,QUEIMA:1.35,I_CURTO:2,
  /* resistência da lâmpada (Ω) */
  rLamp(c){return (c.Vn||CC.VN)/(c.In||CC.IN)},
  /* resolve o circuito; pilhaV permite trocar a tensão de uma pilha (usado para achar pilha invertida) */
  resolver(comps,wires,pilhaV){
    const u=UF();
    comps.forEach(c=>{terms(c).forEach((_,k)=>u.find(c.id+'.'+k));links(c).forEach(([a,b])=>u.union(c.id+'.'+a,c.id+'.'+b))});
    wires.forEach(w=>{if(!w.broken)u.union(w.a,w.b)});
    const nets=[...new Set(comps.flatMap(c=>terms(c).map((_,k)=>u.find(c.id+'.'+k))))];
    const pilhas=comps.filter(c=>c.type==='pilha');
    const ref=pilhas.length?u.find(pilhas[0].id+'.1'):nets[0];      /* 0 V: o − da primeira pilha */
    const idx={};let m=0;nets.forEach(n=>{if(n!==ref)idx[n]=m++});
    const G=Array.from({length:m},()=>Array(m+1).fill(0));for(let i=0;i<m;i++)G[i][i]=1e-9;
    const I=n=>n===ref?-1:idx[n];
    const cond=(a,b,g)=>{const A=I(a),B=I(b);if(A>=0){G[A][A]+=g;if(B>=0)G[A][B]-=g}if(B>=0){G[B][B]+=g;if(A>=0)G[B][A]-=g}};
    const inj=(n,i)=>{const A=I(n);if(A>=0)G[A][m]+=i};
    /* fem: a pilha fraca (caça-defeito) tem fem própria; o rótulo continua mostrando a tensão nominal c.V */
    const Vp=c=>pilhaV&&pilhaV[c.id]!==undefined?pilhaV[c.id]:c.fem!==undefined?c.fem:(c.V||1.5);
    comps.forEach(c=>{
      if(c.type==='lamp'&&!c.broken)cond(u.find(c.id+'.0'),u.find(c.id+'.1'),1/CC.rLamp(c));
      if(c.type==='resistor')cond(u.find(c.id+'.0'),u.find(c.id+'.1'),1/(c.R||100));
      if(c.type==='pilha'){const g=1/CC.R_INTERNA,p=u.find(c.id+'.0'),n=u.find(c.id+'.1');cond(p,n,g);inj(p,Vp(c)*g);inj(n,-Vp(c)*g)}});
    /* eliminação de Gauss com pivô parcial */
    for(let c=0;c<m;c++){let p=c;for(let r=c+1;r<m;r++)if(Math.abs(G[r][c])>Math.abs(G[p][c]))p=r;[G[c],G[p]]=[G[p],G[c]];
      const d=G[c][c];if(Math.abs(d)<1e-15)continue;for(let r=0;r<m;r++){if(r===c)continue;const k=G[r][c]/d;if(k)for(let j=c;j<=m;j++)G[r][j]-=k*G[c][j]}}
    const vNet=n=>n===ref?0:(G[idx[n]][idx[n]]?G[idx[n]][m]/G[idx[n]][idx[n]]:0);
    const v=t=>vNet(u.find(t));
    const res={v,net:t=>u.find(t),lampadas:{},pilhas:{},eventos:[]};
    comps.forEach(c=>{
      if(c.type==='lamp'){const V=Math.abs(v(c.id+'.0')-v(c.id+'.1')),i=c.broken?0:V/CC.rLamp(c),Vn=c.Vn||CC.VN;
        res.lampadas[c.id]={V:c.broken?0:V,I:i,P:i*V,brilho:c.broken?0:Math.min(1,(V/Vn)**2),queima:!c.broken&&V>CC.QUEIMA*Vn}}
      if(c.type==='pilha'){const dv=v(c.id+'.0')-v(c.id+'.1'),i=(Vp(c)-dv)/CC.R_INTERNA;res.pilhas[c.id]={V:dv,I:i}}});
    const L=Object.values(res.lampadas),P=Object.values(res.pilhas);
    if(P.some(p=>p.I>CC.I_CURTO))res.eventos.push('curto');
    if(L.some(l=>l.queima))res.eventos.push('queima');
    if(L.some(l=>l.I>0.01))res.eventos.push(L.some(l=>l.brilho<0.5&&l.I>0.01)?'fraca':'funcionando');
    else res.eventos.push('aberto');
    return res},
  /* pilha invertida: com a lâmpada apagada, virar alguma pilha faria corrente passar? */
  pilhaInvertida(comps,wires){
    const base=CC.resolver(comps,wires);if(Object.values(base.lampadas).some(l=>l.I>0.01))return null;
    for(const p of comps.filter(c=>c.type==='pilha')){const t=CC.resolver(comps,wires,{[p.id]:-(p.V||1.5)});
      if(Object.values(t.lampadas).some(l=>l.I>0.05))return p.id}
    return null},
  /* resultado no formato que a bancada já desenha (lâmpada acesa, curto, multímetro) */
  paraBancada(res){const lamp={};for(const [id,l] of Object.entries(res.lampadas))lamp[id]=l.brilho;
    return {lamp,coil:{},short:res.eventos.includes('curto'),net:res.net,vAt:t=>Math.abs(res.v(t)),vDiff:(a,b)=>Math.abs(res.v(a)-res.v(b)),cc:res}},
  /* fios do caminho do curto (para a animação): os ligados aos bornes da pilha em curto */
  fiosDoCurto(st,res){const nets=new Set();for(const [id,p] of Object.entries(res.pilhas))if(p.I>CC.I_CURTO){nets.add(res.net(id+'.0'));nets.add(res.net(id+'.1'))}
    return st.wires.map((w,i)=>i).filter(i=>nets.has(res.net(st.wires[i].a)))}
};
/* número com vírgula: 2.88 → "2,88" */
const ccN=(x,c)=>Number(x).toLocaleString('pt-BR',{maximumFractionDigits:c===undefined?2:c,minimumFractionDigits:c===undefined?0:c});
