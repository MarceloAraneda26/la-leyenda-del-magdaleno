/* Precondición de los tests aislados de cada etapa; no es un atajo del juego. */
module.exports=async(page,completed=2)=>page.addInitScript(completed=>{
 let current=null;try{current=JSON.parse(localStorage.getItem('magdaleno_campaign_v1')||'null');}catch{}
 if(!current||current.completed<completed)localStorage.setItem('magdaleno_campaign_v1',JSON.stringify({version:1,completed,hero:'marcelo'}));
},completed);
