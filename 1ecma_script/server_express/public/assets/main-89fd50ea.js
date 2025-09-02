import"./styles-492164b4.js";class m{constructor(n,l,e){this.principal=n,this.years=l,this.rate=e}get monthlyPayment(){let n=this.rate/100/12;return this.principal*n/(1-Math.pow(1/(1+n),this.years*12))}get amortization(){let n=this.monthlyPayment,l=this.rate/100/12,e=this.principal,i=[];for(let t=0;t<this.years;t++){let a=0,r=0;for(let s=0;s<12;s++){let d=e*l,o=n-d;a=a+d,r=r+o,e=e-o}i.push({principalY:r,interestY:a,balance:e})}return i}}document.getElementById("mode").innerHTML="Production";document.getElementById("calcBtn").addEventListener("click",()=>{let c=document.getElementById("principal").value,n=document.getElementById("years").value,l=document.getElementById("rate").value,e=new m(c,n,l);document.getElementById("monthlyPayment").innerHTML=e.monthlyPayment.toFixed(2),document.getElementById("monthlyRate").innerHTML=(l/12).toFixed(2);let i="";e.amortization.forEach((t,a)=>i+=`
       <tr>
           <td>${a+1}</td>
           <td class="currency">${Math.round(t.principalY)}</td>
           <td class="stretch">
               <div class="flex">
                   <div class="bar principal"
                        style="flex:${t.principalY};-webkit-flex:${t.principalY}">
                   </div>
                   <div class="bar interest"
                        style="flex:${t.interestY};-webkit-flex:${t.interestY}">
                   </div>
               </div>
           </td>
           <td class="currency left">${Math.round(t.interestY)}</td>
           <td class="currency">${Math.round(t.balance)}</td>
       </tr>
   `),document.getElementById("amortization").innerHTML=i});
