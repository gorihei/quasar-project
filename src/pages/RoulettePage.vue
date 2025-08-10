<template>
  <q-page padding>
    <div class="q-gutter-md">
      <q-input v-model="itemsText" type="textarea" rows="4" label="項目（改行区切り）" />
      <div class="row items-center q-gutter-sm">
        <q-input
          v-model.number="spinMs"
          type="number"
          label="回転時間(ms)"
          style="max-width: 180px"
        />
        <q-btn
          label="回す"
          color="primary"
          @click="spin"
          :disable="spinning || entries.length < 2"
        />
        <q-btn flat label="初期化" @click="reset" />
      </div>

      <div class="relative-position flex flex-center" style="height: 320px">
        <svg :style="wheelStyle" viewBox="-150 -150 300 300" style="max-width: 320px">
          <g>
            <circle r="148" fill="#eee" />
            <template v-for="(e, i) in entries" :key="i">
              <path :d="arcPath(i)" :fill="sliceColor(i)" stroke="#fff" stroke-width="1" />
              <text
                :transform="textTransform(i)"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="10"
                fill="#222"
              >
                {{ e }}
              </text>
            </template>
          </g>
        </svg>
        <div class="absolute-top text-center" style="top: -8px; left: 0; right: 0">⬇</div>
      </div>

      <q-banner v-if="lastResult" class="bg-green-2 text-green-10 q-pa-md">
        結果：<b>{{ lastResult }}</b>
      </q-banner>

      <q-expansion-item icon="history" label="履歴">
        <q-list bordered>
          <q-item v-for="(h, i) in history" :key="i"
            ><q-item-section>{{ h }}</q-item-section></q-item
          >
        </q-list>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const defaultItems = ['A', 'B', 'C', 'D'].join('\n');
const itemsText = ref(defaultItems);
const spinMs = ref(2200);
const spinning = ref(false);
const angle = ref(0);
const lastResult = ref<string | null>(null);
const history = ref<string[]>([]);

const entries = computed(() =>
  itemsText.value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean),
);

function sliceColor(i: number) {
  const hue = (i * 360) / Math.max(entries.value.length, 1);
  return `hsl(${hue}, 75%, 70%)`;
}

function arcPath(i: number) {
  const n = entries.value.length;
  const a0 = (2 * Math.PI * i) / n - Math.PI / 2;
  const a1 = (2 * Math.PI * (i + 1)) / n - Math.PI / 2;
  const r = 148;
  const x0 = r * Math.cos(a0),
    y0 = r * Math.sin(a0);
  const x1 = r * Math.cos(a1),
    y1 = r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M0,0 L${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1} Z`;
}

function textTransform(i: number) {
  const n = entries.value.length;
  const a = (2 * Math.PI * (i + 0.5)) / n - Math.PI / 2;
  const r = 90;
  const x = r * Math.cos(a),
    y = r * Math.sin(a);
  const deg = (a * 180) / Math.PI;
  return `translate(${x},${y}) rotate(${deg})`;
}

const wheelStyle = computed(() => ({
  transition: spinning.value
    ? `transform ${spinMs.value}ms cubic-bezier(.2,.8,.2,1)`
    : 'transform 0s',
  transform: `rotate(${angle.value}deg)`,
}));

function spin() {
  if (spinning.value || entries.value.length < 2) return;
  spinning.value = true;
  const n = entries.value.length;
  const selected = Math.floor(Math.random() * n);
  const sliceDeg = 360 / n;
  const targetAngle = 360 * 6 + (selected + 0.5) * sliceDeg; // 6回転＋中央合わせ
  angle.value = targetAngle;
  window.setTimeout(() => {
    spinning.value = false;
    const winner = entries.value[selected];
    lastResult.value = winner!;
    history.value.unshift(winner!);
  }, spinMs.value + 30);
}

function reset() {
  angle.value = 0;
  lastResult.value = null;
  history.value = [];
}
</script>

<style scoped>
.relative-position {
  position: relative;
}
</style>
