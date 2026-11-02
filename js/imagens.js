/* Imagens do jogo (WebP em img/). Para trocar uma arte, substitua o arquivo mantendo o nome. */
const IMG={};
['chico','fatima','aprendiz','oficina','eletricista','aprendiz_body','eletricista_body','calango','calango_body','chico_body','fatima_body'].forEach(k=>{IMG[k]=new URL('img/'+k+'.webp',document.baseURI).href});
