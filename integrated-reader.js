/* SAD Markdown reader: integrated-notes.md is the source of truth. */
(function(){
"use strict";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const inline=s=>esc(s).replace(/\x60([^\x60]+)\x60/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
const sep=s=>/^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(s);
const cells=s=>s.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(x=>x.trim());
function renderMarkdown(markdown){
 const lines=markdown.replace(/\r/g,"").split("\n"),out=[];let i=0,opened=false;
 const close=()=>{if(opened){out.push("</section>");opened=false}};
 while(i<lines.length){
  const t=lines[i].trim();
  if(!t||/^<!--.*-->$/.test(t)){i++;continue}
  const h=t.match(/^(#{1,3})\s+(.+)$/);
  if(h){let n=h[1].length;if(n===1){close();out.push('<header class="sad-md-head"><h1>'+inline(h[2])+'</h1></header>')}
   else if(n===2){close();opened=true;out.push('<section class="sad-md-card"><h2>'+inline(h[2])+'</h2>')}
   else out.push("<h3>"+inline(h[2])+"</h3>");i++;continue}
  if(t.startsWith("|")&&i+1<lines.length&&sep(lines[i+1])){
   out.push('<div class="sad-md-tablewrap"><table><thead><tr>'+cells(t).map(c=>'<th scope="col">'+inline(c)+'</th>').join("")+'</tr></thead><tbody>');i+=2;
   while(i<lines.length&&lines[i].trim().startsWith("|")){out.push("<tr>"+cells(lines[i]).map(c=>"<td>"+inline(c)+"</td>").join("")+"</tr>");i++}
   out.push("</tbody></table></div>");continue
  }
  if(/^[-*]\s+/.test(t)){out.push('<ul class="sad-md-list">');while(i<lines.length&&/^[-*]\s+/.test(lines[i].trim())){out.push("<li>"+inline(lines[i].trim().replace(/^[-*]\s+/,""))+"</li>");i++}out.push("</ul>");continue}
  if(/^\d+\.\s+/.test(t)){out.push('<ol class="sad-md-list">');while(i<lines.length&&/^\d+\.\s+/.test(lines[i].trim())){out.push("<li>"+inline(lines[i].trim().replace(/^\d+\.\s+/,""))+"</li>");i++}out.push("</ol>");continue}
  if(/^>\s?/.test(t)){const x=[];while(i<lines.length&&/^>\s?/.test(lines[i].trim())){x.push(inline(lines[i].trim().replace(/^>\s?/,"")));i++}out.push('<blockquote class="sad-md-lead">'+x.join(" ")+"</blockquote>");continue}
  const p=[t];i++;while(i<lines.length){const n=lines[i].trim();if(!n||/^(#{1,3})\s+/.test(n)||/^[-*]\s+/.test(n)||/^\d+\.\s+/.test(n)||/^>\s?/.test(n)||n.startsWith("|")||/^<!--.*-->$/.test(n))break;p.push(n);i++}
  out.push('<p'+(/^\*\*Source\*\*/.test(p[0])?' class="sad-md-source"':"")+">"+inline(p.join(" "))+"</p>")
 }
 close();return out.join("")
}
function splitChapters(md){const marks=[...md.matchAll(/<!-- SAD:CH([1-8]) -->/g)],notes={};marks.forEach((m,i)=>{const end=i+1<marks.length?marks[i+1].index:md.length;notes[+m[1]]=md.slice(m.index+m[0].length,end).trim()});return notes}
window.SAD_INTEGRATION={notes:{},renderMarkdown,loading:true,error:null};
fetch("integrated-notes.md",{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error("Integrated notes HTTP "+r.status);return r.text()}).then(md=>{const notes=splitChapters(md);if(Object.keys(notes).length!==8)throw Error("Expected 8 chapters");window.SAD_INTEGRATION.notes=notes;window.SAD_INTEGRATION.loading=false;if(typeof window.render==="function")window.render()}).catch(err=>{window.SAD_INTEGRATION.loading=false;window.SAD_INTEGRATION.error=err.message;console.warn("SAD integrated notes",err);if(typeof window.render==="function")window.render()});
})();