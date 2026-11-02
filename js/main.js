/* Início do jogo: carrega por último, depois de todos os módulos. */
document.documentElement.style.setProperty('--art','url('+IMG.oficina+')');
if(S.mode&&S.char)showMap();else showStart();
