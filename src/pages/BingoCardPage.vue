<template>
  <q-page padding>
    <div class="q-gutter-md">
      <div class="row items-center q-gutter-sm">
        <q-btn color="primary" label="カード再生成" @click="generate" />
        <div class="text-subtitle1">ビンゴ：{{ bingoCount }} 本</div>
      </div>

      <div class="board">
        <div v-for="(row, r) in board" :key="r" class="row-line">
          <div
            v-for="(cell, c) in row"
            :key="c"
            class="cell"
            :class="{ hit: hits[r][c], free: r === 2 && c === 2 }"
            @click="toggle(r, c)"
          >
            {{ cell }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { shuffle } from 'src/utils/random';

type Board = number[][];

const board = ref<Board>([]);
const hits = ref<boolean[][]>([]);

function generate() {
  // 標準ビンゴの列帯域（B:1-15, I:16-30, N:31-45, G:46-60, O:61-75）
  const cols = [range(1, 15), range(16, 30), range(31, 45), range(46, 60), range(61, 75)].map(
    (col) => shuffle(col).slice(0, 5),
  );
  const b: Board = Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => cols[c]![r]),
  ) as Board;
  b[2]![2] = 0; // FREE
  board.value = b;
  hits.value = Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => r === 2 && c === 2),
  );
}
function range(a: number, b: number) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

function toggle(r: number, c: number) {
  if (r === 2 && c === 2) return; // FREE
  hits.value[r]![c] = !hits.value[r]![c];
}

const bingoCount = computed(() => {
  let count = 0;
  // rows
  for (let r = 0; r < 5; r++) if (hits.value[r]!.every(Boolean)) count++;
  // cols
  for (let c = 0; c < 5; c++) if ([0, 1, 2, 3, 4].every((r) => hits.value[r]![c])) count++;
  // diagonals
  if ([0, 1, 2, 3, 4].every((i) => hits.value[i]![i])) count++;
  if ([0, 1, 2, 3, 4].every((i) => hits.value[i]![4 - i])) count++;
  return count;
});

generate();
</script>

<style scoped>
.board {
  display: grid;
  gap: 8px;
}
.row-line {
  display: grid;
  grid-template-columns: repeat(5, 60px);
  gap: 8px;
}
.cell {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-weight: 600;
  user-select: none;
}
.cell.hit {
  background: #fff3e0;
  border-color: #ffb74d;
}
.cell.free {
  background: #e3f2fd;
  border-color: #64b5f6;
}
@media (max-width: 420px) {
  .row-line {
    grid-template-columns: repeat(5, 50px);
  }
  .cell {
    width: 50px;
    height: 50px;
  }
}
</style>
