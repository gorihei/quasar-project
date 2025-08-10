<template>
  <q-layout view="lHh Lpr lFf" class="safe-areas">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title @click="router.push('/')">パーティーツール</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
