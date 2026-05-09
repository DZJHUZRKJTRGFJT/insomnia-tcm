// ============================================
// 首页 JavaScript
// ============================================

// 证型标签切换
document.querySelectorAll('.syndrome-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.dataset.tab;
    document.querySelectorAll('.syndrome-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.syndrome-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.syndrome-panel[data-panel="${idx}"]`).classList.add('active');
    drawRadarChart(parseInt(idx));
  });
});

// 雷达图数据
const radarData = [
  { label: '肝火扰心', scores: [9, 7, 5, 3, 4, 8], colors: ['rgba(231,76,60,0.7)', 'rgba(231,76,60,0.15)'] },
  { label: '痰热扰心', scores: [8, 6, 7, 4, 3, 7], colors: ['rgba(241,196,15,0.7)', 'rgba(241,196,15,0.15)'] },
  { label: '心脾两虚', scores: [6, 8, 4, 7, 5, 3], colors: ['rgba(46,204,113,0.7)', 'rgba(46,204,113,0.15)'] },
  { label: '心肾不交', scores: [7, 5, 8, 6, 7, 4], colors: ['rgba(52,152,219,0.7)', 'rgba(52,152,219,0.15)'] },
  { label: '心胆气虚', scores: [5, 9, 3, 5, 8, 6], colors: ['rgba(155,89,182,0.7)', 'rgba(155,89,182,0.15)'] },
];

const radarLabels = ['失眠程度', '情志影响', '脏腑症状', '饮食二便', '舌象特征', '脉象特征'];

function drawRadarChart(idx) {
  const canvas = document.getElementById(`radarChart${idx}`);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2;
  const R = 100;
  const n = radarLabels.length;
  const data = radarData[idx];

  // 背景网格
  for (let level = 1; level <= 5; level++) {
    const r = R * level / 5;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = level === 5 ? 'rgba(107,79,160,0.3)' : 'rgba(107,79,160,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 轴线
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = 'rgba(107,79,160,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 数据区域
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const r = R * data.scores[i] / 10;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = data.colors[1];
  ctx.fill();
  ctx.strokeStyle = data.colors[0];
  ctx.lineWidth = 2;
  ctx.stroke();

  // 数据点
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const r = R * data.scores[i] / 10;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = data.colors[0];
    ctx.fill();
  }

  // 标签
  ctx.font = '11px PingFang SC, Microsoft YaHei, sans-serif';
  ctx.fillStyle = 'rgba(74,74,106,0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const r = R + 22;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.fillText(radarLabels[i], x, y);
  }
}

// 初始绘制第一个
setTimeout(() => drawRadarChart(0), 100);
