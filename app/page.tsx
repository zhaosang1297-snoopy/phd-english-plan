"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lesson={id:string;level:string;type:string;title:string;source:string;url:string;media?:string;sentences:string[];custom?:boolean;freeform?:boolean};
type Note={id:number;original:string;translation:string;lesson:string};
type Expression={id:string;category:string;label:string;text:string;custom?:boolean};
type Practice={id:number,date:string,prompt:string,text:string};

const starterLessons:Lesson[]=[
 {id:"voa",level:"A2",type:"VOA",title:"Lesson 1: Welcome!",source:"VOA Learning English",url:"https://learningenglish.voanews.com/a/lets-learn-english-lesson-one/3111026.html",sentences:["Hi! Are you Anna?","Yes! Hi there! Are you Pete?","I am Pete.","Nice to meet you.","Let's try that again. I'm Anna. Nice to meet you.","I'm Pete. Anna, is that A-N-A?","No. A-N-N-A.","Well, Anna with two n's. Welcome to 1400 Irving Street!","My new apartment! Yes!"]},
 {id:"hygiene",level:"B1",type:"DENTAL",title:"Protect your oral health",source:"NIDCR",url:"https://www.nidcr.nih.gov/health-info/oral-hygiene",sentences:["Good oral health helps you enjoy life.","To keep your teeth healthy, it is important to remove dental plaque.","Plaque buildup can cause tooth decay and gum disease.","Use fluoride toothpaste and angle the bristles toward the gumline.","Brush gently using small, circular motions.","Visit the dentist for routine check-ups and professional cleaning."]},
 {id:"exam",level:"B2",type:"CLINICAL",title:"The concise oral exam",source:"Oral medicine training",url:"https://www.nidcr.nih.gov/health-info",sentences:["Oral health is important in its own right.","The mouth can provide clues to many aspects of a patient's overall health.","A comprehensive oral exam can be completed in five minutes or less.","The exam offers an opportunity to detect early indications of systemic diseases.","Diabetes, HIV, and Sjogren's syndrome can manifest in the head and neck region."]}
];

