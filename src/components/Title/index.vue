<template>
  <div class="commonTitle">
    <strong>{{title}}</strong>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.commonTitle {
  width: 100%;
  font-size: 20px;
  color: #006587;
  margin-bottom: 20px;
}
</style>