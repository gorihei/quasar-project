<template>
  <q-page class="row items-center justify-evenly">
    <div class="column items-center q-gutter-y-md">
      <div class="roulette-container">
        <div class="roulette-arrow"></div>
        <div class="roulette" :style="rouletteStyle">
          <div
            v-for="(item, index) in dinnerOptions"
            :key="index"
            class="roulette-item"
            :style="getItemStyle(index)"
          >
            <span>{{ item }}</span>
          </div>
        </div>
        <q-btn @click="spinRoulette" :disabled="spinning" label="回す" color="primary" />
      </div>

      <q-expansion-item
        v-model="isEditorExpanded"
        icon="edit"
        label="メニュー編集"
        header-class="text-primary"
      >
        <q-card>
          <q-card-section>
            <div class="row q-gutter-sm">
              <q-input v-model="newOption" label="新しいメニュー" dense>
                <template v-slot:append>
                  <q-btn round dense flat icon="add" @click="addOption" :disable="!newOption" />
                </template>
              </q-input>
            </div>
            <q-list bordered class="rounded-borders q-mt-md">
              <q-item v-for="(item, index) in dinnerOptions" :key="index">
                <q-item-section>{{ item }}</q-item-section>
                <q-item-section side>
                  <q-btn
                    round
                    dense
                    flat
                    icon="delete"
                    color="negative"
                    @click="removeOption(index)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const dinnerOptions = ref([
  '寿司',
  'ラーメン',
  'カレー',
  '焼肉',
  'ピザ',
  'パスタ',
  '天ぷら',
  'うどん',
]);
const newOption = ref('');
const spinning = ref(false);
const rotation = ref(0);
const isEditorExpanded = ref(false);

const addOption = () => {
  if (newOption.value.trim()) {
    dinnerOptions.value.push(newOption.value.trim());
    newOption.value = '';
  }
};

const removeOption = (index: number) => {
  dinnerOptions.value.splice(index, 1);
};

const spinRoulette = () => {
  if (spinning.value) return;

  spinning.value = true;
  const randomSpins = Math.floor(Math.random() * 5) + 10; // 10〜15回転
  const randomStop = Math.floor(Math.random() * dinnerOptions.value.length);
  const anglePerItem = 360 / dinnerOptions.value.length;

  // 現在の回転角度から新しい回転角度を計算
  const currentRotation = rotation.value;
  const baseRotation = currentRotation - (currentRotation % 360); // 現在の回転の基準位置
  const totalRotation = baseRotation - (randomSpins * 360 + anglePerItem * randomStop);

  rotation.value = totalRotation;
  console.log(`回転角度: ${rotation.value}`); // デバッグ用ログ
  console.log(`選択されたアイテム: ${dinnerOptions.value[randomStop]}`); // デバッグ用ログ

  setTimeout(() => {
    spinning.value = false;
  }, 3000); // アニメーション時間と一致させる
};

const colors = [
  '#ffb6c1', // ピンク
  '#b0e0e6', // パウダーブルー
  '#98fb98', // ペールグリーン
  '#f0e68c', // カーキ
  '#e6e6fa', // ラベンダー
  '#ffe4b5', // モカシン
  '#ffa07a', // ライトサーモン
  '#87ceeb', // スカイブルー
  '#dda0dd', // プラム
  '#90ee90', // ライトグリーン
];

const rouletteStyle = computed(() => {
  const total = dinnerOptions.value.length;
  const angle = 360 / total;

  // グラデーションを動的に生成
  const gradient = dinnerOptions.value
    .map((_, index) => {
      const startAngle = angle * index;
      const endAngle = angle * (index + 1);
      const color = colors[index % colors.length];
      return `${color} ${startAngle}deg ${endAngle}deg`;
    })
    .join(',');

  return {
    transform: `rotate(${rotation.value}deg)`,
    '--roulette-gradient': `conic-gradient(from -90deg, ${gradient})`,
  };
});

const getItemStyle = (index: number) => {
  const total = dinnerOptions.value.length;
  const angle = 360 / total;
  const rotation = angle * index;

  // 半径を計算（円の直径の半分から少し内側に）
  const radius = 120;

  // 各アイテムの角度（ラジアン）
  const radian = (rotation * Math.PI) / 180;

  // 中心からの位置を計算
  const x = radius * Math.cos(radian - Math.PI / 2);
  const y = radius * Math.sin(radian - Math.PI / 2);

  return {
    transform: `translate(${x}px, ${y}px)`,
    '--item-rotation': `${rotation + 90}deg`,
  };
};
</script>

<style scoped>
.roulette-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto 20px;
}

.roulette-arrow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid red;
  z-index: 2;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
}

.roulette {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid #ccc;
  transition: transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  transform-origin: center;
  background: #fff;
}

.roulette::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
  background: var(--roulette-gradient);
}

.roulette-item {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 4px;
  white-space: nowrap;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transform: var(--transform) rotate(var(--item-rotation));
  margin: -12px 0 0 -20px;
}

.q-btn {
  z-index: 10; /* ボタンが他の要素の下に隠れないように */
}
</style>
