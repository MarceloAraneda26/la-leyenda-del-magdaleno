/* Los tests del motor recorren las charlas automáticamente. story-check prueba la UI sin este ayudante. */
module.exports=async page=>page.addInitScript(()=>document.addEventListener('DOMContentLoaded',()=>{
 const story=window.Magdaleno?.story;if(!story)return;const open=story.open;
 story.open=options=>{open(options);let limit=100;while(story.active&&limit-->0)story.next();if(story.active)throw Error('Conversación sin cierre en el test.');};
},{once:true}));
