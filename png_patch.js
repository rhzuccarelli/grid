// PNG export patch injected inside the main app closure.
const reportGroup = [...document.querySelectorAll('.group')].find(g => g.querySelector('#exportReport'));
if(reportGroup && !document.getElementById('exportPNG')){
  const gap=document.createElement('div'); gap.style.height='8px';
  const btn=document.createElement('button'); btn.id='exportPNG'; btn.textContent='Export annotated PNG';
  const note=document.createElement('div'); note.className='small'; note.style.marginTop='8px';
  note.textContent='Crops to the nearest interior grid lines at the image edges and embeds landmarks, dimensions and measurements.';
  reportGroup.append(gap,btn,note);
}
function pngCrop(){
 const r=rect(),g=gridSpec(); if(!img||!r||!g)return null;
 const c=g.cell;
 const x0=r.x+Math.ceil((0-r.x)/c)*c, x1=r.x+Math.floor((img.width-r.x)/c)*c;
 const y0=r.y+Math.ceil((0-r.y)/c)*c, y1=r.y+Math.floor((img.height-r.y)/c)*c;
 return x1>x0&&y1>y0?{x:x0,y:y0,w:x1-x0,h:y1-y0}:{x:0,y:0,w:img.width,h:img.height};
}
function pngWrap(c,t,w){
 const words=String(t).split(/\s+/),out=[]; let line='';
 for(const word of words){const q=line?line+' '+word:word;if(line&&c.measureText(q).width>w){out.push(line);line=word}else line=q}
 if(line)out.push(line); return out;
}
function exportPNG(){
 const r=rect(),g=gridSpec(),mm=mmSpec(),crop=pngCrop();
 if(!img||!r||!g||!crop){alert('Load an image and define the four product limits before exporting PNG.');return}
 const ratio=r.w/r.h,fr=nearestFraction(ratio,20),common=commonRatioName(ratio);
 const lines=[`Aspect W:H ${ratio.toFixed(3)}:1 ≈ ${fr.n}:${fr.d} (${common.name})`,`Grid ${g.cols} × ${g.rows} · cell ${mm?mm.cellmm.toFixed(2)+' mm':g.cell.toFixed(2)+' px'}`];
 if(mm)lines.push(`Product dimensions ${mm.wmm.toFixed(1)} × ${mm.hmm.toFixed(1)} mm`);
 marks.forEach((m,i)=>{const u=(m.x-r.x)/r.w,v=(m.y-r.y)/r.h,fx=nearestFraction(u,12),fy=nearestFraction(v,12);let s=`L${i+1}: x ${(u*100).toFixed(1)}% ≈ ${fx.n}/${fx.d} W · y ${(v*100).toFixed(1)}% ≈ ${fy.n}/${fy.d} H`;if(mm)s+=` · ${((m.x-r.x)*mm.mmPerPx).toFixed(1)} mm left · ${((m.y-r.y)*mm.mmPerPx).toFixed(1)} mm top`;lines.push(s)});
 measures.forEach((m,i)=>{const dx=m.b.x-m.a.x,dy=m.b.y-m.a.y,d=Math.hypot(dx,dy);let s=`M${i+1}: ${mm?(d*mm.mmPerPx).toFixed(2)+' mm':d.toFixed(2)+' px'}`;if(mm)s+=` · ΔX ${(Math.abs(dx)*mm.mmPerPx).toFixed(2)} mm · ΔY ${(Math.abs(dy)*mm.mmPerPx).toFixed(2)} mm`;lines.push(s)});
 const pad=Math.max(18,Math.round(crop.w*.018)),font=Math.max(16,Math.round(crop.w*.017)),lh=Math.round(font*1.45);
 const tc=document.createElement('canvas').getContext('2d');tc.font=`${font}px system-ui`;const rendered=lines.flatMap(s=>pngWrap(tc,s,crop.w-pad*2));
 const footer=pad*2+lh*(rendered.length+1),out=document.createElement('canvas');out.width=Math.round(crop.w);out.height=Math.round(crop.h+footer);const c=out.getContext('2d');
 c.drawImage(img,crop.x,crop.y,crop.w,crop.h,0,0,crop.w,crop.h);
 c.save();c.globalAlpha=+$('opacity').value/100;c.strokeStyle='#00a67d';c.lineWidth=Math.max(1,crop.w/1300);
 const sx=r.x+Math.ceil((crop.x-r.x)/g.cell)*g.cell,sy=r.y+Math.ceil((crop.y-r.y)/g.cell)*g.cell;
 for(let x=sx;x<=crop.x+crop.w+.5;x+=g.cell){let xx=x-crop.x;c.beginPath();c.moveTo(xx,0);c.lineTo(xx,crop.h);c.stroke()}
 for(let y=sy;y<=crop.y+crop.h+.5;y+=g.cell){let yy=y-crop.y;c.beginPath();c.moveTo(0,yy);c.lineTo(crop.w,yy);c.stroke()}c.restore();
 c.strokeStyle='#1677ff';c.lineWidth=Math.max(2,crop.w/900);c.strokeRect(r.x-crop.x,r.y-crop.y,r.w,r.h);
 if($('centers').checked){c.save();c.strokeStyle='#f59e0b';c.lineWidth=Math.max(2,crop.w/1000);c.setLineDash([crop.w/120,crop.w/170]);c.beginPath();c.moveTo(r.x+r.w/2-crop.x,r.y-crop.y);c.lineTo(r.x+r.w/2-crop.x,r.y+r.h-crop.y);c.moveTo(r.x-crop.x,r.y+r.h/2-crop.y);c.lineTo(r.x+r.w-crop.x,r.y+r.h/2-crop.y);c.stroke();c.restore()}
 marks.forEach((m,i)=>{const x=m.x-crop.x,y=m.y-crop.y;if(x<0||x>crop.w||y<0||y>crop.h)return;c.save();c.strokeStyle=c.fillStyle='#e5484d';c.lineWidth=Math.max(1.5,crop.w/1100);c.setLineDash([crop.w/150,crop.w/190]);if(m.axisX){c.beginPath();c.moveTo(0,y);c.lineTo(crop.w,y);c.stroke()}if(m.axisY){c.beginPath();c.moveTo(x,0);c.lineTo(x,crop.h);c.stroke()}c.setLineDash([]);const rr=Math.max(7,crop.w/180);c.beginPath();c.arc(x,y,rr,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.font=`${Math.max(12,crop.w/75)}px system-ui`;c.textAlign='center';c.textBaseline='middle';c.fillText(i+1,x,y);c.restore()});
 measures.forEach(m=>{const ax=m.a.x-crop.x,ay=m.a.y-crop.y,bx=m.b.x-crop.x,by=m.b.y-crop.y;c.save();c.strokeStyle=c.fillStyle='#7c3aed';c.lineWidth=Math.max(2,crop.w/900);c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();const rr=Math.max(5,crop.w/220);[[ax,ay],[bx,by]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,rr,0,Math.PI*2);c.fill()});const d=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y),label=mm?`${(d*mm.mmPerPx).toFixed(1)} mm`:`${d.toFixed(1)} px`,mx=(ax+bx)/2,my=(ay+by)/2;c.font=`${Math.max(13,crop.w/72)}px system-ui`;const tw=c.measureText(label).width;c.fillStyle='rgba(255,255,255,.92)';c.fillRect(mx-tw/2-6,my-25,tw+12,22);c.fillStyle='#111';c.textAlign='center';c.textBaseline='middle';c.fillText(label,mx,my-14);c.restore()});
 c.fillStyle='#fff';c.fillRect(0,crop.h,crop.w,footer);c.fillStyle='#111';c.textAlign='left';c.textBaseline='top';c.font=`600 ${Math.round(font*1.08)}px system-ui`;c.fillText('Product Grid Analysis',pad,crop.h+pad);c.font=`${font}px system-ui`;let yy=crop.h+pad+lh;rendered.forEach(s=>{c.fillText(s,pad,yy);yy+=lh});
 out.toBlob(blob=>{if(!blob)return;const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='product-grid-analysis.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200)},'image/png');
}
document.getElementById('exportPNG')?.addEventListener('click',exportPNG);
