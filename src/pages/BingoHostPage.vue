<template>
  <q-page padding>
    <div class="q-gutter-md">
      <div class="row items-center q-gutter-sm">
        <q-btn color="primary" label="番号を引く" @click="draw" :disable="left.size === 0" />
        <q-btn flat label="リセット" @click="reset" />
        <div class="text-subtitle1">残り：{{ left.size }}</div>
      </div>

      <q-banner v-if="current !== null" class="bg-indigo-2 text-indigo-10 q-pa-md">
        出た番号：<b class="text-h5">{{ current }}</b>
      </q-banner>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section class="text-subtitle2">履歴（新しい順）</q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div v-for="n in history" :key="`h-${n}`" class="col-auto q-pa-xs">
                  <q-badge rounded>{{ n }}</q-badge>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section class="text-subtitle2">出た/出てない一覧</q-card-section>
            <q-separator />
            <q-card-section>
              <div class="grid">
                <div v-for="n in 75" :key="n" class="cell" :class="{ hit: drawn.has(n) }">
                  {{ n }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawn = ref<Set<number>>(new Set());
const left = ref<Set<number>>(new Set(Array.from({ length: 75 }, (_, i) => i + 1)));
const history = ref<number[]>([]);
const current = ref<number | null>(null);

function draw() {
  if (left.value.size === 0) return;
  const arr = Array.from(left.value);
  const n = arr[Math.floor(Math.random() * arr.length)] as number;
  left.value.delete(n);
  drawn.value.add(n);
  history.value.unshift(n);
  current.value = n;
}

function reset() {
  drawn.value = new Set();
  left.value = new Set(Array.from({ length: 75 }, (_, i) => i + 1));
  history.value = [];
  current.value = null;
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
}
.cell {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px;
  text-align: center;
  font-size: 13px;
}
.cell.hit {
  background: #e0f2f1;
  border-color: #4db6ac;
  font-weight: 600;
}
</style>
