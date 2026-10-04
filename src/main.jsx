import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { geoContains, geoNaturalEarth1 } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/land-110m.json';

const land = feature(worldData, worldData.objects.land);

function DraggableSticker({ className = '', label, children }) {
  const elementRef = useRef(null);
  const dragRef = useRef({ pointerId:null, startX:0, startY:0, x:0, y:0 });

  const handlePointerDown = event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const sticker = elementRef.current;
    dragRef.current = { ...dragRef.current, pointerId:event.pointerId, startX:event.clientX, startY:event.clientY };
    sticker.setPointerCapture(event.pointerId);
    sticker.classList.add('is-dragging');
  };
  const handlePointerMove = event => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    const nextX = drag.x + event.clientX - drag.startX;
    const nextY = drag.y + event.clientY - drag.startY;
    elementRef.current.style.setProperty('--drag-x', `${nextX}px`);
    elementRef.current.style.setProperty('--drag-y', `${nextY}px`);
  };
  const handlePointerUp = event => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    drag.x += event.clientX - drag.startX;
    drag.y += event.clientY - drag.startY;
    drag.pointerId = null;
    elementRef.current.classList.remove('is-dragging');
  };

  return <button ref={elementRef} className={`keyword-sticker ${className}`} type="button" aria-label={`${label} sticker. Drag to move.`}
    onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>{children}</button>;
}

function DotWorldMap() {
  const projection = geoNaturalEarth1().fitExtent([[54, 34], [946, 430]], land);
  const dots = [];
  for (let lat = -58; lat <= 84; lat += 5.2) for (let lon = -177; lon <= 177; lon += 5.2) {
    if (geoContains(land, [lon, lat])) { const [x, y] = projection([lon, lat]); dots.push({ x, y, id:`${lon}-${lat}` }); }
  }
  const cities = [
    { name:'SAN FRANCISCO', coord:[-122.4194, 37.7749], dx:-72, dy:18, width:150 },
    { name:'ANN ARBOR', coord:[-83.7430, 42.2808], dx:-66, dy:-62, width:128 },
    { name:'NEW YORK', coord:[-74.0060, 40.7128], dx:10, dy:12, width:112 },
    { name:'SEOUL', coord:[126.9780, 37.5665], dx:-44, dy:-62, width:88, home:true }
  ].map(c => { const [x,y] = projection(c.coord); return {...c, x, y, lx:x+c.dx, ly:y+c.dy}; });
  return <svg className="world-map" viewBox="0 0 1000 480" role="img" aria-label="서울, 앤아버, 뉴욕, 샌프란시스코가 표시된 점 형태의 세계지도">
    <rect width="1000" height="480" fill="#e6e9e3" />
    <g className="land-dots">{dots.map(d => <circle key={d.id} cx={d.x} cy={d.y} r="3.15" />)}</g>
    {cities.map(c => <g className={`city ${c.home ? 'home' : ''}`} key={c.name}>
      <circle className="city-pulse" cx={c.x} cy={c.y} r="15" />
      <circle cx={c.x} cy={c.y} r="5" />
      <rect className="city-label" x={c.lx} y={c.ly} width={c.width} height="34" rx="17" />
      <text x={c.lx + c.width / 2} y={c.ly + 22} textAnchor="middle">{c.name}</text>
    </g>)}
  </svg>;
}