const seedExpressions:Expression[]=[
 ["研究背景","领域重要性","Periodontitis remains a major cause of tooth loss and reduced quality of life."],
 ["研究背景","当前认识","Current evidence suggests that the oral microenvironment plays a central role in tissue homeostasis."],
 ["研究背景","问题范围","Recent research has increasingly focused on the interaction between inflammation and bone remodelling."],
 ["研究背景","研究缺口","However, the cellular mechanism underlying this association remains incompletely understood."],
 ["研究背景","研究必要性","A clearer understanding of this process may support the development of targeted therapies."],
 ["研究目的","总体目标","This study aimed to determine whether endothelial signals regulate periodontal regeneration."],
 ["研究目的","具体问题","We sought to examine the effect of inflammation on osteogenic differentiation."],
 ["研究目的","研究假设","We hypothesised that the vascular niche contributes to alveolar bone repair."],
 ["研究目的","探索关系","The present study investigates the relationship between oral microbiota and host immunity."],
 ["研究目的","研究范围","Our analysis focuses specifically on the early phase of socket healing."],
 ["引用文献","已有证据","Previous studies have shown that chronic inflammation disrupts bone homeostasis."],
 ["引用文献","一致观点","This observation is consistent with earlier reports of impaired osteogenesis."],
 ["引用文献","不同结果","In contrast, several studies have reported no significant change in bone volume."],
 ["引用文献","证据限制","Evidence for this association is still limited and largely observational."],
 ["引用文献","引出来源","As reported by previous investigators, vascular changes precede measurable bone loss."],
 ["研究方法","模型建立","We established a mouse model of periodontitis to investigate this mechanism in vivo."],
 ["研究方法","样本分组","Samples were randomly assigned to the control and treatment groups."],
 ["研究方法","测量指标","Protein expression was quantified using immunoblotting and fluorescence imaging."],
 ["研究方法","选择理由","This model was selected because it closely resembles the clinical pattern of alveolar bone loss."],
 ["研究方法","统计分析","Differences between groups were assessed using an appropriate two-sided statistical test."],
 ["结果汇报","主要发现","Our results showed a significant increase in osteogenic marker expression."],
 ["结果汇报","图表描述","As shown in Figure 2, bone volume was higher in the treatment group."],
 ["结果汇报","无显著差异","No statistically significant difference was observed between the two groups."],
 ["结果汇报","趋势描述","The response increased progressively over the seven-day observation period."],
 ["结果汇报","补充发现","A further analysis revealed a similar pattern at the transcript level."],
 ["讨论发现","解释结果","One possible explanation for this finding is the altered inflammatory microenvironment."],
 ["讨论发现","联系机制","These data suggest that endothelial cells may influence osteogenesis through paracrine signalling."],
 ["讨论发现","谨慎表达","This result may indicate a functional relationship, although causality cannot yet be established."],
 ["讨论发现","与文献比较","Our findings are broadly consistent with previous work in other skeletal tissues."],
 ["讨论发现","研究局限","These findings should be interpreted in light of the relatively small sample size."],
 ["结论展望","总结结论","Taken together, our findings identify a potential regulator of periodontal regeneration."],
 ["结论展望","意义","This work provides new insight into the cellular basis of alveolar bone healing."],
 ["结论展望","临床价值","The findings may inform future strategies for promoting oral tissue repair."],
 ["结论展望","未来研究","Further studies are needed to validate this mechanism in human samples."],
 ["结论展望","结束陈述","In conclusion, the vascular microenvironment appears to be an important therapeutic target."],
 ["会议问答","创新性","The main novelty of our study is the identification of a previously unrecognised cellular interaction."],
 ["会议问答","模型选择","We chose this model because it allows us to examine the process under controlled conditions."],
 ["会议问答","澄清问题","If I understand your question correctly, you are asking whether this effect is cell-type specific."],
 ["审稿回复","感谢意见","We appreciate the reviewer’s constructive comment and have revised the manuscript accordingly."],
 ["审稿回复","补充实验","To address this concern, we performed an additional experiment and added the results to Figure 4."]
].map((x,i)=>({id:`seed-${i}`,category:x[0],label:x[1],text:x[2]}));

const tasks=[{id:"listen",time:25,label:"精听训练",sub:"逐句听写与纠错",icon:"耳"},{id:"speak",time:20,label:"科研口语",sub:"录制 2 分钟科研表达",icon:"声"},{id:"academic",time:10,label:"学术表达",sub:"学习并朗读 5 个高频句型",icon:"研"},{id:"review",time:5,label:"复盘",sub:"整理今天的生词与表达",icon:"记"}];
const prompts=[
 {title:"Introduce your research focus",question:"What is the central question of your PhD project?",model:"My research focuses on periodontal regeneration and bone metabolism. More specifically, I am investigating how the local microenvironment influences tissue repair."},
 {title:"Explain your experimental model",question:"Why did you choose this model?",model:"We selected this model because it reproduces key features of the clinical condition while allowing the variables to be carefully controlled."},
 {title:"Present the novelty",question:"What is the novelty of your study?",model:"The main novelty of our study is that we identified a previously unrecognised interaction that may regulate alveolar bone healing."}
];
const weeklyMaterials=[
 {day:"MON",title:"VOA Health Report",detail:"慢速健康新闻精听",source:"VOA",href:"https://learningenglish.voanews.com/z/1576"},
 {day:"TUE",title:"Dental health & AI",detail:"带英文字幕的口腔医学演讲",source:"TED",href:"https://www.ted.com/talks/florian_hillen_eradicating_the_dental_divide_with_ai_new_era_of_preventive_care"},
 {day:"WED",title:"Nature Podcast",detail:"训练科研新闻听力",source:"NATURE",href:"https://www.nature.com/nature/podcasts?type=nature-podcast"},
 {day:"THU",title:"The Concise Oral Exam",detail:"临床口腔检查视频与文字",source:"NIDCR",href:"https://www.nidcr.nih.gov/research/conducted-at-nidcr/clinical-director/oral-exam"},
 {day:"FRI",title:"5-min Research Summary",detail:"进入站内科研口语训练",source:"PRACTICE",view:"speak"},
 {day:"SAT",title:"Periodontal regeneration",detail:"选一篇摘要朗读并复述",source:"PUBMED",href:"https://pubmed.ncbi.nlm.nih.gov/?term=periodontal+regeneration&filter=datesearch.y_5"},
 {day:"SUN",title:"Easy listening review",detail:"回到精听实验室轻松复习",source:"REVIEW",view:"listen"}
];
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g," ").trim();

