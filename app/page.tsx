"use client";
import { useEffect, useMemo, useRef, useState } from "react";

const lessons=[
 {id:"voa",level:"A2",type:"VOA",title:"Lesson 1: Welcome!",source:"VOA Learning English",url:"https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",video:"https://voa-video.voanews.eu/pangeavideo/2021/02/5/5f/5f00c78a-0f84-41e6-949d-bd808bcadf50_720p.mp4",sentences:["Hi! Are you Anna?","Yes! Hi there! Are you Pete?","I am Pete.","Nice to meet you.","Let's try that again. I'm Anna. Nice to meet you.","I'm Pete. Anna, is that A-N-A?","No. A-N-N-A.","Well, Anna with two n's. Welcome to 1400 Irving Street!","My new apartment! Yes!"]},
 {id:"hygiene",level:"B1",type:"DENTAL",title:"Protect your oral health",source:"NIDCR",url:"https://www.nidcr.nih.gov/health-info/oral-hygiene",video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",sentences:["Good oral health helps you enjoy life.","To keep your teeth healthy, it is important to remove dental plaque.","Plaque buildup can cause tooth decay and gum disease.","Use fluoride toothpaste and angle the bristles toward the gumline.","Brush gently using small, circular motions.","Visit the dentist for routine check-ups and professional cleaning."]},
 {id:"exam",level:"B2",type:"CLINICAL",title:"The concise oral exam",source:"NIDCR Clinical Director",url:"https://www.nidcr.nih.gov/research/conducted-at-nidcr/clinical-director/oral-exam",video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",sentences:["Oral health is important in its own right.","The mouth can provide clues to many aspects of a patient's overall health.","A comprehensive oral exam can be completed in five minutes or less.","The exam offers an opportunity to detect early indications of systemic diseases.","Diabetes, HIV, and Sjogren's syndrome can manifest in the head and neck region."]}
];
const expressions=[
 ["Research focus","My research focuses on periodontal regeneration and bone metabolism."],
 ["Research gap","However, the underlying mechanism remains poorly understood."],
 ["Study aim","Therefore, this study aimed to investigate whether..."],
 ["Methods","We established a mouse model of periodontitis to investigate..."],
 ["Key result","Our results demonstrated that..."],
 ["Novelty","The major novelty of our study is that we identified..."],
 ["Discussion","These findings provide new insights into..."],
 ["Reviewer response","We appreciate the reviewer’s insightful comments."]
];
const tasks=[{id:"listen",time:25,label:"精听训练",sub:"VOA · Lesson 1: Welcome!",icon:"耳"},{id:"speak",time:20,label:"科研口语",sub:"2分钟介绍你的研究方向",icon:"声"},{id:"academic",time:10,label:"学术表达",sub:"学习并朗读 5 个高频句型",icon:"研"},{id:"review",time:5,label:"复盘",sub:"整理今天的生词与表达",icon:"记"}];
type Note={id:number;original:string;translation:string;lesson:string};
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ").trim();

export default function Home(){
 const [view,setView]=useState("today"),[lessonId,setLessonId]=useState("voa"),[index,setIndex]=useState(0),[answer,setAnswer]=useState(""),[checked,setChecked]=useState(false),[speed,setSpeed]=useState(1),[done,setDone]=useState<string[]>([]),[notes,setNotes]=useState<Note[]>([]),[menu,setMenu]=useState<{x:number;y:number;text:string}|null>(null),[showTranscript,setShowTranscript]=useState(false),[recording,setRecording]=useState(false),[practice,setPractice]=useState(0);
 const videoRef=useRef<HTMLVideoElement>(null); const lesson=lessons.find(l=>l.id===lessonId)!; const sentence=lesson.sentences[index];
 const score=useMemo(()=>{const a=norm(answer).split(" "),b=norm(sentence).split(" ");return Math.round(b.filter((w,i)=>a[i]===w).length/b.length*100)},[answer,sentence]);
 const minutes=tasks.filter(t=>done.includes(t.id)).reduce((s,t)=>s+t.time,0);
 useEffect(()=>{try{setDone(JSON.parse(localStorage.getItem("sang-progress")||"[]"));setNotes(JSON.parse(localStorage.getItem("lingoloop-notes")||"[]"))}catch{}},[]);
 useEffect(()=>localStorage.setItem("sang-progress",JSON.stringify(done)),[done]); useEffect(()=>localStorage.setItem("lingoloop-notes",JSON.stringify(notes)),[notes]);
 function speak(){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sentence);u.lang="en-US";u.rate=speed;speechSynthesis.speak(u)}
 function move(d:number){setIndex(i=>Math.max(0,Math.min(lesson.sentences.length-1,i+d)));setAnswer("");setChecked(false)}
 async function translate(){if(!menu)return;const original=menu.text;setMenu(null);let translation="";try{const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(original)}&langpair=en|zh-CN`);translation=(await r.json())?.responseData?.translatedText||""}catch{translation="翻译暂时不可用"}setNotes(n=>[{id:Date.now(),original,translation,lesson:lesson.title},...n])}
 const toggle=(id:string)=>setDone(d=>d.includes(id)?d.filter(x=>x!==id):[...d,id]);
 return <main onClick={()=>setMenu(null)} onContextMenu={e=>{const text=getSelection()?.toString().trim();if(text){e.preventDefault();setMenu({x:e.clientX,y:e.clientY,text})}}}>
  {menu&&<button className="context" style={{left:menu.x,top:menu.y}} onClick={e=>{e.stopPropagation();void translate()}}>译成中文并保存到笔记</button>}
  <aside className="sidebar">
   <div className="logo">S<span>/</span>ENGLISH</div><p className="planLabel">PHD ENGLISH PLAN</p>
   <nav>{[["today","今日训练","01"],["listen","精听实验室","02"],["speak","科研口语","03"],["library","表达资料库","04"],["notes","我的笔记","05"]].map(x=><button key={x[0]} className={view===x[0]?"active":""} onClick={()=>setView(x[0])}><i>{x[2]}</i>{x[1]}</button>)}</nav>
   <div className="level"><div><b>B1<span>→</span>B2</b><small>6-MONTH TARGET</small></div><div className="levelbar"><i style={{width:"24%"}}/></div><p>第 2 周 · 基础听力阶段</p></div>
   <div className="profile"><div>SZ</div><span><b>Sang Zhao</b><small>Oral Medicine PhD</small></span></div>
  </aside>
  <div className="shell">
   <header><div><p>GOOD EVENING, SANG</p><h1>{view==="today"?"今天，向流利表达再近一步。":view==="listen"?"精听实验室":view==="speak"?"科研口语训练":view==="library"?"学术表达资料库":"我的学习笔记"}</h1></div><div className="daycount"><b>12</b><span>DAY<br/>STREAK</span></div></header>

   {view==="today"&&<>
    <section className="heroGrid"><article className="daily"><div className="dailyTop"><span>DAILY / 60 MIN</span><b>{minutes}<small>/60</small></b></div><h2>今日训练路径</h2><div className="taskList">{tasks.map((t,i)=><button key={t.id} onClick={()=>toggle(t.id)} className={done.includes(t.id)?"done":""}><span className="num">0{i+1}</span><i>{t.icon}</i><span><b>{t.label}</b><small>{t.sub}</small></span><em>{t.time} min</em><strong>{done.includes(t.id)?"✓":"○"}</strong></button>)}</div></article>
     <article className="focus"><p>THIS MONTH&apos;S FOCUS</p><h2>听觉识别<br/>与语音节奏</h2><div className="ear">60<small>EF LISTENING</small></div><blockquote>“看到认识，听到也能立即理解。”</blockquote><div className="mini"><span><b>5</b> days / week</span><span><b>60</b> min / day</span></div></article></section>
    <section className="sectionHead"><div><p>WEEK 02 · FOUNDATION</p><h2>本周训练安排</h2></div><span>听力 40% · 口语 30% · 学术 20% · 复盘 10%</span></section>
    <div className="week">{["MON\n医学新闻","TUE\nTED 医学","WED\nNature Podcast","THU\nSCI Presentation","FRI\n5-min Summary","SAT\n朗读 Abstract","SUN\n轻松泛听"].map((d,i)=><div key={d} className={i===0?"now":""}><b>{d.split("\n")[0]}</b><span>{d.split("\n")[1]}</span><i>{i<1?"✓":i===1?"TODAY":""}</i></div>)}</div>
   </>}

   {view==="listen"&&<section className="lab"><div className="lessonTabs">{lessons.map(l=><button key={l.id} className={lessonId===l.id?"active":""} onClick={()=>{setLessonId(l.id);setIndex(0);setAnswer("");setChecked(false)}}><small>{l.type} · {l.level}</small><b>{l.title}</b></button>)}</div><div className="labGrid">
    <article className="player"><div className="video"><video ref={videoRef} src={lesson.video} muted loop playsInline/><button onClick={()=>videoRef.current?.paused?videoRef.current.play():videoRef.current?.pause()}>▶</button><span>CAPTIONS OFF</span></div><div className="controls"><button onClick={speak}>▶ LISTEN TO SENTENCE</button><button onClick={speak}>↻</button><label>Speed <select value={speed} onChange={e=>setSpeed(+e.target.value)}><option>.75</option><option value="1">1.0</option><option>1.25</option></select></label></div><div className="wave">{Array.from({length:38},(_,i)=><i key={i} style={{height:12+((i*17)%46)}}/>)}</div><a href={lesson.url} target="_blank">SOURCE · {lesson.source} ↗</a></article>
    <article className="dict"><p>DICTATION · {index+1}/{lesson.sentences.length}</p><h2>Type what you hear</h2><textarea value={answer} onChange={e=>{setAnswer(e.target.value);setChecked(false)}} onKeyDown={e=>{if(e.ctrlKey&&e.key==="Enter"&&answer.trim()){e.preventDefault();setChecked(true)}}} placeholder="Listen carefully, then type…"/><small>{answer.trim()?answer.trim().split(/\s+/).length:0} words <span>Ctrl + Enter to check</span></small>{checked&&<div className={score>84?"result good":"result"}><b>{score}% match</b><p>{sentence}</p></div>}<button className="check" disabled={!answer.trim()} onClick={()=>setChecked(true)}>CHECK MY ANSWER →</button><div className="prevnext"><button onClick={()=>move(-1)} disabled={!index}>← PREVIOUS</button><button onClick={()=>move(1)} disabled={index===lesson.sentences.length-1}>NEXT →</button></div></article>
   </div><button className="reveal" onClick={()=>setShowTranscript(!showTranscript)}>{showTranscript?"HIDE":"REVEAL"} FULL TRANSCRIPT</button>{showTranscript&&<ol className="fulltext">{lesson.sentences.map((s,i)=><li className={i===index?"on":""} key={s}><span>0{i+1}</span>{s}</li>)}</ol>}</section>}

   {view==="speak"&&<section className="speakPage"><div className="prompt"><p>TODAY&apos;S 2-MINUTE PROMPT</p><h2>Introduce your research focus</h2><blockquote>“My research mainly focuses on periodontal regeneration and bone metabolism. Recently, I have been investigating…”</blockquote><div className="timer"><b>{recording?"01:42":"02:00"}</b><button className={recording?"rec":""} onClick={()=>setRecording(!recording)}>{recording?"■ STOP":"● START RECORDING"}</button></div></div><div className="qa"><p>CONFERENCE Q&A</p><h2>What is the novelty of your study?</h2><textarea placeholder="Draft your answer in English…"/><button onClick={()=>setPractice(p=>p+1)}>SAVE PRACTICE · {practice}</button><div className="model"><small>MODEL STRUCTURE</small><p>The major novelty of our study is that we identified a previously unknown mechanism regulating…</p></div></div></section>}

   {view==="library"&&<section className="library"><div className="libIntro"><p>YOUR ACTIVE LANGUAGE SYSTEM</p><h2>不要只背单词，建立可以直接说出口的科研表达。</h2></div><div className="exprGrid">{expressions.map((e,i)=><article key={e[0]}><span>0{i+1}</span><small>{e[0]}</small><p>{e[1]}</p><button onClick={()=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(e[1]);u.lang="en-US";speechSynthesis.speak(u)}}>▶ LISTEN</button></article>)}</div></section>}

   {view==="notes"&&<section className="notes"><div className="noteIntro"><p>SELECT · TRANSLATE · RETAIN</p><h2>选中网站内任意英文并右键，译文会自动保存到这里。</h2></div>{notes.length?<div className="noteGrid">{notes.map(n=><article key={n.id}><button onClick={()=>setNotes(x=>x.filter(v=>v.id!==n.id))}>×</button><b>{n.original}</b><p>{n.translation}</p><small>{n.lesson}</small></article>)}</div>:<div className="empty">暂无笔记。去精听实验室选中一句英文试试看。</div>}</section>}
  </div>
 </main>
}