function App() {
  return <>
    <main className="bento-board">
      <section className="bento-card about-card">
        <h1>Hi, I’m Yeonji</h1>
        <p className="lead">복잡한 AI·데이터 기술을 명확하고 사용하기 쉬운 제품 경험으로 전환하는 프로덕트 디자이너입니다. 글로벌 핀테크 기업인 Intuit 미국 본사에서 데이터 엔지니어, 프로덕트 팀, 법무·보안 조직이 사용하는 AI·데이터 플랫폼의 핵심 워크플로우를 설계해왔습니다.</p>
        <div className="about-details">
          <p>AI 도구를 디자인 과정 전반에 능숙하게 활용해 리서치, 아이데이션, 프로토타이핑의 속도와 완성도를 높입니다.</p>
          <p className="availability"><span className="status-dot" aria-hidden="true"></span><span className="availability-copy">Hiring a <strong>product designer</strong> or <strong>product manager</strong>? <a href="mailto:yeonjikim.design@gmail.com">Let’s talk!</a></span></p>
        </div>
      </section>

      <section className="bento-card map-card">
        <div className="card-head"><h2>Across Places</h2><p className="map-note">Currently based in Seoul</p></div>
        <DotWorldMap />
      </section>

      <section className="bento-card experience-card">
        <div className="card-head"><h2>Experience</h2></div>
        <ol>
          <li><div><strong>Intuit 🇺🇸</strong><span>Product Designer, AI + Data Platform</span></div><time>2023 - 2026</time></li>
          <li><div><strong>Intuit 🇺🇸</strong><span>Product Design Intern, AI Platform</span></div><time>2022</time></li>
          <li><div><strong>LINE Corp 🇰🇷</strong><span>Product Management Intern</span></div><time>2021</time></li>
          <li><div><strong>듀오톤 🇰🇷</strong><span>UX 디자인 인턴</span></div><time>2021</time></li>
          <li><div><strong>구루미 🇰🇷</strong><span>서비스기획자</span></div><time>2020 - 2021</time></li>
        </ol>
      </section>

      <section className="bento-card onside-card">
        <div className="card-head"><h2>On the side</h2></div>
        <div className="project-list">
          <a href="https://rai-checker.vercel.app/" target="_blank" rel="noreferrer"><strong>AI Responsibility Checker</strong><i>→</i></a>
          <a href="https://wisebuy.world" target="_blank" rel="noreferrer"><strong>Luxury Price Finder</strong><i>→</i></a>
          <a href="https://studyclub-plusplus.com/ko" target="_blank" rel="noreferrer"><strong>Global Study Platform</strong><i>→</i></a>
        </div>
      </section>

      <aside className="bento-card profile-card">
        <div className="card-head"><h2>Education</h2></div>
        <div className="school"><strong>University of Michigan 🇺🇸</strong><span className="degree">석사</span><p>Information - UX Design & Research</p></div>
        <div className="school"><strong>이화여자대학교 🇰🇷</strong><span className="degree">학사</span><p>컴퓨터공학 · 디지털인문학</p></div>
      </aside>

      <nav className="bento-card links-card" aria-label="Contact and portfolio links">
        <div className="card-head"><h2>More about me</h2></div>
        <div className="link-list">
          <a href="./assets/Yeonji_Kim_Portfolio.pdf" target="_blank" rel="noreferrer"><strong>portfolio (pdf)</strong></a>
          <a href="./assets/Yeonji_Kim_Resume.pdf" target="_blank" rel="noreferrer"><strong>resume</strong></a>
          <a href="https://linkedin.com/in/yeonji-kim/" target="_blank" rel="noreferrer"><strong>linkedin</strong></a>
          <a href="mailto:yeonjikim.design@gmail.com"><strong>email</strong></a>
        </div>
      </nav>

      <div className="sticker-layer" aria-label="Draggable keyword stickers">
        <DraggableSticker className="sticker-systems" label="Systems Thinking">Systems<br />Thinking</DraggableSticker>
        <DraggableSticker className="sticker-strategy" label="Product Strategy">Product Strategy</DraggableSticker>
        <DraggableSticker className="sticker-enterprise" label="Enterprise UX">Enterprise UX</DraggableSticker>
        <DraggableSticker className="sticker-ai" label="Designing with AI">Designing<br />with AI</DraggableSticker>
        <DraggableSticker className="sticker-zero" label="0 to 1">0 → 1</DraggableSticker>
      </div>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
