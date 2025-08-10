<template>
  <q-page padding>
    <div class="column q-gutter-md">
      <q-card clickable @click="$router.push({ name: 'roulette' })">
        <q-card-section>
          <div class="text-h6">ルーレット</div>
          <div class="text-caption">名前・景品・番号などを回して1発決定</div>
        </q-card-section>
      </q-card>
      <q-card clickable @click="$router.push({ name: 'bingo-host' })">
        <q-card-section>
          <div class="text-h6">ビンゴ（司会）</div>
          <div class="text-caption">番号抽選と履歴表示</div>
        </q-card-section>
      </q-card>
      <q-card clickable @click="$router.push({ name: 'bingo-card' })">
        <q-card-section>
          <div class="text-h6">ビンゴ（カード）</div>
          <div class="text-caption">自分のカードで穴あけ＆ビンゴ判定</div>
        </q-card-section>
      </q-card>
      <q-card clickable @click="$router.push({ name: 'amida' })">
        <q-card-section>
          <div class="text-h6">あみだくじ</div>
          <div class="text-caption">参加者と結果を一括で即決定</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