export default function Home(){
 const [hydrated,setHydrated]=useState(false),[view,setView]=useState("today"),[customLessons,setCustomLessons]=useState<Lesson[]>([]),[lessonId,setLessonId]=useState("voa"),[index,setIndex]=useState(0),[answer,setAnswer]=useState(""),[checked,setChecked]=useState(false),[speed,setSpeed]=useState(1),[done,setDone]=useState<string[]>([]),[notes,setNotes]=useState<Note[]>([]),[menu,setMenu]=useState<{x:number;y:number;text:string}|null>(null),[showTranscript,setShowTranscript]=useState(false);
 const [monthSummary,setMonthSummary]=useState(""),[monthWins,setMonthWins]=useState(""),[monthNext,setMonthNext]=useState(""),[showImport,setShowImport]=useState(false),[importTitle,setImportTitle]=useState(""),[importSource,setImportSource]=useState(""),[importMedia,setImportMedia]=useState(""),[importTranscript,setImportTranscript]=useState(""),[importFileName,setImportFileName]=useState(""),[labNotes,setLabNotes]=useState<Record<string,string>>({});
 const [promptIndex,setPromptIndex]=useState(0),[recording,setRecording]=useState(false),[seconds,setSeconds]=useState(120),[recordingUrl,setRecordingUrl]=useState(""),[recordError,setRecordError]=useState(""),[qaDraft,setQaDraft]=useState(""),[practices,setPractices]=useState<Practice[]>([]);
 const [customExpressions,setCustomExpressions]=useState<Expression[]>([]),[category,setCategory]=useState("研究背景"),[exprCategory,setExprCategory]=useState("自定义"),[exprLabel,setExprLabel]=useState(""),[exprText,setExprText]=useState("");
 const mediaRef=useRef<HTMLVideoElement>(null),recorderRef=useRef<MediaRecorder|null>(null),chunksRef=useRef<Blob[]>([]),timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
 const lessons=[...starterLessons,...customLessons],lesson=lessons.find(l=>l.id===lessonId)||lessons[0],sentence=lesson.sentences[index]||"";
 const expressions=[...seedExpressions,...customExpressions],categories=Array.from(new Set(expressions.map(e=>e.category))),shownExpressions=expressions.filter(e=>e.category===category);
 const score=useMemo(()=>{const a=norm(answer).split(" "),b=norm(sentence).split(" ");return b[0]?Math.round(b.filter((w,i)=>a[i]===w).length/b.length*100):0},[answer,sentence]);
 const minutes=tasks.filter(t=>done.includes(t.id)).reduce((s,t)=>s+t.time,0),prompt=prompts[promptIndex];

 useEffect(()=>{try{setDone(JSON.parse(localStorage.getItem("sang-progress")||"[]"));setNotes(JSON.parse(localStorage.getItem("lingoloop-notes")||"[]"));setCustomLessons(JSON.parse(localStorage.getItem("custom-lessons")||"[]"));setCustomExpressions(JSON.parse(localStorage.getItem("custom-expressions")||"[]"));setPractices(JSON.parse(localStorage.getItem("speaking-practices")||"[]"));setLabNotes(JSON.parse(localStorage.getItem("lab-free-notes")||"{}"));setMonthSummary(localStorage.getItem("month-summary")||"");setMonthWins(localStorage.getItem("month-wins")||"");setMonthNext(localStorage.getItem("month-next")||"");setQaDraft(localStorage.getItem("qa-draft")||"")}catch{}setHydrated(true)},[]);
 useEffect(()=>{if(!hydrated)return;localStorage.setItem("sang-progress",JSON.stringify(done));localStorage.setItem("lingoloop-notes",JSON.stringify(notes));localStorage.setItem("custom-lessons",JSON.stringify(customLessons.map(({media,...l})=>media?.startsWith("blob:")?l:{...l,media})));localStorage.setItem("custom-expressions",JSON.stringify(customExpressions));localStorage.setItem("speaking-practices",JSON.stringify(practices));localStorage.setItem("lab-free-notes",JSON.stringify(labNotes));localStorage.setItem("month-summary",monthSummary);localStorage.setItem("month-wins",monthWins);localStorage.setItem("month-next",monthNext);localStorage.setItem("qa-draft",qaDraft)},[hydrated,done,notes,customLessons,customExpressions,practices,labNotes,monthSummary,monthWins,monthNext,qaDraft]);
 useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current)},[]);

 function say(text=sentence){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=speed;speechSynthesis.speak(u)}
 function move(d:number){setIndex(i=>Math.max(0,Math.min(lesson.sentences.length-1,i+d)));setAnswer("");setChecked(false)}
 async function translate(){if(!menu)return;const original=menu.text;setMenu(null);let translation="";try{const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(original)}&langpair=en|zh-CN`);translation=(await r.json())?.responseData?.translatedText||""}catch{translation="翻译暂时不可用"}setNotes(n=>[{id:Date.now(),original,translation,lesson:lesson.title},...n])}
 function addLesson(){const sentences=importTranscript.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!importTitle.trim()||(!importSource.trim()&&!importMedia.trim()))return;const freeform=!sentences.length;const item:Lesson={id:`custom-${Date.now()}`,level:"SELF",type:freeform?"WEB":"IMPORTED",title:importTitle.trim(),source:importSource.trim()?"External material":"My material",url:importSource.trim()||"#",media:importMedia.trim()||undefined,sentences,custom:true,freeform};setCustomLessons(x=>[...x,item]);setLessonId(item.id);setIndex(0);setShowImport(false);setImportTitle("");setImportSource("");setImportMedia("");setImportTranscript("");setImportFileName("")}
 function deleteLesson(id:string,title:string){if(!window.confirm(`确定删除“${title}”及其全部精听记录吗？`))return;setCustomLessons(x=>x.filter(v=>v.id!==id));setLabNotes(n=>{const next={...n};delete next[id];return next});if(lessonId===id){setLessonId("voa");setIndex(0);setAnswer("");setChecked(false)}}
 function chooseFile(file?:File){if(!file)return;if(importMedia.startsWith("blob:"))URL.revokeObjectURL(importMedia);setImportMedia(URL.createObjectURL(file));setImportFileName(file.name)}
 async function toggleRecording(){
  if(recording){recorderRef.current?.stop();recorderRef.current?.stream.getTracks().forEach(t=>t.stop());if(timerRef.current)clearInterval(timerRef.current);setRecording(false);return}
  setRecordError("");if(!navigator.mediaDevices||typeof MediaRecorder==="undefined"){setRecordError("当前浏览器不支持录音，请使用最新版 Chrome、Edge 或 Safari。");return}
  try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunksRef.current=[];const recorder=new MediaRecorder(stream);recorderRef.current=recorder;recorder.ondataavailable=e=>{if(e.data.size)chunksRef.current.push(e.data)};recorder.onstop=()=>{if(recordingUrl)URL.revokeObjectURL(recordingUrl);setRecordingUrl(URL.createObjectURL(new Blob(chunksRef.current,{type:recorder.mimeType||"audio/webm"})))};recorder.start();setSeconds(120);setRecording(true);timerRef.current=setInterval(()=>setSeconds(s=>{if(s<=1){recorder.stop();stream.getTracks().forEach(t=>t.stop());if(timerRef.current)clearInterval(timerRef.current);setRecording(false);return 0}return s-1}),1000)}catch{setRecordError("无法使用麦克风。请在浏览器地址栏允许本站访问麦克风后重试。")} 
 }
 function savePractice(){if(!qaDraft.trim())return;setPractices(p=>[{id:Date.now(),date:new Date().toLocaleDateString("zh-CN"),prompt:prompt.question,text:qaDraft.trim()},...p]);setQaDraft("")}
 function addExpression(){if(!exprText.trim())return;const item={id:`custom-expr-${Date.now()}`,category:exprCategory.trim()||"自定义",label:exprLabel.trim()||"自定义表达",text:exprText.trim(),custom:true};setCustomExpressions(x=>[...x,item]);setCategory(item.category);setExprLabel("");setExprText("")}

 return <main onClick={()=>setMenu(null)} onContextMenu={e=>{const text=getSelection()?.toString().trim();if(text){e.preventDefault();setMenu({x:e.clientX,y:e.clientY,text})}}}>
  {menu&&<button className="context" style={{left:menu.x,top:menu.y}} onClick={e=>{e.stopPropagation();void translate()}}>译成中文并保存到笔记</button>}
  <aside className="sidebar"><div className="logo">S<span>/</span>ENGLISH</div><p className="planLabel">PHD ENGLISH PLAN</p><nav>{[["today","今日训练","01"],["listen","精听实验室","02"],["speak","科研口语","03"],["library","表达资料库","04"],["notes","我的笔记","05"]].map(x=><button key={x[0]} className={view===x[0]?"active":""} onClick={()=>setView(x[0])}><i>{x[2]}</i>{x[1]}</button>)}</nav><div className="level"><div><b>B1<span>→</span>B2</b><small>6-MONTH TARGET</small></div><div className="levelbar"><i style={{width:"24%"}}/></div><p>第 2 周 · 基础听力阶段</p></div><div className="profile"><div>SZ</div><span><b>Sang Zhao</b><small>Oral Medicine PhD</small></span></div></aside>
  <div className="shell"><header><div><p>GOOD EVENING, SANG</p><h1>{view==="today"?"今天，向流利表达再近一步。":view==="listen"?"精听实验室":view==="speak"?"科研口语训练":view==="library"?"学术表达资料库":"我的学习笔记"}</h1></div><div className="daycount"><b>12</b><span>DAY<br/>STREAK</span></div></header>

  {view==="today"&&<>
   <section className="heroGrid"><article className="daily"><div className="dailyTop"><span>DAILY / 60 MIN</span><b>{minutes}<small>/60</small></b></div><h2>今日训练路径</h2><div className="taskList">{tasks.map((t,i)=><button key={t.id} onClick={()=>setDone(d=>d.includes(t.id)?d.filter(x=>x!==t.id):[...d,t.id])} className={done.includes(t.id)?"done":""}><span className="num">0{i+1}</span><i>{t.icon}</i><span><b>{t.label}</b><small>{t.sub}</small></span><em>{t.time} min</em><strong>{done.includes(t.id)?"✓":"○"}</strong></button>)}</div></article><article className="focus"><p>THIS MONTH&apos;S FOCUS</p><h2>听觉识别<br/>与语音节奏</h2><div className="ear">60<small>EF LISTENING</small></div><blockquote>“看到认识，听到也能立即理解。”</blockquote><div className="mini"><span><b>5</b> days / week</span><span><b>60</b> min / day</span></div></article></section>
   <section className="sectionHead"><div><p>WEEK 02 · FOUNDATION</p><h2>本周训练安排</h2></div><span>点击任意卡片即可开始 · 听力 40% · 口语 30% · 学术 20%</span></section>
   <div className="week materialWeek">{weeklyMaterials.map((m,i)=><div key={m.day} className={i===1?"now":""}>{m.href?<a href={m.href} target="_blank" rel="noreferrer" aria-label={`打开${m.title}`}><b>{m.day}<em>{m.source}</em></b><strong>{m.title}</strong><span>{m.detail}</span><i>打开素材 ↗</i></a>:<button onClick={()=>{setView(m.view||"listen");if(m.view==="listen"){setLessonId("voa");setIndex(0)}}}><b>{m.day}<em>{m.source}</em></b><strong>{m.title}</strong><span>{m.detail}</span><i>开始训练 →</i></button>}</div>)}</div>
   <section className="monthly"><div><p>MONTHLY REVIEW</p><h2>月度总结</h2><span>内容会自动保存在当前设备，下个月可以回看进步。</span></div><div className="monthlyGrid"><label>本月最明显的进步<textarea value={monthWins} onChange={e=>setMonthWins(e.target.value)} placeholder="例如：能听出更多连读，科研自我介绍更流畅…"/></label><label>本月训练总结<textarea value={monthSummary} onChange={e=>setMonthSummary(e.target.value)} placeholder="完成情况、困难、有效的方法…"/></label><label>下月重点<textarea value={monthNext} onChange={e=>setMonthNext(e.target.value)} placeholder="设定一个可量化目标…"/></label></div><small>已自动保存</small></section>
  </>}

  {view==="listen"&&<section className="lab">
   <div className="labActions"><div><b>我的精听材料</b><span>粘贴 TED 等素材网页即可自由听写；有字幕时还可以逐句核对。</span></div><button onClick={()=>setShowImport(!showImport)}>{showImport?"收起":"＋ 导入新素材"}</button></div>
   {showImport&&<div className="importPanel">
    <label>素材标题<input value={importTitle} onChange={e=>setImportTitle(e.target.value)} placeholder="例如：How to end fear of the dentist"/></label>
    <label>素材网页链接<input value={importSource} onChange={e=>setImportSource(e.target.value)} placeholder="粘贴 TED 演讲网址"/></label>
    <label>媒体直链（可选）<input value={importMedia.startsWith("blob:")?"":importMedia} onChange={e=>setImportMedia(e.target.value)} placeholder="MP3 / MP4 直链"/></label>
    <label className="filePick">或选择本地音频/视频<input type="file" accept="audio/*,video/*" onChange={e=>chooseFile(e.target.files?.[0])}/><span>{importFileName||"选择文件"}</span></label>
    <label className="wide">英文字幕（可选，每行一句）<textarea value={importTranscript} onChange={e=>setImportTranscript(e.target.value)} placeholder={'不粘贴字幕：进入自由精听记录模式\n粘贴字幕：进入逐句听写与核对模式'}/></label>
    <button className="primary" onClick={addLesson} disabled={!importTitle.trim()||(!importSource.trim()&&!importMedia.trim())}>保存并开始精听</button>
    <small>推荐方式：只粘贴 TED 网页链接，在新页面播放演讲，同时留在精听实验室记录。所有文字会自动保存在当前设备。</small>
   </div>}
   <div className="lessonTabs">{lessons.map(l=><div className="lessonTabItem" key={l.id}><button className={`lessonSelect ${lessonId===l.id?"active":""}`} onClick={()=>{setLessonId(l.id);setIndex(0);setAnswer("");setChecked(false)}}><small>{l.type} · {l.level}</small><b>{l.title}</b></button>{l.custom&&<button className="lessonDelete" aria-label={`删除${l.title}`} title="删除此素材" onClick={()=>deleteLesson(l.id,l.title)}>×</button>}</div>)}</div>
   <div className="labGrid">
    <article className="player">{lesson.freeform?<div className="externalStage"><span>EXTERNAL LISTENING MATERIAL</span><h2>{lesson.title}</h2><p>点击下面按钮在新页面播放素材。然后切回本页，或把两个窗口并排，在右侧持续记录。</p><a href={lesson.url} target="_blank" rel="noreferrer">打开素材页面 ↗</a><small>建议先不看字幕完整听一遍，再按 15–30 秒一段反复听写。</small></div>:<><div className="listenStage">{lesson.media?<video ref={mediaRef} src={lesson.media} controls playsInline/>:<><span>句子 {index+1} / {lesson.sentences.length}</span><button onClick={()=>say()}>▶</button><b>点击播放当前句</b><small>使用浏览器英文语音逐句精听，确保播放内容与右侧答案完全一致。</small></>}</div><div className="controls"><button onClick={()=>say()}>▶ LISTEN TO SENTENCE</button><button onClick={()=>say()}>↻</button><label>Speed <select value={speed} onChange={e=>setSpeed(+e.target.value)}><option value="0.75">.75</option><option value="1">1.0</option><option value="1.25">1.25</option></select></label></div><div className="wave">{Array.from({length:38},(_,i)=><i key={i} style={{height:12+((i*17)%46)}}/>)}</div>{lesson.url!=="#"&&<a href={lesson.url} target="_blank">SOURCE · {lesson.source} ↗</a>}</>}</article>
    {lesson.freeform?<article className="dict freeDict"><p>FREE DICTATION · AUTO SAVED</p><h2>边听边记录</h2><textarea value={labNotes[lesson.id]||""} onChange={e=>setLabNotes(n=>({...n,[lesson.id]:e.target.value}))} placeholder={'[00:00–00:30] 我听到的英文…\n\n没听清的词 / 连读：\n\n这一段的大意：\n\n可以复用的表达：'}/><small>{(labNotes[lesson.id]||"").trim()?((labNotes[lesson.id]||"").trim().split(/\s+/).length):0} words <span>输入即自动保存</span></small><div className="freeTips"><b>三遍训练法</b><p>第 1 遍抓主旨 · 第 2 遍逐段听写 · 第 3 遍查看字幕并订正</p></div></article>:<article className="dict"><p>DICTATION · {index+1}/{lesson.sentences.length}</p><h2>Type what you hear</h2><textarea value={answer} onChange={e=>{setAnswer(e.target.value);setChecked(false)}} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"&&answer.trim()){e.preventDefault();setChecked(true)}}} placeholder="Listen carefully, then type…"/><small>{answer.trim()?answer.trim().split(/\s+/).length:0} words <span>Ctrl / ⌘ + Enter 可检查</span></small>{checked&&<div className={score>84?"result good":"result"}><b>{score}% match</b><p>{sentence}</p></div>}<button className="check" disabled={!answer.trim()} onClick={()=>setChecked(true)}>检查答案 →</button><div className="prevnext"><button onClick={()=>move(-1)} disabled={!index}>← 上一句</button><button onClick={()=>move(1)} disabled={index===lesson.sentences.length-1}>下一句 →</button></div></article>}
   </div>
   {!lesson.freeform&&<><button className="reveal" onClick={()=>setShowTranscript(!showTranscript)}>{showTranscript?"隐藏":"显示"}完整字幕</button>{showTranscript&&<ol className="fulltext">{lesson.sentences.map((s,i)=><li className={i===index?"on":""} key={`${s}-${i}`} onClick={()=>{setIndex(i);setAnswer("");setChecked(false)}}><span>{String(i+1).padStart(2,"0")}</span>{s}</li>)}</ol>}</>}
   {lesson.custom&&<button className="deleteMaterial" onClick={()=>deleteLesson(lesson.id,lesson.title)}>删除此导入素材及记录</button>}
  </section>}

  {view==="speak"&&<section className="speakWrap"><div className="speakingGuide"><p>训练逻辑：输入支架 → 限时输出 → 回听 → 修改重录 → 保存文字版本。不要背完整答案，而要把科研表达练成可随时调用的语言模块。</p><div>{prompts.map((p,i)=><button className={promptIndex===i?"active":""} key={p.title} onClick={()=>{setPromptIndex(i);setQaDraft("")}}>0{i+1} {p.title}</button>)}</div></div><div className="speakPage"><article className="prompt"><p>TODAY&apos;S 2-MINUTE PROMPT</p><h2>{prompt.title}</h2><blockquote>“{prompt.model}”</blockquote><div className="timer"><b>{String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}</b><button className={recording?"rec":""} onClick={()=>void toggleRecording()}>{recording?"■ 停止录音":"● 开始录音"}</button>{recordError&&<small className="error">{recordError}</small>}{recordingUrl&&<audio src={recordingUrl} controls/>}</div></article><article className="qa"><p>CONFERENCE Q&A</p><h2>{prompt.question}</h2><textarea value={qaDraft} onChange={e=>setQaDraft(e.target.value)} placeholder="先用英文写出答题要点，再脱稿录音…"/><button onClick={savePractice} disabled={!qaDraft.trim()}>保存本次练习</button><div className="model"><small>MODEL STRUCTURE</small><p>{prompt.model}</p></div></article></div>{practices.length>0&&<div className="practiceHistory"><h2>已保存的口语练习</h2>{practices.slice(0,6).map(p=><article key={p.id}><button onClick={()=>setPractices(x=>x.filter(v=>v.id!==p.id))}>×</button><small>{p.date} · {p.prompt}</small><p>{p.text}</p></article>)}</div>}</section>}

  {view==="library"&&<section className="library"><div className="libIntro"><p>ACADEMIC PHRASE SYSTEM</p><h2>按论文功能分类，把句型改写成你自己的科研表达。</h2><span>分类逻辑参考 University of Manchester Academic Phrasebank，并针对口腔医学研究、会议问答和审稿回复进行了原创改写。</span></div><div className="categoryTabs">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}<small>{expressions.filter(e=>e.category===c).length}</small></button>)}</div><div className="expressionList">{shownExpressions.map((e,i)=><article key={e.id}><span>{String(i+1).padStart(2,"0")}</span><small>{e.label}</small><p>{e.text}</p><div><button onClick={()=>say(e.text)}>▶ 朗读</button>{e.custom&&<button onClick={()=>setCustomExpressions(x=>x.filter(v=>v.id!==e.id))}>删除</button>}</div></article>)}</div><div className="expressionImport"><div><p>ADD YOUR OWN</p><h2>导入自己的表达</h2><span>可加入你的论文原句、会议表达或导师修改后的句型。</span></div><label>分类<input value={exprCategory} onChange={e=>setExprCategory(e.target.value)} placeholder="例如：组会汇报"/></label><label>用途标签<input value={exprLabel} onChange={e=>setExprLabel(e.target.value)} placeholder="例如：解释研究局限"/></label><label className="wide">英文表达<textarea value={exprText} onChange={e=>setExprText(e.target.value)} placeholder="Paste or write one reusable expression…"/></label><button onClick={addExpression} disabled={!exprText.trim()}>保存到资料库</button></div><a className="phraseSource" href="https://www.phrasebank.manchester.ac.uk/" target="_blank">参考资源：Academic Phrasebank, The University of Manchester ↗</a></section>}

  {view==="notes"&&<section className="notes"><div className="noteIntro"><p>SELECT · TRANSLATE · RETAIN</p><h2>选中网站内任意英文并右键，译文会自动保存到这里。</h2></div>{notes.length?<div className="noteGrid">{notes.map(n=><article key={n.id}><button onClick={()=>setNotes(x=>x.filter(v=>v.id!==n.id))}>×</button><b>{n.original}</b><p>{n.translation}</p><small>{n.lesson}</small></article>)}</div>:<div className="empty">暂无笔记。去精听实验室选中一句英文试试看。</div>}</section>}
  </div>
 </main>
}
