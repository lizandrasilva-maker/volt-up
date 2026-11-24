/* Nuvem (Supabase): login e progresso salvo online.
   A chave abaixo é a "publishable": foi feita para ficar no navegador. Quem protege os dados
   são as regras de segurança (RLS) no banco. A chave secreta nunca entra neste repositório. */
const NUVEM_URL='https://jgsyvjpygusebawsqyjs.supabase.co';
const NUVEM_CHAVE='sb_publishable_GbRr4CEgf5hJP2I_ZELYxQ_9qzmVk7L';
const ALUNO_DOMINIO='@aluno.volt-up.app'; // login por código: <codigo>@aluno.volt-up.app
const nuvem=(window.supabase&&window.supabase.createClient)?window.supabase.createClient(NUVEM_URL,NUVEM_CHAVE):null;

async function nuvemUsuario(){if(!nuvem)return null;try{const {data}=await nuvem.auth.getSession();return data.session?data.session.user:null}catch(e){return null}}

/* Dados da conta usados no menu: apelido, papel (aluno, professor, admin, validador) e validade do acesso. */
window.CONTA=null;
async function nuvemConta(){
  const u=await nuvemUsuario();if(!u)return null;
  try{const [{data:p},{data:ate}]=await Promise.all([
      nuvem.from('perfis').select('apelido,papel').eq('id',u.id).maybeSingle(),nuvem.rpc('validade_acesso')]);
    window.CONTA={id:u.id,apelido:(p&&p.apelido)||'',papel:(p&&p.papel)||'aluno',validade:ate||null};
  }catch(e){window.CONTA={id:u.id,apelido:'',papel:'aluno',validade:null}}
  return window.CONTA;
}

/* Baixa o progresso da nuvem para o navegador (usado logo depois do login). */
async function nuvemPuxar(){
  const u=await nuvemUsuario();if(!u)return null;
  const {data}=await nuvem.from('progresso').select('estado').eq('user_id',u.id).maybeSingle();
  if(data&&data.estado&&Object.keys(data.estado).length){try{localStorage.setItem('neuro-eletricista-v2',JSON.stringify(data.estado))}catch(e){}}
  return data?data.estado:null;
}

/* Envia o progresso; agrupa vários saves seguidos em um só envio. */
let _nuvemT=null;
function nuvemEmpurrar(estado){
  if(!nuvem)return;clearTimeout(_nuvemT);
  _nuvemT=setTimeout(async()=>{const u=await nuvemUsuario();if(!u)return;
    await nuvem.from('progresso').upsert({user_id:u.id,estado,atualizado_em:new Date().toISOString()});},1500);
}

/* Dentro do jogo: cada save() local também vai para a nuvem, se houver login. */
if(typeof save==='function'&&typeof S!=='undefined'){
  const _saveLocal=save;
  save=function(){_saveLocal();nuvemEmpurrar(S)};
}
