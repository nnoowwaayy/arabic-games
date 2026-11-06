import type {GameMode,Locale} from './game-types';
export async function downloadScorecard(game:GameMode,score:number,locale:Locale){
 await document.fonts.ready;const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1000;const c=canvas.getContext('2d');if(!c)return;
 const rtl=locale==='ary'||locale==='ar';c.fillStyle='#101115';c.fillRect(0,0,1000,1000);
 c.strokeStyle='#3b343b';c.lineWidth=2;c.beginPath();c.roundRect(45,45,910,910,35);c.stroke();
 c.fillStyle='#f36d5c';c.font='900 42px "DM Sans", sans-serif';c.textAlign='center';c.fillText('KTER WLA 9EL',500,140);
 c.fillStyle='#b4a8b5';c.font='500 24px "Noto Sans Arabic", "DM Sans", sans-serif';c.fillText('كتر ولا قل',500,188);
 c.fillStyle='#f0e5d7';c.font='700 42px "Noto Sans Arabic", "DM Sans", sans-serif';c.direction=rtl?'rtl':'ltr';c.fillText(game.title[locale],500,330,810);
 c.direction='ltr';c.fillStyle='#e8bb6c';c.font='800 210px "DM Sans", sans-serif';c.fillText(String(score),500,590);
 c.fillStyle='#b4a8b5';c.font='500 30px "Noto Sans Arabic", "DM Sans", sans-serif';c.direction=rtl?'rtl':'ltr';c.fillText(locale==='en'?'Think you can beat that?':locale==='fr'?'Tu peux faire mieux ?':locale==='ar'?'هل يمكنك تجاوز هذه النتيجة؟':'واش تقدر تجيب كثر؟',500,680);
 c.fillStyle='#f36d5c';c.font='600 23px "DM Sans", sans-serif';c.direction='ltr';c.fillText(window.location.host,500,840,800);
 c.fillStyle='#807582';c.font='400 19px "DM Sans", sans-serif';c.fillText(`${new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Casablanca'}).format(new Date())} · Morocco`,500,891);
 const url=canvas.toDataURL('image/png');const link=document.createElement('a');link.href=url;link.download=`kter-${game.id}-${score}.png`;link.click();
}
