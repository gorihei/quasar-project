<template>
  <q-page padding>
    <div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="namesText" type="textarea" rows="6" label="参加者（改行区切り）" />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="resultsText"
            type="textarea"
            rows="6"
            label="結果（役割・景品など、改行区切り）"
          />
        </div>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-input
          v-model.number="columns"
          type="number"
          label="列（参加者数に自動）"
          style="max-width: 160px"
        />
        <q-input v-model.number="rungs" type="number" label="横棒の数" style="max-width: 160px" />
        <q-btn color="primary" label="生成" @click="generate" />
        <q-btn label="スタート（全員）" @click="startAll" :disable="!graphReady" />
        <q-btn flat label="リセット" @click="reset" />
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <canvas
            ref="canvasRef"
            :width="canvasW"
            :height="canvasH"
            style="width: 100%; border: 1px solid #ddd; border-radius: 8px"
          ></canvas>
        </div>
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section class="text-subtitle2">結果</q-card-section>
            <q-separator />
            <q-card-section>
              <q-list bordered>
                <q-item v-for="(to, i) in finalMap" :key="i">
                  <q-item-section>{{ names[i] || `#${i + 1}` }}</q-item-section>
                  <q-item-section side>→ {{ results[to] || `#${to + 1}` }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { shuffle } from 'src/utils/random';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const canvasW = 900;
const canvasH = 560;

const namesText = ref('A\nB\nC\nD');
const resultsText = ref('1\n2\n3\n4');

const columns = ref<number>(4);
const rungs = ref<number>(8);

const names = ref<string[]>([]);
const results = ref<string[]>([]);
type Rung = { col: number; y: number }; // col と col+1 を結ぶ
const rungsData = ref<Rung[]>([]);
const finalMap = ref<number[]>([]); // i列目が最終的に何列目へ行くか

const graphReady = ref(false);

function parseInputs() {
  names.value = namesText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  results.value = resultsText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const n = Math.max(names.value.length, results.value.length, 2);
  columns.value = n;
  // 足りない方は番号で埋める
  while (names.value.length < n) names.value.push(`#${names.value.length + 1}`);
  while (results.value.length < n) results.value.push(`#${results.value.length + 1}`);
}

function generate() {
  parseInputs();
  // 横棒をランダム生成（重なり防止のため、同じyに隣接しない簡易制約）
  const n = columns.value;
  const ys = shuffle(Array.from({ length: rungs.value }, () => Math.random()))
    .map((v) => 80 + v * (canvasH - 160))
    .sort((a, b) => a - b);
  const data: Rung[] = [];
  for (const y of ys) {
    const col = Math.floor(Math.random() * (n - 1));
    if (data.some((r) => Math.abs(r.y - y) < 16 && Math.abs(r.col - col) <= 1)) continue;
    data.push({ col, y });
  }
  rungsData.value = data;
  computeFinalMap();
  draw();
  graphReady.value = true;
}

function computeFinalMap() {
  const n = columns.value;
  const sorted = rungsData.value.slice().sort((a, b) => a.y - b.y);
  const perm = Array.from({ length: n }, (_, i) => i);

  for (const r of sorted) {
    const i = r.col;
    if (i < 0 || i + 1 >= n) continue; // 範囲ガード
    const tmp = perm[i]!; // 範囲内なので undefined でないと主張
    perm[i] = perm[i + 1]!;
    perm[i + 1] = tmp;
  }

  // 逆写像は O(n) で作る
  const map = Array<number>(n);
  for (let down = 0; down < n; down++) map[perm[down]!] = down;
  finalMap.value = map;
}

function draw() {
  const c = canvasRef.value;
  if (!c) return;
  const context = ctx.value ?? c.getContext('2d');
  if (!context) return;
  ctx.value = context;
  const n = columns.value;

  // 基本座標
  const marginX = 80,
    marginY = 60;
  const width = canvasW - marginX * 2;
  const height = canvasH - marginY * 2;
  const stepX = width / (n - 1);

  // クリア
  context.clearRect(0, 0, canvasW, canvasH);
  context.lineWidth = 2;
  context.strokeStyle = '#888';
  context.font = '14px sans-serif';

  // 縦線
  for (let i = 0; i < n; i++) {
    const x = marginX + i * stepX;
    line(context, x, marginY, x, marginY + height);
    // 上ラベル
    context.fillText(names.value[i]!, x - 10, marginY - 16);
    // 下ラベル
    context.fillText(results.value[i]!, x - 10, marginY + height + 24);
  }

  // 横棒
  context.strokeStyle = '#4db6ac';
  for (const r of rungsData.value) {
    const x1 = marginX + r.col * stepX;
    const x2 = marginX + (r.col + 1) * stepX;
    line(context, x1, r.y, x2, r.y);
  }
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function animatePath(col: number, cb?: () => void) {
  // 簡易：横棒順に下るアニメ、視覚的ガイド用
  const c = canvasRef.value;
  const context = ctx.value;
  if (!c || !context) return;
  const n = columns.value;
  const marginX = 80,
    marginY = 60;
  const width = canvasW - marginX * 2;
  const height = canvasH - marginY * 2;
  const stepX = width / (n - 1);

  const sorted = rungsData.value.slice().sort((a, b) => a.y - b.y);
  let x = marginX + col * stepX;
  let y = marginY;

  const path: Array<[number, number]> = [[x, y]];
  for (const r of sorted) {
    const yR = r.y;
    // 縦に降りる
    path.push([x, yR]);
    // 横棒に当たるか？
    const colIdx = Math.round((x - marginX) / stepX);
    if (colIdx === r.col) {
      // 右へ
      x = marginX + (colIdx + 1) * stepX;
    } else if (colIdx === r.col + 1) {
      // 左へ
      x = marginX + r.col * stepX;
    }
    // 少し下へ
    y = yR + 1;
    path.push([x, y]);
  }
  // 一番下へ
  path.push([x, marginY + height]);

  // 描画アニメ
  const dur = 600; // ms
  const seg = Math.max(2, path.length - 1);
  const per = Math.floor(dur / seg);
  let i = 0;

  const id = window.setInterval(() => {
    if (i >= seg) {
      window.clearInterval(id);
      return cb && cb();
    }
    draw(); // 背景再描画
    // パスを上描き
    context.lineWidth = 4;
    context.strokeStyle = '#ff7043';
    context.beginPath();
    context.moveTo(path[0]![0], path[0]![1]);
    for (let k = 1; k <= i; k++) {
      context.lineTo(path[k]![0], path[k]![1]);
    }
    context.stroke();
    i++;
  }, per);
}

function startAll() {
  const n = columns.value;
  let i = 0;
  const next = () => {
    if (i >= n) return;
    animatePath(i, () => {
      i++;
      next();
    });
  };
  next();
}

function reset() {
  rungsData.value = [];
  finalMap.value = [];
  graphReady.value = false;
  draw();
}

onMounted(() => draw());
</script>
